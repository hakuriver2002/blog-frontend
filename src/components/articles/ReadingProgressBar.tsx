'use client';

import { useEffect, useRef, useState } from 'react';

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, pct)));
        };

        const onScroll = () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update(); // set initial value

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        >
            <div
                className="h-full bg-indigo-500 transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}