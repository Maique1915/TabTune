
"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface AppContextType {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  tabNotation: string;
  setTabNotation: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const exampleCode = `import {makeScene2D} from '@motion-canvas/2d';
import {Rect, Line, Circle, Text} from '@motion-canvas/2d/lib/components';

export default makeScene2D(function* (view) {
  // Fundo da tela
  view.fill('#101922');

  // Cartão principal
  const cardWidth = 260;
  const cardHeight = 360;

  view.add(
    <Rect
      x={0}
      y={0}
      width={cardWidth}
      height={cardHeight}
      radius={20}
      fill="#2A2A2A"
      stroke="#34495E"
      lineWidth={2}
      layout
      direction="column"
      gap={20}
      paddingTop={30}
    >
      {/* Título */}
      <Text
        text="EMajor"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize={32}
        fill="#00BCD4"
        y={-120}
      />

      {/* Área do braço do violão */}
      <Rect
        width={cardWidth - 40}
        height={cardHeight - 120}
        fill="#2A2A2A"
        stroke="#222F3D"
        lineWidth={2}
        radius={15}
        clip
      >
        {/* Nut (parte escura de cima) */}
        <Rect
          y={-((cardHeight - 120) / 2) + 10}
          width={cardWidth - 40}
          height={10}
          fill="#1E1E1E"
          offset={[0, -0.5]}
        />
      </Rect>
    </Rect>,
  );
});
`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(exampleCode);
  const [tabNotation, setTabNotation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,
        tabNotation,
        setTabNotation,
        isLoading,
        setIsLoading,
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
