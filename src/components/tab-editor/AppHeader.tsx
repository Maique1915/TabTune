"use client";

import { Music2, Library, Palette } from "lucide-react";

interface TabEditorMobileNavProps {
    activePanel: "studio" | "library" | "customize" | "mixer";
    onPanelChange: (panel: "studio" | "library" | "customize" | "mixer") => void;
}

export function TabEditorMobileNav({ activePanel, onPanelChange }: TabEditorMobileNavProps) {
    return (
        <nav className="relative z-[60] bg-black/40 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16">
                <button
                    onClick={() => onPanelChange("studio")}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activePanel === "studio"
                        ? "text-cyan-400"
                        : "text-slate-400 hover:text-slate-200"
                        }`}
                >
                    <Music2 size={24} />
                    <span className="text-[10px] font-medium mt-1">Editor</span>
                </button>
                <button
                    onClick={() => onPanelChange("library")}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activePanel === "library"
                        ? "text-cyan-400"
                        : "text-slate-400 hover:text-slate-200"
                        }`}
                >
                    <Library size={24} />
                    <span className="text-[10px] font-medium mt-1">Library</span>
                </button>
                <button
                    onClick={() => onPanelChange("customize")}
                    className={`flex flex-col items-center justify-between w-full h-full transition-colors ${activePanel === "customize"
                        ? "text-cyan-400"
                        : "text-slate-400 hover:text-slate-200"
                        }`}
                >
                    <Palette size={24} />
                    <span className="text-[10px] font-medium mt-1">Customize</span>
                </button>
            </div>
        </nav>
    );
}
