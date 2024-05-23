"use server";

import { action } from "./safe-action";
import { z } from "zod";
import { cookies } from "next/headers";
import { serverApiReq } from "@/client/server-req";
import { getServerSession } from "../auth/getServerSession";

const schema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const loginUser = action.schema(schema)
    .action(async ({ parsedInput }) => {
        const resp = await serverApiReq.credentials.login.$post({ json: parsedInput });
        if (resp.ok) {
            const { accessToken, refreshToken } = await resp.json()
            cookies().set("accessToken", accessToken.value, {
                maxAge: accessToken.expires
            })
            cookies().set("refreshToken", refreshToken.value, {
                maxAge: refreshToken.expires
            })
            return {
                success: true,
                data: {
                    accessToken,
                    refreshToken
                }
            }
        }
        return {
            success: false,
        }
    })

export const logout = action.action(async () => {
    cookies().delete("accessToken")
    cookies().delete("refreshToken")
    return {
        success: true
    }
})

export const refreshToken = action.action(async () => {
    const tokens = await getServerSession();
    if (tokens.refreshToken) {
        const accessToken = await serverApiReq.credentials.token.refresh.$post({ json: { refresh: tokens.refreshToken } });
        if (accessToken.ok) {
            const data = await accessToken.json();
            cookies().set("accessToken", data.accessToken)
            return {
                success: true,
                data,
            }
        }
    }
})