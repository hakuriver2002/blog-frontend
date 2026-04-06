'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { useProfileStore } from '@/src/store/profileStore';
import { Input, Textarea } from '@/src/components/ui';
import { FormAlert } from '@/src/components/auth';
import { AvatarUploader } from '@/src/components/profile/AvatarUploader';

interface FormState {
    fullName: string;
    email: string;
    bio: string;
}

interface FieldErrors {
    fullName?: string;
    email?: string;
    bio?: string;
}

export function ProfileInfoSection() {
    const user = useAuthStore((s) => s.user);
    const updateProfile = useProfileStore((s) => s.updateProfile);
    const isSaving = useProfileStore((s) => s.isSaving);
    const successMsg = useProfileStore((s) => s.successMessage);
    const serverError = useProfileStore((s) => s.error);
    const serverFields = useProfileStore((s) => s.fieldErrors);
    const clearMessages = useProfileStore((s) => s.clearMessages);

    const [form, setForm] = useState<FormState>({
        fullName: user?.fullName ?? '',
        email: user?.email ?? '',
        bio: '',
    });
    const [clientErrors, setClientErrors] = useState<FieldErrors>({});

    // Populate from user when it loads
    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                fullName: user.fullName,
                email: user.email,
            }));
        }
    }, [user]);

    // Clear messages on unmount
    useEffect(() => () => clearMessages(), []); // eslint-disable-line react-hooks/exhaustive-deps

    const fieldErrors = { ...clientErrors, ...serverFields };

    // ── Local validation ───────────────────────────────────────
    function validate(): boolean {
        const errs: FieldErrors = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
        if (!form.email.trim()) errs.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
        if (form.bio.length > 300) errs.bio = 'Bio must be 300 characters or fewer.';
        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    }

    const set = <K extends keyof FormState>(key: K, val: string) => {
        setForm((f) => ({ ...f, [key]: val }));
        setClientErrors((e) => ({ ...e, [key]: undefined }));
        clearMessages();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await updateProfile({
            fullName: form.fullName.trim(),
        });
    };

    const isDirty =
        form.fullName !== (user?.fullName ?? '') ||
        form.email !== (user?.email ?? '');

    return (
        <section aria-labelledby="profile-info-heading">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 id="profile-info-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Profile information
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Update your name, email address and bio.
                    </p>
                </div>

                <div className="px-6 py-6 space-y-6">
                    {/* Avatar */}
                    <AvatarUploader />

                    <div className="border-t border-zinc-100 dark:border-zinc-800" />

                    {/* Alerts */}
                    {successMsg && <FormAlert success={true} message={successMsg} />}
                    {serverError && !Object.keys(serverFields).length && (
                        <FormAlert success={false} message={serverError} />
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Read-only role + status pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                                user?.role === 'editor' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' :
                                    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                                }`}>
                                {user?.role === 'admin' ? '👑' : user?.role === 'editor' ? '✏️' : '🎓'}
                                {user?.role ?? '—'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user?.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                user?.status === 'pending' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                }`}>
                                {user?.status ?? '—'}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
                                Role and status are managed by admins.
                            </span>
                        </div>

                        {/* Name */}
                        <Input
                            label="Full name"
                            type="text"
                            value={form.fullName}
                            onChange={(e) => set('fullName', e.target.value)}
                            placeholder="Jane Doe"
                            autoComplete="name"
                            error={fieldErrors.fullName}
                        />

                        {/* Email */}
                        <Input
                            label="Email address"
                            type="email"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            error={fieldErrors.email}
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                disabled={!isDirty || isSaving}
                                onClick={() => setForm({ fullName: user?.fullName ?? '', email: user?.email ?? '', bio: '' })}
                                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Discard changes
                            </button>

                            <button
                                type="submit"
                                disabled={isSaving || (!isDirty)}
                                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm hover:shadow-indigo-500/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Saving…
                                    </span>
                                ) : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}