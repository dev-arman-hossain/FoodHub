'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Meal, Review } from '@/types';
import { 
    Star, Clock, ShoppingBag, Plus, Minus, ArrowLeft, Send, 
    CheckCircle2, User as UserIcon, Heart, Share2, Info, 
    Flame, Globe, Users, ChevronRight, MessageSquare 
} from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MealSkeleton from '@/components/meals/MealSkeleton';
import MealCard from '@/components/meals/MealCard';

const MealDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [relatedMeals, setRelatedMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const { addItem } = useCart();
    const { user } = useAuth();

    // Review Form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [mealRes, revRes] = await Promise.all([
                api.get(`/meals/${id}`),
                api.get(`/reviews/${id}`),
            ]);
            
            const currentMeal = mealRes.data.data;
            setMeal(currentMeal);
            setReviews(revRes.data.data);

            // Fetch related meals from the same category
            if (currentMeal.categoryId) {
                const relatedRes = await api.get('/meals', {
                    params: { categoryId: currentMeal.categoryId, limit: 5 }
                });
                
                // The API returns the array directly in data when using sendResponse for getAllMeals
                const relatedData = relatedRes.data.data;
                if (Array.isArray(relatedData)) {
                    setRelatedMeals(relatedData.filter((m: Meal) => m.id !== id).slice(0, 4));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        setLoading(true);
        fetchData();
        
        // Check wishlist status
        const wishlist = JSON.parse(localStorage.getItem('foodhub_wishlist') || '[]');
        setIsWishlisted(wishlist.includes(id));
    }, [id, fetchData]);

    const handleAddWithQty = () => {
        if (!meal) return;
        for (let i = 0; i < quantity; i++) {
            addItem(meal);
        }
    };

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('foodhub_wishlist') || '[]');
        let newWishlist;
        if (wishlist.includes(id)) {
            newWishlist = wishlist.filter((item: string) => item !== id);
            setIsWishlisted(false);
        } else {
            newWishlist = [...wishlist, id];
            setIsWishlisted(true);
        }
        localStorage.setItem('foodhub_wishlist', JSON.stringify(newWishlist));
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // We could use a toast here if available, for now simple alert or transient state
        alert('Internal Link copied to clipboard!');
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
             // orderId is now internal to backend finding logic
            await api.post(`/reviews/${id}`, { rating, comment });
            setReviewSuccess(true);
            
            // Refetch data to update review count and list
            const revRes = await api.get(`/reviews/${id}`);
            setReviews(revRes.data.data);
            
            // Optionally update meal rating stats locally if we don't want a full re-fetch of meal
            const mealRes = await api.get(`/meals/${id}`);
            setMeal(mealRes.data.data);

        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <MealSkeleton />;

    if (!meal) return (
        <div className="container mx-auto px-6 py-40 text-center">
            <h2 className="text-3xl font-display font-black text-zinc-900 mb-4">Oops!</h2>
            <p className="text-lg text-zinc-500 mb-8">This delicious meal seems to have escaped our kitchen.</p>
            <Link href="/" className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black transition-soft">
                Back to Browse
            </Link>
        </div>
    );

    const images = meal.galleryImages && meal.galleryImages.length > 0 
        ? [meal.imageUrl, ...meal.galleryImages].filter(Boolean) as string[]
        : [meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'];

    return (
        <div className="pb-32 bg-white">
            <div className="container mx-auto px-6 py-8 lg:py-16">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 font-bold transition-soft group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-soft" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleShare}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-50 rounded-2xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-soft active:scale-90"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={toggleWishlist}
                            className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-2xl transition-soft active:scale-90",
                                isWishlisted ? "bg-red-50 text-red-500 border border-red-100" : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* 1. Image Gallery */}
                    <div className="lg:col-span-6 space-y-6">
                        <motion.div
                            key={activeImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative group aspect-[4/4] lg:aspect-square rounded-[40px] lg:rounded-[60px] overflow-hidden border border-zinc-100 shadow-2xl shadow-zinc-200/40 max-h-[450px] lg:max-h-none"
                        >
                            <img
                                src={images[activeImageIndex]}
                                alt={meal.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {!meal.isAvailable && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="px-8 py-3 bg-zinc-900 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transform -rotate-2">
                                        Sold Out
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {images.length > 1 && (
                            <div className="flex gap-4 p-2 bg-zinc-50 rounded-[32px] border border-zinc-100 overflow-x-auto no-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={cn(
                                            "relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                            activeImageIndex === idx ? "border-orange-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Overview Section */}
                    <div className="lg:col-span-6 space-y-10">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-5 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {meal.category?.name || 'Gourmet'}
                                </span>
                                <div className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-xs border border-orange-100">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {meal.avgRating?.toFixed(1) || '0.0'}
                                    <span className="text-orange-300 mx-1">|</span>
                                    {reviews.length} reviews
                                </div>
                                {meal.isAvailable ? (
                                    <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-zinc-900 mb-2">
                                {meal.name}
                            </h1>

                            <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-2xl">
                                {meal.description || 'Experience culinary perfection with this masterfully prepared dish, featuring sustainable local ingredients and a secret blend of heritage spices.'}
                            </p>
                        </div>

                        <div className="flex items-end gap-3 pb-4">
                            <span className="text-3xl md:text-4xl font-display font-black text-zinc-900">
                                {formatPrice(Number(meal.price))}
                            </span>
                            <span className="text-zinc-400 font-bold mb-2 lg:mb-4">/ meal</span>
                        </div>

                        {/* 3. Specs Section */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-2 group hover:bg-white hover:border-orange-200 transition-soft">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm transition-transform group-hover:scale-110">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Time</p>
                                    <p className="text-sm font-bold text-zinc-900 mt-1">{meal.preparationTime || '25-30 min'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-2 group hover:bg-white hover:border-orange-200 transition-soft">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm transition-transform group-hover:scale-110">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Serves</p>
                                    <p className="text-sm font-bold text-zinc-900 mt-1">{meal.servingSize || '1-2 Person'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-2 group hover:bg-white hover:border-orange-200 transition-soft">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm transition-transform group-hover:scale-110">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Spicy</p>
                                    <p className="text-sm font-bold text-zinc-900 mt-1">{meal.spiceLevel || 'Medium'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-2 group hover:bg-white hover:border-orange-200 transition-soft">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm transition-transform group-hover:scale-110">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Cuisine</p>
                                    <p className="text-sm font-bold text-zinc-900 mt-1">{meal.cuisineType || 'International'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Desk (Mobile is sticky) */}
                        <div className="hidden lg:flex items-center gap-6 pt-6">
                            <div className="flex items-center gap-4 p-2 bg-zinc-50 rounded-[30px] border border-zinc-100">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-zinc-900 hover:text-orange-500 transition-soft shadow-sm active:scale-90"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-10 text-center text-2xl font-black text-zinc-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-zinc-900 hover:text-orange-500 transition-soft shadow-sm active:scale-90"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddWithQty}
                                disabled={!meal.isAvailable}
                                className={cn(
                                    "flex-grow px-12 py-5 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl shadow-zinc-900/10 active:scale-95",
                                    meal.isAvailable 
                                        ? "bg-zinc-950 text-white hover:bg-orange-600 hover:shadow-orange-500/20" 
                                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                )}
                            >
                                <ShoppingBag className="w-6 h-6" /> 
                                {meal.isAvailable ? 'Add to Order' : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Provider Card */}
                        <Link 
                            href={`/providers/${meal.providerId}`}
                            className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100 flex items-center gap-6 group transition-all duration-500 hover:bg-white hover:border-orange-300 hover:shadow-2xl hover:shadow-zinc-200/50"
                        >
                            <div className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center p-3 overflow-hidden transition-transform duration-500 group-hover:rotate-6">
                                {meal.provider?.logoUrl ? <img src={meal.provider.logoUrl} alt="" className="w-full h-full object-contain" /> : <Clock className="w-8 h-8 text-white" />}
                            </div>
                            <div className="flex-grow">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Expertly Crafted By</p>
                                <h3 className="text-xl font-display font-bold text-zinc-900 group-hover:text-orange-600 transition-soft">{meal.provider?.businessName || 'Elite Chef'}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                                        <Star className="w-3 h-3 fill-current" /> 4.9
                                    </div>
                                    <span className="text-zinc-400 text-sm font-medium">Verified Kitchen</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-900 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4. Ratings & Reviews */}
            <section id="reviews" className="bg-zinc-50/50 pt-32 pb-20 border-t border-zinc-100">
                <div className="container mx-auto px-6 space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <span className="px-5 py-2 bg-white text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-zinc-100">Feedback</span>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-zinc-900 mb-2">Gastronomic Reviews</h2>
                            <p className="text-zinc-500 font-medium text-lg max-w-xl">Join the conversation and discover why foodies rave about this masterwork.</p>
                        </div>
                        
                        <div className="flex items-center gap-10">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-display font-black text-zinc-900">{meal.avgRating?.toFixed(1) || '0.0'}</p>
                                <div className="flex justify-center gap-1 my-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < Math.round(Number(meal.avgRating)) ? "text-orange-500 fill-orange-500" : "text-zinc-200")} />
                                    ))}
                                </div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">{reviews.length} Total</p>
                            </div>
                            
                            {meal.canReview && !showReviewForm && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black text-sm hover:bg-orange-500 transition-soft shadow-2xl shadow-zinc-900/10"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-10 md:p-14 rounded-[60px] border border-zinc-100 shadow-2xl shadow-zinc-200/30 max-w-4xl mx-auto overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-8 w-24 h-24 text-zinc-100 -rotate-12 pointer-events-none">
                                    <MessageSquare className="w-full h-full fill-current" />
                                </div>

                                {reviewSuccess ? (
                                    <div className="text-center space-y-6 py-12">
                                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
                                            <CheckCircle2 className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-display font-black text-zinc-900 mb-2">Appreciation Received!</h3>
                                        <p className="text-zinc-500 text-xl font-medium max-w-md mx-auto leading-relaxed">Your feedback has been successfully shared with the chef and the community.</p>
                                        <button 
                                            onClick={() => { setShowReviewForm(false); setReviewSuccess(false); }} 
                                            className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black"
                                        >
                                            Return to Page
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="space-y-12">
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-display font-black text-zinc-900">How was your meal?</h3>
                                            <p className="text-zinc-500 font-medium">Your authentic review helps others discover great food.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Atmosphere & Flavor Score</p>
                                            <div className="flex gap-6">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setRating(s)}
                                                        className={cn(
                                                            "w-16 h-16 rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95",
                                                            s <= rating ? "bg-orange-500 text-white shadow-2xl shadow-orange-500/30 -translate-y-2" : "bg-zinc-50 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-400"
                                                        )}
                                                    >
                                                        <Star className={cn("w-7 h-7", s <= rating ? "fill-current" : "")} />
                                                        <span className={cn("text-[8px] font-black mt-1", s <= rating ? "text-orange-200" : "hidden")}>{s}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2">Your Commentary</label>
                                            <textarea
                                                rows={5}
                                                required
                                                placeholder="What did you love about the texture, presentation, or arrival of your meal?"
                                                className="w-full px-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[32px] text-zinc-900 font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/20 focus:bg-white outline-none transition-all"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowReviewForm(false)}
                                                className="flex-1 py-5 bg-zinc-100 text-zinc-500 rounded-3xl font-black hover:bg-zinc-200 transition-soft active:scale-95"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="flex-[2] py-5 bg-orange-500 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all duration-500 shadow-2xl shadow-orange-500/20 active:scale-95"
                                            >
                                                {submittingReview ? 'Dispatching...' : 'Publish Experience'} 
                                                {!submittingReview && <Send className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Review List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {reviews.length > 0 ? (
                            reviews.map((rev) => (
                                <motion.div
                                    key={rev.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-10 bg-white rounded-[48px] border border-zinc-100 flex flex-col justify-between space-y-10 group hover:border-orange-200 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/30"
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-zinc-100 rounded-[20px] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:rotate-3">
                                                    {rev.customer?.avatar ? (
                                                        <img src={rev.customer.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-7 h-7 text-zinc-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-display font-bold text-zinc-900 leading-none">{rev.customer?.name}</h4>
                                                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-2 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Verified Connoisseur
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 px-3 py-1.5 bg-zinc-50 rounded-full">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-3 h-3", i < rev.rating ? "text-orange-500 fill-orange-500" : "text-zinc-100")} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-zinc-600 font-medium text-lg leading-relaxed italic pr-4">
                                            &ldquo;{rev.comment}&rdquo;
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                                            {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-full">
                                            <Info className="w-3 h-3" /> Honest Feedback
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-[60px] border border-dashed border-zinc-200">
                                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                                    <MessageSquare className="w-10 h-10 text-zinc-200" />
                                </div>
                                <div>
                                    <p className="text-zinc-900 text-2xl font-display font-black tracking-tight">Be the first to share</p>
                                    <p className="text-zinc-400 font-medium mt-1">Share your experience and help others decide.</p>
                                </div>
                                {!user && (
                                    <Link href="/login" className="inline-block mt-4 text-orange-500 font-black border-b-2 border-orange-500 pb-0.5 transition-soft">
                                        Login to leave a review
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. Related Meals */}
            {relatedMeals.length > 0 && (
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-6 space-y-16">
                        <div className="flex items-end justify-between">
                            <div className="space-y-4">
                                <span className="px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100">Pairing Suggestions</span>
                                <h2 className="text-3xl md:text-4xl font-display font-black text-zinc-900 mb-2">More from {meal.category?.name}</h2>
                                <p className="text-zinc-500 font-medium text-lg">Delicious companions and alternative flavors just for you.</p>
                            </div>
                            <Link href="/meals" className="hidden sm:flex items-center gap-2 text-zinc-900 font-black group">
                                View Full Collection <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-soft" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedMeals.map((m) => (
                                <MealCard key={m.id} meal={m} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. Action Buttons (Mobile Sticky Footer) */}
            <div className="lg:hidden fixed bottom-10 left-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-700">
                <div className="bg-zinc-950/95 backdrop-blur-xl p-4 rounded-[32px] border border-zinc-800 shadow-2xl flex items-center gap-4">
                    <div className="flex items-center gap-3 p-1 bg-white/10 rounded-[24px]">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl text-zinc-900 active:scale-90"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-lg font-black text-white">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl text-zinc-900 active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleAddWithQty}
                        disabled={!meal.isAvailable}
                        className={cn(
                            "flex-grow py-4 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all",
                            meal.isAvailable ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"
                        )}
                    >
                        <ShoppingBag className="w-5 h-5" /> 
                        {meal.isAvailable ? `Add ${formatPrice(Number(meal.price) * quantity)}` : 'Sold Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealDetailsPage;
