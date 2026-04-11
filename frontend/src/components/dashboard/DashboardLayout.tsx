'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-50/50">
            {/* Desktop Sidebar */}
            <DashboardSidebar className="hidden lg:flex" />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[99] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 z-[100] lg:hidden"
                        >
                            <DashboardSidebar className="h-full border-r shadow-2xl" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 sticky top-0 z-40">
                    <span className="font-display font-black text-lg">Dashboard</span>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 bg-zinc-900 text-white rounded-xl shadow-lg shadow-zinc-900/10"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
