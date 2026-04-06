'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useArticleStore } from '@/src/store/articleStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, type Article } from '@/src/types/article';

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

// ── Mini card for related articles ───────────────────────────

function RelatedCard({ article }: { article: Article }) {
    const icon = CATEGORY_ICONS[article.category] ?? '📄';
    const label = CATEGORY_LABELS[article.category] ?? article.category;

    return (
        <Link
            href={`/articles/${article.id}`}
            className="group flex flex-col rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow duration-200"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                {article.thumbnailUrl ? (
                    <Image
                        src={(article.thumbnailUrl)!}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">
                        {icon}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {icon} {label}
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {article.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-xs text-zinc-400 pt-2">
                    {article.publishedAt && (
                        <>
                            <span>{formatDate(article.publishedAt)}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ── Main component ────────────────────────────────────────────

interface RelatedArticlesProps {
    articleId: string;
}

export function RelatedArticles({ articleId }: RelatedArticlesProps) {
    const related = useArticleStore((s) => s.relatedArticles);
    const fetchRelated = useArticleStore((s) => s.fetchRelated);

    useEffect(() => {
        if (articleId) fetchRelated(articleId);
    }, [articleId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (related.length === 0) return null;

    return (
        <section aria-labelledby="related-heading" className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
            <h2
                id="related-heading"
                className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6"
            >
                Related articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((article) => (
                    <RelatedCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}