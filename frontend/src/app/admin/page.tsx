'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Users, ShoppingBag, DollarSign, Activity, ChevronRight, LayoutGrid, ShieldCheck, UserCog } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Customers', value: stats?.totalUsers || 0, icon: <Users />, color: 'blue' },
        { label: 'Total Providers', value: stats?.totalProviders || 0, icon: <ShieldCheck />, color: 'orange' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag />, color: 'purple' },
        { label: 'Platform Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <DollarSign />, color: 'green' },
    ];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-16">
            <div className="space-y-2">
                <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Admin Console</h1>
                <p className="text-zinc-500 font-medium text-lg">Platform-wide overview and mission control</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="h-44 bg-zinc-50 animate-pulse rounded-[40px]" />)
                ) : (
                    cards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 group hover:border-orange-500 transition-soft"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-soft",
                                card.color === 'blue' && "bg-blue-50 text-blue-500",
                                card.color === 'orange' && "bg-orange-50 text-orange-500",
                                card.color === 'purple' && "bg-purple-50 text-purple-500",
                                card.color === 'green' && "bg-green-50 text-green-500",
                            )}>
                                {React.cloneElement(card.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
                            </div>
                            <div className="mt-6 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{card.label}</p>
                                <h3 className="text-3xl font-display font-black text-zinc-900">{card.value}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link href="/admin/users" className="p-8 bg-zinc-950 text-white rounded-[40px] space-y-4 hover:scale-[1.02] transition-soft shadow-2xl shadow-zinc-950/20 active:scale-95 group">
                    <div className="p-4 bg-white/10 rounded-2xl w-fit group-hover:bg-orange-500 transition-soft">
                        <UserCog className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display font-black">User Management</h3>
                    <p className="text-zinc-400 text-sm font-medium">Suspend or activate accounts across the platform</p>
                </Link>
                <Link href="/admin/categories" className="p-8 bg-white border border-zinc-100 rounded-[40px] space-y-4 hover:scale-[1.02] transition-soft shadow-xl shadow-zinc-200/30 active:scale-95 group">
                    <div className="p-4 bg-zinc-50 rounded-2xl w-fit group-hover:bg-orange-500 group-hover:text-white transition-soft">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-zinc-900">Categories</h3>
                    <p className="text-zinc-500 text-sm font-medium">Manage the global taxonomy of available meals</p>
                </Link>
                <Link href="/admin/orders" className="p-8 bg-white border border-zinc-100 rounded-[40px] space-y-4 hover:scale-[1.02] transition-soft shadow-xl shadow-zinc-200/30 active:scale-95 group">
                    <div className="p-4 bg-zinc-50 rounded-2xl w-fit group-hover:bg-orange-500 group-hover:text-white transition-soft">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-zinc-900">All Orders</h3>
                    <p className="text-zinc-500 text-sm font-medium">Monitor and audit every transaction on FoodHub</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
