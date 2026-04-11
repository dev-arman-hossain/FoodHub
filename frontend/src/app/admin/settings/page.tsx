'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettingsPage = () => {
    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-12 md:py-20 space-y-12 max-w-4xl">
                <header className="space-y-3">
                    <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px]">System Preferences</span>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-zinc-900 tracking-tight">Global <span className="text-orange-500">Settings</span></h1>
                    <p className="text-zinc-500 font-medium text-lg">Configure platform-wide rules, defaults, and system behaviors.</p>
                </header>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-12 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-10"
                >
                    <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-orange-900">Work in Progress</h4>
                            <p className="text-orange-700 font-medium mt-1">This module is currently under development. Detailed configuration options will be available in a future update.</p>
                        </div>
                    </div>

                    <div className="space-y-8 opacity-75 grayscale pointer-events-none">
                        <div className="space-y-4">
                            <h3 className="text-xl font-display font-black text-zinc-900 border-b border-zinc-100 pb-2">General Configurations</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Platform Name</label>
                                    <input type="text" disabled value="FoodHub" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Support Email</label>
                                    <input type="text" disabled value="support@foodhub.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-500 font-medium" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-display font-black text-zinc-900 border-b border-zinc-100 pb-2">Operational Limits</h3>
                            
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div>
                                    <h4 className="font-bold text-zinc-900">New Provider Registrations</h4>
                                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Allow new kitchens to join</p>
                                </div>
                                <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettingsPage;
