"use client";

import { useState, useMemo } from "react";
import { GenericSidebar } from "@/components/shared/GenericSidebar";
import { Music, Home, Filter, ChevronDown } from "lucide-react";
import { chordData, notes, getScaleNotes, getBassNotes, getFormattedNome, formatNoteName, extensions, getFilteredChords, basses } from "@/lib/chords";
import { useAppContext } from "@/app/context/app--context";
import { useToast } from "@/hooks/use-toast";
import { ChordDiagramProps } from "@/lib/types";
import { ChordDiagram } from "./chord-diagram";
import Link from 'next/link';
import { cn } from "@/shared/lib/utils";
import { INSTRUMENTS } from "@/lib/instruments";

interface LibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function LibraryPanel({ isMobile, isOpen, onClose }: LibraryPanelProps) {
  const {
    setSelectedChords,
    selectedChords,
    instrumentId,
    setInstrumentId,
    tuningIndex,
    setTuningIndex
  } = useAppContext();
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");

  const selectedInstrument = INSTRUMENTS.find(i => i.id === instrumentId) || INSTRUMENTS[0];
  const stringCount = selectedInstrument.tunings[tuningIndex].length;

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
    return getFilteredChords(chordData, selectedNote, selectedQuality, selectedExtensions, selectedBass, stringCount);
  }, [selectedNote, selectedQuality, selectedExtensions, selectedBass, stringCount]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((e) => e !== extension) : [...prev, extension]
    );
  };

  return (
    <GenericSidebar
      title="LIBRARY"
      icon={Music}
      isMobile={isMobile}
      isOpen={isOpen}
      onClose={onClose}
      side="left"
      headerAction={
        <Link href="/">
          <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </Link>
      }
      footer={
        <div className="text-[10px] text-zinc-600 text-center font-medium tracking-wide">
          Click or Drag to add to timeline.
        </div>
      }
    >
      <div className="space-y-6 pt-4">
        {/* Signals Counter */}
        <div className="flex items-center">
          <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest bg-cyan-500/5 px-2 py-1 rounded-full border border-cyan-500/20">
            {filteredChords.length} signals detected for {stringCount} strings
          </span>
        </div>

        {/* Filters Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              <span>Filter Chords</span>
            </h3>

            {/* Instrument Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Instrument</label>
                <div className="relative group">
                  <select
                    value={instrumentId}
                    onChange={(e) => {
                      setInstrumentId(e.target.value);
                      setTuningIndex(0); // Reset tuning when instrument changes
                    }}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                  >
                    {INSTRUMENTS.map((inst) => (
                      <option key={inst.id} value={inst.id} className="bg-zinc-950 text-white">{inst.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Tuning</label>
                <div className="relative group">
                  <select
                    value={tuningIndex}
                    onChange={(e) => setTuningIndex(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                  >
                    {selectedInstrument.tunings.map((tuning: string[], i: number) => (
                      <option key={i} value={i} className="bg-zinc-950 text-white">{tuning.join(' ')}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Scale</label>
                <div className="relative group">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                    value={selectedScale}
                    onChange={e => setSelectedScale(e.target.value)}
                  >
                    {notes.map((note) => (
                      <option key={note} value={note} className="bg-zinc-950">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Root</label>
                <div className="relative group">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                    value={selectedNote}
                    onChange={e => setSelectedNote(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    {getScaleNotes(selectedScale).map((note) => (
                      <option key={note} value={note} className="bg-zinc-950">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Quality</label>
                <div className="relative group">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                    value={selectedQuality}
                    onChange={e => setSelectedQuality(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    <option value="major" className="bg-zinc-950">Major</option>
                    <option value="minor" className="bg-zinc-950">Minor</option>
                    <option value="dim" className="bg-zinc-950">Dim</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Bass</label>
                <div className="relative group">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                    value={selectedBass}
                    onChange={e => setSelectedBass(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    {basses.map((bass, index) => (
                      <option key={bass} value={bass} className="bg-zinc-950">{getBassNotes(selectedScale)[index]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Extensions
            </h3>
            <div className="flex flex-wrap gap-2">
              {extensions.map((ext) => (
                <button key={ext} onClick={() => handleExtensionToggle(ext)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all uppercase tracking-wider",
                    selectedExtensions.includes(ext)
                      ? "bg-pink-500/20 text-pink-400 border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                      : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300"
                  )}>
                  {ext}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-4">
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
                    "relative group cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-28",
                    isSelected
                      ? "bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] scale-[1.02]"
                      : "bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="relative flex-1 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] group-hover:scale-[0.27] transition-transform duration-300">
                      <ChordDiagram
                        {...chordData}
                        scale={1.0}
                        list={true}
                      />
                    </div>
                  </div>

                  <div className={cn("px-2 py-2 text-center border-t border-zinc-800/50 bg-zinc-950/40")}>
                    <span className={cn("text-[10px] font-black truncate block uppercase tracking-wider", isSelected ? "text-pink-400" : "text-zinc-500 group-hover:text-zinc-300")}>
                      {getFormattedNome(chordData.chord)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GenericSidebar>
  );
}