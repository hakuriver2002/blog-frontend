import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { commentApi } from '@/src/lib/commentApi';
import type { Comment } from '@/src/types/comment';

interface CommentState {
    // Flat list — top-level comments + replies merged in
    comments: Comment[];
    total: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    isPosting: boolean;   // submitting a new top-level comment
    replyingTo: string | null;   // commentId being replied to
    isReplying: boolean;         // submitting a reply
    error: string | null;

    // Actions
    fetchComments: (articleId: string, page?: number) => Promise<void>;
    loadMore: (articleId: string) => Promise<void>;
    postComment: (articleId: string, content: string) => Promise<boolean>;
    replyToComment: (commentId: string, content: string) => Promise<boolean>;
    deleteComment: (commentId: string) => Promise<boolean>;
    hideComment: (commentId: string, reason: string) => Promise<boolean>;
    showComment: (commentId: string) => Promise<boolean>;
    setReplyingTo: (commentId: string | null) => void;
    clearComments: () => void;
}

export const useCommentStore = create<CommentState>()(
    devtools(
        (set, get) => ({
            comments: [],
            total: 0,
            currentPage: 1,
            totalPages: 1,
            isLoading: false,
            isPosting: false,
            replyingTo: null,
            isReplying: false,
            error: null,

            // fetchComments
            fetchComments: async (articleId, page = 1) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await commentApi.list(articleId, page);
                    set({
                        comments: res.comments,
                        total: res.total,
                        currentPage: res.page,
                        totalPages: res.totalPages,
                        isLoading: false,
                    });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load comments';
                    set({ error: msg, isLoading: false });
                }
            },

            // loadMore 
            // Appends next page to existing comments
            loadMore: async (articleId) => {
                const { currentPage, totalPages } = get();
                if (currentPage >= totalPages) return;
                set({ isLoading: true });
                try {
                    const next = currentPage + 1;
                    const res = await commentApi.list(articleId, next);
                    set((s) => ({
                        comments: [...s.comments, ...res.comments],
                        currentPage: res.page,
                        totalPages: res.totalPages,
                        isLoading: false,
                    }));
                } catch {
                    set({ isLoading: false });
                }
            },

            // postComment 
            postComment: async (articleId, content) => {
                set({ isPosting: true, error: null });
                try {
                    const newComment = await commentApi.post(articleId, { content });
                    // Prepend to list so it appears at top immediately
                    set((s) => ({
                        comments: [newComment, ...s.comments],
                        total: s.total + 1,
                        isPosting: false,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to post comment';
                    set({ error: msg, isPosting: false });
                    return false;
                }
            },

            // replyToComment
            replyToComment: async (commentId, content) => {
                set({ isReplying: true, error: null });
                try {
                    const reply = await commentApi.reply(commentId, { content });
                    // Append reply to the parent comment's replies array
                    set((s) => ({
                        comments: s.comments.map((c) =>
                            c.id === commentId
                                ? { ...c, replies: [...(c.replies ?? []), reply] }
                                : c
                        ),
                        total: s.total + 1,
                        isReplying: false,
                        replyingTo: null,
                    }));
                    return true;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to post reply';
                    set({ error: msg, isReplying: false });
                    return false;
                }
            },

            // deleteComment
            deleteComment: async (commentId) => {
                try {
                    await commentApi.delete(commentId);
                    // Remove from top-level list or from any parent's replies
                    set((s) => ({
                        comments: s.comments
                            .filter((c) => c.id !== commentId)
                            .map((c) => ({
                                ...c,
                                replies: c.replies?.filter((r) => r.id !== commentId),
                            })),
                        total: Math.max(0, s.total - 1),
                    }));
                    return true;
                } catch {
                    return false;
                }
            },

            // hideComment
            hideComment: async (commentId, reason) => {
                try {
                    const updated = await commentApi.hide(commentId, { reason });
                    set((s) => ({
                        comments: s.comments.map((c) =>
                            c.id === commentId ? { ...c, ...updated } : {
                                ...c,
                                replies: c.replies?.map((r) => r.id === commentId ? { ...r, ...updated } : r),
                            }
                        ),
                    }));
                    return true;
                } catch {
                    return false;
                }
            },

            // showComment 
            showComment: async (commentId) => {
                try {
                    const updated = await commentApi.show(commentId);
                    set((s) => ({
                        comments: s.comments.map((c) =>
                            c.id === commentId ? { ...c, ...updated } : {
                                ...c,
                                replies: c.replies?.map((r) => r.id === commentId ? { ...r, ...updated } : r),
                            }
                        ),
                    }));
                    return true;
                } catch {
                    return false;
                }
            },

            setReplyingTo: (commentId) => set({ replyingTo: commentId, error: null }),

            clearComments: () => set({
                comments: [], total: 0, currentPage: 1,
                totalPages: 1, error: null, replyingTo: null,
            }),
        }),
        { name: 'comment-store' }
    )
);