'use client';
import { clientApiReq } from "@/client/client-req";
import { createSafeContext } from "@/lib/createSafeContext";
import { ReactNode } from "react";
import { useSession } from "../auth/useSession";
import useSWR from "swr";
import type { InferResponseType } from "hono";
import { SessionType } from "../auth/types";
import { refreshToken } from "../actions/auth";

type ClientSession = {
    user: InferResponseType<typeof clientApiReq.secured.whoami.$get> | null;
    session: SessionType | null;
}

const [UserSafeProvider, useUser] = createSafeContext<ClientSession>();

function UserProvider({ children }: { children: ReactNode }) {
    const { session } = useSession();
    const user = useSWR(session?.accessToken, async () => {
        const req = await clientApiReq.secured.whoami.$get();
        if (req.status === 401) {
            refreshToken({})
        } else {
            return await req.json()
        }
    })
    return <UserSafeProvider
        value={{
            session,
            user: user.data ?? null,
        }}
    >{children}</UserSafeProvider>;
}

export {
    UserProvider,
    useUser,
    type ClientSession
}