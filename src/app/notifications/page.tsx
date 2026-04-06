'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useNotificationStore } from '@/src/store/notificationStore';
import { useAuth } from '@/src/hooks/useAuth';
import { Spinner } from '@/src/components/ui';
import type { Notification } from '@/src/types/notification';

const TYPE_ICONS: Record<string, string> = {
    article: '📝', comment: '💬', user: '👤',
    success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️',
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        .format(new Date(iso));
}

function NotifRow({ notif }: { notif: Notification }) {
    const markOneRead = useNotificationStore((s) => s.markOneRead);
    const deleteNotification = useNotificationStore((s) => s.deleteNotification);
    const router = useRouter();

    const handleClick = async () => {
        if (!notif.isRead) await markOneRead(notif.id);
        if (notif.link) router.push(notif.link);
    };

    return (
        <div
            onClick={handleClick}
            className={clsx(
                'group flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors',
                !notif.isRead && 'bg-indigo-50/40 dark:bg-indigo-900/10'
            )}
        >
            {/* Icon */}
            <span className="text-xl shrink-0 mt-0.5">{TYPE_ICONS[notif.type] ?? 'ℹ️'}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={clsx('text-sm leading-snug', !notif.isRead ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300')}>
                    {notif.title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">{formatDate(notif.createdAt)}</p>
            </div>

            {/* Unread dot */}
            {!notif.isRead && (
                <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2" aria-label="Unread" />
            )}

            {/* Delete */}
            <button
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                aria-label="Delete"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}

export default function NotificationsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const isLoadingMore = useNotificationStore((s) => s.isLoadingMore);
    const currentPage = useNotificationStore((s) => s.currentPage);
    const totalPages = useNotificationStore((s) => s.totalPages);
    const total = useNotificationStore((s) => s.total);
    const unreadOnly = useNotificationStore((s) => s.unreadOnly);
    const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
    const loadMore = useNotificationStore((s) => s.loadMore);
    const markAllRead = useNotificationStore((s) => s.markAllRead);
    const setUnreadOnly = useNotificationStore((s) => s.setUnreadOnly);

    useEffect(() => {
        if (!isAuthenticated) { router.replace('/auth/login'); return; }
        fetchNotifications(1);
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Notifications
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {total > 0 ? `${total} total` : 'No notifications'}
                        {unreadCount > 0 && ` · ${unreadCount} unread`}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 mt-1"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 w-fit">
                {[
                    { label: 'All', value: false },
                    { label: 'Unread', value: true },
                ].map((tab) => (
                    <button
                        key={String(tab.value)}
                        onClick={() => setUnreadOnly(tab.value)}
                        className={clsx(
                            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                            unreadOnly === tab.value
                                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                        )}
                    >
                        {tab.label}
                        {tab.value && unreadCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm font-medium">{unreadOnly ? 'No unread notifications' : 'All caught up!'}</p>
                    </div>
                ) : (
                    notifications.map((n) => <NotifRow key={n.id} notif={n} />)
                )}
            </div>

            {/* Load more */}
            {currentPage < totalPages && (
                <div className="mt-4 text-center">
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoadingMore ? (
                            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Loading…</>
                        ) : `Load more (${total - notifications.length} remaining)`}
                    </button>
                </div>
            )}
        </div>
    );
}