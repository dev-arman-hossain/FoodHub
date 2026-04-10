import React from 'react';
import { Category } from '@/types';
import { SlidersHorizontal, Star, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
    categories: Category[];
    selectedCategories: string[];
    onCategoryToggle: (id: string) => void;
    priceRange: { min: number, max: number };
    onPriceChange: (min: number, max: number) => void;
    minRating: number;
    onRatingChange: (rating: number) => void;
    isAvailable: boolean;
    onAvailabilityToggle: () => void;
    onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    categories,
    selectedCategories,
    onCategoryToggle,
    priceRange,
    onPriceChange,
    minRating,
    onRatingChange,
    isAvailable,
    onAvailabilityToggle,
    onReset
}) => {
    return (
        <aside className="space-y-10 p-10 bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-50">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                    <h3 className="font-display font-black text-xl text-zinc-900 tracking-tight">Filters</h3>
                </div>
                <button 
                    onClick={onReset}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-soft"
                >
                    Reset
                </button>
            </div>

            {/* Availability */}
            <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Inventory</h4>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-soft">Available Only</span>
                    <button
                        onClick={onAvailabilityToggle}
                        className={cn(
                            "w-12 h-6 rounded-full transition-all duration-300 relative",
                            isAvailable ? "bg-orange-500" : "bg-zinc-200"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                            isAvailable ? "left-7" : "left-1"
                        )} />
                    </button>
                </label>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Specialties</h4>
                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryToggle(cat.id)}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-soft text-left",
                                selectedCategories.includes(cat.id)
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            {cat.name}
                            {selectedCategories.includes(cat.id) && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Budget</h4>
                    <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                        ${priceRange.min} - ${priceRange.max}
                    </span>
                </div>
                <div className="space-y-4">
                    <input 
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange.max}
                        onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <p className="text-[10px] text-zinc-400 font-medium text-center">Slide to adjust maximum price</p>
                </div>
            </div>

            {/* Ratings */}
            <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Min. Rating</h4>
                <div className="flex flex-col gap-2">
                    {[4, 3, 2].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => onRatingChange(rating)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-soft",
                                minRating === rating
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-500 hover:bg-zinc-50"
                            )}
                        >
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={cn(
                                            "w-3 h-3",
                                            i < rating ? "fill-orange-500 text-orange-500" : "fill-zinc-200 text-zinc-200"
                                        )} 
                                    />
                                ))}
                            </div>
                            <span>{rating}+ Stars</span>
                        </button>
                    ))}
                    <button
                        onClick={() => onRatingChange(0)}
                        className={cn(
                            "px-4 py-3 rounded-2xl text-sm font-bold transition-soft",
                            minRating === 0 ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50"
                        )}
                    >
                        Show All
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
