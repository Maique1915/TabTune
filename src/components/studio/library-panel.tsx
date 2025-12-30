"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import "./library-panel.css";
// Usando apenas campos nativos
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { chordData, notes, complements, basses, getScaleNotes, getBassNotes, getFormattedNome, formatNoteName, extensions, getFilteredChords } from "@/lib/chords";
import { transpose as transposeChord, getChordDisplayData } from "@/lib/chord-logic";
import { useAppContext } from "@/app/context/app--context";
import { useToast } from "@/hooks/use-toast";
import { ChordDiagramProps } from "@/lib/types";
import { ChordDiagram } from "./chord-diagram";
import { Filter, X, Home, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/shared/lib/utils";

interface LibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}


export function LibraryPanel({ isMobile, isOpen, onClose }: LibraryPanelProps) {
  const { setSelectedChords, selectedChords } = useAppContext();
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");

  const activeChord = selectedChords.length > 0 ? selectedChords[selectedChords.length - 1] : null;

  const handleChordSelect = (chord: ChordDiagramProps, e?: React.MouseEvent) => {
    const newChord = {
      chord: chord,
      duration: 2000,
      finalChord: chord,
      transportDisplay: 0
    };
    setSelectedChords((prev) => [...prev, newChord]);
    toast({
      title: `${getFormattedNome(chord.chord)} added`,
    });
    if (isMobile) {
      onClose?.();
    }
  };

  const filteredChords = useMemo(() => {
    return getFilteredChords(chordData, selectedNote, selectedQuality, selectedExtensions, selectedBass);
  }, [selectedNote, selectedQuality, selectedExtensions, selectedBass]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((e) => e !== extension) : [...prev, extension]
    );
  };

  const rootClasses = cn(
    "flex flex-col bg-black/20 backdrop-blur-xl border-r border-white/5 h-full transition-transform duration-300 ease-in-out",
    isMobile
      ? `fixed inset-x-0 bottom-0 h-[85vh] rounded-t-2xl shadow-2xl z-50 ${isOpen ? "translate-y-0" : "translate-y-full"}`
      : "relative w-[448px]"
  );

  return (
    <div className={rootClasses}>
      <style>{`
        .custom-library-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-library-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-library-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-library-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      {isMobile && (
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer bg-black/40" onClick={onClose}>
          <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between min-h-[80px]">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            LIBRARY
          </h2>
          <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest mt-1">
            Component Selection • {filteredChords.length} signals
          </span>
        </div>
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white border border-white/5">
            <Home className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Filters Section */}
        <div className="p-4 space-y-6 overflow-y-auto custom-library-scroll">

          {/* Main Filters Grid */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Filter Chords
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Scale */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scale</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:bg-white/10 focus:border-cyan-500/50 appearance-none transition-all cursor-pointer hover:bg-white/10"
                    value={selectedScale}
                    onChange={e => setSelectedScale(e.target.value)}
                  >
                    {notes.map((note) => (
                      <option key={note} value={note} className="bg-[#1a1a1a]">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Root</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:bg-white/10 focus:border-cyan-500/50 appearance-none transition-all cursor-pointer hover:bg-white/10"
                    value={selectedNote}
                    onChange={e => setSelectedNote(e.target.value)}
                  >
                    <option value="all" className="bg-[#1a1a1a]">All</option>
                    {getScaleNotes(selectedScale).map((note) => (
                      <option key={note} value={note} className="bg-[#1a1a1a]">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quality</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:bg-white/10 focus:border-cyan-500/50 appearance-none transition-all cursor-pointer hover:bg-white/10"
                    value={selectedQuality}
                    onChange={e => setSelectedQuality(e.target.value)}
                  >
                    <option value="all" className="bg-[#1a1a1a]">All</option>
                    <option value="major" className="bg-[#1a1a1a]">Major</option>
                    <option value="minor" className="bg-[#1a1a1a]">Minor</option>
                    <option value="dim" className="bg-[#1a1a1a]">Dim</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Bass */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bass</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:bg-white/10 focus:border-cyan-500/50 appearance-none transition-all cursor-pointer hover:bg-white/10"
                    value={selectedBass}
                    onChange={e => setSelectedBass(e.target.value)}
                  >
                    <option value="all" className="bg-[#1a1a1a]">All</option>
                    {basses.map((bass, index) => (
                      <option key={bass} value={bass} className="bg-[#1a1a1a]">{getBassNotes(selectedScale)[index]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Extensions */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Extensions
            </h3>
            <div className="flex flex-wrap gap-2">
              {extensions.map((ext) => (
                <button key={ext} onClick={() => handleExtensionToggle(ext)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all uppercase tracking-wider",
                    selectedExtensions.includes(ext)
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300"
                  )}>
                  {ext}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 pt-2">
            Results ({filteredChords.length})
          </h3>

          {/* Chords Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pb-8">
            {filteredChords.map((chordData, index) => {
              const isSelected = activeChord?.chord === chordData;

              return (
                <div
                  key={`${chordData.chord.note}-${chordData.chord.complement}-${index}`}
                  onClick={(e) => handleChordSelect(chordData, e)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/json", JSON.stringify({
                      type: 'chord',
                      name: getFormattedNome(chordData.chord),
                      chord: chordData
                    }));
                  }}
                  className={cn(
                    "relative group cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden flex flex-col",
                    isSelected
                      ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02] z-10"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  {/* Chord Diagram Container */}
                  <div className="relative w-full h-24 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.3]">
                      <ChordDiagram
                        {...chordData}
                        scale={1.0}
                        list={true}
                      />
                    </div>
                  </div>

                  {/* Footer Name */}
                  <div className={cn("px-2 py-2 text-center border-t border-white/5 relative bg-black/20")}>
                    <span className={cn("text-[10px] font-black font-mono truncate block uppercase tracking-wider", isSelected ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200")}>
                      {getFormattedNome(chordData.chord)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="p-4 border-t border-white/5 text-[10px] text-slate-600 text-center bg-black/20 font-medium tracking-wide">
        Click or Drag to add to timeline.
      </div>
    </div>
  );
}