'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProviderCard from '../providers/ProviderCard';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { apiFetch } from '@/lib/api-fetch';

const TopProviders = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await apiFetch<any>('/meals/providers', {
          next: { revalidate: 60 }
        });
        // Take only top 4 for the home page
        setProviders(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

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
              Our Top <span className="text-orange-500">Providers</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg font-medium"
            >
              Discover the most popular restaurants and home chefs on our platform, highly rated by thousands.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/providers"
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/10 transition-all font-black"
            >
              View All Providers <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[480px] bg-white/5 rounded-[2.5rem] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[3rem] border border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold">No providers found</h3>
              <p className="text-zinc-500 font-medium">We couldn&apos;t find any active food providers at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProviders;
