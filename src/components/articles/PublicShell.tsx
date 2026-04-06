'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/src/components/layout/Navbar';
import { AuthHydrator } from '@/src/hooks/useAuth';
import Footer from '../layout/Footer';

export function PublicShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const year = new Date().getFullYear();

    return (
        <>
            <AuthHydrator />
            {!isAdmin && <Navbar />}
            <main id="main-content" className={!isAdmin ? 'pt-24 sm:pt-28 outline-none' : 'outline-none'}>
                {children}
            </main>

            {/* Footer — hidden in admin */}
            {!isAdmin && (
                <Footer />
            )}
        </>
    );
}
