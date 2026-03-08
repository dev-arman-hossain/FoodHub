import { prisma } from '../../lib/prisma';

const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const toggleUserStatus = async (userId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    return prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
};

const getAllOrders = async () => {
    return prisma.order.findMany({
        include: {
            customer: { select: { name: true, email: true } },
            provider: { select: { businessName: true } },
            items: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getDashboardStats = async () => {
    const [totalUsers, totalProviders, totalOrders, totalRevenue] = await Promise.all([
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'PROVIDER' } }),
        prisma.order.count(),
        prisma.order.aggregate({
            where: { status: 'DELIVERED' },
            _sum: { totalAmount: true },
        }),
    ]);

    return {
        totalUsers,
        totalProviders,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
};

export const AdminService = {
    getAllUsers,
    toggleUserStatus,
    getAllOrders,
    getDashboardStats,
};
