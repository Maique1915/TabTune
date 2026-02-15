import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';

export interface BaseTimelineProps {
    measures: MeasureData[];
    selectedNoteIds: string[];
    timeSignature: string;
    activeDuration: Duration;
    bpm?: number;
    hasClipboard: boolean;
    onSelectNote: (id: string, multi: boolean) => void;
    onDoubleClickNote: (id: string) => void;
    onAddNote: (measureId: string) => void;
    onUpdateNote: (id: string, updates: Partial<NoteData>) => void;
    onRemoveNote?: (id: string) => void;
    onCopyNote?: (id: string) => void;
    onRemoveMeasure: (id: string) => void;
    onAddMeasure: () => void;
    onUpdateMeasure: (id: string, updates: Partial<MeasureData>) => void;
    onToggleCollapse: (id: string) => void;
    onCopyMeasure: (id: string) => void;
    onPasteMeasure: (id: string) => void;
    onReorderMeasures: (from: number, to: number) => void;
    onReorderNotes: (measureId: string, from: number, to: number) => void;
    onSelectMeasure: (id: string) => void;
    onDeselectAll: () => void;
    selectedMeasureId: string | null;
    totalDurationMs?: number;
    currentCursorMs?: number;
    onSeek?: (ms: number) => void;
    variant?: 'short' | 'full' | 'beats';
}
