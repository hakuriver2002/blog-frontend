"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { X, ZoomIn } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ImageItem = {
    id: number | string;
    title: string;
    desc: string;
    url: string;
    span: string;
    color: string;
};

const KARATEDO_GALLERY: ImageItem[] = [
    {
        id: 1,
        title: "Kumite Đỉnh Cao",
        desc: "Khoảnh khắc giao đòn quyết định tại chung kết giải Quốc gia.",
        url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000&auto=format&fit=crop",
        span: "md:col-span-2 md:row-span-2",
        color: "var(--color-mokoto-main)",
    },
    {
        id: 2,
        title: "Kỷ Luật & Tôn Trọng",
        desc: "Nghi thức chào trước khi bước vào thảm đấu.",
        url: "https://plus.unsplash.com/premium_photo-1663100722417-6e36673fe0ed?q=80&w=1000&auto=format&fit=crop",
        span: "md:col-span-1 md:row-span-1",
        color: "var(--color-mokoto-black)",
    },
    {
        id: 3,
        title: "Sức Mạnh Kata",
        desc: "Thần thái và tốc độ trong bài quyền Unsu.",
        url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1000&auto=format&fit=crop",
        span: "md:col-span-1 md:row-span-2",
        color: "#F59E0B",
    },
    {
        id: 4,
        title: "Tinh Thần Đồng Đội",
        desc: "Cùng nhau vượt qua mọi giới hạn.",
        url: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=1000&auto=format&fit=crop",
        span: "md:col-span-2 md:row-span-1",
        color: "#1A56E8",
    },
    {
        id: 5,
        title: "Khổ Luyện",
        desc: "Kihon - Nền tảng của mọi kỹ thuật hoàn hảo.",
        url: "https://images.unsplash.com/photo-1516084930366-2dbb846e107f?q=80&w=1000&auto=format&fit=crop",
        span: "md:col-span-1 md:row-span-1",
        color: "#00C46A",
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
} as const;

const ImageModal = ({
    item,
    onClose,
}: {
    item: ImageItem;
    onClose: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl p-4 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 40px ${item.color}40` }}>
                    <img
                        src={item.url}
                        alt={item.title}
                        className="h-auto max-h-[85vh] w-full object-contain"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/80">{item.desc}</p>
                    </div>
                </div>
            </motion.div>
            <button
                onClick={onClose}
                className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Close image view"
            >
                <X size={24} />
            </button>
        </motion.div>
    );
};

export default function GallerySection() {
    const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);
    const [dragConstraint, setDragConstraint] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateConstraints = () => {
            if (gridRef.current && containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const gridWidth = gridRef.current.scrollWidth;
                const newConstraint = Math.min(0, containerWidth - gridWidth - 32);
                setDragConstraint(newConstraint);
            }
        };

        calculateConstraints();
        // Use setTimeout to ensure DOM is fully rendered before calculating
        setTimeout(calculateConstraints, 100);
        window.addEventListener("resize", calculateConstraints);
        return () => window.removeEventListener("resize", calculateConstraints);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

    return (
        <section
            id="gallary"
            ref={targetRef}
            className="relative w-full overflow-hidden py-24"
        >
            <motion.div
                style={{ opacity, y }}
                className="container mx-auto px-4 text-center max-w-7xl"
            >
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <span
                        className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white mb-4 inline-block shadow-md"
                        style={{ background: "var(--color-mokoto-main)", fontFamily: "Nunito, sans-serif" }}
                    >
                        📸 KHOẢNH KHẮC
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)]" style={{ fontFamily: "Nunito, sans-serif" }}>
                        Thư Viện Hình Ảnh
                    </h2>
                    <p className="mt-4 text-lg font-medium max-w-2xl text-zinc-500">
                        Lưu giữ những khoảnh khắc đẹp nhất trên thảm đấu, từ những giọt mồ hôi trên sân tập đến nụ cười rạng rỡ khi bước lên bục vinh quang.
                    </p>
                </div>
            </motion.div>

            <div
                ref={containerRef}
                className="relative mt-8 w-full cursor-grab active:cursor-grabbing max-w-7xl mx-auto"
            >
                <motion.div
                    className="w-full md:w-max mx-auto"
                    drag="x"
                    dragConstraints={{ left: dragConstraint, right: 0 }}
                    dragElastic={0.05}
                >
                    <motion.div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 auto-rows-[minmax(15rem,1fr)] gap-4 px-4 md:px-8 w-full md:w-[1000px] lg:w-[1200px]"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {KARATEDO_GALLERY.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                className={cn(
                                    "group relative flex h-[250px] md:h-full w-full cursor-pointer items-end overflow-hidden rounded-[24px] bg-[var(--background)] border border-[var(--glass-border)] shadow-clay-card transition-all duration-300 ease-in-out hover:shadow-clay-hover focus-visible:outline-none",
                                    item.span,
                                )}
                                whileHover={{ scale: 0.98, y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => setSelectedItem(item)}
                                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                                tabIndex={0}
                                aria-label={`View ${item.title}`}
                            >
                                <div
                                    className="absolute inset-0 z-0 transition-opacity duration-300 group-hover:opacity-100 opacity-0 mix-blend-overlay"
                                    style={{ background: `linear-gradient(45deg, ${item.color}, transparent)` }}
                                />
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                />

                                {/* Overlay Gradient */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                                {/* Content */}
                                <div className="relative z-10 w-full p-6 translate-y-4 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-black text-white" style={{ fontFamily: "Nunito, sans-serif" }}>{item.title}</h3>
                                        <p className="mt-1 text-sm font-medium text-white/80 line-clamp-1">{item.desc}</p>
                                    </div>
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                                        style={{ color: item.color === "var(--color-mokoto-black)" ? "white" : item.color }}
                                    >
                                        <ZoomIn size={18} className="text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}
