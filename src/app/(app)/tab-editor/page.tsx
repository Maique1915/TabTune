
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/tab-editor/Sidebar';
import StyleSidebar from '@/components/tab-editor/StyleSidebar';
import ScorePreview from '@/components/tab-editor/ScorePreview';
import VisualEditor from '@/components/tab-editor/VisualEditor';
import { Icons } from '@/lib/tab-editor/constants';
import { MeasureData, NoteData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration } from '@/lib/tab-editor/types';
import { convertToVextab } from '@/lib/tab-editor/utils/vextabConverter';
import {
    getPitchFromMidi,
    NOTE_NAMES,
    getMidiFromPosition,
    findBestFretForPitch,
    getMidiFromPitch,
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue
} from '@/lib/tab-editor/utils/musicMath';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function TabEditorPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [measures, setMeasures] = useState<MeasureData[]>([
        {
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), fret: '5', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), fret: '7', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), fret: '9', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
            ]
        }
    ]);

    const [clipboard, setClipboard] = useState<MeasureData | null>(null);
    const [activeDuration, setActiveDuration] = useState<Duration>('q');

    const [settings, setSettings] = useState<GlobalSettings>({
        clef: 'treble',
        key: 'C',
        time: '4/4',
        bpm: 120,
        showNotation: true,
        showTablature: true
    });

    const [scoreStyle, setScoreStyle] = useState<ScoreStyle>(DEFAULT_SCORE_STYLE);
    const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [currentMeasureIndex, setCurrentMeasureIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);

    const vextabCode = useMemo(() => convertToVextab(measures, settings, scoreStyle), [measures, settings, scoreStyle]);

    const editingNote = useMemo(() => {
        if (!editingNoteId) return null;
        for (const m of measures) {
            const found = m.notes.find(n => n.id === editingNoteId);
            if (found) return found;
        }
        return null;
    }, [editingNoteId, measures]);

    const currentPitch = useMemo(() => {
        if (!editingNote || editingNote.type === 'rest') return null;
        const midi = getMidiFromPosition(parseInt(editingNote.fret), parseInt(editingNote.string));
        return getPitchFromMidi(midi);
    }, [editingNote]);

    // previewData removed as per user request

    useEffect(() => {
        let interval: number;
        if (isPlaying) {
            const [num] = settings.time.split('/').map(Number);
            const beatDuration = 60 / settings.bpm;
            const measureDuration = beatDuration * num;
            const totalDuration = measures.length * measureDuration;

            const frameRate = 30;
            const increment = (100 / (totalDuration * (1000 / frameRate)));

            interval = window.setInterval(() => {
                setPlaybackPosition((prev) => (prev >= 100 ? 0 : prev + increment));
            }, frameRate);
        }
        return () => clearInterval(interval);
    }, [isPlaying, settings.bpm, settings.time, measures.length]);

    const handleAddMeasure = () => {
        setMeasures([...measures, {
            id: generateId(),
            isCollapsed: false,
            showClef: false,
            showTimeSig: false,
            notes: []
        }]);
    };

    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(measures.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleToggleCollapse = (measureId: string) => {
        setMeasures(measures.map(m => m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m));
    };

    const handleCopyMeasure = (measureId: string) => {
        const measure = measures.find(m => m.id === measureId);
        if (measure) setClipboard(JSON.parse(JSON.stringify(measure)));
    };

    const handlePasteMeasure = () => {
        if (!clipboard) return;
        const newMeasure: MeasureData = {
            ...clipboard,
            id: generateId(),
            isCollapsed: false,
            notes: clipboard.notes.map(n => ({ ...n, id: generateId() }))
        };
        setMeasures([...measures, newMeasure]);
    };

    const handleReorderMeasures = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        const newMeasures = [...measures];
        const [moved] = newMeasures.splice(fromIndex, 1);
        newMeasures.splice(toIndex, 0, moved);
        setMeasures(newMeasures);
    };

    const handleRemoveNote = (noteId: string) => {
        setMeasures(prev => prev.map(m => ({
            ...m,
            notes: m.notes.filter(n => n.id !== noteId)
        })));
        setSelectedNoteIds(prev => prev.filter(id => id !== noteId));
        if (editingNoteId === noteId) setEditingNoteId(null);
    };

    const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setMeasures(prevMeasures => {
            return prevMeasures.map(m => {
                const noteIndex = m.notes.findIndex(n => n.id === noteId);
                if (noteIndex === -1) return m;

                const note = m.notes[noteIndex];
                const oldVal = getNoteDurationValue(note.duration, !!note.decorators.dot);
                const targetDuration = newDuration || note.duration;
                const targetDot = newDot !== undefined ? newDot : !!note.decorators.dot;
                const newVal = getNoteDurationValue(targetDuration, targetDot);

                let delta = newVal - oldVal;
                const newNotes = [...m.notes];

                newNotes[noteIndex] = {
                    ...note,
                    duration: targetDuration,
                    decorators: { ...note.decorators, dot: targetDot }
                };

                if (delta > 0) {
                    let remainingToCut = delta;
                    let i = noteIndex + 1;
                    while (remainingToCut > 0.001 && i < newNotes.length) {
                        const nextNote = newNotes[i];
                        const nextVal = getNoteDurationValue(nextNote.duration, !!nextNote.decorators.dot);

                        if (nextVal <= remainingToCut + 0.001) {
                            remainingToCut -= nextVal;
                            newNotes.splice(i, 1);
                        } else {
                            const targetNextVal = nextVal - remainingToCut;
                            const decomposed = decomposeValue(targetNextVal);
                            if (decomposed.length > 0) {
                                newNotes[i] = {
                                    ...nextNote,
                                    duration: decomposed[0].duration as Duration,
                                    decorators: { ...nextNote.decorators, dot: decomposed[0].dotted }
                                };
                                if (decomposed.length > 1) {
                                    const extraRests = decomposed.slice(1).map(d => ({
                                        id: generateId(),
                                        fret: '0',
                                        string: '1',
                                        duration: d.duration as Duration,
                                        type: 'rest' as const,
                                        decorators: { dot: d.dotted },
                                        accidental: 'none' as const
                                    }));
                                    newNotes.splice(i + 1, 0, ...extraRests);
                                }
                            }
                            remainingToCut = 0;
                        }
                    }
                } else if (delta < 0) {
                    const absDelta = Math.abs(delta);
                    const restsToAdd = decomposeValue(absDelta).map(d => ({
                        id: generateId(),
                        fret: '0',
                        string: '1',
                        duration: d.duration as Duration,
                        type: 'rest' as const,
                        decorators: { dot: d.dotted },
                        accidental: 'none' as const
                    }));
                    newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
                }

                const capacity = getMeasureCapacity(settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
                        const spaceLeft = capacity - total;
                        if (spaceLeft >= 0.03125) {
                            const decomposed = decomposeValue(spaceLeft);
                            if (decomposed.length > 0) {
                                finalNotes.push({
                                    ...n,
                                    duration: decomposed[0].duration as Duration,
                                    decorators: { ...n.decorators, dot: decomposed[0].dotted }
                                });
                            }
                        }
                        break;
                    }
                }

                return { ...m, notes: finalNotes };
            });
        });
    };

    const handleAddNote = (measureId: string) => {
        const measure = measures.find(m => m.id === measureId);
        if (!measure) return;
        const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
        const capacity = getMeasureCapacity(settings.time);
        const newNoteValue = getNoteDurationValue(activeDuration, false);

        if (currentTotal + newNoteValue > capacity + 0.001) {
            const newMeasureId = generateId();
            const newNote = {
                id: generateId(),
                fret: '0',
                string: '1',
                duration: activeDuration,
                type: 'note' as const,
                decorators: {},
                accidental: 'none' as const
            };
            const newMeasures = [...measures];
            const currentIndex = measures.findIndex(m => m.id === measureId);
            newMeasures.splice(currentIndex + 1, 0, {
                id: newMeasureId,
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: [newNote]
            });
            setMeasures(newMeasures);
        } else {
            setMeasures(measures.map(m => {
                if (m.id === measureId) {
                    return {
                        ...m,
                        notes: [...m.notes, { id: generateId(), fret: '0', string: '1', duration: activeDuration, type: 'note', decorators: {}, accidental: 'none' }]
                    };
                }
                return m;
            }));
        }
    };

    const handleSelectNote = (id: string, multi: boolean) => {
        if (multi) setSelectedNoteIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        else {
            setSelectedNoteIds([id]);
            setEditingNoteId(id); // Open inspector on single click

            // Auto-focus the measure containing this note
            const measureIndex = measures.findIndex(m => m.notes.some(n => n.id === id));
            if (measureIndex !== -1) {
                setCurrentMeasureIndex(measureIndex);
            }
        }
    };

    const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setMeasures(measures.map(m => ({
            ...m,
            notes: m.notes.map(n => {
                if (selectedNoteIds.includes(n.id) || n.id === editingNoteId) {
                    const resolvedUpdates = typeof updates === 'function' ? updates(n) : updates;
                    return { ...n, ...resolvedUpdates };
                }
                return n;
            })
        })));
    };

    const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
        if (!editingNote || !currentPitch) return;
        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const { fret, string } = findBestFretForPitch(midi, parseInt(editingNote.string));
        updateSelectedNotes({ fret: fret.toString(), string: string.toString() });
    };

    const handleStringChange = (newString: string) => {
        if (!editingNote) return;
        const currentFret = parseInt(editingNote.fret);
        const currentString = parseInt(editingNote.string);
        // Calculate current MIDI pitch
        // Standard Tuning: E4(1)=64, B3(2)=59, G3(3)=55, D3(4)=50, A2(5)=45, E2(6)=40
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };

        // Use helper if reliable, or manual calc since we need precise preservation
        // getMidiFromPosition might abstract this, let's use it for consistency
        const currentMidi = getMidiFromPosition(currentFret, currentString);

        const newStringNum = parseInt(newString);
        const openMidi = openStrings[newStringNum];

        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;

        // If impossible (negative fret), we can't preserve exact pitch on this string.
        // User intention implies moving position. If impossible, defaulting to 0 
        // changes the pitch, but it's the "best" we can do on that string for that note (closest?).
        // Or we simply apply 0 and let them fix it.
        if (newFret < 0) newFret = 0;

        updateSelectedNotes({ string: newString, fret: newFret.toString() });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as GlobalSettings['clef'];
            setSettings(prev => ({ ...prev, clef: clefValue }));
            return;
        }

        if (['s', 'h', 'p', 'b'].includes(code) && selectedNoteIds.length === 2) {
            let firstNote: NoteData | null = null;
            let secondNote: NoteData | null = null;

            for (const m of measures) {
                const found = m.notes.filter(n => selectedNoteIds.includes(n.id));
                if (found.length === 2) {
                    const idx0 = m.notes.findIndex(n => n.id === found[0].id);
                    const idx1 = m.notes.findIndex(n => n.id === found[1].id);
                    if (idx0 < idx1) {
                        firstNote = m.notes[idx0];
                        secondNote = m.notes[idx1];
                    } else {
                        firstNote = m.notes[idx1];
                        secondNote = m.notes[idx0];
                    }
                    break;
                }
            }

            if (firstNote && secondNote && firstNote.string === secondNote.string) {
                const targetId = secondNote.id;
                setMeasures(prev => prev.map(m => ({
                    ...m,
                    notes: m.notes.map(n => {
                        if (n.id === firstNote!.id) {
                            return {
                                ...n,
                                technique: n.technique === code && n.slideTargetId === targetId ? undefined : code,
                                slideTargetId: n.technique === code && n.slideTargetId === targetId ? undefined : targetId
                            };
                        }
                        return n;
                    })
                })));
                return;
            }
        }

        if (selectedNoteIds.length > 0) {
            setMeasures(prev => prev.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (selectedNoteIds.includes(n.id)) {
                        return {
                            ...n,
                            technique: n.technique === code ? undefined : code,
                            slideTargetId: n.technique === code ? undefined : n.slideTargetId
                        };
                    }
                    return n;
                })
            })));
        }
    };

    const toggleVisibility = (type: 'notation' | 'tablature') => {
        setSettings(prev => {
            const next = { ...prev };
            if (type === 'notation') {
                // Only allow hiding if tablature is still visible
                if (!next.showNotation || next.showTablature) {
                    next.showNotation = !next.showNotation;
                }
            } else {
                // Only allow hiding if notation is still visible
                if (!next.showTablature || next.showNotation) {
                    next.showTablature = !next.showTablature;
                }
            }
            return next;
        });
    };

    const handleAccidentalChange = (accidental: string) => {
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentMidi = getMidiFromPosition(parseInt(n.fret), parseInt(n.string));
            const { name, octave } = getPitchFromMidi(currentMidi);

            // Calculate Natural MIDI for this pitch class/octave
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '#') offset = 1;
            else if (desiredAccidental === 'b') offset = -1;
            else if (desiredAccidental === 'none') {
                // When deselecting, we need to find the natural note
                // If current note has an accidental, remove it to get natural
                if (n.accidental === '#') offset = -1; // Remove sharp
                else if (n.accidental === 'b') offset = 1; // Remove flat
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, parseInt(n.string));

            return {
                accidental: desiredAccidental,
                fret: fret.toString()
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => ({
            decorators: {
                ...n.decorators,
                [decorator]: !n.decorators[decorator as keyof typeof n.decorators]
            }
        }));
    };

    if (!isClient) return <div className="h-screen w-full bg-black flex items-center justify-center text-slate-500">Loading...</div>;

    return (
        <div className="flex h-screen w-full flex-col bg-gradient-to-br from-[#1a0b2e] via-[#0f0518] to-black text-slate-200 overflow-hidden relative font-['Inter']">
            {/* Retro Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,6px_100%] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-1 overflow-hidden">
                <Sidebar
                    onInsert={handleInsert}
                    activeDuration={activeDuration}
                    onSelectDuration={setActiveDuration}
                    // Inspector Props
                    editingNote={editingNote}
                    currentPitch={currentPitch}
                    onCloseInspector={() => setEditingNoteId(null)}
                    onNoteRhythmChange={(d, dot) => editingNote && handleNoteRhythmChange(editingNote.id, d, dot)}
                    onNoteTypeChange={(type) => updateSelectedNotes({ type })}
                    onPitchChange={handlePitchChange}
                    onStringChange={handleStringChange}
                    onAccidentalChange={handleAccidentalChange}
                    onDecoratorChange={handleDecoratorChange}
                />

                <main className="flex flex-1 flex-col overflow-hidden min-w-0" style={{ display: 'grid', gridTemplateRows: '60% 40%' }}>
                    <div className="flex flex-col h-full overflow-hidden relative">
                        {/* Integrated Header Controls */}
                        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5">
                            <div className="flex items-center space-x-4">
                                <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-2 rounded-xl flex items-center space-x-3 text-xs font-black transition-all ${isPlaying ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
                                    {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                                    <span>{isPlaying ? 'STOP' : 'PLAY'}</span>
                                </button>
                                <button onClick={() => { setIsPlaying(false); setPlaybackPosition(0); }} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5">
                                    <Icons.Reset />
                                </button>
                                <div className="h-6 w-px bg-white/10 mx-2" />

                                <div className="flex items-center space-x-2 bg-black/50 p-1 rounded-lg border border-white/10">
                                    <div className="flex items-center px-3 space-x-2 border-r border-white/10">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Tempo</span>
                                        <input type="number" value={settings.bpm} min="40" max="240" onChange={(e) => setSettings({ ...settings, bpm: parseInt(e.target.value) || 120 })} className="w-12 bg-transparent text-xs font-black text-cyan-400 outline-none text-center" />
                                        <span className="text-[10px] font-bold text-slate-700">BPM</span>
                                    </div>
                                    <select value={settings.time} onChange={(e) => setSettings({ ...settings, time: e.target.value })} className="bg-transparent text-xs font-black text-slate-300 px-3 outline-none cursor-pointer">
                                        <option value="4/4">4/4</option>
                                        <option value="3/4">3/4</option>
                                        <option value="2/4">2/4</option>
                                        <option value="6/8">6/8</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="text-[10px] font-mono text-cyan-500/30 truncate max-w-[200px] select-none mr-4">{vextabCode}</div>
                                <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-lg border border-white/10">
                                    <button onClick={() => toggleVisibility('notation')} className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all ${settings.showNotation ? 'bg-blue-500/20 text-blue-400' : 'text-slate-600'}`}>Partitura</button>
                                    <button onClick={() => toggleVisibility('tablature')} className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all ${settings.showTablature ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-600'}`}>Tablatura</button>
                                </div>
                            </div>
                        </div>

                        {/* Top: Score Preview (Canvas) */}
                        <div className="w-full h-full min-w-0 overflow-hidden relative">
                            <ScorePreview
                                code={vextabCode}
                                measures={measures}
                                timeSignature={settings.time}
                                playbackPosition={playbackPosition}
                                isPlaying={isPlaying}
                                style={scoreStyle}
                                showNotation={settings.showNotation}
                                showTablature={settings.showTablature}
                                onMeasuresChange={setMeasures}
                                selectedNoteIds={selectedNoteIds}
                                onSelectNote={handleSelectNote}
                                onDoubleClickNote={(id) => setEditingNoteId(id)}
                                currentMeasureIndex={currentMeasureIndex}
                                onPlaybackControl={setIsPlaying}
                                onPlaybackPositionChange={setPlaybackPosition}
                            />
                        </div>
                    </div>

                    {/* Bottom: Visual Editor (Timeline) */}
                    <div className="w-full h-full min-w-0 overflow-hidden relative border-t border-white/5 bg-black/20 backdrop-blur-sm">
                        <VisualEditor
                            measures={measures}
                            selectedNoteIds={selectedNoteIds}
                            timeSignature={settings.time}
                            activeDuration={activeDuration}
                            onSelectNote={handleSelectNote}
                            onDoubleClickNote={(id) => setEditingNoteId(id)}
                            onAddNote={handleAddNote}
                            onUpdateNote={(id, up) => updateSelectedNotes(up)}
                            onRemoveMeasure={(id) => setMeasures(measures.filter(m => m.id !== id))}
                            onAddMeasure={handleAddMeasure}
                            onUpdateMeasure={handleUpdateMeasure}
                            onToggleCollapse={handleToggleCollapse}
                            onCopyMeasure={handleCopyMeasure}
                            onPasteMeasure={handlePasteMeasure}
                            onReorderMeasures={handleReorderMeasures}
                            onRemoveNote={handleRemoveNote}
                            hasClipboard={!!clipboard}
                        />
                    </div>
                </main>

                <StyleSidebar style={scoreStyle} onChange={(up) => setScoreStyle({ ...scoreStyle, ...up })} onReset={() => setScoreStyle(DEFAULT_SCORE_STYLE)} />
            </div>
        </div>
    );
};
