import React from 'react';
import { Guitar, Clock, Wrench } from 'lucide-react';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';

interface SubTabNavigationProps {
    activeCategory: string;
    onSelect: (category: string) => void;
}

export const SubTabNavigation: React.FC<SubTabNavigationProps> = ({ activeCategory, onSelect }) => {
    const { t } = useTranslation();
    const tabs = [
        { id: 'editor', label: t('editor.fretboard'), icon: Guitar },
        { id: 'rhythm', label: t('editor.duration'), icon: Clock },
        { id: 'tools', label: t('editor.actions'), icon: Wrench },
    ];

    return (
        <div className="px-5 pt-5 pb-2">
            <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-gradient-to-b from-black/40 to-black/20 p-1 shadow-[inset_0_0_24px_rgba(0,0,0,0.55)]">
                {tabs.map((tab) => {
                    const isActive = activeCategory === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onSelect(tab.id)}
                            className={`group relative flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isActive
                                ? 'bg-primary/20 text-primary border border-primary/30 shadow-cyan-glow'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {tab.label}
                            <span className={`absolute -bottom-1 left-1/2 h-[1px] w-6 -translate-x-1/2 rounded-full transition-all ${isActive ? 'bg-primary shadow-cyan-glow' : 'bg-transparent'}`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
