
import React from 'react';
import { Duration } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  onInsert: (text: string) => void;
  activeDuration: Duration;
  onSelectDuration: (duration: Duration) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onInsert, activeDuration, onSelectDuration }) => {
  const durationItems = [
    { label: 'Whole', code: 'w' as Duration },
    { label: 'Half', code: 'h' as Duration },
    { label: 'Quarter', code: 'q' as Duration },
    { label: '8th', code: '8' as Duration },
    { label: '16th', code: '16' as Duration },
    { label: '32nd', code: '32' as Duration },
  ];

  const palettes = [
    {
      title: 'Claves',
      items: [
        { label: 'Treble', code: 'clef=treble' },
        { label: 'Bass', code: 'clef=bass' },
        { label: 'Tab', code: 'clef=tab' },
      ]
    },
    {
      title: 'Techniques',
      items: [
        { label: 'Hammer-on', code: 'h' },
        { label: 'Pull-off', code: 'p' },
        { label: 'Slide', code: 's' },
        { label: 'Bend', code: 'b' },
        { label: 'Vibrato', code: 'v' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          VEXSTUDIO AI
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Tempo / Duration
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {durationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectDuration(item.code)}
                className={`px-3 py-2 text-sm rounded-md transition-all text-left border flex flex-col items-start ${
                  activeDuration === item.code 
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/50'
                }`}
              >
                <div className={`mb-1 scale-75 origin-left ${activeDuration === item.code ? 'text-cyan-400' : 'text-slate-500 opacity-40'}`}>
                  {Icons.MusicRest(item.code)}
                </div>
                <span className="font-bold text-[10px] uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {palettes.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onInsert(item.code)}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-left border border-slate-700/50 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 italic bg-slate-900/50">
        Tip: Select a duration then click (+) to add notes.
      </div>
    </aside>
  );
};

export default Sidebar;
