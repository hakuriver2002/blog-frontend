'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useEngagementStore } from '@/src/store/engagementStore';
import { useAuth } from '@/src/hooks/useAuth';

interface LikeButtonProps {
    articleId: string;
    initialCount?: number;
    initialLiked?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', btn: 'gap-1 px-2.5 py-1.5 rounded-lg' },
    md: { icon: 'w-5 h-5', text: 'text-sm', btn: 'gap-1.5 px-3.5 py-2 rounded-xl' },
    lg: { icon: 'w-6 h-6', text: 'text-base', btn: 'gap-2 px-4 py-2.5 rounded-xl' },
};

export function LikeButton({
    articleId,
    initialCount = 0,
    initialLiked = false,
    size = 'md',
    showCount = true,
    className,
}: LikeButtonProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const initEngagement = useEngagementStore((s) => s.initEngagement);
    const toggleLike = useEngagementStore((s) => s.toggleLike);
    const getEngagement = useEngagementStore((s) => s.getEngagement);
    const isPending = useEngagementStore((s) => s.likePending[articleId] ?? false);

    // Seed store with server values on mount
    useEffect(() => {
        initEngagement(articleId, initialCount, initialLiked, false);
    }, [articleId, initialCount, initialLiked]); // eslint-disable-line react-hooks/exhaustive-deps

    const engagement = getEngagement(articleId);
    const { liked, likeCount } = engagement;

    // Animate on like
    const [animating, setAnimating] = useState(false);
    const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClick = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('auth_redirect', window.location.pathname);
            router.push('/auth/login');
            return;
        }

        if (isPending) return;

        // Trigger pop animation
        setAnimating(true);
        if (animRef.current !== null) {
            clearTimeout(animRef.current);
        }
        animRef.current = setTimeout(() => setAnimating(false), 400);

        toggleLike(articleId);
    };

    const sz = sizeMap[size];

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            aria-label={liked ? 'Unlike this article' : 'Like this article'}
            aria-pressed={liked}
            className={clsx(
                'inline-flex items-center font-medium transition-all duration-150 select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2',
                'disabled:cursor-wait',
                sz.btn,
                sz.text,
                liked
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500 dark:hover:text-red-400',
                className
            )}
        >
            {/* Heart icon */}
            <span className={clsx(sz.icon, 'inline-flex items-center justify-center shrink-0 relative')}>
                {/* Pop animation overlay */}
                <span
                    className={clsx(
                        'absolute inset-0 rounded-full bg-red-400/20 scale-0 transition-transform',
                        animating && 'animate-ping-once'
                    )}
                    aria-hidden
                />
                {liked ? (
                    // Filled heart
                    <svg viewBox="0 0 24 24" fill="currentColor" className={clsx(sz.icon, 'transition-transform', animating && 'scale-125')}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                ) : (
                    // Outlined heart
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={sz.icon}>
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                )}
            </span>

            {/* Count */}
            {showCount && (
                <span className="tabular-nums">
                    {likeCount > 0 ? likeCount.toLocaleString() : ''}
                    {likeCount === 0 && !liked ? 'Like' : ''}
                </span>
            )}
        </button>
    );
}