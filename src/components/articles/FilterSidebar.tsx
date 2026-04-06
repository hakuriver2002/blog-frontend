'use client';

import { useArticleStore, selectFilters } from '@/src/store/articleStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_SLUGS, type CategorySlug } from '@/src/types/article';
import { clsx } from 'clsx';


// ── Sort options ──────────────────────────────────────────────
const SORT_OPTIONS = [
    { label: 'Newest first', sortBy: 'publishedAt', sortOrder: 'desc' },
    { label: 'Most viewed', sortBy: 'viewCount', sortOrder: 'desc' },
    { label: 'Alphabetical', sortBy: 'title', sortOrder: 'asc' },
] as const;

// ── Sidebar (desktop) ─────────────────────────────────────────
export function FilterSidebar() {
    const filters = useArticleStore(selectFilters);
    const setFilters = useArticleStore((s) => s.setFilters);

    const activeCategory = filters.category ?? '';
    const activeSortKey = `${filters.sortBy}-${filters.sortOrder}`;
    const hasActiveFilters = !!activeCategory;

    const setCategory = (slug: CategorySlug | '') => {
        setFilters({ category: slug });
    };

    const clearAll = () => {
        setFilters({ category: '', sortBy: 'publishedAt', sortOrder: 'desc' });
    };

    return (
        <aside className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6">

                {/* ── Categories ─────────────────────────────────────── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-1">
                        Category
                    </p>
                    <ul className="space-y-0.5" role="list">
                        {/* "All" option */}
                        <li>
                            <button
                                onClick={() => setCategory('')}
                                className={clsx(
                                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                                    !activeCategory
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                )}
                                aria-current={!activeCategory ? 'true' : undefined}
                            >
                                <span className="text-base leading-none">🗂️</span>
                                All articles
                            </button>
                        </li>

                        {CATEGORY_SLUGS.map((slug) => (
                            <li key={slug}>
                                <button
                                    onClick={() => setCategory(activeCategory === slug ? '' : slug)}
                                    className={clsx(
                                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                                        activeCategory === slug
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    )}
                                    aria-current={activeCategory === slug ? 'true' : undefined}
                                >
                                    <span className="text-base leading-none">{CATEGORY_ICONS[slug]}</span>
                                    {CATEGORY_LABELS[slug]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Sort ───────────────────────────────────────────── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-1">
                        Sort by
                    </p>
                    <ul className="space-y-0.5" role="list">
                        {SORT_OPTIONS.map((opt) => {
                            const key = `${opt.sortBy}-${opt.sortOrder}`;
                            const isActive = activeSortKey === key;
                            return (
                                <li key={key}>
                                    <button
                                        onClick={() => setFilters({ sortBy: opt.sortBy, sortOrder: opt.sortOrder })}
                                        className={clsx(
                                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                                            isActive
                                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        )}
                                        aria-current={isActive ? 'true' : undefined}
                                    >
                                        <span className={clsx(
                                            'w-1.5 h-1.5 rounded-full shrink-0 mt-0.5',
                                            isActive ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-600'
                                        )} />
                                        {opt.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* ── Clear all ──────────────────────────────────────── */}
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear filters
                    </button>
                )}
            </div>
        </aside>
    );
}

// ── Mobile filter bar (horizontal scroll) ────────────────────
// Renders above the article grid on mobile/tablet screens.

export function MobileFilterBar() {
    const filters = useArticleStore(selectFilters);
    const setFilters = useArticleStore((s) => s.setFilters);

    const activeCategory = filters.category ?? '';

    return (
        <div className="lg:hidden">
            {/* Category pills */}
            <div
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4"
                role="list"
                aria-label="Filter by category"
            >
                {/* All pill */}
                <button
                    onClick={() => setFilters({ category: '' })}
                    className={clsx(
                        'shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                        !activeCategory
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    )}
                >
                    All
                </button>

                {CATEGORY_SLUGS.map((slug) => (
                    <button
                        key={slug}
                        onClick={() => setFilters({ category: activeCategory === slug ? '' : slug })}
                        className={clsx(
                            'shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                            activeCategory === slug
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        )}
                    >
                        <span className="text-sm leading-none">{CATEGORY_ICONS[slug]}</span>
                        {CATEGORY_LABELS[slug]}
                    </button>
                ))}
            </div>

            {/* Sort row */}
            <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-zinc-400 shrink-0">Sort:</span>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                    {SORT_OPTIONS.map((opt) => {
                        const key = `${opt.sortBy}-${opt.sortOrder}`;
                        const isActive = `${filters.sortBy}-${filters.sortOrder}` === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilters({ sortBy: opt.sortBy, sortOrder: opt.sortOrder })}
                                className={clsx(
                                    'shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                                    isActive
                                        ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                )}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Active filter chips (shown in page header area) ───────────
// Shows what's currently active as dismissible chips.

export function ActiveFilterChips() {
    const filters = useArticleStore(selectFilters);
    const setFilters = useArticleStore((s) => s.setFilters);

    const chips: { label: string; onRemove: () => void }[] = [];

    if (filters.category) {
        chips.push({
            label: `${CATEGORY_ICONS[filters.category]} ${CATEGORY_LABELS[filters.category]}`,
            onRemove: () => setFilters({ category: '' }),
        });
    }

    if (filters.search) {
        chips.push({
            label: `"${filters.search}"`,
            onRemove: () => setFilters({ search: '' }),
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Active filters">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Filtered by:</span>
            {chips.map((chip) => (
                <span
                    key={chip.label}
                    role="listitem"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                >
                    {chip.label}
                    <button
                        onClick={chip.onRemove}
                        aria-label={`Remove filter ${chip.label}`}
                        className="hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}
        </div>
    );
}