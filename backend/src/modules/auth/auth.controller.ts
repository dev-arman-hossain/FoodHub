import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { tokenUtils } from '../../utils/token';
import { AuthService } from './auth.service';
import AppError from '../../errors/AppError';

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

    sendResponse(res, {
        httpStatusCode: status.CREATED as number,
        success: true,
        message: 'User registered successfully',
        data: { user: result.user, accessToken: result.accessToken },
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'User logged in successfully',
        data: { user: result.user, accessToken: result.accessToken },
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.getMe(req.user.userId);

    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'User profile fetched successfully',
        data: result,
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    tokenUtils.clearAuthCookies(res);

    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'Logged out successfully',
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        throw new AppError(status.UNAUTHORIZED as number, 'Refresh token is missing.');
    }

    const result = await AuthService.refreshToken(token);
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken: result.accessToken },
    });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.googleLogin(req.body);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'Google login successful.',
        data: { user: result.user, accessToken: result.accessToken },
    });
});

export const AuthController = {
    register,
    login,
    getMe,
    logout,
    refreshToken,
    googleLogin,
};
