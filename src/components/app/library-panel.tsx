"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Add missing import
import "./library-panel.css";
// Usando apenas campos nativos
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { chordData, notes, complements, basses, getScaleNotes, getBassNotes, getFormattedNome, formatNoteName, extensions, getFilteredChords } from "@/lib/chords";
import { transpose as transposeChord, getChordDisplayData } from "@/lib/chord-logic";
import { useAppContext } from "@/app/context/app--context";
import { useToast } from "@/hooks/use-toast";
import { ChordDiagramProps } from "@/lib/types";
import { ChordDiagram } from "./chord-diagram";
import { Filter, X, Music } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface LibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}


export function LibraryPanel({ isMobile, isOpen, onClose }: LibraryPanelProps) {
  const { setSelectedChords, selectedChords } = useAppContext(); // Ensure we have context
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");
  // id fixo para o checkbox
  // const filterId = "filter-toggle";

  // Use the last selected chord as 'active' for visualization or simple selection logic
  const activeChord = selectedChords.length > 0 ? selectedChords[selectedChords.length - 1] : null;

  const handleChordSelect = (chord: ChordDiagramProps, e?: React.MouseEvent) => {
    // Construct proper ChordWithTiming object expected by the renderer
    const newChord = {
      chord: chord,
      duration: 2000, // Default duration
      finalChord: chord, // Initial value (no transposition)
      transportDisplay: 0 // Initial value
    };
    setSelectedChords((prev) => [...prev, newChord]);
    toast({
      title: `${getFormattedNome(chord.chord)} added`,
    });
    if (isMobile) {
      onClose?.();
    }
  };

  console.log("Renderizando LibraryPanel");

  const filteredChords = useMemo(() => {
    return getFilteredChords(chordData, selectedNote, selectedQuality, selectedExtensions, selectedBass);
  }, [selectedNote, selectedQuality, selectedExtensions, selectedBass]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((e) => e !== extension) : [...prev, extension]
    );
  };

  const FiltersContent = () => (
    <div className="p-4 bg-black/20 border-b border-cyan-500/20 backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {/* Scale Filter */}
          <div className="min-w-[70px] space-y-1">
            <Label className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Scale</Label>
            <select
              className="w-full bg-cyan-950/20 text-cyan-100 text-xs border border-cyan-500/30 rounded-md px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              value={selectedScale}
              onChange={e => setSelectedScale(e.target.value)}
            >
              {notes.map((note) => (
                <option key={note} value={note} className="bg-[#0f172a]">{formatNoteName(note)}</option>
              ))}
            </select>
          </div>

          {/* Note Filter */}
          <div className="min-w-[70px] space-y-1">
            <Label className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Note</Label>
            <select
              className="w-full bg-cyan-950/20 text-cyan-100 text-xs border border-cyan-500/30 rounded-md px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              value={selectedNote}
              onChange={e => setSelectedNote(e.target.value)}
            >
              <option value="all" className="bg-[#0f172a]">All</option>
              {getScaleNotes(selectedScale).map((note) => (
                <option key={note} value={note} className="bg-[#0f172a]">{formatNoteName(note)}</option>
              ))}
            </select>
          </div>

          {/* Quality Filter */}
          <div className="min-w-[70px] space-y-1">
            <Label className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Quality</Label>
            <select
              className="w-full bg-cyan-950/20 text-cyan-100 text-xs border border-cyan-500/30 rounded-md px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              value={selectedQuality}
              onChange={e => setSelectedQuality(e.target.value)}
            >
              <option value="all" className="bg-[#0f172a]">All</option>
              <option value="major" className="bg-[#0f172a]">Major</option>
              <option value="minor" className="bg-[#0f172a]">Minor</option>
              <option value="dim" className="bg-[#0f172a]">Dim</option>
            </select>
          </div>

          {/* Bass Filter */}
          <div className="min-w-[70px] space-y-1">
            <Label className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Bass</Label>
            <select
              className="w-full bg-cyan-950/20 text-cyan-100 text-xs border border-cyan-500/30 rounded-md px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              value={selectedBass}
              onChange={e => setSelectedBass(e.target.value)}
            >
              <option value="all" className="bg-[#0f172a]">All</option>
              {basses.map((bass, index) => (
                <option key={bass} value={bass} className="bg-[#0f172a]">{getBassNotes(selectedScale)[index]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Extensions Filter - Horizontal Scroll if needed */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Extensions</Label>
          <div className="flex flex-wrap gap-1.5">
            {extensions.map((ext) => (
              <button key={ext} onClick={() => handleExtensionToggle(ext)}
                className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${selectedExtensions.includes(ext)
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : "bg-black/40 text-cyan-500/50 border-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400"
                  }`}>
                {ext}
              </button>
            ))}
          </div>
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
    <div className={cn(rootClasses, "bg-black/40 backdrop-blur-xl border-r border-cyan-500/30 shadow-[5px_0_30px_rgba(6,182,212,0.15)]")}>
      {isMobile && (
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-cyan-900/50 rounded-full"></div>
        </div>
      )}

      <div className={cn("flex items-center justify-between p-4 border-b border-cyan-500/20", { "flex-row-reverse": isMobile })}>
        <div>
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider uppercase drop-shadow-[0_0_2px_rgba(6,182,212,0.5)]">Library</h2>
          <p className="text-xs text-cyan-200/50 font-mono">{filteredChords.length} signals detected</p>
        </div>
        <Link href="/">
          <Button variant="secondary" size="sm" className="gap-2 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-200 hover:border-cyan-400/50 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <Music className="w-4 h-4" />
            Início
          </Button>
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <FiltersContent />
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {filteredChords.map((chordData, index) => {
                // Strict reference equality to identify the exact voicing (fixes multi-highlight issue)
                const isSelected = activeChord?.chord === chordData;

                return (
                  <div
                    key={`${chordData.chord.note}-${chordData.chord.complement}-${index}`}
                    onClick={(e) => handleChordSelect(chordData, e)}
                    className={cn(
                      "relative group cursor-pointer rounded-lg border transition-all duration-300 overflow-hidden flex flex-col",
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-[1.02] z-10"
                        : "bg-black/40 border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    )}
                  >
                    {/* Chord Diagram Container with fixed height to prevent layout expansion */}
                    <div className="relative w-full h-28 overflow-hidden bg-gradient-to-b from-transparent to-black/20">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.32]">
                        <ChordDiagram
                          {...chordData}
                          scale={1.0}
                          list={true}
                        />
                      </div>
                    </div>

                    {/* Footer Name */}
                    <div className={cn("px-1 py-1.5 text-center border-t z-20 relative", isSelected ? "bg-cyan-900/60 border-cyan-500/30" : "bg-black/60 border-white/5")}>
                      <span className={cn("text-[10px] font-bold font-mono truncate block", isSelected ? "text-cyan-300" : "text-white/60 group-hover:text-cyan-200")}>
                        {getFormattedNome(chordData.chord)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}