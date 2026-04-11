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
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
        totalUsers,
        totalProviders,
        totalOrders,
        totalMeals,
        revenueData,
        pendingOrders,
        recentOrders,
        statusDistribution,
        monthlyTrends,
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'PROVIDER' } }),
        prisma.order.count(),
        prisma.meal.count(),
        prisma.order.aggregate({
            where: { status: 'DELIVERED' },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({
            where: { status: { in: ['PLACED', 'PREPARING', 'READY'] } },
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { 
                customer: { select: { name: true } },
                provider: { select: { businessName: true } }
            },
        }),
        prisma.order.groupBy({
            by: ['status'],
            _count: { id: true },
        }),
        // Trends for last 6 months
        prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
                COUNT(id)::int as count,
                SUM("totalAmount")::float as revenue
            FROM orders
            WHERE "createdAt" >= $1
            GROUP BY DATE_TRUNC('month', "createdAt")
            ORDER BY DATE_TRUNC('month', "createdAt") ASC
        `, sixMonthsAgo),
    ]);

    // Format trends to ensure all 6 months are present
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(today.getMonth() - i);
        months.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }

    const formattedTrends = months.map(m => {
        const found = monthlyTrends.find(t => t.month === m);
        return {
            name: m,
            orders: found ? found.count : 0,
            revenue: found ? found.revenue : 0,
        };
    });

    return {
        totals: {
            totalUsers,
            totalProviders,
            totalOrders,
            totalMeals,
            totalRevenue: Number(revenueData._sum.totalAmount || 0),
            pendingOrders,
        },
        trends: formattedTrends,
        statusDistribution: statusDistribution.map(s => ({
            name: s.status,
            value: s._count.id,
        })),
        recentOrders,
    };
};

export const AdminService = {
    getAllUsers,
    toggleUserStatus,
    getAllOrders,
    getDashboardStats,
};
