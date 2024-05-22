import { hc } from "hono/client";
import { BackendRoutes } from '../../napi/src/index'
import { getServerSession } from "@/app/auth/getServerSession";

const BACKEND_URL = "http://localhost:3001/";

async function getAccessToken() {
    return getServerSession()
}
export const serverApiReq = hc<BackendRoutes>(BACKEND_URL, {
    async headers() {
        const accessToken = await getAccessToken();
        return {
            Authorization: `Bearer ${accessToken.accessToken}`,
        };
    },
})
