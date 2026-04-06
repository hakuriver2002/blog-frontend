import type { ApiResponse } from '@/src/types/article';
import type { DashboardOverview, DashboardStats, AnalyticsResponse, DaysRange } from '@/src/types/dashboard';
import authApi from './authApi';

const api = authApi._instance;

export const dashboardApi = {
    /** GET /api/dashboard — summary numbers + top/recent articles */
    getOverview: async (): Promise<DashboardOverview> => {
        const res = await api.get<ApiResponse<DashboardOverview>>('/api/dashboard');
        return res.data.data;
    },

    /** GET /api/dashboard/stats — detailed stats with growth % */
    getStats: async (): Promise<DashboardStats> => {
        const res = await api.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
        return res.data.data;
    },

    /** GET /api/dashboard/analytics?period=day&days=30 */
    getAnalyticsDaily: async (days: DaysRange = 30): Promise<AnalyticsResponse> => {
        const res = await api.get<ApiResponse<AnalyticsResponse>>(
            `/api/dashboard/analytics?period=day&days=${days}`
        );
        return res.data.data;
    },

    /** GET /api/dashboard/analytics?period=month */
    getAnalyticsMonthly: async (): Promise<AnalyticsResponse> => {
        const res = await api.get<ApiResponse<AnalyticsResponse>>(
            `/api/dashboard/analytics?period=month`
        );
        return res.data.data;
    },
};