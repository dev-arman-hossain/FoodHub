'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 animate-pulse">
                <div className="h-40 bg-zinc-100 rounded-[32px]" />
                <div className="h-[400px] bg-zinc-50 rounded-[40px]" />
            </div>
        </DashboardLayout>
    );

    if (!user) return (
        <DashboardLayout>
            <div className="p-20 text-center">Failed to load profile.</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 space-y-12 pb-24 max-w-4xl mx-auto">
                <header className="space-y-3">
                    <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">Account details</span>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-zinc-900 tracking-tight">Your <span className="text-orange-500">Profile</span></h1>
                    <p className="text-zinc-500 font-medium text-lg">Manage your personal information and preferences.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="md:col-span-1 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-zinc-900/20">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-black text-zinc-900">{user.name}</h2>
                                <span className={`inline-block px-4 py-1.5 mt-3 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    user.role === 'ADMIN' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    user.role === 'PROVIDER' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                    {user.role} ACCOUNT
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="md:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-8"
                        >
                            <h3 className="text-xl font-display font-black text-zinc-900 border-b border-zinc-50 pb-4">Personal Details</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Full Name</p>
                                        <p className="text-lg font-bold text-zinc-900">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-lg font-bold text-zinc-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Member Since</p>
                                        <p className="text-lg font-bold text-zinc-900">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            <p className="text-lg font-bold text-zinc-900">{user.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
