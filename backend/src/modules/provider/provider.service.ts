import { prisma } from '../../lib/prisma';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { cloudinaryUtils } from '../../utils/cloudinary';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Existing stats service...
const getDashboardStats = async (userId: string) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!profile) {
        throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');
    }

    const today = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(today.getDate() - 27);
    fourWeeksAgo.setHours(0, 0, 0, 0);

    const [
        totalMeals,
        totalOrders,
        earningsData,
        pendingOrders,
        recentOrders,
        statusDistribution,
        weeklyTrends,
    ] = await Promise.all([
        prisma.meal.count({ where: { providerId: profile.id } }),
        prisma.order.count({ where: { providerId: profile.id } }),
        prisma.order.aggregate({
            where: { providerId: profile.id, status: 'DELIVERED' },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({
            where: { 
                providerId: profile.id, 
                status: { in: ['PLACED', 'PREPARING', 'READY'] } 
            },
        }),
        prisma.order.findMany({
            where: { providerId: profile.id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { customer: { select: { name: true } } },
        }),
        prisma.order.groupBy({
            by: ['status'],
            where: { providerId: profile.id },
            _count: { id: true },
        }),
        // Weekly trends for last 4 weeks (grouped by week start)
        prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                TO_CHAR(DATE_TRUNC('week', "createdAt"), 'DD Mon') as week,
                COUNT(id)::int as count,
                SUM("totalAmount")::float as revenue
            FROM orders
            WHERE "providerId" = $1 AND "createdAt" >= $2
            GROUP BY DATE_TRUNC('week', "createdAt")
            ORDER BY DATE_TRUNC('week', "createdAt") ASC
        `, profile.id, fourWeeksAgo),
    ]);

    return {
        totals: {
            totalMeals,
            totalOrders,
            totalEarnings: Number(earningsData._sum.totalAmount || 0),
            pendingOrders,
        },
        trends: weeklyTrends.map(t => ({
            name: t.week,
            orders: t.count,
            revenue: t.revenue,
        })),
        statusDistribution: statusDistribution.map(s => ({
            name: s.status,
            value: s._count.id,
        })),
        recentOrders,
    };
};

const updateProfile = async (userId: string, payload: any, file?: Express.Multer.File) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(status.NOT_FOUND as number, 'Provider profile not found.');

    const updateData = { ...payload };

    if (file) {
        // Delete old logo if exists
        if (profile.logoUrl) {
            await cloudinaryUtils.deleteImageByUrl(profile.logoUrl);
        }
        updateData.logoUrl = await cloudinaryUtils.uploadImage(file.path, 'logos');
        await unlinkAsync(file.path);
    }

    return prisma.providerProfile.update({
        where: { userId },
        data: updateData,
    });
};

export const ProviderService = {
    getDashboardStats,
    updateProfile,
};
