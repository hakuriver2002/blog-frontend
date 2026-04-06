import type { ApiResponse } from '@/src/types/article';

export interface CommentAuthor {
    id: string;
    fullName: string;
    avatarUrl?: string;
    role: 'admin' | 'editor' | 'trainer';
}

export interface Comment {
    id: string;
    content: string;
    author: CommentAuthor;
    articleId: string;
    parentId?: string | null;       // null = top-level, string = reply
    replies?: Comment[];           // nested replies (may be pre-populated by backend)
    isHidden: boolean;             // hidden by admin
    hiddenReason?: string;
    createdAt: string;
    updatedAt: string;
}

// ── API response shapes ──────────────────────────────────────

export interface PaginatedComments {
    comments: Comment[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

// ── Payload types ────────────────────────────────────────────

export interface PostCommentPayload {
    content: string;
}

export interface ReplyCommentPayload {
    content: string;
}

export interface HideCommentPayload {
    reason: string;
}