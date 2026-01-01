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
        <header className="flex-none px-6 pt-12 pb-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary-mobile dark:text-white text-3xl">
                    music_note
                </span>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                    {title}
                </h1>
            </div>
            {showSettings && (
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-icons-round text-gray-600 dark:text-gray-400">
                        settings
                    </span>
                </button>
            )}
            {showBack && (
                <Link href="/">
                    <button
                        onClick={onBackClick}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-icons-round text-gray-600 dark:text-gray-400">
                            arrow_back
                        </span>
                    </button>
                </Link>
            )}
        </header>
    );
}
