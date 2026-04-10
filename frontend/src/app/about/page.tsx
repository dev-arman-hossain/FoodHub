'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    UtensilsCrossed, Heart, Users, Star, Award, Zap,
    Globe, ShieldCheck, ArrowRight, Mail, MapPin, Phone,
    Leaf, Truck, ChefHat, Clock
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────
const stats = [
    { value: '50K+', label: 'Happy Customers', icon: <Heart className="w-5 h-5" /> },
    { value: '200+', label: 'Partner Restaurants', icon: <ChefHat className="w-5 h-5" /> },
    { value: '500+', label: 'Gourmet Meals', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { value: '4.9★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
];

const values = [
    {
        icon: <ShieldCheck className="w-7 h-7" />,
        title: 'Quality First',
        desc: 'Every partner restaurant passes our rigorous quality audit before joining FoodHub. We believe your next meal should be nothing short of exceptional.',
        color: 'bg-blue-50 text-blue-500',
    },
    {
        icon: <Leaf className="w-7 h-7" />,
        title: 'Sustainability',
        desc: 'We actively support eco-conscious kitchens and use recyclable packaging across our entire delivery network to minimize environmental impact.',
        color: 'bg-green-50 text-green-500',
    },
    {
        icon: <Truck className="w-7 h-7" />,
        title: 'Lightning Delivery',
        desc: 'Our precision logistics network ensures your food arrives hot, fresh, and on time — every single order, every single day.',
        color: 'bg-orange-50 text-orange-500',
    },
    {
        icon: <Users className="w-7 h-7" />,
        title: 'Community',
        desc: 'FoodHub isn\'t just a platform — it\'s a community of food lovers, home chefs, and local restaurants united by a passion for great food.',
        color: 'bg-purple-50 text-purple-500',
    },
    {
        icon: <Zap className="w-7 h-7" />,
        title: 'Innovation',
        desc: 'We constantly evolve our technology to make food discovery, ordering, and delivery faster, smarter, and more personal for every user.',
        color: 'bg-yellow-50 text-yellow-500',
    },
    {
        icon: <Globe className="w-7 h-7" />,
        title: 'Diversity',
        desc: 'From Italian to Japanese, BBQ to Vegan — FoodHub celebrates the full spectrum of culinary cultures right at your fingertips.',
        color: 'bg-pink-50 text-pink-500',
    },
];

const team = [
    {
        name: 'Arman Hossain',
        role: 'Founder & CEO',
        bio: 'Full-stack developer and food enthusiast who built FoodHub from scratch to bridge the gap between local restaurants and food lovers.',
        avatar: 'A',
        gradient: 'from-orange-400 to-orange-600',
        email: 'web.devarman@gmail.com',
    },
    {
        name: 'Shakil Dev',
        role: 'Head of Design',
        bio: 'Award-winning UI/UX designer with a passion for creating beautiful, intuitive experiences that make every interaction feel premium.',
        avatar: 'S',
        gradient: 'from-blue-400 to-blue-600',
    },
    {
        name: 'Leila Nguyen',
        role: 'Head of Partnerships',
        bio: 'Restaurant industry veteran who curates and manages our network of 200+ partner kitchens with an uncompromising eye for quality.',
        avatar: 'L',
        gradient: 'from-purple-400 to-purple-600',
    },
];

const milestones = [
    { year: '2022', event: 'FoodHub founded with a vision to revolutionize food delivery.' },
    { year: '2023', event: 'Launched with 50 partner restaurants. Reached 10,000 customers in 3 months.' },
    { year: '2024', event: 'Expanded to 200+ partners. Introduced real-time live tracking and ratings.' },
    { year: '2025', event: 'Surpassed 500K orders delivered. Launched the FoodHub mobile app.' },
];

// ─── Animations ─────────────────────────────────────────────────────────
const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
};

// ─── Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
    return (
        <div className="overflow-x-hidden">

            {/* ── Hero ── */}
            <section className="relative bg-zinc-950 min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
                        alt="Restaurant ambiance"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/60" />
                </div>

                {/* Glow orbs */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />

                <div className="container mx-auto relative z-10 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-[0.25em] text-sm mb-6">
                            <span className="w-12 h-px bg-orange-500" /> Our Story
                        </span>
                        <h1 className="text-white mb-6">
                            Food Delivered with{' '}
                            <span className="text-orange-500 italic">Passion.</span>
                        </h1>
                        <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl font-medium mb-10">
                            FoodHub was built on a simple belief — everyone deserves access to exceptional, restaurant-quality food. We partner with the finest local kitchens to make that possible, every day.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/meals"
                                className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-base hover:bg-orange-400 transition-soft shadow-xl shadow-orange-500/30 flex items-center gap-2"
                            >
                                Explore Our Menu <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-base hover:bg-white/20 transition-soft backdrop-blur-sm"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="bg-orange-500 py-12">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center text-white"
                            >
                                <div className="flex justify-center mb-2 opacity-70">{stat.icon}</div>
                                <div className="text-3xl font-display font-black">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-white/70 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mission ── */}
            <section className="py-32 bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div {...fadeUp} className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">Our Mission</span>
                                <h2 className="text-zinc-900">Why We Do <span className="text-orange-500">What We Do</span></h2>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                    The restaurant industry is filled with incredible talent — passionate chefs, dedicated kitchen teams, and local culinary artisans who pour their hearts into every dish.
                                </p>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                    FoodHub exists to give those creators a direct route to the people who love their food, while giving customers access to authentic, high-quality meals without compromise.
                                </p>
                            </div>
                            <a
                                href="mailto:web.devarman@gmail.com"
                                className="inline-flex items-center gap-3 text-orange-500 font-black hover:gap-5 transition-all duration-300"
                            >
                                <Mail className="w-5 h-5" /> Partner with us
                            </a>
                        </motion.div>
                        <motion.div
                            {...fadeUp}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
                                <img
                                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80"
                                    alt="FoodHub kitchen"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 p-6 bg-zinc-950 rounded-[2rem] text-white shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-display font-black">30 min</div>
                                        <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Avg. delivery</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="py-32 bg-zinc-50">
                <div className="container mx-auto space-y-16">
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">Our Values</span>
                        <h2 className="text-zinc-900">What We Stand For</h2>
                        <p className="text-zinc-500 text-lg font-medium">
                            Every decision we make is guided by these core principles — from how we select partners to how we build our technology.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/20 hover:border-zinc-200 transition-soft group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${v.color} group-hover:scale-110 transition-soft`}>
                                    {v.icon}
                                </div>
                                <h3 className="text-zinc-900 mb-3">{v.title}</h3>
                                <p className="text-zinc-500 font-medium leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Timeline ── */}
            <section className="py-32 bg-zinc-950 text-white overflow-hidden">
                <div className="container mx-auto space-y-16">
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">Our Journey</span>
                        <h2 className="text-white">Built with Heart, <span className="text-orange-500">Year by Year</span></h2>
                    </motion.div>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
                        <div className="space-y-10">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="flex items-start gap-8 pl-2"
                                >
                                    <div className="flex-shrink-0 w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-display font-black text-sm shadow-xl shadow-orange-500/30 relative z-10">
                                        {m.year}
                                    </div>
                                    <div className="pt-3">
                                        <p className="text-zinc-300 font-medium leading-relaxed">{m.event}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="py-32 bg-white">
                <div className="container mx-auto space-y-16">
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">The Team</span>
                        <h2 className="text-zinc-900">Meet the People <span className="text-orange-500">Behind FoodHub</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="text-center p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/30 transition-soft"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-display font-black shadow-xl mb-6`}>
                                    {member.avatar}
                                </div>
                                <h3 className="text-zinc-900 mb-1">{member.name}</h3>
                                <p className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4">{member.role}</p>
                                <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-6">{member.bio}</p>
                                {member.email && (
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 transition-soft"
                                    >
                                        <Mail className="w-4 h-4" /> {member.email}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600">
                <div className="container mx-auto text-center space-y-8">
                    <motion.div {...fadeUp} className="space-y-4">
                        <h2 className="text-white">Ready to Experience <span className="text-zinc-900">Excellence?</span></h2>
                        <p className="text-orange-100 text-xl font-medium max-w-xl mx-auto">
                            Join 50,000+ food lovers who trust FoodHub for their daily culinary adventures.
                        </p>
                    </motion.div>
                    <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/meals"
                            className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-base hover:bg-zinc-800 transition-soft shadow-xl flex items-center gap-2"
                        >
                            Browse Meals <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-black text-base hover:bg-orange-50 transition-soft shadow-xl flex items-center gap-2"
                        >
                            <Mail className="w-5 h-5" /> Contact Us
                        </Link>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
