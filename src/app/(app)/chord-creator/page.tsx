"use client"

import React, { useState, useEffect } from 'react';
import { ChordDiagram } from '@/components/studio/chord-diagram';
import { notes, complements, basses, extensions, getNote, getComplement, getExtension } from '@/lib/chords';
import { transpose } from '@/lib/chord-logic';
import type { ChordDiagramProps, Achord, Position, nutForm } from '@/lib/types';
import { useAppContext, AppProvider } from '@/app/context/app--context';

const ChordCreatorContent = () => {
    const { colors } = useAppContext();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [chordState, setChordState] = useState<ChordDiagramProps>({
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: 4, complement: 0, extension: [], bass: 0 }, // E Major
        positions: { 2: [2, 2, 1], 3: [2, 3, 1], 4: [1, 1, 1] },
        avoid: [],
        nut: { vis: false, str: [1, 6], pos: 1, fin: 0, add: false, trn: 1 },
        origin: 4,
    });

    const [transposition, setTransposition] = useState(0);
    const [previewChord, setPreviewChord] = useState<ChordDiagramProps>(chordState);

    useEffect(() => {
        if (!mounted) return;
        if (transposition === 0) {
            setPreviewChord(chordState);
        } else {
            const targetNoteIndex = (chordState.chord.note + transposition + 12) % 12;
            const transposed = transpose(chordState, {
                ...chordState.chord,
                note: targetNoteIndex
            });
            setPreviewChord(transposed);
        }
    }, [chordState, transposition, mounted]);

    if (!mounted) {
        return <div className="h-screen bg-black" />;
    }

    const handleChordChange = (field: keyof Achord, value: any) => {
        setChordState(prev => ({
            ...prev,
            chord: { ...prev.chord, [field]: value }
        }));
    };

    const handlePositionChange = (string: number, valueIndex: number, value: number) => {
        setChordState(prev => {
            const newPositions = { ...prev.positions };
            const current = newPositions[string] || [0, 0, 0];
            const next = [...current] as [number, number, number];
            next[valueIndex] = value;
            newPositions[string] = next;
            return { ...prev, positions: newPositions };
        });
    };

    const toggleAvoid = (string: number) => {
        setChordState(prev => {
            const newAvoid = prev.avoid.includes(string)
                ? prev.avoid.filter(s => s !== string)
                : [...prev.avoid, string];
            return { ...prev, avoid: newAvoid };
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

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a', color: colors.textColor }}>
            {/* Left Column: Form */}
            <div className="w-1/2 p-8 overflow-y-auto border-r border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Chord Creator
                </h1>

                <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
                    <h2 className="text-xl font-semibold mb-4 text-blue-300">Basic Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm opacity-70 mb-1">Root Note</label>
                            <select
                                value={chordState.chord.note}
                                onChange={(e) => handleChordChange('note', parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                            >
                                {notes.map((note, i) => <option key={i} value={i}>{note}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm opacity-70 mb-1">Complement</label>
                            <select
                                value={chordState.chord.complement}
                                onChange={(e) => handleChordChange('complement', parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                            >
                                {complements.map((c, i) => <option key={i} value={i}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm opacity-70 mb-1">Extensions</label>
                            <div className="grid grid-cols-4 gap-2">
                                {extensions.map((ext, i) => (
                                    <label key={i} className="flex items-center space-x-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={chordState.chord.extension.includes(i)}
                                            onChange={(e) => {
                                                const newExts = e.target.checked
                                                    ? [...chordState.chord.extension, i]
                                                    : chordState.chord.extension.filter(ex => ex !== i);
                                                handleChordChange('extension', newExts);
                                            }}
                                        />
                                        <span>{ext}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm opacity-70 mb-1">Bass</label>
                            <select
                                value={chordState.chord.bass}
                                onChange={(e) => handleChordChange('bass', parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                            >
                                {basses.map((b, i) => <option key={i} value={i}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm opacity-70 mb-1">Origin Note (Shape)</label>
                            <select
                                value={chordState.origin}
                                onChange={(e) => setChordState(prev => ({ ...prev, origin: parseInt(e.target.value) }))}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                            >
                                {notes.map((note, i) => <option key={i} value={i}>{note}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
                    <h2 className="text-xl font-semibold mb-4 text-green-300">Positions, Fingers & Strings</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(str => (
                            <div key={str} className="flex flex-col space-y-2 border-b border-white/5 pb-4 last:border-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-24">
                                        <label className="block text-[10px] opacity-50">String Name</label>
                                        <input
                                            type="text"
                                            value={chordState.stringNames[str - 1] || ''}
                                            onChange={(e) => {
                                                const newNames = [...chordState.stringNames];
                                                newNames[str - 1] = e.target.value;
                                                setChordState(prev => ({ ...prev, stringNames: newNames }));
                                            }}
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-sm font-mono"
                                        />
                                    </div>
                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                        <div>
                                            <label className="block text-[10px] opacity-50">Fret</label>
                                            <input
                                                type="number"
                                                value={chordState.positions[str]?.[0] || 0}
                                                onChange={(e) => handlePositionChange(str, 0, parseInt(e.target.value))}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] opacity-50">Finger</label>
                                            <input
                                                type="number"
                                                value={chordState.positions[str]?.[1] || 0}
                                                onChange={(e) => handlePositionChange(str, 1, parseInt(e.target.value))}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <label className="flex items-center space-x-1 text-[10px]">
                                                <input
                                                    type="checkbox"
                                                    checked={!!chordState.positions[str]?.[2]}
                                                    onChange={(e) => handlePositionChange(str, 2, e.target.checked ? 1 : 0)}
                                                />
                                                <span>Add Finger</span>
                                            </label>
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <label className="flex items-center space-x-1 text-[10px] text-red-400">
                                                <input
                                                    type="checkbox"
                                                    checked={chordState.avoid.includes(str)}
                                                    onChange={() => toggleAvoid(str)}
                                                />
                                                <span>Avoid</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-yellow-300">Barre Settings (Nut)</h2>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={chordState.nut?.vis}
                                onChange={(e) => handleNutChange('vis', e.target.checked)}
                            />
                            <span className="text-sm">Visible</span>
                        </label>
                    </div>
                    {chordState.nut?.vis && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm opacity-70 mb-1">Fret</label>
                                <input
                                    type="number"
                                    value={chordState.nut.pos}
                                    onChange={(e) => handleNutChange('pos', parseInt(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm opacity-70 mb-1">Finger</label>
                                <input
                                    type="number"
                                    value={chordState.nut.fin}
                                    onChange={(e) => handleNutChange('fin', parseInt(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm opacity-70 mb-1">Start String (Right)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    value={chordState.nut?.str[1] || 6}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        handleNutChange('str', [chordState.nut?.str[0] || 1, val]);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm opacity-70 mb-1">End String (Left)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    value={chordState.nut?.str[0] || 1}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        handleNutChange('str', [val, chordState.nut?.str[1] || 6]);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2"
                                />
                            </div>
                            <div className="col-span-2 flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={chordState.nut.add}
                                        onChange={(e) => handleNutChange('add', e.target.checked)}
                                    />
                                    <span className="text-sm">Add (Represent only)</span>
                                </label>
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm">TRN:</label>
                                    <input
                                        type="number"
                                        value={chordState.nut.trn}
                                        onChange={(e) => handleNutChange('trn', parseInt(e.target.value))}
                                        className="w-16 bg-gray-800 border border-gray-600 rounded p-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
                    <h2 className="text-xl font-semibold mb-4 text-purple-300">Advanced</h2>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={chordState.unique}
                                onChange={(e) => setChordState(prev => ({ ...prev, unique: e.target.checked }))}
                            />
                            <span className="text-sm">Unique (Disable Transposition)</span>
                        </label>
                    </div>
                </section>
            </div>

            {/* Right Column: Preview */}
            <div className="w-1/2 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="mb-8 w-full max-w-md p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h3 className="text-lg font-medium mb-4 text-center">Transposition Tool</h3>
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="0"
                            max="12"
                            value={transposition}
                            onChange={(e) => setTransposition(parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="w-12 text-center font-bold text-xl text-blue-400">
                            {transposition > 0 ? `+${transposition}` : transposition}
                        </span>
                    </div>
                    <p className="text-xs text-center mt-2 opacity-50">
                        Shift the chord by semitones to see how it looks.
                    </p>
                </div>

                <div className="relative group">
                    <ChordDiagram {...previewChord} />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse bg-opacity-80">
                        <span className="text-xs font-bold">LIVE</span>
                    </div>
                </div>

                <div className="mt-12 p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono max-w-lg overflow-auto">
                    <pre>{JSON.stringify(previewChord, null, 2)}</pre>
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
