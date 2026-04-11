'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RecentOrdersTableProps {
    orders: any[];
    isAdmin?: boolean;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders, isAdmin }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'PREPARING': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'READY': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
        }
    };

    return (
        <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 overflow-hidden">
            <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-display font-black text-zinc-900 tracking-tight">Recent Orders</h3>
                    <p className="text-sm text-zinc-500 font-medium">Monitoring the latest activity</p>
                </div>
                <Link 
                    href={isAdmin ? "/admin/orders" : "/provider/orders"}
                    className="flex items-center gap-2 text-sm font-black text-orange-500 hover:text-orange-600 transition-soft group"
                >
                    View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-soft" />
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-50/50">
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID</th>
                            <th className="hidden sm:table-cell px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                            <th className="hidden md:table-cell px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-50/30 transition-soft group">
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black text-zinc-900 font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                                </td>
                                <td className="hidden sm:table-cell px-8 py-6">
                                    <span className="text-sm font-bold text-zinc-600">{order.customer?.name}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black text-zinc-900">{formatPrice(Number(order.totalAmount))}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell px-8 py-6 text-sm text-zinc-400 font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;
