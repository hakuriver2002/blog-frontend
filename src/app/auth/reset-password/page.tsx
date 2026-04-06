'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/authStore';
import { PasswordInput, PasswordStrength, FormAlert } from '@/src/components/auth';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get('token') ?? '';

    const resetPassword = useAuthStore((s) => s.resetPassword);
    const isLoading = useAuthStore((s) => s.isLoading);
    const serverError = useAuthStore((s) => s.error);
    const fieldErrors = useAuthStore((s) => s.fieldErrors);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    const errors = { ...clientErrors, ...fieldErrors };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Invalid link</h2>
                <p className="text-zinc-500 text-sm">This reset link is missing or invalid.</p>
                <Link
                    href="/auth/forgot-password"
                    className="inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
                >
                    Request a new link
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'At least 8 characters';
        if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

        if (Object.keys(errs).length > 0) { setClientErrors(errs); return; }
        setClientErrors({});

        const ok = await resetPassword({ token, password, confirmPassword });
        if (ok) {
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 3000);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                    Set new password
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Choose a strong password you haven&apos;t used before.
                </p>
            </div>

            {/* Success */}
            {success ? (
                <div className="space-y-5">
                    <FormAlert success={true} message="Password updated! Redirecting you to login…" />
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-indigo-600 animate-[progress_3s_linear_forwards]" style={{ width: '100%' }} />
                    </div>
                    <Link href="/auth/login" className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        Go to login now
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {serverError && <FormAlert success={false} message={serverError} />}

                    {/* New password */}
                    <div>
                        <PasswordInput
                            id="new-password"
                            label="New password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setClientErrors((p) => ({ ...p, password: undefined as unknown as string })); }}
                            placeholder="Min 8 characters"
                            autoComplete="new-password"
                            required
                            error={errors.password}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    {/* Confirm */}
                    <PasswordInput
                        id="confirm-new-password"
                        label="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setClientErrors((p) => ({ ...p, confirmPassword: undefined as unknown as string })); }}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        required
                        error={errors.confirmPassword}
                    />

                    {/* Password requirements hint */}
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Password must include:</p>
                        {[
                            { rule: /^.{8,}$/, text: 'At least 8 characters' },
                            { rule: /[A-Z]/, text: 'One uppercase letter' },
                            { rule: /[0-9]/, text: 'One number' },
                            { rule: /[^A-Za-z0-9]/, text: 'One special character' },
                        ].map(({ rule, text }) => (
                            <div key={text} className="flex items-center gap-2 text-xs">
                                <span className={rule.test(password) ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}>
                                    {rule.test(password) ? '✓' : '○'}
                                </span>
                                <span className={rule.test(password) ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400'}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-sm hover:shadow-indigo-500/25 hover:shadow-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Updating password…
                            </span>
                        ) : 'Update password'}
                    </button>
                </form>
            )}
        </div>
    );
}