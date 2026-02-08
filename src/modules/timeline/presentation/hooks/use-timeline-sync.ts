import { useMemo } from "react";
import { measuresToChords } from "@/lib/chords/converter";
import { MeasureData, GlobalSettings } from "@/modules/editor/domain/types";

interface TimelineSyncProps {
    measures: MeasureData[];
    settings: GlobalSettings;
    activeMeasure: MeasureData | null;
    currentMeasureIndex: number;
    editingNoteId: string | null;
    selectedNoteIds: string[];
    playbackIsPlaying: boolean;
    playbackProgress: number;
    playbackTotalDurationMs: number;
    selectedMeasureId: string | null;
}

export function useTimelineSync({
    measures,
    settings,
    activeMeasure,
    currentMeasureIndex,
    editingNoteId,
    selectedNoteIds,
    playbackIsPlaying,
    playbackProgress,
    playbackTotalDurationMs,
    selectedMeasureId
}: TimelineSyncProps) {
    // Use a stable reference for chords by stringifying measures
    const measuresKey = useMemo(() => JSON.stringify(measures.map(m => ({
        id: m.id,
        chordName: m.chordName,
        notes: m.notes.map(n => ({
            id: n.id,
            positions: n.positions,
            duration: n.duration,
            type: n.type,
            strumDirection: n.strumDirection,
            strumFinger: n.strumFinger,
            strumMode: n.strumMode,
            isStrong: n.isStrong,
            decorators: n.decorators
        }))
    }))), [measures]);

    const chords = useMemo(() => {
        console.log('[useTimelineSync] Recalculating chords');
        return measuresToChords(measures, settings);
    }, [measuresKey, settings]);

    const activeChordIndex = useMemo(() => {
        // Robustness: Find measure by ID from current measures list
        const targetMeasure = measures.find(m => m.id === selectedMeasureId) || activeMeasure;

        if (!targetMeasure || chords.length === 0) return 0;

        // Robustness Fix: Recalculate index to ensure sync with activeMeasure
        const measureIndex = measures.findIndex(m => m.id === targetMeasure.id);
        const effectiveIndex = measureIndex !== -1 ? measureIndex : currentMeasureIndex;

        const previousMeasures = measures.slice(0, effectiveIndex);
        const prevChordsCount = measuresToChords(previousMeasures, settings).length;

        let offset = 0;
        if (editingNoteId) {
            const index = targetMeasure.notes.findIndex(n => n.id === editingNoteId);
            if (index !== -1) offset = index;
        } else if (selectedNoteIds.length > 0) {
            let maxIndex = -1;
            targetMeasure.notes.forEach((n, idx) => {
                if (selectedNoteIds.includes(n.id)) {
                    maxIndex = Math.max(maxIndex, idx);
                }
            });
            if (maxIndex !== -1) offset = maxIndex;
        }

        const result = prevChordsCount + offset;
        console.log('[useTimelineSync] activeChordIndex calculation:', {
            currentMeasureIndex,
            prevChordsCount,
            editingNoteId,
            selectedNoteIds,
            offset,
            result,
            totalChords: chords.length
        });
        return result;
    }, [selectedMeasureId, activeMeasure, currentMeasureIndex, measures, settings, chords, editingNoteId, selectedNoteIds]);

    const totalDurationMs = useMemo(() => {
        return chords.reduce((acc, chord) => acc + (chord.duration || 0), 0);
    }, [chords]);

    const currentCursorMs = useMemo(() => {
        if (playbackIsPlaying && playbackTotalDurationMs > 0) {
            return playbackProgress * playbackTotalDurationMs;
        }

        if (!chords.length) return 0;
        const safeIndex = Math.min(activeChordIndex, chords.length);
        const previousChords = chords.slice(0, safeIndex);
        return previousChords.reduce((acc, chord) => acc + (chord.duration || 0), 0);
    }, [chords, activeChordIndex, playbackIsPlaying, playbackProgress, playbackTotalDurationMs]);

    return {
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs
    };
}
