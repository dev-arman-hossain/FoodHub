import { Response } from 'express';
import ms from 'ms';
import { envVars } from '../config/env';
import { IJwtPayload } from './jwt';
import { jwtUtils } from './jwt';

const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: envVars.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: ms(envVars.ACCESS_TOKEN_EXPIRES_IN as Parameters<typeof ms>[0]),
    });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: envVars.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: ms(envVars.REFRESH_TOKEN_EXPIRES_IN as Parameters<typeof ms>[0]),
    });
};

const clearAuthCookies = (res: Response) => {
    const opts = { httpOnly: true, secure: envVars.NODE_ENV === 'production', sameSite: 'lax' as const };
    res.clearCookie('accessToken', opts);
    res.clearCookie('refreshToken', opts);
};

const generateTokens = (payload: IJwtPayload) => {
    const accessToken = jwtUtils.getAccessToken(payload);
    const refreshToken = jwtUtils.getRefreshToken(payload);
    return { accessToken, refreshToken };
};

export const tokenUtils = {
    setAccessTokenCookie,
    setRefreshTokenCookie,
    clearAuthCookies,
    generateTokens,
};
