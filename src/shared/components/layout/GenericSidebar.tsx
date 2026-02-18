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
        "flex flex-col z-20 transition-all duration-500 ease-in-out backdrop-blur-2xl bg-background-dark/40 border-r border-white/[0.05] shadow-2xl",
        isMobile
            ? cn(
                "fixed inset-x-0 bottom-0 h-[70vh] rounded-t-[32px] border-t border-white/[0.08] shadow-[0_-10px_40px_rgba(0,0,0,0.6)]",
                isOpen ? "translate-y-0" : "translate-y-full"
            )
            : cn(
                "relative w-[400px] h-full",
                isRight ? "border-l shadow-[-10px_0_40px_rgba(0,0,0,0.4)]" : "border-r shadow-[10px_0_40px_rgba(0,0,0,0.4)]"
            ),
        className
    );

    return (
        <aside className={rootClasses}>
            {/* Header / Grabber for mobile */}
            {isMobile && (
                <div className="w-full flex justify-center pt-4 pb-2 cursor-pointer" onClick={onClose}>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
                </div>
            )}

            {/* Main Header - only render if title and icon are provided */}
            {title && Icon && (
                <div className="flex items-center justify-between p-8 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-2xl shadow-inner-glow border border-primary/20 transition-all duration-500 hover:scale-110">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase">{title}</h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">{t('generic.engine')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {headerAction}
                        {onReset && (
                            <button
                                onClick={onReset}
                                className="p-2.5 bg-white/[0.03] hover:bg-primary/10 rounded-xl text-slate-400 hover:text-primary border border-white/[0.05] hover:border-primary/30 transition-all duration-500 shadow-lg"
                                title={t('generic.reset')}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                        {isMobile && onClose && (
                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white/[0.03] rounded-xl text-slate-400 hover:text-white border border-white/[0.05] transition-all duration-500 shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Tab Switcher */}
            {tabs && activeTab && onTabChange && (
                <div className="px-8 mb-6">
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.05] backdrop-blur-md shadow-inner-glow">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex-1 py-2 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all duration-500",
                                    activeTab === tab.id
                                        ? "bg-primary/10 text-primary shadow-premium-glow ring-1 ring-primary/20"
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={cn("flex-1 overflow-y-auto pb-6 custom-scrollbar px-1", contentClassName)}>
                {children}
            </div>

            {/* Footer */}
            {footer ? (
                <div className="mt-auto p-6 border-t border-white/[0.05] bg-white/[0.01] backdrop-blur-md">
                    {footer}
                </div>
            ) : (
                <div className="mt-auto pt-6 pb-8 border-t border-white/[0.03] text-center bg-white/[0.01]">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] opacity-40">{t('generic.active')}</p>
                </div>
            )}
        </aside>
    );
};
