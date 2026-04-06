import type { ApiResponse } from '@/src/types/article';
import type { User } from '@/src/types/auth';
import authApi from './authApi';

const api = authApi._instance;

export const profileApi = {
    /** GET /api/profile */
    getProfile: async (): Promise<ApiResponse<User>> => {
        const res = await api.get('/api/profile');
        return res.data;
    },

    /** PUT /api/profile — multipart form */
    updateProfile: async (
        payload: { fullName?: string; bio?: string }
    ): Promise<ApiResponse<User>> => {
        const form = new FormData();

        if (payload.fullName) form.append('fullName', payload.fullName);

        const res = await api.put('/api/profile', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    },

    /** PATCH /api/profile/change-password */
    changePassword: async (payload: {
        currentPassword: string;
        newPassword: string;
    }): Promise<ApiResponse<null>> => {
        const res = await api.patch('/api/profile/change-password', payload);
        return res.data;
    },

    deleteAccount: async (payload: {
        password: string;
        confirmation: string;
    }): Promise<ApiResponse<null>> => {
        const res = await api.delete('/api/profile', {
            data: payload, // axios delete phải để trong data
        });

        return res.data;
    },
};