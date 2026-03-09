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

    const [totalMeals, totalOrders, totalEarnings] = await Promise.all([
        prisma.meal.count({ where: { providerId: profile.id } }),
        prisma.order.count({ where: { providerId: profile.id } }),
        prisma.order.aggregate({
            where: { providerId: profile.id, status: 'DELIVERED' },
            _sum: { totalAmount: true },
        }),
    ]);

    const recentOrders = await prisma.order.findMany({
        where: { providerId: profile.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
    });

    return {
        totalMeals,
        totalOrders,
        totalEarnings: totalEarnings._sum.totalAmount || 0,
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
