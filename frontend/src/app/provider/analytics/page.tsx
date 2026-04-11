'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
    Clock, DollarSign, TrendingUp, Search
} from 'lucide-react';
import { OrdersBarChart, RevenueLineChart, StatusPieChart } from '@/components/dashboard/DashboardCharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProviderAnalyticsPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/provider/dashboard-stats');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch provider stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="p-8 space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-100 rounded-[32px]" />)}
                </div>
                <div className="h-[500px] bg-zinc-50 rounded-[40px]" />
            </div>
        </DashboardLayout>
    );

    if (!stats) return (
        <DashboardLayout>
            <div className="p-20 text-center">Failed to load analytics data.</div>
        </DashboardLayout>
    );

    const { totals, trends, statusDistribution } = stats;

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 pb-24">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
                    <div className="space-y-3">
                        <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">Data & Insights</span>
                        <h1 className="text-4xl lg:text-5xl font-display font-black text-zinc-900 tracking-tight">Performance <span className="text-orange-500">Analytics</span></h1>
                        <p className="text-zinc-500 font-medium text-lg">In-depth revenue and order analysis for your kitchen.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-zinc-900 text-white rounded-[32px] space-y-6 shadow-xl shadow-zinc-900/10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">Total Revenue</p>
                            <p className="text-4xl font-display font-black">{formatPrice(totals.totalEarnings)}</p>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-white border border-zinc-100 rounded-[32px] space-y-6 shadow-xl shadow-zinc-200/20">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">Total Orders</p>
                            <p className="text-4xl font-display font-black text-zinc-900">{totals.totalOrders}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 bg-white border border-zinc-100 rounded-[32px] space-y-6 shadow-xl shadow-zinc-200/20">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">Processing</p>
                            <p className="text-4xl font-display font-black text-zinc-900">{totals.pendingOrders}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8">
                            <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Revenue Trends</h3>
                            <RevenueLineChart data={trends} height={350} />
                        </div>
                        
                        <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8">
                            <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Order Volume</h3>
                            <OrdersBarChart data={trends} height={350} />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8 flex flex-col justify-center">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Order Status</h3>
                                <p className="text-sm text-zinc-500 font-medium">Distribution of all incoming orders.</p>
                            </div>
                            <StatusPieChart data={statusDistribution} height={350} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProviderAnalyticsPage;
