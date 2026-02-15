import { useCallback } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';
import { FretboardEditorState } from './types';
import { deepCloneNote } from '@/modules/editor/domain/clone-utils';
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

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useEditorNotes(
    state: FretboardEditorState,
    setState: (newState: FretboardEditorState | ((prevState: FretboardEditorState) => FretboardEditorState), options?: { overwrite?: boolean }) => void
) {
    const {
        measures,
        selectedNoteIds,
        editingNoteId,
        activePositionIndex,
        selectedMeasureId,
        activeDuration,
        settings
    } = state;

    // --- Helpers ---

    const getEditingNote = useCallback(() => {
        if (editingNoteId) {
            for (const m of measures) {
                const found = m.notes.find(n => n.id === editingNoteId);
                if (found) return found;
            }
        }
        return null;
    }, [editingNoteId, measures]);

    const getCurrentPitch = useCallback(() => {
        const editingNote = getEditingNote();
        if (!editingNote || editingNote.type === 'rest' || activePositionIndex === null || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(pos.fret, pos.string);
        return getPitchFromMidi(midi);
    }, [getEditingNote, activePositionIndex]);


    const updateSelectedNotes = useCallback((updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicitlySelected = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    if (isExplicitlySelected) {
                        const resolved = typeof updates === 'function' ? updates(n) : updates;
                        return { ...n, ...resolved };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    // --- Actions ---

    const handleSelectNote = useCallback((id: string, multi: boolean) => {
        if (multi) {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter((i: string) => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === id));
                const measureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

                return {
                    ...prev,
                    selectedNoteIds: [id],
                    editingNoteId: id,
                    activePositionIndex: null,
                    currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                    selectedMeasureId: measureId
                };
            }, { overwrite: true });
        }
    }, [setState]);

    const handleAddNote = useCallback((measureId: string, durationOverride?: Duration) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const m = prev.measures[measureIndex];
            const durationToAdd = durationOverride || prev.activeDuration;

            // --- CAPACITY CHECK ---
            const timeSignature = prev.settings?.time || '4/4';
            const capacity = getMeasureCapacity(timeSignature);
            const currentTotal = m.notes.reduce((acc, note) => acc + getNoteDurationValue(note.duration, !!note.decorators.dot), 0);
            const valueToAdd = getNoteDurationValue(durationToAdd, false);

            const canFitInCurrent = (currentTotal + valueToAdd) <= (capacity + 0.001);

            if (canFitInCurrent) {
                // Regular add to current measure
                const newNoteId = generateId();
                const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);

                const newMeasures = prev.measures.map((measure: MeasureData, idx: number) => {
                    if (idx === measureIndex) {
                        return {
                            ...measure,
                            notes: [...measure.notes, {
                                id: newNoteId,
                                positions: [{ fret: Math.max(1, minAllowedFret), string: 3 }],
                                duration: durationToAdd,
                                type: 'note' as const,
                                decorators: {},
                                accidental: 'none' as const,
                                strumDirection: 'down' as const // Default for Beats
                            }]
                        };
                    }
                    return measure;
                });

                return {
                    ...prev,
                    measures: newMeasures,
                    currentMeasureIndex: measureIndex,
                    selectedMeasureId: measureId,
                    editingNoteId: newNoteId,
                    selectedNoteIds: [newNoteId],
                    activePositionIndex: 0
                };
            } else {
                // OVERFLOW: Move to next measure or create new one
                const nextMeasureIndex = measureIndex + 1;
                const nextMeasure = prev.measures[nextMeasureIndex];

                if (nextMeasure) {
                    // Check if note fits in next measure
                    const nextTotal = nextMeasure.notes.reduce((acc, note) => acc + getNoteDurationValue(note.duration, !!note.decorators.dot), 0);
                    if ((nextTotal + valueToAdd) <= (capacity + 0.001)) {
                        // Recursively add to next measure
                        // NOTE: Directly modifying the state object here for the return
                        const newNoteId = generateId();
                        const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);
                        const newMeasures = prev.measures.map((measure: MeasureData, idx: number) => {
                            if (idx === nextMeasureIndex) {
                                return {
                                    ...measure,
                                    notes: [...measure.notes, {
                                        id: newNoteId,
                                        positions: [{ fret: Math.max(1, minAllowedFret), string: 3 }],
                                        duration: durationToAdd,
                                        type: 'note' as const,
                                        decorators: {},
                                        accidental: 'none' as const,
                                        strumDirection: 'down' as const // Default for Beats
                                    }]
                                };
                            }
                            return measure;
                        });

                        return {
                            ...prev,
                            measures: newMeasures,
                            currentMeasureIndex: nextMeasureIndex,
                            selectedMeasureId: nextMeasure.id,
                            editingNoteId: newNoteId,
                            selectedNoteIds: [newNoteId],
                            activePositionIndex: 0
                        };
                    }
                }

                // If no next measure OR next measure is full, create a NEW measure
                const newNoteId = generateId();
                const newMeasureId = generateId();
                const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);

                const newMeasure: MeasureData = {
                    id: newMeasureId,
                    isCollapsed: false,
                    showClef: false,
                    showTimeSig: false,
                    notes: [{
                        id: newNoteId,
                        positions: [{ fret: Math.max(1, minAllowedFret), string: 3 }],
                        duration: durationToAdd,
                        type: 'note' as const,
                        decorators: {},
                        accidental: 'none' as const,
                        strumDirection: 'down' as const // Default for Beats
                    }]
                };

                const newMeasures = [...prev.measures];
                newMeasures.splice(nextMeasureIndex, 0, newMeasure);

                return {
                    ...prev,
                    measures: newMeasures,
                    currentMeasureIndex: nextMeasureIndex,
                    selectedMeasureId: newMeasureId,
                    editingNoteId: newNoteId,
                    selectedNoteIds: [newNoteId],
                    activePositionIndex: 0
                };
            }
        });
    }, [setState]);

    const handleNoteRhythmChange = useCallback((noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === noteId));
            const targetMeasureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
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
                            }
                            remainingToCut = 0;
                        }
                    }
                }

                // Capacity check / Truncate
                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
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
    }, [setState]);

    const handleNoteDurationStatic = useCallback((noteId: string, newDuration: Duration) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === noteId) {
                        return { ...n, duration: newDuration };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handleRemoveNote = useCallback((noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.filter((n: NoteData) => n.id !== noteId)
            }));
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handleCopyNote = useCallback((noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
                if (noteIndex === -1) return m;

                const noteToCopy = m.notes[noteIndex];
                const newNote = deepCloneNote(noteToCopy, true);
                const newNotes = [...m.notes];
                newNotes.splice(noteIndex + 1, 0, newNote);
                return { ...m, notes: newNotes };
            });
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handlePitchChange = useCallback((newName?: string, newAccidental?: string, newOctave?: number) => {
        const editingNote = getEditingNote();
        const currentPitch = getCurrentPitch();
        if (!editingNote || !currentPitch || activePositionIndex === null) return;

        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, currentPos.string);

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex as number] = { fret: fret, string: string };
            return { positions: newPositions };
        });
    }, [getEditingNote, getCurrentPitch, activePositionIndex, updateSelectedNotes]);

    const handleStringChange = useCallback((newString: number) => {
        const editingNote = getEditingNote();
        if (!editingNote || activePositionIndex === null || !editingNote.positions[activePositionIndex]) return;

        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = currentPos.fret;
        const currentMidi = getMidiFromPosition(currentFret, currentPos.string);

        const newStringNum = newString;
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];
        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex as number] = { string: newString, fret: newFret };
            return { positions: newPositions };
        });
    }, [getEditingNote, activePositionIndex, updateSelectedNotes]);

    const handleAccidentalChange = useCallback((accidental: string) => {
        if (activePositionIndex === null) return;
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentPos = n.positions[activePositionIndex as number];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(currentPos.fret, currentPos.string);
            const { name, octave } = getPitchFromMidi(currentMidi);
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '♯') offset = 1;
            else if (desiredAccidental === '♭') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '♯') offset = -1;
                else if (n.accidental === '♭') offset = 1;
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, currentPos.string);
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex as number] = { ...currentPos, fret: fret };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    }, [updateSelectedNotes, activePositionIndex]);

    const handleDecoratorChange = useCallback((decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];
            const nextDecorators: any = { dot: n.decorators.dot };
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }
            return { decorators: nextDecorators };
        });
    }, [updateSelectedNotes]);

    const handleSetFingerForString = useCallback((idx: number, finger: number | string | undefined) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};

            if (finger === 'X') {
                newPositions[idx] = { ...newPositions[idx], avoid: true, finger: undefined };
            } else {
                newPositions[idx] = { ...newPositions[idx], avoid: false, finger: finger };
            }
            return { positions: newPositions };
        });
    }, [updateSelectedNotes]);

    const handleSetFretForString = useCallback((idx: number, fret: number) => {
        updateSelectedNotes(n => {
            const isBarre = !!n.barre || n.positions.some(p => p.endString !== undefined && p.endString !== p.string);
            const capo = settings?.capo ?? 0;
            const absoluteMin = isBarre ? capo : Math.max(1, capo);

            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};

            const clampedFret = Math.max(fret, absoluteMin);

            // If it's fret 0 and not a barre, it should have no finger (open string)
            let finalFinger = newPositions[idx].finger;
            if (clampedFret === 0 && !isBarre) {
                finalFinger = undefined;
            }

            newPositions[idx] = {
                ...newPositions[idx],
                fret: clampedFret,
                finger: finalFinger,
                avoid: false
            };
            return { positions: newPositions };
        });
    }, [updateSelectedNotes, settings?.capo]);

    const handleSetStringForPosition = useCallback((idx: number, stringNum: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};

            // Clear endString when explicitly moving the base string
            const { endString: _, ...rest } = newPositions[idx];
            newPositions[idx] = { ...rest, string: stringNum };

            return { positions: newPositions };
        });
    }, [updateSelectedNotes]);

    const handleSelectStringAndAddIfMissing = useCallback((stringNum: number) => {
        setState((prev: FretboardEditorState) => {
            const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);
            let targetNoteId = prev.editingNoteId;
            if (!targetNoteId && prev.selectedMeasureId) {
                const measure = prev.measures.find(m => m.id === prev.selectedMeasureId);
                if (measure && measure.notes.length > 0) targetNoteId = measure.notes[0].id;
            }

            const editingNote = targetNoteId
                ? prev.measures.flatMap(m => m.notes).find(n => n.id === targetNoteId)
                : null;

            if (!editingNote) return prev;

            const existingIdx = editingNote.positions.findIndex(p => p.string === stringNum);
            if (existingIdx !== -1) {
                return { ...prev, activePositionIndex: existingIdx };
            }

            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === targetNoteId) {
                        return {
                            ...n,
                            positions: [...n.positions, { fret: minAllowedFret, string: stringNum }]
                        };
                    }
                    return n;
                })
            }));

            const updatedNote = newMeasures.flatMap(m => m.notes).find(n => n.id === targetNoteId);
            const newIdx = updatedNote ? updatedNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIdx };
        });
    }, [setState]);

    const handleToggleBarre = useCallback((indices?: number[]) => {
        if (activePositionIndex === null) return;
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex as number];
            if (!pos) return {};

            if (pos.endString && pos.endString !== pos.string) {
                // Fix: Robustly remove endString and ensure finger is set (default to 1 'Indicator')
                const { endString, ...rest } = pos;
                newPositions[activePositionIndex as number] = { ...rest, finger: pos.finger || 1 };
            }

            return { positions: newPositions };
        });
    }, [updateSelectedNotes, activePositionIndex]);

    const handleToggleBarreTo = useCallback((targetString: number) => {
        if (activePositionIndex === null) return;
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex as number];
            if (!pos) return {};

            if (pos.endString === targetString) {
                // Fix: Robustly remove endString and ensure finger is set
                const { endString, ...rest } = pos;
                newPositions[activePositionIndex as number] = { ...rest, finger: pos.finger || 1 };
            } else {
                newPositions[activePositionIndex as number] = {
                    ...pos,
                    endString: targetString
                };
            }

            return { positions: newPositions };
        });
    }, [updateSelectedNotes, activePositionIndex]);

    const handleInsert = useCallback((code: string) => {
        setState(prev => {
            // Clef Logic
            if (code.startsWith('clef=')) {
                const clefValue = code.split('=')[1] as any;
                let targetIndex = prev.currentMeasureIndex;
                if (prev.selectedNoteIds.length > 0) {
                    const foundIndex = prev.measures.findIndex(m => m.notes.some(n => prev.selectedNoteIds.includes(n.id)));
                    if (foundIndex !== -1) targetIndex = foundIndex;
                }
                const newMeasures = prev.measures.map((m, idx) => {
                    if (idx === targetIndex) return { ...m, clef: clefValue, showClef: true };
                    return m;
                });
                return { ...prev, measures: newMeasures };
            }

            if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && prev.selectedNoteIds.length === 2) {
                const newMeasures = prev.measures.map(m => ({
                    ...m,
                    notes: m.notes.map(n => {
                        if (prev.selectedNoteIds.includes(n.id) && prev.selectedNoteIds.indexOf(n.id) === 0) {
                            return {
                                ...n,
                                technique: n.technique === code ? undefined : code,
                                slideTargetId: n.technique === code ? undefined : prev.selectedNoteIds[1]
                            };
                        }
                        return n;
                    })
                }));
                return { ...prev, measures: newMeasures };
            }

            // Fallback: Delegate to updateSelectedNotes style logic but we need access to state here, so it's tricky to reuse `updateSelectedNotes` which is a wrapper.
            // We can re-implement the update logic here or call a helper.
            // Let's implement inline for clarity as we are inside setState.

            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
                        const technique = n.technique === code ? undefined : code;
                        return {
                            ...n,
                            technique,
                            slideTargetId: technique ? n.slideTargetId : undefined
                        };
                    }
                    return n;
                })
            }));

            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handleAddChordNote = useCallback(() => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
                        const capo = settings?.capo ?? 0;
                        return {
                            ...n,
                            positions: [...n.positions, { fret: Math.max(1, capo), string: (n.positions.length + 1) }]
                        };
                    }
                    return n;
                })
            }));

            let targetId = prev.editingNoteId;
            if (!targetId && prev.selectedMeasureId) {
                const measure = newMeasures.find(m => m.id === prev.selectedMeasureId);
                if (measure && measure.notes.length > 0) targetId = measure.notes[0].id;
            }

            const editingNote = targetId
                ? newMeasures.flatMap((m: MeasureData) => m.notes).find((n: NoteData) => n.id === targetId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return {
                ...prev,
                measures: newMeasures,
                activePositionIndex: newIndex,
                editingNoteId: targetId,
                selectedNoteIds: targetId ? [targetId] : prev.selectedNoteIds
            };
        });
    }, [setState]);

    const handleRemoveChordNote = useCallback((idx: number) => {
        setState((prev: FretboardEditorState) => {
            let newIndex = prev.activePositionIndex;
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
                        if (n.positions.length <= 1) return n;
                        const newPositions = n.positions.filter((_: any, i: number) => i !== idx);
                        if (newIndex !== null && newIndex >= newPositions.length) {
                            newIndex = Math.max(0, newPositions.length - 1);
                        }

                        return { ...n, positions: newPositions };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    }, [setState]);

    const handleReorderNotes = useCallback((measureId: string, fromIndex: number, toIndex: number) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev;

            const newMeasures = [...prev.measures];
            const measure = newMeasures[measureIndex];
            const newNotes = [...measure.notes];

            const [movedNote] = newNotes.splice(fromIndex, 1);
            newNotes.splice(toIndex, 0, movedNote);

            newMeasures[measureIndex] = {
                ...measure,
                notes: newNotes
            };

            return {
                ...prev,
                measures: newMeasures
            };
        });
    }, [setState]);

    return {
        getEditingNote,
        getCurrentPitch,
        updateSelectedNotes,
        handleSelectNote,
        handleAddNote,
        handleNoteRhythmChange,
        handleNoteDurationStatic,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleBarre,
        handleToggleBarreTo,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleReorderNotes
    };
}
