
import React from 'react';
import { DURATIONS, CLEFS, TECHNIQUES } from '../constants';
import { Duration, Clef } from '../types';

interface SidebarProps {
  activeDuration: Duration;
  onDurationChange: (d: Duration) => void;
  activeClef: Clef;
  onClefChange: (c: Clef) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeDuration, 
  onDurationChange,
  activeClef,
  onClefChange 
}) => {
  return (
    <aside className="w-64 border-r border-zinc-800/50 bg-[#0d0d0f] p-6 flex flex-col gap-8 z-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-xs font-bold tracking-[0.2em] text-cyan-500 mb-2 uppercase">Library</h1>
        <p className="text-[10px] text-zinc-500 uppercase font-medium">Note Controls</p>
      </div>

      <section>
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Duration</h2>
        <div className="grid grid-cols-3 gap-2">
          {DURATIONS.map((dur) => (
            <button
              key={dur.value}
              onClick={() => onDurationChange(dur.value as Duration)}
              className={`h-20 flex flex-col items-center justify-center gap-2 rounded-lg border transition-all ${
                activeDuration === dur.value 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <div className={activeDuration === dur.value ? 'text-cyan-400' : 'text-zinc-400 opacity-50'}>
                {dur.icon}
              </div>
              <span className="text-[10px] font-bold">{dur.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Claves</h2>
        <div className="flex flex-col gap-2">
          {CLEFS.map((c) => (
            <button
              key={c.value}
              onClick={() => onClefChange(c.value as Clef)}
              className={`h-10 px-4 rounded-lg border text-xs font-bold transition-all ${
                activeClef === c.value 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-lg' 
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Techniques</h2>
        <div className="grid grid-cols-2 gap-2">
          {TECHNIQUES.map((tech) => (
            <button
              key={tech.value}
              className="h-10 px-3 rounded-lg border bg-zinc-900/50 border-zinc-800 text-zinc-500 text-[10px] font-bold hover:bg-zinc-800 transition-all"
            >
              {tech.label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-6 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">N</div>
          <p className="text-[10px] text-zinc-500 leading-tight">Select a duration, then click (+) in the editor.</p>
        </div>
      </div>
    </aside>
  );
};
