import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 pt-12">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-400 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-zinc-400 transition-soft"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-12 h-12 rounded-2xl font-bold transition-soft",
                            currentPage === page
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : "bg-white border border-zinc-100 text-zinc-500 hover:border-orange-500 hover:text-orange-500"
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-400 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-zinc-400 transition-soft"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
