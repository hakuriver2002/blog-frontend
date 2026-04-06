'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { useCommentStore } from '@/src/store/commentStore';
import { useAuth } from '@/src/hooks/useAuth';
import { CommentForm } from '@/src/components/comments/CommentForm';
import type { Comment } from '@/src/types/comment';

function formatTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

// Hide modal 

function HideModal({
    onConfirm,
    onCancel,
    isLoading,
}: {
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const [reason, setReason] = useState('');
    return (
        <div className="mt-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 space-y-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-400">Reason for hiding:</p>
            <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Inappropriate language"
                className="w-full text-xs rounded-lg border border-red-200 dark:border-red-700 bg-white dark:bg-zinc-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-zinc-900 dark:text-zinc-100"
            />
            <div className="flex gap-2">
                <button
                    onClick={() => reason.trim() && onConfirm(reason.trim())}
                    disabled={isLoading || !reason.trim()}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors"
                >
                    {isLoading ? 'Hiding…' : 'Confirm hide'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// CommentItem  

interface CommentItemProps {
    comment: Comment;
    isReply?: boolean;       // indented reply rendering
    articleId: string;
}

export function CommentItem({ comment, isReply = false, articleId }: CommentItemProps) {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const replyToComment = useCommentStore((s) => s.replyToComment);
    const deleteComment = useCommentStore((s) => s.deleteComment);
    const hideComment = useCommentStore((s) => s.hideComment);
    const showComment = useCommentStore((s) => s.showComment);
    const isReplying = useCommentStore((s) => s.isReplying);

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isOwner = user?.id === comment.author.id;
    const canDelete = isOwner || isAdmin;
    const canModerate = isAdmin;
    const hasReplies = (comment.replies?.length ?? 0) > 0;

    // Handlers  
    const handleReply = async (content: string) => {
        const ok = await replyToComment(comment.id, content);
        if (ok) setShowReplyForm(false);
        return ok;
    };

    const handleDelete = async () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setIsDeleting(true);
        await deleteComment(comment.id);
        setIsDeleting(false);
        setConfirmDelete(false);
    };

    const handleHide = async (reason: string) => {
        setIsHiding(true);
        await hideComment(comment.id, reason);
        setIsHiding(false);
        setShowHideModal(false);
    };

    const handleShow = async () => {
        await showComment(comment.id);
    };

    return (
        <div className={clsx(
            'group',
            isReply && 'ml-10 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800'
        )}>
            <div className={clsx(
                'rounded-xl p-4 transition-colors',
                comment.isHidden
                    ? 'bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-700 opacity-60'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800'
            )}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        {comment.author.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={comment.author.avatarUrl}
                                alt={comment.author.fullName}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 select-none">
                                {comment.author.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Name + role + time */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                    {comment.author.fullName}
                                </span>
                                {/* Role badge — only for non-standard roles */}
                                {(comment.author.role === 'admin' || comment.author.role === 'editor') && (
                                    <span className={clsx(
                                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                                        comment.author.role === 'admin'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                            : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                                    )}>
                                        {comment.author.role === 'admin' ? '👑 Admin' : '✏️ Editor'}
                                    </span>
                                )}
                            </div>
                            <time
                                dateTime={comment.createdAt}
                                className="text-xs text-zinc-400 dark:text-zinc-500"
                            >
                                {formatTimeAgo(comment.createdAt)}
                            </time>
                        </div>
                    </div>

                    {/* Hidden badge */}
                    {comment.isHidden && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shrink-0">
                            Hidden
                        </span>
                    )}
                </div>

                {/* Content */}
                {comment.isHidden ? (
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                        This comment has been hidden
                        {comment.hiddenReason ? `: ${comment.hiddenReason}` : '.'
                        }
                    </p>
                ) : (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                )}

                {/* Action bar */}
                {!comment.isHidden && (
                    <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Reply — only for top-level comments, auth required */}
                        {!isReply && isAuthenticated && (
                            <button
                                onClick={() => setShowReplyForm((v) => !v)}
                                className="text-xs text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reply
                            </button>
                        )}

                        {/* Delete — owner or admin */}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={clsx(
                                    'text-xs transition-colors flex items-center gap-1',
                                    confirmDelete
                                        ? 'text-red-600 dark:text-red-400 font-semibold'
                                        : 'text-zinc-400 hover:text-red-500 dark:hover:text-red-400'
                                )}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {isDeleting ? 'Deleting…' : confirmDelete ? 'Click again to confirm' : 'Delete'}
                            </button>
                        )}

                        {/* Cancel confirm */}
                        {confirmDelete && (
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {/* Admin: Hide */}
                        {canModerate && !comment.isHidden && (
                            <button
                                onClick={() => setShowHideModal((v) => !v)}
                                className="text-xs text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                                Hide
                            </button>
                        )}

                        {/* Admin: Show (unhide) */}
                        {canModerate && comment.isHidden && (
                            <button
                                onClick={handleShow}
                                className="text-xs text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                            >
                                Show
                            </button>
                        )}
                    </div>
                )}

                {/* Hide modal */}
                {showHideModal && (
                    <HideModal
                        onConfirm={handleHide}
                        onCancel={() => setShowHideModal(false)}
                        isLoading={isHiding}
                    />
                )}
            </div>

            {/* Inline reply form */}
            {showReplyForm && (
                <div className="mt-2 ml-10">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => setShowReplyForm(false)}
                        isLoading={isReplying}
                        placeholder={`Reply to ${comment.author.fullName}…`}
                        submitLabel="Post reply"
                        autoFocus
                        compact
                    />
                </div>
            )}

            {/* Replies */}
            {hasReplies && (
                <div className="mt-3 space-y-3">
                    {comment.replies!.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            isReply
                            articleId={articleId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}