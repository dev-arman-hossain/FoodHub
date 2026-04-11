import React from 'react';

export const metadata = {
  title: 'Refund Policy | FoodHub',
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] max-w-4xl">
      <h1 className="text-4xl font-display font-black text-zinc-900 mb-2">Refund Policy</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-zinc-600 leading-relaxed">
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Refund Eligibility</h2>
            <p>We strive to ensure complete satisfaction with every order. You may be eligible for a refund if:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Your order was never delivered.</li>
                <li>The wrong items were delivered.</li>
                <li>The items arrived in unacceptable condition (e.g., spoiled, severely damaged).</li>
                <li>You cancelled the order within the allowable cancellation window before preparation began.</li>
            </ul>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Reporting Issues</h2>
            <p>To request a refund, please contact our support team within 24 hours of the original delivery time. You may be asked to provide photographic evidence of any issues with the quality or condition of the food.</p>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Refund Processing</h2>
            <p>Approved refunds will be processed immediately and will automatically be applied to your original method of payment. Please allow 5-10 business days for the credit to appear on your bank statement.</p>
        </section>
      </div>
    </div>
  );
}
