import type { ApiResponse } from '@/src/types/article';
import type {
    PaginatedNotifications,
    UnreadCountResponse,
} from '@/src/types/notification';
import authApi from './authApi';

const api = authApi._instance;

export const notificationApi = {
    // ── GET /api/notifications ─────────────────────────
    list: async (
        page = 1,
        limit = 20,
        unreadOnly = false
    ): Promise<PaginatedNotifications> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (unreadOnly) params.set('unreadOnly', 'true');

        const res = await api.get<ApiResponse<PaginatedNotifications>>(
            `/api/notifications?${params}`
        );

        return res.data.data;
    },

    // ── GET /api/notifications/unread-count ────────────
    unreadCount: async (): Promise<number> => {
        const res = await api.get<ApiResponse<UnreadCountResponse>>(
            '/api/notifications/unread-count'
        );

        return res.data.data.count;
    },

    // ── PATCH /api/notifications/:id/read ──────────────
    markOneRead: async (id: string): Promise<void> => {
        await api.patch(`/api/notifications/${id}/read`);
    },

    // ── PATCH /api/notifications/read-all ──────────────
    markAllRead: async (): Promise<void> => {
        await api.patch('/api/notifications/read-all');
    },

    // ── DELETE /api/notifications/:id ──────────────────
    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/notifications/${id}`);
    },
};