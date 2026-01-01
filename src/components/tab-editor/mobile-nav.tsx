"use client";

import { Video, Library, Palette } from "lucide-react";

interface MobileNavProps {
  activePanel: "editor" | "library" | "customize";
  onPanelChange: (panel: "editor" | "library" | "customize") => void;
}

export function MobileNav({ activePanel, onPanelChange }: MobileNavProps) {
  return (
    <nav className="relative z-[60] bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onPanelChange("editor")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activePanel === "editor"
              ? "text-primary"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
        >
          <Video size={24} />
          <span className="text-[10px] font-medium mt-1">Editor</span>
        </button>
        <button
          onClick={() => onPanelChange("library")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activePanel === "library"
              ? "text-primary"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
        >
          <Library size={24} />
          <span className="text-[10px] font-medium mt-1">Library</span>
        </button>
        <button
          onClick={() => onPanelChange("customize")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activePanel === "customize"
              ? "text-primary"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
        >
          <Palette size={24} />
          <span className="text-[10px] font-medium mt-1">Customize</span>
        </button>
      </div>
    </nav>
  );
}
