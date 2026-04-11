'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    isCurrency?: boolean;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
    label, value, icon: Icon, trend, isCurrency, className 
}) => {
    return (
        <div className={cn(
            "p-6 lg:p-8 bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/20 flex flex-col justify-between group hover:border-orange-200 transition-all duration-500",
            className
        )}>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black tracking-tight",
                        trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {trend.value}%
                    </div>
                )}
            </div>
            
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                <h3 className="text-4xl font-display font-black text-zinc-900 tracking-tight">
                    {isCurrency ? formatPrice(Number(value)) : value}
                </h3>
            </div>
        </div>
    );
};

export default StatsCard;
