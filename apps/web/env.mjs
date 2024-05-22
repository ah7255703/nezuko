/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
    },
    client: {
        NEXT_PUBLIC_DIRECT_BACKEND_URL: z.string().url()
    },
    runtimeEnv: {
        NEXT_PUBLIC_DIRECT_BACKEND_URL: process.env.NEXT_PUBLIC_DIRECT_BACKEND_URL
    }
});