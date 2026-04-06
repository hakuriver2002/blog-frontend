// types/notification.ts
import type { ApiResponse } from '@/src/types/article';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'article' | 'comment' | 'user';
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
    unreadCount: number;
}

export interface UnreadCountResponse {
    count: number;
}