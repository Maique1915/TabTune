
"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { chordData, getNome, notes, complements, basses } from "@/lib/chords";
import { transpose as transposeChord, getChordDisplayData } from "@/lib/chord-logic";
import { useAppContext } from "@/app/context/app--context";
import { CanvasChordDiagram } from "./canvas-chord-diagram";
import { useToast } from "@/hooks/use-toast";
import { ChordWithTiming, ChordDiagramProps } from "@/lib/types";
import { ChordDiagram } from "./chord-diagram";

export function LibraryPanel() {
  const { selectedChords, setSelectedChords } = useAppContext();
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(true);

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
  };

  // Calcular notas da escala (intervalos da escala maior)
  const scaleNotes = useMemo(() => {
    const scaleIndex = notes.indexOf(selectedScale);
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]; // Tom, Tom, Semitom, Tom, Tom, Tom, Semitom

    return majorScaleIntervals.map((interval) => {
      const noteIndex = (scaleIndex + interval) % 12;
      return notes[noteIndex];
    });
  }, [selectedScale]);

  // Calcular notas do baixo baseado na escala
  const bassNotes = useMemo(() => {
    const scaleIndex = notes.indexOf(selectedScale);
    const scaleNotesDisplay = [
      "Root",
      ...Array.from({ length: 11 }, (_, i) => {
        const noteIndex = (scaleIndex + i + 1) % 12;
        return `/${notes[noteIndex].replace(/#/g, '♯')}`;
      }),
    ];
    return scaleNotesDisplay;
  }, [selectedScale]);

  // Transpor todos os acordes para a nota selecionada
  const transposedChords = useMemo(() => {
    if (selectedNote === "all") return chordData;

    const targetNoteIndex = notes.indexOf(selectedNote);

    return chordData.map((chordItem) => {
      const originalNoteIndex = chordItem.chord.note;
      const interval = targetNoteIndex - chordItem.origin;
      const newNoteIndex = (originalNoteIndex + interval + 12) % 12;

      return transposeChord(chordItem, { ...chordItem.chord, note: newNoteIndex });
    });
  }, [selectedNote]);

  // Filtrar acordes baseado nos critérios
  const filteredChords = useMemo(() => {
    let filtered = transposedChords;

    // Filtro por qualidade (Major, Minor, Dim)
    if (selectedQuality !== "all") {
      filtered = filtered.filter((chord) => {
        const comp = complements[chord.chord.complement];
        if (selectedQuality === "major") {
          return comp === "Major" || comp === "6" || comp === "7+" || comp === "7(#5)";
        } else if (selectedQuality === "minor") {
          return comp.startsWith("m") && comp !== "Major";
        } else if (selectedQuality === "dim") {
          return comp === "°" || comp === "m7(b5)";
        }
        return true;
      });
    }

    // Filtro por extensões (7, 9, etc)
    if (selectedExtensions.length > 0) {
      filtered = filtered.filter((chord) => {
        const comp = complements[chord.chord.complement];
        return selectedExtensions.some((ext) => comp.includes(ext));
      });
    }

    // Filtro por baixo
    if (selectedBass !== "all") {
      const bassIndex = basses.indexOf(selectedBass);
      filtered = filtered.filter((chord) => chord.chord.bass === bassIndex);
    }

    return filtered;
  }, [transposedChords, selectedQuality, selectedExtensions, selectedBass]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension)
        ? prev.filter((e) => e !== extension)
        : [...prev, extension]
    );
  };

  return (
    <>
      {/* Menu lateral com filtros */}
      <aside className="flex h-full w-16 flex-col bg-panel border-r shrink-0 items-center py-4 gap-4">
        <div className="text-2xl">🎸</div>


      </aside>

      {/* Painel de filtros */}
      {showFilters && (
        <aside className="flex h-full w-40 flex-col bg-panel border-r shrink-0 overflow-hidden">
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-bold text-white">Filters</h2>

            {/* Select de Escala */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Scale</Label>
              <Select value={selectedScale} onValueChange={setSelectedScale}>
                <SelectTrigger className="bg-input h-9 text-sm">
                  <SelectValue placeholder="Scale" />
                </SelectTrigger>
                <SelectContent>
                  {notes.map((note) => (
                    <SelectItem key={note} value={note}>
                      {note.replace(/#/g, '♯')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select de Nota */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Note</Label>
              <Select value={selectedNote} onValueChange={setSelectedNote}>
                <SelectTrigger className="bg-input h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {scaleNotes.map((note) => (
                    <SelectItem key={note} value={note}>
                      {note.replace(/#/g, '♯')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select de Qualidade */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Quality</Label>
              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="bg-input h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="dim">Dim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select de Baixo */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Bass</Label>
              <Select value={selectedBass} onValueChange={setSelectedBass}>
                <SelectTrigger className="bg-input h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {basses.map((bass, index) => (
                    <SelectItem key={bass} value={bass}>
                      {bassNotes[index]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select de Extensões (múltiplo) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Extensions</Label>
              <div className="flex flex-wrap gap-1.5">
                {["4", "6", "7", "7+", "9", "11", "13", "#5", "b5"].map((ext) => (
                  <button
                    key={ext}
                    onClick={() => handleExtensionToggle(ext)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${selectedExtensions.includes(ext)
                      ? "bg-accent text-accent-foreground"
                      : "bg-input text-foreground hover:bg-accent/50"
                      }`}
                  >
                    {ext}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Painel de acordes */}
      <aside className="flex h-full w-80 flex-col bg-panel border-r shrink-0 overflow-hidden">
        <div className="mb-2 p-4 flex items-center justify-between border-b">

          <div className="p-4 ">
            <h2 className="text-lg font-bold text-white">Library</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredChords.length} chord{filteredChords.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-accent text-accent-foreground" : "hover:bg-accent/20"
              }`}
            title="Filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>



        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {filteredChords.map((chord, index) => (
              <div
                key={`${JSON.stringify(chord.chord)}-${index}`}
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
      </aside>
    </>
  );
}

/*
<div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {filteredChords.map((chord, index) => (
              <div
                key={`${JSON.stringify(chord.chord)}-${index}`}
                className="group relative cursor-pointer rounded-lg overflow-hidden aspect-square flex items-center justify-center hover:ring-2 hover:ring-accent transition-all bg-background/50"
                onClick={() => handleChordSelect(chord)}
              >
                <CanvasChordDiagram {...chord} scale={0.2} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white line-clamp-1">
                  {getNome(chord.chord).replace(/#/g, '♯').replace(/b/g, '♭')}
                </p>
              </div>
            ))}
          </div>
        </div>
*/