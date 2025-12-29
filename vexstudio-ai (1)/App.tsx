
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StyleSidebar from './components/StyleSidebar';
import ScorePreview from './components/ScorePreview';
import VisualEditor from './components/VisualEditor';
import { Icons } from './constants';
import { MeasureData, NoteData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration } from './types';
import { convertToVextab } from './utils/vextabConverter';
import { 
  getPitchFromMidi, 
  getMidiFromPosition, 
  findBestFretForPitch, 
  getMidiFromPitch, 
  getNoteDurationValue, 
  getMeasureCapacity,
  decomposeValue
} from './utils/musicMath';

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [measures, setMeasures] = useState<MeasureData[]>([
    {
      id: generateId(),
      isCollapsed: false,
      showClef: true,
      showTimeSig: true,
      notes: [
        { id: generateId(), fret: '5', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
        { id: generateId(), fret: '7', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
        { id: generateId(), fret: '9', string: '3', duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
      ]
    }
  ]);
  
  const [clipboard, setClipboard] = useState<MeasureData | null>(null);
  const [activeDuration, setActiveDuration] = useState<Duration>('q');

  const [settings, setSettings] = useState<GlobalSettings>({
    clef: 'treble',
    key: 'C',
    time: '4/4',
    bpm: 120,
    showNotation: true,
    showTablature: true
  });

  const [scoreStyle, setScoreStyle] = useState<ScoreStyle>(DEFAULT_SCORE_STYLE);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const vextabCode = useMemo(() => convertToVextab(measures, settings, scoreStyle), [measures, settings, scoreStyle]);

  const editingNote = useMemo(() => {
    if (!editingNoteId) return null;
    for (const m of measures) {
      const found = m.notes.find(n => n.id === editingNoteId);
      if (found) return found;
    }
    return null;
  }, [editingNoteId, measures]);

  const currentPitch = useMemo(() => {
    if (!editingNote || editingNote.type === 'rest') return null;
    const midi = getMidiFromPosition(parseInt(editingNote.fret), parseInt(editingNote.string));
    return getPitchFromMidi(midi);
  }, [editingNote]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      const [num] = settings.time.split('/').map(Number);
      const beatDuration = 60 / settings.bpm;
      const measureDuration = beatDuration * num;
      const totalDuration = measures.length * measureDuration;
      
      const frameRate = 30;
      const increment = (100 / (totalDuration * (1000 / frameRate)));

      interval = window.setInterval(() => {
        setPlaybackPosition((prev) => (prev >= 100 ? 0 : prev + increment));
      }, frameRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, settings.bpm, settings.time, measures.length]);

  const handleAddMeasure = () => {
    setMeasures([...measures, { 
      id: generateId(), 
      isCollapsed: false, 
      showClef: false, 
      showTimeSig: false, 
      notes: [] 
    }]);
  };

  const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
    setMeasures(measures.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleToggleCollapse = (measureId: string) => {
    setMeasures(measures.map(m => m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m));
  };

  const handleCopyMeasure = (measureId: string) => {
    const measure = measures.find(m => m.id === measureId);
    if (measure) setClipboard(JSON.parse(JSON.stringify(measure)));
  };

  const handlePasteMeasure = () => {
    if (!clipboard) return;
    const newMeasure: MeasureData = {
      ...clipboard,
      id: generateId(),
      isCollapsed: false,
      notes: clipboard.notes.map(n => ({ ...n, id: generateId() }))
    };
    setMeasures([...measures, newMeasure]);
  };

  const handleReorderMeasures = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newMeasures = [...measures];
    const [moved] = newMeasures.splice(fromIndex, 1);
    newMeasures.splice(toIndex, 0, moved);
    setMeasures(newMeasures);
  };

  const handleRemoveNote = (noteId: string) => {
    setMeasures(prev => prev.map(m => ({
      ...m,
      notes: m.notes.filter(n => n.id !== noteId)
    })));
    setSelectedNoteIds(prev => prev.filter(id => id !== noteId));
    if (editingNoteId === noteId) setEditingNoteId(null);
  };

  const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
    setMeasures(prevMeasures => {
      return prevMeasures.map(m => {
        const noteIndex = m.notes.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return m;

        const note = m.notes[noteIndex];
        const oldVal = getNoteDurationValue(note.duration, !!note.decorators.dot);
        const targetDuration = newDuration || note.duration;
        const targetDot = newDot !== undefined ? newDot : !!note.decorators.dot;
        const newVal = getNoteDurationValue(targetDuration, targetDot);
        
        let delta = newVal - oldVal;
        const newNotes = [...m.notes];
        
        newNotes[noteIndex] = { 
          ...note, 
          duration: targetDuration, 
          decorators: { ...note.decorators, dot: targetDot } 
        };

        if (delta > 0) {
          let remainingToCut = delta;
          let i = noteIndex + 1;
          while (remainingToCut > 0.001 && i < newNotes.length) {
            const nextNote = newNotes[i];
            const nextVal = getNoteDurationValue(nextNote.duration, !!nextNote.decorators.dot);
            
            if (nextVal <= remainingToCut + 0.001) {
              remainingToCut -= nextVal;
              newNotes.splice(i, 1);
            } else {
              const targetNextVal = nextVal - remainingToCut;
              const decomposed = decomposeValue(targetNextVal);
              if (decomposed.length > 0) {
                newNotes[i] = { 
                  ...nextNote, 
                  duration: decomposed[0].duration as Duration,
                  decorators: { ...nextNote.decorators, dot: decomposed[0].dotted }
                };
                if (decomposed.length > 1) {
                  const extraRests = decomposed.slice(1).map(d => ({
                    id: generateId(),
                    fret: '0',
                    string: '1',
                    duration: d.duration as Duration,
                    type: 'rest' as const,
                    decorators: { dot: d.dotted },
                    accidental: 'none' as const
                  }));
                  newNotes.splice(i + 1, 0, ...extraRests);
                }
              }
              remainingToCut = 0;
            }
          }
        } else if (delta < 0) {
          const absDelta = Math.abs(delta);
          const restsToAdd = decomposeValue(absDelta).map(d => ({
            id: generateId(),
            fret: '0',
            string: '1',
            duration: d.duration as Duration,
            type: 'rest' as const,
            decorators: { dot: d.dotted },
            accidental: 'none' as const
          }));
          newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
        }

        const capacity = getMeasureCapacity(settings.time);
        let total = 0;
        const finalNotes: NoteData[] = [];
        for (const n of newNotes) {
          const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
          if (total + val <= capacity + 0.001) {
            finalNotes.push(n);
            total += val;
          } else {
             const spaceLeft = capacity - total;
             if (spaceLeft >= 0.03125) { 
                const decomposed = decomposeValue(spaceLeft);
                if (decomposed.length > 0) {
                   finalNotes.push({
                     ...n,
                     duration: decomposed[0].duration as Duration,
                     decorators: { ...n.decorators, dot: decomposed[0].dotted }
                   });
                }
             }
             break;
          }
        }

        return { ...m, notes: finalNotes };
      });
    });
  };

  const handleAddNote = (measureId: string) => {
    const measure = measures.find(m => m.id === measureId);
    if (!measure) return;
    const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
    const capacity = getMeasureCapacity(settings.time);
    const newNoteValue = getNoteDurationValue(activeDuration, false);

    if (currentTotal + newNoteValue > capacity + 0.001) {
      const newMeasureId = generateId();
      const newNote = { 
        id: generateId(), 
        fret: '0', 
        string: '1', 
        duration: activeDuration, 
        type: 'note' as const, 
        decorators: {},
        accidental: 'none' as const
      };
      const newMeasures = [...measures];
      const currentIndex = measures.findIndex(m => m.id === measureId);
      newMeasures.splice(currentIndex + 1, 0, { 
        id: newMeasureId, 
        isCollapsed: false, 
        showClef: false, 
        showTimeSig: false, 
        notes: [newNote] 
      });
      setMeasures(newMeasures);
    } else {
      setMeasures(measures.map(m => {
        if (m.id === measureId) {
          return {
            ...m,
            notes: [...m.notes, { id: generateId(), fret: '0', string: '1', duration: activeDuration, type: 'note', decorators: {}, accidental: 'none' }]
          };
        }
        return m;
      }));
    }
  };

  const handleSelectNote = (id: string, multi: boolean) => {
    if (multi) setSelectedNoteIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    else setSelectedNoteIds([id]);
  };

  const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
    setMeasures(measures.map(m => ({
      ...m,
      notes: m.notes.map(n => {
        if (selectedNoteIds.includes(n.id) || n.id === editingNoteId) {
          const resolvedUpdates = typeof updates === 'function' ? updates(n) : updates;
          return { ...n, ...resolvedUpdates };
        }
        return n;
      })
    })));
  };

  const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
    if (!editingNote || !currentPitch) return;
    const pitch = newName ?? currentPitch.name;
    const acc = newAccidental ?? currentPitch.accidental;
    const oct = newOctave ?? currentPitch.octave;
    const midi = getMidiFromPitch(pitch, acc, oct);
    const { fret, string } = findBestFretForPitch(midi, parseInt(editingNote.string));
    updateSelectedNotes({ fret: fret.toString(), string: string.toString() });
  };

  const handleInsert = (code: string) => {
    if (code.startsWith('clef=')) {
      const clefValue = code.split('=')[1] as GlobalSettings['clef'];
      setSettings(prev => ({ ...prev, clef: clefValue }));
      return;
    }

    if (['s', 'h', 'p', 'b'].includes(code) && selectedNoteIds.length === 2) {
      let firstNote: NoteData | null = null;
      let secondNote: NoteData | null = null;

      for (const m of measures) {
        const found = m.notes.filter(n => selectedNoteIds.includes(n.id));
        if (found.length === 2) {
          const idx0 = m.notes.findIndex(n => n.id === found[0].id);
          const idx1 = m.notes.findIndex(n => n.id === found[1].id);
          if (idx0 < idx1) {
            firstNote = m.notes[idx0];
            secondNote = m.notes[idx1];
          } else {
            firstNote = m.notes[idx1];
            secondNote = m.notes[idx0];
          }
          break;
        }
      }

      if (firstNote && secondNote && firstNote.string === secondNote.string) {
        const targetId = secondNote.id;
        setMeasures(prev => prev.map(m => ({
          ...m,
          notes: m.notes.map(n => {
            if (n.id === firstNote!.id) {
              return { 
                ...n, 
                technique: n.technique === code && n.slideTargetId === targetId ? undefined : code,
                slideTargetId: n.technique === code && n.slideTargetId === targetId ? undefined : targetId
              };
            }
            return n;
          })
        })));
        return;
      }
    }

    if (selectedNoteIds.length > 0) {
      setMeasures(prev => prev.map(m => ({
        ...m,
        notes: m.notes.map(n => {
          if (selectedNoteIds.includes(n.id)) {
            return { 
              ...n, 
              technique: n.technique === code ? undefined : code,
              slideTargetId: n.technique === code ? undefined : n.slideTargetId
            };
          }
          return n;
        })
      })));
    }
  };

  const toggleVisibility = (type: 'notation' | 'tablature') => {
    setSettings(prev => {
      const next = { ...prev };
      if (type === 'notation') {
        // Only allow hiding if tablature is still visible
        if (!next.showNotation || next.showTablature) {
          next.showNotation = !next.showNotation;
        }
      } else {
        // Only allow hiding if notation is still visible
        if (!next.showTablature || next.showNotation) {
          next.showTablature = !next.showTablature;
        }
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden relative font-['Inter']">
      {editingNote && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setEditingNoteId(null)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${editingNote.type === 'rest' ? 'bg-slate-700 text-slate-400' : 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}>
                   {editingNote.type === 'note' ? (
                     <span className="text-xl font-black">{currentPitch?.name}</span>
                   ) : (
                     Icons.MusicRest(editingNote.duration)
                   )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">{editingNote.type === 'note' ? 'Note Inspector' : 'Rest Inspector'}</h2>
                  {editingNote.type === 'note' ? (
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Calculated Pitch: {currentPitch?.name}{currentPitch?.accidental}{currentPitch?.octave}</p>
                  ) : (
                    <p className="text-[10px] text-amber-500/60 font-mono uppercase tracking-widest italic">Silent duration - No pitch data</p>
                  )}
                </div>
              </div>
              <button onClick={() => setEditingNoteId(null)} className="p-4 bg-slate-800 rounded-3xl text-slate-400 hover:text-white transition-all active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                 <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center space-x-2">
                   <div className="w-4 h-px bg-purple-400" />
                   <span>Rhythmic Properties</span>
                 </h4>
                 
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration Value</label>
                    <div className="grid grid-cols-3 gap-2">
                       {(['w', 'h', 'q', '8', '16', '32'] as Duration[]).map(d => (
                         <button 
                            key={d} 
                            onClick={() => handleNoteRhythmChange(editingNote.id, d)}
                            className={`py-3 rounded-xl border-2 font-black transition-all text-xs flex flex-col items-center justify-center space-y-1 ${editingNote.duration === d ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                         >
                           <span className="opacity-40 scale-75">{Icons.MusicRest(d)}</span>
                           <span>{d.toUpperCase()}</span>
                         </button>
                       ))}
                    </div>
                    <button 
                      onClick={() => handleNoteRhythmChange(editingNote.id, undefined, !editingNote.decorators.dot)}
                      className={`w-full py-3 rounded-xl border-2 font-black transition-all text-xs flex items-center justify-center space-x-2 ${editingNote.decorators.dot ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${editingNote.decorators.dot ? 'bg-amber-400' : 'bg-slate-700'}`} />
                      <span>AUGMENTATION DOT (×1.5)</span>
                    </button>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-800/40">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Toggle Note/Rest</label>
                    <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                      <button onClick={() => updateSelectedNotes({type: 'note'})} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${editingNote.type === 'note' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-600'}`}>Musical Note</button>
                      <button onClick={() => updateSelectedNotes({type: 'rest'})} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${editingNote.type === 'rest' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-600'}`}>Silence (Rest)</button>
                    </div>
                 </div>
              </div>

              <div className={`space-y-8 transition-opacity duration-500 ${editingNote.type === 'rest' ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
                 <h4 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center space-x-2">
                   <div className="w-4 h-px bg-cyan-400" />
                   <span>Pitch & Tablature</span>
                 </h4>
                 {editingNote.type === 'note' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-2">
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(n => (
                        <button key={n} onClick={() => handlePitchChange(n)} className={`py-3 rounded-xl border-2 font-black transition-all ${currentPitch?.name === n ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>{n}</button>
                      ))}
                    </div>
                    <div className="flex bg-slate-950 rounded-2xl border border-slate-800 p-1">
                      {[2,3,4,5,6].map(o => (
                        <button key={o} onClick={() => handlePitchChange(undefined, undefined, o)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${currentPitch?.octave === o ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{o}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-4">
                      {[1,2,3,4,5,6].map(s => (
                        <button key={s} onClick={() => updateSelectedNotes({ string: s.toString() })} className={`py-4 rounded-xl border-2 font-black transition-all ${editingNote.string === s.toString() ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>STR {s}</button>
                      ))}
                    </div>
                  </div>
                 )}
              </div>
            </div>
            <div className="p-8 bg-slate-950 border-t border-slate-800/50">
              <button onClick={() => setEditingNoteId(null)} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl">Apply & Close</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar onInsert={handleInsert} activeDuration={activeDuration} onSelectDuration={setActiveDuration} />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 border-r border-slate-800">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-8 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-2 rounded-2xl flex items-center space-x-3 text-xs font-black transition-all ${isPlaying ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
              {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              <span>{isPlaying ? 'STOP' : 'PLAY'}</span>
            </button>
            <button onClick={() => { setIsPlaying(false); setPlaybackPosition(0); }} className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <Icons.Reset />
            </button>
            <div className="h-6 w-px bg-slate-800 mx-2" />
            
            <div className="flex items-center space-x-2 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
               <div className="flex items-center px-3 space-x-2 border-r border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Tempo</span>
                  <input type="number" value={settings.bpm} min="40" max="240" onChange={(e) => setSettings({...settings, bpm: parseInt(e.target.value) || 120})} className="w-12 bg-transparent text-xs font-black text-cyan-400 outline-none text-center" />
                  <span className="text-[10px] font-bold text-slate-700">BPM</span>
               </div>
               <select value={settings.time} onChange={(e) => setSettings({...settings, time: e.target.value})} className="bg-transparent text-xs font-black text-slate-300 px-3 outline-none cursor-pointer">
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="2/4">2/4</option>
                <option value="6/8">6/8</option>
              </select>
            </div>

            <div className="h-6 w-px bg-slate-800 mx-2" />
            
            <div className="flex items-center space-x-2 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => toggleVisibility('notation')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center space-x-2 ${settings.showNotation ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <span className="text-sm">𝄞</span>
                <span>Partitura</span>
              </button>
              <button 
                onClick={() => toggleVisibility('tablature')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center space-x-2 ${settings.showTablature ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <span className="text-sm">TAB</span>
                <span>Tablatura</span>
              </button>
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-500/30 truncate max-w-[300px] select-none">{vextabCode}</div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <VisualEditor 
            measures={measures}
            selectedNoteIds={selectedNoteIds}
            timeSignature={settings.time}
            activeDuration={activeDuration}
            onSelectNote={handleSelectNote}
            onDoubleClickNote={(id) => setEditingNoteId(id)}
            onAddNote={handleAddNote}
            onUpdateNote={(id, up) => updateSelectedNotes(up)}
            onRemoveMeasure={(id) => setMeasures(measures.filter(m => m.id !== id))}
            onAddMeasure={handleAddMeasure}
            onUpdateMeasure={handleUpdateMeasure}
            onToggleCollapse={handleToggleCollapse}
            onCopyMeasure={handleCopyMeasure}
            onPasteMeasure={handlePasteMeasure}
            onReorderMeasures={handleReorderMeasures}
            onRemoveNote={handleRemoveNote}
            hasClipboard={!!clipboard}
          />
          <div className="h-[45%] border-t border-slate-800 bg-slate-950">
            <ScorePreview code={vextabCode} measures={measures} timeSignature={settings.time} playbackPosition={playbackPosition} isPlaying={isPlaying} style={scoreStyle} />
          </div>
        </div>
      </main>

      <StyleSidebar style={scoreStyle} onChange={(up) => setScoreStyle({...scoreStyle, ...up})} onReset={() => setScoreStyle(DEFAULT_SCORE_STYLE)} />
    </div>
  );
};

export default App;
