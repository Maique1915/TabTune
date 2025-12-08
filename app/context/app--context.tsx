
"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { Chord } from "@/lib/chords";

export interface ChordDiagramColors {
  cardColor: string;
  fingerColor: string;
  fretboardColor: string;
  borderColor: string;
  chordNameColor: string;
  textColor: string;
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
  fingerOpacity: number;
}

interface AppContextType {
  selectedChords: Chord[];
  setSelectedChords: Dispatch<SetStateAction<Chord[]>>;
  colors: ChordDiagramColors;
  setColors: Dispatch<SetStateAction<ChordDiagramColors>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_COLORS: ChordDiagramColors = {
  cardColor: '#1E1E1E',
  fretboardColor: '#333333',
  borderColor: '#FFFFFF',
  textColor: '#FFA500',
  chordNameColor: '#FFFFFF',
  borderWidth: 2,
  stringThickness: 2,
  fingerColor: '#FFFFFF',
  fingerTextColor: '#000000',
  fingerBorderColor: '#FFFFFF',
  fingerBorderWidth: 3,
  fingerBoxShadowHOffset: 0,
  fingerBoxShadowVOffset: 0,
  fingerBoxShadowBlur: 0,
  fingerBoxShadowSpread: 0,
  fingerBoxShadowColor: 'rgba(0,0,0,0)',
  fingerOpacity: 0.5,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedChords, setSelectedChords] = useState<Chord[]>([]);
  const [colors, setColors] = useState<ChordDiagramColors>(DEFAULT_COLORS);

  return (
    <AppContext.Provider
      value={{
        selectedChords,
        setSelectedChords,
        colors,
        setColors,
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
