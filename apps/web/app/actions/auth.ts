"use server";

import { action } from "./safe-action";
import { z } from "zod";
import { cookies } from "next/headers";
import { serverApiReq } from "@/client/server-req";

const schema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const loginUser = action.schema(schema)
    .action(async ({ parsedInput }) => {
        const resp = await serverApiReq.credentials.login.$post({ json: parsedInput });
        if (resp.ok) {
            const data = await resp.json()
            cookies().set("accessToken", data.token)
            cookies().set("refreshToken", data.token)
            return {
                success: true,
                data,
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