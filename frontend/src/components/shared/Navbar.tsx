'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, Menu, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-zinc-200/50">
            <div className="container mx-auto h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-orange-500 rounded-xl group-hover:rotate-12 transition-soft">
                        <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-bold tracking-tight text-zinc-900">
                        Food<span className="text-orange-500">Hub</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/meals" className="text-base font-semibold text-zinc-700 hover:text-orange-500 transition-soft">
                        Browse Meals
                    </Link>
                    <Link href="/providers" className="text-base font-semibold text-zinc-700 hover:text-orange-500 transition-soft">
                        Providers
                    </Link>

                    <div className="h-6 w-px bg-zinc-200 mx-2" />

                    <Link href="/cart" className="relative p-2 hover:bg-zinc-100 rounded-full transition-soft group">
                        <ShoppingCart className="w-5 h-5 text-zinc-700 group-hover:text-orange-500" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href={
                                    user.role === 'ADMIN'
                                        ? '/admin'
                                        : user.role === 'PROVIDER'
                                            ? '/provider/dashboard'
                                            : '/orders'
                                }
                                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 rounded-full transition-soft"
                            >
                                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center uppercase font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-base font-semibold text-zinc-800">{user.name.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-soft"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-base font-semibold text-zinc-700 hover:text-orange-500 transition-soft">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-full text-base font-bold hover:bg-orange-600 transition-soft shadow-lg shadow-orange-500/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Trigger */}
                <button className="md:hidden p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
