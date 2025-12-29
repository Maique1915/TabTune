
import React from 'react';
import { Plus, GripHorizontal, Hash, ChevronRight } from 'lucide-react';
import { ScoreData, Duration } from '../types';

interface ScoreConstructorProps {
  score: ScoreData;
  onAddMeasure: () => void;
  activeDuration: Duration;
}

export const ScoreConstructor: React.FC<ScoreConstructorProps> = ({ score, onAddMeasure }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-cyan-500 rounded-full" />
          <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-100 uppercase">Score Constructor</h2>
        </div>
        <button 
          onClick={onAddMeasure}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold text-[10px] hover:bg-cyan-500/20 transition-all uppercase tracking-widest"
        >
          <Plus className="w-3.5 h-3.5" />
          New Section
        </button>
      </div>

      <div className="flex items-start gap-4 overflow-x-auto pb-6">
        {score.measures.map((m, idx) => (
          <div key={m.id} className="flex items-center gap-4 group">
            <div className="w-72 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 group-hover:border-zinc-700 transition-all relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-700">
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Measure {idx + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
                        <Hash className="w-3 h-3 text-cyan-500/70" />
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500">{m.timeSignature}</div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                </div>
              </div>

              <div className="h-0.5 w-full bg-zinc-800 rounded-full relative mb-8 overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-cyan-500 w-1/3 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {m.notes.map((note, nidx) => (
                  <div 
                    key={note.id}
                    className="aspect-square bg-zinc-800/50 border border-zinc-700/50 rounded-xl flex flex-col items-center justify-center gap-1 group/note hover:border-cyan-500/50 hover:bg-zinc-800 transition-all cursor-pointer relative"
                  >
                    <div className="absolute top-1 left-1.5 text-[8px] font-bold text-zinc-600 group-hover/note:text-cyan-500/50 uppercase">Q</div>
                    <div className="text-lg font-bold text-zinc-100">{note.tabPositions?.[0]?.fret ?? 'R'}</div>
                    <div className="text-[8px] font-bold text-zinc-600 uppercase">Str {note.tabPositions?.[0]?.str ?? '-'}</div>
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-700 hover:border-zinc-600 hover:text-zinc-500 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Connecting visual element */}
            <div className="h-32 w-8 border-2 border-dashed border-zinc-800/50 rounded-full flex items-center justify-center text-zinc-800 hover:text-zinc-600 hover:border-zinc-700 transition-all cursor-pointer group-hover:scale-105">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
