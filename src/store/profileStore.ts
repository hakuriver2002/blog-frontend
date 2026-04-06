import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { profileApi } from '@/src/lib/profileApi';
import { useAuthStore } from '@/src/store/authStore';
import { uploadApi } from '@/src/lib/articleApi';
import type { UpdateProfilePayload, ChangePasswordPayload, DeleteAccountPayload } from '@/src/types/profile';

interface ProfileState {
    isSaving: boolean;
    isUploadingAvatar: boolean;
    successMessage: string | null;
    error: string | null;
    fieldErrors: Record<string, string>;

    updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
    changePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
    uploadAvatar: (file: File) => Promise<string | null>;  // returns new URL
    deleteAccount: (payload: DeleteAccountPayload) => Promise<boolean>;
    clearMessages: () => void;
}

function flattenErrors(errors?: Record<string, string[]>): Record<string, string> {
    if (!errors) return {};
    return Object.fromEntries(
        Object.entries(errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
    );
}

export const useProfileStore = create<ProfileState>()(
    devtools(
        (set) => ({
            isSaving: false,
            isUploadingAvatar: false,
            successMessage: null,
            error: null,
            fieldErrors: {},

            updateProfile: async (payload) => {
                set({ isSaving: true, error: null, fieldErrors: {}, successMessage: null });

                try {
                    const res = await profileApi.updateProfile(payload);
                    const user = res.data;

                    useAuthStore.setState({ user });

                    set({
                        isSaving: false,
                        successMessage: res.message ?? 'Profile updated.',
                    });

                    return true;
                } catch (err: any) {
                    set({
                        isSaving: false,
                        error: err.message ?? 'Failed to update profile.',
                        fieldErrors: flattenErrors(err.errors),
                    });
                    return false;
                }
            },

            changePassword: async (payload) => {
                set({ isSaving: true, error: null, fieldErrors: {}, successMessage: null });

                try {
                    const res = await profileApi.changePassword(payload);

                    set({
                        isSaving: false,
                        successMessage: res.message ?? 'Password changed.',
                    });

                    return true;
                } catch (err: any) {
                    set({
                        isSaving: false,
                        error: err.message ?? 'Failed to change password.',
                        fieldErrors: flattenErrors(err.errors),
                    });
                    return false;
                }
            },

            uploadAvatar: async (file) => {
                set({ isUploadingAvatar: true, error: null, successMessage: null });

                try {
                    const { url } = await uploadApi.avatar(file);

                    useAuthStore.setState((state) => ({
                        user: state.user
                            ? { ...state.user, avatarUrl: url }
                            : null,
                    }));

                    set({
                        isUploadingAvatar: false,
                        successMessage: 'Avatar updated.',
                    });

                    return url;
                } catch (err: any) {
                    set({
                        isUploadingAvatar: false,
                        error: err.message ?? 'Avatar upload failed.',
                    });
                    return null;
                }
            },

            deleteAccount: async (payload) => {
                set({ isSaving: true, error: null, fieldErrors: {}, successMessage: null });

                try {
                    await profileApi.deleteAccount(payload);

                    // logout sạch
                    useAuthStore.getState().logout();

                    set({ isSaving: false });

                    return true;
                } catch (err: any) {
                    set({
                        isSaving: false,
                        error: err.message ?? 'Failed to delete account.',
                        fieldErrors: flattenErrors(err.errors),
                    });
                    return false;
                }
            },

            clearMessages: () =>
                set({ successMessage: null, error: null, fieldErrors: {} }),
        }),
        { name: 'profile-store' }
    )
);