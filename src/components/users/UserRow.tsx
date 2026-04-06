'use client';

import { useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { clsx } from 'clsx';
import type { AdminUser } from '@/src/types/userManagement';
import type { User } from '@/src/types/auth';

// ── Style maps ────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    // inactive: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const ROLE_STYLES: Record<string, string> = {
    admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    editor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    trainer: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

const ROLE_ICONS: Record<string, string> = {
    admin: '👑', editor: '✏️', trainer: '🎓',
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

interface UserRowProps {
    user: AdminUser;
    isOdd: boolean;
}

export function UserRow({ user, isOdd }: UserRowProps) {
    const selected = useUserStore((s) => s.selected);
    const toggleSelect = useUserStore((s) => s.toggleSelect);
    const actionPending = useUserStore((s) => s.actionPending);
    const approveUser = useUserStore((s) => s.approveUser);
    const rejectUser = useUserStore((s) => s.rejectUser);
    const lockUser = useUserStore((s) => s.lockUser);
    const unlockUser = useUserStore((s) => s.unlockUser);
    const updateRole = useUserStore((s) => s.updateRole);

    const [roleOpen, setRoleOpen] = useState(false);
    const isPending = actionPending[user.id] ?? false;
    const isSelected = selected.has(user.id);

    const ROLES: User['role'][] = ['admin', 'editor', 'trainer'];

    return (
        <tr className={clsx(
            'border-b border-zinc-100 dark:border-zinc-800 transition-colors',
            isSelected
                ? 'bg-indigo-50 dark:bg-indigo-900/10'
                : isOdd
                    ? 'bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40',
            isPending && 'opacity-60'
        )}>

            {/* Checkbox */}
            <td className="px-4 py-3 w-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(user.id)}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                    aria-label={`Select ${user.fullName}`}
                />
            </td>

            {/* User */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                    {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatarUrl} alt={user.fullName}
                            className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0 select-none">
                            {user.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role — dropdown selector */}
            <td className="px-4 py-3">
                <div className="relative">
                    <button
                        onClick={() => setRoleOpen((v) => !v)}
                        disabled={isPending}
                        className={clsx(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer',
                            ROLE_STYLES[user.role] ?? 'bg-zinc-100 text-zinc-600',
                            'hover:opacity-80'
                        )}
                    >
                        {ROLE_ICONS[user.role]} {user.role}
                        <svg className="w-2.5 h-2.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {roleOpen && (
                        <div className="absolute left-0 top-full mt-1 z-20 w-36 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 py-1">
                            {ROLES.map((r) => (
                                <button
                                    key={r}
                                    onClick={async () => {
                                        setRoleOpen(false);
                                        if (r !== user.role) await updateRole(user.id, r);
                                    }}
                                    className={clsx(
                                        'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                                        r === user.role
                                            ? 'font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                    )}
                                >
                                    {ROLE_ICONS[r]} {r}
                                    {r === user.role && (
                                        <svg className="ml-auto w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <span className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    STATUS_STYLES[user.status] ?? 'bg-zinc-100 text-zinc-600'
                )}>
                    {user.status}
                </span>
            </td>

            {/* Joined */}
            <td className="px-4 py-3 text-xs text-zinc-400 hidden md:table-cell whitespace-nowrap">
                {formatDate(user.createdAt)}
            </td>

            {/* Articles */}
            {user.articleCount !== undefined && (
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 hidden lg:table-cell text-center">
                    {user.articleCount}
                </td>
            )}

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                    {/* Pending-specific: approve / reject */}
                    {user.status === 'pending' && (
                        <>
                            <button
                                onClick={() => approveUser(user.id)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => rejectUser(user.id)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {/* Lock / Unlock */}
                    {user.status !== 'pending' && (
                        user.status === 'banned' ? (
                            <button
                                onClick={() => unlockUser(user.id)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
                            >
                                Unlock
                            </button>
                        ) : (
                            <button
                                onClick={() => lockUser(user.id)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                            >
                                Lock
                            </button>
                        )
                    )}

                    {/* Loading spinner */}
                    {isPending && (
                        <svg className="animate-spin h-4 w-4 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                </div>
            </td>
        </tr>
    );
}