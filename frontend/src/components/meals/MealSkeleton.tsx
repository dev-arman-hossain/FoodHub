'use client';

import React from 'react';

const MealSkeleton = () => {
    return (
        <div className="pb-20 animate-pulse">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="h-6 w-32 bg-zinc-100 rounded-full mb-10" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Image Section Skeleton */}
                    <div className="lg:col-span-6">
                        <div className="aspect-[4/4] rounded-[60px] bg-zinc-50 border border-zinc-100" />
                        <div className="flex gap-4 mt-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100" />
                            ))}
                        </div>
                    </div>

                    {/* Info Section Skeleton */}
                    <div className="lg:col-span-6 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-24 bg-orange-50 rounded-full" />
                                <div className="h-6 w-32 bg-zinc-50 rounded-full" />
                            </div>
                            <div className="h-20 w-3/4 bg-zinc-100 rounded-[20px]" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-zinc-50 rounded-full" />
                                <div className="h-4 w-5/6 bg-zinc-50 rounded-full" />
                                <div className="h-4 w-4/6 bg-zinc-50 rounded-full" />
                            </div>
                        </div>

                        <div className="h-16 w-32 bg-zinc-100 rounded-[20px]" />

                        <div className="flex gap-6 pt-6">
                            <div className="h-16 w-32 bg-zinc-50 rounded-[30px]" />
                            <div className="h-16 flex-grow bg-zinc-900/10 rounded-[30px]" />
                        </div>

                        {/* Specs Grid Skeleton */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 bg-zinc-50 rounded-[30px] border border-zinc-100" />
                            ))}
                        </div>

                        {/* Provider Card Skeleton */}
                        <div className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100 h-32" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealSkeleton;
