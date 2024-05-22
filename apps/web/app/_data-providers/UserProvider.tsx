'use client';
import { api } from "@/client";
import { createSafeContext } from "@/lib/createSafeContext";
import { ReactNode } from "react";
import { useSession } from "../auth/useSession";
import useSWR from "swr";
import type { InferResponseType } from "hono";
import { SessionType } from "../auth/types";

type ClientSession = {
    user: InferResponseType<typeof api.secured.whoami.$get> | null;
    session: SessionType | null;
}

const [UserSafeProvider, useUser] = createSafeContext<ClientSession>();

function UserProvider({ children }: { children: ReactNode }) {
    const { session } = useSession();
    const user = useSWR(session?.accessToken, async () => (await api.secured.whoami.$get()).json());
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