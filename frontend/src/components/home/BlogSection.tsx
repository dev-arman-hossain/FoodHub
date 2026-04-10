'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1488459711635-de8291fe5bb7?auto=format&fit=crop&q=80',
    category: 'Food Trends',
  },
];

const BlogSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-black tracking-tight"
            >
              Latest from <span className="text-orange-500">Our Blog</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg font-medium"
            >
              Get expert culinary tips, nutrition advice, and the latest trends in the world of food.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/10 transition-all font-black text-sm uppercase tracking-widest"
            >
              Read All Stories <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-orange-500/30 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
                  {blog.category}
                </div>
              </div>

              <div className="p-10 space-y-6">
                <div className="flex items-center gap-6 text-zinc-400 text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-orange-500" />
                    {blog.author}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-black leading-tight group-hover:text-orange-500 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-zinc-400 font-medium leading-relaxed line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blog/${blog.id}`}
                  className="inline-flex items-center gap-2 text-orange-500 font-black text-sm uppercase tracking-widest group/btn"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
