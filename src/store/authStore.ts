import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authApi from '@/src/lib/authApi';
import type {
    User,
    LoginPayload,
    RegisterPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload
} from '@/src/types/auth';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
    isAuthenticated: boolean;

    login: (payload: LoginPayload) => Promise<{ success: boolean; message: string; redirectUrl: string }>;
    register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
    googleLogin: (code: string) => Promise<boolean>;
    forgotPassword: (payload: ForgotPasswordPayload) => Promise<string | null>;
    resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
    logout: () => Promise<void>;
    hydrateUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isLoading: false,
                error: null,
                fieldErrors: {},

                get isAuthenticated() {
                    return !!get().user;
                },

                // ✅ LOGIN (cookie-based)
                login: async (payload) => {
                    set({ isLoading: true, error: null, fieldErrors: {} });

                    try {
                        const res = await authApi.login(payload);

                        set({
                            user: res.user ?? null,
                            isLoading: false,
                        });

                        return {
                            success: true,
                            message: res.message,
                            redirectUrl: res.redirectUrl,
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
                            redirectUrl: '',
                        };
                    }
                },

                // ✅ REGISTER
                register: async (payload) => {
                    set({ isLoading: true, error: null, fieldErrors: {} });

                    try {
                        const res = await authApi.register(payload);

                        set({
                            user: res.user ?? null,
                            isLoading: false,
                        });

                        return {
                            success: true,
                            message: res.message,
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
                            message,
                        };
                    }
                },

                // ✅ GOOGLE LOGIN (cookie-based)
                googleLogin: async (code) => {
                    set({ isLoading: true, error: null });

                    try {
                        const redirectUri = `${window.location.origin}/auth/callback/google`;

                        const res = await authApi.googleLogin({ code, redirectUri });

                        set({
                            user: res.user ?? null,
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

                // ✅ FORGOT PASSWORD
                forgotPassword: async (payload) => {
                    set({ isLoading: true, error: null });

                    try {
                        const { message } = await authApi.forgotPassword(payload);
                        set({ isLoading: false });
                        return message;
                    } catch (err: any) {
                        set({
                            error: err.response?.data?.message ?? err.message ?? 'Request failed',
                            isLoading: false
                        });
                        return null;
                    }
                },

                // ✅ RESET PASSWORD
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

                // ✅ LOGOUT (backend clear cookie)
                logout: async () => {
                    try {
                        await authApi.logout();
                    } finally {
                        set({
                            user: null,
                            error: null,
                            fieldErrors: {},
                        });
                    }
                },

                // ✅ HYDRATE USER (thay refresh token)
                hydrateUser: async () => {
                    try {
                        const res = await authApi.getMe(); // API cần có

                        set({
                            user: res.user,
                        });
                    } catch (err: any) {
                        set({ user: null });
                    }
                },

                clearError: () => set({ error: null, fieldErrors: {} }),
            }),
            {
                name: 'auth-store',
                partialize: (s) => ({
                    user: s.user,
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

// ── Selectors ──
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => !!s.user;
export const selectIsAdmin = (s: AuthState) => s.user?.role === 'ADMIN';
export const selectIsEditor = (s: AuthState) => s.user?.role === 'EDITOR';
export const selectIsTrainer = (s: AuthState) => s.user?.role === 'TRAINER';
export const selectIsActive = (s: AuthState) => s.user?.status === 'ACTIVE';
export const selectAuthLoading = (s: AuthState) => s.isLoading;
export const selectAuthError = (s: AuthState) => s.error;
export const selectFieldErrors = (s: AuthState) => s.fieldErrors;