
import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '../types';
import { getNoteDurationValue, getMeasureCapacity } from '../utils/musicMath';
import { Icons } from '../constants';

interface VisualEditorProps {
  measures: MeasureData[];
  selectedNoteIds: string[];
  timeSignature: string;
  activeDuration: Duration;
  hasClipboard: boolean;
  onSelectNote: (id: string, multi: boolean) => void;
  onDoubleClickNote: (id: string) => void;
  onAddNote: (measureId: string) => void;
  onUpdateNote: (id: string, updates: Partial<NoteData>) => void;
  onRemoveMeasure: (id: string) => void;
  onAddMeasure: () => void;
  onUpdateMeasure: (id: string, updates: Partial<MeasureData>) => void;
  onToggleCollapse: (id: string) => void;
  onCopyMeasure: (id: string) => void;
  onPasteMeasure: (id: string) => void;
  onReorderMeasures: (from: number, to: number) => void;
  onRemoveNote: (id: string) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ 
  measures, 
  selectedNoteIds, 
  timeSignature,
  activeDuration,
  hasClipboard,
  onSelectNote, 
  onDoubleClickNote,
  onAddNote, 
  onRemoveMeasure,
  onAddMeasure,
  onUpdateMeasure,
  onToggleCollapse,
  onCopyMeasure,
  onPasteMeasure,
  onReorderMeasures,
  onRemoveNote
}) => {
  const capacity = getMeasureCapacity(timeSignature);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    onReorderMeasures(draggedIndex, index);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getTechColor = (tech: string) => {
    switch(tech) {
      case 's': return 'bg-cyan-500';
      case 'h': return 'bg-emerald-500';
      case 'p': return 'bg-rose-500';
      case 'b': return 'bg-amber-500';
      case 'v': return 'bg-purple-500';
      default: return 'bg-slate-600';
    }
  };

  const getTechLabel = (tech: string) => {
    switch(tech) {
      case 's': return 'SLIDE';
      case 'h': return 'HAMMER';
      case 'p': return 'PULL';
      case 'b': return 'BEND';
      case 'v': return 'VIB';
      default: return tech.toUpperCase();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/30 custom-scrollbar">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Score Constructor</h2>
          <span className="text-[10px] text-slate-500 font-medium uppercase">Intelligent Grid Control</span>
        </div>
        <div className="flex items-center space-x-3">
          {hasClipboard && (
            <button 
              onClick={() => onPasteMeasure('')}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-black hover:bg-emerald-500/20 transition-all flex items-center space-x-2 animate-in fade-in zoom-in"
            >
              <Icons.Paste />
              <span>PASTE CLONE</span>
            </button>
          )}
          <button 
            onClick={onAddMeasure}
            className="px-4 py-2 bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-black hover:bg-cyan-600/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
          >
            <span>+ NEW SECTION</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20">
        {measures.map((measure, mIdx) => {
          const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
          const usagePercent = Math.min((currentTotal / capacity) * 100, 100);
          const isFull = currentTotal >= capacity - 0.001;
          const isCollapsed = measure.isCollapsed;
          const isDragging = draggedIndex === mIdx;
          const isOver = dragOverIndex === mIdx;

          return (
            <div 
              key={measure.id} 
              draggable={true}
              onDragStart={(e) => handleDragStart(e, mIdx)}
              onDragOver={(e) => handleDragOver(e, mIdx)}
              onDrop={(e) => handleDrop(e, mIdx)}
              onDragEnd={handleDragEnd}
              onDragLeave={() => setDragOverIndex(null)}
              className={`
                bg-slate-800/20 border rounded-[2rem] relative group transition-all duration-300 overflow-hidden 
                hover:bg-slate-800/40 
                ${isDragging ? 'opacity-40 scale-95 border-dashed border-slate-600' : 'opacity-100 border-slate-700/30'}
                ${isOver ? 'border-cyan-500/50 scale-[1.02] translate-y-1' : ''}
                ${isCollapsed ? 'py-4 px-6' : 'p-6'}
              `}
            >
              <div className="absolute -left-3 top-6 flex flex-col space-y-1 items-center z-10">
                <div 
                  className="bg-slate-900 border border-slate-700 w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-black text-cyan-500 shadow-xl group-hover:scale-110 transition-transform cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  {mIdx + 1}
                </div>
                <div className="text-slate-700 group-hover:text-cyan-500/40 transition-colors">
                  <Icons.Grip />
                </div>
              </div>

              <div className="flex items-center justify-between ml-6">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onToggleCollapse(measure.id)} className="p-2 bg-slate-900 rounded-xl text-slate-500 hover:text-cyan-400 border border-slate-700 transition-all">
                    {isCollapsed ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
                  </button>
                  
                  <div className="flex items-center space-x-2 bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                    <button 
                      onClick={() => onUpdateMeasure(measure.id, { showClef: !measure.showClef })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center space-x-1.5 ${measure.showClef ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-600 hover:text-slate-400'}`}
                      title="Toggle Clef visibility"
                    >
                      <span className="opacity-70 scale-90">𝄞</span>
                      <span>Clef</span>
                    </button>
                    <div className="w-px h-3 bg-slate-800" />
                    <button 
                      onClick={() => onUpdateMeasure(measure.id, { showTimeSig: !measure.showTimeSig })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center space-x-1.5 ${measure.showTimeSig ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-slate-600 hover:text-slate-400'}`}
                      title="Toggle Time Signature visibility"
                    >
                      <span className="opacity-70 scale-90 font-serif">4/4</span>
                      <span>Time</span>
                    </button>
                  </div>

                  {isCollapsed && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4">
                       <span className="text-[10px] font-black text-slate-300 uppercase">Measure {mIdx + 1}</span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase">{measure.notes.length} NOTES • {usagePercent.toFixed(0)}% FULL</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Usage</span>
                     <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${isFull ? 'bg-cyan-500' : 'bg-slate-600'}`} style={{ width: `${usagePercent}%` }} />
                     </div>
                  </div>
                  <button onClick={() => onCopyMeasure(measure.id)} className="p-2 bg-slate-900 text-slate-400 rounded-lg border border-slate-700 hover:text-cyan-400 transition-all" title="Copy Measure">
                    <Icons.Copy />
                  </button>
                  <button onClick={() => onRemoveMeasure(measure.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-wrap items-center gap-4 mt-6 ml-6 animate-in slide-in-from-top-2 duration-300">
                  {measure.notes.map((note) => {
                    const isSelected = selectedNoteIds.includes(note.id);
                    const isRest = note.type === 'rest';
                    const isSlideOrigin = !!note.slideTargetId && ['s', 'h', 'p', 'b'].includes(note.technique || '');
                    const isSlideTarget = measure.notes.some(n => n.slideTargetId === note.id);

                    return (
                      <div 
                        key={note.id}
                        onClick={(e) => onSelectNote(note.id, e.shiftKey || e.ctrlKey)}
                        onDoubleClick={() => onDoubleClickNote(note.id)}
                        className={`
                          relative cursor-pointer transition-all duration-300 group/note
                          w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center select-none
                          ${isSelected 
                            ? (isRest ? 'bg-slate-700 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]' : 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]') 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'}
                          ${isRest ? 'grayscale-[0.5]' : ''}
                          ${isSlideOrigin ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500/50' : ''}
                          ${isSlideTarget ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-purple-500/50' : ''}
                        `}
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveNote(note.id);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/note:opacity-100 transition-all hover:scale-110 shadow-lg z-20"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-tighter ${isSelected ? (isRest ? 'text-slate-300' : 'text-cyan-300') : 'text-slate-500'}`}>
                          {note.duration}{note.decorators.dot ? 'd' : ''}
                        </div>

                        {note.technique && (
                          <div className={`absolute top-2 right-2 px-1.5 py-0.5 ${getTechColor(note.technique)} text-white text-[7px] font-black rounded-md uppercase animate-in zoom-in shadow-sm border border-white/20`}>
                            {getTechLabel(note.technique)}
                            {note.slideTargetId && " →"}
                          </div>
                        )}
                        
                        <div className={`transition-transform duration-300 group-hover/note:scale-110 ${isRest ? 'text-slate-500 opacity-60' : 'text-white'}`}>
                          {isRest ? (
                            Icons.MusicRest(note.duration)
                          ) : (
                            <span className="text-2xl font-black">{note.fret}</span>
                          )}
                        </div>
                        
                        {!isRest && (
                          <div className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-cyan-400/70' : 'text-slate-600'}`}>
                            STR {note.string}
                          </div>
                        )}
                        {isRest && (
                           <div className="text-[8px] font-black text-slate-700 uppercase mt-1 tracking-tight">SILENCE</div>
                        )}
                        
                        <div className="absolute bottom-2 flex space-x-1">
                          {note.decorators.dot && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.5)]" />}
                          {!isRest && note.decorators.staccato && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]" />}
                          {!isRest && note.decorators.accent && <div className="w-1.5 h-1.5 bg-red-400 rotate-45" />}
                        </div>
                      </div>
                    );
                  })}
                  
                  {!isFull && (
                    <button 
                      onClick={() => onAddNote(measure.id)} 
                      className="w-12 h-24 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-700 hover:text-cyan-500/80 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all active:scale-90 group/add"
                      title={`Add ${activeDuration.toUpperCase()} note`}
                    >
                      <div className="mb-2 transition-transform group-hover/add:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                      <div className="scale-50 opacity-40 group-hover/add:opacity-80 transition-opacity">
                         {Icons.MusicRest(activeDuration)}
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualEditor;
