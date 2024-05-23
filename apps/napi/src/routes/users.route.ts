import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import { InvalidResetPasswordToken, TokenExpired, userService } from "../services/user.service.js";
import { authService } from "../services/auth.service.js";
import _ from "lodash";
import { Env } from "../types.js";
import ms from 'ms'

const route = new Hono<Env>()
    .post("/register",
        zValidator("json", z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
        })),
        async (ctx) => {
            const { name, email, password } = ctx.req.valid('json');
            const user = await userService.createUser({
                email,
                password,
                name,
            });
            return ctx.json(user)
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
            email: user.email,
            allowedResources: "all"
        });

        const refreshToken = authService.generateRefreshToken({
            userId: user.id,
            role: user.role,
            image: user.profile?.image ?? null,
            name: user.name,
            email: user.email,
            allowedResources: "all"
        });

        return ctx.json({
            accessToken: {
                value: jwtToken,
                expires: ms(authService.jwtTokenExpiry)
            },
            refreshToken: {
                value: refreshToken,
                expires: ms(authService.refreshTokenExpiry)
            },
        });
    })

    .post("/reset-password",
        zValidator("json", z.object({
            email: z.string().email(),
        })), async (ctx) => {
            const { email } = ctx.req.valid('json');
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return ctx.json({
                    error: 'Invalid email',
                }, 401);
            }
            const resetPasswordToken = await userService.createResetPasswordToken(user.id);
            return ctx.json({
                message: 'Reset password token created',
                token: _.omit(resetPasswordToken, ['token', "userId", "id"]),
            });
        })

    .post("/validate-email", zValidator("json", z.object({
        token: z.string(),
    })), async (ctx) => {
        const { token } = ctx.req.valid('json');
        const validate = await userService.verifyEmail(token);

        if (!validate) {
            return ctx.json({
                error: 'Invalid token',
            }, 401);
        }

        return ctx.json({
            message: 'Email verified',
        });
    }
    )

    .post("/reset-password/confirm",
        zValidator("json", z.object({
            token: z.string(),
            password: z.string(),
        }))
        , async (ctx) => {
            const { token, password } = ctx.req.valid('json');
            try {
                const d = await userService.updateUserPasswordByResetPasswordToken(token, password);
                return ctx.json(d);
            } catch (error) {
                if (error instanceof TokenExpired) {
                    return ctx.json({
                        error: 'Reset password token is expired',
                    }, 401);
                } else if (error instanceof InvalidResetPasswordToken) {
                    return ctx.json({
                        error: 'Invalid reset password token',
                    }, 401);
                }
            }

        })

    .post("token/refresh", zValidator("json", z.object({
        refresh: z.string(),
    })), async (ctx) => {
        const { refresh } = ctx.req.valid('json');
        const token = await authService.refreshToken(refresh);
        return ctx.json({
            accessToken: token,
        });
    })
export default route;