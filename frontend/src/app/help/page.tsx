import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Help Center | FoodHub',
  description: 'Get help with your FoodHub orders',
};

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-display font-black text-zinc-900 mb-8">Help Center</h1>
      <div className="prose prose-zinc max-w-none">
        <p className="text-lg text-zinc-600 mb-6">Welcome to the FoodHub Help Center. We are here to assist you with any questions or issues you may have.</p>
        
        <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-zinc-800">How do I track my order?</h3>
                <p className="text-zinc-600 mt-2">You can track your order in real-time through the 'Orders' section in your dashboard once an order is placed.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-zinc-800">What if there is an issue with my meal?</h3>
                <p className="text-zinc-600 mt-2">Please contact our support team immediately or reach out to the provider directly through the order details page.</p>
            </div>
        </div>
        
        <div className="mt-12 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Still need help?</h2>
            <p className="text-zinc-600 mb-6">Our customer support team is available 24/7 to help you with your needs.</p>
            <Link href="/contact" className="inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-soft">
                Contact Support
            </Link>
        </div>
      </div>
    </div>
  );
}
