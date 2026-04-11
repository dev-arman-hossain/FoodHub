'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const blogs = [
  {
    id: 1,
    title: 'The Secret to Perfect Homemade Pizza Dough',
    excerpt: 'Master the art of pizza making with our expert tips on kneading and fermentation.',
    date: 'April 10, 2026',
    author: 'Chef Antonio',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    category: 'Cooking Tips',
  },
  {
    id: 2,
    title: '5 Healthy Lunch Ideas for Busy Professionals',
    excerpt: 'Quick and nutritious meals that will keep you energized throughout your workday.',
    date: 'April 08, 2026',
    author: 'Nutri Sarah',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80',
    category: 'Healthy Living',
  },
  {
    id: 3,
    title: 'The Rise of Farm-to-Table Delivery Services',
    excerpt: 'How local providers are changing the landscape of online food ordering.',
    date: 'April 05, 2026',
    author: 'John Miller',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80',
    category: 'Food Trends',
  },
];

const BlogList = () => {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-20 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-display font-black text-zinc-900 tracking-tighter"
                    >
                        Our <span className="text-orange-500">Blog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-500 text-xl font-medium"
                    >
                        Explore culinary secrets, nutrition guides, and the latest food industry news.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-[3rem] overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-zinc-900/80 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {blog.category}
                                </div>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="flex items-center gap-6 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-orange-500" />
                                        {blog.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-orange-500" />
                                        {blog.author}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl font-display font-black leading-tight text-zinc-900 group-hover:text-orange-500 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-zinc-500 font-medium leading-relaxed line-clamp-2">
                                        {blog.excerpt}
                                    </p>
                                </div>

                                <Link
                                    href={`/blog/${blog.id}`}
                                    className="inline-flex items-center gap-3 text-sm font-black text-zinc-900 group/btn"
                                >
                                    Read Full Story
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover/btn:bg-orange-500 group-hover/btn:text-white transition-all">
                                        <ArrowRight size={16} />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
