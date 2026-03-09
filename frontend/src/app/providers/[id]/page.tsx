'use client';

import React, { useEffect, useState, use } from 'react';
import api from '@/lib/axios';
import { Meal } from '@/types';
import MealCard from '@/components/meals/MealCard';
import { MapPin, Info, Store, Star, Clock, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

const ProviderDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const res = await api.get(`/meals/providers/${id}`);
                setProvider(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 pt-20">
                <div className="container mx-auto px-6 space-y-12 animate-pulse">
                    <div className="h-[400px] bg-zinc-200 rounded-[3rem]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-96 bg-zinc-100 rounded-[2.5rem]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Provider not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            {/* Header Hero */}
            <header className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={provider.logoUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80"}
                        alt={provider.businessName}
                        className="w-full h-full object-cover scale-110 blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-950/40 to-black/20" />
                </div>

                <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-16 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl space-y-6"
                    >
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/30">
                                Verified Partner
                            </span>
                            <span className="px-4 py-1.5 bg-zinc-900/80 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                ★ 4.9 Rating
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none">
                            {provider.businessName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-zinc-100 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span>{provider.address || "Location Hidden"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span>30 - 45 min Delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Info Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 text-zinc-900 border-b border-zinc-50 pb-4">
                                <Info className="w-5 h-5 text-orange-500" />
                                <h3 className="font-display font-black tracking-tight">About</h3>
                            </div>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                {provider.description || "Indulge in a world-class dining experience. Our kitchen specializes in premium artisanal cuisine, using only the freshest locally-sourced ingredients to ensure every bite is a celebration of flavor and tradition."}
                            </p>
                        </section>

                        <section className="bg-zinc-900 p-8 rounded-[2.5rem] text-white space-y-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                                <Store className="w-5 h-5 text-orange-500" />
                                <h3 className="font-display font-black tracking-tight">Provider Meta</h3>
                            </div>
                            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                <li className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                                    <span>Chef name</span>
                                    <span className="text-white">{provider.user.name}</span>
                                </li>
                                <li className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                                    <span>Contact</span>
                                    <span className="text-white lowercase">{provider.user.email}</span>
                                </li>
                                <li className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                                    <span>Total Dishes</span>
                                    <span className="text-white">{provider.meals?.length || 0}</span>
                                </li>
                            </ul>
                        </section>
                    </aside>

                    {/* Menu Section */}
                    <main className="lg:col-span-3 space-y-12">
                        <div className="flex items-end gap-3 px-4">
                            <div className="p-3 bg-orange-500 rounded-2xl">
                                <UtensilsCrossed className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight">The Signature Menu</h2>
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Exclusively available for delivery</p>
                            </div>
                        </div>

                        {provider.meals && provider.meals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                {provider.meals.map((meal: Meal) => (
                                    <MealCard key={meal.id} meal={meal} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-96 bg-zinc-50 border-4 border-dashed border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
                                <UtensilsCrossed className="w-12 h-12 text-zinc-300" />
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-display font-bold text-zinc-900">No dishes yet</h3>
                                    <p className="text-zinc-500 font-medium">This provider hasn't listed any meals for the season yet.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetail;
