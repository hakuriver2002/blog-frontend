'use client';

import { type ButtonHTMLAttributes, type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
    secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 focus-visible:ring-zinc-400',
    ghost: 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:ring-zinc-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            {children}
        </button>
    )
);
Button.displayName = 'Button';


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900',
                        'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                        'transition-colors duration-150',
                        error
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-zinc-200 dark:border-zinc-700',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    {...props}
                />
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-xs text-zinc-500">{hint}</p>
                )}
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 resize-y',
                        'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                        'transition-colors duration-150',
                        error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';


type BadgeColor = 'indigo' | 'green' | 'yellow' | 'red' | 'zinc';

const badgeColors: Record<BadgeColor, string> = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export function Badge({ children, color = 'zinc' }: { children: React.ReactNode; color?: BadgeColor }) {
    return (
        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', badgeColors[color])}>
            {children}
        </span>
    );
}


export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const s = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
    return (
        <svg className={clsx('animate-spin text-indigo-600', s)} viewBox="0 0 24 24" fill="none" aria-label="Loading">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900',
                        'text-zinc-900 dark:text-zinc-100',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                        'transition-colors duration-150',
                        error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';