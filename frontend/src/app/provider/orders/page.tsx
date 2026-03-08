'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Order } from '@/types';
import { ShoppingBag, Clock, MapPin, User as UserIcon, CheckCircle2, Truck, Utensils, XCircle, ChevronDown, Loader2 } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ProviderOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/provider/orders');
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await api.patch(`/orders/provider/orders/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const statusFlow = ['PLACED', 'PREPARING', 'READY', 'DELIVERED'];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <div className="space-y-2">
                <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Orders Management</h1>
                <p className="text-zinc-500 font-medium text-lg">Manage your active and completed customer orders</p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-zinc-50 animate-pulse rounded-[40px]" />)}
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/20 hover:border-zinc-300 transition-soft"
                        >
                            <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Order Basics */}
                                <div className="lg:col-span-4 space-y-6 border-r border-zinc-50 pr-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center p-3">
                                            <ShoppingBag className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-black text-2xl text-zinc-900 leading-none">#{order.id.slice(-6).toUpperCase()}</h3>
                                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-zinc-50 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3">
                                            <UserIcon className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-black text-zinc-900">{order.customer?.name}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                                            <span className="text-sm font-medium text-zinc-500 leading-relaxed">{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="lg:col-span-5 space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Order Items</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between group">
                                                <span className="text-zinc-600 font-bold"><span className="text-orange-500">{item.quantity}x</span> {item.mealName}</span>
                                                <span className="text-zinc-400 font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
                                            <span className="text-sm font-black text-zinc-900 uppercase tracking-widest">Grand Total</span>
                                            <span className="text-2xl font-display font-black text-orange-500">{formatPrice(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-2 text-center block">Update Status</label>

                                        <AnimatePresence mode="wait">
                                            {order.status === 'CANCELLED' || order.status === 'DELIVERED' ? (
                                                <div className={cn(
                                                    "w-full py-4 rounded-3xl text-center font-black uppercase tracking-widest text-xs border flex items-center justify-center gap-2",
                                                    order.status === 'DELIVERED' ? "bg-green-50 text-green-500 border-green-100" : "bg-red-50 text-red-500 border-red-100"
                                                )}>
                                                    {order.status === 'DELIVERED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    {order.status}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-2">
                                                    {statusFlow.slice(statusFlow.indexOf(order.status) + 1, statusFlow.indexOf(order.status) + 2).map((next) => (
                                                        <button
                                                            key={next}
                                                            disabled={updatingId === order.id}
                                                            onClick={() => updateStatus(order.id, next)}
                                                            className="w-full py-4 bg-zinc-950 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 transition-soft flex items-center justify-center gap-2"
                                                        >
                                                            {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                                                            Mark as {next}
                                                        </button>
                                                    ))}
                                                    <div className="py-2 px-4 bg-orange-50 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-center border border-orange-100">
                                                        Current: {order.status}
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
                    <ShoppingBag className="w-16 h-16 text-zinc-100" />
                    <h3 className="text-xl font-display font-medium text-zinc-400 uppercase tracking-widest italic">No orders to manage</h3>
                </div>
            )}
        </div>
    );
};

export default ProviderOrdersPage;
