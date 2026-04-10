'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Subscription Successful!', {
      description: "You've been added to our gourment newsletter.",
      icon: <CheckCircle2 className="text-green-500" />,
    });
    
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-orange-500 rounded-[3rem] p-10 md:p-20 overflow-hidden shadow-2xl shadow-orange-500/20"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-[0.2em]">
                <Mail size={14} /> Newsletter
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
                Get the Best Deals <br /> 
                <span className="opacity-80 italic">Delivered to Inbox.</span>
              </h2>
              <p className="text-orange-50 font-medium text-lg leading-relaxed max-w-lg">
                Subscribe to our newsletter and receive a 20% discount on your first order. Stay updated with new gourmet providers and seasonal menus.
              </p>
            </div>

            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-8 pr-48 py-6 bg-white rounded-3xl text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none focus:ring-4 focus:ring-white/30 transition-all shadow-xl"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-zinc-950 text-white rounded-2xl font-black flex items-center gap-3 transition-soft hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe <Send size={18} />
                    </>
                  )}
                </button>
              </form>
              <p className="mt-6 text-orange-100 text-sm font-medium text-center lg:text-left">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
