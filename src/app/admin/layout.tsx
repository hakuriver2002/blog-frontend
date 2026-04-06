'use client';

import { AdminSidebar } from '@/src/components/layout/SidebarAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <AdminSidebar />
            {/* Content — offset by sidebar width on desktop, top bar on mobile */}
            <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}