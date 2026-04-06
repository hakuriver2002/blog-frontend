'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useArticleStore } from '@/src/store/articleStore';
import { reviewApi } from '@/src/lib/reviewApi';
import { articlesApi } from '@/src/lib/articleApi';
import { Button, Input, Textarea, Select, Badge, Spinner } from '@/src/components/ui';
import { MediaPickerModal } from '@/src/components/media/MediaPickerModal';
import type { CategorySlug, Article } from '@/src/types/article';

// ── Lazy-load TinyMCE (client-only, heavy bundle) ────────────
const RichEditor = dynamic(
    () => import('@/src/components/editor/RichEditor').then((m) => m.RichEditor),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <Spinner />
            </div>
        ),
    }
);

// ── Slug helper ───────────────────────────────────────────────
function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ── Form state type ───────────────────────────────────────────
interface FormState {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnailUrl?: string;
    category: CategorySlug;
    status: 'draft' | 'published';
}

const EMPTY_FORM: FormState = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnailUrl: '',
    category: 'regional_news',
    status: 'draft',
};

// ── Component ─────────────────────────────────────────────────
export default function EditorPage() {
    const router = useRouter();
    const params = useSearchParams();

    const postId = params.get('id');
    const isEdit = !!postId;
    const isSaving = useArticleStore((s) => s.isSaving);
    const saveError = useArticleStore((s) => s.saveError);

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const autosaveRef = useRef<NodeJS.Timeout | null>(null);

    // ── Load categories + tags ────────────────────────────────
    useEffect(() => {
        if (!postId) return;

        setLoading(true);
        articlesApi.getById(postId)
            .then((article: Article) => {
                setForm({
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt ?? '',
                    content: article.content,
                    thumbnailUrl: article.thumbnailUrl ?? '',
                    category: article.category,
                    status: article.status === 'published' ? 'published' : 'draft',
                });
            })
            .finally(() => setLoading(false));
    }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Autosave ──────────────────────────────────────────────
    // PATCH /api/articles/:id/autosave — debounced 3s after typing stops
    useEffect(() => {
        if (!postId || !form.title) return;

        if (autosaveRef.current) clearTimeout(autosaveRef.current);

        autosaveRef.current = setTimeout(() => {
            articlesApi.autosave(postId, {
                title: form.title,
                content: form.content,
                excerpt: form.excerpt,
            }).catch(() => { });
        }, 3000);

        return () => {
            if (autosaveRef.current) clearTimeout(autosaveRef.current);
        };
    }, [form.title, form.content, form.excerpt, postId]);

    // ── Field helpers ─────────────────────────────────────────
    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleTitleChange = (title: string) => {
        setForm((f) => ({
            ...f,
            title,
            slug: f.slug && f.slug !== toSlug(f.title) ? f.slug : toSlug(title),
        }));
    };

    // ── Validation ────────────────────────────────────────────
    const validate = () => {
        const e: Record<string, string> = {};

        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.slug.trim()) e.slug = 'Slug is required';
        if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required';
        if (!form.content.trim()) e.content = 'Content is required';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────
    const handleSubmit = async (status: 'draft' | 'published') => {
        if (!validate()) return;

        setSaving(true);

        const payload = {
            title: form.title,
            content: form.content,
            excerpt: form.excerpt,
            category: form.category,
            status,
        };

        try {
            if (postId) {
                await articlesApi.update(postId, payload);
            } else {
                const created = await articlesApi.create(payload);
                router.replace(`/admin/editor?id=${created.id}`);
            }

            router.push('/admin/my-articles');
        } catch (err: any) {
            alert(err.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {isEdit ? 'Edit Post' : 'New Post'}
                </h1>
                <Button variant="ghost" onClick={() => router.push('/admin')}>
                    ← Back
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Left: Main content ───────────────────────── */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Title */}
                    <Input
                        label="Post Title"
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="An Amazing Blog Post"
                        error={errors.title}
                    />

                    {/* Slug */}
                    <Input
                        label="URL Slug"
                        value={form.slug}
                        onChange={(e) => setField('slug', toSlug(e.target.value))}
                        placeholder="an-amazing-blog-post"
                        hint="Auto-generated from title. Edit to customise."
                        error={errors.slug}
                    />

                    {/* Excerpt */}
                    <Textarea
                        label="Excerpt / Summary"
                        value={form.excerpt}
                        onChange={(e) => setField('excerpt', e.target.value)}
                        placeholder="A short description shown in post cards and meta tags…"
                        rows={3}
                        error={errors.excerpt}
                    />

                    {/* TinyMCE Editor */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Content
                        </label>
                        <RichEditor
                            value={form.content}
                            onChange={(html) => setField('content', html)}
                            height={520}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-600 mt-1" role="alert">{errors.content}</p>
                        )}
                    </div>
                </div>

                {/* ── Right: Sidebar ───────────────────────────── */}
                <div className="flex flex-col gap-6">
                    {/* Publish actions */}
                    <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3">
                        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Publish</h2>
                        {saveError && (
                            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                                {saveError}
                            </p>
                        )}
                        <Button
                            variant="secondary"
                            isLoading={isSaving}
                            onClick={() => handleSubmit('draft')}
                            className="w-full"
                        >
                            Save as Draft
                        </Button>
                        <Button
                            variant="primary"
                            isLoading={isSaving}
                            onClick={() => handleSubmit('published')}
                            className="w-full"
                        >
                            🚀 Publish
                        </Button>
                    </div>

                    {/* Category
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              options={category.map((c) => ({ label: c.name, value: c.id }))}
              error={errors.category}
            />
          </div> */}

                    {/* Tags
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.tagIds.includes(tag.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="text-xs text-zinc-400">No tags available</p>
              )}
            </div>
          </div> */}

                    {/* Cover Image */}
                    <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cover image</p>

                        {/* Preview */}
                        {form.thumbnailUrl && (
                            <div className="relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={form.thumbnailUrl}
                                    alt="Cover preview"
                                    className="w-full aspect-video object-cover rounded-xl bg-zinc-100"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setField('thumbnailUrl', '')}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    aria-label="Remove cover image"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Choose from library */}
                        <button
                            type="button"
                            onClick={() => setMediaPickerOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {form.thumbnailUrl ? 'Change image' : 'Choose from library'}
                        </button>

                        {/* Manual URL fallback */}
                        <Input
                            label="Or paste URL"
                            value={form.thumbnailUrl}
                            onChange={(e) => setField('thumbnailUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Media picker modal */}
            {/* <MediaPickerModal
                open={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onPick={(url) => {
                    set('coverImage', url);
                    setMediaPickerOpen(false);
                }}
            /> */}
        </div>
    );
}