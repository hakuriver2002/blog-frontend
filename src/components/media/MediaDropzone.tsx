'use client';

import { useRef, useState, useCallback } from 'react';
import { useMediaStore } from '@/src/store/mediaStore';
import { useAuth } from '@/src/hooks/useAuth';
import { clsx } from 'clsx';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 20;
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ACCEPT_ATTR = ACCEPT_TYPES.join(',');

interface MediaDropzoneProps {
    onUploaded?: (urls: string[]) => void;   // called after all uploads complete
    compact?: boolean;                    // smaller version for modal
}

export function MediaDropzone({ onUploaded, compact = false }: MediaDropzoneProps) {
    const { user } = useAuth();
    const uploadFiles = useMediaStore((s) => s.uploadFiles);
    const uploading = useMediaStore((s) => s.uploading);
    const isUploading = useMediaStore((s) => s.isUploading);

    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // ── Validate files ────────────────────────────────────────
    const validate = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
        const valid: File[] = [];
        const errs: string[] = [];

        if (files.length > MAX_FILES) {
            errs.push(`Max ${MAX_FILES} files at once.`);
            files = files.slice(0, MAX_FILES);
        }

        for (const f of files) {
            if (!ACCEPT_TYPES.includes(f.type)) {
                errs.push(`${f.name}: unsupported type (${f.type}).`);
                continue;
            }
            if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                errs.push(`${f.name}: exceeds ${MAX_FILE_SIZE_MB} MB.`);
                continue;
            }
            valid.push(f);
        }

        return { valid, errors: errs };
    }, []);

    // ── Handle files ──────────────────────────────────────────
    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const arr = Array.from(files);
        const { valid, errors: errs } = validate(arr);
        setErrors(errs);
        if (valid.length === 0) return;

        const items = await uploadFiles(valid, user?.fullName ?? 'Unknown');
        onUploaded?.(items.map((i) => i.url));
    }, [validate, uploadFiles, user, onUploaded]);

    // ── Drop handlers ─────────────────────────────────────────
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
    const onDragLeave = () => setDragOver(false);

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onClick={() => !isUploading && inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                role="button"
                tabIndex={0}
                aria-label="Upload images — click or drag and drop"
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                className={clsx(
                    'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
                    'flex flex-col items-center justify-center text-center',
                    compact ? 'py-6 px-4' : 'py-10 px-6',
                    dragOver
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]'
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10',
                    isUploading && 'pointer-events-none opacity-75'
                )}
            >
                {/* Cloud upload icon */}
                <div className={clsx(
                    'rounded-2xl flex items-center justify-center mb-3',
                    compact ? 'w-12 h-12' : 'w-14 h-14',
                    dragOver ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-zinc-100 dark:bg-zinc-800'
                )}>
                    <svg
                        className={clsx(dragOver ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400', compact ? 'w-6 h-6' : 'w-7 h-7')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <p className={clsx('font-semibold text-zinc-700 dark:text-zinc-300', compact ? 'text-sm' : 'text-base')}>
                    {dragOver ? 'Drop to upload' : 'Click or drag images here'}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    JPG, PNG, WebP, GIF, SVG · max {MAX_FILE_SIZE_MB} MB each · up to {MAX_FILES} files
                </p>
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT_ATTR}
                className="sr-only"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                aria-hidden
            />

            {/* Upload progress */}
            {uploading.length > 0 && (
                <div className="space-y-2">
                    {uploading.map((u, i) => (
                        <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-900">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
                                    {u.filename}
                                </span>
                                {u.error ? (
                                    <span className="text-xs text-red-500">{u.error}</span>
                                ) : (
                                    <span className="text-xs text-zinc-400">{u.progress}%</span>
                                )}
                            </div>
                            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        'h-full rounded-full transition-all duration-300',
                                        u.error ? 'bg-red-500' : u.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                                    )}
                                    style={{ width: `${u.error ? 100 : u.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Validation errors */}
            {errors.length > 0 && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 space-y-1">
                    {errors.map((e, i) => (
                        <p key={i} className="text-xs text-red-700 dark:text-red-400">{e}</p>
                    ))}
                </div>
            )}
        </div>
    );
}