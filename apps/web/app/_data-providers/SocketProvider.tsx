'use client'
import { Socket, io } from "socket.io-client";
import { ReactNode, useCallback, useEffect, useMemo, useReducer } from "react";
import { produce } from "immer";
import { createSafeContext } from "@/utils/create-safe-context";
import { env } from "@/env";
import { useSession } from 'next-auth/react';

type SocketState = {
    state: "stale" | "connected" | "retrying" | "disconnected" | "error";
    reason: string | null;
    reconnectAttempts: number | null;
};

type SocketContextData = {
    __socket: Socket;
    state: SocketState;
};

type ActionType =
    | {
        type: "RECONNECT_ATTEMPT";
        payload: number;
    }
    | {
        type: "CONNECTED";
    }
    | {
        type: "DISCONNECTED";
        payload: string;
    };

function socketReducer(state: SocketState, action: ActionType) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "RECONNECT_ATTEMPT":
                draft.state = "retrying";
                draft.reconnectAttempts = action.payload;
                break;
            case "CONNECTED":
                draft.state = "connected";
                break;
            case "DISCONNECTED":
                draft.state = "disconnected";
                draft.reason = action.payload;
                break;
        }
    });
}

const [SocketSafeProvider, useSocket] = createSafeContext<SocketContextData>("");

const socket = io(env.NEXT_PUBLIC_DIRECT_BACKEND_URL, {
    transports: ["websocket"],
});

function SocketProvider({ children }: { children: ReactNode }) {
    const { data } = useSession()
    const [state, dispatch] = useReducer(socketReducer, {
        state: "stale",
        reason: null,
        reconnectAttempts: null,
    });

    const handleConnect = useCallback(() => {
        socket.emit("alive-connection", { userId: data?.user.id })
        dispatch({ type: "CONNECTED" });
    }, [data, socket]);

    const handleDisconnect = useCallback((reason: string) => {
        socket.emit("dead-connection", { userId: data?.user.id })
        dispatch({ type: "DISCONNECTED", payload: reason });
    }, [data, socket]);

    const handleReconnectAttempt = useCallback((attempt: number) => {
        dispatch({ type: "RECONNECT_ATTEMPT", payload: attempt });
    }, []);

    useEffect(() => {
        // Fired upon a successful connection.
        socket.on("connect", handleConnect);
        // Fired upon a disconnection.
        socket.on("disconnect", handleDisconnect);
        // Fired upon an attempt to reconnect.
        socket.on("reconnect_attempt", handleReconnectAttempt);
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("reconnect_attempt", handleReconnectAttempt);
        };
    }, [socket, handleConnect, handleDisconnect, handleReconnectAttempt]);

    return (
        <SocketSafeProvider value={{ __socket: socket, state }}>
            {children}
        </SocketSafeProvider>
    );
}

export { useSocket, SocketProvider };