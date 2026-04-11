import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(req.user.userId, req.body);
    sendResponse(res, { httpStatusCode: status.CREATED as number, success: true, message: 'Order placed successfully', data: result });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getMyOrders(req.user.userId);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Orders fetched', data: result });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getOrderById(req.params.id as string, req.user.userId);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Order fetched', data: result });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.cancelOrder(req.params.id as string, req.user.userId);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Order cancelled', data: result });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getProviderOrders(req.user.userId);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Provider orders fetched', data: result });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.updateOrderStatus(
        req.params.id as string,
        req.user.userId,
        req.body.status,
    );
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Order status updated', data: result });
});

const getCustomerStats = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getCustomerStats(req.user.userId);
    sendResponse(res, { 
        httpStatusCode: status.OK as number, 
        success: true, 
        message: 'Customer statistics fetched', 
        data: result 
    });
});

export const OrderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getProviderOrders,
    updateOrderStatus,
    getCustomerStats,
};
