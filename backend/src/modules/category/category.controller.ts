import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Categories fetched', data: result });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req.body);
    sendResponse(res, { httpStatusCode: status.CREATED as number, success: true, message: 'Category created', data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.updateCategory(req.params.id as string, req.body);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Category updated', data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await CategoryService.deleteCategory(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Category deleted' });
});

export const CategoryController = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
