"use client";
import { useState } from "react";
import { categories, type Category } from "@/src/data/seed";

interface Props {
    active: Category | "Tất Cả";
    onChange: (cat: Category | "Tất Cả") => void;
}

export default function CategoryBar({ active, onChange }: Props) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onChange("Tất Cả")}
                className="flex-shrink-0 px-5 py-2.5 rounded-[20px] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={
                    active === "Tất Cả"
                        ? {
                            background: "linear-gradient(135deg, #3B82F6, #1A56E8)",
                            color: "white",
                            boxShadow: "0 6px 20px rgba(26, 86, 232, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                        }
                        : {
                            background: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(16px)",
                            color: "#4A5568",
                            boxShadow: "0 4px 14px rgba(20,30,60,0.10), inset 0 1px 0 rgba(255,255,255,0.70)",
                        }
                }
            >
                🏆 Tất Cả
            </button>

            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => onChange(cat.name)}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    style={
                        active === cat.name
                            ? {
                                background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color})`,
                                color: "white",
                                boxShadow: `0 6px 20px ${cat.color}44, inset 0 1px 0 rgba(255,255,255,0.3)`,
                            }
                            : {
                                background: "rgba(255,255,255,0.65)",
                                backdropFilter: "blur(16px)",
                                color: "#4A5568",
                                boxShadow: "0 4px 14px rgba(20,30,60,0.10), inset 0 1px 0 rgba(255,255,255,0.70)",
                            }
                    }
                >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-black"
                        style={
                            active === cat.name
                                ? { background: "rgba(255,255,255,0.25)", color: "white" }
                                : { background: `${cat.color}18`, color: cat.color }
                        }
                    >
                        {cat.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
