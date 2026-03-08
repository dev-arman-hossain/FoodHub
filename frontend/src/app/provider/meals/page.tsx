'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Meal, Category } from '@/types';
import { Package, Trash2, Edit3, Plus, Search, ChevronRight, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ProviderMealsPage = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: '',
        description: '',
        imageUrl: '',
        isAvailable: true,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mealsRes, catsRes] = await Promise.all([
                api.get('/auth/me'), // To get the meals via providerProfile
                api.get('/categories'),
            ]);
            setMeals(mealsRes.data.data.providerProfile?.meals || []);
            setCategories(catsRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (meal: Meal | null = null) => {
        if (meal) {
            setEditingMeal(meal);
            setFormData({
                name: meal.name,
                categoryId: meal.categoryId,
                price: meal.price.toString(),
                description: meal.description || '',
                imageUrl: meal.imageUrl || '',
                isAvailable: meal.isAvailable,
            });
        } else {
            setEditingMeal(null);
            setFormData({ name: '', categoryId: '', price: '', description: '', imageUrl: '', isAvailable: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, price: Number(formData.price) };
            if (editingMeal) {
                await api.put(`/meals/provider/meals/${editingMeal.id}`, payload);
            } else {
                await api.post('/meals/provider/meals', payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save meal');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this meal?')) return;
        try {
            await api.delete(`/meals/provider/meals/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete meal');
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Menu Management</h1>
                    <p className="text-zinc-500 font-medium text-lg">Curate your premium culinary offerings</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-8 py-4 bg-orange-500 text-white rounded-[24px] font-black text-sm hover:bg-zinc-900 transition-soft shadow-xl shadow-orange-500/20 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" /> Add New Specially
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-zinc-50 animate-pulse rounded-[40px]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {meals.map((meal) => (
                        <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-soft group relative"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-soft duration-700" />
                                <div className="absolute top-4 left-4">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md",
                                        meal.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    )}>
                                        {meal.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-display font-black text-xl text-zinc-900 group-hover:text-orange-500 transition-soft">{meal.name}</h3>
                                    <p className="text-2xl font-display font-black text-zinc-900">{formatPrice(Number(meal.price))}</p>
                                </div>
                                <div className="flex items-center gap-2 pt-4 border-t border-zinc-50">
                                    <button
                                        onClick={() => handleOpenModal(meal)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-soft"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(meal.id)}
                                        className="p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-soft"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
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
                            className="bg-white w-full max-w-2xl rounded-[50px] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-10 border-b border-zinc-50 flex items-center justify-between bg-zinc-950 text-white">
                                <h3 className="text-3xl font-display font-black">{editingMeal ? 'Edit Masterpiece' : 'New Creation'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 border border-white/10 rounded-2xl hover:bg-white/10 transition-soft">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Meal Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Category</label>
                                        <select
                                            required
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft appearance-none"
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Price (USD)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            placeholder="https://..."
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Description</label>
                                        <textarea
                                            className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-4 p-6 bg-zinc-50 rounded-[30px] border border-zinc-100">
                                        <input
                                            type="checkbox"
                                            id="isAvailable"
                                            className="w-6 h-6 rounded-lg text-orange-500 focus:ring-orange-500 accent-orange-500"
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        />
                                        <label htmlFor="isAvailable" className="font-display font-black text-zinc-900 uppercase tracking-widest text-xs">Currently Available for Order</label>
                                    </div>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full py-6 bg-orange-500 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-900 transition-soft shadow-2xl shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        editingMeal ? 'Update Masterpiece' : 'Publish Creation'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProviderMealsPage;
