
import React, { useState } from 'react';
import GuitarFretboard from './components/GuitarFretboard';
import { ChordDiagramProps } from './types';

const App: React.FC = () => {
  const [capoFret, setCapoFret] = useState(1);
  const [neckType, setNeckType] = useState<'full' | 'short'>('short');
  const [activeTab, setActiveTab] = useState<'theory' | 'fretboard' | 'settings'>('settings');
  const [activeChord, setActiveChord] = useState<string>('G');

  const chords: Record<string, ChordDiagramProps> = {
    'G': { fingers: [{ string: 6, fret: 3, finger: 3 }, { string: 5, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 4 }] },
    'C': { fingers: [{ string: 5, fret: 3, finger: 3 }, { string: 4, fret: 2, finger: 2 }, { string: 2, fret: 1, finger: 1 }], avoid: [6] },
    'D': { fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 3 }, { string: 1, fret: 2, finger: 2 }], avoid: [6, 5] },
    'Am': { fingers: [{ string: 4, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }, { string: 2, fret: 1, finger: 1 }], avoid: [6] }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex justify-center items-center p-4 lg:p-8 overflow-hidden font-['Inter']">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0 bg-[#121214] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 h-[900px]">
        
        {/* SIDEBAR PANEL */}
        <aside className="p-8 flex flex-col gap-8 border-r border-white/5 bg-[#121214] overflow-y-auto">
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
                <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-black text-xl leading-tight tracking-tight">CHORD EDITOR</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Noteforge Engine</p>
              </div>
            </div>
            <button className="w-11 h-11 rounded-2xl bg-[#1e1e21] flex items-center justify-center border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-[#27272a]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 bg-[#1e1e21] p-1.5 rounded-2xl border border-white/5">
            {['theory', 'fretboard', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#3f3f46] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls Section */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Guitar Neck</label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#1e1e21] rounded-2xl border border-white/5">
                <button 
                  onClick={() => setNeckType('full')}
                  className={`py-3.5 rounded-xl text-[10px] font-black transition-all ${neckType === 'full' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30' : 'text-gray-500 hover:text-gray-300'}`}
                >FULL NECK</button>
                <button 
                  onClick={() => setNeckType('short')}
                  className={`py-3.5 rounded-xl text-[10px] font-black transition-all ${neckType === 'short' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30' : 'text-gray-500 hover:text-gray-300'}`}
                >SHORT NECK</button>
              </div>
            </div>

            <div className="h-px bg-white/5 my-2"></div>

            <div className="space-y-5">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Global Config</label>
              
              <div className="space-y-2.5">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-wider">Instrument</span>
                <div className="bg-[#1e1e21] p-5 rounded-2xl border border-white/5 text-sm font-bold flex justify-between items-center cursor-pointer hover:bg-[#27272a] transition-all">
                  Violão / Guitarra (6 cordas)
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-wider">Tuning</span>
                <div className="bg-[#1e1e21] p-5 rounded-2xl border border-white/5 text-sm font-bold flex justify-between items-center">
                  E A D G B e
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-wider">Tuning Shift / Capo</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCapoFret(Math.max(0, capoFret - 1))} className="w-14 h-14 bg-[#1e1e21] border border-white/5 rounded-2xl flex items-center justify-center text-2xl font-black hover:bg-[#27272a] transition-all active:scale-90">-</button>
                  <div className="flex-1 bg-[#1e1e21] h-14 border border-white/5 rounded-2xl flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-white">
                    {capoFret === 0 ? 'Standard' : `+ ${capoFret}`}
                  </div>
                  <button onClick={() => setCapoFret(Math.min(12, capoFret + 1))} className="w-14 h-14 bg-[#1e1e21] border border-white/5 rounded-2xl flex items-center justify-center text-2xl font-black hover:bg-[#27272a] transition-all active:scale-90">+</button>
                </div>
              </div>
            </div>

            <button className="mt-4 w-full py-5 bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-2xl text-[#06b6d4] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#06b6d4]/20 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path></svg>
              Import Score
            </button>
          </div>

          <div className="mt-auto flex items-center gap-4 py-6 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">N</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Noteforge Active</span>
          </div>
        </aside>

        {/* MAIN VISUALIZER CONTENT */}
        <main className="bg-[#0b0b0e] flex items-center justify-center relative p-8 lg:p-16">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-xl">
            <GuitarFretboard 
              chord={chords[activeChord]} 
              capoFret={capoFret}
              width={460}
              height={neckType === 'full' ? 760 : 620}
            />
            
            {/* Chord Selector Mini-HUD */}
            <div className="flex gap-2 p-2 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-2xl">
              {Object.keys(chords).map(c => (
                <button 
                  key={c}
                  onClick={() => setActiveChord(c)}
                  className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeChord === c ? 'bg-[#06b6d4] text-white shadow-lg shadow-[#06b6d4]/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;
