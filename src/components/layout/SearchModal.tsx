"use client";
import { useState, useEffect, useRef } from "react";
import { articles } from "../../data/seed";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const results = query.length > 1
        ? articles.filter(
            (a) =>
                a.title.toLowerCase().includes(query.toLowerCase()) ||
                a.category.toLowerCase().includes(query.toLowerCase()) ||
                a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
        : [];

    useEffect(() => {
        if (open) {
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 transition-colors duration-300"
            style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-[var(--glass-border)]"
                style={{ background: "var(--background)", backdropFilter: "blur(24px)" }}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--glass-border)]">
                    <span className="text-2xl">🔍</span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm bài viết, cầu thủ, đội bóng..."
                        className="flex-1 text-base font-medium outline-none bg-transparent text-[var(--foreground)]"
                    />
                    <button
                        onClick={onClose}
                        className="text-xs font-bold px-3 py-1.5 rounded-[12px] bg-[var(--foreground)]/5 text-[var(--foreground)] opacity-70 hover:opacity-100"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[420px] overflow-y-auto p-3">
                    {query.length > 1 && results.length === 0 && (
                        <div className="py-12 text-center text-zinc-500">
                            <div className="text-4xl mb-3">🔎</div>
                            <p className="font-medium">Không tìm thấy kết quả cho &ldquo;{query}&rdquo;</p>
                        </div>
                    )}

                    {query.length <= 1 && (
                        <div className="py-4 px-3">
                            <p className="text-xs font-black tracking-widest mb-3 text-zinc-500" style={{ fontFamily: "Nunito, sans-serif" }}>
                                GỢI Ý TÌM KIẾM
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Ronaldo", "LeBron", "Djokovic", "F1", "Messi", "NBA", "Champions League", "Vietnam"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105 bg-[var(--foreground)]/5 text-[var(--foreground)]"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.map((article) => (
                        <div
                            key={article.id}
                            className="flex items-center gap-4 p-3 rounded-[20px] cursor-pointer transition-all duration-200 hover:bg-[var(--foreground)]/5 group"
                        >
                            <div className="text-3xl">{article.image}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                                        style={{ background: article.color }}
                                    >
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-zinc-500">{article.publishedAt}</span>
                                </div>
                                <p
                                    className="text-sm font-bold leading-snug truncate text-[var(--foreground)]"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                >
                                    {article.title}
                                </p>
                            </div>
                            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: article.color }}>
                                Đọc →
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
