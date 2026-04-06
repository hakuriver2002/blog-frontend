'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useMediaStore } from '@/src/store/mediaStore';
import { useRequireEditor } from '@/src/hooks/useAuth';
import { MediaDropzone } from '@/src/components/media/MediaDropzone';
import { MediaToolbar } from '@/src/components/media/MediaToolbar';
import { MediaGrid } from '@/src/components/media/MediaGrid';

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export default function MediaLibraryPage() {
    // Both admin and editor can access media
    useRequireEditor();

    const items = useMediaStore((s) => s.items);

    // Compute stats from catalog
    const stats = useMemo(() => {
        const totalSize = items.reduce((s, i) => s + i.size, 0);
        const imageCount = items.filter((i) => i.mimeType.startsWith('image/')).length;
        const videoCount = items.filter((i) => i.mimeType.startsWith('video/')).length;
        const docCount = items.filter((i) => !i.mimeType.startsWith('image/') && !i.mimeType.startsWith('video/')).length;
        return { total: items.length, totalSize, imageCount, videoCount, docCount };
    }, [items]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin" className="text-md text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ← Admin
                        </Link>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Media library
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Upload and manage images for articles.
                    </p>
                </div>
            </div>

            {/* ── Stats row ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total files', value: stats.total.toLocaleString(), icon: '🗂️' },
                    { label: 'Total size', value: formatBytes(stats.totalSize), icon: '💾' },
                    { label: 'Images', value: stats.imageCount.toLocaleString(), icon: '🖼️' },
                    { label: 'Other files', value: (stats.videoCount + stats.docCount).toLocaleString(), icon: '📄' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
                        <span className="text-2xl">{stat.icon}</span>
                        <div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums leading-tight">
                                {stat.value}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Drop zone ──────────────────────────────────────── */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Upload new files</p>
                <MediaDropzone />
            </div>

            {/* ── Library ────────────────────────────────────────── */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <MediaToolbar />
                </div>
                <MediaGrid />
            </div>

        </div>
    );
}