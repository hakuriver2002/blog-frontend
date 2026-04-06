'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, selectUser, selectIsAuthenticated, selectIsAdmin, selectIsEditor, selectIsTrainer, selectIsActive } from '@/src/store/authStore';

export function useAuth() {
    const user = useAuthStore(selectUser);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAdmin = useAuthStore(selectIsAdmin);
    const isEditor = useAuthStore(selectIsEditor);
    const isTrainer = useAuthStore(selectIsTrainer);
    const isActive = useAuthStore(selectIsActive);
    const isLoading = useAuthStore((s) => s.isLoading);
    const logout = useAuthStore((s) => s.logout);

    // Can manage content = admin or editor
    const canPublish = isAdmin || isEditor;

    return { user, isAuthenticated, isAdmin, isEditor, isTrainer, isActive, canPublish, isLoading, logout };
}

export function useRequireAuth(redirectTo = '/auth/login') {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            // Save current path so we can redirect back after login
            sessionStorage.setItem('auth_redirect', pathname);
            router.replace(redirectTo);
        }
    }, [isAuthenticated, router, pathname, redirectTo]);

    return { isAuthenticated };
}

export function useRequireAdmin() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAdmin = useAuthStore(selectIsAdmin);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (!isAdmin) {
            router.replace('/');
        }
    }, [isAuthenticated, isAdmin, router]);

    return { isAdmin };
}

export function useRequireEditor() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAdmin = useAuthStore(selectIsAdmin);
    const isEditor = useAuthStore(selectIsEditor);
    const router = useRouter();
    const canAccess = isAdmin || isEditor;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (!canAccess) {
            router.replace('/');
        }
    }, [isAuthenticated, canAccess, router]);

    return { canAccess };
}

export function AuthHydrator() {
    const hydrateUser = useAuthStore((s) => s.hydrateUser);

    useEffect(() => {
        hydrateUser();
    }, []);

    return null;
}