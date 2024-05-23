import { hc } from "hono/client";
import { BackendRoutes } from '../../napi/src/index'
import { getSession } from "@/app/auth";

const BACKEND_URL = "http://localhost:3001/";

export const clientApiReq = hc<BackendRoutes>(BACKEND_URL, {
    async headers() {
        const accessToken = await getSession();
        return {
            Authorization: `Bearer ${accessToken.accessToken}`,
        };
    },
    fetch(input, requestInit, Env, executionCtx) {
        return fetch(input, requestInit);
    },
})
