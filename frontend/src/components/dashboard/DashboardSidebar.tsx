'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
    LayoutDashboard, ShoppingBag, Users, Layers, 
    Settings, Package, PieChart, Star, User,
    LogOut, ChevronLeft, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SidebarLink = ({ 
    href, 
    icon: Icon, 
    label, 
    isActive 
}: { 
    href: string; 
    icon: any; 
    label: string; 
    isActive: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group",
            isActive 
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        )}
    >
        <Icon className={cn(
            "w-5 h-5 transition-transform duration-300",
            isActive ? "scale-110" : "group-hover:scale-110"
        )} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
        {isActive && (
            <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"
            />
        )}
    </Link>
);

const DashboardSidebar = ({ className }: { className?: string }) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const links = {
        ADMIN: [
            { href: '/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
            { href: '/admin/users', label: 'User Directory', icon: Users },
            { href: '/admin/categories', label: 'Categories', icon: Layers },
            { href: '/admin/settings', label: 'Global Settings', icon: Settings },
        ],
        PROVIDER: [
            { href: '/provider/dashboard', label: 'Kitchen Board', icon: LayoutDashboard },
            { href: '/provider/meals', label: 'My Menu', icon: Package },
            { href: '/provider/orders', label: 'Order Feed', icon: ShoppingBag },
            { href: '/provider/analytics', label: 'Performance', icon: PieChart },
            { href: '/provider/settings', label: 'Shop Settings', icon: Settings },
        ],
        CUSTOMER: [
            { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
            { href: '/orders', label: 'My Orders', icon: ShoppingBag },
            { href: '/reviews', label: 'My Reviews', icon: Star },
            { href: '/profile', label: 'Account', icon: User },
        ]
    };

    const currentLinks = links[user.role as keyof typeof links] || [];

    return (
        <aside className={cn(
            "flex flex-col bg-white border-r border-zinc-100 h-screen sticky top-0 py-8 px-4 w-[280px]",
            className
        )}>
            <div className="px-6 mb-12">
                <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">Operations</span>
                <h2 className="text-xl font-display font-black text-zinc-900 mt-1">Control <span className="text-orange-500">Panel</span></h2>
            </div>

            <nav className="flex-1 space-y-2">
                {currentLinks.map((link) => (
                    <SidebarLink 
                        key={link.href}
                        {...link}
                        isActive={pathname === link.href}
                    />
                ))}
            </nav>

            <div className="pt-8 mt-8 border-t border-zinc-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-tight text-left">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
