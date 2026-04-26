export default function ContactSection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div 
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ background: "var(--color-mokoto-main)" }}
            />
            <div 
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ background: "var(--foreground)" }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <div 
                    className="rounded-[40px] p-8 md:p-12 border border-[var(--glass-border)] shadow-clay-card transition-colors duration-300"
                    style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px)" }}
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 text-[var(--foreground)]" style={{ fontFamily: "Nunito, sans-serif" }}>
                            Tham Gia Tập Luyện Cùng Chúng Tôi
                        </h2>
                        <p className="text-lg font-medium text-zinc-500">
                            Đăng ký nhận thông tin về các khóa học, sự kiện và giải đấu Karatedo sắp tới.
                        </p>
                    </div>

                    <form className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1 text-[var(--foreground)]">Họ và Tên</label>
                                <input 
                                    type="text" 
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    className="w-full px-5 py-4 rounded-[20px] bg-[var(--background)] border-2 border-[var(--glass-border)] transition-all outline-none focus:border-[var(--color-mokoto-main)] shadow-sm text-[var(--foreground)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1 text-[var(--foreground)]">Số Điện Thoại</label>
                                <input 
                                    type="tel" 
                                    placeholder="09xx xxx xxx"
                                    className="w-full px-5 py-4 rounded-[20px] bg-[var(--background)] border-2 border-[var(--glass-border)] transition-all outline-none focus:border-[var(--color-mokoto-main)] shadow-sm text-[var(--foreground)]"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-[var(--foreground)]">Email (Tuỳ chọn)</label>
                            <input 
                                type="email" 
                                placeholder="email@example.com"
                                className="w-full px-5 py-4 rounded-[20px] bg-[var(--background)] border-2 border-[var(--glass-border)] transition-all outline-none focus:border-[var(--color-mokoto-main)] shadow-sm text-[var(--foreground)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-[var(--foreground)]">Ghi chú</label>
                            <textarea 
                                placeholder="Nội dung bạn quan tâm..."
                                rows={4}
                                className="w-full px-5 py-4 rounded-[20px] bg-[var(--background)] border-2 border-[var(--glass-border)] transition-all outline-none focus:border-[var(--color-mokoto-main)] shadow-sm resize-none text-[var(--foreground)]"
                            ></textarea>
                        </div>

                        <button 
                            type="button"
                            className="w-full py-4 rounded-[20px] text-white font-bold text-lg shadow-clay-button transition-transform active:scale-95"
                            style={{ background: "var(--color-mokoto-main)" }}
                        >
                            Gửi Yêu Cầu 🥋
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
