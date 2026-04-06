'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => url ?? (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = getUrl();
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareTwitter = () => {
        const text = encodeURIComponent(`${title} ${getUrl()}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
    };

    const shareFacebook = () => {
        const u = encodeURIComponent(getUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank', 'noopener');
    };

    return (
        <div className="flex items-center gap-2 flex-wrap" aria-label="Share this article">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-1">Share:</span>

            {/* Copy link */}
            <button
                onClick={handleCopy}
                className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    copied
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                )}
                aria-label="Copy article link"
            >
                {copied ? (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Copy link
                    </>
                )}
            </button>

            {/* Twitter / X */}
            <button
                onClick={shareTwitter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all"
                aria-label="Share on X (Twitter)"
            >
                {/* X logo */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
            </button>

            {/* Facebook */}
            <button
                onClick={shareFacebook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all"
                aria-label="Share on Facebook"
            >
                {/* Facebook logo */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
            </button>
        </div>
    );
}