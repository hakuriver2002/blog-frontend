'use client';

import { useAuthStore } from '@/src/store/authStore';

function formatDate(iso?: string | null) {
    if (!iso) return '—';

    const date = new Date(iso);

    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}
function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{value}</span>
        </div>
    );
}

export function AccountInfoCard() {
    const user = useAuthStore((s) => s.user);
    if (!user) return null;

    const roleBadge = (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
            user.role === 'editor' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' :
                'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
            }`}>
            {user.role === 'admin' ? '👑' : user.role === 'editor' ? '✏️' : '🎓'}
            {user.role}
        </span>
    );

    const statusBadge = (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
            user.status === 'pending' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
            {user.status}
        </span>
    );

    return (
        <section aria-labelledby="account-info-heading">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 id="account-info-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Account information
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Read-only details managed by your organisation.
                    </p>
                </div>

                <div className="px-6">
                    <InfoRow label="Member since" value={formatDate(user.createdAt)} />
                    <InfoRow label="Role" value={roleBadge} />
                    <InfoRow label="Status" value={statusBadge} />
                    <InfoRow
                        label="User ID"
                        value={
                            <code className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded select-all">
                                {user.id}
                            </code>
                        }
                    />
                </div>
            </div>
        </section>
    );
}