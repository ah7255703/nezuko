import z from "zod";

const envSchama = z.object({
    PG_DB_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    JWT_SECRET_KEY: z.string(),
    JWT_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
});

export const env = envSchama.parse(process.env);
