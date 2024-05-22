import { hc } from "hono/client";
import { BackendRoutes } from '../../napi/src/index'
import { getSession } from "@/app/auth";

const BACKEND_URL = "http://localhost:3001/";


export const api = hc<BackendRoutes>(BACKEND_URL, {
    async headers() {
        const accessToken = await getSession();
        return {
            Authorization: `Bearer ${accessToken.accessToken}`,
        };
    },
})
