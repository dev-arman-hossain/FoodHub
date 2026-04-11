'use client';

import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface ChartProps {
    data: any[];
    height?: number;
}

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#ec4899'];
const LIGHT_COLORS = ['#fb923c', '#60a5fa', '#4ade80', '#f87171', '#c084fc', '#f472b6'];

export const OrdersBarChart: React.FC<ChartProps> = ({ data, height = 350 }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Week 1', orders: 0 }, { name: 'Week 2', orders: 0 },
        { name: 'Week 3', orders: 0 }, { name: 'Week 4', orders: 0 }
    ];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px'
                    }}
                />
                <Bar 
                    dataKey="orders" 
                    fill="#18181b" 
                    radius={[8, 8, 0, 0]} 
                    barSize={40}
                    activeBar={{ fill: '#f97316' }}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const RevenueLineChart: React.FC<ChartProps> = ({ data, height = 350 }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Week 1', revenue: 0 }, { name: 'Week 2', revenue: 0 },
        { name: 'Week 3', revenue: 0 }, { name: 'Week 4', revenue: 0 }
    ];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px'
                    }}
                    formatter={(val: any) => [formatPrice(Number(val)), 'Revenue']}
                />
                <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#f97316', strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const StatusPieChart: React.FC<ChartProps> = ({ data, height = 350 }) => {
    const chartData = data && data.length > 0 ? data : [{ name: 'No Orders', value: 1 }];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px'
                    }}
                />
                <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-2">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
