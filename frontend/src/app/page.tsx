'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Meal, Category } from '@/types';
import api from '@/lib/axios';
import MealCard from '@/components/meals/MealCard';
import { Search, SlidersHorizontal, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TopProviders from '@/components/home/TopProviders';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import FAQSection from '@/components/home/FAQSection';

const Home = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, catsRes] = await Promise.all([
          api.get('/meals', {
            params: {
              categoryId: selectedCategory || undefined,
              search: search || undefined,
            },
          }),
          api.get('/categories'),
        ]);
        setMeals(mealsRes.data.data);
        setCategories(catsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, search]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl space-y-8"
          >
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-[0.2em] text-sm">
                <span className="w-10 h-px bg-orange-500" /> Premium Quality
              </span>
              <h1 className="text-6xl md:text-7xl font-display font-black text-white leading-tight">
                Gourmet Food <br />
                <span className="heading-gradient italic">Delivered.</span>
              </h1>
            </div>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
              Experience culinary excellence from the comfort of your home.
              The most sophisticated delivery experience for food lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search your favorite meal..."
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-md transition-soft"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Link href="/meals" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white hover:text-zinc-900 transition-soft shadow-xl shadow-orange-500/20 active:scale-95">
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Filter Section */}
      <section className="container mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight">Browse by Category</h2>
            <p className="text-zinc-500 font-medium text-lg">Hand-picked selections from local culinary experts</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-soft",
                selectedCategory === null
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20"
                  : "bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300"
              )}
            >
              All Meals
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-soft",
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20"
                    : "bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-zinc-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900">No meals found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          </div>
        )}
      </section>

      {/* New Sections */}
      <HowItWorks />
      <StatsSection />
      <FeaturesSection />
      <TopProviders />
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
      <FAQSection />
    </div>
  );
};

export default Home;
