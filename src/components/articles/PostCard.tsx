import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/src/types/article';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/src/types/article';
import { Badge } from '@/src/components/ui';

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        .format(new Date(iso));
}

export function ArticleCard({ article }: { article: Article }) {
    const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
    const categoryIcon = CATEGORY_ICONS?.[article.category] ?? '📄';

    return (
        <article className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Cover image */}
            <Link href={`/articles/${article.id}`} className="relative block aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {article.thumbnailUrl ? (
                    <Image
                        src={(article.thumbnailUrl)!}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
                        {categoryIcon}
                    </div>
                )}
            </Link>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Category + reading time */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge color="indigo">{categoryIcon} {categoryLabel}</Badge>
                    {article.viewCount !== undefined && (
                        <span className="text-xs text-zinc-400 ml-auto">{article.viewCount.toLocaleString()} views</span>
                    )}
                </div>

                {/* Title */}
                <Link href={`/articles/${article.id}`}>
                    <h2 className="font-bold text-lg leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {article.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 flex-1">
                    {article.excerpt}
                </p>

                {/* Footer: author + date */}
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {article.author.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.author.avatarUrl} alt={article.author.fullName}
                            className="h-7 w-7 rounded-full object-cover shrink-0" />
                    ) : (
                        <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                            {article.author.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{article.author.fullName}</p>
                        {article.publishedAt && (
                            <p className="text-xs text-zinc-400">{formatDate(article.publishedAt)}</p>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export function ArticleGrid({ articles }: { articles: Article[] }) {
    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm">Try a different category or search term.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2);

    return (
        <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page">←</button>

            {visible.map((page, idx) => {
                const prev = visible[idx - 1];
                const showEllipsis = prev && page - prev > 1;
                return (
                    <span key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-2 text-zinc-400">…</span>}
                        <button
                            onClick={() => onPageChange(page)}
                            aria-current={page === currentPage ? 'page' : undefined}
                            className={page === currentPage
                                ? 'w-9 h-9 rounded-lg bg-indigo-600 text-white font-semibold text-sm'
                                : 'w-9 h-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm'}
                        >{page}</button>
                    </span>
                );
            })}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page">→</button>
        </nav>
    );
}

// Keep old names as aliases so other pages don't break
export { ArticleCard as PostCard, ArticleGrid as PostGrid };