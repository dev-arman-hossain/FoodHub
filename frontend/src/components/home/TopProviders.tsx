'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProviderCard from '../providers/ProviderCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const dummyProviders = [
  {
    id: '1',
    businessName: 'The Golden Whisk',
    description: 'Artisanal pastries and gourmet breakfast sets crafted with love.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
    address: '123 Baker Street, London',
    user: { name: 'Chef Julian' },
    meals: [1, 2, 3, 4, 5],
  },
  {
    id: '2',
    businessName: 'Sushi ZenMaster',
    description: 'Authentic Japanese sushi and sashimi prepared by master chefs.',
    logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80',
    address: '456 Kyoto Lane, Tokyo',
    user: { name: 'Kenji Suzuki' },
    meals: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: '3',
    businessName: 'Rustic Italia',
    description: 'Traditional wood-fired pizzas and handmade pasta from the heart of Italy.',
    logoUrl: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d414?auto=format&fit=crop&q=80',
    address: '789 Roman Way, Rome',
    user: { name: 'Marco Rossi' },
    meals: [1, 2, 3, 4],
  },
  {
    id: '4',
    businessName: 'Spice Route',
    description: 'Vibrant and authentic Indian cuisine bursting with exotic flavors.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    address: '101 Curry Drive, Mumbai',
    user: { name: 'Priya Sharma' },
    meals: [1, 2, 3, 4, 5, 6],
  },
];

const TopProviders = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dummyProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Note: ProviderCard is designed for light mode, so I'll wrap it if needed or let it stand out as a card */}
              <ProviderCard provider={provider} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProviders;
