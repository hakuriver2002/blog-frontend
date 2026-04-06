'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useReviewStore } from '@/src/store/reviewStore';
import { useRequireEditor } from '@/src/hooks/useAuth';
import { ReviewHistoryPanel } from '@/src/components/review/ReviewHistoryPanel';
import { Spinner } from '@/src/components/ui';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
import type { Article } from '@/src/types/article';
import type { ArticleBulkAction } from '@/src/types/review';

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function RejectModal({ onConfirm, onCancel, isLoading }: {
    onConfirm: (reason: string) => void; onCancel: () => void; isLoading: boolean;
}) {
    const [reason, setReason] = useState('');
    return (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 space-y-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-400">Reason for rejection:</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Needs more detail in section 2…" rows={2}
                className="w-full text-xs rounded-lg border border-red-200 dark:border-red-700 bg-white dark:bg-zinc-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-zinc-900 dark:text-zinc-100 resize-none" />
            <div className="flex gap-2">
                <button onClick={() => reason.trim() && onConfirm(reason.trim())} disabled={isLoading || !reason.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors">
                    {isLoading ? 'Rejecting…' : 'Confirm reject'}
                </button>
                <button onClick={onCancel} className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Cancel</button>
            </div>
        </div>
    );
}

function ApproveModal({ onConfirm, onCancel, isLoading }: {
    onConfirm: (note: string) => void; onCancel: () => void; isLoading: boolean;
}) {
    const [note, setNote] = useState('');
    return (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Optional note for the author:</p>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Great article! Published."
                className="w-full text-xs rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-zinc-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-zinc-900 dark:text-zinc-100" />
            <div className="flex gap-2">
                <button onClick={() => onConfirm(note)} disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors">
                    {isLoading ? 'Approving…' : 'Confirm approve'}
                </button>
                <button onClick={onCancel} className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Cancel</button>
            </div>
        </div>
    );
}

function PendingArticleRow({ article }: { article: Article }) {
    const selected = useReviewStore((s) => s.selected);
    const toggleSelect = useReviewStore((s) => s.toggleSelect);
    const actionPending = useReviewStore((s) => s.actionPending);
    const approveArticle = useReviewStore((s) => s.approve);
    const rejectArticle = useReviewStore((s) => s.reject);

    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const isPending = actionPending[article.id] ?? false;
    const isSelected = selected.has(article.id);
    const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;
    const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';

    const handleApprove = async (note: string) => {
        const ok = await approveArticle(article.id, note || undefined);
        if (ok) setShowApprove(false);
    };

    const handleReject = async (reason: string) => {
        const ok = await rejectArticle(article.id, reason);
        if (ok) setShowReject(false);
    };

    return (
        <div className={clsx('rounded-2xl border transition-colors', isSelected ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900')}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(article.id)}
                        className="mt-1 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                                <Link href={`/articles/${article.id}`} target="_blank"
                                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                                    {article.title}
                                </Link>
                                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 flex-wrap">
                                    <span>{catIcon} {catLabel}</span>
                                    <span>·</span>
                                    <div className="flex items-center gap-1.5">
                                        {article.author.avatarUrl
                                            ? <img src={article.author.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                                            : <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[8px] font-bold text-indigo-600">{article.author.fullName.charAt(0)}</div>
                                        }
                                        {article.author.fullName}
                                    </div>
                                    <span>·</span>
                                    <span>{timeAgo(article.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => { setShowHistory((v) => !v); setShowApprove(false); setShowReject(false); }}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                    History
                                </button>
                                <button onClick={() => { setShowReject((v) => !v); setShowApprove(false); setShowHistory(false); }} disabled={isPending}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                                    Reject
                                </button>
                                <button onClick={() => { setShowApprove((v) => !v); setShowReject(false); setShowHistory(false); }} disabled={isPending}
                                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50">
                                    {isPending ? 'Processing…' : 'Approve'}
                                </button>
                            </div>
                        </div>
                        {article.excerpt && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">{article.excerpt}</p>}
                    </div>
                </div>
                {showApprove && <ApproveModal onConfirm={handleApprove} onCancel={() => setShowApprove(false)} isLoading={isPending} />}
                {showReject && <RejectModal onConfirm={handleReject} onCancel={() => setShowReject(false)} isLoading={isPending} />}
            </div>
            {showHistory && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                    <p className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Review history</p>
                    <ReviewHistoryPanel articleId={article.id} />
                </div>
            )}
        </div>
    );
}

export default function ReviewQueuePage() {
    useRequireEditor();
    const pending = useReviewStore((s) => s.pending);
    const isLoading = useReviewStore((s) => s.isLoadingPending);
    const selected = useReviewStore((s) => s.selected);
    const error = useReviewStore((s) => s.error);
    const successMessage = useReviewStore((s) => s.successMessage);
    const fetchPending = useReviewStore((s) => s.fetchPending);
    const bulkAction = useReviewStore((s) => s.bulkAction);
    const selectAll = useReviewStore((s) => s.selectAll);
    const clearSelection = useReviewStore((s) => s.clearSelection);
    const clearMessages = useReviewStore((s) => s.clearMessages);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    useEffect(() => {
        if (!successMessage) return;
        const t = setTimeout(() => clearMessages(), 3000);
        return () => clearTimeout(t);
    }, [successMessage, clearMessages]);

    const BULK: { action: ArticleBulkAction; label: string; style: string }[] = [
        { action: 'approve', label: 'Approve', style: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
        { action: 'reject', label: 'Reject', style: 'bg-red-600 hover:bg-red-700 text-white' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Review queue</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{pending.length} article{pending.length !== 1 ? 's' : ''} pending</p>
                </div>
                <button onClick={fetchPending} disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors">
                    <svg className={clsx('w-4 h-4', isLoading && 'animate-spin')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {successMessage && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {successMessage}
                </div>
            )}
            {error && <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">{error}</div>}

            {selected.size > 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex-wrap">
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{selected.size} selected</span>
                    {selected.size < pending.length && <button onClick={selectAll} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Select all {pending.length}</button>}
                    <button onClick={clearSelection} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Clear</button>
                    <div className="ml-auto flex gap-2">
                        {BULK.map(({ action, label, style }) => (
                            <button key={action} onClick={() => bulkAction(action)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors', style)}>{label}</button>
                        ))}
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-base font-semibold text-zinc-600 dark:text-zinc-300">All clear!</p>
                    <p className="text-sm">No articles are waiting for review.</p>
                </div>
            ) : (
                <div className="space-y-3">{pending.map((a) => <PendingArticleRow key={a.id} article={a} />)}</div>
            )}
        </div>
    );
}