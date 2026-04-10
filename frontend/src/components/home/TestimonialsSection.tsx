'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Food Enthusiast',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    text: "The gourmet meals from FoodHub have completely transformed my weeknights. The quality is exceptional, and the delivery is always on time. Highly recommended!",
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Professional Chef',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    rating: 5,
    text: "As a chef myself, I'm very picky about food. FoodHub's selection of providers is top-notch. Each meal tastes like it was prepared with real passion and precision.",
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Busy Parent',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    rating: 4,
    text: "Finding healthy and delicious options for my family used to be a struggle. FoodHub makes it so easy to order nutritious meals that even my kids love!",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-zinc-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-zinc-900 tracking-tight"
          >
            What Our <span className="text-orange-500">Customers</span> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg font-medium"
          >
            Join thousands of happy foodies who trust FoodHub for their daily culinary adventures.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              className="hidden md:flex w-14 h-14 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-orange-500 hover:border-orange-500 hover:shadow-xl transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex-grow flex justify-center">
              <div className="w-full max-w-2xl min-h-[400px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex flex-col items-center text-center space-y-8"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500/20 shadow-xl">
                        <img
                          src={testimonials[currentIndex].avatar}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Quote size={20} fill="currentColor" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < testimonials[currentIndex].rating ? 'text-orange-500 fill-orange-500' : 'text-zinc-200'}
                          />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl font-medium text-zinc-900 leading-relaxed italic">
                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-display font-black text-zinc-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-orange-500 font-bold uppercase tracking-widest text-xs">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={next}
              className="hidden md:flex w-14 h-14 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-orange-500 hover:border-orange-500 hover:shadow-xl transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-orange-500 w-8' : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
