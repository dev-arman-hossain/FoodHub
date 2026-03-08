import z from 'zod';

export const registerZodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
    businessName: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
});

export const loginZodSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const changePasswordZodSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
