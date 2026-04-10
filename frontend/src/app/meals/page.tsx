'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Meal, Category } from '@/types';
import api from '@/lib/axios';
import { apiFetch } from '@/lib/api-fetch';
import MealCard from '@/components/meals/MealCard';
import { Search, Utensils, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '@/components/shared/CardSkeleton';
import FilterSidebar from '@/components/meals/FilterSidebar';
import ActiveFilters from '@/components/meals/ActiveFilters';
import Pagination from '@/components/shared/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Filter, X } from 'lucide-react';

const MealsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // -- State from URL --
    const initialCategory = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const initialSearch = searchParams.get('search') || '';
    const initialSort = searchParams.get('sort') || 'newest';
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialMinPrice = Number(searchParams.get('minPrice')) || 0;
    const initialMaxPrice = Number(searchParams.get('maxPrice')) || 200;
    const initialRating = Number(searchParams.get('minRating')) || 0;
    const initialAvailable = searchParams.get('available') !== 'false';

    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory);
    const [search, setSearch] = useState(initialSearch);
    const [sortBy, setSortBy] = useState(initialSort);
    const [page, setPage] = useState(initialPage);
    const [priceRange, setPriceRange] = useState({ min: initialMinPrice, max: initialMaxPrice });
    const [minRating, setMinRating] = useState(initialRating);
    const [isAvailable, setIsAvailable] = useState(initialAvailable);
    
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategories.length) params.set('category', selectedCategories.join(','));
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (sortBy !== 'newest') params.set('sort', sortBy);
        if (page > 1) params.set('page', page.toString());
        if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
        if (priceRange.max < 200) params.set('maxPrice', priceRange.max.toString());
        if (minRating > 0) params.set('minRating', minRating.toString());
        if (!isAvailable) params.set('available', 'false');

        const query = params.toString();
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    }, [selectedCategories, debouncedSearch, sortBy, page, priceRange, minRating, isAvailable]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mealsData, catsData] = await Promise.all([
                    apiFetch<any>('/meals', {
                        params: {
                            categoryId: selectedCategories.length ? selectedCategories.join(',') : undefined,
                            search: debouncedSearch || undefined,
                            sortBy,
                            minRating: minRating || undefined,
                            maxPrice: priceRange.max < 200 ? priceRange.max : undefined,
                            isAvailable: isAvailable || undefined,
                            page,
                            limit: 8,
                        },
                        next: { revalidate: 60 }
                    }),
                    apiFetch<any>('/categories', {
                        next: { revalidate: 3600 }
                    }),
                ]);
                setMeals(mealsData.data);
                setMeta(mealsData.meta);
                setCategories(catsData.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCategories, debouncedSearch, sortBy, page, priceRange.max, minRating, isAvailable]);

    const handleCategoryToggle = (id: string) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
        setPage(1);
    };

    const handleRemoveFilter = (key: string, value: string) => {
        if (key === 'category') handleCategoryToggle(value);
        if (key === 'search') setSearch('');
        if (key === 'rating') setMinRating(0);
        if (key === 'maxPrice') setPriceRange({ ...priceRange, max: 200 });
        setPage(1);
    };

    const activeFilterList = [
        ...selectedCategories.map(id => ({
            key: 'category',
            value: id,
            label: categories.find(c => c.id === id)?.name || 'Category'
        })),
        ...(debouncedSearch ? [{ key: 'search', value: debouncedSearch, label: `Search: ${debouncedSearch}` }] : []),
        ...(minRating > 0 ? [{ key: 'rating', value: minRating.toString(), label: `${minRating}+ Stars` }] : []),
        ...(priceRange.max < 200 ? [{ key: 'maxPrice', value: priceRange.max.toString(), label: `Under $${priceRange.max}` }] : []),
    ];

    return (
        <div className="min-h-screen bg-zinc-50 pt-10 pb-20">
            <div className="container mx-auto px-6 space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 pb-12">
                    <div className="space-y-3">
                        <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">Exquisite Selection</span>
                        <h1 className="text-6xl font-display font-black text-zinc-900 tracking-tighter leading-none">Browse Our <span className="text-orange-500">Menu</span></h1>
                        <p className="text-zinc-500 font-medium text-lg max-w-xl">
                            Taste the excellence of local culinary masters.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-soft" />
                            <input
                                type="text"
                                placeholder="Search by meal name..."
                                className="w-full pl-14 pr-8 py-5 bg-white border border-zinc-100 rounded-[2rem] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-xl shadow-zinc-200/20 font-medium"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        
                        <div className="relative group">
                            <select 
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                className="appearance-none pl-6 pr-12 py-5 bg-white border border-zinc-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-zinc-900 focus:outline-none focus:border-orange-500 shadow-xl shadow-zinc-200/20 cursor-pointer min-w-[200px]"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Top Rated</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-orange-500 transition-soft" />
                        </div>

                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden p-5 bg-zinc-900 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-zinc-900/20 active:scale-95 transition-soft"
                        >
                            <Filter className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <ActiveFilters 
                    filters={activeFilterList} 
                    onRemove={handleRemoveFilter} 
                    onClearAll={() => {
                        setSelectedCategories([]);
                        setSearch('');
                        setMinRating(0);
                        setPriceRange({ min: 0, max: 200 });
                        setPage(1);
                        setIsAvailable(true);
                    }} 
                />

                {/* Filters & Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-32">
                        <FilterSidebar 
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryToggle={handleCategoryToggle}
                            priceRange={priceRange}
                            onPriceChange={(min, max) => { setPriceRange({ min, max }); setPage(1); }}
                            minRating={minRating}
                            onRatingChange={(r) => { setMinRating(r); setPage(1); }}
                            isAvailable={isAvailable}
                            onAvailabilityToggle={() => { setIsAvailable(!isAvailable); setPage(1); }}
                            onReset={() => {
                                setSelectedCategories([]);
                                setMinRating(0);
                                setPriceRange({ min: 0, max: 200 });
                                setPage(1);
                                setIsAvailable(true);
                            }}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="lg:col-span-9 space-y-12">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : meals.length > 0 ? (
                            <>
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    <AnimatePresence mode='popLayout'>
                                        {meals.map((meal) => (
                                            <motion.div
                                                key={meal.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <MealCard meal={meal} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                                <Pagination 
                                    currentPage={meta.page} 
                                    totalPages={meta.totalPages} 
                                    onPageChange={setPage} 
                                />
                            </>
                        ) : (
                            <div className="min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[50px] border border-zinc-100 shadow-xl shadow-zinc-200/10">
                                <div className="w-40 h-40 bg-zinc-50 rounded-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 animate-ping bg-orange-100/50 rounded-full scale-150 opacity-20" />
                                    <Utensils className="w-16 h-16 text-zinc-200" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-4xl font-display font-black text-zinc-900 tracking-tight">No flavors found</h3>
                                    <p className="text-zinc-500 font-medium text-lg max-w-sm">
                                        We couldn't find any masterpieces matching your current palette.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSearch('');
                                        setMinRating(0);
                                        setPriceRange({ min: 0, max: 200 });
                                        setPage(1);
                                        setIsAvailable(true);
                                    }}
                                    className="px-10 py-5 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-zinc-900/20"
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white z-[101] shadow-2xl p-6 overflow-y-auto no-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-display font-black">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-zinc-50 rounded-xl">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <FilterSidebar 
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryToggle={handleCategoryToggle}
                                priceRange={priceRange}
                                onPriceChange={(min, max) => { setPriceRange({ min, max }); setPage(1); }}
                                minRating={minRating}
                                onRatingChange={(r) => { setMinRating(r); setPage(1); }}
                                isAvailable={isAvailable}
                                onAvailabilityToggle={() => { setIsAvailable(!isAvailable); setPage(1); }}
                                onReset={() => {
                                    setSelectedCategories([]);
                                    setMinRating(0);
                                    setPriceRange({ min: 0, max: 200 });
                                    setPage(1);
                                    setIsAvailable(true);
                                }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
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
