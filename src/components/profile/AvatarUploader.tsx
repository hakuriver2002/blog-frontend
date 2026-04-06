'use client';

import { useRef, useState, useCallback } from 'react';
import { useProfileStore } from '@/src/store/profileStore';
import { useAuthStore } from '@/src/store/authStore';
import { clsx } from 'clsx';

const MAX_SIZE_MB = 2;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function AvatarUploader() {
    const user = useAuthStore((s) => s.user);
    const uploadAvatar = useProfileStore((s) => s.uploadAvatar);
    const isUploading = useProfileStore((s) => s.isUploadingAvatar);

    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [localError, setLocalError] = useState('');

    // ── Validate & preview ─────────────────────────────────────
    const handleFile = useCallback((file: File) => {
        setLocalError('');

        if (!ACCEPT.includes(file.type)) {
            setLocalError('Only JPG, PNG, WebP or GIF allowed.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setLocalError(`File must be under ${MAX_SIZE_MB} MB.`);
            return;
        }

        // Local preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    // ── Upload confirmed preview ───────────────────────────────
    const handleUpload = async () => {
        if (!inputRef.current?.files?.[0]) return;
        const url = await uploadAvatar(inputRef.current.files[0]);
        if (url) setPreview(null); // clear preview — authStore now has the real URL
    };

    // ── Drag & drop ────────────────────────────────────────────
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            // Assign to input so handleUpload can read it
            const dt = new DataTransfer();
            dt.items.add(file);
            if (inputRef.current) inputRef.current.files = dt.files;
            handleFile(file);
        }
    };

    const currentAvatar = preview ?? user?.avatarUrl ?? null;
    const initials = user?.fullName
        ? user.fullName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* ── Avatar display ─────────────────────────────────── */}
            <div className="relative shrink-0">
                <div
                    className={clsx(
                        'w-24 h-24 rounded-2xl overflow-hidden ring-2 transition-all duration-200',
                        dragOver
                            ? 'ring-indigo-500 ring-offset-2 scale-105'
                            : 'ring-zinc-200 dark:ring-zinc-700'
                    )}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                >
                    {currentAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={currentAvatar}
                            alt={user?.fullName ?? 'Avatar'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 select-none">
                                {initials}
                            </span>
                        </div>
                    )}
                </div>

                {/* Upload spinner overlay */}
                {isUploading && (
                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* ── Controls ───────────────────────────────────────── */}
            <div className="flex flex-col gap-2 min-w-0">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile photo</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    JPG, PNG or WebP · max {MAX_SIZE_MB} MB · drag or click to change
                </p>

                {/* Hidden file input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT.join(',')}
                    className="sr-only"
                    aria-label="Upload profile photo"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <div className="flex flex-wrap gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        Choose file
                    </button>

                    {/* Show confirm/cancel when there's a pending preview */}
                    {preview && (
                        <>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading…' : 'Upload'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(null);
                                    setLocalError('');
                                    if (inputRef.current) inputRef.current.value = '';
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>

                {localError && (
                    <p className="text-xs text-red-600 dark:text-red-400" role="alert">{localError}</p>
                )}
            </div>
        </div>
    );
}