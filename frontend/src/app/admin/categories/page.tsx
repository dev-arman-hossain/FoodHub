'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Category } from '@/types';
import { Plus, Trash2, Edit3, X, Loader2, Image as ImageIcon, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', imageUrl: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cat: Category | null = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({ name: cat.name, imageUrl: cat.imageUrl || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                await api.put(`/admin/categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/admin/categories', formData);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            alert('Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This may affect meals using this category.')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Taxonomy Control</h1>
                    <p className="text-zinc-500 font-medium text-lg">Manage platform-wide food categories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-8 py-4 bg-zinc-900 text-white rounded-[24px] font-black text-sm hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" /> New Category
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-zinc-50 animate-pulse rounded-3xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-[40px] border border-zinc-100 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:shadow-zinc-200/50 transition-soft group relative overflow-hidden"
                        >
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center p-4 group-hover:bg-orange-50 transition-soft overflow-hidden">
                                {cat.imageUrl ? <img src={cat.imageUrl} alt="" className="w-full h-full object-contain" /> : <ImageIcon className="w-8 h-8 text-zinc-200" />}
                            </div>
                            <h3 className="font-display font-black text-lg text-zinc-900 leading-tight">{cat.name}</h3>

                            <div className="flex items-center gap-2 pt-4 w-full">
                                <button onClick={() => handleOpenModal(cat)} className="flex-1 p-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white rounded-2xl transition-soft">
                                    <Edit3 className="w-4 h-4 mx-auto" />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="flex-1 p-3 bg-red-50 text-red-100 hover:text-red-500 rounded-2xl transition-soft">
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[50px] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                                <h3 className="text-3xl font-display font-black text-zinc-900">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-soft">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Category Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Icon/Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            placeholder="https://..."
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full py-6 bg-orange-500 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-900 transition-soft shadow-2xl shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        editingCategory ? 'Update Category' : 'Create Category'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default AdminCategoriesPage;
