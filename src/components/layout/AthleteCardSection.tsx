export default function AthleteCardSection() {
    const athletes = [
        {
            name: "Nguyễn Hoàng Ngân",
            title: "Nữ Hoàng Kata",
            rank: "Huyền thoại",
            icon: "🥋",
            color: "var(--color-mokoto-main)",
            achievements: ["HCV Thế Giới", "HCV ASIAD", "HCV SEA Games"]
        },
        {
            name: "Nguyễn Thị Ngoan",
            title: "Nhà Vô Địch Kumite",
            rank: "Đội Tuyển QG",
            icon: "🥊",
            color: "var(--foreground)",
            achievements: ["HCV K1 Premier League", "HCV SEA Games"]
        },
        {
            name: "Chu Đức Thịnh",
            title: "Kumite Hạng Cân 75kg",
            rank: "Đội Tuyển QG",
            icon: "🥇",
            color: "#F59E0B",
            achievements: ["HCV SEA Games 32", "Vô địch Quốc gia"]
        },
    ];

    return (
        <section className="py-16 px-4 relative transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-10">
                    <div
                        className="w-12 h-12 rounded-[16px] flex items-center justify-center text-xl text-white shadow-clay-button"
                        style={{ background: "var(--color-mokoto-main)" }}
                    >
                        🏆
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)]" style={{ fontFamily: "Nunito, sans-serif" }}>
                        Thành Tích Võ Sĩ
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {athletes.map((athlete, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-[32px] p-8 transition-all duration-400 hover:-translate-y-3 border border-[var(--glass-border)] shadow-clay-card hover:shadow-clay-hover overflow-hidden"
                            style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}
                        >
                            <div
                                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
                                style={{ background: athlete.color }}
                            />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">
                                    {athlete.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-1" style={{ fontFamily: "Nunito, sans-serif", color: athlete.color }}>
                                    {athlete.name}
                                </h3>
                                <p className="text-sm font-bold opacity-70 mb-4 text-[var(--foreground)]">{athlete.title}</p>

                                <div className="mt-auto space-y-2">
                                    {athlete.achievements.map((ach, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                                            <span style={{ color: athlete.color }}>✓</span>
                                            <span>{ach}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
