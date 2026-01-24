"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface EditorGridProps {
    topSection: React.ReactNode;
    bottomSection: React.ReactNode;
    floatingControls?: React.ReactNode;
    className?: string;
    topSectionClassName?: string;
    bottomSectionClassName?: string;
    splitRatio?: string; // e.g., "65% 35%"
}

export function EditorGrid({
    topSection,
    bottomSection,
    floatingControls,
    className,
    topSectionClassName,
    bottomSectionClassName,
    splitRatio = "70% 30%",
}: EditorGridProps) {
    return (
        <main
            className={cn("flex flex-1 flex-col overflow-hidden min-w-0 bg-black/20", className)}
            style={{ display: 'grid', gridTemplateRows: splitRatio }}
        >
            {/* Top Section: typically the Stage/Canvas */}
            <div className={cn("flex flex-col h-full overflow-hidden relative", topSectionClassName)}>
                {floatingControls && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-fit">
                        {floatingControls}
                    </div>
                )}
                {topSection}
            </div>

            {/* Bottom Section: typically the Timeline/VisualEditor */}
            <div className={cn("w-full h-full min-w-0 overflow-hidden relative border-t border-white/5 bg-black/20 backdrop-blur-sm", bottomSectionClassName)}>
                {bottomSection}
            </div>
        </main>
    );
}
