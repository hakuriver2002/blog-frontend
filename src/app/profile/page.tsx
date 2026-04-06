'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { Spinner } from '@/src/components/ui';
import { ProfileInfoSection } from '@/src/components/profile/ProfileInfoSection';
import { ChangePasswordSection } from '@/src/components/profile/ChangePasswordSection';
import { AccountInfoCard } from '@/src/components/profile/AccountInfoCard';
import { DangerZoneSection } from '@/src/components/profile/DangerZoneSection';
import { clsx } from 'clsx';

type Tab = {
    id: 'profile' | 'security' | 'account' | 'danger';
    label: string;
    icon: React.ReactNode;
    danger?: boolean;
};

const TABS: Tab[] = [
    {
        id: 'profile',
        label: 'Profile',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id: 'security',
        label: 'Security',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    {
        id: 'account',
        label: 'Account',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: 'danger',
        label: 'Danger zone',
        danger: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
];



type TabId = typeof TABS[number]['id'];

export default function ProfilePage() {
    const { isAuthenticated } = useRequireAuth();
    const user = useAuthStore((s) => s.user);
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    useEffect(() => {
        const hash = window.location.hash.replace('#', '') as TabId;
        if (TABS.some((t) => t.id === hash)) setActiveTab(hash);
    }, []);

    const handleTabChange = (id: TabId) => {
        setActiveTab(id);
        window.history.replaceState(null, '', `#${id}`);
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="flex justify-center py-32">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Settings
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage your profile, security and account preferences.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ── Sidebar nav ──────────────────────────────────── */}
                <nav
                    aria-label="Settings sections"
                    className="lg:w-52 shrink-0 flex lg:flex-col gap-1"
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleTabChange(tab.id)}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            className={clsx(
                                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left w-full',
                                activeTab === tab.id
                                    ? tab.danger
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                    : tab.danger
                                        ? 'text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* ── Content area ─────────────────────────────────── */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'profile' && <ProfileInfoSection />}
                    {activeTab === 'security' && <ChangePasswordSection />}
                    {activeTab === 'account' && <AccountInfoCard />}
                    {activeTab === 'danger' && <DangerZoneSection />}
                </div>
            </div>
        </div>
    );
}