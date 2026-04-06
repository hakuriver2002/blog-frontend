import Navbar from '@/src/components/layout/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Manage your profile, password and account settings.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}