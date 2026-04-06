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
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
            style={{ background: "rgba(20,30,60,0.55)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-2xl rounded-[32px] overflow-hidden shadow-clay-card"
                style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(24px)" }}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-black/8">
                    <span className="text-2xl">🔍</span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm bài viết, cầu thủ, đội bóng..."
                        className="flex-1 text-base font-medium outline-none bg-transparent"
                        style={{ color: "#1A2035" }}
                    />
                    <button
                        onClick={onClose}
                        className="text-xs font-bold px-3 py-1.5 rounded-[12px]"
                        style={{ background: "rgba(20,30,60,0.07)", color: "#4A5568" }}
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[420px] overflow-y-auto p-3">
                    {query.length > 1 && results.length === 0 && (
                        <div className="py-12 text-center" style={{ color: "#4A5568" }}>
                            <div className="text-4xl mb-3">🔎</div>
                            <p className="font-medium">Không tìm thấy kết quả cho &ldquo;{query}&rdquo;</p>
                        </div>
                    )}

                    {query.length <= 1 && (
                        <div className="py-4 px-3">
                            <p className="text-xs font-black tracking-widest mb-3" style={{ color: "#4A5568", fontFamily: "Nunito, sans-serif" }}>
                                GỢI Ý TÌM KIẾM
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Ronaldo", "LeBron", "Djokovic", "F1", "Messi", "NBA", "Champions League", "Vietnam"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105"
                                        style={{ background: "rgba(26,86,232,0.10)", color: "#1A56E8" }}
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
                            className="flex items-center gap-4 p-3 rounded-[20px] cursor-pointer transition-all duration-200 hover:shadow-clay-card group"
                            style={{ background: "transparent" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,86,232,0.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
                                    <span className="text-xs" style={{ color: "#4A5568" }}>{article.publishedAt}</span>
                                </div>
                                <p
                                    className="text-sm font-bold leading-snug truncate"
                                    style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
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
