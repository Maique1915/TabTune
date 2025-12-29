
import React from 'react';
import { Play, RotateCcw, ChevronDown } from 'lucide-react';

interface ToolbarProps {
  viewMode: 'both' | 'partitura' | 'tablatura';
  setViewMode: (v: 'both' | 'partitura' | 'tablatura') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="h-20 border-b border-zinc-800/50 flex items-center px-8 gap-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-zinc-950 font-bold text-xs rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
          <Play className="w-3.5 h-3.5 fill-zinc-950" />
          PLAY
        </button>
        <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="h-8 w-px bg-zinc-800/50 mx-2" />

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Tempo</span>
          <span className="text-cyan-400 font-bold">120</span>
          <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">BPM</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg cursor-pointer group hover:border-zinc-700 transition-all">
          <span className="text-zinc-100 font-bold">4/4</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        {[
          { id: 'both', label: 'Ambos' },
          { id: 'partitura', label: 'Partitura' },
          { id: 'tablatura', label: 'Tablatura' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              viewMode === mode.id 
              ? 'bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20' 
              : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};
