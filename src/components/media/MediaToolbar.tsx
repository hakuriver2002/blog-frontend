'use client';

import { useState, useEffect, useRef } from 'react';
import { useMediaStore } from '@/src/store/mediaStore';
import { clsx } from 'clsx';

const TYPE_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Images', value: 'image/' },
    { label: 'Videos', value: 'video/' },
    { label: 'Docs', value: 'application/' },
];

const SORT_OPTIONS = [
    { label: 'Newest first', sortBy: 'uploadedAt', sortOrder: 'desc' },
    { label: 'Oldest first', sortBy: 'uploadedAt', sortOrder: 'asc' },
    { label: 'Name A–Z', sortBy: 'filename', sortOrder: 'asc' },
    { label: 'Largest first', sortBy: 'size', sortOrder: 'desc' },
] as const;

const VIEW_SIZES = [
    {
        size: 'sm' as const, icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="3" height="3" rx="0.5" /><rect x="5" y="1" width="3" height="3" rx="0.5" />
                <rect x="9" y="1" width="3" height="3" rx="0.5" /><rect x="13" y="1" width="3" height="3" rx="0.5" />
                <rect x="1" y="5" width="3" height="3" rx="0.5" /><rect x="5" y="5" width="3" height="3" rx="0.5" />
                <rect x="9" y="5" width="3" height="3" rx="0.5" /><rect x="13" y="5" width="3" height="3" rx="0.5" />
            </svg>
        )
    },
    {
        size: 'md' as const, icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
        )
    },
    {
        size: 'lg' as const, icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="14" height="6" rx="1" /><rect x="1" y="9" width="14" height="6" rx="1" />
            </svg>
        )
    },
];

function useDebounce(val: string, ms = 300) {
    const [d, setD] = useState(val);
    useEffect(() => {
        const t = setTimeout(() => setD(val), ms);
        return () => clearTimeout(t);
    }, [val, ms]);
    return d;
}

export function MediaToolbar() {
    const filters = useMediaStore((s) => s.filters);
    const viewSize = useMediaStore((s) => s.viewSize);
    const selected = useMediaStore((s) => s.selected);
    const items = useMediaStore((s) => s.items);
    const setFilters = useMediaStore((s) => s.setFilters);
    const setViewSize = useMediaStore((s) => s.setViewSize);
    const deleteSelected = useMediaStore((s) => s.deleteSelected);
    const selectAll = useMediaStore((s) => s.selectAll);
    const clearSelection = useMediaStore((s) => s.clearSelection);

    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchInput);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) { firstRender.current = false; return; }
        setFilters({ search: debouncedSearch });
    }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

    const handleBulkDelete = () => {
        if (!confirmBulkDelete) { setConfirmBulkDelete(true); return; }
        deleteSelected();
        setConfirmBulkDelete(false);
    };

    return (
        <div className="space-y-3">
            {/* Row 1: search + type filter + sort */}
            <div className="flex flex-wrap gap-2.5 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search filenames…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Type filter */}
                <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilters({ mimeType: f.value })}
                            className={clsx(
                                'px-3 py-2 text-xs font-medium transition-colors',
                                (filters.mimeType ?? '') === f.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-') as [string, string];
                        setFilters({ sortBy: sortBy as 'uploadedAt' | 'filename' | 'size', sortOrder: sortOrder as 'asc' | 'desc' });
                    }}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Sort by"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.sortBy + o.sortOrder} value={`${o.sortBy}-${o.sortOrder}`}>{o.label}</option>
                    ))}
                </select>

                {/* View size */}
                <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden ml-auto">
                    {VIEW_SIZES.map(({ size, icon }) => (
                        <button
                            key={size}
                            onClick={() => setViewSize(size)}
                            title={`${size} grid`}
                            className={clsx(
                                'px-3 py-2 transition-colors',
                                viewSize === size
                                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                    : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            )}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 2: selection bar (only when items selected) */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex-wrap">
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                        {selected.size} selected
                    </span>
                    {selected.size < items.length && (
                        <button onClick={selectAll} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                            Select all {items.length}
                        </button>
                    )}
                    <button onClick={clearSelection} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                        Clear
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={handleBulkDelete}
                            className={clsx(
                                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                                confirmBulkDelete
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            )}
                        >
                            {confirmBulkDelete ? `Delete ${selected.size} items?` : 'Delete selected'}
                        </button>
                        {confirmBulkDelete && (
                            <button
                                onClick={() => setConfirmBulkDelete(false)}
                                className="text-xs text-zinc-400 hover:text-zinc-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}