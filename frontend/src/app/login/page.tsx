'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-20 bg-zinc-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-10 md:p-14 space-y-10"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight">Welcome Back</h2>
                    <p className="text-zinc-500 font-medium">Log in to your FoodHub account</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Password</label>
                            <Link href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-soft font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-zinc-900 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm font-bold text-zinc-500">
                    Don&apos;t have an account? <Link href="/register" className="text-orange-500 hover:text-orange-600">Join now</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
