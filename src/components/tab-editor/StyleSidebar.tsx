'use client';

import React, { useState } from 'react';
import { Palette, RotateCcw, ChevronDown, ChevronRight, Sun, Layers, Zap } from 'lucide-react';
import { ScoreStyle, ElementStyle } from '@/lib/tab-editor/types';

interface StyleSidebarProps {
    style: ScoreStyle;
    onChange: (newStyle: Partial<ScoreStyle>) => void;
    onReset: () => void;
}

const PRESET_THEMES = {
    default: {
        label: 'Default Dark',
        style: {
            // NoteForge Defaults (Dark)
            clefs: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
            timeSignature: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
            notes: { color: '#00e5ff', opacity: 1, shadow: true, shadowColor: '#00e5ff', shadowBlur: 15 },
            rests: { color: '#00e5ff', opacity: 1, shadow: false, shadowColor: '#00e5ff', shadowBlur: 10 },
            tabNumbers: { color: '#00e5ff', opacity: 1, shadow: false, shadowColor: '#00e5ff', shadowBlur: 10 },
            symbols: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
            staffLines: { color: '#3f3f46', opacity: 1, shadow: false, shadowColor: '#3f3f46', shadowBlur: 5 },
            background: '#09090b',
            playheadColor: '#06b6d4',
            activeNoteColor: '#22d3ee',
        }
    },
    classic: {
        label: 'Classic Sheet',
        style: {
            clefs: { color: '#000000', opacity: 1, shadow: false },
            timeSignature: { color: '#000000', opacity: 1, shadow: false },
            notes: { color: '#000000', opacity: 1, shadow: false },
            rests: { color: '#000000', opacity: 1, shadow: false },
            tabNumbers: { color: '#000000', opacity: 1, shadow: false },
            symbols: { color: '#000000', opacity: 1, shadow: false },
            staffLines: { color: '#666666', opacity: 1, shadow: false },
            background: '#ffffff',
            playheadColor: '#2563eb', // Blue playhead
            activeNoteColor: '#ef4444', // Red active note
        }
    },
    cyberpunk: {
        label: 'Cyberpunk',
        style: {
            clefs: { color: '#fb00ff', opacity: 1, shadow: true, shadowColor: '#fb00ff', shadowBlur: 15 },
            timeSignature: { color: '#fb00ff', opacity: 1, shadow: true, shadowColor: '#fb00ff', shadowBlur: 15 },
            notes: { color: '#00ff9d', opacity: 1, shadow: true, shadowColor: '#00ff9d', shadowBlur: 20 },
            rests: { color: '#00ff9d', opacity: 1, shadow: true, shadowColor: '#00ff9d', shadowBlur: 10 },
            tabNumbers: { color: '#00ff9d', opacity: 1, shadow: true, shadowColor: '#00ff9d', shadowBlur: 15 },
            symbols: { color: '#fffb00', opacity: 1, shadow: true, shadowColor: '#fffb00', shadowBlur: 10 },
            staffLines: { color: '#2d0036', opacity: 1, shadow: false },
            background: '#1a0b1f',
            playheadColor: '#fb00ff',
            activeNoteColor: '#fffb00',
        }
    },
    vintage: {
        label: 'Vintage',
        style: {
            clefs: { color: '#5c4033', opacity: 0.9, shadow: false },
            timeSignature: { color: '#5c4033', opacity: 0.9, shadow: false },
            notes: { color: '#4a3b2a', opacity: 1, shadow: false },
            rests: { color: '#4a3b2a', opacity: 1, shadow: false },
            tabNumbers: { color: '#4a3b2a', opacity: 1, shadow: false },
            symbols: { color: '#8b4513', opacity: 0.9, shadow: false },
            staffLines: { color: '#a68b6c', opacity: 0.6, shadow: false },
            background: '#efe6d5',
            playheadColor: '#cd853f',
            activeNoteColor: '#8b4513',
        }
    }
};

const StyleSidebar: React.FC<StyleSidebarProps> = ({ style, onChange, onReset }) => {
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');

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

    const renderBasicTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(PRESET_THEMES).map(([key, theme]) => (
                    <div
                        key={key}
                        onClick={() => onChange(theme.style as any)}
                        className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 hover:border-pink-500/50 cursor-pointer transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.style.background }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: (theme.style.notes as any).color, boxShadow: (theme.style.notes as any).shadow ? `0 0 10px ${(theme.style.notes as any).color}` : 'none' }}></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-pink-400 transition-colors uppercase tracking-wider">{theme.label}</h3>
                                <p className="text-[9px] text-zinc-500">Click to apply preset</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAdvancedTab = () => (
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
                                <div className="space-y-3 p-3 bg-zinc-950/30 rounded-lg border border-zinc-800/50">
                                    <div className="flex items-center justify-between">
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

                                    {shadowValue && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-1 pt-2 border-t border-zinc-800/50">
                                            {/* Shadow Color */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-medium text-zinc-500 uppercase">Color</span>
                                                <div className="relative group/picker">
                                                    <div
                                                        className="w-6 h-6 rounded-full ring-1 ring-zinc-700 overflow-hidden cursor-pointer shadow-sm group-hover/picker:ring-pink-500/50 transition-all"
                                                        style={{ backgroundColor: (value as ElementStyle).shadowColor || colorValue }}
                                                    >
                                                        <input
                                                            type="color"
                                                            value={(value as ElementStyle).shadowColor || colorValue}
                                                            onChange={(e) => handleNestedChange(control.key, 'shadowColor', e.target.value)}
                                                            className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shadow Blur */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-medium text-zinc-500 uppercase">Blur Size</span>
                                                    <span className="text-[9px] font-mono text-zinc-500">{(value as ElementStyle).shadowBlur ?? 10}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    step="1"
                                                    value={(value as ElementStyle).shadowBlur ?? 10}
                                                    onChange={(e) => handleNestedChange(control.key, 'shadowBlur', parseInt(e.target.value))}
                                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderMotionTab = () => (
        <div className="space-y-6">
            <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Transition Type</span>
                <div className="grid grid-cols-2 gap-2">
                    {['snap', 'slide', 'fade', 'assemble'].map((type) => (
                        <button
                            key={type}
                            onClick={() => onChange({ transitionType: type as any })}
                            className={`p-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${style.transitionType === type
                                ? 'bg-pink-500/10 border-pink-500/50 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Animation Speed</span>
                    <span className="text-[10px] font-mono text-zinc-500">Normal</span> {/* Placeholder label */}
                </div>
                {/* Placeholder for speed - currently not in Styles but useful conceptually */}
                <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-600 italic">Coming soon via Motion Engine</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Scale</span>
                    <span className="text-[10px] font-mono text-zinc-500">{style.scale || 1}x</span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={style.scale || 1}
                    onChange={(e) => onChange({ scale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
                />
            </div>
        </div>
    );

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
                {(['basic', 'advanced', 'motion'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === tab
                            ? 'bg-zinc-800 text-pink-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'basic' && renderBasicTab()}
                {activeTab === 'advanced' && renderAdvancedTab()}
                {activeTab === 'motion' && renderMotionTab()}
            </div>

            {/* Legacy/Motion Controls Hint (Optional) */}
            <div className="mt-auto pt-4 border-t border-zinc-800/30 text-center">
                <p className="text-[9px] text-zinc-600 font-mono">NoteForge Styling Engine Active</p>
            </div>
        </aside>
    );
};

export default StyleSidebar;
