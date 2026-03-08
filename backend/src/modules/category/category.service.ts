import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const getAllCategories = async () => {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

const createCategory = async (payload: { name: string; imageUrl?: string }) => {
    const existing = await prisma.category.findUnique({ where: { name: payload.name } });
    if (existing) {
        throw new AppError(status.CONFLICT as number, 'Category with this name already exists.');
    }
    return prisma.category.create({ data: payload });
};

const updateCategory = async (id: string, payload: { name?: string; imageUrl?: string }) => {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) throw new AppError(status.NOT_FOUND as number, 'Category not found.');
    return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) throw new AppError(status.NOT_FOUND as number, 'Category not found.');
    return prisma.category.delete({ where: { id } });
};

export const CategoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
