import type { Article } from "@/src/data/seed";

interface Props {
    article: Article;
    size?: "normal" | "large";
    onClick?: (article: Article) => void;
}

function formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(0) + "K";
    return n.toString();
}

export default function ArticleCard({ article, size = "normal", onClick }: Props) {
    const isLarge = size === "large";

    return (
        <article
            className="group relative overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-3 shadow-clay-card hover:shadow-clay-hover rounded-[28px]"
            style={{ background: "rgba(255,255,255,0.68)", backdropFilter: "blur(20px)" }}
            onClick={() => onClick?.(article)}
        >
            <div
                className="h-1 w-full rounded-t-[28px]"
                style={{ background: `linear-gradient(90deg, ${article.color}, ${article.color}88)` }}
            />

            <div className={`p-5 sm:p-6 ${isLarge ? "sm:p-8" : ""}`}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="text-xs font-bold px-3 py-1 rounded-full text-white"
                            style={{ background: article.color }}
                        >
                            {article.category}
                        </span>
                        {article.trending && (
                            <span
                                className="text-xs font-bold px-3 py-1 rounded-full"
                                style={{ background: "rgba(245,158,11,0.15)", color: "#D97706" }}
                            >
                                🔥 Trending
                            </span>
                        )}
                    </div>
                    <div
                        className={`${isLarge ? "text-5xl" : "text-4xl"} transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6`}
                    >
                        {article.image}
                    </div>
                </div>

                <h2
                    className={`font-extrabold leading-snug mb-3 ${isLarge ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}
                    style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                >
                    {article.title}
                </h2>

                <p
                    className="text-sm font-medium leading-relaxed mb-4 line-clamp-3"
                    style={{ color: "#4A5568" }}
                >
                    {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: `${article.color}14`, color: article.color }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                            style={{ background: article.color, fontFamily: "Nunito, sans-serif" }}
                        >
                            {article.authorAvatar}
                        </div>
                        <div>
                            <div className="text-xs font-bold" style={{ color: "#1A2035" }}>{article.author}</div>
                            <div className="text-xs" style={{ color: "#4A5568" }}>{article.publishedAt}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: "#4A5568" }}>👁 {formatNumber(article.views)}</span>
                        <button
                            className="text-xs font-bold px-3 py-1.5 rounded-[14px] transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{ background: `${article.color}18`, color: article.color }}
                        >
                            Đọc →
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
