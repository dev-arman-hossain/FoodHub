import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ProviderService } from './provider.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await ProviderService.getDashboardStats(req.user.userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK as number,
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: result,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await ProviderService.updateProfile(req.user.userId, req.body, req.file);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK as number,
        success: true,
        message: 'Provider profile updated successfully',
        data: result,
    });
});

export const ProviderController = {
    getDashboardStats,
    updateProfile,
};
