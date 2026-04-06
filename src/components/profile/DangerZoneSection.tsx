'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/src/store/profileStore';
import { PasswordInput, FormAlert } from '@/src/components/auth';
import { clsx } from 'clsx';

const CONFIRM_WORD = 'DELETE';

export function DangerZoneSection() {
    const router = useRouter();
    const deleteAccount = useProfileStore((s) => s.deleteAccount);
    const isSaving = useProfileStore((s) => s.isSaving);
    const serverError = useProfileStore((s) => s.error);

    const [expanded, setExpanded] = useState(false);
    const [confirmation, setConfirmation] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const canSubmit =
        confirmation === CONFIRM_WORD &&
        password.length >= 1;

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (confirmation !== CONFIRM_WORD) {
            setLocalError(`Type "${CONFIRM_WORD}" exactly to confirm.`);
            return;
        }
        if (!password) {
            setLocalError('Password is required.');
            return;
        }

        const ok = await deleteAccount({ password, confirmation });
        if (ok) {
            // profileStore already called logout() → redirect to home
            router.replace('/');
        }
    };

    return (
        <section aria-labelledby="danger-zone-heading">
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-900 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-red-100 dark:border-red-900/30">
                    <h2 id="danger-zone-heading" className="text-base font-semibold text-red-700 dark:text-red-400">
                        Danger zone
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Irreversible and destructive actions.
                    </p>
                </div>

                <div className="px-6 py-6 space-y-4">
                    {/* Trigger row */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Delete my account</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                Permanently deletes your account, posts, and all associated data. This cannot be undone.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setExpanded((e) => !e)}
                            className={clsx(
                                'shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all',
                                expanded
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-red-500/25 hover:shadow-md'
                            )}
                        >
                            {expanded ? 'Cancel' : 'Delete account'}
                        </button>
                    </div>

                    {/* Expanded confirmation panel */}
                    {expanded && (
                        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-5 space-y-4">
                            {/* Warning banner */}
                            <div className="flex items-start gap-3">
                                <span className="text-xl shrink-0 mt-0.5" aria-hidden>⚠️</span>
                                <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
                                    <p className="font-semibold">This action is permanent and cannot be reversed.</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-xs text-red-600 dark:text-red-500">
                                        <li>Your profile and account details will be deleted</li>
                                        <li>All your posts and drafts will be removed</li>
                                        <li>You will be signed out immediately</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Errors */}
                            {(localError || serverError) && (
                                <FormAlert success={false} message={localError || serverError!} />
                            )}

                            <form onSubmit={handleDelete} noValidate className="space-y-4">
                                {/* Confirmation text input */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                        Type{' '}
                                        <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 font-mono text-xs select-all">
                                            {CONFIRM_WORD}
                                        </code>{' '}
                                        to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmation}
                                        onChange={(e) => { setConfirmation(e.target.value); setLocalError(''); }}
                                        placeholder={CONFIRM_WORD}
                                        autoComplete="off"
                                        spellCheck={false}
                                        className={clsx(
                                            'w-full rounded-lg border px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900',
                                            'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600',
                                            'focus:outline-none focus:ring-2 transition-colors',
                                            confirmation === CONFIRM_WORD
                                                ? 'border-emerald-400 focus:ring-emerald-400'
                                                : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-400'
                                        )}
                                    />
                                    {confirmation && confirmation !== CONFIRM_WORD && (
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Must match exactly: {CONFIRM_WORD}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <PasswordInput
                                    id="delete-password"
                                    label="Your current password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                                    placeholder="Enter your password to confirm"
                                    autoComplete="current-password"
                                />

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={!canSubmit || isSaving}
                                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm hover:shadow-red-500/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                >
                                    {isSaving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Deleting account…
                                        </span>
                                    ) : 'Permanently delete my account'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}