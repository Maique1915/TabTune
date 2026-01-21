"use client";

import React from 'react';
import { cn } from "@/shared/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface StageContainerProps {
    children: React.ReactNode;
    title?: string;
    statusLabel?: string;
    aspectRatio?: string;
    background?: string;
    className?: string;
}

export const StageContainer = ({
    children,
    title = "Studio Canvas",
    statusLabel,
    aspectRatio = "aspect-video",
    background = "#050505",
    className
}: StageContainerProps) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className={cn("flex-1 relative flex items-center justify-center overflow-hidden", className)}>
                <div className="w-full h-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#0F1218] p-4">
                        <div className="w-full h-full flex items-center justify-center">
                            {children}
                        </div>
                    </div>
                    <div className="absolute top-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 shadow-lg transform translate-y-[-150%] group-hover:translate-y-0 transition-transform duration-300">
                        {title}
                    </div>
                </div>
            </section>
        );
    }

    // Desktop Layout (CRT Monitor style)
    return (
        <section className={cn("flex-1 relative flex items-center justify-center bg-transparent overflow-hidden px-4 py-2", className)}>
            {/* CRT Monitor Frame */}
            <div className={cn(
                "relative w-full max-w-[900px] rounded-3xl border-4 border-[#333] shadow-[0_0_0_2px_#111,0_0_40px_rgba(0,0,0,0.5),0_0_100px_rgba(6,182,212,0.05)] overflow-hidden group",
                aspectRatio
            )} style={{ backgroundColor: background }}>

                {/* Screen Bezel/Inner Shadow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />

                {/* CRT Scanline Overlay - Reduced opacity */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,3px_100%]" />

                {/* Subtle Screen Curved Reflection - Reduced opacity and made neutral */}
                <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-10 rounded-2xl" />

                <div className="w-full h-full relative z-10 flex items-center justify-center" style={{ backgroundColor: background }}>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                    <p className="absolute bottom-4 text-cyan-500/20 font-mono text-[10px] uppercase tracking-widest pointer-events-none">{statusLabel}</p>
                </div>
            </div>

            {/* Decorative localized glow under the monitor - Reduced intensity */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/5 blur-[100px] pointer-events-none" />
        </section>
    );
};
