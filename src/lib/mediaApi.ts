import type { ApiResponse } from '@/src/types/article';
import type { MediaUploadResponse } from '@/src/types/media';
import authApi from './authApi';

const api = authApi._instance;

export const mediaApi = {
    // ── Upload image ─────────────────────────────
    uploadImage: async (file: File): Promise<string> => {
        const form = new FormData();
        form.append('image', file);

        const res = await api.post<ApiResponse<MediaUploadResponse>>(
            '/api/upload/image',
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return res.data.data.url;
    },

    // ── Upload avatar ────────────────────────────
    uploadAvatar: async (file: File): Promise<string> => {
        const form = new FormData();
        form.append('avatar', file);

        const res = await api.post<ApiResponse<MediaUploadResponse>>(
            '/api/upload/avatar',
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return res.data.data.url;
    },
};