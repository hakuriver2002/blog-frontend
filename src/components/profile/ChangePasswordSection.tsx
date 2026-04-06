'use client';

import { useState, useEffect } from 'react';
import { useProfileStore } from '@/src/store/profileStore';
import { PasswordInput, PasswordStrength, FormAlert } from '@/src/components/auth';

interface FormState {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface FieldErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

const EMPTY: FormState = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

export function ChangePasswordSection() {
    const changePassword = useProfileStore((s) => s.changePassword);
    const isSaving = useProfileStore((s) => s.isSaving);
    const successMsg = useProfileStore((s) => s.successMessage);
    const serverError = useProfileStore((s) => s.error);
    const serverFields = useProfileStore((s) => s.fieldErrors);
    const clearMessages = useProfileStore((s) => s.clearMessages);

    const [form, setForm] = useState<FormState>(EMPTY);
    const [clientErrors, setErrors] = useState<FieldErrors>({});

    // Clear on section unmount
    useEffect(() => () => clearMessages(), []); // eslint-disable-line react-hooks/exhaustive-deps

    // Clear form fields on success
    useEffect(() => {
        if (successMsg) setForm(EMPTY);
    }, [successMsg]);

    const fieldErrors = { ...clientErrors, ...serverFields };

    const set = <K extends keyof FormState>(key: K, val: string) => {
        setForm((f) => ({ ...f, [key]: val }));
        setErrors((e) => ({ ...e, [key]: undefined }));
        clearMessages();
    };

    function validate(): boolean {
        const errs: FieldErrors = {};
        if (!form.currentPassword) errs.currentPassword = 'Current password is required.';
        if (!form.newPassword) errs.newPassword = 'New password is required.';
        else if (form.newPassword.length < 8) errs.newPassword = 'At least 8 characters.';
        if (form.newPassword === form.currentPassword)
            errs.newPassword = 'New password must differ from current.';
        if (form.newPassword !== form.confirmNewPassword)
            errs.confirmNewPassword = 'Passwords do not match.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await changePassword(form);
    };

    const hasInput = Object.values(form).some(Boolean);

    return (
        <section aria-labelledby="change-password-heading">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 id="change-password-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Change password
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Choose a strong password you haven't used before.
                    </p>
                </div>

                <div className="px-6 py-6 space-y-5">
                    {/* Alerts */}
                    {successMsg && <FormAlert success={true} message={successMsg} />}
                    {serverError && !Object.keys(serverFields).length && (
                        <FormAlert success={false} message={serverError} />
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Current password */}
                        <PasswordInput
                            id="current-password"
                            label="Current password"
                            value={form.currentPassword}
                            onChange={(e) => set('currentPassword', e.target.value)}
                            placeholder="Your current password"
                            autoComplete="current-password"
                            error={fieldErrors.currentPassword}
                        />

                        {/* New password + strength */}
                        <div>
                            <PasswordInput
                                id="new-password"
                                label="New password"
                                value={form.newPassword}
                                onChange={(e) => set('newPassword', e.target.value)}
                                placeholder="Min 8 characters"
                                autoComplete="new-password"
                                error={fieldErrors.newPassword}
                            />
                            <PasswordStrength password={form.newPassword} />
                        </div>

                        {/* Confirm */}
                        <PasswordInput
                            id="confirm-new-password"
                            label="Confirm new password"
                            value={form.confirmNewPassword}
                            onChange={(e) => set('confirmNewPassword', e.target.value)}
                            placeholder="Repeat new password"
                            autoComplete="new-password"
                            error={fieldErrors.confirmNewPassword}
                        />

                        {/* Password requirements hint */}
                        <ul className="grid grid-cols-2 gap-1.5">
                            {[
                                { rule: /.{8,}/, label: '8+ characters' },
                                { rule: /[A-Z]/, label: 'Uppercase letter' },
                                { rule: /[0-9]/, label: 'One number' },
                                { rule: /[^A-Za-z0-9]/, label: 'Special character' },
                            ].map(({ rule, label }) => {
                                const met = rule.test(form.newPassword);
                                return (
                                    <li key={label} className="flex items-center gap-1.5 text-xs">
                                        <span className={met ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}>
                                            {met ? '✓' : '○'}
                                        </span>
                                        <span className={met ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'}>
                                            {label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                disabled={!hasInput || isSaving}
                                onClick={() => { setForm(EMPTY); setErrors({}); clearMessages(); }}
                                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm hover:shadow-indigo-500/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Updating…
                                    </span>
                                ) : 'Update password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}