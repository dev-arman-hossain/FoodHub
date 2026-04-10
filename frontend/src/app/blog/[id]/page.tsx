'use client';

import React, { use } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const blogs = [
  {
    id: 1,
    title: 'The Secret to Perfect Homemade Pizza Dough',
    content: `
      Ever wondered what makes a restaurant pizza dough so thin, crispy, and yet chewy? The secret lies in two simple factors: fermentation time and hydration levels. Most home cooks rush the process, but the best doughs are fermented for at least 24 to 48 hours in a cool environment.
      
      When you let dough rest, the yeasts have time to break down complex starches into simpler sugars, resulting in a much more complex flavor profile. Additionally, using "00" flour, which is more finely ground than all-purpose flour, provides that silkiness that allows you to stretch the dough paper-thin without it tearing.
      
      In this guide, we'll walk you through the precise measurements and the patience required to master the ultimate homemade pizza.
    `,
    date: 'April 10, 2026',
    author: 'Chef Antonio',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    category: 'Cooking Tips',
  },
  {
    id: 2,
    title: '5 Healthy Lunch Ideas for Busy Professionals',
    content: `
      We've all been there: staring at a vending machine or ordering greasy takeout because we're too busy to cook. But healthy eating doesn't have to be time-consuming. The key is meal-prepping versatile ingredients that can be combined in minutes.
      
      From Quinoa Power Bowls to Mediterranean Chickpea Salads, we've compiled five recipes that can be prepped on a Sunday and enjoyed all week. These meals are packed with lean protein and complex carbohydrates to keep your energy levels stable throughout the afternoon slump.
    `,
    date: 'April 08, 2026',
    author: 'Nutri Sarah',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80',
    category: 'Healthy Living',
  },
  {
    id: 3,
    title: 'The Rise of Farm-to-Table Delivery Services',
    content: `
      The food industry is currently undergoing a massive shift. People are moving away from processed, mass-produced meals and moving toward transparency. The "Farm-to-Table" movement is no longer just for high-end restaurants; it's now coming directly to your door.
      
      FoodHub is at the forefront of this change, partnering with local independent chefs who source their ingredients from local farmers. This not only supports the local economy but also ensures that the food you're eating is fresher and more nutritious.
    `,
    date: 'April 05, 2026',
    author: 'John Miller',
    image: 'https://images.unsplash.com/photo-1488459711635-de8291fe5bb7?auto=format&fit=crop&q=80',
    category: 'Food Trends',
  },
];

const BlogDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const blog = blogs.find(b => b.id.toString() === id);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-4xl font-display font-black text-zinc-900">Post Not Found</h1>
                <Link href="/blog" className="text-orange-500 font-bold hover:underline">Return to Blog</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl space-y-6"
                        >
                            <span className="px-6 py-2 bg-orange-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                                {blog.category}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-display font-black text-zinc-900 tracking-tighter leading-none">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-orange-500" />
                                    {blog.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-orange-500" />
                                    {blog.author}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-8">
                        <Link 
                            href="/blog"
                            className="inline-flex items-center gap-2 text-zinc-400 font-bold hover:text-orange-500 transition-colors"
                        >
                            <ArrowLeft size={20} /> Back to Blog
                        </Link>
                        
                        <div className="prose prose-xl prose-zinc max-w-none">
                            <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed font-medium">
                                {blog.content}
                            </p>
                        </div>

                        <div className="pt-12 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition-all">
                                    <Share2 size={20} />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition-all">
                                    <MessageCircle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-12">
                        <section className="bg-zinc-50 p-10 rounded-[2.5rem] space-y-6">
                            <h3 className="text-2xl font-display font-black text-zinc-900">About the Author</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-xl">
                                    {blog.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-zinc-900">{blog.author}</p>
                                    <p className="text-sm text-zinc-500">Gourmet Food Critic</p>
                                </div>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Bringing you the finest insights from the world of culinary excellence and modern food technology.
                            </p>
                        </section>
                    </aside>
                </div>
            </main>
        </article>
    );
};

export default BlogDetail;
