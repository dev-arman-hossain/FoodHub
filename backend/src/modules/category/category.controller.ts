import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Categories fetched', data: result });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req.body);
    sendResponse(res, { httpStatusCode: status.CREATED as number, success: true, message: 'Category created', data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Category updated', data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await CategoryService.deleteCategory(req.params.id);
    sendResponse(res, { httpStatusCode: status.OK as number, success: true, message: 'Category deleted' });
});

export const CategoryController = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
