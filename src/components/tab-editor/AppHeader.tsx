"use client";

import { Music2, Library, Palette } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TabEditorMobileNavProps {
    activePanel: "studio" | "library" | "customize" | "mixer";
    onPanelChange: (panel: "studio" | "library" | "customize" | "mixer") => void;
}

export function TabEditorMobileNav({ activePanel, onPanelChange }: TabEditorMobileNavProps) {
    return (
        <nav className="relative z-[60] bg-zinc-950/60 backdrop-blur-xl border-t border-zinc-900/80 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
                {[
                    { id: "studio", icon: Music2, label: "Editor" },
                    { id: "library", icon: Library, label: "Library" },
                    { id: "customize", icon: Palette, label: "Customize" }
                ].map((item) => {
                    const isActive = activePanel === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onPanelChange(item.id as any)}
                            className={cn(
                                "flex flex-col items-center justify-center w-20 h-full transition-all duration-300 relative group",
                                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-x-2 top-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-in fade-in zoom-in-95 duration-300" />
                            )}
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-300",
                                isActive ? "bg-cyan-400/10" : "group-hover:bg-zinc-800/50"
                            )}>
                                <Icon size={22} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
