import React from "react";
import {
    ArrowRight,
    Play,
    Target,
    Crown,
    Star,
    Activity,
    Zap,
    Medal,
    Shield,
    Swords
} from "lucide-react";

// --- MOCK KARATEDO BRANDS/STYLES ---
const CLIENTS = [
    { name: "WKF", icon: Shield },
    { name: "Shotokan", icon: Target },
    { name: "Goju-Ryu", icon: Activity },
    { name: "Shito-Ryu", icon: Zap },
    { name: "Wado-Ryu", icon: Swords },
    { name: "JKA", icon: Medal },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
        <span className="text-xl font-bold text-[var(--foreground)] sm:text-2xl transition-colors duration-300">{value}</span>
        <span className="text-[10px] uppercase tracking-wider font-medium sm:text-xs" style={{ color: "var(--color-mokoto-65)" }}>{label}</span>
    </div>
);

// --- MAIN COMPONENT ---
export default function HeroSection() {
    return (
        <section className="pb-12 sm:pb-20 overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8 rounded-[16px] text-[var(--foreground)] overflow-hidden font-sans transition-colors duration-300" style={{ background: "var(--background)" }}>
                {/* 
        SCOPED ANIMATIONS 
      */}
                <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

                {/* Background Image with Gradient Mask - Karate Dojo/Tournament */}
                <div
                    className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"
                    style={{
                        maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                        WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    }}
                />

                <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

                        {/* --- LEFT COLUMN --- */}
                        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

                            {/* Badge */}
                            <div className="animate-fade-in delay-100">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-[var(--glass-bg)]/20">
                                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                                        Trang Tin Karatedo Hàng Đầu
                                        <Star className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-mokoto-main)" }} />
                                    </span>
                                </div>
                            </div>

                            {/* Heading */}
                            <h1
                                className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] text-[var(--foreground)]"
                                style={{
                                    fontFamily: "Nunito, sans-serif",
                                    maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                                    WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
                                }}
                            >
                                Khai Phá Sức Mạnh<br />
                                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--foreground), var(--color-mokoto-main))" }}>
                                    Karatedo Đỉnh Cao
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="animate-fade-in delay-300 max-w-xl text-lg leading-relaxed text-zinc-500">
                                Trải nghiệm nhịp đập của môn võ nghệ thuật qua những câu chuyện truyền cảm hứng,
                                phân tích chuyên sâu và góc nhìn cận cảnh về các võ sĩ hàng đầu.
                            </p>

                            {/* CTA Buttons */}
                            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
                                <button
                                    className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    style={{ background: "var(--color-mokoto-main)", color: "var(--color-mokoto-white)", boxShadow: "0 8px 32px rgba(223, 37, 49, 0.38)" }}
                                >
                                    Tin Tức Mới Nhất
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>

                                <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-8 py-4 text-sm font-semibold text-[var(--foreground)] backdrop-blur-sm transition-colors hover:bg-[var(--glass-bg)]/20 hover:border-[var(--glass-border)]/40">
                                    <Play className="w-4 h-4 fill-current" style={{ color: "var(--color-mokoto-main)" }} />
                                    Xem Highlights
                                </button>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN --- */}
                        <div className="lg:col-span-5 space-y-6 lg:mt-12">

                            {/* Stats Card */}
                            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 backdrop-blur-xl shadow-2xl">
                                {/* Card Glow Effect */}
                                <div
                                    className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
                                    style={{ background: "var(--color-mokoto-main)", opacity: 0.15 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--foreground)]/5 ring-1 ring-[var(--glass-border)]">
                                            <Target className="h-6 w-6" style={{ color: "var(--color-mokoto-main)" }} />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold tracking-tight text-[var(--foreground)]">500+</div>
                                            <div className="text-sm text-zinc-500">Hồ sơ võ sĩ</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Section */}
                                    <div className="space-y-3 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-500">Mức độ tương tác</span>
                                            <span className="text-[var(--foreground)] font-medium">99%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--foreground)]/5">
                                            <div
                                                className="h-full w-[99%] rounded-full"
                                                style={{ background: "linear-gradient(90deg, var(--color-mokoto-45), var(--color-mokoto-main))" }}
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-[var(--glass-border)] mb-6" />

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <StatItem value="10k+" label="Bài viết" />
                                        <div className="w-px h-full bg-[var(--glass-border)] mx-auto" />
                                        <StatItem value="Live" label="Cập nhật" />
                                        <div className="w-px h-full bg-[var(--glass-border)] mx-auto" />
                                        <StatItem value="100%" label="Đam mê" />
                                    </div>

                                    {/* Tag Pills */}
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--foreground)]/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-500">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--color-mokoto-main)" }}></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--color-mokoto-main)" }}></span>
                                            </span>
                                            LIVE NOW
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--foreground)]/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-500">
                                            <Crown className="w-3 h-3" style={{ color: "#F59E0B" }} />
                                            ĐỘC QUYỀN
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Marquee Card */}
                            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] py-8 backdrop-blur-xl">
                                <h3 className="mb-6 px-8 text-sm font-medium" style={{ color: "var(--color-mokoto-65)" }}>Hệ phái & Liên đoàn</h3>

                                <div
                                    className="relative flex overflow-hidden"
                                    style={{
                                        maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                                        WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                                    }}
                                >
                                    <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                                        {/* Triple list for seamless loop */}
                                        {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default"
                                            >
                                                {/* Brand Icon */}
                                                <client.icon className="h-6 w-6 fill-current" style={{ color: "var(--color-mokoto-main)" }} />
                                                {/* Brand Name */}
                                                <span className="text-lg font-black text-[var(--foreground)] tracking-tight" style={{ fontFamily: "Nunito, sans-serif" }}>
                                                    {client.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            {/* Stats row */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-1 lg:px-1 text-[var(--foreground)] font-sans">
                <div className="anim-slide-up delay-500 mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Bài Viết Hôm Nay", value: "47", icon: "📝", color: "#1A56E8" },
                        { label: "Sự kiện diễn ra", value: "12", icon: "🔴", color: "#E8320A" },
                        { label: "Độc Giả Online", value: "28K", icon: "👥", color: "#7C3AED" },
                        { label: "Cập Nhật / Giờ", value: "∞", icon: "⚡", color: "#00C46A" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="group rounded-[24px] p-5 text-center cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-105 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl shadow-lg"
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div
                                className="text-3xl font-black mb-1"
                                style={{ fontFamily: "Nunito, sans-serif", color: stat.color }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium" style={{ color: "var(--color-mokoto-65)" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
