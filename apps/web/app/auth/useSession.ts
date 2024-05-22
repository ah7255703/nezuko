"use client";

import { useEffect, useState } from "react";
import { SessionType } from "./types";
import { getSession } from "./getSession";

export function useSession() {
    const [session, setSession] = useState<SessionType | null>(null);
    const [state, setState] = useState<"loading" | "idle" | "failed">("idle");
    useEffect(() => {
        setState("loading");
        async function getAccessToken() {
            try {
                const resp = await getSession();
                setSession(resp);
                setState("idle");
            } catch (e) {
                console.error(e);
                setState("failed");
            }
        }
        getAccessToken();
    }, [])
    console.log("[ClientSession]:", session)
    return {
        session,
        state,
    }
}