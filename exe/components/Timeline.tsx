
import React from 'react';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';
import { TimelineEvent, Chord } from '../types';
import { CHORD_LIBRARY } from '../constants';

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const duration = 10; // 10 seconds total
  const pixelsPerSecond = 100;

  return (
    <div className="bg-[#111827] border-t border-slate-800 h-48 flex flex-col">
      <div className="h-8 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span>0:00.0 / 0:10.0</span>
          <div className="flex items-center gap-1">
             <Search size={12} />
             <span>100 px/s</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-700 rounded transition-colors">
            <ZoomOut size={14} className="text-slate-400" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded transition-colors">
            <ZoomIn size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto relative scrollbar-thin">
        {/* Time Markers */}
        <div className="flex border-b border-slate-800 sticky top-0 bg-[#111827] z-10">
          <div className="w-24 flex-shrink-0"></div>
          {Array.from({ length: duration + 1 }).map((_, i) => (
            <div 
              key={`marker-${i}`} 
              className="border-l border-slate-800 h-4 flex-shrink-0"
              style={{ width: pixelsPerSecond }}
            >
              <span className="text-[9px] text-slate-500 ml-1">0:0{i}.0</span>
            </div>
          ))}
        </div>

        {/* Acordes Row */}
        <div className="flex min-h-[60px] relative items-center">
          <div className="w-24 flex-shrink-0 h-full border-r border-slate-800 bg-[#1e293b] flex items-center px-4 sticky left-0 z-20">
            <span className="text-xs font-bold text-slate-300">Acordes</span>
          </div>
          
          <div className="flex-1 flex h-full relative" style={{ width: duration * pixelsPerSecond }}>
            {/* Grid Lines */}
            {Array.from({ length: duration + 1 }).map((_, i) => (
              <div 
                key={`line-${i}`} 
                className="absolute top-0 bottom-0 border-l border-slate-800/50 pointer-events-none"
                style={{ left: i * pixelsPerSecond }}
              />
            ))}

            {/* Events */}
            {events.map((event) => {
              const chord = CHORD_LIBRARY.find(c => c.id === event.chordId);
              return (
                <div
                  key={event.id}
                  className="absolute top-2 bottom-2 bg-blue-600/20 border border-blue-500/50 rounded flex items-center px-3 group hover:bg-blue-600/30 transition-all cursor-move z-10"
                  style={{
                    left: event.startTime * pixelsPerSecond,
                    width: event.duration * pixelsPerSecond
                  }}
                >
                  <span className="text-xs font-bold text-blue-200">{chord?.name}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-blue-300/60 font-mono">
                       0:0{event.startTime}.0
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollbar Thumb Simulation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
           <div className="h-full bg-white/40 w-1/3 rounded-full mx-24"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
