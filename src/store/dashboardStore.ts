import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { dashboardApi } from '@/src/lib/dashboardApi';
import type {
    DashboardOverview,
    DashboardStats,
    AnalyticsResponse,
    AnalyticsPeriod,
    DaysRange,
} from '@/src/types/dashboard';

interface DashboardState {
    // Data
    overview: DashboardOverview | null;
    stats: DashboardStats | null;
    analytics: AnalyticsResponse | null;

    // UI state
    period: AnalyticsPeriod;
    daysRange: DaysRange;        // only used when period = 'day'

    // Loading flags — separate per section so sections can load independently
    loadingOverview: boolean;
    loadingStats: boolean;
    loadingAnalytics: boolean;

    // Errors
    errorOverview: string | null;
    errorStats: string | null;
    errorAnalytics: string | null;

    // ── Actions ────────────────────────────────────────────────
    fetchOverview: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchAnalytics: (period?: AnalyticsPeriod, days?: DaysRange) => Promise<void>;
    fetchAll: () => Promise<void>;

    setPeriod: (period: AnalyticsPeriod) => void;
    setDaysRange: (days: DaysRange) => void;
}

export const useDashboardStore = create<DashboardState>()(
    devtools(
        (set, get) => ({
            overview: null,
            stats: null,
            analytics: null,
            period: 'day',
            daysRange: 30,
            loadingOverview: false,
            loadingStats: false,
            loadingAnalytics: false,
            errorOverview: null,
            errorStats: null,
            errorAnalytics: null,

            // ── fetchOverview ───────────────────────────────────────
            fetchOverview: async () => {
                set({ loadingOverview: true, errorOverview: null });
                try {
                    const data = await dashboardApi.getOverview();
                    set({ overview: data, loadingOverview: false });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load overview';
                    set({ errorOverview: msg, loadingOverview: false });
                }
            },

            // ── fetchStats ──────────────────────────────────────────
            fetchStats: async () => {
                set({ loadingStats: true, errorStats: null });
                try {
                    const data = await dashboardApi.getStats();
                    set({ stats: data, loadingStats: false });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load stats';
                    set({ errorStats: msg, loadingStats: false });
                }
            },

            // ── fetchAnalytics ──────────────────────────────────────
            fetchAnalytics: async (period, days) => {
                const p = period ?? get().period;
                const d = days ?? get().daysRange;
                set({ loadingAnalytics: true, errorAnalytics: null });
                try {
                    const data = p === 'month'
                        ? await dashboardApi.getAnalyticsMonthly()
                        : await dashboardApi.getAnalyticsDaily(d);
                    set({ analytics: data, loadingAnalytics: false });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load analytics';
                    set({ errorAnalytics: msg, loadingAnalytics: false });
                }
            },

            // ── fetchAll ────────────────────────────────────────────
            // Kick off all three in parallel — faster initial load
            fetchAll: async () => {
                const { fetchOverview, fetchStats, fetchAnalytics } = get();
                await Promise.all([fetchOverview(), fetchStats(), fetchAnalytics()]);
            },

            // ── setPeriod ───────────────────────────────────────────
            // Switching period triggers a fresh analytics fetch
            setPeriod: (period) => {
                set({ period });
                get().fetchAnalytics(period, get().daysRange);
            },

            // ── setDaysRange ─────────────────────────────────────────
            setDaysRange: (days) => {
                set({ daysRange: days });
                if (get().period === 'day') get().fetchAnalytics('day', days);
            },
        }),
        { name: 'dashboard-store' }
    )
);