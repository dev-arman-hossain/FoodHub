import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <Link href="/" className="inline-block">
                        <span className="text-2xl font-display font-bold tracking-tight">
                            Food<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                        Delivering happiness to your doorstep, one meal at a time. The most premium food delivery platform.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://facebook.com/foodhub" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-orange-500 rounded-full transition-soft group">
                            <Facebook className="w-4 h-4 group-hover:scale-110" />
                        </a>
                        <a href="https://twitter.com/foodhub" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-orange-500 rounded-full transition-soft group">
                            <Twitter className="w-4 h-4 group-hover:scale-110" />
                        </a>
                        <a href="https://instagram.com/foodhub" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-orange-500 rounded-full transition-soft group">
                            <Instagram className="w-4 h-4 group-hover:scale-110" />
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="font-display font-bold text-lg uppercase tracking-wider text-orange-500">Company</h4>
                    <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                        <li><Link href="/meals" className="hover:text-white transition-soft">Browse Meals</Link></li>
                        <li><Link href="/providers" className="hover:text-white transition-soft">Food Providers</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-soft">About Us</Link></li>
                        <li><Link href="/partner" className="hover:text-white transition-soft">Become a Partner</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-display font-bold text-lg uppercase tracking-wider text-orange-500">Support</h4>
                    <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                        <li><Link href="/help" className="hover:text-white transition-soft">Help Center</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-soft">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-soft">Terms of Service</Link></li>
                        <li><Link href="/refund" className="hover:text-white transition-soft">Refund Policy</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-display font-bold text-lg uppercase tracking-wider text-orange-500">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-zinc-400 font-medium flex flex-col items-start gap-4">
                        <li>
                            <a href="https://maps.google.com/?q=123+Foodie+Ave,+Gourmet+City" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-soft">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span>123 Foodie Ave, Gourmet City</span>
                            </a>
                        </li>
                        <li>
                            <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-white transition-soft">
                                <Phone className="w-4 h-4 text-orange-500" />
                                <span>+1 (555) 123-4567</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:support@foodhub.com" className="flex items-center gap-3 hover:text-white transition-soft">
                                <Mail className="w-4 h-4 text-orange-500" />
                                <span>support@foodhub.com</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-10 text-center text-zinc-500 text-xs">
                <p>&copy; {new Date().getFullYear()} FoodHub. Built for Excellence.</p>
            </div>
        </footer>
    );
};

export default Footer;
