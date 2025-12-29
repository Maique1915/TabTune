'use client';

import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { ScoreStyle } from '@/lib/tab-editor/types';

interface StyleSidebarProps {
    style: ScoreStyle;
    onChange: (newStyle: Partial<ScoreStyle>) => void;
    onReset: () => void;
}

const StyleSidebar: React.FC<StyleSidebarProps> = ({ style, onChange, onReset }) => {
    // NoteForge Controls Mapping
    const controls = [
        { label: 'Clefs (Claves)', key: 'clefs' as keyof ScoreStyle },
        { label: 'Time Sig (Compasso)', key: 'timeSignature' as keyof ScoreStyle },
        { label: 'Musical Notes', key: 'notes' as keyof ScoreStyle },
        { label: 'Rests (Pausas)', key: 'rests' as keyof ScoreStyle },
        { label: 'Tab Numbers', key: 'tabNumbers' as keyof ScoreStyle },
        { label: 'Symbols', key: 'symbols' as keyof ScoreStyle },
        { label: 'Staff Lines', key: 'staffLines' as keyof ScoreStyle },
        { label: 'Background (Fundo)', key: 'background' as keyof ScoreStyle },
        { label: 'Playhead (Tocador)', key: 'playheadColor' as keyof ScoreStyle },
    ];

    const handleThemeChange = (key: keyof ScoreStyle, value: string) => {
        onChange({ [key]: value });
    };

    return (
        <aside className="w-80 border-l border-zinc-800/50 bg-[#0d0d0f] p-6 flex flex-col gap-6 z-10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <Palette className="w-5 h-5 text-pink-400" />
                    </div>
                    <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">Customize</h1>
                </div>
                <button
                    onClick={onReset}
                    className="p-2 bg-pink-500/10 rounded-lg text-pink-400 hover:bg-pink-500/20 transition-all"
                    title="Reset Defaults"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 mb-4">
                <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-zinc-800 rounded-md shadow-sm">Styles</button>
                <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 cursor-not-allowed opacity-50">Motion</button>
                <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 cursor-not-allowed opacity-50">Canvas</button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 max-h-[calc(100vh-250px)] custom-scrollbar">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Notation Components</p>
                {controls.map((control) => (
                    <div
                        key={control.key}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/40 transition-all cursor-pointer group"
                    >
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-zinc-200 transition-colors">
                            {control.label}
                        </span>
                        <div className="relative group/picker">
                            <div
                                className="w-8 h-8 rounded-full ring-2 ring-zinc-700 overflow-hidden cursor-pointer shadow-sm group-hover/picker:ring-pink-500/50 transition-all"
                                style={{ backgroundColor: String(style[control.key]) }}
                            >
                                <input
                                    type="color"
                                    value={String(style[control.key])}
                                    onChange={(e) => handleThemeChange(control.key, e.target.value)}
                                    className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legacy/Motion Controls Hint (Optional) */}
            <div className="mt-auto pt-4 border-t border-zinc-800/30 text-center">
                <p className="text-[9px] text-zinc-600 font-mono">NoteForge Styling Engine Active</p>
            </div>
        </aside>
    );
};

export default StyleSidebar;
