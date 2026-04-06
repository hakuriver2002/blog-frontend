import { articles } from "@/src/data/seed";

export default function HeroSection() {
    const featured = articles.filter((a) => a.featured);
    const main = featured[0];
    const subs = featured.slice(1, 4);

    return (
        <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-2 pb-8 px-4">
            {/* Background blobs */}
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

            <div className="relative max-w-7xl mx-auto w-full">
                {/* Section header */}
                <div className="anim-slide-up flex items-center gap-3 mb-8">
                    <div
                        className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white"
                        style={{ background: "linear-gradient(90deg, #E8320A, #F59E0B)", fontFamily: "Nunito, sans-serif" }}
                    >
                        🔥 TIN NỔI BẬT
                    </div>
                    <div className="h-px flex-1 opacity-20" style={{ background: "#1A2035" }} />
                    <span className="text-sm font-medium" style={{ color: "#4A5568" }}>31/03/2026</span>
                </div>

                {/* Main bento grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Featured main card */}
                    <div
                        className="anim-slide-up delay-100 lg:col-span-2 group relative overflow-hidden rounded-[32px] p-7 sm:p-10 cursor-pointer transition-all duration-500 hover:-translate-y-3 shadow-clay-card hover:shadow-clay-hover min-h-[420px] sm:min-h-[480px] flex flex-col justify-between"
                        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)" }}
                    >
                        {/* Background gradient layer */}
                        <div
                            className="absolute inset-0 rounded-[32px] opacity-8 transition-opacity duration-300 group-hover:opacity-12"
                            style={{ background: `linear-gradient(135deg, ${main.color}33, transparent)` }}
                        />

                        {/* Top */}
                        <div className="relative flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                    style={{ background: main.color }}
                                >
                                    {main.category}
                                </div>
                                {main.trending && (
                                    <div
                                        className="px-3 py-1 rounded-full text-xs font-bold"
                                        style={{ background: "rgba(245,158,11,0.15)", color: "#D97706" }}
                                    >
                                        🔥 HOT
                                    </div>
                                )}
                            </div>
                            <div className="text-6xl sm:text-8xl transition-transform duration-300 group-hover:scale-110">
                                {main.image}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4"
                                style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                            >
                                {main.title}
                            </h1>
                            <p
                                className="text-base sm:text-lg font-medium leading-relaxed mb-6 max-w-2xl"
                                style={{ color: "#4A5568" }}
                            >
                                {main.excerpt}
                            </p>
                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                                        style={{ background: main.color, fontFamily: "Nunito, sans-serif" }}
                                    >
                                        {main.authorAvatar}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "#4A5568" }}>
                                        {main.author}
                                    </span>
                                </div>
                                <span className="text-sm" style={{ color: "#4A5568" }}>
                                    ⏱ {main.readTime} đọc
                                </span>
                                <span className="text-sm" style={{ color: "#4A5568" }}>
                                    📅 {main.publishedAt}
                                </span>
                                {/* Tags */}
                                {main.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-3 py-1 rounded-full font-medium"
                                        style={{ background: `${main.color}18`, color: main.color }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Read more */}
                        <div className="relative mt-6">
                            <button
                                className="px-6 py-3 rounded-[20px] text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-clay-button"
                                style={{ background: `linear-gradient(135deg, ${main.color}cc, ${main.color})` }}
                            >
                                Đọc Thêm →
                            </button>
                        </div>
                    </div>

                    {/* Side cards */}
                    <div className="flex flex-col gap-5">
                        {subs.map((article, idx) => (
                            <div
                                key={article.id}
                                className={`anim-slide-up delay-${(idx + 2) * 100} group relative overflow-hidden rounded-[28px] p-5 sm:p-6 cursor-pointer transition-all duration-400 hover:-translate-y-2 shadow-clay-card hover:shadow-clay-hover flex-1 flex flex-col justify-between`}
                                style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)", minHeight: "140px" }}
                            >
                                <div
                                    className="absolute inset-0 rounded-[28px] opacity-6"
                                    style={{ background: `linear-gradient(135deg, ${article.color}44, transparent)` }}
                                />
                                <div className="relative flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-bold text-white"
                                                style={{ background: article.color }}
                                            >
                                                {article.category}
                                            </span>
                                            {article.trending && (
                                                <span className="text-xs" style={{ color: "#D97706" }}>🔥</span>
                                            )}
                                        </div>
                                        <h3
                                            className="text-base sm:text-lg font-extrabold leading-snug mb-2"
                                            style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                                        >
                                            {article.title}
                                        </h3>
                                        <p
                                            className="text-sm font-medium leading-relaxed line-clamp-2"
                                            style={{ color: "#4A5568" }}
                                        >
                                            {article.excerpt}
                                        </p>
                                    </div>
                                    <div className="text-3xl sm:text-4xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        {article.image}
                                    </div>
                                </div>
                                <div className="relative mt-3 flex items-center justify-between">
                                    <span className="text-xs font-medium" style={{ color: "#4A5568" }}>
                                        {article.author} · {article.readTime}
                                    </span>
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: article.color }}
                                    >
                                        Đọc →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="anim-slide-up delay-500 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Bài Viết Hôm Nay", value: "47", icon: "📝", color: "#1A56E8" },
                        { label: "Sự kiện diễn ra", value: "12", icon: "🔴", color: "#E8320A" },
                        { label: "Độc Giả Online", value: "28K", icon: "👥", color: "#7C3AED" },
                        { label: "Cập Nhật / Giờ", value: "∞", icon: "⚡", color: "#00C46A" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="group rounded-[24px] p-5 text-center cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-clay-card"
                            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)" }}
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div
                                className="text-3xl font-black mb-1"
                                style={{ fontFamily: "Nunito, sans-serif", color: stat.color }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium" style={{ color: "#4A5568" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
