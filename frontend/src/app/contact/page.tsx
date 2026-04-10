'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, MapPin, Send, CheckCircle2, Clock,
    MessageSquare, ArrowRight, UtensilsCrossed, Loader2,
    Instagram, Twitter, Linkedin, Youtube, Star
} from 'lucide-react';

// ─── Contact info ──────────────────────────────────────────────────────────
const contactInfo = [
    {
        icon: <Mail className="w-6 h-6" />,
        label: 'Email Us',
        value: 'web.devarman@gmail.com',
        sub: 'We reply within 24 hours',
        href: 'mailto:web.devarman@gmail.com',
        color: 'bg-orange-50 text-orange-500',
    },
    {
        icon: <Phone className="w-6 h-6" />,
        label: 'Call Us',
        value: '+880 1234 567 890',
        sub: 'Mon–Fri, 9am–6pm',
        href: 'tel:+8801234567890',
        color: 'bg-blue-50 text-blue-500',
    },
    {
        icon: <MapPin className="w-6 h-6" />,
        label: 'Find Us',
        value: 'Dhaka, Bangladesh',
        sub: 'Serving food lovers nationwide',
        href: 'https://maps.google.com',
        color: 'bg-green-50 text-green-500',
    },
    {
        icon: <Clock className="w-6 h-6" />,
        label: 'Working Hours',
        value: '24 / 7 Active',
        sub: 'We never sleep — just like food',
        href: null,
        color: 'bg-purple-50 text-purple-500',
    },
];

const faqs = [
    {
        q: 'How do I track my order?',
        a: 'Once placed, go to Orders in your account to see real-time status updates from preparation to delivery.',
    },
    {
        q: 'Can I become a provider on FoodHub?',
        a: 'Absolutely! Register as a Provider and our team will review your application within 24 hours.',
    },
    {
        q: 'What areas do you deliver to?',
        a: 'We currently cover all major city areas in Bangladesh. Expanding nationwide soon!',
    },
    {
        q: 'How do I report an issue with my order?',
        a: 'Email us at web.devarman@gmail.com with your order ID and we\'ll resolve it within a few hours.',
    },
];

const socials = [
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram', color: 'hover:bg-pink-50 hover:text-pink-500' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter/X', color: 'hover:bg-sky-50 hover:text-sky-500' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-50 hover:text-blue-600' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube', color: 'hover:bg-red-50 hover:text-red-500' },
];

type FormState = 'idle' | 'loading' | 'success';

// ─── Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
    const [formState, setFormState] = useState<FormState>('idle');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');

        // Use mailto to compose email to web.devarman@gmail.com
        const mailtoBody = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
        const mailtoLink = `mailto:web.devarman@gmail.com?subject=${encodeURIComponent(form.subject || 'FoodHub Contact: ' + form.name)}&body=${mailtoBody}`;

        // Simulate loading then open mail client
        setTimeout(() => {
            window.location.href = mailtoLink;
            setFormState('success');
        }, 1200);
    };

    return (
        <div className="overflow-x-hidden">

            {/* ── Hero ── */}
            <section className="relative bg-zinc-950 py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[150px]" />

                <div className="container mx-auto relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em]">
                            <MessageSquare className="w-4 h-4" /> Get In Touch
                        </span>
                        <h1 className="text-white">
                            We'd Love to{' '}
                            <span className="text-orange-500 italic">Hear From You</span>
                        </h1>
                        <p className="text-zinc-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Whether you have a question, a partnership proposal, or just want to say hello — our team is always happy to chat.
                        </p>
                    </motion.div>

                    {/* Quick email CTA */}
                    <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        href="mailto:web.devarman@gmail.com"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-base hover:bg-orange-400 transition-soft shadow-2xl shadow-orange-500/30"
                    >
                        <Mail className="w-5 h-5" />
                        web.devarman@gmail.com
                    </motion.a>
                </div>
            </section>

            {/* ── Contact Cards ── */}
            <section className="py-20 bg-zinc-50">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={info.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {info.href ? (
                                    <a
                                        href={info.href}
                                        className="block p-8 bg-white rounded-[2.5rem] border border-zinc-100 hover:border-orange-200 hover:shadow-xl hover:shadow-zinc-200/30 transition-soft group h-full"
                                    >
                                        <ContactCard info={info} />
                                    </a>
                                ) : (
                                    <div className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 h-full">
                                        <ContactCard info={info} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact Form + Sidebar ── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-7"
                        >
                            <div className="space-y-3 mb-10">
                                <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">Send a Message</span>
                                <h2 className="text-zinc-900">Let's Start a <span className="text-orange-500">Conversation</span></h2>
                                <p className="text-zinc-500 font-medium">
                                    Fill out the form and we'll redirect you to your email client with everything pre-filled.
                                </p>
                            </div>

                            <AnimatePresence mode="wait">
                                {formState === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-green-50 rounded-[3rem] border border-green-100"
                                    >
                                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-zinc-900">Email Client Opened!</h3>
                                            <p className="text-zinc-500 font-medium">
                                                Your message has been pre-filled in your email client. Hit Send to reach us at{' '}
                                                <a href="mailto:web.devarman@gmail.com" className="text-orange-500 font-bold">
                                                    web.devarman@gmail.com
                                                </a>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setFormState('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                            className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-orange-500 transition-soft"
                                        >
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="px-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Arman Hossain"
                                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-soft"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="px-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-soft"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="px-1">Subject</label>
                                            <select
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-soft appearance-none cursor-pointer"
                                            >
                                                <option value="">Select a topic...</option>
                                                <option>General Inquiry</option>
                                                <option>Partnership / Restaurant Onboarding</option>
                                                <option>Order Support</option>
                                                <option>Technical Issue</option>
                                                <option>Press / Media</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="px-1">Your Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={6}
                                                value={form.message}
                                                onChange={handleChange}
                                                placeholder="Tell us what's on your mind..."
                                                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-soft resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={formState === 'loading'}
                                            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-orange-500 transition-soft shadow-xl shadow-zinc-900/10 disabled:opacity-60 active:scale-95"
                                        >
                                            {formState === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" /> Opening email client...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" /> Send Message
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-xs text-zinc-400 font-medium">
                                            By submitting, your email client will open pre-filled to{' '}
                                            <a href="mailto:web.devarman@gmail.com" className="text-orange-500 font-bold">
                                                web.devarman@gmail.com
                                            </a>
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 space-y-8"
                        >
                            {/* Direct contact */}
                            <div className="p-8 bg-zinc-950 rounded-[2.5rem] text-white space-y-6">
                                <h3 className="">Prefer Direct Contact?</h3>
                                <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                                    Don't want to fill out a form? Email us directly — we respond to every message personally.
                                </p>
                                <a
                                    href="mailto:web.devarman@gmail.com"
                                    className="flex items-center gap-4 p-4 bg-orange-500 rounded-2xl hover:bg-orange-400 transition-soft group"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">Send Email</p>
                                        <p className="text-orange-100 text-xs font-medium">web.devarman@gmail.com</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-soft" />
                                </a>

                                {/* Socials */}
                                <div className="space-y-3">
                                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Follow Us</p>
                                    <div className="flex gap-3">
                                        {socials.map((s) => (
                                            <a
                                                key={s.label}
                                                href={s.href}
                                                title={s.label}
                                                className={`p-3 bg-white/10 rounded-xl text-zinc-400 transition-soft ${s.color}`}
                                            >
                                                {s.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="p-8 bg-orange-50 border border-orange-100 rounded-[2.5rem] space-y-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                                    ))}
                                </div>
                                <p className="text-zinc-700 font-semibold italic text-base leading-relaxed">
                                    "FoodHub has completely changed how I think about lunch. The quality is unmatched and customer support is always responsive."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm">R</div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Rania K.</p>
                                        <p className="text-xs text-zinc-500 font-medium">Verified Customer</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick links */}
                            <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 space-y-4">
                                <h3 className="text-zinc-900 text-lg">Quick Links</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Browse All Meals', href: '/meals' },
                                        { label: 'Become a Provider', href: '/register' },
                                        { label: 'About FoodHub', href: '/about' },
                                        { label: 'View Blog', href: '/blog' },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white transition-soft text-sm font-semibold text-zinc-600 hover:text-zinc-900 group"
                                        >
                                            {link.label}
                                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-soft" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-24 bg-zinc-50">
                <div className="container mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-14"
                    >
                        <span className="text-orange-500 font-black uppercase tracking-[0.25em] text-xs">FAQ</span>
                        <h2 className="text-zinc-900">Common <span className="text-orange-500">Questions</span></h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-2xl border border-zinc-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-zinc-900 text-base pr-4">{faq.q}</span>
                                    <motion.span
                                        animate={{ rotate: openFaq === i ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-shrink-0 w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 font-black"
                                    >
                                        +
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-zinc-500 font-medium leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-10 text-center"
                    >
                        <p className="text-zinc-500 font-medium">
                            Have another question?{' '}
                            <a href="mailto:web.devarman@gmail.com" className="text-orange-500 font-black hover:text-orange-600 transition-soft">
                                Email us directly →
                            </a>
                        </p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}

// ─── Contact Card Sub-component ─────────────────────────────────────────────
function ContactCard({ info }: { info: typeof contactInfo[0] }) {
    return (
        <div className="space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${info.color} group-hover:scale-110 transition-soft`}>
                {info.icon}
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{info.label}</p>
                <p className="font-bold text-zinc-900 text-base leading-snug">{info.value}</p>
                <p className="text-sm text-zinc-400 font-medium mt-1">{info.sub}</p>
            </div>
        </div>
    );
}
