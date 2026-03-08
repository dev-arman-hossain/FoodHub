'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Package, ShoppingBag, DollarSign, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/provider/dashboard-stats');
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Meals', value: stats?.totalMeals || 0, icon: <Package />, color: 'orange' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag />, color: 'blue' },
        { label: 'Total Earnings', value: formatPrice(stats?.totalEarnings || 0), icon: <DollarSign />, color: 'green' },
        { label: 'Active Status', value: user?.status, icon: <TrendingUp />, color: 'purple' },
    ];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Provider Dashboard</h1>
                    <p className="text-zinc-500 font-medium text-lg">Welcome back, <span className="text-orange-500 font-black">{user?.providerProfile?.businessName}</span></p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/provider/meals"
                        className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10 flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" /> Add New Meal
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="h-40 bg-zinc-50 animate-pulse rounded-[40px]" />)
                ) : (
                    statCards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/30 space-y-4 group hover:border-zinc-300 transition-soft"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-soft",
                                card.color === 'orange' && "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
                                card.color === 'blue' && "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
                                card.color === 'green' && "bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white",
                                card.color === 'purple' && "bg-purple-50 text-purple-500 group-hover:bg-purple-500 group-hover:text-white",
                            )}>
                                {React.cloneElement(card.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{card.label}</p>
                                <h3 className="text-3xl font-display font-black text-zinc-900">{card.value}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Recent Orders */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-display font-black text-zinc-900 tracking-tight">Recent Orders</h2>
                        <Link href="/provider/orders" className="text-sm font-black text-orange-500 hover:text-orange-600 transition-soft flex items-center gap-2">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/30">
                        {loading ? (
                            <div className="p-20 text-center animate-pulse text-zinc-300 font-black">Loading Orders...</div>
                        ) : stats?.recentOrders?.length > 0 ? (
                            <div className="divide-y divide-zinc-50">
                                {stats.recentOrders.map((order: any) => (
                                    <div key={order.id} className="p-8 flex items-center justify-between hover:bg-zinc-50/50 transition-soft group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-display font-bold text-lg text-zinc-900">Order by {order.customer?.name}</h4>
                                                <p className="text-xs text-zinc-400 font-medium">#{order.id.slice(-6).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xl font-display font-black text-zinc-900">{formatPrice(order.totalAmount)}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{order.status}</span>
                                            </div>
                                            <Link href="/provider/orders" className="p-3 bg-zinc-50 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-soft">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <ShoppingBag className="w-10 h-10 text-zinc-200 mx-auto" />
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No recent orders found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-3xl font-display font-black text-zinc-900 tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/provider/meals" className="p-8 bg-zinc-950 text-white rounded-[40px] flex items-center justify-between group overflow-hidden relative shadow-2xl shadow-zinc-950/20 active:scale-95 transition-soft">
                            <div className="z-10">
                                <h3 className="text-xl font-display font-black">Manage Menu</h3>
                                <p className="text-zinc-400 text-sm font-medium">Update prices and availability</p>
                            </div>
                            <Package className="w-20 h-20 text-white/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-soft" />
                        </Link>
                        <Link href="/provider/orders" className="p-8 bg-white border border-zinc-100 rounded-[40px] flex items-center justify-between group overflow-hidden relative shadow-xl shadow-zinc-200/30 active:scale-95 transition-soft">
                            <div className="z-10">
                                <h3 className="text-xl font-display font-black text-zinc-900">Manage Orders</h3>
                                <p className="text-zinc-500 text-sm font-medium">Update order preparation status</p>
                            </div>
                            <Clock className="w-20 h-20 text-zinc-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-soft" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
