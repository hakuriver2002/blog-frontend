'use client';

import Link from 'next/link';
import { useDashboardStore } from '@/src/store/dashboardStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
import type { TopArticle } from '@/src/types/dashboard';

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

// Rank medal colours
const RANK_STYLES = [
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',  // 🥇
    'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',          // 🥈
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', // 🥉
];

interface TopArticlesTableProps {
    articles: TopArticle[];
    isLoading?: boolean;
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/4" />
            </div>
            <div className="w-16 h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
    );
}

export function TopArticlesTable({ articles, isLoading }: TopArticlesTableProps) {
    const maxViews = Math.max(...articles.map((a) => a.viewCount), 1);

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Top articles</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Ranked by total views</p>
                </div>
                <Link
                    href="/admin?sort=viewCount"
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    View all →
                </Link>
            </div>

            {/* List */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="px-5"><SkeletonRow /></div>
                    ))
                ) : articles.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-zinc-400">
                        No articles yet
                    </div>
                ) : (
                    articles.map((article, idx) => {
                        const pct = (article.viewCount / maxViews) * 100;
                        const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;
                        const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';
                        const rankStyle = RANK_STYLES[idx] ?? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400';

                        return (
                            <div key={article.id} className="px-5 py-3 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                {/* Rank badge */}
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${rankStyle}`}>
                                    {idx + 1}
                                </div>

                                {/* Title + meta */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/articles/${article.id}`}
                                        className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                    >
                                        {article.title}
                                    </Link>

                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs text-zinc-400">
                                            {catIcon} {catLabel}
                                        </span>
                                        {article.publishedAt && (
                                            <span className="text-xs text-zinc-400">· {formatDate(article.publishedAt)}</span>
                                        )}
                                    </div>

                                    {/* Views progress bar */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tabular-nums shrink-0">
                                            {article.viewCount.toLocaleString()} views
                                        </span>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="shrink-0 flex items-center gap-1 text-xs text-zinc-400 mt-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {article.commentCount}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}