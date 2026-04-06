'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useArticleStore } from '@/src/store/articleStore';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/src/types/article';
import { Spinner } from '@/src/components/ui';
import { ReadingProgressBar } from '@/src/components/articles/ReadingProgressBar';
import { TableOfContents } from '@/src/components/articles/TableOfContents';
import { ShareButtons } from '@/src/components/articles/ShareButtons';
import { AuthorCard } from '@/src/components/articles/AuthorCard';
import { RelatedArticles } from '@/src/components/articles/RelatedArticles';
import { CommentSection } from '@/src/components/comments/CommentSection';
import { EngagementBar, StickyEngagementBar } from '@/src/components/engagement/EngagementBar';

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(iso));
}

export default function ArticlePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const article = useArticleStore((s) => s.activeArticle);
    const loading = useArticleStore((s) => s.activeArticleLoading);
    const fetchById = useArticleStore((s) => s.fetchArticleById);

    useEffect(() => {
        if (params.id) fetchById(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Loading ─────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    // ── Not found ────────────────────────────────────────────────
    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-zinc-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl font-semibold text-zinc-600 dark:text-zinc-300">Article not found</p>
                <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    ← Back to home
                </Link>
            </div>
        );
    }

    const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
    const categoryIcon = CATEGORY_ICONS[article.category] ?? '📄';

    return (
        <>
            {/* ── Reading progress bar (fixed, top of viewport) ──── */}
            <ReadingProgressBar />

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* ── Back button ──────────────────────────────────── */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* ── Three-column layout ───────────────────────────── */}
                <div className="flex gap-10 items-start">

                    {/* Left: Table of contents (desktop only) */}
                    <TableOfContents contentSelector="#article-content" />

                    {/* Centre: Article */}
                    <article className="flex-1 min-w-0 max-w-3xl">

                        {/* Category breadcrumb */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <Link
                                href={`/?category=${article.category}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {categoryIcon} {categoryLabel}
                            </Link>
                            {article.status !== 'published' && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    {article.status}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight mb-5">
                            {article.title}
                        </h1>

                        {/* Excerpt / lead */}
                        {article.excerpt && (
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 border-l-4 border-indigo-200 dark:border-indigo-800 pl-4">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-sm text-zinc-500 dark:text-zinc-400">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                {article.author.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={article.author.avatarUrl}
                                        alt={article.author.fullName}
                                        className="h-7 w-7 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400">
                                        {article.author.fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    {article.author.fullName}
                                </span>
                            </div>

                            {/* Separator */}
                            <span className="text-zinc-300 dark:text-zinc-700">·</span>

                            {/* Date */}
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                            )}

                            {/* View count */}
                            {article.viewCount !== undefined && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                    <span>{article.viewCount.toLocaleString()} views</span>
                                </>
                            )}
                        </div>

                        {/* Cover image */}
                        {(article.thumbnailUrl) && (
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-zinc-100 dark:bg-zinc-800">
                                <Image
                                    src={(article.thumbnailUrl)!}
                                    alt={article.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                />
                            </div>
                        )}

                        {/* ── Article body ─────────────────────────────────
                id="article-content" is used by TableOfContents
                to query for h2/h3 headings.
            ─────────────────────────────────────────────────── */}
                        <div
                            id="article-content"
                            className="prose prose-zinc dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-indigo-500 prose-blockquote:not-italic
                prose-code:text-indigo-700 dark:prose-code:text-indigo-300
                prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 prose-pre:rounded-xl
                prose-img:rounded-xl prose-img:shadow-sm"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* ── Engagement bar (like + bookmark + share) ── */}
                        <EngagementBar
                            articleId={article.id}
                            articleTitle={article.title}
                            initialLikeCount={article.viewCount}
                            variant="article"
                        />

                        {/* ── Author card ───────────────────────────────── */}
                        <AuthorCard author={article.author} />

                        {/* ── Related articles ─────────────────────────── */}
                        <RelatedArticles articleId={article.id} />

                        {/* ── Comments ─────────────────────────────────── */}
                        <CommentSection articleId={article.id} />

                    </article>

                    {/* Right spacer (keeps centre column from stretching too wide on xl) */}
                    <div className="hidden xl:block w-56 shrink-0" aria-hidden />
                </div>
            </div>

            {/* ── Sticky mobile bar ────────────────────────────────── */}
            <StickyEngagementBar
                articleId={article.id}
                articleTitle={article.title}
            />
        </>
    );
}