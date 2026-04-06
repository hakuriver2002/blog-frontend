'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { reviewApi } from '@/src/lib/reviewApi';
import type { Article } from '@/src/types/article';

interface SubmitForReviewButtonProps {
    article: Article | null;
    onSuccess?: (updated: Article) => void;
}

export function SubmitForReviewButton({ article, onSuccess }: SubmitForReviewButtonProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!article) return null;

    // Already submitted or beyond
    if (article.status === 'pending') {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending review
            </div>
        );
    }

    if (article.status === 'published') {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Published
            </div>
        );
    }

    if (article.status === 'rejected') {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected — revise and resubmit
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    Resubmit for review
                </button>
            </div>
        );
    }

    async function handleSubmit() {
        if (!article) return;
        setLoading(true);
        setError('');
        try {
            const updated = await reviewApi.submit(article.id);
            setSuccess(true);
            onSuccess?.(updated);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Submit failed');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Submitted for review!
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <button
                onClick={handleSubmit}
                disabled={loading || article.status !== 'draft'}
                className={clsx(
                    'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    article.status === 'draft'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                )}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting…
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit for review
                    </>
                )}
            </button>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}