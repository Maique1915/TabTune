
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '@/components/tab-editor/Sidebar';
import StyleSidebar from '@/components/tab-editor/StyleSidebar';
import { TabEditorMobileNav } from '@/components/tab-editor/AppHeader';
import { AppHeader } from '@/components/studio/app-header';
import { SettingsPanel } from '@/components/studio/SettingsPanel';
import ScorePreview, { ScorePreviewRef } from '@/components/tab-editor/ScorePreview';
import VisualEditor from '@/components/tab-editor/VisualEditor';
import { Icons } from '@/lib/tab-editor/constants';
import { MeasureData, NoteData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration } from '@/lib/tab-editor/types';
import { convertToVextab } from '@/lib/tab-editor/utils/vextabConverter';
import { importScoreFile } from '@/lib/tab-editor/utils/musicXmlParser';
import { Upload } from 'lucide-react';
import { VideoRenderSettingsModal, VideoRenderSettings } from '@/components/shared/VideoRenderSettingsModal';
import { RenderProgressModal } from '@/components/shared/RenderProgressModal';
import { MobileHeader } from '@/components/shared/MobileHeader';
import { MobileBottomNav } from '@/components/shared/MobileBottomNav';
import { MobilePlaybackControls } from '@/components/shared/MobilePlaybackControls';
import { StageContainer } from '@/components/shared/StageContainer';
import { UnifiedControls } from "@/components/shared/UnifiedControls";
import { WorkspaceLayout } from "@/components/shared/WorkspaceLayout";
import { EditorGrid } from "@/components/shared/EditorGrid";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';
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
    const [isImporting, setIsImporting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [activePanel, setActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [selectedMeasureId, setSelectedMeasureId] = useState<string | null>(null);

    const [measures, setMeasures] = useState<MeasureData[]>([
        {
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [{ fret: '5', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: '7', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: '9', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
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
    const [isLooping, setIsLooping] = useState(false);
    const [activePositionIndex, setActivePositionIndex] = useState(0);

    // Rendering State
    const scorePreviewRef = useRef<ScorePreviewRef>(null);
    const [showRenderSettings, setShowRenderSettings] = useState(false);
    const [renderState, setRenderState] = useState({
        isRendering: false,
        progress: 0,
        isComplete: false
    });
    const [renderSettings, setRenderSettings] = useState<VideoRenderSettings>({
        format: 'mp4',
        fps: 30,
        quality: 'medium'
    });

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
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(parseInt(pos.fret), parseInt(pos.string));
        return getPitchFromMidi(midi);
    }, [editingNote, activePositionIndex]);

    const activeMeasure = useMemo(() => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    }, [measures, selectedMeasureId]);

    const displayMeasureInfo = useMemo(() => {
        const current = isPlaying || renderState.isRendering
            ? Math.min(Math.floor((playbackPosition / 100) * measures.length) + 1, measures.length)
            : currentMeasureIndex + 1;
        return { current, total: measures.length };
    }, [isPlaying, renderState.isRendering, playbackPosition, measures.length, currentMeasureIndex]);

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
                setPlaybackPosition((prev) => {
                    if (prev >= 100) {
                        return isLooping ? 0 : 100;
                    }
                    return prev + increment;
                });
            }, frameRate);
        }
        return () => clearInterval(interval);
    }, [isPlaying, settings.bpm, settings.time, measures.length, isLooping]);

    // Cleanup and reset playback when it reaches the end
    useEffect(() => {
        if (isPlaying && playbackPosition >= 100 && !isLooping) {
            setIsPlaying(false);
            setPlaybackPosition(0);
        }
    }, [isPlaying, playbackPosition, isLooping]);

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
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
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

    const handleSelectMeasure = (id: string) => {
        setSelectedMeasureId(prev => prev === id ? null : id);
        setSelectedNoteIds([]);
        setEditingNoteId(null);
    };

    const handleDeselectAll = () => {
        setSelectedNoteIds([]);
        setEditingNoteId(null);
        setSelectedMeasureId(null);
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
                                        positions: [{ fret: '0', string: '1' }],
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
                        positions: [{ fret: '0', string: '1' }],
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

    const handleAddNote = (measureId: string, durationOverride?: Duration) => {
        const measure = measures.find(m => m.id === measureId);
        if (!measure) return;

        const durationToAdd = durationOverride || activeDuration;

        const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
        const capacity = getMeasureCapacity(settings.time);
        const newNoteValue = getNoteDurationValue(durationToAdd, false);

        if (currentTotal + newNoteValue > capacity + 0.001) {
            const newMeasureId = generateId();
            const newNote = {
                id: generateId(),
                positions: [{ fret: '0', string: '3' }],
                duration: durationToAdd,
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
                        notes: [...m.notes, { id: generateId(), positions: [{ fret: '0', string: '3' }], duration: durationToAdd, type: 'note', decorators: {}, accidental: 'none' }]
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
            setEditingNoteId(id);
            setActivePositionIndex(0); // Reset to first note of chord

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
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, parseInt(currentPos.string));

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { fret: fret.toString(), string: string.toString() };
            return { positions: newPositions };
        });
    };

    const handleStringChange = (newString: string) => {
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;
        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = parseInt(currentPos.fret);
        const currentString = parseInt(currentPos.string);
        // Calculate current MIDI pitch
        const currentMidi = getMidiFromPosition(currentFret, currentString);

        const newStringNum = parseInt(newString);
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];

        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { string: newString, fret: newFret.toString() };
            return { positions: newPositions };
        });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as any; // Allow 'tab' etc.

            let targetIndex = currentMeasureIndex;
            if (selectedNoteIds.length > 0) {
                const foundIndex = measures.findIndex(m => m.notes.some(n => selectedNoteIds.includes(n.id)));
                if (foundIndex !== -1) targetIndex = foundIndex;
            }

            setMeasures(prev => prev.map((m, idx) => {
                if (idx === targetIndex) {
                    return { ...m, clef: clefValue, showClef: true };
                }
                return m;
            }));
            return;
        }

        if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && selectedNoteIds.length === 2) {
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

            if (firstNote && secondNote && firstNote.positions[0] && secondNote.positions[0] && firstNote.positions[0].string === secondNote.positions[0].string) {
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

    const handleAddChordNote = () => {
        updateSelectedNotes(n => ({
            positions: [...n.positions, { fret: '0', string: (n.positions.length + 1).toString() }]
        }));
        setActivePositionIndex(editingNote ? editingNote.positions.length : 0);
    };

    const handleRemoveChordNote = (idx: number) => {
        updateSelectedNotes(n => {
            if (n.positions.length <= 1) return {};
            const newPositions = n.positions.filter((_, i) => i !== idx);
            if (activePositionIndex >= newPositions.length) {
                setActivePositionIndex(Math.max(0, newPositions.length - 1));
            }
            return { positions: newPositions };
        });
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
            const currentPos = n.positions[activePositionIndex];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(parseInt(currentPos.fret), parseInt(currentPos.string));
            const { name, octave } = getPitchFromMidi(currentMidi);

            // Calculate Natural MIDI for this pitch class/octave
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '#') offset = 1;
            else if (desiredAccidental === 'b') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '#') offset = -1; // Remove sharp
                else if (n.accidental === 'b') offset = 1; // Remove flat
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, parseInt(currentPos.string));

            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { ...currentPos, fret: fret.toString() };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];

            // Clean slate: start with only the dot if it exists
            const nextDecorators: any = {
                dot: n.decorators.dot
            };

            // Toggle logic: only set the new one if it wasn't already active
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }

            return {
                decorators: nextDecorators
            };
        });
    };

    const handleImportMusicXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const { measures: newMeasures, settings: newSettings } = await importScoreFile(file);

            setMeasures(newMeasures);
            setSettings(prev => ({
                ...prev,
                bpm: newSettings.bpm,
                time: newSettings.time
            }));
            setEditingNoteId(null);
            setSelectedNoteIds([]);

            toast({
                title: "Score Imported",
                description: `Successfully imported ${newMeasures.length} measures.`,
            });
        } catch (error) {
            console.error("Import error:", error);
            toast({
                title: "Import Failed",
                description: "Could not parse MusicXML file. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-primary-mobile selection:text-white">
                <MobileHeader
                    title="Tab Editor"
                    showBack={true}
                />

                <main className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    {/* Blur effect background */}
                    <div className="absolute w-full h-full max-w-sm bg-primary-mobile/10 blur-[60px] rounded-full pointer-events-none" />

                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        {/* Score Preview Container */}
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <div className="w-full h-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#0F1218] p-4">
                                    <ScorePreview
                                        ref={scorePreviewRef}
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
                                        onToggleVisibility={toggleVisibility}
                                        onRenderStateChange={setRenderState}
                                    />
                                </div>
                                <div className="absolute top-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 shadow-lg transform translate-y-[-150%] group-hover:translate-y-0 transition-transform duration-300">
                                    {settings.key} {settings.clef}
                                </div>
                            </div>
                        </div>

                        {/* Compact Playback Controls (asd.html style) */}
                        <div className="flex justify-center w-full mb-4">
                            <div className="bg-white dark:bg-surface-dark/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-lg shadow-black/5 dark:shadow-black/20">
                                {/* Play/Pause Button */}
                                <button
                                    onClick={() => {
                                        if (!isPlaying && playbackPosition >= 100) {
                                            setPlaybackPosition(0);
                                        }
                                        setIsPlaying(!isPlaying);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-mobile text-white shadow-lg shadow-primary-mobile/30 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <span className="material-icons-round text-3xl ml-0.5">
                                        {isPlaying ? 'pause' : 'play_arrow'}
                                    </span>
                                </button>

                                {/* Skip Back Button */}
                                <button
                                    onClick={() => setPlaybackPosition(0)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                                >
                                    <span className="material-icons-round text-xl">skip_previous</span>
                                </button>

                                {/* Loop Button */}
                                <button
                                    onClick={() => setIsLooping(!isLooping)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isLooping
                                        ? 'bg-primary-mobile/20 text-primary-mobile'
                                        : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    <span className="material-icons-round text-xl">replay</span>
                                </button>

                                {/* Divider */}
                                <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                                {/* Stop Button */}
                                <button
                                    onClick={() => { setIsPlaying(false); setPlaybackPosition(0); }}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                                >
                                    <span className="material-icons-round text-xl">stop</span>
                                </button>

                                {/* Tempo Button */}
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 transition-colors border border-gray-200 dark:border-white/5"
                                >
                                    <span className="text-xs font-bold">{settings.bpm}</span>
                                </button>

                                {/* Import Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isImporting}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isImporting ? (
                                        <span className="material-icons-round text-xl animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-icons-round text-xl">upload_file</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Timeline (VisualEditor) */}
                        <div className="mb-4">
                            <VisualEditor
                                measures={measures}
                                selectedNoteIds={selectedNoteIds}
                                timeSignature={settings.time}
                                activeDuration={activeDuration}
                                hasClipboard={!!clipboard}
                                onSelectNote={handleSelectNote}
                                onDoubleClickNote={(id) => setEditingNoteId(id)}
                                onAddNote={handleAddNote}
                                onUpdateNote={(id, updates) => updateSelectedNotes(updates)}
                                onRemoveMeasure={(id) => setMeasures(measures.filter(m => m.id !== id))}
                                onAddMeasure={handleAddMeasure}
                                onUpdateMeasure={handleUpdateMeasure}
                                onToggleCollapse={handleToggleCollapse}
                                onCopyMeasure={handleCopyMeasure}
                                onPasteMeasure={handlePasteMeasure}
                                onReorderMeasures={handleReorderMeasures}
                                onRemoveNote={handleRemoveNote}
                                onSelectMeasure={handleSelectMeasure}
                                selectedMeasureId={selectedMeasureId}
                                onDeselectAll={handleDeselectAll}
                            />
                        </div>
                    </div>
                </main>

                <MobileBottomNav
                    activePanel={activePanel}
                    onPanelChange={setActivePanel}
                    onAddClick={() => handleAddMeasure()}
                />

                {/* Mobile Panels as Fullscreen Modals */}
                {activePanel === 'library' && (
                    <Sidebar
                        isMobile={true}
                        isOpen={true}
                        onClose={() => setActivePanel('studio')}
                        onInsert={handleInsert}
                        onAddNote={handleAddNote}
                        onUpdateNote={(updates) => updateSelectedNotes(updates)}
                        activeDuration={activeDuration}
                        onSelectDuration={setActiveDuration}
                        editingNote={editingNote}
                        currentPitch={currentPitch}
                        onCloseInspector={() => setEditingNoteId(null)}
                        onNoteRhythmChange={(d, dot) => editingNote && handleNoteRhythmChange(editingNote.id, d, dot)}
                        onNoteTypeChange={(type) => updateSelectedNotes({ type })}
                        onPitchChange={handlePitchChange}
                        onStringChange={handleStringChange}
                        onAccidentalChange={handleAccidentalChange}
                        onDecoratorChange={handleDecoratorChange}
                        activeMeasure={activeMeasure}
                        onMeasureUpdate={handleUpdateMeasure}
                        activePositionIndex={activePositionIndex}
                        onActivePositionIndexChange={setActivePositionIndex}
                        onAddChordNote={() => {
                            updateSelectedNotes(n => ({
                                positions: [...n.positions, { fret: '0', string: (n.positions.length + 1).toString() }]
                            }));
                            setActivePositionIndex(editingNote ? editingNote.positions.length : 0);
                        }}
                        onRemoveChordNote={(idx: number) => {
                            updateSelectedNotes(n => {
                                if (n.positions.length <= 1) return {};
                                const newPositions = n.positions.filter((_, i) => i !== idx);
                                if (activePositionIndex >= newPositions.length) {
                                    setActivePositionIndex(Math.max(0, newPositions.length - 1));
                                }
                                return { positions: newPositions };
                            });
                        }}
                    />
                )}

                {activePanel === 'mixer' && (
                    <div className="fixed inset-0 z-50 bg-background-dark">
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <h2 className="text-lg font-bold text-white">Mixer</h2>
                                <button
                                    onClick={() => setActivePanel('studio')}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <span className="material-icons-round text-gray-400">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <p className="text-gray-400 text-center">Mixer controls coming soon...</p>
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'customize' && (
                    <StyleSidebar
                        isMobile={true}
                        isOpen={true}
                        onClose={() => setActivePanel('studio')}
                        style={scoreStyle}
                        onChange={(up: Partial<ScoreStyle>) => setScoreStyle({ ...scoreStyle, ...up })}
                        onReset={() => setScoreStyle(DEFAULT_SCORE_STYLE)}
                    />
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportMusicXML}
                    accept=".musicxml,.xml,.mxl,.mscz"
                    className="hidden"
                />

                {/* Modals */}
                <VideoRenderSettingsModal
                    isOpen={showRenderSettings}
                    settings={renderSettings}
                    onClose={() => setShowRenderSettings(false)}
                    onRender={(settings: VideoRenderSettings) => {
                        setRenderSettings(settings);
                        setShowRenderSettings(false);
                        scorePreviewRef.current?.startRender(settings);
                    }}
                />

                <RenderProgressModal
                    isOpen={renderState.isRendering}
                    isComplete={renderState.isComplete}
                    progress={renderState.progress}
                    onClose={() => setRenderState(prev => ({ ...prev, isRendering: false }))}
                />
            </div>
        );
    }

    const floatingControls = (
        <UnifiedControls
            isPlaying={isPlaying}
            isPaused={!isPlaying}
            isLooping={isLooping}
            onPlayPause={() => {
                if (!isPlaying && playbackPosition >= 100) {
                    setPlaybackPosition(0);
                }
                setIsPlaying(!isPlaying);
            }}
            onSkipBack={() => setPlaybackPosition(0)}
            onToggleLoop={() => setIsLooping(!isLooping)}
            onReset={() => { setIsPlaying(false); setPlaybackPosition(0); }}
            onRender={() => {
                if (renderState.isRendering) {
                    scorePreviewRef.current?.cancelRender();
                } else {
                    setShowRenderSettings(true);
                }
            }}
            isRendering={renderState.isRendering}
            leftExtra={
                <div className="flex items-center space-x-2 bg-black/50 p-1 rounded-lg border border-white/10">
                    <div className="flex items-center px-3 space-x-2 border-r border-white/10">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Tempo</span>
                        <input
                            type="number"
                            value={settings.bpm}
                            min="40"
                            max="240"
                            onChange={(e) => setSettings({ ...settings, bpm: parseInt(e.target.value) || 120 })}
                            className="w-12 bg-transparent text-xs font-black text-cyan-400 outline-none text-center"
                        />
                        <span className="text-[10px] font-bold text-slate-700">BPM</span>
                    </div>
                    <select
                        value={settings.time}
                        onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                        className="bg-transparent text-[10px] font-black text-slate-400 outline-none px-2 cursor-pointer hover:text-cyan-400 transition-colors"
                    >
                        <option value="4/4">4/4</option>
                        <option value="3/4">3/4</option>
                        <option value="2/4">2/4</option>
                        <option value="6/8">6/8</option>
                    </select>
                </div>
            }
            rightExtra={
                <div className="flex items-center p-0.5 bg-black/20 rounded-xl border border-white/5">
                    <button
                        onClick={toggleVisibility}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 active:scale-95 group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest">{settings.showNotation ? 'Tab' : 'Notation'}</span>
                    </button>
                </div>
            }
        />
    );

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader />}
            mobileHeader={<MobileHeader title="Tab Editor" showBack={true} />}
            mobileBottomNav={<TabEditorMobileNav activePanel={activePanel} onPanelChange={setActivePanel} />}
            leftSidebar={
                <Sidebar
                    onInsert={handleInsert}
                    onAddNote={handleAddNote}
                    onUpdateNote={(updates) => updateSelectedNotes(updates)}
                    activeDuration={activeDuration}
                    onSelectDuration={setActiveDuration}
                    editingNote={editingNote}
                    currentPitch={currentPitch}
                    onCloseInspector={() => setEditingNoteId(null)}
                    onNoteRhythmChange={(d, dot) => editingNote && handleNoteRhythmChange(editingNote.id, d, dot)}
                    onNoteTypeChange={(type) => updateSelectedNotes({ type })}
                    onPitchChange={handlePitchChange}
                    onStringChange={handleStringChange}
                    onAccidentalChange={handleAccidentalChange}
                    onDecoratorChange={handleDecoratorChange}
                    activeMeasure={activeMeasure}
                    onMeasureUpdate={handleUpdateMeasure}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    isMobile={isMobile}
                    isOpen={activePanel === 'library'}
                    onClose={() => setActivePanel('studio')}
                />
            }
            rightSidebar={
                <StyleSidebar
                    style={scoreStyle}
                    onChange={(up: Partial<ScoreStyle>) => setScoreStyle({ ...scoreStyle, ...up })}
                    onReset={() => setScoreStyle(DEFAULT_SCORE_STYLE)}
                    isMobile={isMobile}
                    isOpen={activePanel === 'customize'}
                    onClose={() => setActivePanel('studio')}
                />
            }
        >
            <EditorGrid
                topSection={
                    <StageContainer title="Score Preview" aspectRatio="aspect-[800/340]" background={scoreStyle.background}>
                        <ScorePreview
                            ref={scorePreviewRef}
                            measures={measures}
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
                            onToggleVisibility={toggleVisibility}
                            onRenderStateChange={setRenderState}
                            code="" // Placeholder for required prop
                            timeSignature={settings.time} // Required prop
                        />
                    </StageContainer>
                }
                bottomSection={
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
                        onSelectMeasure={handleSelectMeasure}
                        selectedMeasureId={selectedMeasureId}
                        onDeselectAll={handleDeselectAll}
                    />
                }
                floatingControls={floatingControls}
            />

            <VideoRenderSettingsModal
                isOpen={showRenderSettings}
                settings={renderSettings}
                onClose={() => setShowRenderSettings(false)}
                onRender={(settings: VideoRenderSettings) => {
                    setRenderSettings(settings);
                    setShowRenderSettings(false);
                    scorePreviewRef.current?.startRender(settings);
                }}
            />

            <RenderProgressModal
                isOpen={renderState.isRendering}
                isComplete={renderState.isComplete}
                progress={renderState.progress}
                onClose={() => setRenderState(prev => ({ ...prev, isRendering: false }))}
            />
        </WorkspaceLayout>
    );
}
