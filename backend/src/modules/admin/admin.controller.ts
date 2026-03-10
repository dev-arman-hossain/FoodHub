import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers();
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Users fetched', data: result });
});

const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { status: newStatus } = req.body;
    if (!['ACTIVE', 'SUSPENDED'].includes(newStatus)) {
        throw new AppError(status.BAD_REQUEST as number, "Status must be 'ACTIVE' or 'SUSPENDED'.");
    }
    const result = await AdminService.toggleUserStatus(req.params.id as string, newStatus);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'User status updated', data: result });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllOrders();
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Orders fetched', data: result });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Stats fetched', data: result });
});

export const AdminController = {
    getAllUsers,
    toggleUserStatus,
    getAllOrders,
    getDashboardStats,
};
