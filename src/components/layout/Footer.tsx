export default function Footer() {
    const sports = ["Bóng Đá", "Bóng Rổ", "Tennis", "F1", "Bơi Lội", "Điền Kinh", "Boxing", "Golf"];
    const links = ["Về Chúng Tôi", "Liên Hệ", "Điều Khoản", "Bảo Mật", "Quảng Cáo", "Tuyển Dụng"];

    return (
        <footer className="relative pt-16 pb-8 px-4">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="blob-4 absolute bottom-0 left-0 right-0 h-64 opacity-5"
                    style={{ background: "linear-gradient(180deg, transparent, #1A56E8)" }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto transition-colors duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[var(--glass-border)]">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-11 h-11 rounded-[16px] flex items-center justify-center text-2xl shadow-clay-button"
                                style={{ background: "linear-gradient(135deg, var(--color-mokoto-main), var(--foreground))" }}
                            >
                                <span style={{ color: "#ffffff" }}>🥋</span>
                            </div>
                            <span
                                className="text-xl font-black text-[var(--foreground)]"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                                Karate<span style={{ color: "#e81a1aff" }}>do</span>
                            </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed mb-4 text-zinc-500">
                            Nguồn tin thể thao đáng tin cậy nhất Việt Nam. Cập nhật 24/7, phân tích chuyên sâu.
                        </p>
                        <div className="flex gap-3">
                            {["🐦", "📘", "📸", "▶️"].map((icon, i) => (
                                <button
                                    key={i}
                                    className="w-9 h-9 rounded-[14px] flex items-center justify-center text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                                    style={{ backdropFilter: "blur(12px)" }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sports */}
                    <div>
                        <h3
                            className="text-sm font-black tracking-wide mb-4 text-[var(--foreground)]"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                            MÔN THỂ THAO
                        </h3>
                        <ul className="space-y-2">
                            {sports.map((s) => (
                                <li key={s}>
                                    <a
                                        href="#"
                                        className="text-sm font-medium transition-colors duration-150 hover:text-[var(--color-mokoto-main)] text-zinc-500"
                                    >
                                        {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3
                            className="text-sm font-black tracking-wide mb-4 text-[var(--foreground)]"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                            THÔNG TIN
                        </h3>
                        <ul className="space-y-2">
                            {links.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#"
                                        className="text-sm font-medium transition-colors duration-150 hover:text-[var(--color-mokoto-main)] text-zinc-500"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-center sm:text-left text-zinc-500">
                        © 2026 SportsPulse. Tất cả quyền được bảo lưu.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-zinc-500">
                            Cập nhật lần cuối: 31/03/2026 · 14:32 ICT
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
