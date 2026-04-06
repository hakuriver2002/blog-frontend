import type { ApiResponse } from '@/src/types/article';
import type {
    AdminUser,
    PaginatedUsers,
    UserFilters,
    BulkActionPayload,
    BulkActionResponse,
    UpdateRolePayload,
} from '@/src/types/userManagement';
import authApi from './authApi';

const api = authApi._instance;

// ── Build query helper ─────────────────────────────
function buildQuery(params: Record<string, unknown>): string {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
            q.append(k, String(v));
        }
    });
    return q.toString() ? `?${q.toString()}` : '';
}

export const userApi = {
    // ── GET /api/users ───────────────────────────────
    list: async (filters: UserFilters = {}): Promise<PaginatedUsers> => {
        const { search, ...rest } = filters;

        if (search && search.length >= 2) {
            return userApi.search(search, filters.role, filters.page, filters.limit);
        }

        const res = await api.get<ApiResponse<PaginatedUsers>>(
            `/api/users${buildQuery(rest as Record<string, unknown>)}`
        );

        return res.data.data;
    },

    // ── GET /api/users/pending ───────────────────────
    listPending: async (): Promise<AdminUser[]> => {
        const res = await api.get<ApiResponse<AdminUser[]>>('/api/users/pending');
        return res.data.data;
    },

    // ── GET /api/search/users ────────────────────────
    search: async (
        q: string,
        role?: string,
        page = 1,
        limit = 20
    ): Promise<PaginatedUsers> => {
        const params: Record<string, unknown> = { q, page, limit };
        if (role) params.role = role;

        const res = await api.get<ApiResponse<PaginatedUsers>>(
            `/api/search/users${buildQuery(params)}`
        );

        return res.data.data;
    },

    // ── PATCH /api/users/:id/approve ─────────────────
    approve: async (userId: string): Promise<AdminUser> => {
        const res = await api.patch<ApiResponse<AdminUser>>(
            `/api/users/${userId}/approve`
        );
        return res.data.data;
    },

    // ── PATCH /api/users/:id/reject ──────────────────
    reject: async (userId: string): Promise<AdminUser> => {
        const res = await api.patch<ApiResponse<AdminUser>>(
            `/api/users/${userId}/reject`
        );
        return res.data.data;
    },

    // ── PATCH /api/users/:id/role ────────────────────
    updateRole: async (
        userId: string,
        payload: UpdateRolePayload
    ): Promise<AdminUser> => {
        const res = await api.patch<ApiResponse<AdminUser>>(
            `/api/users/${userId}/role`,
            payload
        );
        return res.data.data;
    },

    // ── PATCH /api/users/:id/lock ────────────────────
    lock: async (userId: string): Promise<AdminUser> => {
        const res = await api.patch<ApiResponse<AdminUser>>(
            `/api/users/${userId}/lock`
        );
        return res.data.data;
    },

    // ── PATCH /api/users/:id/unlock ──────────────────
    unlock: async (userId: string): Promise<AdminUser> => {
        const res = await api.patch<ApiResponse<AdminUser>>(
            `/api/users/${userId}/unlock`
        );
        return res.data.data;
    },

    // ── POST /api/users/bulk ─────────────────────────
    bulk: async (payload: BulkActionPayload): Promise<BulkActionResponse> => {
        const res = await api.post<ApiResponse<BulkActionResponse>>(
            '/api/users/bulk',
            payload
        );
        return res.data.data;
    },
};