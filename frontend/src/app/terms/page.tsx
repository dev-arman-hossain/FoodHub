import React from 'react';

export const metadata = {
  title: 'Terms of Service | FoodHub',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] max-w-4xl">
      <h1 className="text-4xl font-display font-black text-zinc-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-zinc-600 leading-relaxed">
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using FoodHub, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Description of Service</h2>
            <p>FoodHub provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content, and branded programming through its network of properties which may be accessed through any various medium or device now known or hereafter developed.</p>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. User Conduct</h2>
            <p>You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials, whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated.</p>
        </section>
      </div>
    </div>
  );
}
