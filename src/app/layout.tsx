import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthHydrator } from "../hooks/useAuth";
import { PublicShell } from '@/src/components/articles/PublicShell';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: 'Blog', template: '%s | Blog' },
  description: 'A modern blog built with Next.js, TailwindCSS, and TinyMCE',
  openGraph: { type: 'website', locale: 'en_US' },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
        <PublicShell>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
