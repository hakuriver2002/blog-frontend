import type { User } from '@/src/types/auth';
import type { ApiResponse } from '@/src/types/article';

// ── Extended user for admin view ─────────────────────────────
// Backend may return extra fields not in the base User type
export interface AdminUser extends User {
    articleCount?: number;    // how many articles they've written
    lastLoginAt?: string;    // ISO date
}

// ── Paginated users response ─────────────────────────────────
export interface PaginatedUsers {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

// ── Filters for GET /api/users ───────────────────────────────
export interface UserFilters {
    page?: number;
    limit?: number;
    role?: User['role'] | '';
    status?: User['status'] | 'pending' | '';
    search?: string;           // uses /api/search/users when set
}

// ── Bulk action ──────────────────────────────────────────────
// POST /api/users/bulk  →  { ids: string[], action: BulkAction }
export type BulkAction = 'lock' | 'unlock' | 'approve' | 'reject';

export interface BulkActionPayload {
    ids: string[];
    action: BulkAction;
}

export interface BulkActionResponse {
    affected: number;
    message: string;
}

// ── Role update ──────────────────────────────────────────────
// PATCH /api/users/:id/role  →  { role: UserRole }
export interface UpdateRolePayload {
    role: User['role'];
}