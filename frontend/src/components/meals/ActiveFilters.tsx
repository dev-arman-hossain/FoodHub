import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
    filters: {
        label: string;
        value: string;
        key: string;
    }[];
    onRemove: (key: string, value: string) => void;
    onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onRemove, onClearAll }) => {
    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-3 py-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mr-2">Active Filters:</span>
            {filters.map((filter) => (
                <div 
                    key={`${filter.key}-${filter.value}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-xl shadow-sm hover:border-orange-200 transition-soft group"
                >
                    <span className="text-sm font-bold text-zinc-700">{filter.label}</span>
                    <button 
                        onClick={() => onRemove(filter.key, filter.value)}
                        className="p-1 hover:bg-orange-50 rounded-lg text-zinc-400 hover:text-orange-500 transition-soft"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <button 
                onClick={onClearAll}
                className="text-xs font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-soft ml-2"
            >
                Clear All
            </button>
        </div>
    );
};

export default ActiveFilters;
