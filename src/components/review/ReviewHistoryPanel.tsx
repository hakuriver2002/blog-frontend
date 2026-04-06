'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useReviewStore } from '@/src/store/reviewStore';
import type { ReviewEntry } from '@/src/types/review';

function timeAgo(iso: string) {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '—';

    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

const ACTION_STYLES: Record<ReviewEntry['action'], string> = {
    submitted: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ACTION_ICONS: Record<ReviewEntry['action'], string> = {
    submitted: '📤',
    approved: '✅',
    rejected: '❌',
};

interface ReviewHistoryPanelProps {
    articleId: string;
}

export function ReviewHistoryPanel({ articleId }: ReviewHistoryPanelProps) {
    const history = useReviewStore((s) => s.history);
    const isLoadingHistory = useReviewStore((s) => s.isLoadingHistory);
    const fetchHistory = useReviewStore((s) => s.fetchHistory);

    useEffect(() => {
        if (articleId) fetchHistory(articleId);
    }, [articleId, fetchHistory]);

    if (isLoadingHistory) {
        return (
            <div className="space-y-3 p-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 px-4 py-6 text-center">
                No review history yet.
            </p>
        );
    }

    return (
        <div className="flow-root">
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {history.map((entry) => (
                    <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
                        {/* Avatar */}
                        {entry.reviewer?.fullName ? (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 select-none">
                                {entry.reviewer.fullName.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {entry.reviewer?.fullName ?? 'Unknown'}
                                </span>

                                <span
                                    className={clsx(
                                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                                        ACTION_STYLES[entry.action]
                                    )}
                                >
                                    {ACTION_ICONS[entry.action]} {entry.action}
                                </span>

                                <span className="text-xs text-zinc-400">
                                    {timeAgo(entry.createdAt)}
                                </span>
                            </div>

                            {entry.note && (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 italic">
                                    "{entry.note}"
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}