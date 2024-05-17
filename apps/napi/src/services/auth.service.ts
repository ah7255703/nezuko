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
    secretKey: string;
    jwtTokenExpiry: string;
    refreshTokenExpiry: string;

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
}

export const authService = new AuthService();