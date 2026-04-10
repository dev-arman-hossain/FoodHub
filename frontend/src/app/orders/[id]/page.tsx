'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Order } from '@/types';
import { Package, MapPin, Calendar, CreditCard, ChevronLeft, CheckCircle2, Truck, Utensils, XCircle } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReviewModal from '@/components/orders/ReviewModal';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    
    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchOrder = async (isPoll = false) => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                if (!isPoll) setLoading(false);
            }
        };

        fetchOrder();

        const interval = setInterval(() => {
            fetchOrder(true);
        }, 5000); // Polling every 5 seconds

        return () => clearInterval(interval);
    }, [id]);

    if (loading) return (
        <div className="container mx-auto px-6 py-20 text-center">
            <div className="h-96 bg-zinc-50 animate-pulse rounded-[40px]" />
        </div>
    );

    if (!order) return <div className="text-center py-20">Order not found.</div>;

    const steps = [
        { label: 'Placed', status: 'PLACED', icon: <Package className="w-5 h-5" /> },
        { label: 'Preparing', status: 'PREPARING', icon: <Utensils className="w-5 h-5" /> },
        { label: 'Ready', status: 'READY', icon: <CheckCircle2 className="w-5 h-5" /> },
        { label: 'Delivered', status: 'DELIVERED', icon: <Truck className="w-5 h-5" /> },
    ];

    const currentStep = steps.findIndex(s => s.status === order.status);
    const isCancelled = order.status === 'CANCELLED';

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <Link href="/orders" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 font-bold transition-soft group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-soft" /> Back to Orders
            </Link>

            <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="text-zinc-900 tracking-tight">
                        Order #{order.id.slice(-6).toUpperCase()}
                    </h1>
                    <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
                    </div>
                    {isCancelled && <span className="text-sm bg-red-50 text-red-500 px-4 py-1 rounded-full uppercase tracking-widest font-black border border-red-100">Cancelled</span>}
                </div>
                <p className="text-zinc-500 font-medium text-lg flex items-center gap-3">
                    <Calendar className="w-5 h-5" /> {mounted ? new Date(order.createdAt).toLocaleString() : ''}
                </p>
            </div>

            {!isCancelled && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-zinc-50 p-8 rounded-[40px] border border-zinc-100">
                    {steps.map((step, idx) => (
                        <div key={step.label} className="relative flex flex-col items-center text-center space-y-3 group">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-soft border-2",
                                idx <= currentStep
                                    ? "bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20"
                                    : "bg-white text-zinc-300 border-zinc-100"
                            )}>
                                {step.icon}
                            </div>
                            <span className={cn("text-xs font-black uppercase tracking-widest", idx <= currentStep ? "text-zinc-900" : "text-zinc-300")}>
                                {step.label}
                            </span>
                            {idx < steps.length - 1 && (
                                <div className={cn(
                                    "hidden md:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5",
                                    idx < currentStep ? "bg-orange-500" : "bg-zinc-200"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Items */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/30">
                        <div className="bg-zinc-950 p-8 text-white">
                            <h3 className="text-xl">Ordered Items</h3>
                        </div>
                        <div className="divide-y divide-zinc-50">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-8 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                                            {item.meal?.imageUrl && <img src={item.meal.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-soft" />}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-display font-bold text-lg text-zinc-900">{item.mealName}</h4>
                                            <p className="text-sm text-zinc-500 font-medium">Qty: {item.quantity} &times; {formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xl font-display font-black text-zinc-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                        {order.status === 'DELIVERED' && (
                                            order.reviews?.some(r => r.mealId === item.mealId) ? (
                                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Reviewed</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem({ id: item.mealId, name: item.mealName });
                                                        setIsReviewOpen(true);
                                                    }}
                                                    className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-500 hover:text-white transition-soft"
                                                >
                                                    Write Review
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-zinc-50 flex justify-between items-center">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Amount Paid</span>
                            <span className="text-3xl font-display font-black text-zinc-900">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 bg-white rounded-[40px] border border-zinc-100 space-y-8 shadow-xl shadow-zinc-200/30">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-orange-500 lowercase tracking-tighter font-black">
                                <MapPin className="w-4 h-4" /> delivery details
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-display font-bold text-zinc-900">Delivery Address</h4>
                                <p className="text-zinc-500 font-medium leading-relaxed">{order.deliveryAddress}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-zinc-50">
                            <div className="flex items-center gap-3 text-orange-500 lowercase tracking-tighter font-black">
                                <Package className="w-4 h-4" /> restaurant info
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center p-2">
                                    {order.provider?.logoUrl ? <img src={order.provider.logoUrl} alt="" className="w-full h-full object-contain" /> : <Package className="w-5 h-5 text-white" />}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-zinc-900">{order.provider?.businessName}</h4>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Verified Provider</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedItem && (
                <ReviewModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    mealId={selectedItem.id}
                    mealName={selectedItem.name}
                    orderId={order.id}
                    onSuccess={() => {
                        // Optionally show a global toast here if available
                        // The service already handles polling/refresh if we fetchOrder
                        console.log('Review submitted successfully');
                    }}
                />
            )}
        </div>
    );
};

export default OrderDetailsPage;
