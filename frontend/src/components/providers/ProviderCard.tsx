'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Utensils, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProviderCardProps {
    provider: {
        id: string;
        businessName: string;
        description: string | null;
        logoUrl: string | null;
        address: string | null;
        user: {
            name: string;
        };
        meals?: any[];
    };
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 h-full flex flex-col"
        >
            {/* Header / Cover Image Aspect */}
            <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                <img
                    src={provider.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"}
                    alt={provider.businessName}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-xl border border-white/50">
                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-black text-zinc-900">4.9</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                    <h3 className="text-2xl font-display font-black text-zinc-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                        {provider.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold uppercase tracking-wider truncate">
                            {provider.address || 'Location Hidden'}
                        </span>
                    </div>
                </div>

                <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed">
                    {provider.description || "The finest culinary experience crafted with passion and traditional recipes from our expert chefs."}
                </p>

                {/* Tags / Stats */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1.5 bg-zinc-50 text-zinc-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-zinc-100 flex items-center gap-1.5">
                        <Utensils className="w-3 h-3" />
                        {provider.meals?.length || 0} Meals
                    </span>
                    <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-orange-100">
                        Top Rated
                    </span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex -space-x-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${provider.id}${i}`} alt="Customer" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white">
                            +12
                        </div>
                    </div>

                    <Link
                        href={`/providers/${provider.id}`}
                        className="flex items-center gap-2 text-sm font-black text-zinc-900 group-hover:gap-4 transition-all"
                    >
                        View Menu <ArrowRight className="w-4 h-4 text-orange-500" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProviderCard;
