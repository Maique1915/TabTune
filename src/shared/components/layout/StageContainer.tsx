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
                "relative w-full max-w-[900px] aspect-video rounded-2xl border-[#1a3a3f] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group flex flex-col items-center justify-center",
                aspectRatio
            )}>

                {/* Scanline Overlay */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: `
                            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
                            linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))
                        `,
                        backgroundSize: '100% 3px, 3px 100%'
                    }}
                />

                {/* Screen Bezel/Inner Shadow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />

                <div className="w-full h-full relative z-0 flex items-center justify-center">
                    {children}


                </div>
            </div>
        </section>
    );
};
