'use client';

import Link from 'next/link';
import { useDashboardStore } from '@/src/store/dashboardStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
import type { Article } from '@/src/types/article';
import { clsx } from 'clsx';

const STATUS_STYLES: Record<Article['status'], string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',
    draft: 'bg-zinc-100   text-zinc-600   dark:bg-zinc-800      dark:text-zinc-400',
    rejected: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    archived: 'bg-zinc-100   text-zinc-500   dark:bg-zinc-800      dark:text-zinc-500',
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

export function RecentActivity() {
    const overview = useDashboardStore((s) => s.overview);
    const isLoading = useDashboardStore((s) => s.loadingOverview);

    const articles = overview?.recentArticles ?? [];

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Recent activity</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Latest submitted articles</p>
                </div>
                <Link
                    href="/admin"
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Manage all →
                </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="px-5 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/3" />
                            </div>
                            <div className="w-16 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                        </div>
                    ))
                ) : articles.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-zinc-400">
                        No recent articles
                    </div>
                ) : (
                    articles.map((article) => {
                        const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';
                        const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;

                        return (
                            <div key={article.id} className="px-5 py-3 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                {/* Author avatar */}
                                {article.author.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={article.author.avatarUrl}
                                        alt={article.author.fullName}
                                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 select-none">
                                        {article.author.fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                        {article.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400 flex-wrap">
                                        <span>{article.author.fullName}</span>
                                        <span>·</span>
                                        <span>{catIcon} {catLabel}</span>
                                        <span>·</span>
                                        <span>{timeAgo(article.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Status + actions */}
                                <div className="shrink-0 flex items-center gap-2">
                                    <span className={clsx(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide',
                                        STATUS_STYLES[article.status]
                                    )}>
                                        {article.status}
                                    </span>

                                    {/* Quick action */}
                                    {article.status === 'pending' ? (
                                        <Link
                                            href={`/admin?pending=true&id=${article.id}`}
                                            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                                        >
                                            Review
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            View
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}