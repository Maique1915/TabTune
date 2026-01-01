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
        <nav className="flex-none bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-8 pt-2 px-6">
            <div className="flex items-center justify-center gap-12 max-w-sm mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onPanelChange(item.id)}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="relative p-1">
                            {activePanel === item.id && (
                                <div className="absolute inset-0 bg-primary-mobile/10 dark:bg-white/10 rounded-xl scale-100 transition-transform" />
                            )}
                            <span
                                className={`material-icons-round text-2xl relative z-10 transition-colors ${activePanel === item.id
                                        ? 'text-primary-mobile dark:text-white'
                                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    }`}
                            >
                                {item.icon}
                            </span>
                        </div>
                        <span
                            className={`text-[10px] font-medium transition-colors ${activePanel === item.id
                                    ? 'text-primary-mobile dark:text-white'
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
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
