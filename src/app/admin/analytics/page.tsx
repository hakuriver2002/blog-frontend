'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/src/store/dashboardStore';
import { useRequireAdmin } from '@/src/hooks/useAuth';
import { StatCard, StatCardSkeleton } from '@/src/components/dashboard/StatCard';
import { AnalyticsChart } from '@/src/components/dashboard/AnalyticsChart';
import { TopArticlesTable } from '@/src/components/dashboard/TopArticlesTable';
import { CategoryBreakdown } from '@/src/components/dashboard/CategoryBreakdown';
import { RecentActivity } from '@/src/components/dashboard/RecentActivity';
import { Spinner } from '@/src/components/ui';

// ── SVG icons for stat cards ──────────────────────────────────
const Icons = {
    articles: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    views: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ),
    comments: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
    ),
};

export default function AnalyticsDashboardPage() {
    // Guard — redirect non-admins
    useRequireAdmin();

    const overview = useDashboardStore((s) => s.overview);
    const stats = useDashboardStore((s) => s.stats);
    const loadingOverview = useDashboardStore((s) => s.loadingOverview);
    const loadingStats = useDashboardStore((s) => s.loadingStats);
    const errorOverview = useDashboardStore((s) => s.errorOverview);
    const fetchAll = useDashboardStore((s) => s.fetchAll);

    useEffect(() => {
        fetchAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Error state ───────────────────────────────────────────
    if (errorOverview) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Failed to load dashboard
                </p>
                <p className="text-sm text-zinc-500 mb-6">{errorOverview}</p>
                <button
                    onClick={fetchAll}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const s = stats;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

            {/* ── Page header ────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href="/admin"
                            className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            ← Admin
                        </Link>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Analytics
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Overview of content performance and platform activity.
                    </p>
                </div>

                {/* Refresh button */}
                <button
                    onClick={fetchAll}
                    disabled={loadingOverview || loadingStats}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                    <svg className={`w-4 h-4 ${loadingOverview ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* ── KPI cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loadingStats ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard
                            label="Total articles"
                            value={s?.articles.total ?? overview?.stats.totalArticles ?? 0}
                            growth={s?.articles.growth}
                            icon={Icons.articles}
                            color="indigo"
                            suffix={s ? `${s.articles.published} published` : undefined}
                        />
                        <StatCard
                            label="Total views"
                            value={s?.views.total ?? overview?.stats.totalViews ?? 0}
                            growth={s?.views.growth}
                            icon={Icons.views}
                            color="sky"
                            suffix={s ? `${s.views.thisMonth.toLocaleString()} this month` : undefined}
                        />
                        <StatCard
                            label="Total comments"
                            value={s?.comments.total ?? overview?.stats.totalComments ?? 0}
                            growth={s?.comments.growth}
                            icon={Icons.comments}
                            color="amber"
                            suffix={s ? `${s.comments.thisMonth} this month` : undefined}
                        />
                        <StatCard
                            label="Active users"
                            value={s?.users.active ?? overview?.stats.activeUsers ?? 0}
                            growth={s?.users.growth}
                            icon={Icons.users}
                            color="emerald"
                            suffix={s ? `of ${s.users.total.toLocaleString()} total` : undefined}
                        />
                    </>
                )}
            </div>

            {/* ── Status breakdown pills ──────────────────────────── */}
            {!loadingStats && s && (
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Published', value: s.articles.published, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                        { label: 'Pending review', value: s.articles.pending, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                        { label: 'Draft', value: s.articles.draft, color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
                        { label: 'New this month', value: s.articles.thisMonth, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
                    ].map((item) => (
                        <div key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${item.color}`}>
                            <span className="tabular-nums font-bold">{item.value}</span>
                            {item.label}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Chart + Category breakdown ──────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <AnalyticsChart />
                </div>
                <div>
                    <CategoryBreakdown />
                </div>
            </div>

            {/* ── Top articles + Recent activity ──────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TopArticlesTable
                    articles={overview?.topArticles ?? []}
                    isLoading={loadingOverview}
                />
                <RecentActivity />
            </div>

        </div>
    );
}