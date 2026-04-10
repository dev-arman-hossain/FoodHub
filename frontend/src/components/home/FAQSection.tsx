'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How quickly can I expect my food to be delivered?",
    answer: "Our standard delivery time is under 30 minutes for restaurants within a 5km radius. However, times may vary based on traffic conditions and the specific preparation time required by different gourmet providers."
  },
  {
    question: "How do I become a provider on FoodHub?",
    answer: "We are always looking for talented chefs and quality restaurants. You can apply by clicking on the 'Become a Provider' button in the footer. Our team will review your application and conduct a quality inspection of your kitchen."
  },
  {
    question: "Are there any hidden service charges?",
    answer: "No, FoodHub believes in complete transparency. All charges, including delivery fees and taxes, are clearly displayed at the checkout page before you place your order."
  },
  {
    question: "Can I cancel my order after placing it?",
    answer: "Orders can be cancelled within 2 minutes of placement for a full refund. After that, cancellation depends on whether the provider has already started preparing your meal."
  },
  {
    question: "How does FoodHub ensure food quality?",
    answer: "We strictly vet all our partners. Our providers must maintain a minimum 4.0-star rating to remain on the platform, and we conduct regular quality audits to ensure the highest hygiene standards."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-orange-500' : 'text-zinc-900 group-hover:text-orange-500'}`}>
          {question}
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-orange-500 text-white rotate-180' : 'bg-zinc-100 text-zinc-400'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-zinc-500 text-lg leading-relaxed font-medium pr-12">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200/50 rounded-full text-zinc-600 text-xs font-black uppercase tracking-[0.2em]"
              >
                <HelpCircle size={14} /> Questions?
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display font-black text-zinc-900 tracking-tight leading-tight"
              >
                Commonly Asked <br />
                <span className="text-orange-500">FoodHub FAQs</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 text-lg font-medium max-w-md"
              >
                Can&apos;t find what you&apos;re looking for? Reach out to our support team anytime.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-zinc-900 rounded-[2rem] text-white space-y-6 relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
               <h3 className="text-2xl font-display font-bold relative z-10">Still have questions?</h3>
               <p className="text-zinc-400 font-medium relative z-10">
                 We&apos;re here to help you 24/7 with any issues you might face.
               </p>
               <button className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black w-full shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all relative z-10">
                 Contact Support
               </button>
            </motion.div>
          </div>

          <div className="lg:col-span-1" />

          <div className="lg:col-span-6">
            <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-zinc-200/50 border border-zinc-100">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  {...faq}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
