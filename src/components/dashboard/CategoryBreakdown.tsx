'use client';

import { useMemo } from 'react';
import { useDashboardStore } from '@/src/store/dashboardStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_SLUGS, type CategorySlug } from '@/src/types/article';
import { clsx } from 'clsx';

const CATEGORY_COLORS: Record<CategorySlug, { bar: string; bg: string; text: string }> = {
    club_news: { bar: 'bg-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400' },
    events: { bar: 'bg-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400' },
    regional_news: { bar: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400' },
    internal: { bar: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' },
};

export function CategoryBreakdown() {
    const overview = useDashboardStore((s) => s.overview);
    const isLoading = useDashboardStore((s) => s.loadingOverview);

    // Count articles per category from topArticles + recentArticles
    const breakdown = useMemo(() => {
        if (!overview) return [];

        const allArticles = [
            ...(overview.topArticles ?? []),
            ...(overview.recentArticles ?? []),
        ];

        // Deduplicate by id
        const seen = new Set<string>();
        const unique = allArticles.filter((a) => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
        });

        const counts: Record<string, { articles: number; views: number }> = {};
        for (const slug of CATEGORY_SLUGS) counts[slug] = { articles: 0, views: 0 };

        for (const a of unique) {
            if (counts[a.category]) {
                counts[a.category].articles++;
                counts[a.category].views += (a as { viewCount?: number }).viewCount ?? 0;
            }
        }

        const total = Object.values(counts).reduce((s, v) => s + v.articles, 0) || 1;
        return CATEGORY_SLUGS
            .map((slug) => ({
                slug,
                label: CATEGORY_LABELS[slug],
                icon: CATEGORY_ICONS[slug],
                articles: counts[slug].articles,
                views: counts[slug].views,
                pct: Math.round((counts[slug].articles / total) * 100),
                colors: CATEGORY_COLORS[slug],
            }))
            .filter((c) => c.articles > 0)
            .sort((a, b) => b.articles - a.articles);
    }, [overview]);

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Articles by category</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Distribution of published content</p>
            </div>

            <div className="px-5 py-4 space-y-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between">
                                <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-3.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" style={{ width: `${40 + i * 15}%` }} />
                        </div>
                    ))
                ) : breakdown.length === 0 ? (
                    <p className="text-sm text-zinc-400 text-center py-6">No data yet</p>
                ) : (
                    breakdown.map((cat) => (
                        <div key={cat.slug}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <span>{cat.icon}</span>
                                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                    <span>{cat.articles} article{cat.articles !== 1 ? 's' : ''}</span>
                                    <span className={clsx('font-semibold tabular-nums', cat.colors.text)}>
                                        {cat.pct}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={clsx('h-full rounded-full transition-all duration-700', cat.colors.bar)}
                                    style={{ width: `${cat.pct}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stacked mini bar */}
            {!isLoading && breakdown.length > 0 && (
                <div className="px-5 pb-4">
                    <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
                        {breakdown.map((cat) => (
                            <div
                                key={cat.slug}
                                title={`${cat.label}: ${cat.pct}%`}
                                className={clsx('h-full transition-all duration-700', cat.colors.bar)}
                                style={{ width: `${cat.pct}%` }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}