'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Truck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse Meals',
    description: 'Explore a curated selection of gourmet meals from top-rated local chefs and restaurants.',
    color: 'bg-orange-500',
  },
  {
    icon: CreditCard,
    title: 'Place Order',
    description: 'Customize your preferences and pay securely with our encrypted payment gateway.',
    color: 'bg-blue-500',
  },
  {
    icon: Truck,
    title: 'Get Delivered',
    description: 'Relax as our delivery partners bring your fresh, hot meal directly to your doorstep.',
    color: 'bg-green-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-zinc-900 tracking-tight"
          >
            How It <span className="text-orange-500">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg font-medium"
          >
            Get your favorite meals delivered in three simple steps. We handle the rest.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-zinc-200 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center space-y-6 group"
            >
              <div className="relative">
                <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <step.icon size={40} strokeWidth={1.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white border-4 border-zinc-50 rounded-full flex items-center justify-center font-black text-zinc-900 shadow-lg">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-display font-bold text-zinc-900">{step.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
