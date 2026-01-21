import React from 'react';
import Link from 'next/link';

interface MobileHeaderProps {
    title?: string;
    onSettingsClick?: () => void;
    showSettings?: boolean;
    showBack?: boolean;
    onBackClick?: () => void;
}

export function MobileHeader({
    title = 'TabTune',
    onSettingsClick,
    showSettings = false,
    showBack = false,
    onBackClick
}: MobileHeaderProps) {
    return (
        <header className="flex-none px-6 pt-12 pb-6 flex items-center justify-between z-20 bg-zinc-950/40 backdrop-blur-lg border-b border-zinc-900/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/10 rounded-2xl border border-pink-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                    <span className="material-icons-round text-pink-400 text-2xl">
                        music_note
                    </span>
                </div>
                <h1 className="text-lg font-black tracking-[0.15em] text-zinc-100 uppercase">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                {showSettings && (
                    <button
                        onClick={onSettingsClick}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-all active:scale-90"
                    >
                        <span className="material-icons-round text-xl">
                            settings
                        </span>
                    </button>
                )}
                {showBack && (
                    <Link href="/">
                        <button
                            onClick={onBackClick}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-all active:scale-90"
                        >
                            <span className="material-icons-round text-xl">
                                arrow_back
                            </span>
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
