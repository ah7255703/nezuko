import z from "zod";

const envSchama = z.object({
    PG_DB_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchama.parse(process.env);
