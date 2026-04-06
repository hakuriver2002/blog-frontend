'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useReviewStore } from '@/src/store/reviewStore';
import { useRequireAuth } from '@/src/hooks/useAuth';
import { Spinner } from '@/src/components/ui';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
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
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Published', value: 'published' },
    { label: 'Rejected', value: 'rejected' },
];

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

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
            <div>
                <div className="mb-1">
                    <Link href="/profile" className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        ← Profile
                    </Link>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">My articles</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{myTotal} article{myTotal !== 1 ? 's' : ''} total</p>
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

            {/* Write new button */}
            <div className="flex justify-end">
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

            {/* Articles list */}
            {isLoadingMine ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : myArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-zinc-400">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-base font-semibold text-zinc-600 dark:text-zinc-300">No articles yet</p>
                    <Link href="/admin/editor"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        Write your first article →
                    </Link>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                    {myArticles.map((article) => {
                        const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;
                        const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';
                        return (
                            <div key={article.id} className="flex items-start gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                {/* Cover thumbnail */}
                                <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                                    {article.thumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={(article.thumbnailUrl)!} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">{catIcon}</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {article.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 flex-wrap">
                                                <span>{catIcon} {catLabel}</span>
                                                {article.publishedAt && <><span>·</span><span>{formatDate(article.publishedAt)}</span></>}
                                                {!article.publishedAt && <><span>·</span><span>Created {formatDate(article.createdAt)}</span></>}
                                                {article.viewCount !== undefined && <><span>·</span><span>{article.viewCount.toLocaleString()} views</span></>}
                                            </div>
                                        </div>
                                        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0', STATUS_STYLES[article.status])}>
                                            {article.status}
                                        </span>
                                    </div>
                                    {article.excerpt && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1">{article.excerpt}</p>}

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-2">
                                        {(article.status === 'draft' || article.status === 'rejected') && (
                                            <Link href={`/admin/editor?id=${article.id}`}
                                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                                Edit
                                            </Link>
                                        )}
                                        <Link href={`/articles/${article.id}`} target="_blank"
                                            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                                            View
                                        </Link>
                                        {article.status === 'rejected' && (
                                            <span className="text-xs text-red-600 dark:text-red-400">Revise and resubmit from the editor</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {myTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => fetchMyArticles(myStatusFilter, myPage - 1)} disabled={myPage === 1}
                        className="px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors">
                        ←
                    </button>
                    <span className="text-sm text-zinc-500">Page {myPage} of {myTotalPages}</span>
                    <button onClick={() => fetchMyArticles(myStatusFilter, myPage + 1)} disabled={myPage === myTotalPages}
                        className="px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors">
                        →
                    </button>
                </div>
            )}
        </div>
    );
}