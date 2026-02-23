"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState, useRef, useMemo, useCallback } from "react";
import type { ChordDiagramProps, ChordWithTiming, FretboardTheme } from "@/modules/core/domain/types";
import type { TimelineState } from "@/modules/chords/domain/types";
import { useUndoRedo } from "@/modules/editor/presentation/hooks/use-undo-redo";
import { generateClipId } from "@/modules/chords/application/utils";
import { getChordDisplayData } from "@/modules/core/domain/chord-logic";
import { INSTRUMENTS } from "@/lib/instruments";
import { DEFAULT_COLORS } from "@/modules/editor/presentation/constants";

export interface StudioState {
  selectedChords: ChordWithTiming[];
  timelineState: TimelineState;
  colors: FretboardTheme;
  animationType: AnimationType;
  playbackTransitionsEnabled: boolean;
  playbackBuildEnabled: boolean;
  instrumentId: string;
  tuningIndex: number;
}

// Type alias for backward compatibility
export type ChordDiagramColors = FretboardTheme;

export type AnimationType = "carousel" | "static-fingers" | "dynamic-fingers" | "guitar-fretboard";

interface AppContextType {
  selectedChords: ChordWithTiming[];
  setSelectedChords: Dispatch<SetStateAction<ChordWithTiming[]>>;
  timelineState: TimelineState;
  setTimelineState: Dispatch<SetStateAction<TimelineState>>;
  colors: ChordDiagramColors;
  setColors: Dispatch<SetStateAction<ChordDiagramColors>>;
  animationType: AnimationType;
  setAnimationType: Dispatch<SetStateAction<AnimationType>>;

  playbackTransitionsEnabled: boolean;
  setPlaybackTransitionsEnabled: Dispatch<SetStateAction<boolean>>;
  playbackBuildEnabled: boolean;
  setPlaybackBuildEnabled: Dispatch<SetStateAction<boolean>>;

  playbackIsPlaying: boolean;
  setPlaybackIsPlaying: Dispatch<SetStateAction<boolean>>;
  playbackIsPaused: boolean;
  setPlaybackIsPaused: Dispatch<SetStateAction<boolean>>;
  playbackProgress: number; // 0..1
  setPlaybackProgress: Dispatch<SetStateAction<number>>;
  playbackTotalDurationMs: number;
  setPlaybackTotalDurationMs: Dispatch<SetStateAction<number>>;

  playbackIsScrubbing: boolean;
  setPlaybackIsScrubbing: Dispatch<SetStateAction<boolean>>;
  playbackSeekProgress: number; // 0..1
  playbackSeekNonce: number;
  requestPlaybackSeek: (progress: number) => void;

  isRendering: boolean;
  setIsRendering: Dispatch<SetStateAction<boolean>>;
  renderProgress: number; // 0..100
  setRenderProgress: Dispatch<SetStateAction<number>>;
  renderCancelRequested: boolean;
  setRenderCancelRequested: Dispatch<SetStateAction<boolean>>;

  minClipDurationMs: number;

  audioRefs: React.MutableRefObject<Record<string, HTMLAudioElement | null>>;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  addChordToTimeline: (chordData: ChordDiagramProps) => void;

  instrumentId: string;
  setInstrumentId: (id: string) => void;
  tuningIndex: number;
  setTuningIndex: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TIMELINE_STATE: TimelineState = {
  tracks: [
    {
      id: "chords-track",
      name: "Acordes",
      type: 'chord',
      clips: []
    }
  ],
  totalDuration: 10000, // 10s default
  zoom: 100 // 100px por segundo
};


export function AppProvider({ children }: { children: React.ReactNode }) {

  // 1. Unified Undo/Redo State
  const initialStudioState = useMemo<StudioState>(() => ({
    selectedChords: [],
    timelineState: INITIAL_TIMELINE_STATE,
    colors: DEFAULT_COLORS,
    animationType: "carousel",
    playbackTransitionsEnabled: true,
    playbackBuildEnabled: false,
    instrumentId: "violao",
    tuningIndex: 0
  }), []);

  const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<StudioState>(initialStudioState);

  const {
    selectedChords,
    timelineState,
    colors,
    animationType,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    instrumentId,
    tuningIndex
  } = state;

  // 3. Ephemeral State (No Undo) - MOVED UP
  const [playbackIsPlaying, setPlaybackIsPlaying] = useState(false);
  const [playbackIsPaused, setPlaybackIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackTotalDurationMs, setPlaybackTotalDurationMs] = useState(0);
  const [playbackIsScrubbing, setPlaybackIsScrubbing] = useState(false);
  const [playbackSeekProgress, setPlaybackSeekProgress] = useState(0);
  const [playbackSeekNonce, setPlaybackSeekNonce] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderCancelRequested, setRenderCancelRequested] = useState(false);

  const minClipDurationMs = 200;

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // 2. Compatibility Setters & Handlers
  const setSelectedChords = useCallback((action: SetStateAction<ChordWithTiming[]>) => {
    setState(prev => ({
      ...prev,
      selectedChords: typeof action === "function" ? (action as Function)(prev.selectedChords) : action
    }));
  }, [setState]);

  const setTimelineState = useCallback((action: SetStateAction<TimelineState>) => {
    setState(prev => ({
      ...prev,
      timelineState: typeof action === "function" ? (action as Function)(prev.timelineState) : action
    }));
  }, [setState]);

  const setColors = useCallback((action: SetStateAction<ChordDiagramColors>) => {
    setState(prev => ({
      ...prev,
      colors: typeof action === "function" ? (action as Function)(prev.colors) : action
    }));
  }, [setState]);

  const setAnimationType = useCallback((action: SetStateAction<AnimationType>) => {
    setState(prev => ({
      ...prev,
      animationType: typeof action === "function" ? (action as Function)(prev.animationType) : action
    }));
  }, [setState]);

  const setPlaybackTransitionsEnabled = useCallback((action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackTransitionsEnabled: typeof action === "function" ? (action as Function)(prev.playbackTransitionsEnabled) : action
    }));
  }, [setState]);

  const setPlaybackBuildEnabled = useCallback((action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackBuildEnabled: typeof action === "function" ? (action as Function)(prev.playbackBuildEnabled) : action
    }));
  }, [setState]);

  const setInstrumentId = useCallback((id: string) => {
    setState(prev => ({ ...prev, instrumentId: id, tuningIndex: 0 }));
  }, [setState]);

  const setTuningIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, tuningIndex: index }));
  }, [setState]);

  const addChordToTimeline = useCallback((chordData: ChordDiagramProps) => {
    console.log('[AppProvider] addChordToTimeline called', chordData);
    setState((prev) => {
      const selectedInst = INSTRUMENTS.find(i => i.id === prev.instrumentId) || INSTRUMENTS[0];
      const stringNames = selectedInst.tunings[prev.tuningIndex];

      const optimizedChordData = {
        ...chordData,
        stringNames
      };

      const newChordWithTiming: ChordWithTiming = {
        chord: optimizedChordData,
        duration: 2000,
        finalChord: optimizedChordData,
        transportDisplay: 0
      };

      // 1. Update selectedChords
      const newSelectedChords = [...prev.selectedChords, newChordWithTiming];

      // 2. Update TimelineState
      const chordTrackIndex = prev.timelineState.tracks.findIndex(t => t.type === 'chord');
      if (chordTrackIndex === -1) return prev;

      const chordTrack = prev.timelineState.tracks[chordTrackIndex];
      const lastClip = chordTrack.clips[chordTrack.clips.length - 1];
      const newStart = lastClip ? lastClip.start + lastClip.duration : 0;
      const duration = Math.max(newChordWithTiming.duration || 2000, minClipDurationMs);
      const { finalChord, transportDisplay } = getChordDisplayData(chordData);

      const newClip = {
        id: generateClipId(),
        type: 'chord' as const,
        chord: optimizedChordData,
        finalChord,
        transportDisplay,
        start: newStart,
        duration
      };

      const newClips = [...chordTrack.clips, newClip];
      const newTracks = [...prev.timelineState.tracks];
      newTracks[chordTrackIndex] = { ...chordTrack, clips: newClips };

      const totalNeeded = newClips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0);
      const totalDuration = Math.max(1000, playbackTotalDurationMs || 10000, totalNeeded);

      return {
        ...prev,
        selectedChords: newSelectedChords,
        timelineState: {
          ...prev.timelineState,
          tracks: newTracks,
          totalDuration
        }
      };
    });
  }, [setState, minClipDurationMs, playbackTotalDurationMs]);

  const requestPlaybackSeek = useCallback((progress: number) => {
    setPlaybackSeekProgress(progress);
    setPlaybackSeekNonce((n) => n + 1);
  }, []);

  const value: AppContextType = useMemo(() => ({
    selectedChords,
    setSelectedChords,
    timelineState,
    setTimelineState,
    colors,
    setColors,
    animationType,
    setAnimationType,

    playbackTransitionsEnabled,
    setPlaybackTransitionsEnabled,
    playbackBuildEnabled,
    setPlaybackBuildEnabled,

    playbackIsPlaying,
    setPlaybackIsPlaying,
    playbackIsPaused,
    setPlaybackIsPaused,
    playbackProgress,
    setPlaybackProgress,
    playbackTotalDurationMs,
    setPlaybackTotalDurationMs,

    playbackIsScrubbing,
    setPlaybackIsScrubbing,
    playbackSeekProgress,
    playbackSeekNonce,
    requestPlaybackSeek,

    isRendering,
    setIsRendering,
    renderProgress,
    setRenderProgress,
    renderCancelRequested,
    setRenderCancelRequested,

    minClipDurationMs,

    audioRefs,

    undo,
    redo,
    canUndo,
    addChordToTimeline,
    instrumentId: state.instrumentId,
    setInstrumentId,
    tuningIndex: state.tuningIndex,
    setTuningIndex,
  }), [
    selectedChords,
    setSelectedChords,
    timelineState,
    setTimelineState,
    colors,
    setColors,
    animationType,
    setAnimationType,
    playbackTransitionsEnabled,
    setPlaybackTransitionsEnabled,
    playbackBuildEnabled,
    setPlaybackBuildEnabled,
    playbackIsPlaying,
    playbackIsPaused,
    playbackProgress,
    playbackTotalDurationMs,
    playbackIsScrubbing,
    playbackSeekProgress,
    playbackSeekNonce,
    requestPlaybackSeek,
    isRendering,
    renderProgress,
    renderCancelRequested,
    undo,
    redo,
    canUndo,
    minClipDurationMs,
    addChordToTimeline,
    state.instrumentId,
    setInstrumentId,
    state.tuningIndex,
    setTuningIndex
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
