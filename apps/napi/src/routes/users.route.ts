import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import { userService } from "../services/user.service.js";
import { authService } from "../services/auth.service.js";

const route = new Hono().basePath('/credentials')
    .post("/register", async (ctx) => {
    })
    .post("/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string(),
    })), async (ctx) => {
        const { email, password } = ctx.req.valid('json');
        const user = await userService.getUser(email, password);
        if (!user) {
            return ctx.json({
                error: 'Invalid email or password',
            }, 401);
        }

        const jwtToken = authService.generateJwtToken({
            userId: user.id,
            role: user.role,
            image: user.profile?.image ?? null,
            name: user.name,
        });

        const refreshToken = authService.generateRefreshToken({
            userId: user.id,
            role: user.role,
            image: user.profile?.image ?? null,
            name: user.name,
        });

        return ctx.json({
            token: jwtToken,
            refresh: refreshToken,
        });
    })
    .post("/reset-password", async (ctx) => {
    })
    .post("/reset-password/confirm", async (ctx) => {
    })
export default route;