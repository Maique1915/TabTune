"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface NavItem {
    id: string;
    icon: LucideIcon | string;
    label: string;
}

interface MobileNavProps {
    items: NavItem[];
    activePanel: string;
    onPanelChange: (id: any) => void;
}

export function MobileNav({ items, activePanel, onPanelChange }: MobileNavProps) {
    return (
        <nav className="relative z-[60] bg-zinc-950/60 backdrop-blur-xl border-t border-zinc-900/80 pb-safe pt-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {items.map((item) => {
                    const isActive = activePanel === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onPanelChange(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group",
                                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <div className="relative p-2 rounded-xl transition-all duration-300">
                                {isActive && (
                                    <div className="absolute inset-0 bg-cyan-500/10 rounded-xl animate-in fade-in zoom-in-95 duration-300 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]" />
                                )}
                                {typeof Icon === "string" ? (
                                    <span
                                        className={cn(
                                            "material-icons-round text-2xl relative z-10 transition-all duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-105"
                                        )}
                                    >
                                        {Icon}
                                    </span>
                                ) : (
                                    <Icon
                                        size={24}
                                        className={cn(
                                            "relative z-10 transition-all duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-105"
                                        )}
                                    />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-widest mt-1 transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-60"
                                )}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
