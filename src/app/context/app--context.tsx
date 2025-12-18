
"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { Achord, ChordDiagramProps, ChordWithTiming } from "@/lib/types";
import type { TimelineState } from "@/lib/timeline/types";

export interface ChordDiagramColors {
  cardColor: string;
  fingerColor: string;
  fretboardColor: string;
  borderColor: string;
  fretColor: string; // Cor específica para os trastes
  textColor: string;
  chordNameColor: string; // Nova propriedade para a cor do nome do acorde
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
}

export type AnimationType = "carousel" | "static-fingers";

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
}

export const DEFAULT_COLORS: ChordDiagramColors = {
  cardColor: "#000000",              // Fundo preto
  fingerColor: "#200f0f",            // Dedos brancos
  fretboardColor: "#303135",         // Braço cinza escuro moderno
  borderColor: "#FFFFFF",            // Cordas brancas
  fretColor: "#000000",              // Trastes brancos
  textColor: "#FF8C42",              // Nomes das cordas laranja
  chordNameColor: "#FFFFFF",         // Nome do acorde branco
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
  const [selectedChords, setSelectedChords] = useState<ChordWithTiming[]>([]);
  const [timelineState, setTimelineState] = useState<TimelineState>(INITIAL_TIMELINE_STATE);
  const [colors, setColors] = useState<ChordDiagramColors>(DEFAULT_COLORS);
  const [animationType, setAnimationType] = useState<AnimationType>("carousel");
  const [playbackTransitionsEnabled, setPlaybackTransitionsEnabled] = useState(true);
  const [playbackBuildEnabled, setPlaybackBuildEnabled] = useState(true);
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

  const requestPlaybackSeek = (progress: number) => {
    setPlaybackSeekProgress(progress);
    setPlaybackSeekNonce((n) => n + 1);
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
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
