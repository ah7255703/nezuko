import jwt from 'jsonwebtoken'
import { env } from '../env.js';
import { user } from '@db/schema';

class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export class TokenExpiredError extends AuthError {
    constructor() {
        super('Token expired');
        this.name = 'TokenExpiredError';
    }
}

export class InvalidTokenError extends AuthError {
    constructor() {
        super('Invalid token');
        this.name = 'InvalidTokenError';
    }
}

export type JWTPayload = {
    userId: typeof user.$inferSelect['id'];
    role: typeof user.$inferInsert['role'];
    image: string | null;
    name: string;
    email: string;
    allowedResources: string[] | "all"
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
        return this.generateJwtToken(payload);
    }

    async jwtPayload(token: string) {
        const payload = await this.validateJwtToken(token);
        return payload;
    }
}

export const authService = new AuthService();