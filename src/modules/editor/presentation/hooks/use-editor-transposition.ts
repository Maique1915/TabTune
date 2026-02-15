import { useCallback } from 'react';
import { MeasureData, NoteData } from '@/modules/editor/domain/types';
import { FretboardEditorState } from './types';
import { transposeChordName } from '@/modules/editor/domain/music-math';

export function useEditorTransposition(
    state: FretboardEditorState,
    setState: (newState: FretboardEditorState | ((prevState: FretboardEditorState) => FretboardEditorState), options?: { overwrite?: boolean }) => void
) {
    const { measures, selectedMeasureId } = state;

    const handleTransposeMeasure = useCallback((measureId: string, semitones: number, smartTranspose?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const measure = prev.measures[measureIndex];
            const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);

            // Determine selection mode:
            // 1. If selectedNoteIds is not empty OR there is an editingNoteId, it's Selective Mode.
            // 2. Otherwise, it's Global Mode (transposes everything).
            const selectedInMeasure = measure.notes.filter(n => prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId);
            const isSelectiveMode = selectedInMeasure.length > 0;
            const targetNotes = isSelectiveMode ? selectedInMeasure : measure.notes;

            // Bounds check for all notes that will be shifted
            const wouldGoOutOfBounds = targetNotes.some((note: NoteData) => {
                const isBarre = !!note.barre || note.positions.some(p => p.endString !== undefined && p.endString !== p.string);
                const effectiveMin = isBarre ? minAllowedFret : Math.max(1, minAllowedFret);

                return note.positions.some((pos: any) => {
                    if (pos.avoid) return false;
                    const newFret = pos.fret + semitones;
                    return newFret < effectiveMin || newFret > 24;
                }) || (note.barre ? ((note.barre.fret + semitones) < minAllowedFret || (note.barre.fret + semitones) > 24) : false);
            });

            if (wouldGoOutOfBounds) return prev;

            const targetIds = targetNotes.map(n => n.id);

            // Analysis for Smart Transpose (Before Transposition)
            let isStartingOpen = false;
            if (smartTranspose) {
                const allFrets = targetNotes.flatMap(n => n.positions.filter((p: any) => !p.avoid).map((p: any) => p.fret));
                if (allFrets.length > 0) {
                    const minFret = Math.min(...allFrets);
                    isStartingOpen = minFret === minAllowedFret;
                }
            }

            const transposedNotes = measure.notes.map((note: NoteData) => {
                if (targetIds.includes(note.id)) {
                    // Analysis for Hidden Barre (Restoration Signal)
                    const isHiddenBarre = note.barre?.fret === 0; // Keeping purely for potential future use or context logic

                    let newPositions = note.positions.map((pos: any) => {
                        if (pos.avoid) return pos; // Don't shift avoided strings
                        return {
                            ...pos,
                            fret: pos.fret + semitones
                        };
                    });

                    // Smart Transpose Logic (After Transposition Calculation)
                    if (smartTranspose) {
                        const allNewFrets = newPositions.filter((p: any) => !p.avoid).map((p: any) => p.fret);
                        if (allNewFrets.length > 0) {
                            const newMinFret = Math.min(...allNewFrets);
                            const isEndingOpen = newMinFret === minAllowedFret;

                            // Case 1: Open -> Barre (Shift Fingers Up)
                            if (isStartingOpen && !isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    if (typeof p.finger === 'number') {
                                        newFinger = p.finger + 1;
                                    }
                                    // If this position is at the 'barre' fret (min fret), force finger 1 if not set
                                    if (p.fret === newMinFret && !newFinger) {
                                        newFinger = 1;
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                            // Case 2: Barre -> Open (Shift Fingers Down)
                            else if (!isStartingOpen && isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    // If open string, remove finger
                                    if (p.fret === minAllowedFret) {
                                        newFinger = undefined;
                                    } else if (typeof p.finger === 'number') {
                                        newFinger = Math.max(1, p.finger - 1);
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                        }
                    }

                    // Naive Barre Shift
                    let newBarre = note.barre ? { ...note.barre, fret: note.barre.fret + semitones } : undefined;

                    // Bounds check for barre
                    if (newBarre && (newBarre.fret < minAllowedFret || newBarre.fret > 24)) {
                        newBarre = undefined;
                    }
                    if (newBarre && newBarre.fret === minAllowedFret) {
                        newBarre = undefined;
                    }

                    return {
                        ...note,
                        positions: newPositions,
                        barre: newBarre
                    };
                }
                return note;
            });

            // Transpose chord name if Global Mode OR Smart Transpose is active
            const newChordName = (!isSelectiveMode || smartTranspose)
                ? transposeChordName(measure.chordName, semitones)
                : measure.chordName;

            const newMeasures = prev.measures.map((m: MeasureData, idx: number) =>
                idx === measureIndex
                    ? { ...m, notes: transposedNotes, chordName: newChordName }
                    : m
            );

            return {
                ...prev,
                measures: newMeasures
            };
        });
    }, [setState]);

    const handleTransposeAll = useCallback((semitones: number) => {
        setState((prev: FretboardEditorState) => {
            const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);
            // Check bounds for ALL notes in ALL measures
            const wouldGoOutOfBounds = prev.measures.some((measure: MeasureData) =>
                measure.notes.some((note: NoteData) => {
                    const isBarre = !!note.barre || note.positions.some(p => p.endString !== undefined && p.endString !== p.string);
                    const effectiveMin = isBarre ? minAllowedFret : Math.max(1, minAllowedFret);

                    return note.positions.some((pos: any) => {
                        if (pos.avoid) return false;
                        const newFret = pos.fret + semitones;
                        return newFret < effectiveMin || newFret > 24;
                    }) || (note.barre ? ((note.barre.fret + semitones) < minAllowedFret || (note.barre.fret + semitones) > 24) : false);
                })
            );

            if (wouldGoOutOfBounds) return prev;

            const newMeasures = prev.measures.map((measure: MeasureData) => {
                const transposedNotes = measure.notes.map((note: NoteData) => {
                    // Adjust barre if it exists
                    let newBarre = note.barre;
                    if (newBarre) {
                        newBarre = {
                            ...newBarre,
                            fret: newBarre.fret + semitones
                        };
                    }
                    if (newBarre && (newBarre.fret < minAllowedFret || newBarre.fret > 24)) {
                        newBarre = undefined;
                    }
                    if (newBarre && newBarre.fret === minAllowedFret) {
                        newBarre = undefined;
                    }

                    return {
                        ...note,
                        positions: note.positions.map((pos: any) => {
                            if (pos.avoid) return pos;
                            return {
                                ...pos,
                                fret: pos.fret + semitones
                            };
                        }),
                        barre: newBarre
                    };
                });

                const newName = transposeChordName(measure.chordName, semitones);
                return { ...measure, notes: transposedNotes, chordName: newName };
            });

            return {
                ...prev,
                measures: newMeasures
            };
        });
    }, [setState]);

    const handleAutoFingerToggle = useCallback((enabled: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex(m => m.id === prev.selectedMeasureId);
            if (measureIndex === -1) return prev;

            const minAllowedFret = Math.max(0, prev.settings?.capo ?? 0);
            const hasCapoNut = minAllowedFret > 0;

            const newMeasures = prev.measures.map((m: MeasureData, idx: number) => {
                if (idx !== measureIndex) return m;

                const newNotes = m.notes.map((note: NoteData) => {
                    // Check if the chord is in Open Position (Capo-as-nut)
                    // This applies to both existing Hidden Barre chords AND chords that lost their barre
                    const allFrets = note.positions.filter((p: any) => !p.avoid).map((p: any) => p.fret);
                    if (allFrets.length === 0) return note;
                    const minFret = Math.min(...allFrets);

                    if (minFret !== minAllowedFret) {
                        // Not open position - ignore
                        return note;
                    }

                    // If turning OFF (Manual/Restore), ensuring we have a Hidden Barre structure exists
                    // This fixes cases where the barre was previously lost
                    let newBarre = note.barre;
                    if (!enabled && !newBarre && !hasCapoNut) {
                        // Create a default hidden barre covering all active strings or full neck
                        newBarre = { fret: minAllowedFret, startString: 6, endString: 1, finger: 1 };
                    }
                    if (newBarre && newBarre.fret === minAllowedFret) {
                        newBarre = undefined;
                    }

                    // Calculate finger changes
                    const newPositions = note.positions.map((p: any) => {
                        if (p.avoid) return p;
                        let newFinger = p.finger;

                        if (enabled) {
                            // Turning ON: SIMPLIFY (3 -> 2)
                            if (p.fret === minAllowedFret) {
                                newFinger = undefined;
                            } else if (typeof p.finger === 'number') {
                                newFinger = Math.max(1, p.finger - 1);
                            }
                        } else {
                            // Turning OFF: RESTORE (2 -> 3)
                            if (typeof p.finger === 'number') {
                                newFinger = p.finger + 1;
                            }
                            // If at open fret and no finger (and we are restoring barre), set to 1
                            if (p.fret === minAllowedFret && !newFinger) {
                                newFinger = 1;
                            }
                        }
                        return { ...p, finger: newFinger };
                    });

                    return { ...note, positions: newPositions, barre: newBarre };
                });

                return { ...m, notes: newNotes };
            });

            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    return {
        handleTransposeMeasure,
        handleTransposeAll,
        handleAutoFingerToggle
    };
}
