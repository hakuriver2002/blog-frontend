'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { verifyOAuthState } from '@/src/lib/googleOAuth';
import { Spinner } from '@/src/components/ui';
import { FormAlert } from '@/src/components/auth';
import Link from 'next/link';
import authApi from '@/src/lib/authApi';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    // const googleLogin = useAuthStore((s) => s.googleLogin);
    const { setTokens, user } = useAuthStore();

    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const token = params.get('token');
        if (token) {
            setTokens(token, "");

            const fetchUser = async () => {
                try {
                    const userData = await authApi.me(token);

                    // Manual state update to be safe
                    useAuthStore.setState({
                        user: userData,
                        accessToken: token,
                        isLoading: false
                    });

                    router.push(userData?.role === 'admin' ? '/dashboard' : '/');
                } catch (err) {
                    console.error("Fetch Me Error:", err);
                    router.push('/auth/login?error=profile_fetch_failed');
                }
            };

            fetchUser();
        }
    }, [params]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            {status === 'loading' ? (
                <>
                    <Spinner size="lg" />
                    <div>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Signing you in with Google…
                        </p>
                        <p className="text-sm text-zinc-400">Please wait, this only takes a moment.</p>
                    </div>
                </>
            ) : (
                <div className="max-w-sm w-full space-y-5">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <FormAlert success={false} message={errorMsg} />
                    <div className="flex flex-col gap-2">
                        <Link href="/auth/login">
                            <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors">
                                Back to login
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}