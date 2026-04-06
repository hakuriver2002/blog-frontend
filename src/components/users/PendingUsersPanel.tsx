'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { clsx } from 'clsx';

export function PendingUsersPanel() {
    const pendingUsers = useUserStore((s) => s.pendingUsers);
    const isLoading = useUserStore((s) => s.isLoadingPending);
    const fetchPending = useUserStore((s) => s.fetchPending);
    const approveUser = useUserStore((s) => s.approveUser);
    const rejectUser = useUserStore((s) => s.rejectUser);
    const actionPending = useUserStore((s) => s.actionPending);

    const [expanded, setExpanded] = useState(true);

    useEffect(() => { fetchPending(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const count = pendingUsers.length;

    return (
        <div className={clsx(
            'rounded-2xl border overflow-hidden transition-all',
            count > 0
                ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
        )}>
            {/* Header */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-2.5">
                    <svg className={clsx('w-4 h-4', count > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Pending approvals
                    </span>
                    {count > 0 && (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                            {count}
                        </span>
                    )}
                </div>
                <svg
                    className={clsx('w-4 h-4 text-zinc-400 transition-transform', expanded ? 'rotate-180' : '')}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Body */}
            {expanded && (
                <div className="border-t border-amber-200 dark:border-amber-800">
                    {isLoading ? (
                        <div className="px-5 py-4 space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3.5 w-40 bg-amber-100 dark:bg-amber-900/30 rounded animate-pulse" />
                                        <div className="h-3 w-28 bg-amber-100 dark:bg-amber-900/30 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : count === 0 ? (
                        <p className="px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500">
                            No pending approvals — all caught up! 🎉
                        </p>
                    ) : (
                        <div className="divide-y divide-amber-100 dark:divide-amber-900/30">
                            {pendingUsers.map((user) => {
                                const isPending = actionPending[user.id] ?? false;
                                return (
                                    <div key={user.id} className="px-5 py-3 flex items-center gap-3">
                                        {/* Avatar */}
                                        {user.avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatarUrl} alt={user.fullName}
                                                className="w-9 h-9 rounded-full object-cover shrink-0" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-sm font-bold text-amber-600 dark:text-amber-400 shrink-0 select-none">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.fullName}</p>
                                            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                                        </div>

                                        {/* Role */}
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
                                            {user.role}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => approveUser(user.id)}
                                                disabled={isPending}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectUser(user.id)}
                                                disabled={isPending}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                            {isPending && (
                                                <svg className="animate-spin h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}