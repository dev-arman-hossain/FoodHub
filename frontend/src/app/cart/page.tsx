'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async () => {
        if (!user) return alert('Please login to place an order');
        if (!address) return setError('Please provide a delivery address');

        setLoading(true);
        setError('');
        try {
            await api.post('/orders', {
                deliveryAddress: address,
                items: items.map((item) => ({ mealId: item.id, quantity: item.quantity })),
            });
            setOrdered(true);
            clearCart();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (ordered) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20"
                >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-zinc-900">Order Placed!</h2>
                    <p className="text-zinc-500 font-medium text-lg">Your meal is being prepared by our chefs.</p>
                </div>
                <Link
                    href="/orders"
                    className="px-8 py-4 bg-zinc-900 text-white rounded-3xl font-black hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10"
                >
                    Track My Order
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-6">
                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-zinc-300" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-zinc-900">Your cart is empty</h2>
                    <p className="text-zinc-500 font-medium">Looks like you haven&apos;t added any delicious meals yet.</p>
                </div>
                <Link
                    href="/"
                    className="px-8 py-4 bg-orange-500 text-white rounded-3xl font-black hover:bg-zinc-900 transition-soft shadow-xl shadow-orange-500/20"
                >
                    Start Browsing
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-1">
                        <h1 className="text-zinc-900">Shopping Cart</h1>
                        <p className="text-zinc-500 font-medium">{items.length} items selected from local providers</p>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-zinc-100 hover:border-zinc-200 transition-soft group"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-soft duration-500"
                                        />
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <h3 className="text-zinc-900">{item.name}</h3>
                                        <p className="text-sm text-zinc-400 font-bold uppercase tracking-tighter">{item.category?.name}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2 p-1 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-white hover:text-orange-500 rounded-lg transition-soft text-zinc-400"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-black text-zinc-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-white hover:text-orange-500 rounded-lg transition-soft text-zinc-400"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="font-display font-black text-zinc-900 text-lg">{formatPrice(Number(item.price) * item.quantity)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-soft"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 p-10 bg-zinc-900 rounded-[40px] text-white space-y-8 shadow-2xl shadow-zinc-900/20">
                        <h2 className="border-b border-white/10 pb-6">Order Summary</h2>

                        <div className="space-y-6">
                            <div className="flex justify-between text-zinc-400 font-medium">
                                <span>Subtotal</span>
                                <span className="text-white font-bold">{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400 font-medium">
                                <span>Delivery Fee</span>
                                <span className="text-white font-bold">{formatPrice(2.5)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-display pt-6 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-orange-500">{formatPrice(totalPrice + 2.5)}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="px-1">Delivery Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-soft font-medium"
                                    placeholder="Enter your street address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full py-5 bg-orange-500 hover:bg-white hover:text-zinc-900 text-white rounded-[32px] font-black flex items-center justify-center gap-3 transition-soft active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Confirm Order <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                            Secure Checkout &middot; Fastest Delivery &middot; Satisfaction Guaranteed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
