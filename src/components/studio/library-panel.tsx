"use client";

import { useState, useMemo } from "react";
import { GenericSidebar } from "@/components/shared/GenericSidebar";
import { Music, Home, Filter, X, ChevronDown } from "lucide-react";
import { chordData } from "@/modules/core/infrastructure/chord-data";
import { notes, getScaleNotes, getBassNotes, getFormattedNome, formatNoteName, extensions, getFilteredChords, basses } from "@/modules/core/domain/chord-logic";
import { useAppContext } from "@/app/context/app--context";
import { useToast } from "@/hooks/use-toast";
import { ChordDiagramProps } from "@/modules/core/domain/types";
import { ChordDiagram } from "./chord-diagram";
import Link from 'next/link';
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { INSTRUMENTS } from "@/lib/instruments";

interface LibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function LibraryPanel({ isMobile, isOpen, onClose }: LibraryPanelProps) {
  const { addChordToTimeline, selectedChords } = useAppContext();
  const { toast } = useToast();

  const [selectedScale, setSelectedScale] = useState<string>("C");
  const [selectedNote, setSelectedNote] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedBass, setSelectedBass] = useState<string>("all");
  const [selectedInstrumentId, setSelectedInstrumentId] = useState('violao');
  const [selectedTuningIndex, setSelectedTuningIndex] = useState(0);

  const selectedInstrument = INSTRUMENTS.find(i => i.id === selectedInstrumentId) || INSTRUMENTS[0];
  const currentTuning = selectedInstrument.tunings[selectedTuningIndex];

  const activeChord = selectedChords.length > 0 ? selectedChords[selectedChords.length - 1] : null;

  const handleChordSelect = (chord: ChordDiagramProps, e?: React.MouseEvent) => {
    addChordToTimeline(chord);
    toast({
      title: `${chord.chord ? getFormattedNome(chord.chord) : "Chord"} added`,
    });
    if (isMobile) {
      onClose?.();
    }
  };

  const filteredChords = useMemo(() => {
    const filtered = getFilteredChords(chordData, selectedNote, selectedQuality, selectedExtensions, selectedBass, currentTuning);
    // Update stringNames for all chords to match the selected instrument
    return filtered.map(chord => ({
      ...chord,
      stringNames: currentTuning
    }));
  }, [selectedNote, selectedQuality, selectedExtensions, selectedBass, currentTuning]);

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((e) => e !== extension) : [...prev, extension]
    );
  };

  const handleInstrumentChange = (instrumentId: string) => {
    setSelectedInstrumentId(instrumentId);
    setSelectedTuningIndex(0);
  };

  const handleTuningChange = (index: number) => {
    setSelectedTuningIndex(index);
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
        {/* Signals Counter (from original header) */}
        <div className="flex items-center">
          <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest bg-cyan-500/5 px-2 py-1 rounded-full border border-cyan-500/20">
            {filteredChords.length} signals detected
          </span>
        </div>

        {/* Filters Section */}
        <div className="space-y-6">
          {/* Instrument & Tuning Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Instrument & Tuning</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Instrument</label>
                <div className="relative group">
                  <select
                    value={selectedInstrumentId}
                    onChange={(e) => handleInstrumentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                  >
                    {INSTRUMENTS.map(inst => (
                      <option key={inst.id} value={inst.id} className="bg-zinc-950">{inst.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Tuning</label>
                <div className="relative group">
                  <select
                    value={selectedTuningIndex}
                    onChange={(e) => handleTuningChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                  >
                    {selectedInstrument.tunings.map((tuning: string[], i: number) => (
                      <option key={i} value={i} className="bg-zinc-950">{tuning.join(' ')}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Filters Grid */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" />
              <span>Filter Chords</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Scale */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Scale</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                    value={selectedScale}
                    onChange={e => setSelectedScale(e.target.value)}
                  >
                    {notes.map((note) => (
                      <option key={note} value={note} className="bg-zinc-950">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Root</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                    value={selectedNote}
                    onChange={e => setSelectedNote(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    {getScaleNotes(selectedScale).map((note) => (
                      <option key={note} value={note} className="bg-zinc-950">{formatNoteName(note)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Quality</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                    value={selectedQuality}
                    onChange={e => setSelectedQuality(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    <option value="major" className="bg-zinc-950">Major</option>
                    <option value="minor" className="bg-zinc-950">Minor</option>
                    <option value="dim" className="bg-zinc-950">Dim</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              {/* Bass */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Bass</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-pink-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                    value={selectedBass}
                    onChange={e => setSelectedBass(e.target.value)}
                  >
                    <option value="all" className="bg-zinc-950">All</option>
                    {basses.map((bass, index) => (
                      <option key={bass} value={bass} className="bg-zinc-950">{getBassNotes(selectedScale)[index]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Extensions */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Extensions
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "7+", value: "7+" },
                { label: "9", value: "9" },
                { label: "11", value: "11" },
                { label: "13", value: "13" },
              ].map((ext) => {
                // Find if any variant of this extension is active
                const activeVariant = selectedExtensions.find(e => e.endsWith(ext.value) && (e === ext.value || e === `b${ext.value}` || e === `#${ext.value}`));
                const isActive = !!activeVariant;
                const currentModifier = activeVariant?.startsWith('b') ? 'b' : activeVariant?.startsWith('#') ? '#' : 'none';

                if (isActive) {
                  return (
                    <div key={ext.value} className="flex items-center bg-pink-500/10 border border-pink-500/30 rounded-xl overflow-hidden transition-all shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                      {/* Flat Modifier Toggle */}
                      <button
                        onClick={(e) => {
                          // Remove current variant, add flat variant
                          const others = selectedExtensions.filter(e => e !== activeVariant);
                          const newExt = currentModifier === 'b' ? ext.value : `b${ext.value}`; // Toggle off if already b, else set b
                          // Actually standard behavior: hitting 'b' on '9' makes 'b9'. Hitting 'b' on 'b9' makes '9'?
                          // Sidebar logic: if currentModifier is 'b', newExt is plain value (toggle off modifier).
                          setSelectedExtensions(currentModifier === 'b' ? [...others, ext.value] : [...others, `b${ext.value}`]);
                        }}
                        className={cn(
                          "px-2 py-1.5 text-[10px] font-bold hover:bg-pink-500/20 transition-colors border-r border-pink-500/10",
                          currentModifier === 'b' ? 'text-pink-400' : 'text-zinc-600 hover:text-zinc-400'
                        )}
                      >
                        b
                      </button>

                      {/* Main Label (Toggle Off) */}
                      <button
                        onClick={() => {
                          const others = selectedExtensions.filter(e => e !== activeVariant);
                          setSelectedExtensions(others);
                        }}
                        className="px-2 py-1.5 text-[10px] font-black text-pink-400 hover:bg-pink-500/20 transition-colors border-x border-pink-500/10"
                      >
                        {ext.label}
                      </button>

                      {/* Sharp Modifier Toggle */}
                      <button
                        onClick={() => {
                          const others = selectedExtensions.filter(e => e !== activeVariant);
                          setSelectedExtensions(currentModifier === '#' ? [...others, ext.value] : [...others, `#${ext.value}`]);
                        }}
                        className={cn(
                          "px-2 py-1.5 text-[10px] font-bold hover:bg-pink-500/20 transition-colors border-l border-pink-500/10",
                          currentModifier === '#' ? 'text-pink-400' : 'text-zinc-600 hover:text-zinc-400'
                        )}
                      >
                        #
                      </button>
                    </div>
                  );
                }

                // Inactive State
                return (
                  <button
                    key={ext.value}
                    onClick={() => setSelectedExtensions([...selectedExtensions, ext.value])}
                    className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-zinc-500 text-[10px] font-bold hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                  >
                    {ext.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredChords.map((chordData, index) => {
              const isSelected = activeChord?.chord === chordData;

              return (
                <div
                  key={`${chordData.chord?.note}-${chordData.chord?.complement}-${index}`}
                  onClick={(e) => handleChordSelect(chordData, e)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/json", JSON.stringify({
                      type: 'chord',
                      name: chordData.chord ? getFormattedNome(chordData.chord) : 'Chord',
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
                  {/* Chord Diagram Container */}
                  <div className="relative flex-1 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] group-hover:scale-[0.27] transition-transform duration-300">
                      <ChordDiagram
                        {...chordData}
                        scale={1.0}
                        list={true}
                      />
                    </div>
                  </div>

                  {/* Footer Name */}
                  <div className={cn("px-2 py-2 text-center border-t border-zinc-800/50 bg-zinc-950/40")}>
                    <span className={cn("text-[10px] font-black truncate block uppercase tracking-wider", isSelected ? "text-pink-400" : "text-zinc-500 group-hover:text-zinc-300")}>
                      {chordData.chord ? getFormattedNome(chordData.chord) : 'Chord'}
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