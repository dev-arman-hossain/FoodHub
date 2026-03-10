'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Meal } from '@/types';
import { toast } from 'sonner';

interface CartItem extends Meal {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (meal: Meal) => void;
    removeItem: (mealId: string) => void;
    updateQuantity: (mealId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('foodhub_cart');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('foodhub_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (meal: Meal) => {
        const existing = items.find((item) => item.id === meal.id);
        if (existing) {
            toast.success(`${meal.name} quantity updated!`);
        } else {
            toast.success(`${meal.name} added to cart!`);
        }

        setItems((prev) => {
            const existingInPrev = prev.find((item) => item.id === meal.id);
            if (existingInPrev) {
                return prev.map((item) =>
                    item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...meal, quantity: 1 }];
        });
    };

    const removeItem = (mealId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== mealId));
    };

    const updateQuantity = (mealId: string, quantity: number) => {
        if (quantity < 1) return removeItem(mealId);
        setItems((prev) =>
            prev.map((item) => (item.id === mealId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
