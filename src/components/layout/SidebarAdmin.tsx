'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
// import { useNotificationStore } from '@/src/store/notificationStore';

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
    badge?: number;
    roles?: ('admin' | 'editor' | 'trainer')[];
}

const Icon = {
    dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
        </svg>
    ),
    analytics: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    articles: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    review: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    users: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    media: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    editor: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M12 4v16m8-8H4" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    myArticles: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    chevron: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    ),
    logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
};

function SubItem({ label, href }: { label: string; href: string }) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <li>
            <Link href={href}
                className={clsx(
                    'flex items-center gap-2 py-1.5 pl-3 pr-2 rounded-lg text-sm transition-colors',
                    active
                        ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                )}>
                <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', active ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-600')} />
                {label}
            </Link>
        </li>
    );
}

function NavItem({ item, defaultOpen = false }: { item: NavItem; defaultOpen?: boolean }) {
    const pathname = usePathname();
    const isActive = item.href
        ? pathname === item.href
        : item.children?.some((c) => pathname === c.href) ?? false;

    const [open, setOpen] = useState(defaultOpen || isActive);

    if (item.children) {
        return (
            <li>
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className={clsx(
                        'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                            ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}>
                            {item.icon}
                        </span>
                        {item.label}
                    </div>
                    <span className={clsx('transition-transform duration-200 text-zinc-400', open && 'rotate-180')}>
                        {Icon.chevron}
                    </span>
                </button>
                {open && (
                    <ul className="mt-1 ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-700 space-y-0.5 py-1">
                        {item.children.map((child) => (
                            <SubItem key={child.href} {...child} />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    return (
        <li>
            <Link
                href={item.href!}
                className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    isActive
                        ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                )}
            >
                <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}>
                    {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                    </span>
                )}
            </Link>
        </li>
    );
}

export function AdminSidebar() {
    const { user, isAdmin, isEditor, isTrainer, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const pendingReview = 0;

    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Prevent body scroll when mobile open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
        admin: { label: '👑 Admin', cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
        editor: { label: '✏️ Editor', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
        trainer: { label: '🎓 Trainer', cls: 'bg-sky-100    text-sky-700    dark:bg-sky-900/40    dark:text-sky-300' },
    };

    const canPublish = isAdmin || isEditor;

    const mainNav: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/admin',
            icon: Icon.dashboard,
        },
        {
            label: 'Analytics',
            href: '/admin/analytics',
            icon: Icon.analytics,
            roles: ['admin', 'editor'],
        },
        ...(canPublish ? [{
            label: 'Content',
            icon: Icon.articles,
            children: [
                { label: 'All articles', href: '/admin' },
                { label: 'New article', href: '/admin/editor' },
                { label: 'Review queue', href: '/admin/review' },
            ],
        }] : []),
        ...(isTrainer && !canPublish ? [{
            label: 'My articles',
            href: '/profile/articles',
            icon: Icon.myArticles,
        }] : []),
        {
            label: 'Media library',
            href: '/admin/media',
            icon: Icon.media,
        },
        ...(isAdmin ? [{
            label: 'Users',
            href: '/admin/users',
            icon: Icon.users,
        }] : []),
    ].filter(Boolean) as NavItem[];

    const bottomNav: NavItem[] = [
        {
            label: 'Profile',
            href: '/profile',
            icon: Icon.settings,
        },
        {
            label: 'Back to site',
            href: '/',
            icon: Icon.home,
        },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    };

    // ── Sidebar inner content ───────────────────────────────────
    const SidebarContent = () => (
        <div className="flex flex-col h-full">

            {/* ── Logo / Brand ──────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">Karatedo CMS</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Admin panel</p>
                </div>
            </div>

            {/* ── User card ─────────────────────────────────────── */}
            {user && (
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatarUrl} alt={user.fullName}
                                className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0 select-none">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.fullName}</p>
                            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    {user.role && ROLE_BADGE[user.role] && (
                        <span className={clsx('mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', ROLE_BADGE[user.role].cls)}>
                            {ROLE_BADGE[user.role].label}
                        </span>
                    )}
                </div>
            )}

            {/* ── Main nav ──────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <ul className="space-y-0.5">
                    {mainNav.map((item) => (
                        <NavItem key={item.label} item={item} />
                    ))}
                </ul>
            </nav>

            {/* ── Bottom nav ────────────────────────────────────── */}
            <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-0.5">
                <ul className="space-y-0.5">
                    {bottomNav.map((item) => (
                        <NavItem key={item.label} item={item} />
                    ))}
                </ul>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <span className="text-zinc-400 dark:text-zinc-500">{Icon.logout}</span>
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Mobile hamburger (shown on small screens) ───────── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Open admin menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <p className="ml-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Karatedo Admin</p>
            </div>

            {/* ── Mobile overlay ──────────────────────────────────── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden
                />
            )}

            {/* ── Mobile drawer ───────────────────────────────────── */}
            <div className={clsx(
                'lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-xl transition-transform duration-300',
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Close menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <SidebarContent />
            </div>

            {/* ── Desktop fixed sidebar ───────────────────────────── */}
            <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-20">
                <SidebarContent />
            </aside>
        </>
    );
}