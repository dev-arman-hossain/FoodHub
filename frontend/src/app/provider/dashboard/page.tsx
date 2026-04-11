'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
    ShoppingBag, DollarSign, Package, AlertCircle, 
    Activity, BarChart2 
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { OrdersBarChart, RevenueLineChart, StatusPieChart } from '@/components/dashboard/DashboardCharts';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const ProviderDashboard = () => {
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
            <div className="p-20 text-center">Failed to load your kitchen data.</div>
        </DashboardLayout>
    );

    const { totals, trends, statusDistribution, recentOrders } = stats;

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 pb-24">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
                    <div className="space-y-3">
                        <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">Culinary Operations</span>
                        <h1 className="text-4xl lg:text-5xl">Kitchen <span className="text-orange-500">Board</span></h1>
                        <p className="text-zinc-500 font-medium text-lg">Monitoring your food business analytics and performance.</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <div className="px-6 py-4 bg-zinc-900 rounded-3xl text-white flex items-center gap-3">
                            <Activity className="w-5 h-5 text-orange-500" />
                            <div className="text-left">
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Shop Status</p>
                                <p className="text-xs font-black uppercase tracking-widest">Active & Open</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <StatsCard 
                        label="Active Orders" 
                        value={totals.totalOrders} 
                        icon={ShoppingBag} 
                        trend={{ value: 18, isUp: true }} 
                    />
                    <StatsCard 
                        label="Gross Earnings" 
                        value={totals.totalEarnings} 
                        icon={DollarSign} 
                        isCurrency
                        trend={{ value: 12, isUp: true }} 
                    />
                    <StatsCard 
                        label="Menu Items" 
                        value={totals.totalMeals} 
                        icon={Package} 
                    />
                    <StatsCard 
                        label="Pending Actions" 
                        value={totals.pendingOrders} 
                        icon={AlertCircle} 
                        className="bg-orange-500 text-white"
                    />
                </div>

                {/* Performance Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-12 bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Weekly Performance</h3>
                                <p className="text-sm text-zinc-500 font-medium">Orders and revenue trends for the last 4 weeks</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-zinc-900 rounded-full" />
                                    <span className="text-[10px] font-black uppercase text-zinc-400">Orders</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                                    <span className="text-[10px] font-black uppercase text-zinc-400">Revenue</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4" /> Order Volume
                                </h4>
                                <OrdersBarChart data={trends} height={300} />
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-orange-500" /> Revenue Flow
                                </h4>
                                <RevenueLineChart data={trends} height={300} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <RecentOrdersTable orders={recentOrders} />
                    </div>
                    <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8 flex flex-col justify-center">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Status Insight</h3>
                            <p className="text-sm text-zinc-500 font-medium">How your orders are distributed</p>
                        </div>
                        <StatusPieChart data={statusDistribution} height={350} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const TrendingUp = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default ProviderDashboard;
