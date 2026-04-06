import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userApi } from '@/src/lib/userApi';
import type { AdminUser, UserFilters, BulkAction } from '@/src/types/userManagement';
import type { User } from '@/src/types/auth';

interface UserState {
    users: AdminUser[];
    pendingUsers: AdminUser[];
    total: number;
    currentPage: number;
    totalPages: number;
    filters: UserFilters;
    selected: Set<string>;      // selected user IDs for bulk actions

    isLoading: boolean;
    isLoadingPending: boolean;
    actionPending: Record<string, boolean>;  // per-user pending flag
    error: string | null;
    successMessage: string | null;

    // ── Actions ────────────────────────────────────────────────
    fetchUsers: (filters?: UserFilters) => Promise<void>;
    fetchPending: () => Promise<void>;
    setFilters: (filters: Partial<UserFilters>) => void;

    approveUser: (userId: string) => Promise<boolean>;
    rejectUser: (userId: string) => Promise<boolean>;
    updateRole: (userId: string, role: User['role']) => Promise<boolean>;
    lockUser: (userId: string) => Promise<boolean>;
    unlockUser: (userId: string) => Promise<boolean>;

    bulkAction: (action: BulkAction) => Promise<boolean>;

    toggleSelect: (userId: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
    clearMessages: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        (set, get) => ({
            users: [],
            pendingUsers: [],
            total: 0,
            currentPage: 1,
            totalPages: 1,
            filters: { page: 1, limit: 20 },
            selected: new Set(),
            isLoading: false,
            isLoadingPending: false,
            actionPending: {},
            error: null,
            successMessage: null,

            // ── fetchUsers ──────────────────────────────────────────
            fetchUsers: async (overrideFilters) => {
                const filters = { ...get().filters, ...overrideFilters };
                set({ isLoading: true, error: null, filters });
                try {
                    const res = await userApi.list(filters);
                    set({
                        users: res.users,
                        total: res.total,
                        currentPage: res.page,
                        totalPages: res.totalPages,
                        isLoading: false,
                    });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load users';
                    set({ error: msg, isLoading: false });
                }
            },

            // ── fetchPending ────────────────────────────────────────
            fetchPending: async () => {
                set({ isLoadingPending: true });
                try {
                    const users = await userApi.listPending();
                    set({ pendingUsers: users, isLoadingPending: false });
                } catch {
                    set({ isLoadingPending: false });
                }
            },

            // ── setFilters ──────────────────────────────────────────
            setFilters: (filters) => {
                const merged = { ...get().filters, ...filters, page: 1 };
                set({ filters: merged, selected: new Set() });
                get().fetchUsers(merged);
            },

            // ── Helper: patch user in list ──────────────────────────
            // Replaces user in both `users` and `pendingUsers` arrays
            _patchUser: (updated: AdminUser) => {
                set((s) => ({
                    users: s.users.map((u) => u.id === updated.id ? updated : u),
                    pendingUsers: s.pendingUsers.filter((u) => u.id !== updated.id),
                }));
            },

            // ── approveUser ─────────────────────────────────────────
            approveUser: async (userId) => {
                set((s) => ({ actionPending: { ...s.actionPending, [userId]: true } }));
                try {
                    const updated = await userApi.approve(userId);
                    (get() as UserState & { _patchUser: (u: AdminUser) => void })._patchUser(updated);
                    set((s) => ({
                        actionPending: { ...s.actionPending, [userId]: false },
                        successMessage: `${updated.fullName} approved.`,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Action failed';
                    set((s) => ({ actionPending: { ...s.actionPending, [userId]: false }, error: msg }));
                    return false;
                }
            },

            // ── rejectUser ──────────────────────────────────────────
            rejectUser: async (userId) => {
                set((s) => ({ actionPending: { ...s.actionPending, [userId]: true } }));
                try {
                    const updated = await userApi.reject(userId);
                    (get() as UserState & { _patchUser: (u: AdminUser) => void })._patchUser(updated);
                    set((s) => ({
                        actionPending: { ...s.actionPending, [userId]: false },
                        successMessage: `${updated.fullName} rejected.`,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Action failed';
                    set((s) => ({ actionPending: { ...s.actionPending, [userId]: false }, error: msg }));
                    return false;
                }
            },

            // ── updateRole ──────────────────────────────────────────
            updateRole: async (userId, role) => {
                set((s) => ({ actionPending: { ...s.actionPending, [userId]: true } }));
                try {
                    const updated = await userApi.updateRole(userId, { role });
                    set((s) => ({
                        users: s.users.map((u) => u.id === userId ? updated : u),
                        actionPending: { ...s.actionPending, [userId]: false },
                        successMessage: `Role updated to ${role}.`,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Action failed';
                    set((s) => ({ actionPending: { ...s.actionPending, [userId]: false }, error: msg }));
                    return false;
                }
            },

            // ── lockUser ────────────────────────────────────────────
            lockUser: async (userId) => {
                set((s) => ({ actionPending: { ...s.actionPending, [userId]: true } }));
                try {
                    const updated = await userApi.lock(userId);
                    set((s) => ({
                        users: s.users.map((u) => u.id === userId ? updated : u),
                        actionPending: { ...s.actionPending, [userId]: false },
                        successMessage: `${updated.fullName} locked.`,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Action failed';
                    set((s) => ({ actionPending: { ...s.actionPending, [userId]: false }, error: msg }));
                    return false;
                }
            },

            // ── unlockUser ──────────────────────────────────────────
            unlockUser: async (userId) => {
                set((s) => ({ actionPending: { ...s.actionPending, [userId]: true } }));
                try {
                    const updated = await userApi.unlock(userId);
                    set((s) => ({
                        users: s.users.map((u) => u.id === userId ? updated : u),
                        actionPending: { ...s.actionPending, [userId]: false },
                        successMessage: `${updated.fullName} unlocked.`,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Action failed';
                    set((s) => ({ actionPending: { ...s.actionPending, [userId]: false }, error: msg }));
                    return false;
                }
            },

            // ── bulkAction ──────────────────────────────────────────
            bulkAction: async (action) => {
                const ids = [...get().selected];
                if (ids.length === 0) return false;
                set({ isLoading: true, error: null });
                try {
                    const res = await userApi.bulk({ ids, action });
                    // Refresh list after bulk action
                    await get().fetchUsers(get().filters);
                    set({ selected: new Set(), successMessage: res.message ?? `${res.affected} users updated.` });
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Bulk action failed';
                    set({ error: msg, isLoading: false });
                    return false;
                }
            },

            // ── Selection ───────────────────────────────────────────
            toggleSelect: (userId) => {
                set((s) => {
                    const next = new Set(s.selected);
                    next.has(userId) ? next.delete(userId) : next.add(userId);
                    return { selected: next };
                });
            },

            selectAll: () => {
                set((s) => ({ selected: new Set(s.users.map((u) => u.id)) }));
            },

            clearSelection: () => set({ selected: new Set() }),
            clearMessages: () => set({ error: null, successMessage: null }),
        }),
        { name: 'user-store' }
    )
);