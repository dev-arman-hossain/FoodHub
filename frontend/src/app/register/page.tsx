'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User as UserIcon, Store, MapPin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const RegisterPage = () => {
    const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register({ ...formData, role });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-20 bg-zinc-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-10 md:p-14 space-y-10"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-zinc-900">Create Account</h2>
                    <p className="text-zinc-500 font-medium">Choose your journey and join FoodHub</p>
                </div>

                {/* Role Toggle */}
                <div className="flex p-2 bg-zinc-50 rounded-[30px] border border-zinc-100">
                    <button
                        onClick={() => setRole('CUSTOMER')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-sm font-black transition-soft",
                            role === 'CUSTOMER' ? "bg-white text-orange-500 shadow-xl shadow-zinc-200/50 border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        <UserIcon className="w-5 h-5" /> Customer
                    </button>
                    <button
                        onClick={() => setRole('PROVIDER')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-sm font-black transition-soft",
                            role === 'PROVIDER' ? "bg-white text-orange-500 shadow-xl shadow-zinc-200/50 border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        <Store className="w-5 h-5" /> Provider
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1.5">
                        <label className="px-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="px-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {role === 'PROVIDER' && (
                        <>
                            <div className="space-y-1.5">
                                <label className="px-1">Business Name</label>
                                <div className="relative">
                                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                        placeholder="Restaurant Name"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="px-1">Business Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                        placeholder="123 Street Ave"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-zinc-900 text-white rounded-[32px] font-black flex items-center justify-center gap-3 hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm font-bold text-zinc-500">
                    Already have an account? <Link href="/login" className="text-orange-500 hover:text-orange-600">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
