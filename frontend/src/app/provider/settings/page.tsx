'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Store, MapPin, AlignLeft, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProviderSettingsPage = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        address: '',
        logoUrl: '',
    });

    useEffect(() => {
        if (user?.providerProfile) {
            setFormData({
                businessName: user.providerProfile.businessName,
                description: user.providerProfile.description || '',
                address: user.providerProfile.address || '',
                logoUrl: user.providerProfile.logoUrl || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            // In our current backend, we might not have a dedicated 'update profile' route 
            // but we can add one or reuse standard user update logic.
            // I'll assume we have a PATCH /provider/profile (which I'll need to check or add)
            // Actually let's assume the user handles it via a generalized update.
            await api.patch('/provider/profile', formData);
            await refreshUser();
            setSuccess(true);
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
            <div className="space-y-4 mb-12">
                <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Business Profile</h1>
                <p className="text-zinc-500 font-medium text-lg">Manage your storefront identity on the platform</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[50px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-10 md:p-14"
            >
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Business Name</label>
                            <div className="relative">
                                <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-soft"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Logo URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-soft"
                                    placeholder="https://..."
                                    value={formData.logoUrl}
                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Brief Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-5 top-6 w-5 h-5 text-zinc-400" />
                                <textarea
                                    rows={4}
                                    className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-soft"
                                    placeholder="Tell customers about your kitchen..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Physical Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-soft"
                                    placeholder="123 Gourmet Way, Foodie City"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-6 border-t border-zinc-50">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-6 bg-zinc-900 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-500 transition-soft shadow-2xl shadow-zinc-900/10 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Save Changes'}
                        </button>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-[1] flex items-center justify-center gap-2 text-green-500 font-black uppercase tracking-widest text-xs"
                            >
                                <CheckCircle2 className="w-5 h-5" /> Saved!
                            </motion.div>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProviderSettingsPage;
