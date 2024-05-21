import bcrypt from 'bcrypt';
import { profile, resetPasswordToken, updateUserSchema, users, verifyEmailToken } from '@db/schema/index.js';
import { db } from '@db/index.js';
import _ from 'lodash';
import { eq, sql } from 'drizzle-orm';
import z from 'zod';
import { mailService } from './email.service';
import { render } from '@react-email/render';
import VerifyEmail from '../emails/test';

type CreateUser = {
    name: string;
    email: string;
    password: string;
}

export class TokenExpired extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TokenExpired';
    }
}
export class InvalidResetPasswordToken extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidResetPasswordToken';
    }
}
class UserService {
    async createUser(user: CreateUser) {
        const passwordHash = await bcrypt.hash(user.password, 10);

        const query = await db.insert(users).values({
            name: user.name,
            email: user.email,
            password: passwordHash,
            creationMethod: "email-password",
        }).returning().execute();

        const newUser = query.at(0);
        if (!newUser) {
            throw new Error('User not created');
        }
        const userProfile = await db.insert(profile).values({
            userId: newUser.id,
        })
        if (newUser.creationMethod === 'email-password' || newUser.creationMethod === 'email-only') {
            this.sendVerificationEmail({
                email: newUser.email,
                name: newUser.name,
                userId: newUser.id,
            })
        }
        return _.omit(newUser, ['password']);
    }
    async getUser(email: string, password: string) {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
            with: {
                profile: true
            }
        })
        if (!user) {
            return null;
        }
        const isValid = bcrypt.compare(password, user.password!); // TODO: check if password is null

        if (!isValid) {
            return null;
        }

        return _.omit(user, ['password']);
    }
    async updateUser(id: number, user: z.infer<typeof updateUserSchema>) {
        const validatedUser = await updateUserSchema.parseAsync(user);
        return db.update(users).set(validatedUser).where(eq(users.id, id)).execute();
    }
    async getUserByEmail(email: string) {
        const query = await db.select().from(users).where(eq(users.email, email)).limit(1).execute();
        const user = query.at(0);
        if (!user) {
            return null;
        }
        return _.omit(user, ['password']);
    }
    async getUserByResetPasswordToken(token: string) {
        const query = await db.select().from(resetPasswordToken).where(eq(resetPasswordToken.token, token)).limit(1).execute();
        const user = query.at(0);
        if (!user) {
            return null;
        }
        return _.omit(user, ['password']);
    }
    async updateUserPasswordByResetPasswordToken(token: string, password: string) {
        if (await this.isResetPasswordTokenExpired(token)) {
            throw new TokenExpired('Reset password token is expired');
        }
        const userToken = await db.query.resetPasswordToken.findFirst({
            where: eq(resetPasswordToken.token, token),
            with: {
                user: true
            }
        })
        if (!userToken) {
            throw new InvalidResetPasswordToken('Invalid reset password token');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const queryResult = await db.update(users).set({ password: passwordHash }).where(eq(users.id, userToken.userId)).execute();
        if (queryResult.rowCount === 0) {
            throw new InvalidResetPasswordToken('Invalid reset password token');
        }
        await db.delete(resetPasswordToken).where(eq(resetPasswordToken.id, userToken.id)).execute();
        return true;
    }

    async isResetPasswordTokenExpired(token: string) {
        const userToken = await db.query.resetPasswordToken.findFirst({
            where: eq(resetPasswordToken.token, token),
        })
        if (!userToken) {
            return true;
        }
        if (userToken.expiresAt < new Date()) {
            return true;
        }
        return false;
    }

    async createResetPasswordToken(userId: number) {
        const query = await db.insert(resetPasswordToken).values({
            userId,
        }).returning().execute();
        return query.at(0);
    }
    async verifyEmail(token: string) {
        const c = await db.query.verifyEmailToken.findFirst({
            where: eq(verifyEmailToken.token, token),
            with: {
                user: true
            }
        })
        if (!c) {
            return false;
        }
        await db.update(users).set({
            verifiedEmail: true,
            verifiedEmailAt: sql`now()`
        }).where(eq(users.id, c.userId)).execute();
        await db.delete(verifyEmailToken).where(eq(verifyEmailToken.id, c.id)).execute();
        return true;
    }
    async sendVerificationEmail({ email, userId, name }: {
        userId: number,
        email: string,
        name: string;
    }) {
        let query = await db.insert(verifyEmailToken).values({
            userId,
        }).returning().execute();
        let token = query.at(0);
        if (!token) {
            throw Error("Failed to create token")
        }
        const verifyUrl = "http://localhost:3000/api/auth/verify-email?token=" + token.token;
        const emailString = render(VerifyEmail({
            name,
            verificationUrl: verifyUrl
        }))
        mailService.ts.sendMail({
            html: emailString,
            from: 'wmequlfp@mailosaur.net',
            to: email,
            subject: 'hello world',
        })
    }
}

export const userService = new UserService();