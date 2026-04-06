// import PollWidget from "./PollWidget";
import { articles } from "@/src/data/seed";

export default function SidebarWidgets() {
    const popular = [...articles].sort((a, b) => b.views - a.views).slice(0, 4);

    return (
        <aside className="flex flex-col gap-5">
            {/* Poll */}
            {/* <PollWidget /> */}

            {/* Most read */}
            <div
                className="rounded-[28px] p-6 shadow-clay-card"
                style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📊</span>
                    <h3
                        className="text-base font-black"
                        style={{ fontFamily: "Nunito, sans-serif", color: "#1A2035" }}
                    >
                        Đọc Nhiều Nhất
                    </h3>
                </div>
                <div className="space-y-3">
                    {popular.map((a, i) => (
                        <div key={a.id} className="flex items-center gap-3 group cursor-pointer">
                            <div
                                className="flex-shrink-0 w-7 h-7 rounded-[10px] flex items-center justify-center text-xs font-black text-white"
                                style={{
                                    background: i === 0 ? "linear-gradient(135deg,#F59E0B,#E8320A)" : i === 1 ? "linear-gradient(135deg,#9CA3AF,#6B7280)" : i === 2 ? "linear-gradient(135deg,#D97706,#92400E)" : `${a.color}88`,
                                    fontFamily: "Nunito, sans-serif",
                                }}
                            >
                                {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-xs font-bold leading-snug truncate group-hover:underline"
                                    style={{ color: "#1A2035" }}
                                >
                                    {a.title}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "#4A5568" }}>
                                    {(a.views / 1000).toFixed(0)}K lượt xem
                                </p>
                            </div>
                            <span className="text-lg flex-shrink-0">{a.image}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick stats */}
            <div
                className="rounded-[28px] p-6 text-center shadow-clay-card overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, rgba(26,86,232,0.92), rgba(124,58,237,0.92))" }}
            >
                <div
                    className="blob-2 absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-30"
                    style={{ background: "#E8320A" }}
                />
                <div className="relative">
                    <div className="text-4xl mb-2">⚡</div>
                    <h3
                        className="text-white font-black text-base mb-1"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                        SportsPulse Pro
                    </h3>
                    <p className="text-white/75 text-xs font-medium mb-4 leading-relaxed">
                        Nhận tin độc quyền, phân tích chuyên sâu và không quảng cáo
                    </p>
                    <button
                        className="w-full px-4 py-2.5 rounded-[18px] text-sm font-bold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                        }}
                    >
                        Dùng Thử Miễn Phí ✨
                    </button>
                </div>
            </div>
        </aside>
    );
}
