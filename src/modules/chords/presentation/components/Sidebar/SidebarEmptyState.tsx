import React from 'react';

interface SidebarEmptyStateProps {
    icon: any;
    title: string;
    description: string;
    features?: string[];
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'beats';
}

export const SidebarEmptyState = ({
    icon: Icon,
    title,
    description,
    features,
    actionLabel,
    onAction,
    variant = 'default'
}: SidebarEmptyStateProps) => {
    if (variant === 'beats') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-zinc-950/20 rounded-3xl border border-dashed border-white/5">
                <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-xl">
                    <Icon className="w-8 h-8 text-zinc-600" />
                </div>
                <h4 className="text-zinc-400 font-bold mb-2">{title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-[200px] mb-6">{description}</p>

                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="mb-6 px-6 py-2.5 rounded-xl bg-primary text-black text-[10px] font-black hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase tracking-wider active:scale-95"
                    >
                        {actionLabel}
                    </button>
                )}

                {features && (
                    <div className="flex flex-wrap justify-center gap-2 opacity-50">
                        {features.map((f, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-tight">{f}</span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default variant (Short/Full)
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-1">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{title}</h4>
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed max-w-[180px]">
                    {description}
                </p>
            </div>
            {features && (
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
