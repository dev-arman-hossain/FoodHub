'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Order } from '@/types';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, Store, User as UserIcon } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-500 bg-green-50 border-green-100';
            case 'CANCELLED': return 'text-red-500 bg-red-50 border-red-100';
            default: return 'text-orange-500 bg-orange-50 border-orange-100';
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <div className="space-y-2">
                <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Global Orders</h1>
                <p className="text-zinc-500 font-medium text-lg">Comprehensive audit of all platform transactions</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-zinc-50 animate-pulse rounded-3xl" />)}
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-950 text-white">
                                <tr>
                                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">Order ID</th>
                                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">Parties</th>
                                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-center">Amount</th>
                                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-center">Status</th>
                                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-right">Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-zinc-50/50 transition-soft">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <Package className="w-4 h-4 text-zinc-400" />
                                                <span className="font-display font-black text-zinc-900 uppercase">#{order.id.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 font-bold">
                                                    <UserIcon className="w-3.5 h-3.5 text-orange-500" /> {order.customer?.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                                                    <Store className="w-3.5 h-3.5 text-zinc-300" /> {order.provider?.businessName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="text-xl font-display font-black text-zinc-900">{formatPrice(order.totalAmount)}</span>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2",
                                                getStatusColor(order.status)
                                            )}>
                                                <Clock className="w-3 h-3" /> {order.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black group-hover:bg-zinc-900 group-hover:text-white transition-soft" title={item.mealName}>
                                                        {item.quantity}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && <div className="w-8 h-8 border border-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-black text-zinc-400">+{order.items.length - 3}</div>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
