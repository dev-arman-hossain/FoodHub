'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Meal, Review } from '@/types';
import { Star, Clock, ShoppingBag, Plus, Minus, ArrowLeft, Send, CheckCircle2, User as UserIcon } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MealDetailsPage = () => {
    const { id } = useParams();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const { user } = useAuth();

    // Review Form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [orderId, setOrderId] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mealRes, revRes] = await Promise.all([
                    api.get(`/meals/${id}`),
                    api.get(`/meals/${id}/reviews`),
                ]);
                setMeal(mealRes.data.data);
                setReviews(revRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddWithQty = () => {
        if (!meal) return;
        for (let i = 0; i < quantity; i++) {
            addItem(meal);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post(`/meals/${id}/reviews`, { orderId, rating, comment });
            setReviewSuccess(true);
            const revRes = await api.get(`/meals/${id}/reviews`);
            setReviews(revRes.data.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="container mx-auto px-6 py-20 text-center animate-pulse">
            <div className="h-[500px] bg-zinc-50 rounded-[60px]" />
        </div>
    );

    if (!meal) return <div className="text-center py-20">Meal not found.</div>;

    return (
        <div className="pb-20">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 font-bold mb-10 transition-soft group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-soft" /> Back to Browse
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Image Section */}
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="sticky top-32 aspect-[4/4] rounded-[60px] overflow-hidden border border-zinc-100 shadow-2xl shadow-zinc-200/50"
                        >
                            <img
                                src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                alt={meal.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:col-span-6 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-orange-50 text-orange-500 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100">
                                    {meal.category?.name || 'Meal'}
                                </span>
                                <div className="flex items-center gap-1.5 text-zinc-900 font-black text-sm">
                                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    {meal.avgRating?.toFixed(1) || '0.0'} <span className="text-zinc-400 font-bold">({reviews.length} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-display font-black text-zinc-900 tracking-tight leading-tight">
                                {meal.name}
                            </h1>

                            <p className="text-xl text-zinc-500 font-medium leading-relaxed">
                                {meal.description || 'Our signature dish prepared with hand-selected ingredients and authentic spices for an unforgettable culinary experience.'}
                            </p>
                        </div>

                        <div className="flex items-end gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400 pb-2">Price</span>
                            <span className="text-5xl font-display font-black text-zinc-900">{formatPrice(Number(meal.price))}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <div className="flex items-center gap-4 p-2 bg-zinc-50 rounded-[30px] border border-zinc-100 w-full sm:w-auto overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-zinc-900 hover:text-orange-500 transition-soft shadow-sm active:scale-90"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-12 text-center text-xl font-display font-black text-zinc-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-zinc-900 hover:text-orange-500 transition-soft shadow-sm active:scale-90"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddWithQty}
                                className="flex-grow sm:flex-grow-0 px-10 py-5 bg-zinc-950 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-500 transition-soft shadow-2xl shadow-zinc-900/10 active:scale-95"
                            >
                                <ShoppingBag className="w-6 h-6" /> Add to Order
                            </button>
                        </div>

                        {/* Provider Card */}
                        <div className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100 flex items-center gap-6 group cursor-pointer hover:bg-white hover:border-orange-200 transition-soft">
                            <div className="w-20 h-20 bg-zinc-950 rounded-[28px] flex items-center justify-center p-3 transition-soft group-hover:rotate-6">
                                {meal.provider?.logoUrl ? <img src={meal.provider.logoUrl} alt="" className="w-full h-full object-contain" /> : <Clock className="w-8 h-8 text-white" />}
                            </div>
                            <div className="space-y-1 flex-grow">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Prepared by</p>
                                <h3 className="font-display font-black text-2xl text-zinc-900">{meal.provider?.businessName || 'Elite Provider'}</h3>
                                <p className="text-sm text-zinc-500 font-medium">Verified local culinary partner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="bg-zinc-50 pt-32 pb-20">
                <div className="container mx-auto px-6 space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight">Community Reviews</h2>
                            <p className="text-zinc-500 font-medium text-lg">What others think about this gourmet experience</p>
                        </div>
                        {user?.role === 'CUSTOMER' && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="px-8 py-4 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-sm hover:border-orange-500 hover:text-orange-500 transition-soft shadow-sm"
                            >
                                Rate this meal
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white p-10 md:p-14 rounded-[50px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 max-w-3xl mx-auto"
                            >
                                {reviewSuccess ? (
                                    <div className="text-center space-y-6 py-10">
                                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-display font-black text-zinc-900">Review Submitted!</h3>
                                        <p className="text-zinc-500 font-medium italic">Thank you for sharing your experience with the community.</p>
                                        <button onClick={() => { setShowReviewForm(false); setReviewSuccess(false); }} className="text-orange-500 font-black">Close</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="space-y-8">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-display font-black text-zinc-900">Share Your Experience</h3>
                                            <p className="text-zinc-400 font-medium">Your feedback helps providers improve their service</p>
                                        </div>

                                        <div className="space-y-4 text-center">
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Your Rating</p>
                                            <div className="flex justify-center gap-4">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setRating(s)}
                                                        className={cn(
                                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-soft",
                                                            s <= rating ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-zinc-50 text-zinc-300"
                                                        )}
                                                    >
                                                        <Star className={cn("w-6 h-6", s <= rating ? "fill-current" : "")} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Order ID (from your history)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Paste your order ID here"
                                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                                                    value={orderId}
                                                    onChange={(e) => setOrderId(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2">Comment</label>
                                                <textarea
                                                    rows={4}
                                                    required
                                                    placeholder="Describe your experience with the food, presentation, and preparation..."
                                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowReviewForm(false)}
                                                className="flex-1 py-5 bg-zinc-100 text-zinc-500 rounded-[30px] font-black hover:bg-zinc-200 transition-soft"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="flex-[2] py-5 bg-orange-500 text-white rounded-[30px] font-black flex items-center justify-center gap-3 hover:bg-zinc-900 transition-soft shadow-xl shadow-orange-500/20"
                                            >
                                                Submit Review <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews.length > 0 ? (
                            reviews.map((rev) => (
                                <motion.div
                                    key={rev.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-10 bg-white rounded-[40px] border border-zinc-100 flex flex-col justify-between space-y-6 hover:border-orange-200 transition-soft"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-display font-bold text-zinc-900 leading-none">{rev.customer?.name}</h4>
                                                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-1">Verified Purchase</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-3.5 h-3.5", i < rev.rating ? "text-orange-500 fill-orange-500" : "text-zinc-100")} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-zinc-600 font-medium leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                                        Posted {new Date(rev.createdAt).toLocaleDateString()}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center space-y-4 bg-zinc-100/50 rounded-[40px] border border-dashed border-zinc-200">
                                <Star className="w-10 h-10 text-zinc-200 mx-auto" />
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No reviews yet for this meal</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MealDetailsPage;
