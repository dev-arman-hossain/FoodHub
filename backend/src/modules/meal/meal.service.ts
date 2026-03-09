import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { cloudinaryUtils } from '../../utils/cloudinary';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

interface IMealFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
}

const getAllMeals = async (filters: IMealFilters) => {
    const { categoryId, minPrice, maxPrice, search, page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isAvailable: true };

    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [meals, total] = await Promise.all([
        prisma.meal.findMany({
            where,
            skip,
            take: limit,
            include: {
                category: true,
                provider: { select: { businessName: true, address: true } },
                reviews: { select: { rating: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.meal.count({ where }),
    ]);

    const mealsWithRating = meals.map((meal) => {
        const avgRating = meal.reviews.length
            ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / meal.reviews.length
            : null;
        return { ...meal, avgRating, reviewCount: meal.reviews.length };
    });

    return {
        meals: mealsWithRating,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getMealById = async (id: string) => {
    const meal = await prisma.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: { select: { businessName: true, address: true, logoUrl: true, description: true } },
            reviews: {
                include: { customer: { select: { name: true, id: true } } },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!meal) throw new AppError(status.NOT_FOUND as number, 'Meal not found.');

    const avgRating = meal.reviews.length
        ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / meal.reviews.length
        : null;

    return { ...meal, avgRating, reviewCount: meal.reviews.length };
};

const getAllProviders = async () => {
    return prisma.providerProfile.findMany({
        where: { user: { status: 'ACTIVE' } },
        include: {
            user: { select: { name: true, email: true } },
            meals: { where: { isAvailable: true }, take: 6 },
        },
    });
};

const getProviderById = async (id: string) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true } },
            meals: {
                where: { isAvailable: true },
                include: { category: true, reviews: { select: { rating: true } } },
            },
        },
    });

    if (!provider) throw new AppError(status.NOT_FOUND as number, 'Provider not found.');
    return provider;
};

// Provider-only functions
const addMeal = async (providerId: string, payload: {
    categoryId: string;
    name: string;
    description?: string;
    price: string | number;
    imageUrl?: string;
}, file?: Express.Multer.File) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId: providerId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) throw new AppError(status.NOT_FOUND as number, 'Category not found.');

    let imageUrl = payload.imageUrl || null;

    if (file) {
        imageUrl = await cloudinaryUtils.uploadImage(file.path, 'meals');
        await unlinkAsync(file.path);
    }

    return prisma.meal.create({
        data: {
            providerId: profile.id,
            categoryId: payload.categoryId,
            name: payload.name,
            description: payload.description || null,
            price: Number(payload.price),
            imageUrl,
        },
        include: { category: true },
    });
};

const updateMeal = async (mealId: string, userId: string, payload: {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: string | number;
    imageUrl?: string;
    isAvailable?: string | boolean;
}, file?: Express.Multer.File) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    if (!meal) throw new AppError(status.NOT_FOUND as number, 'Meal not found.');
    if (meal.providerId !== profile.id) {
        throw new AppError(status.FORBIDDEN as number, 'You can only edit your own meals.');
    }

    const updateData: any = { ...payload };

    if (payload.price) updateData.price = Number(payload.price);
    if (payload.isAvailable !== undefined) {
        updateData.isAvailable = payload.isAvailable === 'true' || payload.isAvailable === true;
    }

    if (file) {
        // Delete old image if exists
        if (meal.imageUrl) {
            await cloudinaryUtils.deleteImageByUrl(meal.imageUrl);
        }
        updateData.imageUrl = await cloudinaryUtils.uploadImage(file.path, 'meals');
        await unlinkAsync(file.path);
    }

    return prisma.meal.update({ where: { id: mealId }, data: updateData, include: { category: true } });
};

const deleteMeal = async (mealId: string, userId: string) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    if (!meal) throw new AppError(status.NOT_FOUND as number, 'Meal not found.');
    if (meal.providerId !== profile.id) {
        throw new AppError(status.FORBIDDEN as number, 'You can only delete your own meals.');
    }

    if (meal.imageUrl) {
        await cloudinaryUtils.deleteImageByUrl(meal.imageUrl);
    }

    return prisma.meal.delete({ where: { id: mealId } });
};

export const MealService = {
    getAllMeals,
    getMealById,
    getAllProviders,
    getProviderById,
    addMeal,
    updateMeal,
    deleteMeal,
};
