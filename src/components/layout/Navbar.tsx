"use client";
import { useEffect, useRef, useState } from "react";
import SearchModal from "./SearchModal";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { NotificationBell } from '@/src/components/notifications/NotificationBell';

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/?category=events" },
    { label: "Techniques", href: "/?category=techniques" },
    { label: "Training", href: "/?category=training" },
    { label: "News", href: "/?category=news" },
    { label: "Competition", href: "/?category=competition" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // const setFilters = useBlogStore((s) => s.setFilters);
    const { user, isAuthenticated, isAdmin, isEditor, canPublish, logout } = useAuth();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);


    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setFilters({ search });
    // };

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <nav
                className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16 sm:h-20 rounded-[32px] sm:rounded-[40px] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ background: "#F0F4FA" }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-[16px] flex items-center justify-center text-xl sm:text-2xl shadow-md"
                        style={{ background: "linear-gradient(135deg, #1A56E8 0%, #7C3AED 100%)" }}
                    >
                        <span style={{ color: "#ffffff" }}>🥋</span>
                    </div>
                    <span
                        className="text-lg sm:text-xl font-black"
                        style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                    >
                        Karate<span style={{ color: "#e81a1a" }}>do</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                className="px-4 py-2 rounded-[16px] text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                                style={{ color: "#4A5568" }}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Bell */}
                    <NotificationBell />

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden w-10 h-10 rounded-[14px] flex flex-col items-center justify-center gap-1.5 shadow-md"
                        style={{ background: "rgba(255,255,255,0.70)" }}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {[0, 1, 2].map((bar) => (
                            <span
                                key={bar}
                                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                                style={{
                                    background: "#1A2035",
                                    transform:
                                        bar === 0 && menuOpen ? "rotate(45deg) translateY(7px)"
                                            : bar === 2 && menuOpen ? "rotate(-45deg) translateY(-7px)"
                                                : "none",
                                    opacity: bar === 1 && menuOpen ? 0 : 1,
                                }}
                            />
                        ))}
                    </button>

                    {/* Authenticated */}
                    {isAuthenticated && user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-expanded={menuOpen}
                                aria-haspopup="true"
                                className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {user.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-bold select-none"
                                        style={{ background: "linear-gradient(135deg, #1A56E8 0%, #7C3AED 100%)" }}
                                    >
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 py-1 z-50">

                                    {/* User info header */}
                                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.fullName}</p>
                                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium ${user.role === "admin" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" :
                                                user.role === "editor" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" :
                                                    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                                                }`}>
                                                {user.role === "admin" ? "👑" : user.role === "editor" ? "✏️" : "🎓"} {user.role}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium ${user.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                                                user.status === "pending" ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" :
                                                    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                }`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="py-1">
                                        <Link href="/profile" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profile &amp; settings
                                        </Link>

                                        <Link href="/profile/bookmarks" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                                            Saved articles
                                        </Link>

                                        <Link href="/admin/my-articles" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            My articles
                                        </Link>

                                        {canPublish && (
                                            <Link href="/admin/editor" onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                New article
                                            </Link>
                                        )}

                                        {(isAdmin || isEditor) && (
                                            <Link href="/admin" onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg>
                                                Admin dashboard
                                            </Link>
                                        )}
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1 pb-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    ) : (
                        /* Guest */
                        <div className="flex items-center gap-2">
                            <Link
                                href="/auth/register"
                                className="hidden sm:flex px-5 py-2.5 rounded-[20px] text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md"
                                style={{ background: "linear-gradient(135deg, #3B82F6 0%, #1A56E8 100%)" }}
                            >
                                Register
                            </Link>
                            <Link
                                href="/auth/login"
                                className="hidden sm:flex px-5 py-2.5 rounded-[20px] text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md"
                                style={{ background: "linear-gradient(135deg, #25de14 0%, #14cf2c 100%)" }}
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
