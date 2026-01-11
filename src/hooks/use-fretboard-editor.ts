
import { useState, useMemo } from 'react';
import { MeasureData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration, NoteData } from '@/modules/editor/domain/types';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import {
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue,
    getMidiFromPosition,
    getPitchFromMidi,
    findBestFretForPitch,
    getMidiFromPitch,
    NOTE_NAMES
} from '@/modules/editor/domain/music-math';

interface FretboardEditorState {
    measures: MeasureData[];
    settings: GlobalSettings;
    scoreStyle: ScoreStyle;
    selectedNoteIds: string[];
    editingNoteId: string | null;
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    activeDuration: Duration;
    activePositionIndex: number;
    currentMeasureIndex: number;
    selectedMeasureId: string | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useFretboardEditor() {
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<FretboardEditorState>({
        measures: [{
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [{ fret: 5, string: 3 }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: 7, string: 3 }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: 9, string: 3 }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
            ]
        }],
        settings: {
            clef: 'tab' as const,
            key: 'C',
            time: '4/4',
            bpm: 120,
            showNotation: true,
            showTablature: true
        },
        scoreStyle: DEFAULT_SCORE_STYLE,
        selectedNoteIds: [],
        editingNoteId: null,
        activePanel: 'studio',
        activeDuration: 'q',
        activePositionIndex: 0,
        currentMeasureIndex: 0,
        selectedMeasureId: null
    });

    const {
        measures,
        settings,
        scoreStyle,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId
    } = state;



    // --- Helpers ---

    const recalculateBarre = (note: NoteData): NoteData['barre'] => {
        if (!note.barre) return undefined;
        // barre.fret is number (BarreData)
        // note.positions use number for fret.
        const relevantPositions = note.positions.filter(p => p.fret === note.barre!.fret);

        if (relevantPositions.length === 0) return undefined;

        const strings = relevantPositions.map(p => p.string);
        const minStr = Math.min(...strings);
        const maxStr = Math.max(...strings);

        return {
            ...note.barre,
            startString: maxStr,
            endString: minStr
        };
    };

    const handleToggleBarre = (indices?: number[]) => {
        updateSelectedNotes(n => {
            // If explicit indices provided, create barre for them
            if (indices && indices.length > 0) {
                const relevantPositions = n.positions.filter((_, i) => indices.includes(i));
                if (relevantPositions.length < 1) return { barre: undefined };

                const targetFret = relevantPositions[0].fret; // number
                // Verify same fret
                if (relevantPositions.some(p => p.fret !== targetFret)) return { barre: undefined }; // Invalid selection

                const strings = relevantPositions.map(p => p.string);
                const minStr = Math.min(...strings);
                const maxStr = Math.max(...strings);

                return {
                    barre: {
                        fret: targetFret,
                        startString: maxStr,
                        endString: minStr
                    }
                };
            }

            if (n.barre) {
                // If barre exists, remove it
                return { barre: undefined };
            }

            // Create barre logic
            // Find most common fret in positions
            const frets: Record<string, number> = {};
            n.positions.forEach(p => {
                if (p.fret === 0) return;
                frets[p.fret] = (frets[p.fret] || 0) + 1;
            });

            // Get fret with most notes, or active position's fret
            const sortedFrets = Object.entries(frets).sort((a, b) => b[1] - a[1]);
            // sortedFrets[0][0] is string key, need int
            const targetFretKey = sortedFrets.length > 0 ? sortedFrets[0][0] : undefined;
            let targetFret = targetFretKey ? parseInt(targetFretKey) : n.positions[activePositionIndex]?.fret;

            if (!targetFret || targetFret <= 0) return {};

            // Find min/max string for this fret
            const relevantPositions = n.positions.filter(p => p.fret === targetFret);

            if (relevantPositions.length < 1) return {};

            const strings = relevantPositions.map(p => p.string);
            const minStr = Math.min(...strings);
            const maxStr = Math.max(...strings);

            return {
                barre: {
                    fret: targetFret,
                    startString: maxStr, // number
                    endString: minStr   // number
                }
            };
        });
    };

    const setMeasures = (newMeasures: MeasureData[] | ((prev: MeasureData[]) => MeasureData[])) => {
        setState(prev => ({
            ...prev,
            measures: typeof newMeasures === 'function' ? newMeasures(prev.measures) : newMeasures
        }));
    };

    const setSettings = (newSettings: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings)) => {
        setState(prev => ({
            ...prev,
            settings: typeof newSettings === 'function' ? newSettings(prev.settings) : newSettings
        }));
    };

    const setScoreStyle = (newStyle: ScoreStyle | ((prev: ScoreStyle) => ScoreStyle)) => {
        setState(prev => ({
            ...prev,
            scoreStyle: typeof newStyle === 'function' ? newStyle(prev.scoreStyle) : newStyle
        }));
    };

    const setActiveDuration = (duration: Duration) => {
        setState(prev => ({ ...prev, activeDuration: duration }));
    };

    const setEditingNoteId = (id: string | null) => {
        setState(prev => ({ ...prev, editingNoteId: id }));
    };

    const setActivePanel = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState(prev => ({ ...prev, activePanel: panel }));
    };

    const setActivePositionIndex = (index: number) => {
        setState(prev => ({ ...prev, activePositionIndex: index }));
    };

    // --- Derived State Helpers (Internal) ---
    const getEditingNote = () => {
        if (!editingNoteId) return null;
        for (const m of measures) {
            const found = m.notes.find(n => n.id === editingNoteId);
            if (found) return found;
        }
        return null;
    };

    const getCurrentPitch = () => {
        const editingNote = getEditingNote();
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(pos.fret, pos.string);
        return getPitchFromMidi(midi);
    };

    const getActiveMeasure = () => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    };

    // --- Advanced Selection/Update Logic ---

    const handleSelectMeasure = (id: string) => {
        setState(prev => {
            const isSame = prev.selectedMeasureId === id;
            const newSelectedId = isSame ? null : id;
            const targetIndex = prev.measures.findIndex(m => m.id === id);
            const newIndex = (targetIndex !== -1 && !isSame) ? targetIndex : prev.currentMeasureIndex;
            return {
                ...prev,
                selectedNoteIds: [],
                editingNoteId: null,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
    };

    const handleSelectNote = (id: string, multi: boolean) => {
        if (multi) {
            setState(prev => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter(i => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            setState(prev => {
                const measureIndex = prev.measures.findIndex(m => m.notes.some(n => n.id === id));
                const measureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;
                return {
                    ...prev,
                    selectedNoteIds: [id],
                    editingNoteId: id,
                    activePositionIndex: 0,
                    currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                    selectedMeasureId: measureId
                };
            }, { overwrite: true });
        }
    };

    const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setState(prev => {
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const resolvedUpdates = typeof updates === 'function' ? updates(n) : updates;
                        let updatedNote = { ...n, ...resolvedUpdates };

                        // Auto-recalculate barre if present
                        if (updatedNote.barre) {
                            updatedNote.barre = recalculateBarre(updatedNote);
                        }
                        return updatedNote;
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    };


    // --- Core Actions (Add/Remove) ---

    // Simplified Note Addition
    const handleAddNote = (measureId: string, durationOverride?: Duration) => {
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev;

            const measure = prev.measures[measureIndex];
            const durationToAdd = durationOverride || prev.activeDuration;
            const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
            const capacity = getMeasureCapacity(prev.settings.time);
            const newNoteValue = getNoteDurationValue(durationToAdd, false);

            let newMeasures = [...prev.measures];
            let newMeasureFullIndex = measureIndex;
            let targetMeasureId = measureId;

            if (currentTotal + newNoteValue > capacity + 0.001) {
                // Overflow (New Measure)
                const newMeasureId = generateId();
                const newNote: NoteData = {
                    id: generateId(),
                    positions: [{ fret: 0, string: 3 }],
                    duration: durationToAdd,
                    type: 'note',
                    decorators: {},
                    accidental: 'none'
                };
                newMeasures.splice(measureIndex + 1, 0, {
                    id: newMeasureId,
                    isCollapsed: false,
                    showClef: false,
                    showTimeSig: false,
                    notes: [newNote]
                });
                newMeasureFullIndex = measureIndex + 1;
                targetMeasureId = newMeasureId;
            } else {
                newMeasures = prev.measures.map((m, idx) => {
                    if (idx === measureIndex) {
                        return {
                            ...m,
                            notes: [...m.notes, { id: generateId(), positions: [{ fret: 0, string: 3 }], duration: durationToAdd, type: 'note', decorators: {}, accidental: 'none' }]
                        };
                    }
                    return m;
                });
            }

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasureFullIndex,
                selectedMeasureId: targetMeasureId
            };
        });
    };

    const handleRemoveNote = (noteId: string) => {
        setState(prev => {
            let targetMeasureIndex = prev.currentMeasureIndex;
            let targetMeasureId = prev.selectedMeasureId;
            const newMeasures = prev.measures.map((m, idx) => {
                const found = m.notes.some(n => n.id === noteId);
                if (found) {
                    targetMeasureIndex = idx;
                    targetMeasureId = m.id;
                    return { ...m, notes: m.notes.filter(n => n.id !== noteId) };
                }
                return m;
            });
            return {
                ...prev,
                measures: newMeasures,
                selectedNoteIds: prev.selectedNoteIds.filter(id => id !== noteId),
                editingNoteId: prev.editingNoteId === noteId ? null : prev.editingNoteId,
                currentMeasureIndex: targetMeasureIndex,
                selectedMeasureId: targetMeasureId
            };
        });
    };

    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleAddMeasure = () => {
        setState(prev => {
            const newMeasure: MeasureData = {
                id: generateId(),
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: []
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1,
                selectedMeasureId: newMeasure.id
            };
        });
    };

    const handleRemoveMeasure = (id: string) => {
        setState(prev => {
            const newMeasures = prev.measures.filter(m => m.id !== id);
            if (newMeasures.length === 0) {
                const initial: MeasureData = { id: generateId(), isCollapsed: false, showClef: true, showTimeSig: true, notes: [] };
                return { ...prev, measures: [initial], currentMeasureIndex: 0, selectedMeasureId: initial.id };
            }
            const newIndex = Math.min(prev.currentMeasureIndex, newMeasures.length - 1);
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newIndex,
                selectedMeasureId: newMeasures[newIndex].id
            };
        });
    };


    // --- Advanced Editing Handlers (Sidebar Support) ---

    const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.notes.some(n => n.id === noteId));
            const targetMeasureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

            const newMeasures = prev.measures.map(m => {
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
                                        positions: [{ fret: 0, string: 1 }],
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
                        positions: [{ fret: 0, string: 1 }],
                        duration: d.duration as Duration,
                        type: 'rest' as const,
                        decorators: { dot: d.dotted },
                        accidental: 'none' as const
                    }));
                    newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
                }

                // Capacity check / Truncate (Simplified for brevity)
                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
                        // Overflow handling omitted for now, just truncate
                        break;
                    }
                }
                return { ...m, notes: finalNotes };
            });

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                selectedMeasureId: targetMeasureId || prev.selectedMeasureId
            };
        });
    };

    const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
        const editingNote = getEditingNote();
        const currentPitch = getCurrentPitch();
        if (!editingNote || !currentPitch) return;

        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, currentPos.string);

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { fret: fret, string: string };
            return { positions: newPositions };
        });
    };

    const handleStringChange = (newString: number) => {
        const editingNote = getEditingNote();
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;

        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = currentPos.fret;
        const currentMidi = getMidiFromPosition(currentFret, currentPos.string);

        const newStringNum = newString;
        // Standard Tuning
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];
        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { string: newString, fret: newFret };
            return { positions: newPositions };
        });
    };

    const handleAccidentalChange = (accidental: string) => {
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentPos = n.positions[activePositionIndex];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(currentPos.fret, currentPos.string);
            const { name, octave } = getPitchFromMidi(currentMidi);
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '#') offset = 1;
            else if (desiredAccidental === 'b') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '#') offset = -1;
                else if (n.accidental === 'b') offset = 1;
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, currentPos.string);
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { ...currentPos, fret: fret };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];
            const nextDecorators: any = { dot: n.decorators.dot };
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }
            return { decorators: nextDecorators };
        });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as any;
            let targetIndex = currentMeasureIndex;
            if (selectedNoteIds.length > 0) {
                const foundIndex = measures.findIndex(m => m.notes.some(n => selectedNoteIds.includes(n.id)));
                if (foundIndex !== -1) targetIndex = foundIndex;
            }
            setMeasures(prev => prev.map((m, idx) => {
                if (idx === targetIndex) return { ...m, clef: clefValue, showClef: true };
                return m;
            }));
            return;
        }

        if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && selectedNoteIds.length === 2) {
            // Technique between two notes (Simplistic find)
            setMeasures(prev => prev.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (selectedNoteIds.includes(n.id) && selectedNoteIds.indexOf(n.id) === 0) {
                        return {
                            ...n,
                            technique: n.technique === code ? undefined : code,
                            slideTargetId: n.technique === code ? undefined : selectedNoteIds[1] // Assuming simple logic
                        };
                    }
                    return n;
                })
            })));
            return;
        }


        // Single Note Technique
        if (selectedNoteIds.length > 0) {
            updateSelectedNotes(n => ({
                technique: n.technique === code ? undefined : code,
                slideTargetId: n.technique === code ? undefined : n.slideTargetId
            }));
        }
    };

    const handleAddChordNote = () => {
        setState(prev => {
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const updatedNote = {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: (n.positions.length + 1) }]
                        };
                        if (updatedNote.barre) {
                            updatedNote.barre = recalculateBarre(updatedNote);
                        }
                        return updatedNote;
                    }
                    return n;
                })
            }));

            const editingNote = prev.editingNoteId
                ? newMeasures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleRemoveChordNote = (idx: number) => {
        setState(prev => {
            let newIndex = prev.activePositionIndex;
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        if (n.positions.length <= 1) return n;
                        const newPositions = n.positions.filter((_, i) => i !== idx);
                        if (newIndex >= newPositions.length) newIndex = Math.max(0, newPositions.length - 1);

                        let updatedNote = { ...n, positions: newPositions };
                        if (updatedNote.barre) {
                            updatedNote.barre = recalculateBarre(updatedNote);
                        }
                        return updatedNote;
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    // Removed duplicate handleToggleBarre


    return {
        // State
        measures,
        settings,
        scoreStyle,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId,

        editingNote: getEditingNote(),
        currentPitch: getCurrentPitch(),
        activeMeasure: getActiveMeasure(),

        // Actions
        setSettings,
        setMeasures,
        setScoreStyle,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,

        handleSelectMeasure,
        handleSelectNote,
        handleAddNote,
        handleRemoveNote,
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,

        // Advanced Actions
        handleNoteRhythmChange,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleToggleBarre,
        updateSelectedNotes,

        // Utils
        undo, redo, canUndo, canRedo
    };
}
