'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

const MAX_CHARS = 1000;

interface CommentFormProps {
    onSubmit: (content: string) => Promise<boolean>;
    onCancel?: () => void;
    isLoading?: boolean;
    placeholder?: string;
    submitLabel?: string;
    autoFocus?: boolean;
    compact?: boolean;  // smaller padding for inline reply form
}

export function CommentForm({
    onSubmit,
    onCancel,
    isLoading = false,
    placeholder = 'Write a comment…',
    submitLabel = 'Post comment',
    autoFocus = false,
    compact = false,
}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [focused, setFocused] = useState(autoFocus);
    const [error, setError] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus for reply forms
    useEffect(() => {
        if (autoFocus) textareaRef.current?.focus();
    }, [autoFocus]);

    // Auto-resize textarea as content grows
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (val.length <= MAX_CHARS) {
            setContent(val);
            setError('');
            // Auto-resize
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) { setError('Comment cannot be empty.'); return; }
        if (trimmed.length < 2) { setError('Too short — add more detail.'); return; }

        const ok = await onSubmit(trimmed);
        if (ok) {
            setContent('');
            setFocused(false);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleCancel = () => {
        setContent('');
        setError('');
        setFocused(false);
        onCancel?.();
    };

    const charsLeft = MAX_CHARS - content.length;
    const nearLimit = charsLeft < 100;
    const showControls = focused || content.length > 0;

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className={clsx(
                'rounded-xl border transition-all duration-150',
                focused
                    ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-zinc-200 dark:border-zinc-700',
                compact ? 'bg-zinc-50 dark:bg-zinc-900' : 'bg-white dark:bg-zinc-900'
            )}>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { if (!content) setFocused(false); }}
                    placeholder={placeholder}
                    disabled={isLoading}
                    rows={compact ? 2 : 3}
                    className={clsx(
                        'w-full resize-none bg-transparent px-4 py-3 text-sm',
                        'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400',
                        'focus:outline-none disabled:opacity-50',
                        compact ? 'min-h-[64px]' : 'min-h-[88px]'
                    )}
                    aria-label={placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'comment-error' : undefined}
                />

                {/* Controls bar — visible when focused or has content */}
                {showControls && (
                    <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Char count */}
                        <span className={clsx(
                            'text-xs tabular-nums',
                            nearLimit
                                ? 'text-amber-600 dark:text-amber-400 font-medium'
                                : 'text-zinc-400'
                        )}>
                            {charsLeft} remaining
                        </span>

                        <div className="flex items-center gap-2">
                            {/* Cancel */}
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading || !content.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Posting…
                                    </>
                                ) : submitLabel}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Validation error */}
            {error && (
                <p id="comment-error" role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </form>
    );
}