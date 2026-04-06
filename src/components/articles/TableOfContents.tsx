'use client';

import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';

export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface Props {
    /** CSS selector of the article content container */
    contentSelector?: string;
}

export function TableOfContents({ contentSelector = '#article-content' }: Props) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ── Parse headings & inject IDs ──────────────────────────────
    useEffect(() => {
        const container = document.querySelector(contentSelector);
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll<HTMLHeadingElement>('h2, h3')
        );

        const parsed: TocItem[] = headings.map((el, i) => {
            // Slug the text, fall back to index
            const slug = (el.textContent ?? '')
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-') || `heading-${i}`;

            const id = `toc-${slug}`;
            el.id = id; // inject id into DOM
            return {
                id,
                text: el.textContent ?? '',
                level: el.tagName === 'H2' ? 2 : 3,
            };
        });

        setItems(parsed);

        // ── Intersection observer ─────────────────────────────────
        observerRef.current?.disconnect();

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the topmost visible heading
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveId(visible[0].target.id);
            },
            { rootMargin: '0px 0px -60% 0px', threshold: 0 }
        );

        headings.forEach((el) => observer.observe(el));
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [contentSelector]);

    if (items.length < 2) return null; // not worth showing for very short articles

    return (
        <nav
            aria-label="Table of contents"
            className="hidden xl:block w-56 shrink-0"
        >
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-1">
                    On this page
                </p>

                <ul className="space-y-0.5">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    setActiveId(item.id);
                                }}
                                className={clsx(
                                    'block py-1.5 text-sm transition-colors leading-snug',
                                    item.level === 3 && 'pl-4',
                                    item.level === 2 && 'pl-1',
                                    activeId === item.id
                                        ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                                )}
                            >
                                {/* Active indicator dot */}
                                {activeId === item.id && (
                                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 mr-1.5 mb-0.5 align-middle" />
                                )}
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Back to top */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-5 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-1"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Back to top
                </button>
            </div>
        </nav>
    );
}