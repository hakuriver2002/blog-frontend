'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { useAuthStore } from '@/src/store/authStore';
import { Input } from '@/src/components/ui';
import {
    PasswordInput,
    FormAlert,
    GoogleButton,
    OAuthDivider,
} from '@/src/components/auth';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const isLoading = useAuthStore((s) => s.isLoading);
    const error = useAuthStore((s) => s.error);
    const fieldErr = useAuthStore((s) => s.fieldErrors);
    const clearErr = useAuthStore((s) => s.clearError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErr();
        const res = await login({ email, password });
        if (res?.success) {
            setServerSuccess(res.message);
            setTimeout(() => {
                router.push(res.redirectTo);
            }, 1000);
        } else {
            setServerSuccess(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
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

            <div className="w-full max-w-sm backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 shadow"
                        style={{ background: "linear-gradient(135deg, #1A56E8 0%, #7C3AED 100%)" }}>
                        <span style={{ color: "#ffffff" }}>A</span>
                    </div>
                </div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                        Welcome back
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                            Sign up free
                        </Link>
                    </p>
                </div>

                {/* Error alert */}
                {error ? (
                    <div className="mb-5">
                        <FormAlert success={false} message={error} />
                    </div>
                ) : serverSuccess ? (
                    <div className="mb-5">
                        <FormAlert success={true} message={serverSuccess} />
                    </div>
                ) : null}
                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Email */}
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        error={fieldErr.email}
                        className="rounded-xl py-2.5"
                    />

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                        </div>
                        <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            error={fieldErr.password}
                        />
                        <div className='text-right mb-4'>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                    </div>

                    {/* Remember me */}

                    {/* Submit */}
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
                                Signing in…
                            </span>
                        ) : 'Sign in'}
                    </button>
                </form>

                {/* <OAuthDivider /> */}

                {/* Google button */}
                {/* <GoogleButton label="Continue with Google" isLoading={isLoading} /> */}


                {/* Terms */}
                <p className="mt-6 text-xs text-center text-zinc-400 dark:text-zinc-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-zinc-600">Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:text-zinc-600">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}