"use client";
import { useState } from "react";
import { articles, type Category, type Article } from "@/src/data/seed";
import ArticleDetailModal from "./ArticleDetailModal";
import SidebarWidgets from "./SidebarWidgets";
import CategoryBar from "./CategoryBar";
import ArticleCard from "./ArticleCard";

export default function ArticlesSection() {
    const [activeCategory, setActiveCategory] = useState<Category | "Tất Cả">("Tất Cả");
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const filtered =
        activeCategory === "Tất Cả"
            ? articles
            : articles.filter((a) => a.category === activeCategory);

    return (
        <>
            <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />

            <section id="articles" className="relative py-24 px-4 bg-[var(--background)] overflow-hidden transition-colors duration-300">
                {/* Background Image/Effect */}
                <div className="absolute inset-0 z-0 opacity-40 mask-fade-y pointer-events-none">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop")' }}
                    />
                    <div className="absolute inset-0 bg-[var(--background)]/60" />
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    <div
                        className="blob-1 absolute top-20 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
                        style={{ background: "radial-gradient(circle, #ffcd75, #df2531)" }}
                    />
                    <div
                        className="blob-2 absolute bottom-40 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
                        style={{ background: "radial-gradient(circle, #df2531, #7C3AED)" }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto z-20">
                    {/* Header */}
                    <div className="mb-16">
                        <div className="flex flex-col items-start gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tin tức mới nhất</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-6">
                                <h2
                                    className="text-6xl sm:text-7xl font-medium tracking-tighter leading-[0.85] gradient-text-gold"
                                >
                                    TIN TỔNG HỢP<br />THỂ THAO
                                </h2>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[var(--foreground)] leading-none">{filtered.length}</div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bài viết</div>
                                    </div>
                                    <div className="w-px h-10 bg-[var(--foreground)]/10" />
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[var(--foreground)] leading-none">24H</div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cập nhật</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CategoryBar active={activeCategory} onChange={setActiveCategory} />
                    </div>

                    {/* Two-column layout: articles + sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Articles grid */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {filtered.map((article, i) => (
                                    <div
                                        key={article.id}
                                        className="fadeSlideIn"
                                        style={{ animationDelay: `${(i + 1) * 100}ms` }}
                                    >
                                        <ArticleCard
                                            article={article}
                                            size={i === 0 ? "large" : "normal"}
                                            onClick={setSelectedArticle}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-16">
                                <button
                                    className="px-10 py-5 rounded-full text-sm font-bold bg-[var(--foreground)] text-[var(--background)] transition-all duration-300 hover:scale-105 opacity-90 hover:opacity-100 active:scale-95 shadow-xl shadow-white/10"
                                >
                                    XEM THÊM BÀI VIẾT ↓
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <SidebarWidgets />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
