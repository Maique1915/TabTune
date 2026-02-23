import { useCallback, useRef, useState, useEffect } from 'react';
import { SidebarProps } from '../components/sidebar-types';
import { GeometryProvider } from '../../../engine/infrastructure/drawers/components/GeometryProvider';
import { Duration } from '@/modules/editor/domain/types';

export const useMouseShortcuts = (props: SidebarProps, geometry?: GeometryProvider) => {
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    });

    const [isDraggingBarre, setIsDraggingBarre] = useState(false);
    const isDraggingBarreRef = useRef(false);
    const draggingStartRef = useRef<{ string: number; fret: number; noteId: string; fingerIdx: number } | null>(null);
    const lastDraggedStringRef = useRef<number | null>(null);
    const lastClickRef = useRef<{ time: number; x: number; y: number; string: number; fret: number }>({
        time: 0, x: 0, y: 0, string: -1, fret: -1
    });
    const hasMovedRef = useRef(false);

    const ensureChordExists = useCallback(async () => {
        const {
            activeMeasure, activeDuration, onAddMeasure, onAddNote,
            variant, measures = [], onSelectMeasure, onSelectNote
        } = propsRef.current;

        let measureId = activeMeasure?.id;

        // 1. Ensure Measure
        if (!measureId) {
            if (measures.length > 0) {
                measureId = measures[0].id;
                onSelectMeasure?.(measureId);
            } else if (variant !== 'short' && onAddMeasure) {
                onAddMeasure();
                return null;
            } else {
                return null;
            }
        }

        // 2. Ensure Note/Chord
        const measure = measures.find(m => m.id === measureId) || activeMeasure;
        if (!measure) return null;

        if (measure.notes.length === 0) {
            if (onAddNote) {
                onAddNote(measure.id, activeDuration);
                return null; // Wait for next tick/render
            }
        }

        const note = measure.notes[0];
        const editingNote = propsRef.current.editingNote;

        if (!editingNote && note) {
            onSelectNote?.(note.id, false);
            return note.id;
        }

        return editingNote?.id || note?.id;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!geometry) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (e.currentTarget.width / rect.width);
        const y = (e.clientY - rect.top) * (e.currentTarget.height / rect.height);

        const pos = geometry.getFretStringFromCoords(x, y);
        if (!pos) return;

        const now = Date.now();
        const lastClick = { ...lastClickRef.current };
        const diff = now - lastClick.time;
        // Double click if time is low (500ms) and roughly same area (same fret)
        const isSecondClick = diff < 500 && lastClick.fret === pos.fret;

        // Update last click ref SYNC to ensure subsequent clicks (double-clicks) see it immediately
        lastClickRef.current = { time: now, x, y, string: pos.string, fret: pos.fret };

        hasMovedRef.current = false;

        (async () => {
            const {
                onAddChordPosition, onShowAlert, onActivePositionIndexChange,
                measures = []
            } = propsRef.current;

            // 1. Robust Note ID Acquisition
            let noteId = await ensureChordExists();

            if (!noteId) {
                const firstNote = propsRef.current.activeMeasure?.notes[0] || measures[0]?.notes[0];
                if (firstNote) noteId = firstNote.id;
                else return;
            }

            // Always get the latest editing note from props
            const currentEditingNote = propsRef.current.editingNote;
            let fingerIdx = currentEditingNote?.positions.findIndex(p => p.string === pos.string);
            if (isSecondClick) {
                // intentional action starts here
                isDraggingBarreRef.current = true;
                setIsDraggingBarre(true);
                lastDraggedStringRef.current = pos.string;

                if (fingerIdx !== -1 && fingerIdx !== undefined) {
                    // Start dragging from an EXISTING finger (will toggle remove on MouseUp if no move)
                    draggingStartRef.current = { ...pos, noteId, fingerIdx };
                    onActivePositionIndexChange?.(fingerIdx);
                } else {
                    // Start dragging AFTER ADDING a new finger
                    if (onAddChordPosition) {
                        onAddChordPosition(pos.fret, pos.string);
                        draggingStartRef.current = { ...pos, noteId, fingerIdx: -1 };
                    }
                }
            } else {
                // FIRST CLICK: Just focus/select if it exists
                if (fingerIdx !== -1 && fingerIdx !== undefined) {
                    onActivePositionIndexChange?.(fingerIdx);
                }
            }
        })();
    }, [geometry, ensureChordExists]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDraggingBarreRef.current || !geometry || !draggingStartRef.current) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (e.currentTarget.width / rect.width);
        const y = (e.clientY - rect.top) * (e.currentTarget.height / rect.height);

        const pos = geometry.getFretStringFromCoords(x, y);
        if (!pos) return;

        // Threshold for movement to consider it a "drag" rather than a "slow click"
        const dist = Math.abs(pos.string - draggingStartRef.current.string);
        const yDist = Math.abs(y - lastClickRef.current.y); // Vertical movement is also movement

        if (dist > 0 || yDist > 20) {
            hasMovedRef.current = true;
        }

        if (pos.string !== lastDraggedStringRef.current) {
            const { onToggleBarreTo, editingNote } = propsRef.current;

            let fingerIdx = draggingStartRef.current.fingerIdx;

            // If it's a new finger, we MUST find its actual index now
            if (fingerIdx === -1) {
                const currentEditingNote = editingNote || propsRef.current.editingNote;
                fingerIdx = currentEditingNote?.positions.findIndex(p => p.string === draggingStartRef.current!.string) ?? -1;
            }

            if (fingerIdx !== -1) {
                // Force set the barre to the current string
                onToggleBarreTo?.(pos.string, fingerIdx, true, draggingStartRef.current.string, draggingStartRef.current.fret);
                lastDraggedStringRef.current = pos.string;
            }
        }
    }, [geometry]);

    const handleMouseUp = useCallback(() => {
        if (isDraggingBarreRef.current) {
            // Logic: If it was the second click AND we DIDN'T move:
            if (!hasMovedRef.current && draggingStartRef.current) {
                const { onRemoveChordNote, editingNote } = propsRef.current;

                // We want to know if the finger existed BEFORE the 2nd click.
                // In handleMouseDown, we set fingerIdx.
                // Actually, if we just added it, its index is positions.length.
                // If it existed, its index is < positions.length.

                // Let's use a simpler heuristic: If fingerIdx was valid in the previous state, remove it.
                // We'll trust draggingStartRef.current.fingerIdx.
                const currentEditingNote = editingNote || propsRef.current.editingNote;

                // If it's a "toggle remove" action
                const pos = draggingStartRef.current;
                const existedBefore = currentEditingNote?.positions.some((p, idx) =>
                    p.string === pos.string && idx !== pos.fingerIdx
                ) === false; // Wait, this is getting complex.

                // Simpler: if it was a second click on an existing spot (found fingerIdx != -1), remove it.
                // I will pass the result of fingerIdx from handleMouseDown to draggingStartRef.
                if (onRemoveChordNote && draggingStartRef.current.fingerIdx !== undefined && draggingStartRef.current.fingerIdx !== -1) {
                    // Check if it's still there
                    onRemoveChordNote(draggingStartRef.current.fingerIdx);
                }
            }
        }

        setIsDraggingBarre(false);
        isDraggingBarreRef.current = false;
        draggingStartRef.current = null;
        lastDraggedStringRef.current = null;
    }, []);

    const handleMouseLeave = useCallback(() => {
        handleMouseUp();
    }, [handleMouseUp]);

    return {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseLeave,
        isDraggingBarre
    };
};
