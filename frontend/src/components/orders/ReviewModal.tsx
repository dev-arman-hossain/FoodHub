import React, { useState } from 'react';
import { Star, X, Loader2, MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    mealId: string;
    mealName: string;
    orderId: string;
    onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, mealId, mealName, orderId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post(`/reviews/${mealId}`, {
                orderId,
                rating,
                comment: comment.trim() || undefined
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Review submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit review. You might have already reviewed this meal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[40px] shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="bg-zinc-950 p-8 text-white relative">
                            <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-xl transition-soft">
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Culinary Feedback</span>
                            <h2 className="text-3xl font-display font-black tracking-tight mt-1">Rate Your <span className="text-orange-500">Meal</span></h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Reviewing</p>
                                <h3 className="text-xl font-display font-bold text-zinc-900 leading-tight">{mealName}</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="p-1.5 transition-soft transform hover:scale-125 group"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-10 h-10 transition-soft",
                                                    (hover || rating) >= star
                                                        ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                                                        : "text-zinc-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm font-bold text-zinc-400">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Great!"}
                                    {rating === 5 && "Exquisite!"}
                                    {rating === 0 && "Select a rating"}
                                </p>
                            </div>

                            <div className="relative group">
                                <MessageSquareText className="absolute left-5 top-5 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-soft" />
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your experience (optional)..."
                                    className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all min-h-[120px] resize-none font-medium"
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm bg-red-50 p-4 rounded-2xl border border-red-100 font-bold"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-zinc-900 shadow-xl shadow-zinc-900/10 transition-soft flex items-center justify-center gap-3"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
