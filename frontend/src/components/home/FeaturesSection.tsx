'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Clock, ChefHat, RotateCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-time Tracking',
    description: 'Track your order in real-time from the kitchen to your doorstep with GPS accuracy.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Multiple layers of encryption to ensure your payment information is 100% safe.',
  },
  {
    icon: Clock,
    title: '30-min Delivery',
    description: 'Lightning fast delivery. We promise to get your food to you in under 30 minutes.',
  },
  {
    icon: ChefHat,
    title: 'Top Rated Chefs',
    description: 'We only partner with the finest culinary experts to ensure premium food quality.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Not satisfied with your meal? Our easy return policy has you covered, no questions asked.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to assist with any queries.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl space-y-4">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-black text-zinc-900 tracking-tight"
            >
              Why Choose <span className="text-orange-500">FoodHub?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 text-lg font-medium"
            >
              We don&apos;t just deliver food; we deliver an experience. Here&apos;s what sets us apart from the rest.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-xl mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
                <feature.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-bold text-zinc-900 mb-4">{feature.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
