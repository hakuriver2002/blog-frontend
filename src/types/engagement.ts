import type { Article } from '@/src/types/article';

// ── Like ─────────────────────────────────────────────────────

export interface LikeResponse {
    liked: boolean;    // true = now liked, false = un-liked
    likeCount: number;     // updated total
}

// ── Bookmark ─────────────────────────────────────────────────

export interface BookmarkResponse {
    bookmarked: boolean;   // true = saved, false = removed
}

// ── Per-article engagement state ─────────────────────────────
// Attached to each article in the store so UI can be reactive

export interface ArticleEngagement {
    articleId: string;
    liked: boolean;
    likeCount: number;
    bookmarked: boolean;
}

// ── Bookmarks list (GET /api/profile/bookmarks) ──────────────

export interface BookmarksPage {
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
}