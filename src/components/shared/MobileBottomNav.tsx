import React from 'react';

interface MobileBottomNavProps {
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    onPanelChange: (panel: 'studio' | 'library' | 'mixer' | 'customize') => void;
    onAddClick?: () => void;
}

export function MobileBottomNav({
    activePanel,
    onPanelChange,
    onAddClick
}: MobileBottomNavProps) {
    const navItems = [
        { id: 'library' as const, icon: 'library_music', label: 'Library' },
        { id: 'customize' as const, icon: 'palette', label: 'Customize' },
    ];

    return (
        <nav className="flex-none bg-zinc-950/60 backdrop-blur-xl border-t border-zinc-900/80 pb-8 pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-center gap-12 max-w-sm mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onPanelChange(item.id)}
                        className="flex flex-col items-center gap-1 group transition-all duration-300 relative"
                    >
                        <div className="relative p-1.5 rounded-xl transition-all duration-300">
                            {activePanel === item.id && (
                                <div className="absolute inset-0 bg-pink-500/10 rounded-xl animate-in fade-in zoom-in-95 duration-300 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]" />
                            )}
                            <span
                                className={`material-icons-round text-2xl relative z-10 transition-all duration-300 ${activePanel === item.id
                                    ? 'text-pink-400 scale-110'
                                    : 'text-zinc-500 group-hover:text-zinc-300'
                                    }`}
                            >
                                {item.icon}
                            </span>
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${activePanel === item.id
                                ? 'text-pink-400'
                                : 'text-zinc-500 group-hover:text-zinc-300'
                                }`}
                        >
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
