export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt: string;
    providerProfile?: ProviderProfile;
}

export interface ProviderProfile {
    id: string;
    userId: string;
    businessName: string;
    description: string | null;
    logoUrl: string | null;
    address: string | null;
}

export interface Category {
    id: string;
    name: string;
    imageUrl: string | null;
}

export interface Meal {
    id: string;
    providerId: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    category?: Category;
    provider?: Partial<ProviderProfile>;
    avgRating?: number | null;
    reviewCount?: number;
}

export interface Order {
    id: string;
    customerId: string;
    providerId: string;
    status: OrderStatus;
    deliveryAddress: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
    provider?: { businessName: string; logoUrl?: string };
    customer?: { name: string; email: string };
}

export interface OrderItem {
    id: string;
    mealId: string;
    mealName: string;
    price: number;
    quantity: number;
    meal?: { imageUrl?: string };
}

export interface Review {
    id: string;
    customerId: string;
    mealId: string;
    orderId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    customer?: { name: string };
}
