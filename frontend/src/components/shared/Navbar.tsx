'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    ShoppingCart, LogOut, Menu, UtensilsCrossed, X,
    ChevronRight, Home, LayoutGrid, Users, Info,
    BookOpen, Phone, User, ArrowUpRight, Sparkles, ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api-fetch';
import { Category } from '@/types';

// ─── Category color palette cycling ───────────────────────────────────────
// Maps a category name (lowercased) to a color theme, falls back to cycling
const colorPalette = [
    { bg: 'bg-orange-500/10', text: 'text-orange-600', dot: 'bg-orange-500', hover: 'hover:bg-orange-500/15' },
    { bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500', hover: 'hover:bg-rose-500/15' },
    { bg: 'bg-violet-500/10', text: 'text-violet-600', dot: 'bg-violet-500', hover: 'hover:bg-violet-500/15' },
    { bg: 'bg-sky-500/10', text: 'text-sky-600', dot: 'bg-sky-500', hover: 'hover:bg-sky-500/15' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', hover: 'hover:bg-emerald-500/15' },
    { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', hover: 'hover:bg-amber-500/15' },
    { bg: 'bg-pink-500/10', text: 'text-pink-600', dot: 'bg-pink-500', hover: 'hover:bg-pink-500/15' },
    { bg: 'bg-teal-500/10', text: 'text-teal-600', dot: 'bg-teal-500', hover: 'hover:bg-teal-500/15' },
    { bg: 'bg-indigo-500/10', text: 'text-indigo-600', dot: 'bg-indigo-500', hover: 'hover:bg-indigo-500/15' },
    { bg: 'bg-lime-500/10', text: 'text-lime-600', dot: 'bg-lime-500', hover: 'hover:bg-lime-500/15' },
];

// ─── Nav links definition ──────────────────────────────────────────────────
const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/meals', label: 'Browse Meals', icon: <LayoutGrid className="w-4 h-4" />, hasDropdown: true },
    { href: '/providers', label: 'Providers', icon: <Users className="w-4 h-4" /> },
    { href: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { href: '/blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
];

// ─── Mega Dropdown ────────────────────────────────────────────────────────
const CategoryMegaMenu = ({
    categories,
    onClose,
}: {
    categories: Category[];
    onClose: () => void;
}) => {
    const featured = categories.slice(0, 3);
    const rest = categories.slice(3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full -left-40 mt-4 w-[640px] z-50"
            style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.12))' }}
        >
            {/* Arrow */}
            <div className="absolute -top-2 left-[44%] w-4 h-4 bg-white border-l border-t border-zinc-100 rotate-45" />

            <div className="bg-white border border-zinc-100 rounded-[28px] overflow-hidden">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-zinc-950 to-zinc-800 px-7 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400 mb-0.5">Explore Menu</p>
                        <p className="text-white font-display font-bold text-lg leading-none">Browse by Category</p>
                    </div>
                    <Link
                        href="/meals"
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-orange-400 transition-colors"
                    >
                        View All <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="p-5 space-y-5">
                    {/* Featured (first 3) — larger tiles */}
                    {featured.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {featured.map((cat, i) => {
                                const palette = colorPalette[i % colorPalette.length];
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/meals?category=${cat.id}`}
                                        onClick={onClose}
                                        className={cn(
                                            'group relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl text-center transition-all duration-200',
                                            palette.bg, palette.hover
                                        )}
                                    >
                                        {/* Image or colored initial */}
                                        <div className={cn('w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center', palette.bg)}>
                                            {cat.imageUrl ? (
                                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className={cn('text-xl font-display font-black', palette.text)}>
                                                    {cat.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <span className={cn('text-sm font-bold', palette.text)}>{cat.name}</span>
                                        <span className={cn('absolute top-3 right-3 w-2 h-2 rounded-full', palette.dot)} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Divider */}
                    {rest.length > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="h-px bg-zinc-100 flex-1" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-300">All Categories</span>
                            <div className="h-px bg-zinc-100 flex-1" />
                        </div>
                    )}

                    {/* All remaining — compact list grid */}
                    {rest.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5">
                            {rest.map((cat, i) => {
                                const palette = colorPalette[(i + 3) % colorPalette.length];
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/meals?category=${cat.id}`}
                                        onClick={onClose}
                                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                                    >
                                        <span className={cn('w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125', palette.dot)} />
                                        <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">{cat.name}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-300 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty fallback */}
                    {categories.length === 0 && (
                        <div className="py-8 text-center">
                            <p className="text-sm text-zinc-400 font-medium">Loading categories...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 pt-1 pb-5">
                    <Link
                        href="/meals"
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-950 text-white rounded-2xl text-sm font-black hover:bg-orange-500 transition-colors group"
                    >
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Explore All Meals
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Nav Link with premium hover effect ──────────────────────────────────
const NavLink = ({
    href,
    label,
    isActive,
}: {
    href: string;
    label: string;
    isActive: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            'relative px-1 py-2 text-[15px] font-semibold transition-colors duration-200 group',
            isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
        )}
    >
        {label}
        {/* Animated underline */}
        <span
            className={cn(
                'absolute -bottom-0.5 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300',
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
            )}
        />
    </Link>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const { totalItems } = useCart();
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCatLoading, setIsCatLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasFetchedRef = useRef(false);

    // Fetch categories once
    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        setIsCatLoading(true);
        apiFetch<{ data: Category[] }>('/categories')
            .then((res) => setCategories(res.data))
            .catch(() => {})
            .finally(() => setIsCatLoading(false));
    }, []);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close on route change
    useEffect(() => {
        setIsMobileOpen(false);
        setIsCategoryOpen(false);
    }, [pathname]);

    // Click outside to close dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Lock body scroll when mobile drawer open
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-50 w-full transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-2xl border-b border-zinc-200/80 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
                        : 'bg-white/80 backdrop-blur-md border-b border-zinc-100'
                )}
            >
                <div className="container mx-auto h-[72px] flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="p-2 bg-orange-500 rounded-xl shadow-md shadow-orange-500/25"
                        >
                            <UtensilsCrossed className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-[22px] font-display font-bold tracking-tight text-zinc-900">
                            Food<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) =>
                            link.hasDropdown ? (
                                <div key={link.href} className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsCategoryOpen((prev) => !prev)}
                                        className={cn(
                                            'relative px-1 py-2 text-[15px] font-semibold transition-colors duration-200 group flex items-center gap-1',
                                            isActive(link.href) || isCategoryOpen ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                                        )}
                                    >
                                        {link.label}
                                        <motion.span
                                            animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-0.5"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </motion.span>
                                        {/* Underline */}
                                        <span
                                            className={cn(
                                                'absolute -bottom-0.5 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300',
                                                isActive(link.href) || isCategoryOpen ? 'w-full' : 'w-0 group-hover:w-full'
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <CategoryMegaMenu
                                                categories={categories}
                                                onClose={() => setIsCategoryOpen(false)}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <NavLink
                                    key={link.href}
                                    href={link.href}
                                    label={link.label}
                                    isActive={isActive(link.href)}
                                />
                            )
                        )}
                    </nav>

                    {/* ── Right Side ── */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        key="badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <div className="w-px h-5 bg-zinc-200 mx-1" />

                        {loading ? (
                            <div className="w-10 h-10 rounded-full bg-zinc-100 animate-pulse border-2 border-white shadow-sm" />
                        ) : user ? (
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-zinc-50 transition-all duration-300"
                                >
                                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-orange-500/10 border-2 border-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden xl:block text-left mr-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 leading-none mb-1">Welcome back</p>
                                        <p className="text-sm font-bold text-zinc-900 leading-none">{user.name.split(' ')[0]}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:rotate-90 group-hover:text-orange-500 transition-all duration-300" />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                                    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-2xl shadow-zinc-200/50 p-3 mt-4 overflow-hidden">
                                        <div className="px-5 py-4 border-b border-zinc-50 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-black">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-zinc-900 truncate">{user.name}</p>
                                                <p className="text-xs text-zinc-400 font-medium capitalize truncate">{user.role.toLowerCase()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-1 space-y-1">
                                            <Link 
                                                href={user.role === 'ADMIN' ? '/admin' : user.role === 'PROVIDER' ? '/provider/dashboard' : '/dashboard'}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-colors group/item"
                                            >
                                                <LayoutGrid className="w-4 h-4 text-zinc-400 group-hover/item:text-orange-500 transition-colors" />
                                                Dashboard
                                            </Link>
                                            <Link 
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-colors group/item"
                                            >
                                                <User className="w-4 h-4 text-zinc-400 group-hover/item:text-orange-500 transition-colors" />
                                                My Profile
                                            </Link>
                                            <Link 
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-colors group/item"
                                            >
                                                <ShoppingBag className="w-4 h-4 text-zinc-400 group-hover/item:text-orange-500 transition-colors" />
                                                {user.role === 'PROVIDER' ? 'Order Feed' : 'My Orders'}
                                            </Link>
                                        </div>

                                        <div className="mt-1 pt-1 border-t border-zinc-50 p-1">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors group/logout"
                                            >
                                                <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-[15px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-md shadow-zinc-900/10"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── Mobile Right ── */}
                    <div className="flex lg:hidden items-center gap-1.5">
                        <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-zinc-100 transition-colors">
                            <ShoppingCart className="w-5 h-5 text-zinc-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-orange-500 text-white text-[9px] font-black flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-zinc-700" />
                        </button>
                    </div>

                </div>
            </header>

            {/* ─── Mobile Drawer ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                                <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-500 rounded-lg">
                                        <UtensilsCrossed className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg font-display font-bold text-zinc-900">
                                        Food<span className="text-orange-500">Hub</span>
                                    </span>
                                </Link>
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            {/* Links */}
                            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                                {navLinks.map((link) => (
                                    <div key={link.href}>
                                        {link.hasDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => setIsMobileCategoryOpen((v) => !v)}
                                                    className={cn(
                                                        'w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-colors',
                                                        isActive(link.href) ? 'text-orange-500 bg-orange-50' : 'text-zinc-700 hover:bg-zinc-50'
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className={cn(
                                                            'p-1.5 rounded-lg',
                                                            isActive(link.href) ? 'bg-orange-100 text-orange-500' : 'bg-zinc-100 text-zinc-400'
                                                        )}>
                                                            {link.icon}
                                                        </span>
                                                        {link.label}
                                                    </span>
                                                    <motion.span
                                                        animate={{ rotate: isMobileCategoryOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </motion.span>
                                                </button>

                                                <AnimatePresence>
                                                    {isMobileCategoryOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.22 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 pr-2 py-2 grid grid-cols-2 gap-1.5">
                                                                {isCatLoading && (
                                                                    <p className="col-span-2 text-center text-sm text-zinc-400 py-4 font-medium">Loading...</p>
                                                                )}
                                                                {categories.map((cat, i) => {
                                                                    const palette = colorPalette[i % colorPalette.length];
                                                                    return (
                                                                        <Link
                                                                            key={cat.id}
                                                                            href={`/meals?category=${cat.id}`}
                                                                            onClick={() => setIsMobileOpen(false)}
                                                                            className={cn(
                                                                                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors',
                                                                                palette.bg, palette.hover
                                                                            )}
                                                                        >
                                                                            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', palette.dot)} />
                                                                            <span className={cn('text-sm font-semibold truncate', palette.text)}>{cat.name}</span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-colors',
                                                    isActive(link.href) ? 'text-orange-500 bg-orange-50' : 'text-zinc-700 hover:bg-zinc-50'
                                                )}
                                            >
                                                <span className={cn(
                                                    'p-1.5 rounded-lg',
                                                    isActive(link.href) ? 'bg-orange-100 text-orange-500' : 'bg-zinc-100 text-zinc-400'
                                                )}>
                                                    {link.icon}
                                                </span>
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-zinc-100 bg-zinc-50/80">
                                {loading ? (
                                    <div className="flex items-center gap-3 p-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-zinc-200 rounded animate-pulse w-1/2" />
                                            <div className="h-3 bg-zinc-200 rounded animate-pulse w-1/3" />
                                        </div>
                                    </div>
                                ) : user ? (
                                    <div className="space-y-2">
                                        <Link
                                            href={
                                                user.role === 'ADMIN' ? '/admin'
                                                    : user.role === 'PROVIDER' ? '/provider/dashboard'
                                                        : '/orders'
                                            }
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-white rounded-2xl transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black shadow">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                                                <p className="text-xs text-zinc-500 font-medium capitalize">{user.role.toLowerCase()}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsMobileOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex items-center justify-center gap-1.5 py-3 bg-white border border-zinc-200 text-zinc-800 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" /> Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex items-center justify-center py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
