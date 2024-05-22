import { cookies } from "next/headers"

export async function getServerSession() {
    return {
        accessToken: cookies().get("accessToken")?.value,
        refreshToken: cookies().get("refreshToken")?.value,
        isAuthenticated: cookies().get("accessToken") !== undefined
    }
}