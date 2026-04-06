'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/authStore';
import { Input } from '@/src/components/ui';
import {
    PasswordInput,
    PasswordStrength,
    FormAlert,
    OAuthDivider,
    GoogleButton,
} from '@/src/components/auth';
import Navbar from '@/src/components/layout/Navbar';

interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function validateForm(
    fullName: string, email: string, password: string, confirmPassword: string
): FormErrors {
    const errors: FormErrors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'At least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
}

export default function RegisterPage() {
    const router = useRouter();
    const register = useAuthStore((s) => s.register);
    const isLoading = useAuthStore((s) => s.isLoading);
    const serverErr = useAuthStore((s) => s.error);
    const fieldServerErr = useAuthStore((s) => s.fieldErrors);
    const clearErr = useAuthStore((s) => s.clearError);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clientErrors, setClientErrors] = useState<FormErrors>({});
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    // Merge server field errors + client errors
    const fieldErrors = { ...clientErrors, ...fieldServerErr };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErr();

        setServerSuccess(null);

        // Client-side validation first
        const errs = validateForm(fullName, email, password, confirmPassword);
        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            return;
        }
        setClientErrors({});

        const res = await register({ fullName, email, password, confirmPassword });
        if (res?.success) {
            setServerSuccess(res.message);
            setTimeout(() => {
                router.push('/');
            }, 1500);
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
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Server error */}
                {serverErr ? (
                    <div className="mb-5">
                        <FormAlert success={false} message={serverErr} />
                    </div>
                ) : serverSuccess ? (
                    <div className="mb-5">
                        <FormAlert success={true} message={serverSuccess} />
                    </div>
                ) : null}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Full name */}
                    <Input
                        label="Full name"
                        type="text"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); setClientErrors((p) => ({ ...p, fullName: undefined })); }}
                        placeholder="Nguyen Van A"
                        autoComplete="name"
                        required
                        error={fieldErrors.fullName}
                        className="rounded-xl py-2.5"
                    />

                    {/* Email */}
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setClientErrors((p) => ({ ...p, email: undefined })); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        error={fieldErrors.email}
                        className="rounded-xl py-2.5"
                    />

                    {/* Password */}
                    <div>
                        <PasswordInput
                            id="password"
                            label="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setClientErrors((p) => ({ ...p, password: undefined })); }}
                            placeholder="Min 8 characters"
                            autoComplete="new-password"
                            required
                            error={fieldErrors.password}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    {/* Confirm password */}
                    <PasswordInput
                        id="confirm-password"
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setClientErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                        error={fieldErrors.confirmPassword}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-sm hover:shadow-indigo-500/25 hover:shadow-lg mt-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Creating account…
                            </span>
                        ) : 'Create account'}
                    </button>
                </form>

                <OAuthDivider />

                {/* Google button */}
                <GoogleButton label="Continue with Google" isLoading={isLoading} />

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