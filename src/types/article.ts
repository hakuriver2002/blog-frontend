export type ArticleCategory =
    | 'club_news'
    | 'events'
    | 'regional_news'
    | 'internal';

export type ArticleStatus =
    | 'draft'
    | 'pending'
    | 'published'
    | 'rejected'
    | 'archived';

export type CategorySlug =
    | 'club_news'
    | 'events'
    | 'regional_news'
    | 'internal';

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
    club_news: 'Club News',
    events: 'Events',
    regional_news: 'Regional News',
    internal: 'Internal',
};

export const CATEGORY_ICONS: Record<CategorySlug, string> = {
    club_news: '📅',
    events: '🥋',
    regional_news: '💪',
    internal: '📰',
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_LABELS) as CategorySlug[];

export interface Author {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    bio?: string;
    role: 'admin' | 'editor' | 'trainer';
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    thumbnailUrl: string | null;
    category: ArticleCategory;
    status: ArticleStatus;
    isFeatured: boolean;
    viewCount: number;
    publishedAt: string | null;
    createdAt: string;
    author: Author;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedArticles {
    articles: Article[];
    pagination: Pagination;
}

export interface ArticleFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: CategorySlug | '';
    status?: 'draft' | 'pending' | 'published' | 'archived' | 'all';
    sortBy?: 'publishedAt' | 'viewCount' | 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface CreateArticlePayload {
    title: string;
    content: string;
    category: ArticleCategory;
    excerpt?: string;
    isFeatured?: boolean;
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> { }

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
