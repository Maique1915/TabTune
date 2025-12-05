
"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { Achord, ChordDiagramProps } from "@/lib/types";

export interface ChordDiagramColors {
  cardColor: string;
  fingerColor: string;
  fretboardColor: string;
  borderColor: string;
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
  fingerBackgroundAlpha: number;
}

interface AppContextType {
  selectedChords: ChordDiagramProps[];
  setSelectedChords: Dispatch<SetStateAction<ChordDiagramProps[]>>;
  colors: ChordDiagramColors;
  setColors: Dispatch<SetStateAction<ChordDiagramColors>>;
}

export const DEFAULT_COLORS: ChordDiagramColors = {
  cardColor: "#1E1E1E",
  fingerColor: "#666666ff",
  fretboardColor: "#333333",
  borderColor: "#FFFFFF",
  textColor: "#f08726ff",
  borderWidth: 0,
  stringThickness: 2,
  fingerTextColor: "#FFFFFF",
  fingerBorderColor: "#FFFFFF",
  fingerBorderWidth: 1,
  fingerBoxShadowHOffset: 0,
  fingerBoxShadowVOffset: 0,
  fingerBoxShadowBlur: 0,
  fingerBoxShadowSpread: 0,
  fingerBoxShadowColor: "rgba(0,0,0,0)",
  fingerOpacity: 0.8,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedChords, setSelectedChords] = useState<ChordDiagramProps[]>([]);
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
