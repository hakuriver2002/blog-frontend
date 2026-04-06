'use client';
// app/admin/my-articles/page.tsx
// Trainer's own article list, served inside the admin layout.
// Calls GET /api/profile/articles?status=&page=1&limit=20
// Tabs: All | Draft | Pending | Published | Rejected
// Per-row actions: Edit (draft/rejected) | View | "Revise and resubmit" hint

import { useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useReviewStore } from '@/src/store/reviewStore';
import { useRequireAuth } from '@/src/hooks/useAuth';
import { Spinner } from '@/src/components/ui';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
import { SubmitForReviewButton } from '@/src/components/review/SubmitForReviewButton';
import type { Article } from '@/src/types/article';

const STATUS_STYLES: Record<Article['status'], string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',
    draft: 'bg-zinc-100   text-zinc-600   dark:bg-zinc-800      dark:text-zinc-400',
    rejected: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    archived: 'bg-zinc-100   text-zinc-500   dark:bg-zinc-800      dark:text-zinc-500',
};

const STATUS_TABS = [
    { label: 'All', value: '' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Published', value: 'published' },
    { label: 'Rejected', value: 'rejected' },
];

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

// ── Article row ───────────────────────────────────────────────
function ArticleRow({ article }: { article: Article }) {
    const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;
    const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';

    return (
        <div className="flex items-start gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                {article.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={(article.thumbnailUrl)!} alt=""
                        className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl select-none">{catIcon}</div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {article.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 flex-wrap">
                            <span>{catIcon} {catLabel}</span>
                            <span>·</span>
                            {article.publishedAt
                                ? <span>Published {formatDate(article.publishedAt)}</span>
                                : <span>Created {formatDate(article.createdAt)}</span>
                            }
                            {article.viewCount !== undefined && article.viewCount > 0 && (
                                <><span>·</span><span>{article.viewCount.toLocaleString()} views</span></>
                            )}
                        </div>
                    </div>

                    {/* Status badge */}
                    <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0',
                        STATUS_STYLES[article.status]
                    )}>
                        {article.status}
                    </span>
                </div>

                {article.excerpt && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1">{article.excerpt}</p>
                )}

                {/* Actions row */}
                <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                    {(article.status === 'draft' || article.status === 'rejected') && (
                        <Link href={`/admin/editor?id=${article.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Link>
                    )}

                    {article.status !== 'draft' && (
                        <Link href={`/articles/${article.id}`} target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View live
                        </Link>
                    )}

                    {/* Submit / resubmit inline */}
                    {(article.status === 'draft' || article.status === 'rejected') && (
                        <div className="ml-auto">
                            <SubmitForReviewButton article={article} />
                        </div>
                    )}

                    {article.status === 'pending' && (
                        <p className="ml-auto text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Waiting for review
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────
export default function MyArticlesPage() {
    useRequireAuth();

    const myArticles = useReviewStore((s) => s.myArticles);
    const myTotal = useReviewStore((s) => s.myTotal);
    const myPage = useReviewStore((s) => s.myPage);
    const myTotalPages = useReviewStore((s) => s.myTotalPages);
    const myStatusFilter = useReviewStore((s) => s.myStatusFilter);
    const isLoadingMine = useReviewStore((s) => s.isLoadingMine);
    const fetchMyArticles = useReviewStore((s) => s.fetchMyArticles);

    useEffect(() => { fetchMyArticles(''); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                        My articles
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {myTotal > 0
                            ? `${myTotal} article${myTotal !== 1 ? 's' : ''} total`
                            : 'No articles yet'}
                    </p>
                </div>
                <Link
                    href="/admin/editor"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write new article
                </Link>
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 w-fit overflow-x-auto">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => fetchMyArticles(tab.value)}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                            myStatusFilter === tab.value
                                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {isLoadingMine ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : myArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-center">
                        <p className="text-base font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                            {myStatusFilter ? `No ${myStatusFilter} articles` : 'No articles yet'}
                        </p>
                        <p className="text-sm text-zinc-400">
                            {myStatusFilter
                                ? 'Try a different filter above.'
                                : 'Start writing and submit for review when ready.'}
                        </p>
                    </div>
                    {!myStatusFilter && (
                        <Link href="/admin/editor"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                            Write your first article
                        </Link>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                    {myArticles.map((article) => (
                        <ArticleRow key={article.id} article={article} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {myTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => fetchMyArticles(myStatusFilter, myPage - 1)}
                        disabled={myPage === 1}
                        className="px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                    >
                        ← Prev
                    </button>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 px-2">
                        Page {myPage} of {myTotalPages}
                    </span>
                    <button
                        onClick={() => fetchMyArticles(myStatusFilter, myPage + 1)}
                        disabled={myPage === myTotalPages}
                        className="px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}

        </div>
    );
}