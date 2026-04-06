import type { ApiResponse } from '@/src/types/article';
import type { LikeResponse, BookmarkResponse, BookmarksPage } from '@/src/types/engagement';
import authApi from './authApi';

const api = authApi._instance;

export const engagementApi = {
    // ── LIKE ──
    toggleLike: async (articleId: string): Promise<LikeResponse> => {
        const res = await api.post<ApiResponse<LikeResponse>>(
            `/api/articles/${articleId}/like`
        );
        return res.data.data;
    },

    // ── BOOKMARK ──
    toggleBookmark: async (articleId: string): Promise<BookmarkResponse> => {
        const res = await api.post<ApiResponse<BookmarkResponse>>(
            `/api/articles/${articleId}/bookmark`
        );
        return res.data.data;
    },

    // ── GET BOOKMARKS ──
    getBookmarks: async (page = 1, limit = 12): Promise<BookmarksPage> => {
        const res = await api.get<ApiResponse<BookmarksPage>>(
            `/api/profile/bookmarks`,
            { params: { page, limit } }
        );
        return res.data.data;
    },
};