"use client";
import { useEffect } from "react";
import type { Article } from "@/src/data/seed";

interface Props {
    article: Article | null;
    onClose: () => void;
}

function formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(0) + "K";
    return n.toString();
}

export default function ArticleDetailModal({ article, onClose }: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (article) {
            window.addEventListener("keydown", handler);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [article, onClose]);

    if (!article) return null;

    return (
        <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 transition-colors duration-300"
            style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(10px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[36px] shadow-2xl transition-colors duration-300"
                style={{ background: "var(--background)" }}
            >
                {/* Top color bar */}
                <div
                    className="h-2 rounded-t-[36px]"
                    style={{ background: `linear-gradient(90deg, ${article.color}, ${article.color}66)` }}
                />

                <div className="p-7 sm:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                                style={{ background: article.color }}
                            >
                                {article.category}
                            </span>
                            {article.trending && (
                                <span
                                    className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-500"
                                >
                                    🔥 Trending
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 active:scale-95 bg-[var(--foreground)]/5 text-[var(--foreground)]"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Big emoji */}
                    <div className="text-7xl mb-6 text-center">{article.image}</div>

                    {/* Title */}
                    <h1
                        className="text-2xl sm:text-3xl font-black leading-tight mb-4 text-[var(--foreground)]"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                        {article.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 pb-5 mb-5 border-b border-[var(--foreground)]/10">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
                                style={{ background: article.color, fontFamily: "Nunito, sans-serif" }}
                            >
                                {article.authorAvatar}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-[var(--foreground)]">{article.author}</div>
                                <div className="text-xs text-zinc-500">{article.authorBio.slice(0, 40)}...</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 ml-auto">
                            <span className="text-xs font-medium text-zinc-500">📅 {article.publishedAt}</span>
                            <span className="text-xs font-medium text-zinc-500">⏱ {article.readTime}</span>
                            <span className="text-xs font-medium text-zinc-500">👁 {formatNumber(article.views)}</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <p
                        className="text-base font-medium leading-relaxed mb-6 p-4 rounded-[20px] text-[var(--foreground)]"
                        style={{
                            background: `${article.color}15`,
                            borderLeft: `3px solid ${article.color}`,
                        }}
                    >
                        {article.excerpt}
                    </p>

                    {/* Body paragraphs */}
                    <div className="space-y-4 mb-6">
                        {article.body.map((para, i) => (
                            <p
                                key={i}
                                className="text-sm sm:text-base font-medium leading-relaxed text-zinc-500"
                            >
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-3 py-1.5 rounded-full font-bold"
                                style={{ background: `${article.color}14`, color: article.color }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-5 border-t border-[var(--foreground)]/10">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div
                                    className="text-xl font-black"
                                    style={{ fontFamily: "Nunito, sans-serif", color: article.color }}
                                >
                                    {formatNumber(article.views)}
                                </div>
                                <div className="text-xs text-zinc-500">Lượt xem</div>
                            </div>
                            <div className="text-center">
                                <div
                                    className="text-xl font-black"
                                    style={{ fontFamily: "Nunito, sans-serif", color: "#E8320A" }}
                                >
                                    {formatNumber(article.likes)}
                                </div>
                                <div className="text-xs text-zinc-500">Yêu thích</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-[18px] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-lg bg-[var(--background)] border border-[var(--glass-border)] text-red-500"
                            >
                                ❤️ Thích
                            </button>
                            <button
                                className="flex items-center gap-2 px-5 py-2 rounded-[18px] text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-white/5"
                                style={{ background: `linear-gradient(135deg, ${article.color}cc, ${article.color})` }}
                            >
                                Chia Sẻ 🔗
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
