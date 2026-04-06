'use client';

import { clsx } from 'clsx';
import { redirectToGoogle } from '@/src/lib/googleOAuth';

interface GoogleButtonProps {
    label?: string;
    isLoading?: boolean;
}

const handleGoogleLogin = () => {
    sessionStorage.setItem('auth_redirect', window.location.pathname);
    redirectToGoogle();
};

export function GoogleButton({ label = 'Continue with Google', isLoading }: GoogleButtonProps) {
    return (
        <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className={clsx(
                'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl',
                'border border-zinc-200 dark:border-zinc-700',
                'bg-white dark:bg-zinc-900',
                'text-sm font-medium text-zinc-700 dark:text-zinc-200',
                'hover:bg-zinc-50 dark:hover:bg-zinc-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-sm hover:shadow-md'
            )}
            aria-label="Sign in with Google"
        >
            {/* Google Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            {isLoading ? 'Connecting…' : label}
        </button>
    );
}


export function OAuthDivider() {
    return (
        <div className="relative flex items-center gap-3 my-6" role="separator">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                or
            </span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>
    );
}


function getStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = [
        { label: 'Too weak', color: 'bg-red-500' },
        { label: 'Weak', color: 'bg-orange-400' },
        { label: 'Fair', color: 'bg-yellow-400' },
        { label: 'Good', color: 'bg-lime-500' },
        { label: 'Strong', color: 'bg-emerald-500' },
    ] as const;

    return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score] };
}

export function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const { score, label, color } = getStrength(password);

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={clsx(
                            'h-1 flex-1 rounded-full transition-all duration-300',
                            i < score ? color : 'bg-zinc-200 dark:bg-zinc-700'
                        )}
                    />
                ))}
            </div>
            <p className={clsx(
                'text-xs font-medium',
                score <= 1 ? 'text-red-500' :
                    score === 2 ? 'text-yellow-600' :
                        score === 3 ? 'text-lime-600' : 'text-emerald-600'
            )}>
                {label}
            </p>
        </div>
    );
}

interface FormAlertProps {
    success: boolean;
    message: string;
}

export function FormAlert({ success, message }: FormAlertProps) {
    return (
        <div
            role="alert"
            className={clsx(
                'flex items-start gap-3 px-4 py-3 rounded-xl text-sm',
                success === false
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            )}
        >
            <span className="shrink-0 mt-0.5">
                {success ? '✅' : '⚠️'}
            </span>
            <span>{message}</span>
        </div>
    );
}

import { useState, forwardRef } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const [show, setShow] = useState(false);
        const inputId = id ?? 'password';

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={show ? 'text' : 'password'}
                        className={clsx(
                            'w-full rounded-xl border px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900',
                            'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400',
                            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                            'transition-colors duration-150',
                            error
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-zinc-200 dark:border-zinc-700',
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        aria-label={show ? 'Hide password' : 'Show password'}
                    >
                        {show ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">{error}</p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';