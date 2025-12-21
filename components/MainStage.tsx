
import React from 'react';
import { Play, Volume2, Video } from 'lucide-react';
import ChordDiagram from './ChordDiagram';
import { Chord } from '../types';

interface MainStageProps {
  currentChords: Chord[];
}

const MainStage: React.FC<MainStageProps> = ({ currentChords }) => {
  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Visualizer */}
      <div className="flex-1 flex items-center justify-center gap-12 p-8 overflow-hidden relative">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {currentChords.length > 0 ? (
          currentChords.map((chord, idx) => (
            <div key={`${chord.id}-${idx}`} className="transform scale-125 transition-all duration-500">
              <div className="mb-4 text-center">
                <h1 className="text-4xl font-light text-slate-300 tracking-wider">
                  {chord.name}
                </h1>
              </div>
              <div className="bg-[#111827]/80 backdrop-blur rounded-xl p-6 border border-slate-800 shadow-2xl">
                 <ChordDiagram chord={chord} size="lg" showLabels={true} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-500 flex flex-col items-center">
            <p>Selecione acordes na biblioteca para visualizar</p>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="h-16 bg-[#1e293b] border-t border-slate-800 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-700 rounded transition-colors">
            <Play size={18} fill="currentColor" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 transition-colors">
            <Volume2 size={14} />
            áudio
          </button>
        </div>

        <button className="bg-red-600 hover:bg-red-700 px-6 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2">
          <Video size={14} />
          Renderizar MP4
        </button>
      </div>
    </div>
  );
};

export default MainStage;
