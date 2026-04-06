'use client';

import type { Author } from '@/src/types/article';

const ROLE_STYLES = {
    admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    editor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    trainer: 'bg-sky-100    text-sky-700    dark:bg-sky-900/40    dark:text-sky-300',
} as const;

const ROLE_ICONS = {
    admin: '👑',
    editor: '✏️',
    trainer: '🎓',
} as const;

interface AuthorCardProps {
    author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
    return (
        <div className="mt-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                {author.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={author.avatarUrl}
                        alt={author.fullName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0 select-none">
                        {author.fullName.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* Info */}
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{author.fullName}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[author.role]}`}>
                            {ROLE_ICONS[author.role]} {author.role}
                        </span>
                    </div>

                    {author.bio ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {author.bio}
                        </p>
                    ) : (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                            No bio available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}