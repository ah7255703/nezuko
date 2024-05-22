export async function getSession() {
    const resp = await fetch("/api/auth");
    return await resp.json() as { accessToken: string, refreshToken: string }
}
