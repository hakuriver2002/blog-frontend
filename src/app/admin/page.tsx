'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useArticleStore } from '@/src/store/articleStore';
import { Button, Badge, Spinner } from '@/src/components/ui';
import type { Article } from '@/src/types/article';
import type { ArticleBulkAction } from '@/src/types/review'
import { useRequireEditor } from '@/src/hooks/useAuth';
import { CATEGORY_LABELS, CATEGORY_ICONS, type CategorySlug } from '@/src/types/article';
import clsx from 'clsx';
import { reviewApi } from '@/src/lib/reviewApi';

const STATUS_OPTS = [
    { label: 'All statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Pending', value: 'pending' },
    { label: 'Draft', value: 'draft' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Archived', value: 'archived' },
] as const;

const SORT_OPTS = [
    { label: 'Newest first', sortBy: 'createdAt', sortOrder: 'desc' },
    { label: 'Oldest first', sortBy: 'createdAt', sortOrder: 'asc' },
    { label: 'Most views', sortBy: 'viewCount', sortOrder: 'desc' },
    { label: 'Published date', sortBy: 'publishedAt', sortOrder: 'desc' },
    { label: 'Title A–Z', sortBy: 'title', sortOrder: 'asc' },
] as const;

const STATUS_STYLES: Record<Article['status'], string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',
    draft: 'bg-zinc-100   text-zinc-600   dark:bg-zinc-800      dark:text-zinc-400',
    rejected: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    archived: 'bg-zinc-100   text-zinc-500   dark:bg-zinc-800      dark:text-zinc-500',
};

const BULK_ACTIONS: { action: ArticleBulkAction; label: string; style: string; confirm: string }[] = [
    {
        action: 'approve',
        label: 'Approve',
        style: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        confirm: 'Approve selected articles?',
    },
    {
        action: 'reject',
        label: 'Reject',
        style: 'bg-red-600 hover:bg-red-700 text-white',
        confirm: 'Permanently reject selected articles? This cannot be undone.',
    },
];

function useDebounce(val: string, ms = 400) {
    const [d, setD] = useState(val);
    useEffect(() => {
        const t = setTimeout(() => setD(val), ms);
        return () => clearTimeout(t);
    }, [val, ms]);
    return d;
}

// ── Filters bar ───────────────────────────────────────────────

function FiltersBar({
    search, setSearch, status, setStatus,
    category, setCategory, sortKey, setSortKey,
    total,
}: {
    search: string; setSearch: (v: string) => void;
    status: string; setStatus: (v: string) => void;
    category: string; setCategory: (v: string) => void;
    sortKey: string; setSortKey: (v: string) => void;
    total: number;
}) {
    return (
        <div className="flex flex-wrap gap-2.5 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="search"
                    placeholder="Search articles…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Status */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Category */}
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">All categories</option>
                {/* {CategorySlug.map((s) => (
                    <option key={s} value={s}>{CATEGORY_ICONS[s]} {CATEGORY_LABELS[s]}</option>
                ))} */}
            </select>

            {/* Sort */}
            <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {SORT_OPTS.map((o) => (
                    <option key={o.sortBy + o.sortOrder} value={`${o.sortBy}:${o.sortOrder}`}>{o.label}</option>
                ))}
            </select>

            <span className="ml-auto text-sm text-zinc-400 whitespace-nowrap">
                {total.toLocaleString()} article{total !== 1 ? 's' : ''}
            </span>
        </div>
    );
}

// ── Bulk action bar ───────────────────────────────────────────

function BulkBar({
    selected, totalVisible, onSelectAll, onClear, onBulk, isBusy,
}: {
    selected: Set<string>;
    totalVisible: number;
    onSelectAll: () => void;
    onClear: () => void;
    onBulk: (action: ArticleBulkAction) => void;
    isBusy: boolean;
}) {
    const count = selected.size;
    if (count === 0) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex-wrap">
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {count} selected
            </span>
            {count < totalVisible && (
                <button onClick={onSelectAll}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Select all {totalVisible}
                </button>
            )}
            <button onClick={onClear}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                Clear
            </button>

            <div className="ml-auto flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Bulk:</span>
                {BULK_ACTIONS.map(({ action, label, style, confirm }) => (
                    <button
                        key={action}
                        disabled={isBusy}
                        onClick={() => {
                            if (window.confirm(`${confirm}\n\n${count} article${count !== 1 ? 's' : ''} will be affected.`)) {
                                onBulk(action);
                            }
                        }}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait',
                            style
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Article row ───────────────────────────────────────────────

function ArticleRow({
    article, isSelected, isOdd, onSelect, onDelete,
}: {
    article: Article;
    isSelected: boolean;
    isOdd: boolean;
    onSelect: () => void;
    onDelete: () => void;
}) {
    const catLabel = CATEGORY_LABELS[article.category as CategorySlug] ?? article.category;
    const catIcon = CATEGORY_ICONS[article.category as CategorySlug] ?? '📄';

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            .format(new Date(iso));

    return (
        <tr className={clsx(
            'border-b border-zinc-100 dark:border-zinc-800 transition-colors',
            isSelected
                ? 'bg-indigo-50 dark:bg-indigo-900/10'
                : isOdd
                    ? 'bg-zinc-50/40 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
        )}>

            {/* Checkbox */}
            <td className="pl-4 pr-2 py-3 w-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                    aria-label={`Select "${article.title}"`}
                />
            </td>

            {/* Title + author */}
            <td className="px-3 py-3 min-w-0">
                <Link
                    href={`/articles/${article.id}`}
                    target="_blank"
                    className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                >
                    {article.title}
                </Link>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {article.author.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.author.avatarUrl} alt=""
                            className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                    ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[7px] font-bold text-indigo-600 shrink-0">
                            {article.author.fullName.charAt(0)}
                        </div>
                    )}
                    <span className="text-xs text-zinc-400 truncate">{article.author.fullName}</span>
                </div>
            </td>

            {/* Category */}
            <td className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {catIcon} {catLabel}
                </span>
            </td>

            {/* Status */}
            <td className="px-3 py-3 whitespace-nowrap">
                <span className={clsx(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
                    STATUS_STYLES[article.status]
                )}>
                    {article.status}
                </span>
            </td>

            {/* Views */}
            <td className="px-3 py-3 hidden lg:table-cell text-xs text-zinc-400 whitespace-nowrap tabular-nums">
                {article.viewCount !== undefined ? article.viewCount.toLocaleString() : '—'}
            </td>

            {/* Date */}
            <td className="px-3 py-3 hidden md:table-cell text-xs text-zinc-400 whitespace-nowrap">
                {formatDate(article.publishedAt ?? article.createdAt)}
            </td>

            {/* Actions */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={`/admin/editor?id=${article.id}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Edit
                    </Link>
                    <Link
                        href={`/articles/${article.id}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        View
                    </Link>
                    <button
                        onClick={onDelete}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Pagination ────────────────────────────────────────────────

function Pagination({
    current, total, onChange,
}: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    const pages = Math.min(total, 7);
    const start = total <= 7 ? 1
        : current <= 4 ? 1
            : current >= total - 3 ? total - 6
                : current - 3;

    return (
        <div className="flex items-center justify-center gap-1 pt-2 pb-1">
            <button onClick={() => onChange(current - 1)} disabled={current === 1}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-sm transition-colors">
                ←
            </button>
            {Array.from({ length: pages }, (_, i) => start + i).map((p) => (
                <button key={p} onClick={() => onChange(p)}
                    className={clsx(
                        'w-8 h-8 rounded-lg text-sm transition-colors',
                        p === current
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    )}>
                    {p}
                </button>
            ))}
            <button onClick={() => onChange(current + 1)} disabled={current === total}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-sm transition-colors">
                →
            </button>
        </div>
    );
}

export default function AdminPage() {
    useRequireEditor();
    const articles = useArticleStore((s) => s.articles);
    const isLoading = useArticleStore((s) => s.isLoading);
    const fetchArticles = useArticleStore((s) => s.fetchArticles);
    const deleteArticle = useArticleStore((s) => s.deleteArticle);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [category, setCategory] = useState('');
    const [sortKey, setSortKey] = useState('createdAt:desc');

    const [deleting, setDeleting] = useState<string | null>(null);

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isBusy, setIsBusy] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Fetch ALL posts (drafts + published) for admin view
    useEffect(() => {
        fetchArticles({ status: 'all', limit: 50, sortBy: 'createdAt', sortOrder: 'desc' });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = async (article: Article) => {
        if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
        setDeleting(article.id);
        await deleteArticle(article.id);
        setDeleting(null);
    };

    const handleBulk = async (action: ArticleBulkAction) => {
        const ids = [...selected];
        if (!ids.length) return;
        setIsBusy(true);
        try {
            const res = await reviewApi.bulkAction({ ids, action });
            setToast({ msg: res.message ?? `${res.affected} articles updated.`, ok: true });
            setSelected(new Set());
            // Refresh current view
            const [sortBy, sortOrder] = sortKey.split(':');
            await fetchArticles({ page: currentPage, limit: 20, status: status as 'all', category: category as CategorySlug || undefined, sortBy: sortBy as 'createdAt', sortOrder: sortOrder as 'desc' });
        } catch {
            setToast({ msg: 'Bulk action failed.', ok: false });
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Manage all posts — {articles.length} total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/editor">
                        <Button size="md">+ New Post</Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-24"><Spinner size="lg" /></div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Title</th>
                                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden md:table-cell">Date</th>
                                <th className="text-right px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article, idx) => (
                                <tr
                                    key={article.id}
                                    className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${idx % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-900/30'}`}
                                >
                                    {/* Title */}
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-xs">
                                            {article.title}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate max-w-xs">/articles/{article.slug}</p>
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <Badge color="indigo">{article.category}</Badge>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <Badge color={article.status === 'published' ? 'green' : 'yellow'}>
                                            {article.status}
                                        </Badge>
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/editor?id=${article.id}`}>
                                                <Button variant="secondary" size="sm">Edit</Button>
                                            </Link>
                                            <Link href={`/posts/${article.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                isLoading={deleting === article.id}
                                                onClick={() => handleDelete(article)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {articles.length === 0 && (
                        <div className="py-16 text-center text-zinc-400">
                            <p className="text-lg font-medium">No posts yet</p>
                            <Link href="/admin/editor" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
                                Create your first post →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}