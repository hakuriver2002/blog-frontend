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
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuthStore.getState();

            await logout();

            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    }
);

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

    getMe: async (): Promise<{ user: User }> => {
        const res = await api.get("/auth/me");
        return res.data;
    },

    forgotPassword: async (payload: ForgotPasswordPayload) => {
        const res = await api.post("/auth/forgot-password", payload);
        return res.data;
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        await api.post("/auth/reset-password", payload);
    },
    logout: async () => {
        await api.post("/auth/logout");
    },

    _instance: api,
};

export default authApi;