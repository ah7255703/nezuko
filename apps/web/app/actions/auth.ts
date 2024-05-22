"use server";

import { api } from "@/client";
import { action } from "./safe-action";
import { z } from "zod";
import { cookies } from "next/headers";

const schema = z.object({
    email: z.string().email(),
    password: z.string()
})

type S = z.infer<typeof schema>;

export const loginUser = action.schema(schema)
    .action(async ({ parsedInput }) => {
        const resp = await api.credentials.login.$post({ json: parsedInput });
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