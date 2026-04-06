import type { ApiResponse } from '@/src/types/article';
import type {
    Comment,
    PaginatedComments,
    PostCommentPayload,
    ReplyCommentPayload,
    HideCommentPayload,
} from '@/src/types/comment';
import authApi from './authApi';

const api = authApi._instance;

export const commentApi = {
    // ── GET comments ──
    list: async (articleId: string, page = 1, limit = 20): Promise<PaginatedComments> => {
        const res = await api.get<ApiResponse<PaginatedComments>>(
            `/api/articles/${articleId}/comments`,
            { params: { page, limit } }
        );
        return res.data.data;
    },

    // ── POST comment ──
    post: async (articleId: string, payload: PostCommentPayload): Promise<Comment> => {
        const res = await api.post<ApiResponse<Comment>>(
            `/api/articles/${articleId}/comments`,
            payload
        );
        return res.data.data;
    },

    // ── Reply ──
    reply: async (commentId: string, payload: ReplyCommentPayload): Promise<Comment> => {
        const res = await api.post<ApiResponse<Comment>>(
            `/api/comments/${commentId}/reply`,
            payload
        );
        return res.data.data;
    },

    // ── Hide ──
    hide: async (commentId: string, payload: HideCommentPayload): Promise<Comment> => {
        const res = await api.patch<ApiResponse<Comment>>(
            `/api/comments/${commentId}/hide`,
            payload
        );
        return res.data.data;
    },

    // ── Show ──
    show: async (commentId: string): Promise<Comment> => {
        const res = await api.patch<ApiResponse<Comment>>(
            `/api/comments/${commentId}/show`
        );
        return res.data.data;
    },

    // ── Delete ──
    delete: async (commentId: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(
            `/api/comments/${commentId}`
        );
    },
};