'use client';

import React from 'react';
import { Meal } from '@/types';
import { Star, Clock, Plus, ShoppingBag } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MealCardProps {
    meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const { addItem } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col h-full"
        >
            <Link href={`/meals/${meal.id}`} className="block flex-grow overflow-hidden relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-soft duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1.5 glass rounded-full flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-zinc-900">{meal.avgRating?.toFixed(1) || 'New'}</span>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                            {meal.category?.name || 'Meal'}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 25-35 min
                        </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-zinc-900 leading-tight group-hover:text-orange-500 transition-soft">
                        {meal.name}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-2 font-medium">
                    </p>
                </div>
            </div>
        </Link>

        <div className="p-6 space-y-4 pt-0">
            <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-tighter">Price</span>
                    <span className="text-xl font-display font-black text-zinc-900">{formatPrice(Number(meal.price))}</span>
                </div>
                    <button
                        onClick={() => addItem(meal)}
                        className="flex items-center justify-center p-3 bg-zinc-900 text-white rounded-2xl hover:bg-orange-500 transition-soft group/btn shadow-lg shadow-zinc-900/10"
                    >
                        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-soft" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MealCard;
