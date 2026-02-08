'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { RotateCcw, X } from 'lucide-react';
import { useTranslation } from "@/modules/core/presentation/context/translation-context";

interface GenericSidebarProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ElementType;
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
    const { t } = useTranslation();
    const isRight = side === 'right';

    const rootClasses = cn(
        "flex flex-col z-20 transition-all duration-300 ease-in-out backdrop-blur-xl bg-[#162a2d]/90 border-r border-white/10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]",
        isMobile
            ? cn(
                "fixed inset-x-0 bottom-0 h-[70vh] rounded-t-2xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
                isOpen ? "translate-y-0" : "translate-y-full"
            )
            : cn(
                "relative w-80 h-full",
                isRight ? "border-l shadow-[-5px_0_30px_rgba(0,0,0,0.5)]" : "border-r shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
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

            {/* Main Header - only render if title and icon are provided */}
            {title && Icon && (
                <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(7,182,213,0.2)]">
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">{title}</h1>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{t('generic.engine')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {headerAction}
                        {onReset && (
                            <button
                                onClick={onReset}
                                className="p-2 bg-white/5 hover:bg-primary/10 rounded-lg text-zinc-500 hover:text-primary border border-white/5 hover:border-primary/30 transition-all"
                                title={t('generic.reset')}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                        {isMobile && onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 rounded-lg text-zinc-500 hover:text-white border border-white/5 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Tab Switcher */}
            {tabs && activeTab && onTabChange && (
                <div className="px-6 mb-4">
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-primary/20 text-primary shadow-lg border border-primary/20"
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
            <div className={cn("flex-1 overflow-y-auto pb-4 custom-scrollbar", contentClassName)}>
                {children}
            </div>

            {/* Footer */}
            {footer ? (
                <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
                    {footer}
                </div>
            ) : (
                <div className="mt-auto pt-4 pb-6 border-t border-zinc-800/30 text-center">
                    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em] opacity-50">{t('generic.active')}</p>
                </div>
            )}
        </aside>
    );
};
