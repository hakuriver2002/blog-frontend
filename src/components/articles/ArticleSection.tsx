"use client";
import { useState } from "react";
import { articles, type Category, type Article } from "@/src/data/seed";
import CategoryBar from "./CategoryBar";
import ArticleCard from "./ArticleCard";
import ArticleDetailModal from "./ArticleDetailModal";
import SidebarWidgets from "./SidebarWidgets";

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

            <section id="articles" className="relative py-4 px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="blob-1 absolute top-20 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
                        style={{ background: "radial-gradient(circle, #1A56E8, #7C3AED)" }}
                    />
                    <div
                        className="blob-2 absolute top-40 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                        style={{ background: "radial-gradient(circle, #E8320A, #F59E0B)" }}
                    />
                    <div
                        className="blob-3 absolute bottom-20 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl opacity-15"
                        style={{ background: "radial-gradient(circle, #00C46A, #1A56E8)" }}
                    />
                    {/* Decorative orbs */}
                    <div
                        className="spin-slow absolute top-48 right-24 w-64 h-64 rounded-full border-2 border-dashed opacity-10"
                        style={{ borderColor: "#1A56E8" }}
                    />
                    <div
                        className="blob-4 absolute bottom-32 right-1/4 w-20 h-20 rounded-[24px] opacity-30"
                        style={{ background: "linear-gradient(135deg, #F59E0B, #E8320A)" }}
                    />
                    <div
                        className="blob-2 absolute top-64 left-1/4 w-12 h-12 rounded-[18px] opacity-40"
                        style={{ background: "linear-gradient(135deg, #1A56E8, #7C3AED)" }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-[16px] flex items-center justify-center text-lg shadow-clay-card"
                                style={{ background: "linear-gradient(135deg, #1A56E8, #7C3AED)" }}
                            >
                                📰
                            </div>
                            <h2
                                className="text-3xl sm:text-4xl font-black"
                                style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                            >
                                Tin Thể Thao
                            </h2>
                            <div
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{ background: "linear-gradient(90deg, #00C46A, #1A56E8)" }}
                            >
                                {filtered.length} bài
                            </div>
                        </div>
                        <CategoryBar active={activeCategory} onChange={setActiveCategory} />
                    </div>

                    {/* Two-column layout: articles + sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Articles grid */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {filtered.map((article, i) => (
                                    <div
                                        key={article.id}
                                        className="fade-in"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <ArticleCard
                                            article={article}
                                            size={i === 0 ? "large" : "normal"}
                                            onClick={setSelectedArticle}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-10">
                                <button
                                    className="px-8 py-4 rounded-[24px] text-sm font-bold transition-all duration-200 hover:-translate-y-1 active:scale-95 shadow-clay-card hover:shadow-clay-hover"
                                    style={{
                                        background: "rgba(255,255,255,0.70)",
                                        backdropFilter: "blur(16px)",
                                        color: "#1A56E8",
                                    }}
                                >
                                    Xem Thêm Bài Viết ↓
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
