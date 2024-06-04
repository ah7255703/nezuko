'use client'
import { Socket } from "socket.io-client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { produce } from "immer";
import { createSafeContext } from "@/utils/create-safe-context";
import { useUser } from "./UserProvider";
import { socket } from "./socket";

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

function SocketProvider({ children }: { children: ReactNode }) {
    const user = useUser()
    const [state, dispatch] = useReducer(socketReducer, {
        state: "stale",
        reason: null,
        reconnectAttempts: null,
    });

    const handleConnect = useCallback(() => {
        socket.emit("alive-connection", { userId: user?.user?.userId })
        dispatch({ type: "CONNECTED" });
    }, [user, socket]);

    const handleDisconnect = useCallback((reason: string) => {
        socket.emit("dead-connection", { userId: user?.user?.userId })
        dispatch({ type: "DISCONNECTED", payload: reason });
    }, [user, socket]);

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