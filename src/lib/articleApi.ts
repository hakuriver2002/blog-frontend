import type {
    Article,
    PaginatedArticles,
    ArticleFilters,
    CreateArticlePayload,
    UpdateArticlePayload,
    ApiResponse,
} from '@/src/types/article';
import axios from 'axios';
import { useAuthStore } from '@/src/store/authStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const buildQuery = <T extends object>(params: T) => {
    const q = new URLSearchParams();

    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
            q.append(k, String(v));
        }
    });

    return q.toString() ? `?${q.toString()}` : '';
};

export const articlesApi = {
    // ── List ──
    list: async (filters: ArticleFilters = {}): Promise<PaginatedArticles> => {
        const res = await api.get<ApiResponse<PaginatedArticles>>(
            `/articles${buildQuery(filters)}`
        );
        return res.data.data;
    },

    // ── Detail ──
    getById: async (id: string): Promise<Article> => {
        const res = await api.get<ApiResponse<Article>>(`/api/articles/${id}`);
        return res.data.data;
    },

    // ── Create ──
    create: async (
        payload: CreateArticlePayload & { thumbnail?: File }
    ): Promise<Article> => {
        const form = new FormData();

        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                if (v instanceof File) form.append(k, v);
                else form.append(k, String(v));
            }
        });

        const res = await api.post<ApiResponse<Article>>('/api/articles', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data.data;
    },

    // ── Update ──
    update: async (
        id: string,
        payload: UpdateArticlePayload & { thumbnail?: File }
    ): Promise<Article> => {
        const form = new FormData();

        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                if (v instanceof File) form.append(k, v);
                else form.append(k, String(v));
            }
        });

        const res = await api.put<ApiResponse<Article>>(
            `/articles/${id}`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return res.data.data;
    },

    // ── Delete ──
    delete: async (id: string): Promise<void> => {
        await api.delete(`/articles/${id}`);
    },

    // ── Submit ──
    submit: async (id: string): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/articles/${id}/submit`
        );
        return res.data.data;
    },

    // ── Approve ──
    approve: async (id: string): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/articles/${id}/approve`
        );
        return res.data.data;
    },

    // ── Reject ──
    reject: async (id: string, reason: string): Promise<Article> => {
        const res = await api.patch<ApiResponse<Article>>(
            `/articles/${id}/reject`,
            { reason }
        );
        return res.data.data;
    },
    // ── Autosave ──
    autosave: async (id: string, payload: { title?: string; content?: string; excerpt?: string }) =>
        await api.patch<ApiResponse<Article>>(`/api/articles/${id}/autosave`, payload),

};

export const uploadApi = {
    // ── Upload image ──
    image: async (file: File): Promise<{ url: string }> => {
        const form = new FormData();
        form.append('image', file);

        const res = await api.post('/upload/image', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            url: res.data?.data?.url ?? res.data?.url,
        };
    },

    // ── Upload avatar ──
    avatar: async (file: File): Promise<{ url: string }> => {
        const form = new FormData();
        form.append('avatar', file);

        const res = await api.post('/upload/avatar', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            url: res.data?.data?.url ?? res.data?.url,
        };
    },
};