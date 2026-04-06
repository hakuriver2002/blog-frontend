'use client';

import { clsx } from 'clsx';

interface StatCardProps {
    label: string;
    value: number | string;
    growth?: number;          // % vs last period — positive = green, negative = red
    icon: React.ReactNode;
    color: 'indigo' | 'emerald' | 'amber' | 'sky' | 'violet' | 'rose';
    suffix?: string;          // e.g. "articles", "views"
    isLoading?: boolean;
}

const colorMap = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/40' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-900/20', icon: 'text-sky-600 dark:text-sky-400', iconBg: 'bg-sky-100 dark:bg-sky-900/40' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', icon: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-900/40' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', icon: 'text-rose-600 dark:text-rose-400', iconBg: 'bg-rose-100 dark:bg-rose-900/40' },
};

function formatValue(val: number | string): string {
    if (typeof val === 'string') return val;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
}

export function StatCard({
    label, value, growth, icon, color, suffix, isLoading,
}: StatCardProps) {
    const c = colorMap[color];
    const isPositive = (growth ?? 0) >= 0;

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col gap-4">
            {/* Icon + label */}
            <div className="flex items-start justify-between">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', c.iconBg)}>
                    <span className={clsx('w-5 h-5', c.icon)}>{icon}</span>
                </div>

                {/* Growth badge */}
                {growth !== undefined && !isLoading && (
                    <div className={clsx(
                        'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold',
                        isPositive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                        {isPositive ? (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                        {Math.abs(growth).toFixed(1)}%
                    </div>
                )}
            </div>

            {/* Value */}
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            ) : (
                <div>
                    <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums leading-none">
                        {formatValue(value)}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                        {label}
                        {suffix && <span className="text-zinc-400 dark:text-zinc-500"> · {suffix}</span>}
                    </p>
                    {growth !== undefined && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">vs last month</p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Skeleton variant for loading state ───────────────────────
export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                <div className="w-14 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
        </div>
    );
}