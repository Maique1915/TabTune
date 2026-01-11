"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState, useRef, useMemo } from "react";
import type { Achord, ChordDiagramProps, ChordWithTiming } from "@/lib/types";
import type { TimelineState } from "@/lib/timeline/types";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { generateClipId } from "@/lib/timeline/utils";
import { getChordDisplayData } from "@/lib/chord-logic";
import { INSTRUMENTS } from "@/lib/instruments";

export interface StudioState {
  selectedChords: ChordWithTiming[];
  timelineState: TimelineState;
  colors: ChordDiagramColors;
  animationType: AnimationType;
  playbackTransitionsEnabled: boolean;
  playbackBuildEnabled: boolean;
  instrumentId: string;
  tuningIndex: number;
}

export interface ChordDiagramColors {
  cardColor: string;
  fingerColor: string;
  fretboardColor: string;
  borderColor: string;
  fretColor: string; // Cor específica para os trastes
  textColor: string;
  chordNameColor: string; // Nova propriedade para a cor do nome do acorde
  chordNameOpacity: number;
  chordNameShadow: boolean;
  chordNameShadowColor: string;
  chordNameShadowBlur: number;
  chordNameStrokeColor: string;
  chordNameStrokeWidth: number;
  borderWidth: number;
  stringThickness: number;
  fingerTextColor: string;
  fingerBorderColor: string;
  fingerBorderWidth: number;
  fingerBoxShadowHOffset: number;
  fingerBoxShadowVOffset: number;
  fingerBoxShadowBlur: number;
  fingerBoxShadowSpread: number;
  fingerBoxShadowColor: string;
  fingerBackgroundAlpha: number;
  fretboardScale: number; // Nova propriedade para escala geral do braço
  rotation: 0 | 90 | 270;
  mirror: boolean;
}

export type AnimationType = "carousel" | "static-fingers" | "guitar-fretboard";

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

  minClipDurationMs: number; // Adicione esta linha

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

// ... imports ...


export const DEFAULT_COLORS: ChordDiagramColors = {
  cardColor: "#000000",              // Fundo preto
  fingerColor: "#200f0f",            // Dedos brancos
  fretboardColor: "#303135",         // Braço cinza escuro moderno
  borderColor: "#FFFFFF",            // Cordas brancas
  fretColor: "#000000",              // Trastes brancos
  textColor: "#FF8C42",              // Nomes das cordas laranja
  chordNameColor: "#22d3ee",         // Nome do acorde cyan default
  chordNameOpacity: 1,
  chordNameShadow: true,
  chordNameShadowColor: "#22d3ee",
  chordNameShadowBlur: 10,
  chordNameStrokeColor: "#000000",
  chordNameStrokeWidth: 3,
  borderWidth: 3,
  stringThickness: 3,                // Cordas um pouco mais grossas
  fingerTextColor: "#ffffff",        // Texto dos dedos preto
  fingerBorderColor: "#FFFFFF",      // Borda branca nos dedos
  fingerBorderWidth: 4,              // Borda mais visível
  fingerBoxShadowHOffset: 0,
  fingerBoxShadowVOffset: 0,
  fingerBoxShadowBlur: 0,
  fingerBoxShadowSpread: 0,
  fingerBoxShadowColor: "#000000",
  fingerBackgroundAlpha: 0.3,        // Dedos totalmente opacos
  fretboardScale: 1.0,               // Escala padrão
  rotation: 0,                       // Rotação padrão
  mirror: false,                     // Espelhamento padrão
};

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

  // 2. Compatibility Setters
  const setSelectedChords = (action: SetStateAction<ChordWithTiming[]>) => {
    setState(prev => ({
      ...prev,
      selectedChords: typeof action === "function" ? (action as Function)(prev.selectedChords) : action
    }));
  };

  const setTimelineState = (action: SetStateAction<TimelineState>) => {
    setState(prev => ({
      ...prev,
      timelineState: typeof action === "function" ? (action as Function)(prev.timelineState) : action
    }));
  };

  const setColors = (action: SetStateAction<ChordDiagramColors>) => {
    setState(prev => ({
      ...prev,
      colors: typeof action === "function" ? (action as Function)(prev.colors) : action
    }));
  };

  const setAnimationType = (action: SetStateAction<AnimationType>) => {
    setState(prev => ({
      ...prev,
      animationType: typeof action === "function" ? (action as Function)(prev.animationType) : action
    }));
  };

  const setPlaybackTransitionsEnabled = (action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackTransitionsEnabled: typeof action === "function" ? (action as Function)(prev.playbackTransitionsEnabled) : action
    }));
  };

  const setPlaybackBuildEnabled = (action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackBuildEnabled: typeof action === "function" ? (action as Function)(prev.playbackBuildEnabled) : action
    }));
  };

  const setInstrumentId = (id: string) => {
    setState(prev => ({ ...prev, instrumentId: id, tuningIndex: 0 }));
  };

  const setTuningIndex = (index: number) => {
    setState(prev => ({ ...prev, tuningIndex: index }));
  };

  const addChordToTimeline = (chordData: ChordDiagramProps) => {
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
  };

  // 3. Ephemeral State (No Undo)
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

  const minClipDurationMs = 200; // Defina um valor padrão ou obtenha de outro lugar


  const requestPlaybackSeek = (progress: number) => {
    setPlaybackSeekProgress(progress);
    setPlaybackSeekNonce((n) => n + 1);
  };

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

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
    timelineState,
    colors,
    animationType,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    playbackIsPlaying,
    playbackIsPaused,
    playbackProgress,
    playbackTotalDurationMs,
    playbackIsScrubbing,
    playbackSeekProgress,
    playbackSeekNonce,
    isRendering,
    renderProgress,
    renderCancelRequested,
    undo,
    redo,
    canUndo,
    canRedo,
    minClipDurationMs,
    addChordToTimeline
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
