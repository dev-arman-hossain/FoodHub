'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Order } from '@/types';
import { Package, Clock, MapPin, ChevronRight, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PREPARING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'READY': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle2 className="w-4 h-4" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 space-y-12">
            <div className="space-y-2">
                <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Order History</h1>
                <p className="text-zinc-500 font-medium text-lg">Track your current and past culinary experiences</p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 bg-zinc-50 animate-pulse rounded-[40px]" />
                    ))}
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-soft group"
                        >
                            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-zinc-950 rounded-[28px] flex items-center justify-center p-3">
                                        {order.provider?.logoUrl ? (
                                            <img src={order.provider.logoUrl} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            <Package className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display font-black text-zinc-900">{order.provider?.businessName || 'Provider'}</h3>
                                        <div className="flex items-center gap-4 text-sm text-zinc-400 font-medium">
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                                            <span>{order.items.length} Items</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className={cn(
                                        "px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border flex items-center gap-2",
                                        getStatusColor(order.status)
                                    )}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                    <div className="text-2xl font-display font-black text-zinc-900">
                                        {formatPrice(order.totalAmount)}
                                    </div>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="p-4 bg-zinc-50 group-hover:bg-orange-500 group-hover:text-white rounded-2xl transition-soft"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
                        <RotateCcw className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-zinc-900">No orders yet</h3>
                    <p className="text-zinc-500 font-medium">When you place an order, it will show up here.</p>
                    <Link href="/" className="text-orange-500 font-black flex items-center gap-2 hover:gap-4 transition-all">
                        Order your first meal <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
