"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface WorkspaceLayoutProps {
    header?: React.ReactNode;
    leftSidebar?: React.ReactNode;
    rightSidebar?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    mobileHeader?: React.ReactNode;
    mobileBottomNav?: React.ReactNode;
    isMobile?: boolean;
}

export function WorkspaceLayout({
    header,
    leftSidebar,
    rightSidebar,
    children,
    className,
    mobileHeader,
    mobileBottomNav,
    isMobile = false,
}: WorkspaceLayoutProps) {
    if (isMobile) {
        return (
            <div className="flex h-screen w-full flex-col bg-background text-foreground antialiased selection:bg-cyan-500/30">
                {mobileHeader}
                <main className="flex-1 relative overflow-hidden flex flex-col">
                    {children}
                </main>
                {leftSidebar}
                {rightSidebar}
                {mobileBottomNav}
            </div>
        );
    }

    return (
        <div className={cn(
            "flex h-screen w-full flex-col bg-gradient-to-br from-[#120621] via-[#0a0510] to-black text-foreground relative overflow-hidden",
            className
        )}>
            {/* Retro Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,6px_100%] pointer-events-none z-0" />

            {header}

            <div className="relative z-10 flex flex-1 overflow-hidden">
                {leftSidebar}
                {children}
                {rightSidebar}
            </div>
        </div>
    );
}
