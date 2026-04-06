'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useEngagementStore } from '@/src/store/engagementStore';
import { useAuth } from '@/src/hooks/useAuth';

interface BookmarkButtonProps {
    articleId: string;
    initialBookmarked?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', btn: 'gap-1 px-2.5 py-1.5 rounded-lg' },
    md: { icon: 'w-5 h-5', text: 'text-sm', btn: 'gap-1.5 px-3.5 py-2 rounded-xl' },
    lg: { icon: 'w-6 h-6', text: 'text-base', btn: 'gap-2 px-4 py-2.5 rounded-xl' },
};

export function BookmarkButton({
    articleId,
    initialBookmarked = false,
    size = 'md',
    showLabel = true,
    className,
}: BookmarkButtonProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const initEngagement = useEngagementStore((s) => s.initEngagement);
    const toggleBookmark = useEngagementStore((s) => s.toggleBookmark);
    const getEngagement = useEngagementStore((s) => s.getEngagement);
    const isPending = useEngagementStore((s) => s.bookmarkPending[articleId] ?? false);

    useEffect(() => {
        initEngagement(articleId, 0, false, initialBookmarked);
    }, [articleId, initialBookmarked]); // eslint-disable-line react-hooks/exhaustive-deps

    const { bookmarked } = getEngagement(articleId);
    const sz = sizeMap[size];

    const handleClick = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('auth_redirect', window.location.pathname);
            router.push('/auth/login');
            return;
        }
        if (isPending) return;
        toggleBookmark(articleId);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
            aria-pressed={bookmarked}
            title={bookmarked ? 'Saved to bookmarks' : 'Save to bookmarks'}
            className={clsx(
                'inline-flex items-center font-medium transition-all duration-150 select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
                'disabled:cursor-wait',
                sz.btn,
                sz.text,
                bookmarked
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-indigo-500 dark:hover:text-indigo-400',
                className
            )}
        >
            {/* Bookmark icon */}
            <span className={clsx(sz.icon, 'shrink-0')}>
                {bookmarked ? (
                    // Filled bookmark
                    <svg viewBox="0 0 24 24" fill="currentColor" className={clsx(sz.icon, 'transition-transform scale-110')}>
                        <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
                    </svg>
                ) : (
                    // Outlined bookmark
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={sz.icon}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                )}
            </span>

            {/* Label */}
            {showLabel && (
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
            )}
        </button>
    );
}