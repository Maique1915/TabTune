'use client';

import React, { useState } from 'react';
import { Palette, RotateCcw, ChevronDown, ChevronRight, Sun, Layers, Zap } from 'lucide-react';
import { ScoreStyle, ElementStyle } from '@/lib/tab-editor/types';

interface StyleSidebarProps {
    style: ScoreStyle;
    onChange: (newStyle: Partial<ScoreStyle>) => void;
    onReset: () => void;
}

const StyleSidebar: React.FC<StyleSidebarProps> = ({ style, onChange, onReset }) => {
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    // NoteForge Controls Mapping
    const controls = [
        { label: 'Clefs (Claves)', key: 'clefs' as keyof ScoreStyle },
        { label: 'Time Sig (Compasso)', key: 'timeSignature' as keyof ScoreStyle },
        { label: 'Musical Notes', key: 'notes' as keyof ScoreStyle },
        { label: 'Rests (Pausas)', key: 'rests' as keyof ScoreStyle },
        { label: 'Tab Numbers', key: 'tabNumbers' as keyof ScoreStyle },
        { label: 'Symbols', key: 'symbols' as keyof ScoreStyle },
        { label: 'Staff Lines', key: 'staffLines' as keyof ScoreStyle },
        // Simple strings
        { label: 'Background (Fundo)', key: 'background' as keyof ScoreStyle, simple: true },
        { label: 'Playhead (Tocador)', key: 'playheadColor' as keyof ScoreStyle, simple: true },
        { label: 'Active Note (Nota Ativa)', key: 'activeNoteColor' as keyof ScoreStyle, simple: true },
    ];

    const handleThemeChange = (key: keyof ScoreStyle, value: any) => {
        onChange({ [key]: value });
    };

    const handleNestedChange = (parentKey: keyof ScoreStyle, param: keyof ElementStyle, value: any) => {
        const current = style[parentKey] as ElementStyle;
        onChange({
            [parentKey]: {
                ...current,
                [param]: value
            }
        });
    };

    const toggleExpand = (key: string) => {
        setExpandedKey(prev => prev === key ? null : key);
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
                {controls.map((control) => {
                    const isSimple = (control as any).simple;
                    const value = style[control.key];
                    const isLegacyString = typeof value === 'string' && !isSimple;

                    const colorValue = isSimple || isLegacyString ? String(value) : (value as ElementStyle).color;
                    const opacityValue = isSimple || isLegacyString ? 1 : ((value as ElementStyle).opacity ?? 1);
                    const shadowValue = isSimple || isLegacyString ? false : ((value as ElementStyle).shadow ?? false);

                    const isExpanded = expandedKey === control.key;
                    // Disable expansion if data is legacy string to prevent issues
                    const allowExpand = !isSimple && !isLegacyString;

                    return (
                        <div
                            key={control.key}
                            className={`flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-zinc-900/60 border-pink-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/40'}`}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between p-3 cursor-pointer group"
                                onClick={() => allowExpand && toggleExpand(String(control.key))}
                            >
                                <div className="flex items-center gap-3">
                                    {allowExpand && (
                                        isExpanded ? <ChevronDown className="w-3 h-3 text-pink-400" /> : <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                                    )}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isExpanded ? 'text-pink-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                        {control.label}
                                    </span>
                                </div>
                                <div className="relative group/picker" onClick={(e) => e.stopPropagation()}>
                                    <div
                                        className="w-8 h-8 rounded-full ring-2 ring-zinc-700 overflow-hidden cursor-pointer shadow-sm group-hover/picker:ring-pink-500/50 transition-all"
                                        style={{ backgroundColor: colorValue }}
                                    >
                                        <input
                                            type="color"
                                            value={colorValue}
                                            onChange={(e) => {
                                                if (isSimple || isLegacyString) handleThemeChange(control.key, e.target.value);
                                                else handleNestedChange(control.key, 'color', e.target.value);
                                            }}
                                            className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content (Submenu) */}
                            {isExpanded && allowExpand && (
                                <div className="px-3 pb-3 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="h-px w-full bg-zinc-800/50 mb-2" />

                                    {/* Opacity Control */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sun className="w-3 h-3 text-zinc-500" />
                                                <span className="text-[10px] font-semibold text-zinc-400">OPACITY</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500">
                                                {Math.round(opacityValue * 100)}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={opacityValue}
                                            onChange={(e) => handleNestedChange(control.key, 'opacity', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
                                        />
                                    </div>

                                    {/* Shadow Control */}
                                    <div className="flex items-center justify-between bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/50">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3 h-3 text-zinc-500" />
                                            <span className="text-[10px] font-semibold text-zinc-400">SHADOW</span>
                                        </div>
                                        <button
                                            onClick={() => handleNestedChange(control.key, 'shadow', !shadowValue)}
                                            className={`w-8 h-4 rounded-full transition-colors relative ${shadowValue ? 'bg-pink-500/20' : 'bg-zinc-800'
                                                }`}
                                        >
                                            <div className={`absolute top-0.5 bottom-0.5 w-3 h-3 rounded-full transition-all duration-300 ${shadowValue
                                                    ? 'left-[18px] bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]'
                                                    : 'left-0.5 bg-zinc-600'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legacy/Motion Controls Hint (Optional) */}
            <div className="mt-auto pt-4 border-t border-zinc-800/30 text-center">
                <p className="text-[9px] text-zinc-600 font-mono">NoteForge Styling Engine Active</p>
            </div>
        </aside>
    );
};

export default StyleSidebar;
