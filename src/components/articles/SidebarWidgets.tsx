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
                className="rounded-[24px] p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
            >
                <div className="flex items-center gap-2 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <h3
                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                    >
                        Đọc Nhiều Nhất
                    </h3>
                </div>
                <div className="space-y-6">
                    {popular.map((a, i) => (
                        <div key={a.id} className="flex items-center gap-4 group cursor-pointer">
                            <div
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white/10"
                                style={{
                                    background: i === 0 ? "linear-gradient(135deg,#F59E0B,#E8320A)" : i === 1 ? "linear-gradient(135deg,#9CA3AF,#6B7280)" : i === 2 ? "linear-gradient(135deg,#D97706,#92400E)" : "rgba(255,255,255,0.1)",
                                }}
                            >
                                0{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-xs font-bold leading-snug truncate text-[var(--foreground)] group-hover:text-[#ffcd75] transition-colors"
                                >
                                    {a.title}
                                </p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                    {(a.views / 1000).toFixed(0)}K views
                                </p>
                            </div>
                            <span className="text-xl flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">{a.image}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick stats */}
            <div
                className="rounded-[24px] p-8 text-center overflow-hidden relative bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl group cursor-pointer"
            >
                {/* Glow decoration */}
                <div 
                    className="absolute -top-12 -right-12 w-32 h-32 blur-[40px] rounded-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-500 bg-blue-500"
                />
                
                <div className="relative">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">⚡</div>
                    <h3
                        className="text-[var(--foreground)] font-medium text-xl tracking-tighter mb-2"
                    >
                        SportsPulse Pro
                    </h3>
                    <p className="text-zinc-500 text-xs font-normal mb-6 leading-relaxed">
                        Nhận tin độc quyền, phân tích chuyên sâu và không quảng cáo
                    </p>
                    <button
                        className="w-full px-6 py-3 rounded-full text-xs font-bold bg-[var(--foreground)] text-[var(--background)] transition-all duration-300 hover:scale-105 active:scale-98 uppercase tracking-wider shadow-lg shadow-black/10"
                    >
                        Dùng Thử Miễn Phí ✨
                    </button>
                </div>
            </div>
        </aside>
    );
}
