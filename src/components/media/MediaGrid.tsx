'use client';

import { useState } from 'react';
import { useMediaStore } from '@/src/store/mediaStore';
import { clsx } from 'clsx';
import type { MediaItem } from '@/src/types/media';

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .format(new Date(iso));
}

// ── Copy-to-clipboard with feedback ──────────────────────────
function useCopyUrl() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const copy = async (id: string, url: string) => {
        await navigator.clipboard.writeText(url).catch(() => { });
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    return { copy, copiedId };
}

// ── Detail panel (shown on right when an item is selected) ───
function MediaDetailPanel({
    item,
    onClose,
    onDelete,
}: {
    item: MediaItem;
    onClose: () => void;
    onDelete: () => void;
}) {
    const { copy, copiedId } = useCopyUrl();
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div className="w-72 shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Details</span>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Preview */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                {item.mimeType.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full max-h-48 object-contain rounded-xl"
                    />
                ) : (
                    <div className="w-full h-32 flex items-center justify-center text-5xl">📄</div>
                )}
            </div>

            {/* Meta */}
            <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
                <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">Filename</p>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 break-all font-mono text-xs bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                        {item.filename}
                    </p>
                </div>

                {(item.width && item.height) && (
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">Dimensions</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.width} × {item.height} px</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">Size</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatBytes(item.size)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">Type</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.mimeType.split('/')[1]}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">Uploaded</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDate(item.uploadedAt)}</p>
                    <p className="text-xs text-zinc-400">by {item.uploadedBy}</p>
                </div>

                <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">URL</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 break-all font-mono bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-lg line-clamp-2">
                        {item.url}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <button
                    onClick={() => copy(item.id, item.url)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                >
                    {copiedId === item.id ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy URL
                        </>
                    )}
                </button>

                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open original
                </a>

                <button
                    onClick={() => {
                        if (!confirmDelete) { setConfirmDelete(true); return; }
                        onDelete();
                    }}
                    className={clsx(
                        'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        confirmDelete
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                    )}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {confirmDelete ? 'Confirm delete' : 'Delete from library'}
                </button>
            </div>
        </div>
    );
}

// ── MediaCard ─────────────────────────────────────────────────
function MediaCard({
    item,
    isSelected,
    gridSize,
    onSelect,
    onOpen,
    onCopy,
    copiedId,
}: {
    item: MediaItem;
    isSelected: boolean;
    gridSize: 'sm' | 'md' | 'lg';
    onSelect: () => void;
    onOpen: () => void;
    onCopy: () => void;
    copiedId: string | null;
}) {
    const isImage = item.mimeType.startsWith('image/');

    return (
        <div
            className={clsx(
                'group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-150',
                isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
            )}
            onClick={onOpen}
        >
            {/* Image / placeholder */}
            <div className={clsx(
                'bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center',
                gridSize === 'sm' ? 'aspect-square' : gridSize === 'md' ? 'aspect-[4/3]' : 'aspect-video'
            )}>
                {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-4xl select-none">📄</div>
                )}
            </div>

            {/* Checkbox */}
            <div
                className={clsx(
                    'absolute top-2 left-2 transition-opacity',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
                <div className={clsx(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center',
                    isSelected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white/90 dark:bg-zinc-900/90 border-zinc-300 dark:border-zinc-600'
                )}>
                    {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Hover action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onCopy(); }}
                    title="Copy URL"
                    className="w-7 h-7 rounded-lg bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
                >
                    {copiedId === item.id ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Filename (only for md/lg) */}
            {gridSize !== 'sm' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{item.filename}</p>
                    <p className="text-[10px] text-white/70">{formatBytes(item.size)}</p>
                </div>
            )}
        </div>
    );
}

// ── MediaGrid ─────────────────────────────────────────────────
interface MediaGridProps {
    /** If set, clicking an image calls this instead of opening detail panel */
    onPick?: (item: MediaItem) => void;
}

export function MediaGrid({ onPick }: MediaGridProps) {
    const items = useMediaStore((s) => s.filteredItems);
    const viewSize = useMediaStore((s) => s.viewSize);
    const selected = useMediaStore((s) => s.selected);
    const toggleSelect = useMediaStore((s) => s.toggleSelect);
    const deleteItem = useMediaStore((s) => s.deleteItem);

    const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
    const { copy, copiedId } = useCopyUrl();

    const gridCols = {
        sm: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8',
        md: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        lg: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    }[viewSize];

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">No media found</p>
                <p className="text-xs">Upload images using the drop zone above.</p>
            </div>
        );
    }

    return (
        <div className="flex gap-0 min-h-0 flex-1">
            {/* Grid */}
            <div className="flex-1 min-w-0 overflow-y-auto p-4">
                <div className={`grid gap-2 ${gridCols}`}>
                    {items.map((item) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            isSelected={selected.has(item.id)}
                            gridSize={viewSize}
                            onSelect={() => toggleSelect(item.id)}
                            onOpen={() => {
                                if (onPick) { onPick(item); return; }
                                setDetailItem((prev) => prev?.id === item.id ? null : item);
                            }}
                            onCopy={() => copy(item.id, item.url)}
                            copiedId={copiedId}
                        />
                    ))}
                </div>
            </div>

            {/* Detail panel */}
            {detailItem && !onPick && (
                <MediaDetailPanel
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                    onDelete={() => {
                        deleteItem(detailItem.id);
                        setDetailItem(null);
                    }}
                />
            )}
        </div>
    );
}