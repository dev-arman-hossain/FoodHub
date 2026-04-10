'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { apiFetch } from '@/lib/api-fetch';
import ProviderCard from '@/components/providers/ProviderCard';
import { Search, MapPin, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '@/components/shared/CardSkeleton';

const ProvidersPage = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await apiFetch<any>('/meals/providers', {
                    next: { revalidate: 60 }
                });
                setProviders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, []);

    const filteredProviders = providers.filter(p =>
        p.businessName.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Hero Section */}
            <section className="bg-zinc-950 pt-20 pb-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50" />

                <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-sm">Local Partners</span>
                        <h1 className="text-6xl md:text-7xl font-display font-black text-white tracking-tight">
                            Meet Our <span className="heading-gradient italic">Providers.</span>
                        </h1>
                        <p className="text-zinc-400 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                            We partner with the finest local kitchens to bring authentic, high-quality
                            culinary experiences directly to your doorstep.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by restaurant name, cuisine, or location..."
                                className="w-full pl-16 pr-8 py-6 bg-white border-0 rounded-[2rem] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-2xl transition-all text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* List Section */}
            <div className="container mx-auto px-6 -mt-20 relative z-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredProviders.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredProviders.map((provider) => (
                                <motion.div
                                    key={provider.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ProviderCard provider={provider} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[4rem] border border-zinc-100 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center">
                            <Store className="w-10 h-10 text-zinc-200" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-display font-black text-zinc-900">No providers found</h3>
                            <p className="text-zinc-500 font-medium max-w-md mx-auto">
                                We couldn't find any food providers matching "{search}".
                                Please try another search term or browse our main menu.
                            </p>
                        </div>
                        <button
                            onClick={() => setSearch('')}
                            className="px-10 py-4 bg-orange-500 text-white rounded-[2rem] font-black hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                        >
                            View All Partners
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Quick Stats / Info Section */}
            <section className="container mx-auto px-6 mt-32">
                <div className="bg-zinc-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <div className="space-y-4">
                            <div className="text-5xl font-display font-black text-white">50+</div>
                            <div className="text-orange-500 font-bold uppercase tracking-widest text-xs">Curated Partners</div>
                            <p className="text-zinc-500 font-medium">Only the highest rated local kitchens meet our strict quality standards.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-5xl font-display font-black text-white">2.5k</div>
                            <div className="text-orange-500 font-bold uppercase tracking-widest text-xs">Daily Orders</div>
                            <p className="text-zinc-500 font-medium">Our community trust us to deliver hundreds of gourmet meals every day.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-5xl font-display font-black text-white">30min</div>
                            <div className="text-orange-500 font-bold uppercase tracking-widest text-xs">Avg. Delivery</div>
                            <p className="text-zinc-500 font-medium">Ultra-efficient logistics network ensuring your food arrives fresh and hot.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProvidersPage;
