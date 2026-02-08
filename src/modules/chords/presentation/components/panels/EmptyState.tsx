import React from 'react';
import { cn } from '@/shared/lib/utils';

interface EmptyStateProps {
    icon: any;
    title: string;
    description: string;
    features?: string[];
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    features,
    actionLabel,
    onAction,
    className
}) => {
    return (
        <div className={cn("flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 animate-in fade-in zoom-in-95 duration-500", className)}>
            <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-1">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{title}</h4>
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed max-w-[180px]">
                    {description}
                </p>
            </div>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold hover:bg-primary/20 transition-all uppercase tracking-widest"
                >
                    {actionLabel}
                </button>
            )}

            {features && features.length > 0 && (
                <div className="pt-4 grid grid-cols-1 gap-2 w-full max-w-[160px]">
                    <div className="h-px bg-zinc-800/50 w-full mb-2" />
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[8px] text-zinc-700 font-bold uppercase tracking-tighter text-left">
                            <div className="w-1 h-1 rounded-full bg-cyan-500/40 shrink-0" />
                            {f}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
