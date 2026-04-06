'use client';

import { useEffect } from 'react';
import { MediaDropzone } from '@/src/components/media/MediaDropzone';
import { MediaGrid } from '@/src/components/media/MediaGrid';
import { MediaToolbar } from '@/src/components/media/MediaToolbar';
import type { MediaItem } from '@/src/types/media';

interface MediaPickerModalProps {
    open: boolean;
    onClose: () => void;
    onPick: (url: string, item: MediaItem) => void;
}

export function MediaPickerModal({ open, onClose, onPick }: MediaPickerModalProps) {
    // Trap focus / prevent body scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-label="Media library"
        >
            {/* Dim overlay */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70" aria-hidden />

            {/* Modal panel */}
            <div className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Media library</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Click an image to select it</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Close media library"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                    {/* Upload area */}
                    <MediaDropzone
                        compact
                        onUploaded={() => { /* grid auto-updates from store */ }}
                    />

                    {/* Toolbar */}
                    <MediaToolbar />

                    {/* Grid in pick mode */}
                    <MediaGrid onPick={(item) => onPick(item.url, item)} />
                </div>
            </div>
        </div>
    );
}