import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { envVars } from '../config/env';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { jwtUtils } from '../utils/jwt';

export const checkAuth = (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.cookies?.accessToken;

            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED as number, 'Unauthorized: No access token provided.');
            }

            const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

            if (!verified.success || !verified.data) {
                throw new AppError(status.UNAUTHORIZED as number, 'Unauthorized: Invalid or expired token.');
            }

            const tokenData = verified.data;

            // Check user still exists and is active
            const user = await prisma.user.findUnique({
                where: { id: tokenData['userId'] as string },
            });

            if (!user) {
                throw new AppError(status.UNAUTHORIZED as number, 'Unauthorized: User not found.');
            }

            if (user.status === 'SUSPENDED') {
                throw new AppError(status.FORBIDDEN as number, 'Forbidden: Your account has been suspended.');
            }

            if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                throw new AppError(
                    status.FORBIDDEN as number,
                    'Forbidden: You do not have permission to access this resource.',
                );
            }

            req.user = {
                userId: user.id,
                role: user.role,
                email: user.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
