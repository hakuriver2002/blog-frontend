'use client';

import { useEffect, useState } from 'react';
import { useArticleStore, selectArticles, selectIsLoading, selectFilters } from '@/src/store/articleStore';
import { ArticleGrid, Pagination } from '@/src/components/articles/PostCard';
import { FilterSidebar, MobileFilterBar, ActiveFilterChips } from '@/src/components/articles/FilterSidebar';
import { Spinner } from '@/src/components/ui';
import { clsx } from 'clsx';

function useDebounce<T>(value: T, delay = 350): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function ArticleFilterSection() {
    const articles = useArticleStore(selectArticles);
    const isLoading = useArticleStore(selectIsLoading);
    const filters = useArticleStore(selectFilters);
    const currentPage = useArticleStore((s) => s.currentPage);
    const totalPages = useArticleStore((s) => s.totalPages);
    const totalArticles = useArticleStore((s) => s.totalArticles);
    const fetchArticles = useArticleStore((s) => s.fetchArticles);
    const setFilters = useArticleStore((s) => s.setFilters);

    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchInput, 400);

    // Initial fetch
    useEffect(() => {
        fetchArticles();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Trigger search when debounced value changes
    useEffect(() => {
        if (debouncedSearch !== (filters.search ?? '')) {
            setFilters({ search: debouncedSearch });
        }
    }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ search: searchInput });
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setFilters({ search: '' });
    };

    return (
        <>
            <section id="filterArticles" className="relative min-h-screen flex flex-col py-4 px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="blob-1 absolute top-20 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
                        style={{ background: "radial-gradient(circle, #1A56E8, #7C3AED)" }}
                    />
                    <div
                        className="blob-2 absolute top-40 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                        style={{ background: "radial-gradient(circle, #E8320A, #F59E0B)" }}
                    />
                    <div
                        className="blob-3 absolute bottom-20 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl opacity-15"
                        style={{ background: "radial-gradient(circle, #00C46A, #1A56E8)" }}
                    />
                    {/* Decorative orbs */}
                    <div
                        className="spin-slow absolute top-48 right-24 w-64 h-64 rounded-full border-2 border-dashed opacity-10"
                        style={{ borderColor: "#1A56E8" }}
                    />
                    <div
                        className="blob-4 absolute bottom-32 right-1/4 w-20 h-20 rounded-[24px] opacity-30"
                        style={{ background: "linear-gradient(135deg, #F59E0B, #E8320A)" }}
                    />
                    <div
                        className="blob-2 absolute top-64 left-1/4 w-12 h-12 rounded-[18px] opacity-40"
                        style={{ background: "linear-gradient(135deg, #1A56E8, #7C3AED)" }}
                    />
                </div>

                <div className='relative max-w-7xl mx-auto w-full'>
                    {/* ── Hero header ──────────────────────────────────────── */}
                    <div className="mb-8 "
                        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)" }}>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
                            Latest Articles
                        </h1>
                    </div>

                    {/* ── Search bar ───────────────────────────────────────── */}
                    <form onSubmit={handleSearchSubmit} className="mb-6 max-w-xl">
                        <div className="relative">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search articles…"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={handleSearchClear}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* ── Mobile filter bar ────────────────────────────────── */}
                    <div className="mb-6">
                        <MobileFilterBar />
                    </div>

                    {/* ── Active filter chips ───────────────────────────────── */}
                    <div className="mb-5">
                        <ActiveFilterChips />
                    </div>

                    {/* ── Main layout: sidebar + grid ──────────────────────── */}
                    <div className="flex gap-8 items-start"
                        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)" }}>

                        {/* Desktop sidebar */}
                        <FilterSidebar />

                        {/* Article grid */}
                        <div className="flex-1 min-w-0">

                            {/* Result count */}
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {isLoading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Loading…
                                        </span>
                                    ) : (
                                        <>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalArticles}</span>
                                            {' '}article{totalArticles !== 1 ? 's' : ''}
                                            {filters.category ? ` in ${filters.category}` : ''}
                                            {filters.search ? ` matching "${filters.search}"` : ''}
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Grid */}
                            {isLoading ? (
                                <div className="flex justify-center py-24">
                                    <Spinner size="lg" />
                                </div>
                            ) : (
                                <ArticleGrid articles={articles} />
                            )}

                            {/* Pagination */}
                            <div className="mt-12 ">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setFilters({ page })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}