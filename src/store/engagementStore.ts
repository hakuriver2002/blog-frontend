import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { engagementApi } from '@/src/lib/engagementApi';
import type { ArticleEngagement, BookmarksPage } from '@/src/types/engagement';
import type { Article } from '@/src/types/article';

interface EngagementState {
    // Map of articleId → engagement state
    // Persisted to localStorage so likes/bookmarks survive refresh
    engagements: Record<string, ArticleEngagement>;

    // Bookmarks list (from GET /api/profile/bookmarks)
    bookmarks: Article[];
    bookmarksTotal: number;
    bookmarksPage: number;
    bookmarksTotalPages: number;
    isLoadingBookmarks: boolean;

    // Per-article pending flags (prevents double-clicks)
    likePending: Record<string, boolean>;
    bookmarkPending: Record<string, boolean>;

    // ── Actions ────────────────────────────────────────────────
    // Initialize engagement for an article (called when article loads)
    initEngagement: (articleId: string, likeCount?: number, liked?: boolean, bookmarked?: boolean) => void;

    toggleLike: (articleId: string) => Promise<void>;
    toggleBookmark: (articleId: string) => Promise<void>;
    fetchBookmarks: (page?: number) => Promise<void>;
    loadMoreBookmarks: () => Promise<void>;

    // Getters (use these in components)
    getEngagement: (articleId: string) => ArticleEngagement;
}

const DEFAULT_ENGAGEMENT: ArticleEngagement = {
    articleId: '',
    liked: false,
    likeCount: 0,
    bookmarked: false,
};

export const useEngagementStore = create<EngagementState>()(
    devtools(
        persist(
            (set, get) => ({
                engagements: {},
                bookmarks: [],
                bookmarksTotal: 0,
                bookmarksPage: 1,
                bookmarksTotalPages: 1,
                isLoadingBookmarks: false,
                likePending: {},
                bookmarkPending: {},

                // ── initEngagement ─────────────────────────────────────
                // Called when article page loads — seeds initial server values.
                // Does NOT overwrite already-optimistic local state if present.
                initEngagement: (articleId, likeCount = 0, liked = false, bookmarked = false) => {
                    set((s) => {
                        if (s.engagements[articleId]) return s; // already have local state
                        return {
                            engagements: {
                                ...s.engagements,
                                [articleId]: { articleId, liked, likeCount, bookmarked },
                            },
                        };
                    });
                },

                // ── toggleLike ─────────────────────────────────────────
                toggleLike: async (articleId) => {
                    const { likePending, engagements } = get();
                    if (likePending[articleId]) return; // prevent double-click

                    const current = engagements[articleId] ?? { ...DEFAULT_ENGAGEMENT, articleId };
                    const wasLiked = current.liked;

                    // 1. Optimistic update
                    set((s) => ({
                        likePending: { ...s.likePending, [articleId]: true },
                        engagements: {
                            ...s.engagements,
                            [articleId]: {
                                ...current,
                                liked: !wasLiked,
                                likeCount: wasLiked
                                    ? Math.max(0, current.likeCount - 1)
                                    : current.likeCount + 1,
                            },
                        },
                    }));

                    // 2. API call — rollback on failure
                    try {
                        const res = await engagementApi.toggleLike(articleId);
                        // Confirm with server values
                        set((s) => ({
                            likePending: { ...s.likePending, [articleId]: false },
                            engagements: {
                                ...s.engagements,
                                [articleId]: {
                                    ...s.engagements[articleId],
                                    liked: res.liked,
                                    likeCount: res.likeCount,
                                },
                            },
                        }));
                    } catch {
                        // Rollback to previous state
                        set((s) => ({
                            likePending: { ...s.likePending, [articleId]: false },
                            engagements: {
                                ...s.engagements,
                                [articleId]: {
                                    ...s.engagements[articleId],
                                    liked: wasLiked,
                                    likeCount: current.likeCount,
                                },
                            },
                        }));
                    }
                },

                // ── toggleBookmark ─────────────────────────────────────
                toggleBookmark: async (articleId) => {
                    const { bookmarkPending, engagements } = get();
                    if (bookmarkPending[articleId]) return;

                    const current = engagements[articleId] ?? { ...DEFAULT_ENGAGEMENT, articleId };
                    const wasBookmarked = current.bookmarked;

                    // 1. Optimistic update
                    set((s) => ({
                        bookmarkPending: { ...s.bookmarkPending, [articleId]: true },
                        engagements: {
                            ...s.engagements,
                            [articleId]: { ...current, bookmarked: !wasBookmarked },
                        },
                    }));

                    // 2. API call — rollback on failure
                    try {
                        const res = await engagementApi.toggleBookmark(articleId);
                        set((s) => ({
                            bookmarkPending: { ...s.bookmarkPending, [articleId]: false },
                            engagements: {
                                ...s.engagements,
                                [articleId]: {
                                    ...s.engagements[articleId],
                                    bookmarked: res.bookmarked,
                                },
                            },
                        }));
                    } catch {
                        // Rollback
                        set((s) => ({
                            bookmarkPending: { ...s.bookmarkPending, [articleId]: false },
                            engagements: {
                                ...s.engagements,
                                [articleId]: {
                                    ...s.engagements[articleId],
                                    bookmarked: wasBookmarked,
                                },
                            },
                        }));
                    }
                },

                // ── fetchBookmarks ──────────────────────────────────────
                fetchBookmarks: async (page = 1) => {
                    set({ isLoadingBookmarks: true });
                    try {
                        const res: BookmarksPage = await engagementApi.getBookmarks(page);
                        set({
                            bookmarks: res.articles,
                            bookmarksTotal: res.total,
                            bookmarksPage: res.page,
                            bookmarksTotalPages: res.totalPages,
                            isLoadingBookmarks: false,
                        });
                    } catch {
                        set({ isLoadingBookmarks: false });
                    }
                },

                // ── loadMoreBookmarks ───────────────────────────────────
                loadMoreBookmarks: async () => {
                    const { bookmarksPage, bookmarksTotalPages } = get();
                    if (bookmarksPage >= bookmarksTotalPages) return;
                    set({ isLoadingBookmarks: true });
                    try {
                        const res = await engagementApi.getBookmarks(bookmarksPage + 1);
                        set((s) => ({
                            bookmarks: [...s.bookmarks, ...res.articles],
                            bookmarksPage: res.page,
                            bookmarksTotalPages: res.totalPages,
                            isLoadingBookmarks: false,
                        }));
                    } catch {
                        set({ isLoadingBookmarks: false });
                    }
                },

                // ── getEngagement ───────────────────────────────────────
                getEngagement: (articleId) =>
                    get().engagements[articleId] ?? { ...DEFAULT_ENGAGEMENT, articleId },
            }),
            {
                name: 'engagement-store',
                // Only persist engagement map (likes/bookmarks), not loading/pending state
                partialize: (s) => ({ engagements: s.engagements }),
            }
        ),
        { name: 'engagement-store' }
    )
);