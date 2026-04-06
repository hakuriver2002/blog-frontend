import axios from "axios";
import type {
    User,
    LoginPayload,
    RegisterPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
} from "@/src/types/auth";
import { useAuthStore } from "@/src/store/authStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const { refreshToken, logout } = useAuthStore.getState();

            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refreshToken }
                );

                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = res.data.data;

                useAuthStore.setState({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                logout();

                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();

            if (typeof window !== "undefined") {
                // window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    }
);

// ── Auth Helper ──
const withAuth = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const authApi = {
    login: async (payload: LoginPayload) => {
        const res = await api.post("/auth/login", payload);
        return res.data;
    },

    register: async (payload: RegisterPayload) => {
        const res = await api.post("/auth/register", payload);
        return res.data;
    },

    googleLogin: async (payload: { code: string; redirectUri: string }) => {
        const res = await api.post("/auth/google", payload);
        return res.data;
    },

    me: async (accessToken: string): Promise<User> => {
        const res = await api.get("/auth/me", withAuth(accessToken));
        return res.data.user;
    },

    refresh: async (refreshToken: string) => {
        const res = await api.post("/auth/refresh", { refreshToken });
        return res.data;
    },

    forgotPassword: async (payload: ForgotPasswordPayload) => {
        const res = await api.post("/auth/forgot-password", payload);
        return res.data;
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        await api.post("/auth/reset-password", payload);
    },

    logout: async (refreshToken: string) => {
        await api.post("/auth/logout", { refreshToken });
    },

    // Export internal api instance for use in other files if needed
    _instance: api,
};

export default authApi;