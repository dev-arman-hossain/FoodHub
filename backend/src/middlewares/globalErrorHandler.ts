/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { envVars } from '../config/env';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        console.error('Error from Global Error Handler', err);
    }

    let statusCode: number = status.INTERNAL_SERVER_ERROR as number;
    let message = 'Internal Server Error';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorSources: { path: string; message: string }[] = [];

    if (err instanceof ZodError) {
        statusCode = status.BAD_REQUEST as number;
        message = 'Validation Error';
        errorSources = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{ path: '', message: err.message }];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [{ path: '', message: err.message }];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? err?.stack : undefined,
    });
};
