'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
    ShoppingBag, DollarSign, Clock, ChevronRight, 
    ArrowRight, Star, Utensils 
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { StatusPieChart } from '@/components/dashboard/DashboardCharts';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const CustomerDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/orders/customer-stats');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch customer stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-100 rounded-[32px]" />)}
                </div>
                <div className="h-[400px] bg-zinc-50 rounded-[40px]" />
            </div>
        </DashboardLayout>
    );

    if (!stats) return (
        <DashboardLayout>
            <div className="p-20 text-center">Failed to load your personal dashboard.</div>
        </DashboardLayout>
    );

    const { totals, recentOrders, statusDistribution } = stats;

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 pb-24 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-3">
                        <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">Your Personal Lounge</span>
                        <h1 className="text-4xl lg:text-5xl font-display font-black text-zinc-900 tracking-tight">Welcome <span className="text-orange-500">Back!</span></h1>
                        <p className="text-zinc-500 font-medium text-lg">Detailed insights into your food adventures.</p>
                    </div>
                    <Link 
                        href="/meals"
                        className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full font-black text-sm hover:bg-orange-600 transition-all duration-500 shadow-xl shadow-zinc-900/10"
                    >
                        Order Something New <Utensils className="w-5 h-5" />
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard 
                        label="Total Orders" 
                        value={totals.totalOrders} 
                        icon={ShoppingBag} 
                    />
                    <StatsCard 
                        label="Lifetime Spend" 
                        value={totals.totalSpent} 
                        icon={DollarSign} 
                        isCurrency
                    />
                    <StatsCard 
                        label="Active Orders" 
                        value={totals.activeOrders} 
                        icon={Clock} 
                        className="bg-orange-500 text-white"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Recent Orders</h2>
                            <Link href="/orders" className="text-sm font-black text-orange-500 hover:text-orange-600 flex items-center gap-1 group">
                                Full History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-soft" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order: any) => (
                                    <motion.div 
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-6 rounded-[32px] border border-zinc-100 flex items-center justify-between group hover:border-orange-200 transition-soft shadow-sm"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-100 flex-shrink-0">
                                                <img 
                                                    src={order.provider?.logoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                                                    alt={order.provider?.businessName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-display font-black text-zinc-900 leading-none group-hover:text-orange-500 transition-soft">
                                                    {order.provider?.businessName}
                                                </h4>
                                                <p className="text-sm text-zinc-400 mt-2 font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <span className="text-lg font-display font-black text-zinc-900">
                                                {formatPrice(Number(order.totalAmount))}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' :
                                                order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-zinc-50 rounded-[40px] border border-dashed border-zinc-200">
                                    <p className="text-zinc-500 font-medium">No orders yet. Discover your next meal!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status distribution */}
                    <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8 flex flex-col justify-center">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Order Lifecycle</h3>
                            <p className="text-sm text-zinc-500 font-medium">Overview of your activity</p>
                        </div>
                        <StatusPieChart data={statusDistribution} height={350} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerDashboard;
