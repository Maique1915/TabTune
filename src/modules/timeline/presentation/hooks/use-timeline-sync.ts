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
    playbackTotalDurationMs
}: TimelineSyncProps) {
    const chords = useMemo(() => measuresToChords(measures, settings), [measures, settings]);

    const activeChordIndex = useMemo(() => {
        if (!activeMeasure || chords.length === 0) return 0;

        const previousMeasures = measures.slice(0, currentMeasureIndex);
        const prevChordsCount = measuresToChords(previousMeasures, settings).length;

        let offset = 0;
        if (editingNoteId) {
            const index = activeMeasure.notes.findIndex(n => n.id === editingNoteId);
            if (index !== -1) offset = index;
        } else if (selectedNoteIds.length > 0) {
            let maxIndex = -1;
            activeMeasure.notes.forEach((n, idx) => {
                if (selectedNoteIds.includes(n.id)) {
                    maxIndex = Math.max(maxIndex, idx);
                }
            });
            if (maxIndex !== -1) offset = maxIndex;
        }

        return prevChordsCount + offset;
    }, [activeMeasure, currentMeasureIndex, measures, settings, chords, editingNoteId, selectedNoteIds]);

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
