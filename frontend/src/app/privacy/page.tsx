import React from 'react';

export const metadata = {
  title: 'Privacy Policy | FoodHub',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] max-w-4xl">
      <h1 className="text-4xl font-display font-black text-zinc-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-zinc-600 leading-relaxed">
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Use of Information</h2>
            <p>We may use the information we collect about you to Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Providers, develop safety features, authenticate users, and send product updates and administrative messages.</p>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </section>
      </div>
    </div>
  );
}
