// store/notificationStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notificationApi } from '@/src/lib/notificationApi';
import type { Notification } from '@/src/types/notification';

interface NotificationState {
    notifications: Notification[];
    total: number;
    currentPage: number;
    totalPages: number;
    unreadCount: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    unreadOnly: boolean;

    fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    loadMore: () => Promise<void>;
    markOneRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    setUnreadOnly: (v: boolean) => void;
    startPolling: () => () => void;  // returns cleanup fn
}

export const useNotificationStore = create<NotificationState>()(
    devtools(
        (set, get) => ({
            notifications: [],
            total: 0,
            currentPage: 1,
            totalPages: 1,
            unreadCount: 0,
            isLoading: false,
            isLoadingMore: false,
            unreadOnly: false,

            fetchNotifications: async (page = 1, unreadOnly) => {
                const filter = unreadOnly ?? get().unreadOnly;
                set({ isLoading: true });
                try {
                    const res = await notificationApi.list(page, 20, filter);
                    set({
                        notifications: res.notifications,
                        total: res.total,
                        currentPage: res.page,
                        totalPages: res.totalPages,
                        unreadCount: res.unreadCount ?? get().unreadCount,
                        isLoading: false,
                    });
                } catch { set({ isLoading: false }); }
            },

            fetchUnreadCount: async () => {
                try {
                    const count = await notificationApi.unreadCount();
                    set({ unreadCount: count });
                } catch { /* silent */ }
            },

            loadMore: async () => {
                const { currentPage, totalPages, unreadOnly } = get();
                if (currentPage >= totalPages) return;
                set({ isLoadingMore: true });
                try {
                    const res = await notificationApi.list(currentPage + 1, 20, unreadOnly);
                    set((s) => ({
                        notifications: [...s.notifications, ...res.notifications],
                        currentPage: res.page,
                        totalPages: res.totalPages,
                        isLoadingMore: false,
                    }));
                } catch { set({ isLoadingMore: false }); }
            },

            markOneRead: async (id) => {
                await notificationApi.markOneRead(id);
                set((s) => ({
                    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
                    unreadCount: Math.max(0, s.unreadCount - 1),
                }));
            },

            markAllRead: async () => {
                await notificationApi.markAllRead();
                set((s) => ({
                    notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));
            },

            deleteNotification: async (id) => {
                const wasUnread = get().notifications.find((n) => n.id === id && !n.isRead);
                await notificationApi.delete(id);
                set((s) => ({
                    notifications: s.notifications.filter((n) => n.id !== id),
                    total: s.total - 1,
                    unreadCount: wasUnread ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
                }));
            },

            setUnreadOnly: (v) => {
                set({ unreadOnly: v });
                get().fetchNotifications(1, v);
            },

            // Poll unread count every 30s while user is logged in
            startPolling: () => {
                get().fetchUnreadCount();
                const id = setInterval(() => get().fetchUnreadCount(), 30_000);
                return () => clearInterval(id);
            },
        }),
        { name: 'notification-store' }
    )
);