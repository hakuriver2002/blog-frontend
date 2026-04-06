'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useNotificationStore } from '@/src/store/notificationStore';
import { useAuth } from '@/src/hooks/useAuth';
import type { Notification } from '@/src/types/notification';

const TYPE_ICONS: Record<string, string> = {
    article: '📝', comment: '💬', user: '👤',
    success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️',
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function NotifItem({ notif }: { notif: Notification }) {
    const markOneRead = useNotificationStore((s) => s.markOneRead);
    const deleteNotification = useNotificationStore((s) => s.deleteNotification);
    const router = useRouter();

    const handleClick = async () => {
        if (!notif.isRead) await markOneRead(notif.id);
        if (notif.link) router.push(notif.link);
    };

    return (
        <div
            className={clsx(
                'group flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer',
                !notif.isRead && 'bg-indigo-50/50 dark:bg-indigo-900/10'
            )}
            onClick={handleClick}
        >
            <span className="shrink-0 text-base mt-0.5">{TYPE_ICONS[notif.type] ?? 'ℹ️'}</span>
            <div className="flex-1 min-w-0">
                <p className={clsx('text-sm leading-snug line-clamp-1', !notif.isRead ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300')}>
                    {notif.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{timeAgo(notif.createdAt)}</p>
            </div>
            {!notif.isRead && (
                <span className="shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-2" aria-hidden />
            )}
            <button
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-400 hover:text-red-500 transition-all"
                aria-label="Delete notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const notifications = useNotificationStore((s) => s.notifications);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
    const markAllRead = useNotificationStore((s) => s.markAllRead);
    const startPolling = useNotificationStore((s) => s.startPolling);

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Start polling when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;
        return startPolling();
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch list when dropdown opens
    useEffect(() => {
        if (open) fetchNotifications(1);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={ref}>
            {/* Bell button */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
                aria-expanded={open}
                className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 z-50 overflow-hidden flex flex-col max-h-[480px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                            <Link
                                href="/notifications"
                                onClick={() => setOpen(false)}
                                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            >
                                See all
                            </Link>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <svg className="animate-spin h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-400">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-sm font-medium">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {notifications.slice(0, 8).map((n) => (
                                    <NotifItem key={n.id} notif={n} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                            <Link
                                href="/notifications"
                                onClick={() => setOpen(false)}
                                className="block text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View all notifications →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}