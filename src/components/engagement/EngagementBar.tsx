'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { LikeButton } from '@/src/components/engagement/LikeButton';
import { BookmarkButton } from '@/src/components/engagement/BookmarkButton';
import { ShareButtons } from '@/src/components/blog/ShareButtons';

interface EngagementBarProps {
    articleId: string;
    articleTitle: string;
    initialLiked?: boolean;
    initialLikeCount?: number;
    initialBookmarked?: boolean;
    variant?: 'article' | 'card';
}

export function EngagementBar({
    articleId,
    articleTitle,
    initialLiked = false,
    initialLikeCount = 0,
    initialBookmarked = false,
    variant = 'article',
}: EngagementBarProps) {

    if (variant === 'card') {
        // Compact inline row for article cards
        return (
            <div className="flex items-center gap-2">
                <LikeButton
                    articleId={articleId}
                    initialLiked={initialLiked}
                    initialCount={initialLikeCount}
                    size="sm"
                    showCount
                />
                <BookmarkButton
                    articleId={articleId}
                    initialBookmarked={initialBookmarked}
                    size="sm"
                    showLabel={false}
                />
            </div>
        );
    }

    // Full article bar
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
                <LikeButton
                    articleId={articleId}
                    initialLiked={initialLiked}
                    initialCount={initialLikeCount}
                    size="md"
                    showCount
                />
                <BookmarkButton
                    articleId={articleId}
                    initialBookmarked={initialBookmarked}
                    size="md"
                    showLabel
                />
            </div>
            <ShareButtons title={articleTitle} />
        </div>
    );
}

// ── Sticky floating bar (mobile) ─────────────────────────────
// Slides up from the bottom of the screen once user scrolls
// past 300px. Useful on mobile where the article bar is offscreen.

export function StickyEngagementBar({
    articleId,
    articleTitle,
    initialLiked = false,
    initialLikeCount = 0,
    initialBookmarked = false,
}: Omit<EngagementBarProps, 'variant'>) {
    const [visible, setVisible] = useState(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setVisible(window.scrollY > 300);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            className={clsx(
                // Only show on mobile (md and below) — on desktop the inline bar is visible
                'md:hidden fixed bottom-0 left-0 right-0 z-40',
                'bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-t border-zinc-200 dark:border-zinc-800',
                'px-4 py-3 flex items-center gap-3',
                'transition-transform duration-300',
                visible ? 'translate-y-0' : 'translate-y-full'
            )}
            aria-hidden={!visible}
        >
            <LikeButton
                articleId={articleId}
                initialLiked={initialLiked}
                initialCount={initialLikeCount}
                size="sm"
                showCount
            />
            <BookmarkButton
                articleId={articleId}
                initialBookmarked={initialBookmarked}
                size="sm"
                showLabel
            />
            <div className="ml-auto">
                <ShareButtons title={articleTitle} />
            </div>
        </div>
    );
}