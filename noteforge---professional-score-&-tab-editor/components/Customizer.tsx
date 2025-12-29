
import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { ScoreTheme } from '../types';

interface CustomizerProps {
  theme: ScoreTheme;
  onThemeChange: (key: keyof ScoreTheme, value: string) => void;
}

export const Customizer: React.FC<CustomizerProps> = ({ theme, onThemeChange }) => {
  const controls = [
    { label: 'Clefs (Claves)', key: 'clefs' as keyof ScoreTheme },
    { label: 'Time Sig (Compasso)', key: 'timeSignature' as keyof ScoreTheme },
    { label: 'Musical Notes', key: 'notes' as keyof ScoreTheme },
    { label: 'Rests (Pausas)', key: 'rests' as keyof ScoreTheme },
    { label: 'Tab Numbers', key: 'tabNumbers' as keyof ScoreTheme },
    { label: 'Symbols', key: 'symbols' as keyof ScoreTheme },
    { label: 'Staff Lines', key: 'staffLines' as keyof ScoreTheme },
    { label: 'Background (Fundo)', key: 'background' as keyof ScoreTheme },
  ];

  return (
    <aside className="w-80 border-l border-zinc-800/50 bg-[#0d0d0f] p-6 flex flex-col gap-6 z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Palette className="w-5 h-5 text-pink-400" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">Customize</h1>
        </div>
        <button className="p-2 bg-pink-500/10 rounded-lg text-pink-400 hover:bg-pink-500/20 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 mb-4">
        <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-zinc-800 rounded-md">Styles</button>
        <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Motion</button>
        <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Canvas</button>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 max-h-[calc(100vh-250px)]">
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Notation Components</p>
        {controls.map((control) => (
          <div 
            key={control.key}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/40 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-zinc-200">{control.label}</span>
            <div className="relative">
              <input
                type="color"
                value={theme[control.key]}
                onChange={(e) => onThemeChange(control.key, e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-zinc-700 bg-transparent cursor-pointer overflow-hidden appearance-none"
                style={{ backgroundColor: theme[control.key] }}
              />
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ backgroundColor: theme[control.key] }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
