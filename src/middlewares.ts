import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Read token from the Zustand-persisted cookie/storage
    // Since Zustand uses localStorage (client), we use a cookie fallback.
    // Set this cookie on login: document.cookie = `auth-token=<token>; path=/`
    const token = request.cookies.get('auth-token')?.value;

    const isDashboard = pathname.startsWith('/dashboard');
    const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

    // Redirect unauthenticated users away from dashboard
    if (isDashboard && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect already-logged-in users away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password', '/reset-password'],
};