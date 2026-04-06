'use client';
// ============================================================
// BulkActionBar (components/users/BulkActionBar.tsx)
// Slides in at the top of the table when users are selected.
// Bulk actions: lock, unlock, approve, reject.
// ============================================================

import { useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { clsx } from 'clsx';
import type { BulkAction } from '@/src/types/userManagement';

const BULK_ACTIONS: { action: BulkAction; label: string; style: string }[] = [
    { action: 'approve', label: 'Approve', style: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { action: 'reject', label: 'Reject', style: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600' },
    { action: 'lock', label: 'Lock', style: 'bg-red-600 hover:bg-red-700 text-white' },
    { action: 'unlock', label: 'Unlock', style: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600' },
];

export function BulkActionBar() {
    const selected = useUserStore((s) => s.selected);
    const clearSelection = useUserStore((s) => s.clearSelection);
    const selectAll = useUserStore((s) => s.selectAll);
    const bulkAction = useUserStore((s) => s.bulkAction);
    const isLoading = useUserStore((s) => s.isLoading);
    const totalUsers = useUserStore((s) => s.users.length);

    const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);

    const count = selected.size;
    if (count === 0) return null;

    const handleAction = async (action: BulkAction) => {
        setPendingAction(action);
        await bulkAction(action);
        setPendingAction(null);
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex-wrap">
            {/* Selection info */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {count} selected
                </span>
                {count < totalUsers && (
                    <button
                        onClick={selectAll}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Select all {totalUsers}
                    </button>
                )}
                <button
                    onClick={clearSelection}
                    className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                    Clear
                </button>
            </div>

            <div className="ml-auto flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Apply to selected:</span>
                {BULK_ACTIONS.map(({ action, label, style }) => (
                    <button
                        key={action}
                        onClick={() => handleAction(action)}
                        disabled={isLoading || pendingAction !== null}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait',
                            style
                        )}
                    >
                        {pendingAction === action ? (
                            <span className="flex items-center gap-1.5">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                {label}…
                            </span>
                        ) : label}
                    </button>
                ))}
            </div>
        </div>
    );
}