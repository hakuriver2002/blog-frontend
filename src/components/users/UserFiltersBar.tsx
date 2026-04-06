'use client';

import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { clsx } from 'clsx';
import type { User } from '@/src/types/auth';

const ROLES: { label: string; value: User['role'] | '' }[] = [
    { label: 'All roles', value: '' },
    { label: '👑 Admin', value: 'admin' },
    { label: '✏️ Editor', value: 'editor' },
    { label: '🎓 Trainer', value: 'trainer' },
];

const STATUSES: { label: string; value: string; color: string }[] = [
    { label: 'All', value: '', color: '' },
    { label: 'Active', value: 'active', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Inactive', value: 'inactive', color: 'text-zinc-500 dark:text-zinc-400' },
    { label: 'Banned', value: 'banned', color: 'text-red-600 dark:text-red-400' },
    { label: 'Pending', value: 'pending', color: 'text-amber-600 dark:text-amber-400' },
];

function useDebounce(value: string, ms = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), ms);
        return () => clearTimeout(t);
    }, [value, ms]);
    return debounced;
}

export function UserFiltersBar() {
    const filters = useUserStore((s) => s.filters);
    const total = useUserStore((s) => s.total);
    const setFilters = useUserStore((s) => s.setFilters);

    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchInput);

    // Trigger search when debounced value changes
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        if (debouncedSearch !== (filters.search ?? '')) {
            setFilters({ search: debouncedSearch });
        }
    }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    const clearSearch = () => {
        setSearchInput('');
        setFilters({ search: '' });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="search"
                    placeholder="Search by name…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchInput && (
                    <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Role filter */}
            <select
                value={filters.role ?? ''}
                onChange={(e) => setFilters({ role: e.target.value as User['role'] | '' })}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter by role"
            >
                {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                ))}
            </select>

            {/* Status filter */}
            <select
                value={filters.status ?? ''}
                onChange={(e) => setFilters({ status: e.target.value as User['status'] | '' })}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter by status"
            >
                {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>

            {/* Result count */}
            <span className="text-sm text-zinc-400 dark:text-zinc-500 ml-auto whitespace-nowrap">
                {total.toLocaleString()} user{total !== 1 ? 's' : ''}
            </span>
        </div>
    );
}