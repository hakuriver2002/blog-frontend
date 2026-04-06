'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCommentStore } from '@/src/store/commentStore';
import { useAuth } from '@/src/hooks/useAuth';
import { CommentForm } from '@/src/components/comments/CommentForm';
import { CommentItem } from '@/src/components/comments/CommentItem';
import { Spinner } from '@/src/components/ui';

interface CommentSectionProps {
    articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
    const { user, isAuthenticated } = useAuth();

    const comments = useCommentStore((s) => s.comments);
    const total = useCommentStore((s) => s.total);
    const currentPage = useCommentStore((s) => s.currentPage);
    const totalPages = useCommentStore((s) => s.totalPages);
    const isLoading = useCommentStore((s) => s.isLoading);
    const isPosting = useCommentStore((s) => s.isPosting);
    const error = useCommentStore((s) => s.error);
    const fetchComments = useCommentStore((s) => s.fetchComments);
    const loadMore = useCommentStore((s) => s.loadMore);
    const postComment = useCommentStore((s) => s.postComment);
    const clearComments = useCommentStore((s) => s.clearComments);

    // Fetch on mount, clear on unmount
    useEffect(() => {
        fetchComments(articleId);
        return () => clearComments();
    }, [articleId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePost = (content: string) => postComment(articleId, content);

    const hasMore = currentPage < totalPages;

    return (
        <section
            aria-labelledby="comments-heading"
            className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <h2
                    id="comments-heading"
                    className="text-xl font-bold text-zinc-900 dark:text-zinc-100"
                >
                    Comments
                </h2>
                {total > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {total}
                    </span>
                )}
            </div>

            {/* Post comment form */}
            <div className="mb-8">
                {isAuthenticated && user ? (
                    <div className="flex gap-3">
                        {/* User avatar */}
                        {user.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 select-none">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Form */}
                        <div className="flex-1 min-w-0">
                            <CommentForm
                                onSubmit={handlePost}
                                isLoading={isPosting}
                                placeholder="Share your thoughts…"
                                submitLabel="Post comment"
                            />
                        </div>
                    </div>
                ) : (
                    /* Login prompt */
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
                        <svg className="w-5 h-5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>
                            <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                Sign in
                            </Link>
                            {' '}to join the conversation.
                        </span>
                    </div>
                )}
            </div>

            {/* Global post error */}
            {error && (
                <div role="alert" className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Comment list */}
            {isLoading && comments.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Spinner size="md" />
                </div>
            ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm font-medium">No comments yet</p>
                    <p className="text-xs">Be the first to share your thoughts.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            articleId={articleId}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => loadMore(articleId)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Loading…
                            </>
                        ) : (
                            `Load more comments (${total - comments.length} remaining)`
                        )}
                    </button>
                </div>
            )}
        </section>
    );
}