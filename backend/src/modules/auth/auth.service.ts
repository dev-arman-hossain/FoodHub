import status from 'http-status';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { jwtUtils } from '../../utils/jwt';
import { IRegisterPayload, ILoginPayload } from './auth.interface';

const register = async (payload: IRegisterPayload) => {
    const { name, email, password, role, businessName, description, address } = payload;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError(status.CONFLICT as number, 'Email is already registered.');
    }

    if (role === 'PROVIDER' && !businessName) {
        throw new AppError(status.BAD_REQUEST as number, 'Business name is required for providers.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: { name, email, password: hashedPassword, role, status: 'ACTIVE' },
        });

        if (role === 'PROVIDER') {
            await tx.providerProfile.create({
                data: {
                    userId: newUser.id,
                    businessName: businessName!,
                    description: description || null,
                    address: address || null,
                },
            });
        }

        return newUser;
    });

    const tokenPayload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = jwtUtils.getAccessToken(tokenPayload);
    const refreshToken = jwtUtils.getRefreshToken(tokenPayload);

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
    };
};

const login = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError(status.UNAUTHORIZED as number, 'Invalid email or password.');
    }

    if (user.status === 'SUSPENDED') {
        throw new AppError(status.FORBIDDEN as number, 'Your account has been suspended.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError(status.UNAUTHORIZED as number, 'Invalid email or password.');
    }

    const tokenPayload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = jwtUtils.getAccessToken(tokenPayload);
    const refreshToken = jwtUtils.getRefreshToken(tokenPayload);

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            providerProfile: {
                include: { meals: true },
            },
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND as number, 'User not found.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const refreshToken = async (token: string) => {
    const verified = jwtUtils.verifyToken(token, process.env.REFRESH_TOKEN_SECRET as string);
    if (!verified.success || !verified.data) {
        throw new AppError(status.UNAUTHORIZED as number, 'Invalid or expired refresh token.');
    }

    const userId = verified.data['userId'] as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status === 'SUSPENDED') {
        throw new AppError(status.UNAUTHORIZED as number, 'User not found or suspended.');
    }

    const tokenPayload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = jwtUtils.getAccessToken(tokenPayload);
    const newRefreshToken = jwtUtils.getRefreshToken(tokenPayload);

    return { accessToken, refreshToken: newRefreshToken };
};

export const AuthService = {
    register,
    login,
    getMe,
    refreshToken,
};
