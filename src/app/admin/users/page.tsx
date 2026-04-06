'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/src/store/userStore';
import { useRequireAdmin } from '@/src/hooks/useAuth';
import { PendingUsersPanel } from '@/src/components/users/PendingUsersPanel';
import { BulkActionBar } from '@/src/components/users/BulkActionBar';
import { UserFiltersBar } from '@/src/components/users/UserFiltersBar';
import { UserRow } from '@/src/components/users/UserRow';
import { Spinner } from '@/src/components/ui';
import { clsx } from 'clsx';

// ── Pagination component ─────────────────────────────────────
function Pagination({
    current, total, onChange,
}: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            <button onClick={() => onChange(current - 1)} disabled={current === 1}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm">←</button>
            {Array.from({ length: Math.min(total, 7) }, (_, i) => {
                const page = total <= 7 ? i + 1
                    : current <= 4 ? i + 1
                        : current >= total - 3 ? total - 6 + i
                            : current - 3 + i;
                return (
                    <button key={page} onClick={() => onChange(page)}
                        className={clsx('w-9 h-9 rounded-lg text-sm transition-colors',
                            page === current ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
                        {page}
                    </button>
                );
            })}
            <button onClick={() => onChange(current + 1)} disabled={current === total}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm">→</button>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────
export default function UserManagementPage() {
    useRequireAdmin();

    const users = useUserStore((s) => s.users);
    const total = useUserStore((s) => s.total);
    const currentPage = useUserStore((s) => s.currentPage);
    const totalPages = useUserStore((s) => s.totalPages);
    const isLoading = useUserStore((s) => s.isLoading);
    const error = useUserStore((s) => s.error);
    const successMessage = useUserStore((s) => s.successMessage);
    const selected = useUserStore((s) => s.selected);
    const fetchUsers = useUserStore((s) => s.fetchUsers);
    const setFilters = useUserStore((s) => s.setFilters);
    const selectAll = useUserStore((s) => s.selectAll);
    const clearSelection = useUserStore((s) => s.clearSelection);
    const clearMessages = useUserStore((s) => s.clearMessages);

    useEffect(() => {
        fetchUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-dismiss success message
    useEffect(() => {
        if (!successMessage) return;
        const t = setTimeout(clearMessages, 3000);
        return () => clearTimeout(t);
    }, [successMessage, clearMessages]);

    const allSelected = selected.size === users.length && users.length > 0;
    const someSelected = selected.size > 0 && !allSelected;
    const showArticleCol = users.some((u) => u.articleCount !== undefined);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin" className="text-md text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ← Admin
                        </Link>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                        User management
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {total.toLocaleString()} total users
                    </p>
                </div>
            </div>

            {/* ── Toast messages ─────────────────────────────────── */}
            {successMessage && (
                <div role="status" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successMessage}
                </div>
            )}
            {error && (
                <div role="alert" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                    <button onClick={clearMessages} className="ml-auto text-xs underline">Dismiss</button>
                </div>
            )}

            {/* ── Pending users panel ─────────────────────────────── */}
            <PendingUsersPanel />

            {/* ── Filters ────────────────────────────────────────── */}
            <UserFiltersBar />

            {/* ── Bulk action bar ────────────────────────────────── */}
            <BulkActionBar />

            {/* ── Table ──────────────────────────────────────────── */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {isLoading && users.length === 0 ? (
                    <div className="flex justify-center py-24"><Spinner size="lg" /></div>
                ) : users.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">No users found</p>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[640px]">
                            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    {/* Select all checkbox */}
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            ref={(el) => { if (el) el.indeterminate = someSelected; }}
                                            onChange={() => allSelected ? clearSelection() : selectAll()}
                                            className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                                            aria-label="Select all users"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">User</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">Role</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400 hidden md:table-cell">Joined</th>
                                    {showArticleCol && (
                                        <th className="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">Articles</th>
                                    )}
                                    <th className="px-4 py-3 text-right font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => (
                                    <UserRow key={user.id} user={user} isOdd={idx % 2 !== 0} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Pagination ─────────────────────────────────────── */}
            <Pagination
                current={currentPage}
                total={totalPages}
                onChange={(page) => setFilters({ page })}
            />

        </div>
    );
}