import type { ApiResponse, Article } from '@/src/types/article';
import type {
    ReviewEntry,
    ApprovePayload,
    RejectPayload,
    BulkReviewPayload,
} from '@/src/types/review';
import authApi from './authApi';

const api = authApi._instance;

export const reviewApi = {
    // ── GET my articles ───────────────────────────────
    getMyArticles: async (
        status = '',
        page = 1,
        limit = 20
    ): Promise<{
        articles: Article[];
        total: number;
        page: number;
        totalPages: number;
    }> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (status) params.set('status', status);

        const res = await api.get<ApiResponse<any>>(
            `/api/profile/articles?${params}`
        );

        return res.data.data;
    },

    // ── Submit article ─────────────────────────────
    submit: async (articleId: string): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/api/articles/${articleId}/submit`
        );
        return res.data.data;
    },

    // ── Approve ────────────────────────────────────
    approve: async (
        articleId: string,
        payload: ApprovePayload = {}
    ): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/api/articles/${articleId}/approve`,
            payload
        );
        return res.data.data;
    },

    // ── Reject ─────────────────────────────────────
    reject: async (
        articleId: string,
        payload: RejectPayload
    ): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/api/articles/${articleId}/reject`,
            payload
        );
        return res.data.data;
    },

    // ── Review history ─────────────────────────────
    getHistory: async (articleId: string): Promise<ReviewEntry[]> => {
        const res = await api.get<ApiResponse<ReviewEntry[]>>(
            `/api/articles/${articleId}/reviews`
        );
        return res.data.data;
    },

    // ── Pending list ───────────────────────────────
    getPending: async (): Promise<Article[]> => {
        const res = await api.get<ApiResponse<Article[]>>(
            `/api/articles/pending`
        );
        return res.data.data;
    },

    // ── Bulk actions ───────────────────────────────
    bulkAction: async (payload: BulkReviewPayload): Promise<void> => {
        await api.post(`/api/articles/bulk`, payload);
    },
};