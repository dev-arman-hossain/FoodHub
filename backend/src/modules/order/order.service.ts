import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

interface ICreateOrderPayload {
    deliveryAddress: string;
    items: { mealId: string; quantity: number }[];
}

const createOrder = async (customerId: string, payload: ICreateOrderPayload) => {
    const { deliveryAddress, items } = payload;

    if (!items || items.length === 0) {
        throw new AppError(status.BAD_REQUEST as number, 'Order must have at least one item.');
    }

    // Fetch all meals
    const meals = await prisma.meal.findMany({
        where: { id: { in: items.map((i) => i.mealId) }, isAvailable: true },
        include: { provider: true },
    });

    if (meals.length !== items.length) {
        throw new AppError(status.BAD_REQUEST as number, 'One or more meals are unavailable or not found.');
    }

    // All items must be from the same provider
    const providerIds = [...new Set(meals.map((m) => m.providerId))];
    if (providerIds.length > 1) {
        throw new AppError(status.BAD_REQUEST as number, 'All items in an order must be from the same provider.');
    }

    const providerId = providerIds[0];

    let totalAmount = 0;
    const orderItems = items.map((item) => {
        const meal = meals.find((m) => m.id === item.mealId)!;
        const subtotal = Number(meal.price) * item.quantity;
        totalAmount += subtotal;
        return {
            mealId: meal.id,
            mealName: meal.name,
            price: meal.price,
            quantity: item.quantity,
        };
    });

    const order = await prisma.order.create({
        data: {
            customerId,
            providerId,
            deliveryAddress,
            totalAmount,
            status: 'PLACED',
            items: { create: orderItems },
        },
        include: { items: true, provider: { select: { businessName: true } } },
    });

    return order;
};

const getMyOrders = async (customerId: string) => {
    return prisma.order.findMany({
        where: { customerId },
        include: {
            items: true,
            provider: { select: { businessName: true, logoUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getOrderById = async (orderId: string, userId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { meal: { select: { imageUrl: true } } } },
            provider: { select: { businessName: true, address: true, logoUrl: true } },
            reviews: { select: { mealId: true, rating: true, comment: true } },
        },
    });

    if (!order) throw new AppError(status.NOT_FOUND as number, 'Order not found.');
    if (order.customerId !== userId) throw new AppError(status.FORBIDDEN as number, 'Access denied.');

    return order;
};

const cancelOrder = async (orderId: string, customerId: string) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError(status.NOT_FOUND as number, 'Order not found.');
    if (order.customerId !== customerId) throw new AppError(status.FORBIDDEN as number, 'Access denied.');
    if (order.status !== 'PLACED') {
        throw new AppError(status.BAD_REQUEST as number, 'Only orders with PLACED status can be cancelled.');
    }

    return prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
};

// Provider functions
const getProviderOrders = async (userId: string) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    return prisma.order.findMany({
        where: { providerId: profile.id },
        include: {
            items: true,
            customer: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const updateOrderStatus = async (
    orderId: string,
    userId: string,
    newStatus: 'PREPARING' | 'READY' | 'DELIVERED',
) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError(status.NOT_FOUND as number, 'Order not found.');
    if (order.providerId !== profile.id) throw new AppError(status.FORBIDDEN as number, 'Access denied.');

    // Validate transitions
    const validTransitions: Record<string, string[]> = {
        PLACED: ['PREPARING'],
        PREPARING: ['READY'],
        READY: ['DELIVERED'],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
        throw new AppError(
            status.BAD_REQUEST as number,
            `Cannot transition from ${order.status} to ${newStatus}.`,
        );
    }

    return prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
};

const getCustomerStats = async (customerId: string) => {
    const [totalOrders, spentData, activeOrders, recentOrders, statusDistribution] = await Promise.all([
        prisma.order.count({ where: { customerId } }),
        prisma.order.aggregate({
            where: { customerId, status: 'DELIVERED' },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({
            where: { customerId, status: { in: ['PLACED', 'PREPARING', 'READY'] } },
        }),
        prisma.order.findMany({
            where: { customerId },
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { provider: { select: { businessName: true, logoUrl: true } } },
        }),
        prisma.order.groupBy({
            by: ['status'],
            where: { customerId },
            _count: { id: true },
        }),
    ]);

    return {
        totals: {
            totalOrders,
            totalSpent: Number(spentData._sum.totalAmount || 0),
            activeOrders,
        },
        recentOrders,
        statusDistribution: statusDistribution.map(s => ({
            name: s.status,
            value: s._count.id,
        })),
    };
};

export const OrderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getProviderOrders,
    updateOrderStatus,
    getCustomerStats,
};
