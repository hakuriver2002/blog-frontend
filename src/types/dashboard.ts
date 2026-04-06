import type { Article } from '@/src/types/article';

// ── GET /api/dashboard ───────────────────────────────────────
// High-level overview — summary numbers + top articles

export interface DashboardOverview {
    stats: {
        totalArticles: number;
        publishedArticles: number;
        pendingArticles: number;
        draftArticles: number;
        totalViews: number;
        totalComments: number;
        totalUsers: number;
        activeUsers: number;
    };
    topArticles: TopArticle[];   // sorted by viewCount desc
    recentArticles: Article[];    // most recently created
}

// ── GET /api/dashboard/stats ─────────────────────────────────
// Granular stat numbers with period-over-period deltas

export interface DashboardStats {
    articles: {
        total: number;
        published: number;
        pending: number;
        draft: number;
        thisMonth: number;          // new articles this month
        growth: number;          // % vs last month (can be negative)
    };
    views: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    comments: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    users: {
        total: number;
        active: number;
        thisMonth: number;
        growth: number;
    };
}

// ── GET /api/dashboard/analytics ─────────────────────────────
// Time-series data for charts
// ?period=day&days=30    → 30 daily data points
// ?period=month          → 12 monthly data points

export interface AnalyticsDataPoint {
    date: string;      // ISO date — "2024-12-01" for day, "2024-12" for month
    label: string;      // Human-readable — "Dec 1", "Dec 2024"
    views: number;
    articles: number;
    comments: number;
}

export interface AnalyticsResponse {
    period: 'day' | 'month';
    data: AnalyticsDataPoint[];
    totals: {
        views: number;
        articles: number;
        comments: number;
    };
}

// ── Top article (used in overview + top articles table) ──────

export interface TopArticle {
    id: string;
    title: string;
    category: string;
    viewCount: number;
    commentCount: number;
    publishedAt?: string;
    author: {
        fullName: string;
        avatarUrl?: string;
    };
}

// ── Chart period selector ─────────────────────────────────────

export type AnalyticsPeriod = 'day' | 'month';
export type DaysRange = 7 | 30 | 90;