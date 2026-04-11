import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Partner With Us | FoodHub',
};

export default function PartnerPage() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] text-center max-w-4xl">
      <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">Grow Your Business</span>
      <h1 className="text-4xl md:text-5xl font-display font-black text-zinc-900 mb-6">Become a FoodHub Partner</h1>
      <p className="text-xl text-zinc-500 mb-10">Join thousands of restaurants and chefs reaching new customers every day.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16 mb-16">
        <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">More Customers</h3>
            <p className="text-zinc-600">Gain access to thousands of hungry users looking for great food in your area.</p>
        </div>
        <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Easy Tools</h3>
            <p className="text-zinc-600">Manage orders, update menus, and track earnings with our intuitive partner dashboard.</p>
        </div>
        <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Dedicated Support</h3>
            <p className="text-zinc-600">Get 24/7 support from our partner success team to help you grow.</p>
        </div>
      </div>
      
      <Link href="/register" className="inline-block px-10 py-5 bg-zinc-900 text-white text-xl font-black rounded-3xl hover:bg-orange-500 transition-soft shadow-xl">
        Apply Now
      </Link>
    </div>
  );
}
