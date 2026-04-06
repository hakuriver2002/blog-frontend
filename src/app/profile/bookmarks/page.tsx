'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useEngagementStore } from '@/src/store/engagementStore';
import { useRequireAuth } from '@/src/hooks/useAuth';
import { ArticleGrid } from '@/src/components/articles/PostCard';
import { Spinner } from '@/src/components/ui';

export default function BookmarksPage() {
    const { isAuthenticated } = useRequireAuth();
    const bookmarks = useEngagementStore((s) => s.bookmarks);
    const total = useEngagementStore((s) => s.bookmarksTotal);
    const page = useEngagementStore((s) => s.bookmarksPage);
    const totalPages = useEngagementStore((s) => s.bookmarksTotalPages);
    const isLoading = useEngagementStore((s) => s.isLoadingBookmarks);
    const fetchBookmarks = useEngagementStore((s) => s.fetchBookmarks);
    const loadMore = useEngagementStore((s) => s.loadMoreBookmarks);

    useEffect(() => {
        if (isAuthenticated) fetchBookmarks(1);
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasMore = page < totalPages;

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center py-32">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <Link
                        href="/profile"
                        className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        ← Settings
                    </Link>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                    {/* Filled bookmark icon */}
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
                    </svg>
                    Saved articles
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {total > 0
                        ? `${total} article${total !== 1 ? 's' : ''} saved`
                        : 'Articles you bookmark will appear here'}
                </p>
            </div>

            {/* Loading */}
            {isLoading && bookmarks.length === 0 ? (
                <div className="flex justify-center py-24">
                    <Spinner size="lg" />
                </div>
            ) : bookmarks.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 gap-5 text-zinc-400">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 mb-1">No saved articles yet</p>
                        <p className="text-sm">Hit the bookmark icon on any article to save it here.</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                    >
                        Browse articles
                    </Link>
                </div>
            ) : (
                <>
                    {/* Article grid */}
                    <ArticleGrid articles={bookmarks} />

                    {/* Load more */}
                    {hasMore && (
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => loadMore()}
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
                                ) : `Load more (${total - bookmarks.length} remaining)`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}