'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const stats = [
  { label: 'Orders Completed', value: 10000, suffix: '+' },
  { label: 'Gourmet Meals', value: 500, suffix: '+' },
  { label: 'Top Providers', value: 200, suffix: '+' },
  { label: 'Customer Rating', value: 4.9, suffix: '★' },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const display = useTransform(spring, (current) => {
    if (value % 1 === 0) {
      return Math.floor(current).toLocaleString();
    }
    return current.toFixed(1);
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl md:text-6xl font-black font-display tracking-tighter text-orange-500">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
