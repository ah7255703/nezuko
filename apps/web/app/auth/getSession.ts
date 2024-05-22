const BASE_URL = "http://localhost:3000/"

export async function getSession() {
    const resp = await fetch(BASE_URL + "/api/auth");
    return await resp.json() as { accessToken: string, refreshToken: string }
}
