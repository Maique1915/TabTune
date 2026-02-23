import { useEffect, useRef } from 'react';
import { SidebarProps } from '../components/sidebar-types';

/**
 * Hook to manage keyboard shortcuts for the chord editor
 * Handles:
 * - Arrows: Fret and String navigation
 * - Shift + Arrows: Barre control and Project Transposition
 * - Ctrl + Arrows: Rotation and Capo control
 */
export function useKeyboardShortcuts(props: SidebarProps) {
    // Use a ref to always have the latest props without re-registering the event listener
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            const isInput = (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA' ||
                document.activeElement?.getAttribute('contenteditable') === 'true'
            );
            if (isInput) return;



            const {
                activePositionIndex = null,
                editingNote,
                onSetFretForPosition,
                onSetStringForPosition,
                onSetFingerForPosition,
                onToggleBarre,
                onToggleBarreTo,
                onTransposeAll,
                globalSettings,
                onGlobalSettingsChange,
                theme,
                setTheme,
                onAddNote,
                activeDuration,
                onAddMeasure,
                onAddChordNote,
                onRemoveMeasure,
                onRemoveChordNote,
                onRemoveNote,
                onCopyMeasure,
                activeMeasure,
                variant,
                onActivePositionIndexChange,
                onSelectNote,
                onSelectMeasure,
                onUpdateNote,
                measures = []
            } = propsRef.current; // Use ref current

            // 0. Global Editor Actions (May not require editingNote)
            if (e.key === '+') {
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                    onAddChordNote?.();
                } else if (e.shiftKey) {
                    if (activeMeasure && onAddNote) {
                        onAddNote(activeMeasure.id, activeDuration);
                    }
                } else if (variant !== 'short') {
                    onAddMeasure?.();
                }
                return;
            }

            if (e.key === '-') {
                e.preventDefault();

                // 1. Short View Unification
                if (variant === 'short') {
                    if (activeMeasure && onRemoveMeasure) {
                        onRemoveMeasure(activeMeasure.id);
                    }
                    return;
                }

                // 2. Chord Deletion (Shift + -)
                if (e.shiftKey) {
                    if (editingNote && onRemoveNote) {
                        onRemoveNote(editingNote.id);
                    }
                    return;
                }

                // 3. Finger Deletion (Ctrl + -)
                if (e.ctrlKey || e.metaKey) {
                    if (editingNote && onRemoveChordNote && activePositionIndex !== null) {
                        onRemoveChordNote(activePositionIndex);
                    }
                    return;
                }

                // 4. Measure Deletion (Pure -)
                if (activeMeasure && onRemoveMeasure) {
                    onRemoveMeasure(activeMeasure.id);
                }
                return;
            }

            const keyLower = e.key.toLowerCase();
            const isShift = e.shiftKey;
            const isCtrl = e.ctrlKey || e.metaKey;
            const isAlt = e.altKey;

            // B or P: Toggle Barre
            if (!isCtrl && !isAlt && (keyLower === 'b' || keyLower === 'p')) {
                e.preventDefault();
                onToggleBarre?.();
                return;
            }

            // Ctrl + D: Duplicate Measure
            if (isCtrl && !isShift && !isAlt && keyLower === 'd') {
                e.preventDefault();
                if (activeMeasure && onCopyMeasure) {
                    onCopyMeasure(activeMeasure.id);
                }
                return;
            }

            // --- Beats Specific Shortcuts (Note-level) ---
            if (variant === 'beats' && editingNote) {
                // Ctrl + ArrowRight/Left: Cycle Strum Direction (Arrow Types)
                if (isCtrl && !isShift && !isAlt) {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const cycle: ('down' | 'up' | 'pause' | 'mute')[] = ['down', 'up', 'pause', 'mute'];
                        const currentDir = editingNote.strumDirection || 'down';
                        const currentIndex = cycle.indexOf(currentDir as any);
                        const direction = e.key === 'ArrowRight' ? 1 : -1;
                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        onUpdateNote?.({ strumDirection: cycle[nextIndex] });
                        return;
                    }
                }
                // Ctrl + Space: Toggle Accent (Strong Beat)
                else if (isCtrl && !isShift && !isAlt && e.code === 'Space') {
                    e.preventDefault();
                    onUpdateNote?.({ isStrong: !editingNote.isStrong });
                    return;
                }
                // Ctrl + Shift + ArrowRight/Left: REMOVED (Conflicted with system)
                // Alt + Shift + Arrows or W/S: Cycle Duration
                else if ((isAlt && isShift && !isCtrl && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) ||
                    (!isShift && !isCtrl && !isAlt && (keyLower === 'w' || keyLower === 's'))) {
                    e.preventDefault();
                    const cycle: string[] = ['w', 'h', 'q', '8', '16', '32'];
                    const currentDuration = editingNote.duration || 'q';
                    const currentIndex = cycle.indexOf(currentDuration);

                    // W or ArrowUp: Increase duration (move left in cycle: 16 -> 8 -> q -> h -> w)
                    // S or ArrowDown: Decrease duration (move right in cycle: w -> h -> q -> 8 -> 16)
                    const direction = (keyLower === 'w' || e.key === 'ArrowUp') ? -1 : 1;
                    const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;

                    if (propsRef.current.onNoteDurationStatic) {
                        propsRef.current.onNoteDurationStatic(editingNote.id, cycle[nextIndex] as any);
                    } else {
                        propsRef.current.onNoteRhythmChange?.(cycle[nextIndex] as any);
                    }
                    return;
                }
            }

            // --- Recursive A/D Navigation ---
            if (!isShift && !isCtrl && !isAlt) {
                // A: Advance (Navigate Forward & Deeper)
                if (keyLower === 'a') {
                    e.preventDefault();

                    // 1. If at Finger level
                    if (activePositionIndex !== null && editingNote) {
                        const count = editingNote.positions.length;
                        if (activePositionIndex < count - 1) {
                            // Move to next finger
                            onActivePositionIndexChange?.(activePositionIndex + 1);
                        } else {
                            // Move to level of current chord (exit fingers)
                            onActivePositionIndexChange?.(null as any);

                            // Then try to go to next chord
                            const measureNotes = activeMeasure?.notes || [];
                            const chordIndex = measureNotes.findIndex(n => n.id === editingNote.id);

                            if (chordIndex !== -1 && chordIndex < measureNotes.length - 1) {
                                // Jump to next chord's first finger if possible
                                const nextNote = measureNotes[chordIndex + 1];
                                onSelectNote?.(nextNote.id, false);
                                if (nextNote.positions.length > 0) {
                                    onActivePositionIndexChange?.(0);
                                }
                            } else {
                                // No more chords in measure, go to next measure
                                const measureIndex = measures.findIndex(m => m.id === activeMeasure?.id);
                                if (measureIndex !== -1 && measureIndex < measures.length - 1) {
                                    const nextMeasure = measures[measureIndex + 1];
                                    onSelectMeasure?.(nextMeasure.id);
                                    if (nextMeasure.notes.length > 0) {
                                        onSelectNote?.(nextMeasure.notes[0].id, false);
                                    }
                                }
                            }
                        }
                    }
                    // 2. If at Chord level
                    else if (editingNote && activeMeasure) {
                        if (editingNote.positions.length > 0) {
                            // Go to first finger
                            onActivePositionIndexChange?.(0);
                        } else {
                            // No fingers, go to next chord
                            const measureNotes = activeMeasure.notes;
                            const chordIndex = measureNotes.findIndex(n => n.id === editingNote.id);
                            if (chordIndex !== -1 && chordIndex < measureNotes.length - 1) {
                                onSelectNote?.(measureNotes[chordIndex + 1].id, false);
                            } else {
                                // Next measure
                                const measureIndex = measures.findIndex(m => m.id === activeMeasure.id);
                                if (measureIndex !== -1 && measureIndex < measures.length - 1) {
                                    const nextMeasure = measures[measureIndex + 1];
                                    onSelectMeasure?.(nextMeasure.id);
                                }
                            }
                        }
                    }
                    // 3. If at Measure level
                    else if (activeMeasure) {
                        if (activeMeasure.notes.length > 0) {
                            // Go to first chord
                            onSelectNote?.(activeMeasure.notes[0].id, false);
                        } else {
                            // No chords, next measure
                            const measureIndex = measures.findIndex(m => m.id === activeMeasure.id);
                            if (measureIndex !== -1 && measureIndex < measures.length - 1) {
                                onSelectMeasure?.(measures[measureIndex + 1].id);
                            }
                        }
                    }
                    return;
                }

                // D: Return (Navigate Backward & Shallower)
                if (keyLower === 'd') {
                    e.preventDefault();

                    // 1. If at Finger level
                    if (activePositionIndex !== null && editingNote) {
                        if (activePositionIndex > 0) {
                            // Previous finger
                            onActivePositionIndexChange?.(activePositionIndex - 1);
                        } else {
                            // Return to chord level
                            onActivePositionIndexChange?.(null as any);
                        }
                    }
                    // 2. If at Chord level
                    else if (editingNote && activeMeasure) {
                        const measureNotes = activeMeasure.notes;
                        const chordIndex = measureNotes.findIndex(n => n.id === editingNote.id);

                        if (chordIndex > 0) {
                            // Previous chord's last finger
                            const prevNote = measureNotes[chordIndex - 1];
                            onSelectNote?.(prevNote.id, false);
                            if (prevNote.positions.length > 0) {
                                onActivePositionIndexChange?.(prevNote.positions.length - 1);
                            }
                        } else {
                            // Return to measure level
                            onSelectNote?.(null as any, false);
                        }
                    }
                    // 3. If at Measure level
                    else if (activeMeasure) {
                        const measureIndex = measures.findIndex(m => m.id === activeMeasure.id);
                        if (measureIndex > 0) {
                            // Previous measure's last chord's last finger
                            const prevMeasure = measures[measureIndex - 1];
                            onSelectMeasure?.(prevMeasure.id);
                            if (prevMeasure.notes.length > 0) {
                                const lastNote = prevMeasure.notes[prevMeasure.notes.length - 1];
                                onSelectNote?.(lastNote.id, false);
                                if (lastNote.positions.length > 0) {
                                    onActivePositionIndexChange?.(lastNote.positions.length - 1);
                                }
                            }
                        }
                    }
                    return;
                }

                // W / S: Cycle Type (Beats) or Fingers (Chords)
                if (keyLower === 'w' || keyLower === 's') {
                    e.preventDefault();
                    const direction = keyLower === 'w' ? 1 : -1;

                    // A. If in Beats View (Note Level) - Cycle Beat Type (DEPRECATED: NOW HANDLED BY DURATION OR CTRL+ARROWS)
                    // Removed W/S from here as it now handles duration above

                    // B. If in Fretboard View (Chord/Finger Level)
                    if (editingNote && activePositionIndex !== null) {
                        const cycle = ['X', 1, 2, 3, 4, 'T'];
                        const currentPos = editingNote.positions[activePositionIndex];
                        if (!currentPos) return;

                        // Normalize current finger for lookup
                        let currentFinger: string | number = currentPos.avoid ? 'X' : (currentPos.finger ?? 'X');
                        let currentIndex = cycle.indexOf(currentFinger);
                        if (currentIndex === -1) currentIndex = 0;

                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        const nextFinger = cycle[nextIndex];
                        onSetFingerForPosition?.(activePositionIndex, nextFinger);
                        return;
                    }
                }
            }

            // Only act if there's a note being edited/selected with positions
            if (!editingNote || !editingNote.positions || editingNote.positions.length === 0) {
                return;
            }

            const currentPos = editingNote.positions[activePositionIndex as number];
            if (!currentPos) return;

            // 1. Basic Arrow Keys: Fret and String Navigation
            if (!isShift && !isCtrl && !isAlt && activePositionIndex !== null) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    onSetFretForPosition?.(activePositionIndex, (currentPos.fret || 0) + 1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const isBarre = currentPos.endString !== undefined && currentPos.endString !== currentPos.string;
                    const minFret = isBarre ? 0 : 1;
                    onSetFretForPosition?.(activePositionIndex, Math.max(minFret, (currentPos.fret || 0) - 1));
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const maxStrings = globalSettings?.numStrings || 6;
                    let nextString = currentPos.string;

                    // Logic to find next available string upwards with wrap-around
                    let found = false;
                    for (let i = 1; i <= maxStrings; i++) {
                        let candidate = ((nextString + i - 1) % maxStrings) + 1;
                        const isUsed = editingNote.positions.some((p, idx) => p.string === candidate && idx !== activePositionIndex);
                        if (!isUsed) {
                            onSetStringForPosition?.(activePositionIndex, candidate);
                            found = true;
                            break;
                        }
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const maxStrings = globalSettings?.numStrings || 6;
                    let nextString = currentPos.string;

                    // Logic to find next available string downwards with wrap-around
                    let found = false;
                    for (let i = 1; i <= maxStrings; i++) {
                        let candidate = ((nextString - i - 1 + maxStrings) % maxStrings) + 1;
                        const isUsed = editingNote.positions.some((p, idx) => p.string === candidate && idx !== activePositionIndex);
                        if (!isUsed) {
                            onSetStringForPosition?.(activePositionIndex, candidate);
                            found = true;
                            break;
                        }
                    }
                }
            }

            // 2. Shift + Arrows: Barre Control and Project Transposition
            else if (isShift && !isCtrl && !isAlt) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const currentEndString = currentPos.endString !== undefined ? currentPos.endString : currentPos.string;
                    const maxStrings = globalSettings?.numStrings || 6;
                    if (currentEndString < maxStrings) {
                        onToggleBarreTo?.(currentEndString + 1);
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const currentEndString = currentPos.endString !== undefined ? currentPos.endString : currentPos.string;
                    if (currentEndString > 1) {
                        onToggleBarreTo?.(currentEndString - 1);
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    onTransposeAll?.(1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    onTransposeAll?.(-1);
                }
            }

            // 3. Ctrl + Arrows: Fretboard Rotation and Capo Control
            else if (isCtrl && !isShift && !isAlt) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!setTheme || !theme) return;

                    const numFrets = globalSettings?.numFrets || 5;
                    const options = numFrets > 12
                        ? [
                            { rotation: 0, mirror: false },
                            { rotation: 0, mirror: true }
                        ]
                        : [
                            { rotation: 0, mirror: false },
                            { rotation: 90, mirror: false },
                            { rotation: 270, mirror: true }
                        ];

                    const currentIndex = options.findIndex(opt =>
                        (theme.global?.rotation || 0) === opt.rotation &&
                        (theme.global?.mirror || false) === opt.mirror
                    );

                    const nextIndex = e.key === 'ArrowUp'
                        ? (currentIndex + 1) % options.length
                        : (currentIndex - 1 + options.length) % options.length;

                    const nextOpt = options[nextIndex === -1 ? 0 : nextIndex];
                    setTheme((prev: any) => ({
                        ...prev,
                        global: {
                            ...(prev.global || {}),
                            rotation: nextOpt.rotation,
                            mirror: nextOpt.mirror
                        }
                    }));
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentCapo = globalSettings?.capo || 0;
                    onGlobalSettingsChange?.({ capo: Math.min(12, currentCapo + 1) });
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const currentCapo = globalSettings?.capo || 0;
                    onGlobalSettingsChange?.({ capo: Math.max(0, currentCapo - 1) });
                }
            }

            // 4. Shift + Ctrl + Arrows: Finger Cycling
            else if (isShift && isCtrl && !isAlt) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (editingNote && activePositionIndex !== null) {
                        const direction = e.key === 'ArrowRight' ? 1 : -1;
                        const cycle = ['X', 1, 2, 3, 4, 'T'];
                        const currentPos = editingNote.positions[activePositionIndex];
                        if (!currentPos) return;

                        // Normalize current finger for lookup
                        let currentFinger: string | number = currentPos.avoid ? 'X' : (currentPos.finger ?? 'X');
                        let currentIndex = cycle.indexOf(currentFinger);
                        if (currentIndex === -1) currentIndex = 0;

                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        const nextFinger = cycle[nextIndex];
                        onSetFingerForPosition?.(activePositionIndex, nextFinger);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Run only once to register listener
}
