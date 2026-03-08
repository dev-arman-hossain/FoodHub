import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const addReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.addReview(req.user.userId, req.params.mealId as string, req.body);
    sendResponse(res, { httpStatusCode: status.CREATED as number, success: true, message: 'Review submitted', data: result });
});

const getMealReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getMealReviews(req.params.mealId as string);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Reviews fetched', data: result });
});

export const ReviewController = { addReview, getMealReviews };
