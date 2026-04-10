import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const addReview = async (
    customerId: string,
    mealId: string,
    payload: { orderId?: string; rating: number; comment?: string },
) => {
    let { orderId, rating, comment } = payload;

    if (rating < 1 || rating > 5) {
        throw new AppError(status.BAD_REQUEST as number, 'Rating must be between 1 and 5.');
    }

    // Verify order exists, belongs to this customer, and is DELIVERED
    let order;
    if (orderId) {
        order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) throw new AppError(status.NOT_FOUND as number, 'Order not found.');
        if (order.customerId !== customerId) throw new AppError(status.FORBIDDEN as number, 'Access denied.');
        if (order.status !== 'DELIVERED') {
            throw new AppError(status.BAD_REQUEST as number, 'You can only review meals from delivered orders.');
        }
    } else {
        // Automatically find a delivered order for this user containing this meal
        order = await prisma.order.findFirst({
            where: {
                customerId,
                status: 'DELIVERED',
                items: { some: { mealId } },
            },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!order) {
            throw new AppError(status.BAD_REQUEST as number, 'You must have a delivered order for this meal to leave a review.');
        }
        orderId = order.id;
    }

    // Verify meal is part of this order
    const mealInOrder = order.items.some((item) => item.mealId === mealId);
    if (!mealInOrder) {
        throw new AppError(status.BAD_REQUEST as number, 'This meal is not part of the specified order.');
    }

    // Check for duplicate review
    const existingReview = await prisma.review.findUnique({
        where: { customerId_mealId: { customerId, mealId } },
    });
    if (existingReview) {
        throw new AppError(status.CONFLICT as number, 'You have already reviewed this meal.');
    }

    return prisma.$transaction(async (tx) => {
        // Create review
        const review = await tx.review.create({
            data: { customerId, mealId, orderId, rating, comment: comment || null },
            include: { customer: { select: { name: true } } },
        });

        // Recalculate meal stats
        const aggregates = await tx.review.aggregate({
            where: { mealId },
            _avg: { rating: true },
            _count: { id: true },
        });

        // Update meal
        await tx.meal.update({
            where: { id: mealId },
            data: {
                avgRating: aggregates._avg.rating || 0,
                reviewCount: aggregates._count.id,
            },
        });

        return review;
    });
};

const getMealReviews = async (mealId: string) => {
    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    if (!meal) throw new AppError(status.NOT_FOUND as number, 'Meal not found.');

    return prisma.review.findMany({
        where: { mealId },
        include: { customer: { select: { name: true, id: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const ReviewService = {
    addReview,
    getMealReviews,
};
