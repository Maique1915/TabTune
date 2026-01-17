"use client"

import React, { useState, useEffect } from 'react';
import { ChordDiagram } from '@/components/studio/chord-diagram';
import { notes, complements, basses, extensions } from '@/modules/core/domain/chord-logic';
import { transpose } from '@/modules/core/domain/chord-logic';
import type { ChordDiagramProps, Achord, nutForm } from '@/modules/core/domain/types';
import { useAppContext, AppProvider } from '@/app/context/app--context';
import { ArrowLeft, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { INSTRUMENTS } from '@/lib/instruments';
import { MobileHeader } from '@/components/shared/MobileHeader';

const ChordCreatorContent = () => {
    const { colors } = useAppContext();
    const [mounted, setMounted] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [selectedInstrumentId, setSelectedInstrumentId] = useState('violao');
    const [selectedTuningIndex, setSelectedTuningIndex] = useState(0);

    const selectedInstrument = INSTRUMENTS.find(i => i.id === selectedInstrumentId) || INSTRUMENTS[0];
    const currentTuning = selectedInstrument.tunings[selectedTuningIndex];

    const [chordState, setChordState] = useState<ChordDiagramProps>({
        stringNames: currentTuning,
        chord: { note: 4, complement: 0, extension: [], bass: 0 },
        positions: { 2: [2, 2], 3: [2, 3], 4: [1, 1] },
        avoid: [],
        nut: { vis: false, str: [1, currentTuning.length], pos: 0, fin: 0, trn: 1 },
        origin: 4,
        unique: false,
    });

    const [transposition, setTransposition] = useState(0);
    const [previewChord, setPreviewChord] = useState<ChordDiagramProps>(chordState);

    useEffect(() => {
        if (!mounted) return;
        if (transposition === 0) {
            setPreviewChord(chordState);
        } else {
            if (chordState.chord) {
                const targetNoteIndex = (chordState.chord.note + transposition + 12) % 12;
                const transposed = transpose(chordState, {
                    ...chordState.chord,
                    note: targetNoteIndex
                });
                setPreviewChord(transposed);
            }
        }
    }, [chordState, transposition, mounted]);

    const handleChordChange = (field: keyof Achord, value: any) => {
        setChordState(prev => ({
            ...prev,
            chord: { ...prev.chord!, [field]: value }
        }));
    };

    const handlePositionChange = (string: number, valueIndex: number, value: number) => {
        setChordState(prev => {
            const newPositions = { ...prev.positions };
            const current = newPositions[string] || [0, 0];
            const next = [...current] as [number, number];
            next[valueIndex] = value;
            newPositions[string] = next;
            return { ...prev, positions: newPositions };
        });
    };

    const handleNutChange = (field: keyof nutForm, value: any) => {
        setChordState(prev => {
            if (!prev.nut) return prev;
            return {
                ...prev,
                nut: { ...prev.nut, [field]: value }
            };
        });
    };

    const handleInstrumentChange = (instrumentId: string) => {
        const inst = INSTRUMENTS.find(i => i.id === instrumentId) || INSTRUMENTS[0];
        setSelectedInstrumentId(instrumentId);
        setSelectedTuningIndex(0);
        setChordState(prev => ({
            ...prev,
            stringNames: inst.tunings[0],
            positions: {},
            avoid: [],
            nut: { ...prev.nut!, str: [1, inst.tunings[0].length] }
        }));
    };

    const [tuningShift, setTuningShift] = useState(0);

    const handleTuningChange = (index: number) => {
        setSelectedTuningIndex(index);
        const newTuning = selectedInstrument.tunings[index];
        setChordState(prev => ({
            ...prev,
            stringNames: newTuning,
            positions: {},
            avoid: [],
            nut: { ...prev.nut!, str: [1, newTuning.length] }
        }));
    };

    const handleTuningShiftChange = (shift: number) => {
        if (shift < -5 || shift > 11) return;
        setTuningShift(shift);
        // Pass full shift value to capo property (positive or negative)
        setChordState(prev => ({
            ...prev,
            capo: shift
        }));
    };

    if (!mounted) {
        return <div className="h-screen bg-black" />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#050505] overflow-hidden text-zinc-300">
            {/* Mobile Header */}
            {isMobile && !isMenuOpen && (
                <MobileHeader title="Chord Creator" showBack={true} />
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Form */}
                <div className={cn(
                    "h-full bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden",
                    isMobile ? (isMenuOpen ? "w-full absolute z-50" : "w-0") : "w-[400px]"
                )}>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <div className="flex items-center gap-3">
                            {!isMobile && (
                                <Link href="/studio">
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                </Link>
                            )}
                            <h1 className="font-black tracking-widest text-sm uppercase">Chord Creator</h1>
                        </div>
                        {isMobile && (
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Instrument Selection */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Instrument & Tuning</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Instrument</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedInstrumentId}
                                            onChange={(e) => handleInstrumentChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                        >
                                            {INSTRUMENTS.map(inst => (
                                                <option key={inst.id} value={inst.id} className="bg-zinc-950">{inst.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Tuning</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedTuningIndex}
                                            onChange={(e) => handleTuningChange(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                        >
                                            {selectedInstrument.tunings.map((tuning: string[], i: number) => (
                                                <option key={i} value={i} className="bg-zinc-950">{tuning.join(' ')}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-1.5">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Tuning Shift / Capo</label>
                                <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800/50">
                                    <button
                                        onClick={() => handleTuningShiftChange(tuningShift - 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 flex flex-col items-center">
                                        <span className={cn(
                                            "text-xs font-black tracking-wider",
                                            tuningShift > 0 ? "text-pink-500" :
                                                tuningShift < 0 ? "text-blue-500" : "text-zinc-500"
                                        )}>
                                            {tuningShift > 0 ? `CAPO ${tuningShift}` :
                                                tuningShift < 0 ? `DOWN ${Math.abs(tuningShift)}` : "STANDARD"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleTuningShiftChange(0)}
                                        className="text-[9px] font-bold text-zinc-600 hover:text-zinc-400 px-2 py-1"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => handleTuningShiftChange(tuningShift + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Basic Info */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Basic Definition</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Root</label>
                                    <select
                                        value={chordState.chord?.note ?? 0}
                                        onChange={(e) => handleChordChange('note', parseInt(e.target.value))}
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-pink-500/30"
                                    >
                                        {notes.map((note, i) => <option key={i} value={i} className="bg-zinc-950">{note}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Quality</label>
                                    <select
                                        value={chordState.chord?.complement ?? 0}
                                        onChange={(e) => handleChordChange('complement', parseInt(e.target.value))}
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-pink-500/30"
                                    >
                                        {complements.map((c, i) => <option key={i} value={i} className="bg-zinc-950">{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Origin</label>
                                    <select
                                        value={chordState.origin}
                                        onChange={(e) => setChordState(prev => ({ ...prev, origin: parseInt(e.target.value) }))}
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-pink-500/30"
                                    >
                                        {notes.map((note, i) => <option key={i} value={i} className="bg-zinc-950">{note}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Extensions */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Extensions</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "5", value: "5" },
                                    { label: "6", value: "6" },
                                    { label: "7", value: "7" },
                                    { label: "7+", value: "7+" },
                                    { label: "9", value: "9" },
                                    { label: "11", value: "11" },
                                    { label: "13", value: "13" },
                                ].map((ext) => {
                                    // Current indices -> string extensions
                                    const currentExts = (chordState.chord?.extension || []).map(idx => extensions[idx]);

                                    // Find if any variant of this extension is active
                                    const activeVariant = currentExts.find(e => e.endsWith(ext.value) && (e === ext.value || e === `b${ext.value}` || e === `#${ext.value}`));
                                    const isActive = !!activeVariant;
                                    const currentModifier = activeVariant?.startsWith('b') ? 'b' : activeVariant?.startsWith('#') ? '#' : 'none';

                                    const updateExtensions = (newExtStrings: string[]) => {
                                        // Map back to indices
                                        const newIndices = newExtStrings.map(s => extensions.indexOf(s)).filter(i => i !== -1);
                                        handleChordChange('extension', newIndices);
                                    };

                                    if (isActive) {
                                        return (
                                            <div key={ext.value} className="flex items-center bg-pink-500/10 border border-pink-500/30 rounded-xl overflow-hidden transition-all shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                                {/* Flat Modifier Toggle */}
                                                <button
                                                    onClick={(e) => {
                                                        const others = currentExts.filter(e => e !== activeVariant);
                                                        // If current is 'b', clicking 'b' again should probably toggle off modifier? Sidebar logic says toggle if matches.
                                                        // Let's mimic Sidebar: if modifiers match, switch to plain. If diff, switch to modifier.
                                                        // Sidebar code: newExt = currentModifier === 'b' ? ext.value : `b${ext.value}`;
                                                        updateExtensions(currentModifier === 'b' ? [...others, ext.value] : [...others, `b${ext.value}`]);
                                                    }}
                                                    className={cn(
                                                        "px-2 py-1.5 text-[10px] font-bold hover:bg-pink-500/20 transition-colors border-r border-pink-500/10",
                                                        currentModifier === 'b' ? 'text-pink-400' : 'text-zinc-600 hover:text-zinc-400'
                                                    )}
                                                >
                                                    b
                                                </button>

                                                {/* Main Label */}
                                                <button
                                                    onClick={() => {
                                                        const others = currentExts.filter(e => e !== activeVariant);
                                                        updateExtensions(others);
                                                    }}
                                                    className="px-2 py-1.5 text-[10px] font-black text-pink-400 hover:bg-pink-500/20 transition-colors border-x border-pink-500/10"
                                                >
                                                    {ext.label}
                                                </button>

                                                {/* Sharp Modifier Toggle */}
                                                <button
                                                    onClick={() => {
                                                        const others = currentExts.filter(e => e !== activeVariant);
                                                        updateExtensions(currentModifier === '#' ? [...others, ext.value] : [...others, `#${ext.value}`]);
                                                    }}
                                                    className={cn(
                                                        "px-2 py-1.5 text-[10px] font-bold hover:bg-pink-500/20 transition-colors border-l border-pink-500/10",
                                                        currentModifier === '#' ? 'text-pink-400' : 'text-zinc-600 hover:text-zinc-400'
                                                    )}
                                                >
                                                    #
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            key={ext.value}
                                            onClick={() => updateExtensions([...currentExts, ext.value])}
                                            className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-zinc-500 text-[10px] font-bold hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                                        >
                                            {ext.label}
                                        </button>
                                    );
                                })}
                            </div>

                        </section>

                        {/* Positions */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Positions & Fingers</h3>
                            <div className="space-y-3">
                                {(chordState.stringNames || ["E", "A", "D", "G", "B", "e"]).map((name, i) => {
                                    const stringNum = i + 1;
                                    return (
                                        <div key={i} className="grid grid-cols-12 gap-3 items-center bg-zinc-900/30 p-2 rounded-xl border border-zinc-800/30">
                                            <div className="col-span-2 text-center">
                                                <span className="text-[10px] font-black text-pink-500">{name}</span>
                                            </div>
                                            <div className="col-span-4 space-y-1">
                                                <span className="text-[8px] font-bold text-zinc-500 uppercase block">Fret</span>
                                                <input
                                                    type="number"
                                                    value={chordState.positions[stringNum]?.[0] || 0}
                                                    onChange={(e) => handlePositionChange(stringNum, 0, parseInt(e.target.value))}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs font-bold"
                                                />
                                            </div>
                                            <div className="col-span-4 space-y-1">
                                                <span className="text-[8px] font-bold text-zinc-500 uppercase block">Finger</span>
                                                <input
                                                    type="number"
                                                    value={chordState.positions[stringNum]?.[1] || 0}
                                                    onChange={(e) => handlePositionChange(stringNum, 1, parseInt(e.target.value))}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs font-bold"
                                                />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        const newAvoid = chordState.avoid.includes(stringNum)
                                                            ? chordState.avoid.filter(s => s !== stringNum)
                                                            : [...chordState.avoid, stringNum];
                                                        setChordState({ ...chordState, avoid: newAvoid });
                                                    }}
                                                    className={cn(
                                                        "w-6 h-6 rounded flex items-center justify-center font-black text-xs transition-colors",
                                                        chordState.avoid.includes(stringNum) ? "bg-red-500/20 text-red-500" : "bg-zinc-800 text-zinc-600 hover:text-zinc-400"
                                                    )}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Barre Settings */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Barre (Nut)</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={chordState.nut?.vis}
                                        onChange={(e) => handleNutChange('vis', e.target.checked)}
                                        className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-pink-500"
                                    />
                                    <span className="text-xs font-bold text-zinc-400">Visible</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Fret</label>
                                        <input
                                            type="number"
                                            value={chordState.nut?.pos || 0}
                                            onChange={(e) => handleNutChange('pos', parseInt(e.target.value))}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Finger</label>
                                        <input
                                            type="number"
                                            value={chordState.nut?.fin || 0}
                                            onChange={(e) => handleNutChange('fin', parseInt(e.target.value))}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">TRN (Finger Offset)</label>
                                        <input
                                            type="number"
                                            value={chordState.nut?.trn || 0}
                                            onChange={(e) => handleNutChange('trn', parseInt(e.target.value))}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold"
                                        />
                                        <p className="text-[8px] text-zinc-600 mt-1">Offset applied to all finger numbers when barre is active</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-12 bg-[#080808] overflow-y-auto">
                    {isMobile && !isMenuOpen && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-full border border-pink-500/30 transition-colors flex items-center gap-2 shadow-lg backdrop-blur-sm"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-sm font-bold">Edit Chord</span>
                        </button>
                    )}

                    {!isMobile && (
                        <div className="absolute top-8 right-8 flex gap-4 z-10">
                            <Link href="/studio">
                                <button className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-white/5 text-sm font-bold transition-colors flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Exit
                                </button>
                            </Link>
                        </div>
                    )}

                    <div className="w-full max-w-xl space-y-6 md:space-y-8 flex flex-col items-center my-auto">
                        <div className="flex flex-col items-center w-full">
                            <div className="p-4 md:p-8 rounded-3xl bg-zinc-950/50 border border-white/5 shadow-2xl backdrop-blur-sm">
                                <ChordDiagram {...previewChord} scale={isMobile ? 1 : 2} />
                            </div>
                        </div>

                        <div className="w-full p-4 md:p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                                <span>Transposition Preview</span>
                                <span className="text-pink-500">{transposition > 0 ? `+${transposition}` : transposition} semitones</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="12"
                                value={transposition}
                                onChange={(e) => setTransposition(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ChordCreator() {
    return (
        <AppProvider>
            <ChordCreatorContent />
        </AppProvider>
    );
}
