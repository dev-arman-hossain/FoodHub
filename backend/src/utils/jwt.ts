import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { envVars } from '../config/env';

export interface IJwtPayload {
    userId: string;
    role: string;
    email: string;
}

const signToken = (payload: IJwtPayload, secret: string, expiresIn: string): string => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: string): { success: boolean; data?: JwtPayload } => {
    try {
        const data = jwt.verify(token, secret) as JwtPayload;
        return { success: true, data };
    } catch {
        return { success: false };
    }
};

const getAccessToken = (payload: IJwtPayload): string => {
    return signToken(payload, envVars.ACCESS_TOKEN_SECRET, envVars.ACCESS_TOKEN_EXPIRES_IN);
};

const getRefreshToken = (payload: IJwtPayload): string => {
    return signToken(payload, envVars.REFRESH_TOKEN_SECRET, envVars.REFRESH_TOKEN_EXPIRES_IN);
};

export const jwtUtils = {
    signToken,
    verifyToken,
    getAccessToken,
    getRefreshToken,
};
