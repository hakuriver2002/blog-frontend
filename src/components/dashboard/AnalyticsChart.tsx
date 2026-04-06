'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChartDataset } from 'chart.js';
import { useDashboardStore } from '@/src/store/dashboardStore';
import { clsx } from 'clsx';
import type { AnalyticsPeriod, DaysRange } from '@/src/types/dashboard';

// ── Metric selector ───────────────────────────────────────────
type Metric = 'views' | 'articles' | 'comments';

const METRICS: { key: Metric; label: string; color: string; bgColor: string }[] = [
    { key: 'views', label: 'Views', color: '#6366f1', bgColor: 'rgba(99,102,241,0.12)' },
    { key: 'articles', label: 'Articles', color: '#10b981', bgColor: 'rgba(16,185,129,0.12)' },
    { key: 'comments', label: 'Comments', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)' },
];

// ── Period/Range controls ─────────────────────────────────────
const DAY_RANGES: { value: DaysRange; label: string }[] = [
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' },
];

export function AnalyticsChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<import('chart.js').Chart | null>(null);

    const analytics = useDashboardStore((s) => s.analytics);
    const period = useDashboardStore((s) => s.period);
    const daysRange = useDashboardStore((s) => s.daysRange);
    const isLoading = useDashboardStore((s) => s.loadingAnalytics);
    const setPeriod = useDashboardStore((s) => s.setPeriod);
    const setDaysRange = useDashboardStore((s) => s.setDaysRange);

    const [activeMetrics, setActiveMetrics] = useState<Set<Metric>>(
        new Set(['views', 'articles', 'comments'])
    );

    const toggleMetric = (m: Metric) => {
        setActiveMetrics((prev) => {
            const next = new Set(prev);
            if (next.has(m) && next.size === 1) return prev; // keep at least one
            next.has(m) ? next.delete(m) : next.add(m);
            return next;
        });
    };

    // ── Build + update chart ──────────────────────────────────
    useEffect(() => {
        if (!canvasRef.current || !analytics) return;

        const labels = analytics.data.map((d) => d.label);
        const isDark = document.documentElement.classList.contains('dark');

        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        const textColor = isDark ? '#a1a1aa' : '#71717a';

        const datasets: ChartDataset<'bar' | 'line', number[]>[] = METRICS
            .filter((m) => activeMetrics.has(m.key))
            .map((m) => ({
                label: m.label,
                data: analytics.data.map((d) => d[m.key]),
                borderColor: m.color,
                backgroundColor: m.key === 'views' ? m.bgColor : m.bgColor,
                borderWidth: m.key === 'views' ? 2.5 : 0,
                fill: m.key === 'views',
                tension: 0.4,
                pointRadius: analytics.data.length > 30 ? 0 : 3,
                pointHoverRadius: 5,
                type: m.key === 'views' ? 'line' : 'bar',
                yAxisID: m.key === 'views' ? 'y' : 'y1',
                order: m.key === 'views' ? 1 : 2,
            }));

        // Destroy previous chart instance
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        // Lazy import Chart.js to keep initial bundle small
        import('chart.js').then(({ Chart, registerables }) => {
            Chart.register(...registerables);

            chartRef.current = new Chart(canvasRef.current!, {
                type: 'bar',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false }, // we render our own legend
                        tooltip: {
                            backgroundColor: isDark ? '#18181b' : '#fff',
                            titleColor: isDark ? '#f4f4f5' : '#18181b',
                            bodyColor: isDark ? '#a1a1aa' : '#71717a',
                            borderColor: isDark ? '#3f3f46' : '#e4e4e7',
                            borderWidth: 1,
                            padding: 10,
                            callbacks: {
                                label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()}`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
                        },
                        y: {
                            position: 'left',
                            grid: { color: gridColor },
                            ticks: {
                                color: textColor, callback: (v: unknown) => {
                                    const n = Number(v);
                                    return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
                                }
                            },
                            beginAtZero: true,
                        },
                        y1: {
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: textColor },
                            beginAtZero: true,
                        },
                    },
                },
            });
        });

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [analytics, activeMetrics]);

    // ── Totals summary ────────────────────────────────────────
    const totals = analytics?.totals;

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Performance over time
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {period === 'day'
                            ? `Last ${daysRange} days — daily breakdown`
                            : 'Last 12 months — monthly breakdown'}
                    </p>
                </div>

                {/* Period + range controls */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Day range (only when period = day) */}
                    {period === 'day' && (
                        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            {DAY_RANGES.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => setDaysRange(r.value)}
                                    className={clsx(
                                        'px-3 py-1.5 text-xs font-medium transition-colors',
                                        daysRange === r.value
                                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                    )}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Period toggle */}
                    <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                        {(['day', 'month'] as AnalyticsPeriod[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={clsx(
                                    'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                                    period === p
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                )}
                            >
                                {p === 'day' ? 'Daily' : 'Monthly'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metric toggle + totals */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                {METRICS.map((m) => {
                    const isActive = activeMetrics.has(m.key);
                    return (
                        <button
                            key={m.key}
                            onClick={() => toggleMetric(m.key)}
                            className={clsx(
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                                isActive
                                    ? 'border-transparent'
                                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                            )}
                            style={isActive ? { backgroundColor: m.bgColor, color: m.color, borderColor: m.color + '40' } : {}}
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: isActive ? m.color : '#9ca3af' }}
                            />
                            {m.label}
                            {totals && isActive && (
                                <span className="tabular-nums opacity-75">
                                    {totals[m.key].toLocaleString()}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Chart canvas */}
            <div className="relative h-72">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-3 w-full">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"
                                    style={{ width: `${60 + Math.random() * 40}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <canvas ref={canvasRef} aria-label="Analytics chart" role="img" />
                )}
            </div>
        </div>
    );
}