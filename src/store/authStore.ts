import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authApi from '@/src/lib/authApi';
import type { User, LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@/src/types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
    isAuthenticated: boolean;

    login: (payload: LoginPayload) => Promise<{ success: boolean; message: string; redirectTo: string } | null>;
    register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string } | null>;
    googleLogin: (code: string) => Promise<boolean>;
    forgotPassword: (payload: ForgotPasswordPayload) => Promise<string | null>;
    resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
    hydrateUser: () => Promise<void>;
    setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                accessToken: null,
                refreshToken: null,
                isLoading: false,
                error: null,
                fieldErrors: {},
                get isAuthenticated() { return !!get().accessToken && !!get().user; },

                login: async (payload) => {
                    set({ isLoading: true, error: null, fieldErrors: {} });
                    try {
                        const res = await authApi.login(payload);

                        const user = res.data.user;
                        const accessToken = res.data.accessToken;
                        const refreshToken = res.data.refreshToken;
                        set({
                            user,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            isLoading: false,
                        });
                        return {
                            success: true,
                            message: res.message,
                            redirectTo: res.data.redirectTo,
                        };
                    } catch (err: any) {
                        const message =
                            err.response?.data?.message ??
                            err.message ??
                            'Login failed';
                        set({
                            error: message,
                            fieldErrors: flattenErrors(err.response?.data?.errors),
                            isLoading: false,
                        });
                        return {
                            success: false,
                            message,
                            redirectTo: '',
                        };
                    }
                },

                register: async (payload) => {
                    set({ isLoading: true, error: null, fieldErrors: {} });
                    try {
                        const res = await authApi.register(payload);
                        const user = res.data;

                        set({
                            user,
                            error: null,
                            isLoading: false,
                        });

                        return {
                            success: true,
                            message: res.message
                        };
                    } catch (err: any) {
                        const message =
                            err.response?.data?.message ??
                            err.message ??
                            'Registration failed';

                        set({
                            error: message,
                            fieldErrors: flattenErrors(err.response?.data?.errors),
                            isLoading: false,
                        });
                        return {
                            success: false,
                            message
                        };
                    }
                },

                googleLogin: async (code) => {
                    set({ isLoading: true, error: null });

                    try {
                        const redirectUri = `${window.location.origin}/auth/callback/google`;

                        const res = await authApi.googleLogin({ code, redirectUri });

                        set({
                            user: res.data.user,
                            accessToken: res.data.accessToken,
                            refreshToken: res.data.refreshToken,
                            isLoading: false,
                        });

                        return true;
                    } catch (err: any) {
                        set({
                            error: err.response?.data?.message ?? 'Google login failed',
                            isLoading: false,
                        });
                        return false;
                    }
                },

                forgotPassword: async (payload) => {
                    set({ isLoading: true, error: null });
                    try {
                        const { message } = await authApi.forgotPassword(payload);
                        set({ isLoading: false });
                        return message;
                    } catch (err: any) {
                        set({ error: err.response?.data?.message ?? err.message ?? 'Request failed', isLoading: false });
                        return null;
                    }
                },

                resetPassword: async (payload) => {
                    set({ isLoading: true, error: null, fieldErrors: {} });
                    try {
                        await authApi.resetPassword(payload);
                        set({ isLoading: false });
                        return true;
                    } catch (err: any) {
                        set({
                            error: err.response?.data?.message ?? err.message ?? 'Reset failed',
                            fieldErrors: flattenErrors(err.response?.data?.errors),
                            isLoading: false,
                        });
                        return false;
                    }
                },

                logout: async () => {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                    });
                },

                hydrateUser: async () => {
                    const { refreshToken } = get();
                    if (!refreshToken) return;
                    try {
                        const res = await authApi.refresh(refreshToken);

                        const { accessToken, refreshToken: newRefreshToken, user } = res.data;
                        set({
                            user,
                            accessToken,
                            refreshToken: newRefreshToken,
                        });
                    } catch (err: any) {
                        if (err.response?.status === 401 || err.response?.status === 403) {
                            set({ user: null, accessToken: null, refreshToken: null });
                        }
                    }
                },

                setTokens: (accessToken, refreshToken) =>
                    set({ accessToken, refreshToken }),
                clearError: () => set({ error: null, fieldErrors: {} }),
            }),
            {
                name: 'auth-store',
                partialize: (s) => ({
                    user: s.user,
                    accessToken: s.accessToken,
                    refreshToken: s.refreshToken,
                }),
            }
        ),
        { name: 'auth-store' }
    )
);

// ── Shared Error Flattener ──
function flattenErrors(errors?: Record<string, string[]>): Record<string, string> {
    if (!errors) return {};
    return Object.fromEntries(
        Object.entries(errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );
}

export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => !!s.accessToken && !!s.user;
export const selectIsAdmin = (s: AuthState) => s.user?.role === 'admin';
export const selectIsEditor = (s: AuthState) => s.user?.role === 'editor';
export const selectIsTrainer = (s: AuthState) => s.user?.role === 'trainer';
export const selectIsActive = (s: AuthState) => s.user?.status === 'active';
export const selectAuthLoading = (s: AuthState) => s.isLoading;
export const selectAuthError = (s: AuthState) => s.error;
export const selectFieldErrors = (s: AuthState) => s.fieldErrors;
export const selectAccessToken = (s: AuthState) => s.accessToken;