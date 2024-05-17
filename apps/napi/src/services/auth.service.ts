import jwt from 'jsonwebtoken'
import { env } from '../env.js';
import { users } from '@db/schema/users.js';
class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

class TokenExpiredError extends AuthError {
    constructor() {
        super('Token expired');
        this.name = 'TokenExpiredError';
    }
}

class InvalidTokenError extends AuthError {
    constructor() {
        super('Invalid token');
        this.name = 'InvalidTokenError';
    }
}

export type JWTPayload = {
    userId: number;
    role: typeof users.$inferInsert['role'];
    image: string | null;
    name: string;
}

class AuthService {
    private secretKey: string;
    private jwtTokenExpiry: string;
    private refreshTokenExpiry: string;

    constructor() {
        this.secretKey = env.JWT_SECRET_KEY;
        this.jwtTokenExpiry = env.JWT_TOKEN_EXPIRY;
        this.refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY;
    }

    generateJwtToken(payload: JWTPayload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.jwtTokenExpiry });
    }

    generateRefreshToken(payload: JWTPayload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.refreshTokenExpiry });
    }

    async validateJwtToken(token: string) {
        try {
            const payload = jwt.verify(token, this.secretKey) as JWTPayload;
            return payload;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenError();
            }
            throw error;
        }
    }

    async validateRefreshToken(token: string) {
        try {
            const payload = jwt.verify(token, this.secretKey) as JWTPayload;
            return payload;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenError();
            }
            throw error;
        }
    }

    async refreshToken(refreshToken: string) {
        const payload = await this.validateRefreshToken(refreshToken);
        const userId = payload.userId;
        const role = payload.role;
        const image = payload.image;
        const name = payload.name;
        const newPayload: JWTPayload = {
            userId,
            role,
            image,
            name
        }
        return this.generateJwtToken(newPayload);
    }

    async jwtPayload(token: string) {
        const payload = await this.validateJwtToken(token);
        return payload;
    }
}

export const authService = new AuthService();