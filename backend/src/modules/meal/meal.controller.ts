import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { MealService } from './meal.service';
import { jwtUtils } from '../../utils/jwt';
import { envVars } from '../../config/env';

const getAllMeals = catchAsync(async (req: Request, res: Response) => {
    const { categoryId, minPrice, maxPrice, search, sortBy, minRating, isAvailable, page, limit } = req.query;
    const result = await MealService.getAllMeals({
        categoryId: categoryId as string | string[],
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search: search as string,
        sortBy: sortBy as any,
        minRating: minRating ? Number(minRating) : undefined,
        isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 8,
    });
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendResponse(res, {
        httpStatusCode: status.OK as number,
        success: true,
        message: 'Meals fetched successfully',
        data: result.meals,
        meta: result.meta as { page: number; limit: number; total: number; totalPages: number },
    });
});


const getAllProviders = catchAsync(async (req: Request, res: Response) => {
    const result = await MealService.getAllProviders();
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Providers fetched', data: result });
});

const getProviderById = catchAsync(async (req: Request, res: Response) => {
    const result = await MealService.getProviderById(req.params.id as string);
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Provider fetched', data: result });
});

const getMealById = catchAsync(async (req: Request, res: Response) => {
    // Optionally get user for canReview check
    let userId: string | undefined;
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
        const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
        if (verified.success && verified.data) {
            userId = (verified.data as any).userId;
        }
    }

    const result = await MealService.getMealById(req.params.id as string, userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Meal fetched successfully',
        data: result,
    });
});

const addMeal = catchAsync(async (req: Request, res: Response) => {
    const result = await MealService.addMeal(req.user.userId, req.body, req.file);
    sendResponse(res, { httpStatusCode: status.CREATED as number, success: true, message: 'Meal added', data: result });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
    const result = await MealService.updateMeal(req.params.id as string, req.user.userId, req.body, req.file);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Meal updated', data: result });
});

const deleteMeal = catchAsync(async (req: Request, res: Response) => {
    await MealService.deleteMeal(req.params.id as string, req.user.userId);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Meal deleted' });
});

export const MealController = {
    getAllMeals,
    getMealById,
    getAllProviders,
    getProviderById,
    addMeal,
    updateMeal,
    deleteMeal,
};
