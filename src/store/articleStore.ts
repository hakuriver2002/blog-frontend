import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Article, ArticleFilters } from '@/src/types/article';
import { articlesApi } from '@/src/lib/articleApi';

interface ArticleState {
    articles: Article[];
    totalArticles: number;
    currentPage: number;
    totalPages: number;
    filters: ArticleFilters;
    isLoading: boolean;
    error: string | null;

    activeArticle: Article | null;
    activeArticleLoading: boolean;

    // Related articles
    relatedArticles: Article[];

    editingArticle: Article | null;
    isSaving: boolean;
    saveError: string | null;

    fetchArticles: (filters?: ArticleFilters) => Promise<void>;
    fetchArticleById: (id: string) => Promise<void>;
    fetchRelated: (id: string) => Promise<void>;
    fetchForEdit: (id: string) => Promise<void>;
    saveArticle: (payload: Partial<Article> & { coverImage?: File }) => Promise<Article | null>;
    autosaveArticle: (id: string, payload: { title?: string; content?: string; excerpt?: string }) => Promise<void>;
    submitArticle: (id: string) => Promise<boolean>;
    deleteArticle: (id: string) => Promise<boolean>;
    setFilters: (filters: Partial<ArticleFilters>) => void;
    clearEditingArticle: () => void;
}

export const useArticleStore = create<ArticleState>()(
    devtools(
        (set, get) => ({
            articles: [],
            totalArticles: 0,
            currentPage: 1,
            totalPages: 1,
            filters: { page: 1, limit: 5 },
            isLoading: false,
            error: null,

            activeArticle: null,
            activeArticleLoading: false,

            editingArticle: null,
            isSaving: false,
            saveError: null,

            // ── Fetch list ──
            fetchArticles: async (overrideFilters) => {
                const filters = { ...get().filters, ...overrideFilters };

                set({ isLoading: true, error: null });

                try {
                    const res = await articlesApi.list(filters);

                    set({
                        articles: res.articles,
                        totalArticles: res.pagination.total,
                        currentPage: res.pagination.page,
                        totalPages: res.pagination.totalPages,
                        filters,
                        isLoading: false,
                    });
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Failed to load articles';
                    set({ error: msg, isLoading: false });
                }
            },

            // ── Detail ──
            fetchArticleById: async (id) => {
                set({ activeArticleLoading: true });

                try {
                    const article = await articlesApi.getById(id);
                    set({ activeArticle: article, activeArticleLoading: false });
                } catch {
                    set({ activeArticleLoading: false });
                }
            },

            // ── Edit ──
            fetchForEdit: async (id) => {
                set({ isLoading: true });

                try {
                    const article = await articlesApi.getById(id);
                    set({ editingArticle: article, isLoading: false });
                } catch {
                    set({ isLoading: false });
                }
            },

            // ── Save ──
            saveArticle: async (payload) => {
                set({ isSaving: true, saveError: null });
                try {
                    let saved: Article;
                    if (payload.id) {
                        saved = await articlesApi.update(payload.id, payload as import('@/src/types/article').UpdateArticlePayload & { coverImage?: File });
                    } else {
                        saved = await articlesApi.create(payload as import('@/src/types/article').CreateArticlePayload & { coverImage?: File });
                    }
                    set({ isSaving: false, editingArticle: saved });
                    return saved;
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Save failed';
                    set({ isSaving: false, saveError: msg });
                    return null;
                }
            },

            // ── Delete ──
            deleteArticle: async (id) => {
                try {
                    await articlesApi.delete(id);

                    set((s) => ({
                        articles: s.articles.filter((a) => a.id !== id),
                    }));

                    return true;
                } catch {
                    return false;
                }
            },

            // ── Filters ──
            setFilters: (filters) => {
                const merged = { ...get().filters, ...filters, page: 1 };
                set({ filters: merged });
                get().fetchArticles(merged);
            },

            autosaveArticle: async (id, payload) => {
                try { await articlesApi.autosave(id, payload); } catch { /* silent */ }
            },

            submitArticle: async (id) => {
                try {
                    await articlesApi.submit(id);
                    set((s) => ({
                        editingArticle: s.editingArticle ? { ...s.editingArticle, status: 'pending' } : null,
                    }));
                    return true;
                } catch { return false; }
            },

            clearEditingArticle: () => set({ editingArticle: null, saveError: null }),
        }),
        { name: 'article-store' }
    )
);

// ── Selectors ──
export const selectArticles = (s: ArticleState) => s.articles;
export const selectIsLoading = (s: ArticleState) => s.isLoading;
export const selectActiveArticle = (s: ArticleState) => s.activeArticle;
export const selectEditingArticle = (s: ArticleState) => s.editingArticle;
export const selectFilters = (s: ArticleState) => s.filters;