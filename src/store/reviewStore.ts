// src/store/reviewStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { reviewApi } from '@/src/lib/reviewApi';
import type {
    ReviewEntry,
    ArticleBulkAction,
} from '@/src/types/review';
import type { Article } from '@/src/types/article';

interface ReviewState {
    // ── History ─────────────────────────
    history: ReviewEntry[];
    isLoadingHistory: boolean;

    // ── Actions ─────────────────────────
    isActing: boolean;
    error: string | null;
    successMessage: string | null;

    // ── Admin queue ─────────────────────
    pending: Article[];
    isLoadingPending: boolean;

    selected: Set<string>;
    actionPending: Record<string, boolean>;

    // ── My articles ─────────────────────
    myArticles: Article[];
    myTotal: number;
    myPage: number;
    myTotalPages: number;
    myStatusFilter: string;
    isLoadingMine: boolean;

    // ── Actions ─────────────────────────
    fetchHistory: (articleId: string) => Promise<void>;
    submit: (articleId: string) => Promise<boolean>;

    approve: (articleId: string, note?: string) => Promise<boolean>;
    reject: (articleId: string, reason: string) => Promise<boolean>;

    fetchPending: () => Promise<void>;

    toggleSelect: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;

    bulkAction: (action: ArticleBulkAction) => Promise<void>;

    clearMessages: () => void;
    fetchMyArticles: (status?: string, page?: number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>()(
    devtools((set, get) => ({
        history: [],
        isLoadingHistory: false,

        isActing: false,
        error: null,
        successMessage: null,

        pending: [],
        isLoadingPending: false,

        selected: new Set(),
        actionPending: {},

        myArticles: [],
        myTotal: 0,
        myPage: 1,
        myTotalPages: 1,
        myStatusFilter: '',
        isLoadingMine: false,

        // ── History ───────────────────────
        fetchHistory: async (articleId) => {
            set({ isLoadingHistory: true });
            try {
                const data = await reviewApi.getHistory(articleId);
                set({ history: data, isLoadingHistory: false });
            } catch (err: any) {
                set({
                    error: err.message ?? 'Failed to load history',
                    isLoadingHistory: false,
                });
            }
        },

        fetchMyArticles: async (status = '', page = 1) => {
            set({ isLoadingMine: true });

            try {
                const res = await reviewApi.getMyArticles(status, page);

                set({
                    myArticles: res.articles,
                    myTotal: res.total,
                    myPage: res.page,
                    myTotalPages: res.totalPages,
                    myStatusFilter: status,
                    isLoadingMine: false,
                });
            } catch {
                set({ isLoadingMine: false });
            }
        },


        // ── Submit ────────────────────────
        submit: async (articleId) => {
            set({ isActing: true, error: null });

            try {
                await reviewApi.submit(articleId);

                set({
                    isActing: false,
                    successMessage: 'Submitted for review',
                });

                return true;
            } catch (err: any) {
                set({
                    isActing: false,
                    error: err.message ?? 'Submit failed',
                });
                return false;
            }
        },

        // ── Approve ───────────────────────
        approve: async (articleId, note) => {
            set({
                actionPending: { ...get().actionPending, [articleId]: true },
            });

            try {
                await reviewApi.approve(articleId, { note });

                set((s) => ({
                    pending: s.pending.filter((a) => a.id !== articleId),
                    actionPending: { ...s.actionPending, [articleId]: false },
                    successMessage: 'Approved',
                }));

                return true;
            } catch (err: any) {
                set({
                    error: err.message ?? 'Approve failed',
                    actionPending: { ...get().actionPending, [articleId]: false },
                });
                return false;
            }
        },

        // ── Reject ────────────────────────
        reject: async (articleId, reason) => {
            set({
                actionPending: { ...get().actionPending, [articleId]: true },
            });

            try {
                await reviewApi.reject(articleId, { reason });

                set((s) => ({
                    pending: s.pending.filter((a) => a.id !== articleId),
                    actionPending: { ...s.actionPending, [articleId]: false },
                    successMessage: 'Rejected',
                }));

                return true;
            } catch (err: any) {
                set({
                    error: err.message ?? 'Reject failed',
                    actionPending: { ...get().actionPending, [articleId]: false },
                });
                return false;
            }
        },

        // ── Pending ───────────────────────
        fetchPending: async () => {
            set({ isLoadingPending: true });

            try {
                const data = await reviewApi.getPending();
                set({
                    pending: data,
                    isLoadingPending: false,
                    selected: new Set(),
                });
            } catch (err: any) {
                set({
                    error: err.message ?? 'Failed to load queue',
                    isLoadingPending: false,
                });
            }
        },

        // ── Selection ─────────────────────
        toggleSelect: (id) => {
            const next = new Set(get().selected);
            next.has(id) ? next.delete(id) : next.add(id);
            set({ selected: next });
        },

        selectAll: () => {
            const ids = get().pending.map((a) => a.id);
            set({ selected: new Set(ids) });
        },

        clearSelection: () => set({ selected: new Set() }),

        // ── Bulk ─────────────────────────
        bulkAction: async (action) => {
            const ids = Array.from(get().selected);
            if (!ids.length) return;

            set({ isActing: true });

            try {
                await reviewApi.bulkAction({ ids, action });

                set((s) => ({
                    pending: s.pending.filter((a) => !ids.includes(a.id)),
                    selected: new Set(),
                    isActing: false,
                    successMessage: `Bulk ${action} success`,
                }));
            } catch (err: any) {
                set({
                    error: err.message ?? 'Bulk failed',
                    isActing: false,
                });
            }
        },

        clearMessages: () =>
            set({ error: null, successMessage: null }),
    }))
);