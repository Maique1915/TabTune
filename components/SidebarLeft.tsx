
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { CHORD_LIBRARY } from '../constants';
import ChordDiagram from './ChordDiagram';
import { Chord } from '../types';

interface SidebarLeftProps {
  onSelectChord: (chord: Chord) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onSelectChord }) => {
  return (
    <div className="w-72 bg-[#111827] border-r border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Biblioteca</h2>
        <p className="text-xs text-slate-500 mt-1">{CHORD_LIBRARY.length} acordes</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Filtros</label>
          <div className="mt-2 space-y-3">
            <div>
              <p className="text-[10px] text-slate-400 mb-1">Escala</p>
              <select className="w-full bg-[#1f2937] border border-slate-700 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500">
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-1">Observação</p>
              <select className="w-full bg-[#1f2937] border border-slate-700 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-1">Qualidade</p>
              <select className="w-full bg-[#1f2937] border border-slate-700 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-1">Baixo</p>
              <select className="w-full bg-[#1f2937] border border-slate-700 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500">
                <option>Todos</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Extensões</label>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {['4', '6', '7', '7+', '9', '11', '13', '#5', 'b5'].map(ext => (
              <button key={ext} className="bg-[#1f2937] hover:bg-slate-700 text-[10px] py-1 rounded transition-colors">
                {ext}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-3 gap-1 pb-4">
          {CHORD_LIBRARY.map(chord => (
            <div
              key={chord.id}
              onClick={() => onSelectChord(chord)}
              className="bg-[#1e293b] border border-slate-800 rounded p-1 hover:border-blue-500 hover:bg-slate-800 cursor-pointer transition-all group"
            >
              <ChordDiagram chord={chord} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
