"use client";

import { useState, useMemo } from "react";
import "./library-panel.css";
// Usando apenas campos nativos
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { chordData, getNome, notes, complements, basses } from "@/lib/chords";
import { transpose as transposeChord, getChordDisplayData } from "@/lib/chord-logic";
import { useAppContext } from "@/app/context/app--context";
import { useToast } from "@/hooks/use-toast";
import { ChordDiagramProps } from "@/lib/types";
import { ChordDiagram } from "./chord-diagram";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}


export function LibraryPanel({ isMobile, isOpen, onClose }: LibraryPanelProps) {
  const { setSelectedChords } = useAppContext();
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");
  // id fixo para o checkbox
  // const filterId = "filter-toggle";

  const handleChordSelect = (chord: ChordDiagramProps) => {
    const { finalChord, transportDisplay } = getChordDisplayData(chord);
    setSelectedChords((prev) => [...prev, {
      chord: chord,
      duration: 2000,
      finalChord: finalChord,
      transportDisplay: transportDisplay,
    }]);
    toast({
      title: `${getNome(chord.chord)} added`,
    });
    if (isMobile) {
      onClose?.();
    }
  };

console.log("Renderizando LibraryPanel");

  const scaleNotes = useMemo(() => {
    const scaleIndex = notes.indexOf(selectedScale);
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return majorScaleIntervals.map((interval) => notes[(scaleIndex + interval) % 12]);
  }, [selectedScale]);

  const bassNotes = useMemo(() => {
    const scaleIndex = notes.indexOf(selectedScale);
    return ["Root", ...Array.from({ length: 11 }, (_, i) => `/${notes[(scaleIndex + i + 1) % 12].replace(/#/g, '♯')}`)];
  }, [selectedScale]);

  const transposedChords = useMemo(() => {
    if (selectedNote === "all") return chordData;
    const targetNoteIndex = notes.indexOf(selectedNote);
    return chordData.map((chordItem) => {
      const interval = targetNoteIndex - chordItem.origin;
      const newNoteIndex = (chordItem.chord.note + interval + 12) % 12;
      return transposeChord(chordItem, { ...chordItem.chord, note: newNoteIndex });
    });
  }, [selectedNote]);

  const filteredChords = useMemo(() => {
    let filtered = transposedChords;
    if (selectedQuality !== "all") {
      filtered = filtered.filter((chord) => {
        const comp = complements[chord.chord.complement];
        if (selectedQuality === "major") return ["Major", "6", "7+", "7(#5)"].includes(comp);
        if (selectedQuality === "minor") return comp.startsWith("m") && comp !== "Major";
        if (selectedQuality === "dim") return ["°", "m7(b5)"].includes(comp);
        return true;
      });
    }
    if (selectedExtensions.length > 0) {
      filtered = filtered.filter((chord) => {
        const comp = complements[chord.chord.complement];
        return selectedExtensions.some((ext) => comp.includes(ext));
      });
    }
    if (selectedBass !== "all") {
      const bassIndex = basses.indexOf(selectedBass);
      filtered = filtered.filter((chord) => chord.chord.bass === bassIndex);
    }
    return filtered;
  }, [transposedChords, selectedQuality, selectedExtensions, selectedBass]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((e) => e !== extension) : [...prev, extension]
    );
  };

  const FiltersContent = () => (
    <div
      className={cn(
        "p-4 space-y-3 bg-panel border-r h-full overflow-y-auto transition-all duration-200",
        { "w-40": !isMobile, "w-full": isMobile }
      )}
    >
      <h2 className="text-lg font-bold text-white">Filters</h2>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Scale</Label>
        <select
          className="bg-input h-9 text-sm w-full rounded-md border px-3 py-2"
          value={selectedScale}
          onChange={e => setSelectedScale(e.target.value)}
        >
          {notes.map((note) => (
            <option key={note} value={note}>{note.replace(/#/g, '♯')}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Note</Label>
        <select
          className="bg-input h-9 text-sm w-full rounded-md border px-3 py-2"
          value={selectedNote}
          onChange={e => setSelectedNote(e.target.value)}
        >
          <option value="all">All</option>
          {scaleNotes.map((note) => (
            <option key={note} value={note}>{note.replace(/#/g, '♯')}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Quality</Label>
        <select
          className="bg-input h-9 text-sm w-full rounded-md border px-3 py-2"
          value={selectedQuality}
          onChange={e => setSelectedQuality(e.target.value)}
        >
          <option value="all">All</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="dim">Dim</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Bass</Label>
        <select
          className="bg-input h-9 text-sm w-full rounded-md border px-3 py-2"
          value={selectedBass}
          onChange={e => setSelectedBass(e.target.value)}
        >
          <option value="all">All</option>
          {basses.map((bass, index) => (
            <option key={bass} value={bass}>{bassNotes[index]}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Extensions</Label>
        <div className="flex flex-wrap gap-1.5">
          {["4", "6", "7", "7+", "9", "11", "13", "#5", "b5"].map((ext) => (
            <button key={ext} onClick={() => handleExtensionToggle(ext)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${selectedExtensions.includes(ext) ? "bg-accent text-accent-foreground" : "bg-input text-foreground hover:bg-accent/50"}`}>
              {ext}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const rootClasses = cn(
    "flex flex-col bg-surface-light dark:bg-surface-dark transition-transform duration-300 ease-in-out",
    isMobile
      ? `fixed inset-x-0 bottom-0 h-[85vh] rounded-t-2xl shadow-2xl z-50 ${isOpen ? "translate-y-0" : "translate-y-full"}`
      : "relative w-[448px] h-full border-r border-gray-200 dark:border-gray-800"
  );

  return (
    <div className={rootClasses}>
      {isMobile && (
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      )}

      <div className={cn("flex items-center justify-between p-4 border-b", { "flex-row-reverse": isMobile })}>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Library</h2>
          <p className="text-xs text-muted-foreground">{filteredChords.length} chords</p>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Filtro controlado só por CSS */}
        <div className="filter-panel-wrapper">
          <FiltersContent />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-3")}> 
            {filteredChords.map((chord) => (
              <div
                key={`${chord.chord.note}-${chord.chord.complement}-${chord.chord.bass}-${JSON.stringify(chord.positions)}`}
                className="group relative cursor-pointer rounded-lg overflow-hidden aspect-square flex items-center justify-center hover:ring-2 hover:ring-accent transition-all bg-background/50"
                onClick={() => handleChordSelect(chord)}
              >
                <ChordDiagram {...chord} scale={0.3} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white line-clamp-1">
                  {getNome(chord.chord).replace(/#/g, '♯').replace(/b/g, '♭')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}