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
    propsRef.current = props;

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

            const isShift = e.shiftKey;
            const isCtrl = e.ctrlKey || e.metaKey;
            const isAlt = e.altKey;

            // Ctrl + D: Duplicate Measure
            if (isCtrl && !isShift && !isAlt && e.key === 'd') {
                e.preventDefault();
                if (activeMeasure && onCopyMeasure) {
                    onCopyMeasure(activeMeasure.id);
                }
                return;
            }

            // --- Beats Specific Shortcuts (Note-level) ---
            if (variant === 'beats' && editingNote) {
                // Ctrl + ArrowRight/Left: Cycle Strum Direction
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
                // Ctrl + Shift + ArrowRight/Left: Cycle Strum Finger
                else if (isCtrl && isShift && !isAlt) {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const cycle = ['', 'P', 'i', 'm', 'a'];
                        const currentFinger = editingNote.strumFinger || '';
                        const currentIndex = cycle.indexOf(currentFinger);
                        const direction = e.key === 'ArrowRight' ? 1 : -1;
                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        onUpdateNote?.({ strumFinger: cycle[nextIndex] });
                        return;
                    }
                }
                // Alt + Arrows: Cycle Type (Note-level but uses Alt)
                else if (isAlt && !isShift && !isCtrl) {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const cycle: ('down' | 'up' | 'pause' | 'mute')[] = ['down', 'up', 'pause', 'mute'];
                        const currentDir = editingNote.strumDirection || 'down';
                        const currentIndex = cycle.indexOf(currentDir as any);
                        const direction = e.key === 'ArrowDown' ? 1 : -1;
                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        onUpdateNote?.({ strumDirection: cycle[nextIndex] });
                        return;
                    }
                }
                // Alt + Shift + Arrows: Cycle Duration
                else if (isAlt && isShift && !isCtrl) {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const cycle: string[] = ['w', 'h', 'q', '8', '16'];
                        const currentDuration = editingNote.duration || 'q';
                        const currentIndex = cycle.indexOf(currentDuration);
                        const direction = e.key === 'ArrowDown' ? 1 : -1;
                        const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                        if (propsRef.current.onNoteDurationStatic) {
                            propsRef.current.onNoteDurationStatic(editingNote.id, cycle[nextIndex] as any);
                        } else {
                            propsRef.current.onNoteRhythmChange?.(cycle[nextIndex] as any);
                        }
                        return;
                    }
                }
            }

            // Alt + ArrowUp/Down: Hierarchical Navigation (Generic)
            if (isAlt && !isShift && !isCtrl) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();

                    // 1. Navigate Fingers (if a finger is selected)
                    if (activePositionIndex !== null && editingNote) {
                        const count = editingNote.positions.length;
                        if (count > 0) {
                            const nextIndex = e.key === 'ArrowDown'
                                ? (activePositionIndex + 1) % count
                                : (activePositionIndex - 1 + count) % count;
                            onActivePositionIndexChange?.(nextIndex);
                        }
                    }
                    // 2. Navigate Chords
                    else if (editingNote && activeMeasure) {
                        const count = activeMeasure.notes.length;
                        const currentIndex = activeMeasure.notes.findIndex(n => n.id === editingNote.id);
                        if (currentIndex !== -1) {
                            const nextIndex = e.key === 'ArrowDown'
                                ? (currentIndex + 1) % count
                                : (currentIndex - 1 + count) % count;
                            onSelectNote?.(activeMeasure.notes[nextIndex].id, false);
                        }
                    }
                    // 3. Navigate Measures
                    else if (activeMeasure && measures.length > 0) {
                        const count = measures.length;
                        const currentIndex = measures.findIndex(m => m.id === activeMeasure.id);
                        if (currentIndex !== -1) {
                            const nextIndex = e.key === 'ArrowDown'
                                ? (currentIndex + 1) % count
                                : (currentIndex - 1 + count) % count;
                            onSelectMeasure?.(measures[nextIndex].id);
                        }
                    }
                    return;
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
                    if (currentPos.string < maxStrings) {
                        const isUsed = editingNote.positions.some((p, i) => p.string === currentPos.string + 1 && i !== activePositionIndex);
                        if (!isUsed) {
                            onSetStringForPosition?.(activePositionIndex, currentPos.string + 1);
                        }
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (currentPos.string > 1) {
                        const isUsed = editingNote.positions.some((p, i) => p.string === currentPos.string - 1 && i !== activePositionIndex);
                        if (!isUsed) {
                            onSetStringForPosition?.(activePositionIndex, currentPos.string - 1);
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

            // 4. Shift + Ctrl + Arrows: Modular Finger Cycling
            else if (isShift && isCtrl && !isAlt) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();

                    const cycle = ['X', 1, 2, 3, 4, 'T'];

                    // Normalize current finger for lookup
                    let currentFinger: string | number = currentPos.avoid ? 'X' : (currentPos.finger ?? 'X');

                    let currentIndex = cycle.indexOf(currentFinger);
                    if (currentIndex === -1) {
                        currentIndex = 0;
                    }

                    const direction = e.key === 'ArrowRight' ? 1 : -1;
                    const nextIndex = (currentIndex + direction + cycle.length) % cycle.length;
                    const nextFinger = cycle[nextIndex];

                    if (activePositionIndex !== null) {
                        onSetFingerForPosition?.(activePositionIndex, nextFinger);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Run only once to register listener
}
