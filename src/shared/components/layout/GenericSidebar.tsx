'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { RotateCcw, X } from 'lucide-react';

interface GenericSidebarProps {
    children: React.ReactNode;
    title: string;
    icon: React.ElementType;
    onReset?: () => void;
    tabs?: { id: string; label: string }[];
    activeTab?: string;
    onTabChange?: (tabId: any) => void;
    footer?: React.ReactNode;
    // Mobile / Overlay props
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    // Layout props
    side?: 'left' | 'right';
    className?: string;
    contentClassName?: string;
    headerAction?: React.ReactNode;
}

export const GenericSidebar: React.FC<GenericSidebarProps> = ({
    children,
    title,
    icon: Icon,
    onReset,
    tabs,
    activeTab,
    onTabChange,
    footer,
    isMobile = false,
    isOpen = true,
    onClose,
    side = 'right',
    className,
    contentClassName,
    headerAction
}) => {
    const isRight = side === 'right';

    const rootClasses = cn(
        "bg-[#0d0d0f] flex flex-col z-20 transition-all duration-300 ease-in-out",
        isMobile
            ? cn(
                "fixed inset-x-0 bottom-0 h-[70vh] rounded-t-2xl border-t border-zinc-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
                isOpen ? "translate-y-0" : "translate-y-full"
            )
            : cn(
                "relative w-80 h-full",
                isRight ? "border-l border-zinc-800/50 shadow-[-5px_0_30px_rgba(0,0,0,0.5)]" : "border-r border-zinc-800/50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
            ),
        className
    );

    return (
        <aside className={rootClasses}>
            {/* Header / Grabber for mobile */}
            {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
                </div>
            )}

            {/* Main Header */}
            <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                        <Icon className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">{title}</h1>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">NoteForge Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {headerAction}
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="p-2 bg-zinc-900/50 hover:bg-pink-500/10 rounded-lg text-zinc-500 hover:text-pink-400 border border-zinc-800 hover:border-pink-500/30 transition-all"
                            title="Reset Defaults"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 bg-zinc-900/50 rounded-lg text-zinc-500 hover:text-white border border-zinc-800 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Switcher */}
            {tabs && activeTab && onTabChange && (
                <div className="px-6 mb-4">
                    <div className="flex bg-zinc-950/50 p-1 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-zinc-800/80 text-pink-400 shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-pink-500/20"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={cn("flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar", contentClassName)}>
                {children}
            </div>

            {/* Footer */}
            {footer ? (
                <div className="mt-auto p-4 border-t border-zinc-800/30 bg-zinc-950/20">
                    {footer}
                </div>
            ) : (
                <div className="mt-auto pt-4 pb-6 border-t border-zinc-800/30 text-center">
                    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em] opacity-50">NoteForge Active</p>
                </div>
            )}
        </aside>
    );
};
