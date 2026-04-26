'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/authStore';
import { Input } from '@/src/components/ui';
import { FormAlert } from '@/src/components/auth';

export default function ForgotPasswordPage() {
    const forgotPassword = useAuthStore((s) => s.forgotPassword);
    const isLoading = useAuthStore((s) => s.isLoading);
    const error = useAuthStore((s) => s.error);

    const [email, setEmail] = useState('');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [clientError, setClientError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError('');

        if (!email.trim()) { setClientError('Email is required'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setClientError('Enter a valid email'); return; }

        const msg = await forgotPassword({ email });
        if (msg) setSuccessMsg(msg);
    };

    return (
        <div className='min-h-screen flex items-center justify-center transition-colors duration-300' style={{ background: "var(--background)" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="blob-1 absolute top-20 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
                    style={{ background: "radial-gradient(circle, #1A56E8, #7C3AED)" }}
                />
                <div
                    className="blob-2 absolute top-40 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                    style={{ background: "radial-gradient(circle, #E8320A, #F59E0B)" }}
                />
                <div
                    className="blob-3 absolute bottom-20 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl opacity-15"
                    style={{ background: "radial-gradient(circle, #00C46A, #1A56E8)" }}
                />
                {/* Decorative orbs */}
                <div
                    className="spin-slow absolute top-48 right-24 w-64 h-64 rounded-full border-2 border-dashed opacity-10"
                    style={{ borderColor: "#1A56E8" }}
                />
                <div
                    className="blob-4 absolute bottom-32 right-1/4 w-20 h-20 rounded-[24px] opacity-30"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #E8320A)" }}
                />
                <div
                    className="blob-2 absolute top-64 left-1/4 w-12 h-12 rounded-[18px] opacity-40"
                    style={{ background: "linear-gradient(135deg, #1A56E8, #7C3AED)" }}
                />
            </div>
            <div className="w-full max-w-sm backdrop-blur-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl rounded-2xl p-6 transition-colors duration-300">
                {/* Back */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to login
                </Link>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                        Forgot password
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Enter your email and we&apos;ll send a reset link — expires in 1 hour.
                    </p>
                </div>

                {/* Success state */}
                {successMsg ? (
                    <div className="space-y-6">
                        <FormAlert success={true} message={successMsg} />

                        <div className="p-5 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] space-y-3 transition-colors duration-300">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">What happens next?</p>
                            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {[
                                    'Check your inbox (and spam folder)',
                                    'Click the reset link in the email',
                                    'Choose a new strong password',
                                ].map((step, i) => (
                                    <li key={step} className="flex items-start gap-2.5">
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => { setSuccessMsg(null); setEmail(''); }}
                            className="w-full py-3 rounded-xl border border-[var(--glass-border)] text-sm font-medium text-zinc-500 hover:bg-[var(--foreground)]/5 transition-colors"
                        >
                            Resend email
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {(error || clientError) && (
                            <FormAlert success={false} message={error ?? clientError} />
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setClientError(''); }}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            error={clientError}
                            className="rounded-xl py-2.5"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-xl hover:opacity-85 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-sm hover:shadow-indigo-500/25 hover:shadow-lg mt-2"
                            style={{ background: "linear-gradient(90deg, var(--color-mokoto-main), var(--foreground))" }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Sending link…
                                </span>
                            ) : 'Send reset link'}
                        </button>

                        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                            Remembered it?{' '}
                            <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}