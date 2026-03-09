'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Meal, Category } from '@/types';
import api from '@/lib/axios';
import MealCard from '@/components/meals/MealCard';
import { Search, Utensils, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MealsContent = () => {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');

    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mealsRes, catsRes] = await Promise.all([
                    api.get('/meals', {
                        params: {
                            categoryId: selectedCategory || undefined,
                            search: search || undefined,
                        },
                    }),
                    api.get('/categories'),
                ]);
                setMeals(mealsRes.data.data);
                setCategories(catsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCategory, search]);

    return (
        <div className="min-h-screen bg-zinc-50 pt-10 pb-20">
            <div className="container mx-auto px-6 space-y-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Exquisite Selection</span>
                        <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Browse Our <span className="text-orange-500">Menu</span></h1>
                        <p className="text-zinc-500 font-medium text-lg max-w-xl">
                            Discover a world of flavors from top-rated local providers,
                            delivered right to your doorstep.
                        </p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Find your next favorite meal..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-zinc-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                {/* Filters & Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                    {/* Sidebar Filters */}
                    <aside className="lg:sticky lg:top-32 space-y-8 p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                        <div className="flex items-center gap-2 pb-4 border-b border-zinc-50">
                            <SlidersHorizontal className="w-5 h-5 text-zinc-400" />
                            <h3 className="font-display font-bold text-zinc-900">Filters</h3>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Categories</h4>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all",
                                        selectedCategory === null
                                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all",
                                            selectedCategory === cat.id
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-[420px] bg-white border border-zinc-100 animate-pulse rounded-[32px]" />
                                ))}
                            </div>
                        ) : meals.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {meals.map((meal) => (
                                        <motion.div
                                            key={meal.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <MealCard meal={meal} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[40px] border-2 border-dashed border-zinc-100">
                                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center">
                                    <Utensils className="w-10 h-10 text-zinc-200" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display font-bold text-zinc-900">No meals found</h3>
                                    <p className="text-zinc-500 font-medium max-w-sm">
                                        We couldn't find any meals matching your current selection.
                                        Try adjusting your filters or search.
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setSelectedCategory(null); setSearch(''); }}
                                    className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:scale-105 transition-all text-sm"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BrowseMeals = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading meals...</div>}>
            <MealsContent />
        </Suspense>
    );
};

export default BrowseMeals;
