
import React, { useState } from 'react';
import { ScoreStyle, TransitionType } from '../types';

interface StyleSidebarProps {
  style: ScoreStyle;
  onChange: (newStyle: Partial<ScoreStyle>) => void;
  onReset: () => void;
}

type TabType = 'env' | 'comp' | 'play';

const StyleSidebar: React.FC<StyleSidebarProps> = ({ style, onChange, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('comp');

  const paperPresets = [
    { name: 'Classic', color: '#ffffff' },
    { name: 'Sepia', color: '#fdf6e3' },
    { name: 'Slate', color: '#1e293b' },
    { name: 'Midnight', color: '#020617' }
  ];

  const TabButton: React.FC<{ id: TabType; label: string }> = ({ id, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-2 ${
        activeTab === id 
        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-40 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Aesthetics</h2>
          <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest">Visual Customization</span>
        </div>
        <button 
          onClick={onReset}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-500 hover:text-cyan-400 transition-all active:scale-90 border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>

      <div className="flex p-3 bg-slate-950/40 gap-2 border-b border-slate-800">
        <TabButton id="env" label="Canvas" />
        <TabButton id="comp" label="Styles" />
        <TabButton id="play" label="Motion" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {activeTab === 'env' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paper Themes</label>
              <div className="grid grid-cols-2 gap-3">
                {paperPresets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => onChange({ paperColor: p.color })}
                    className={`p-2 rounded-2xl border-2 transition-all ${style.paperColor === p.color ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-800 bg-slate-950'}`}
                  >
                    <div className="w-full h-10 rounded-xl mb-2" style={{ backgroundColor: p.color }} />
                    <span className="text-[9px] font-black uppercase text-slate-400">{p.name}</span>
                  </button>
                ))}
              </div>
            </section>
            
            <section className="mt-8 space-y-6">
               <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase flex justify-between">Scale <span>{style.scale.toFixed(1)}x</span></label>
                <input type="range" min="0.5" max="2" step="0.1" value={style.scale} onChange={(e) => onChange({ scale: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-cyan-500" />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'comp' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Notation Components
              </label>
              <div className="space-y-2">
                {[
                  { key: 'clefColor', label: 'Clefs (Claves)' },
                  { key: 'timeSigColor', label: 'Time Sig (Compasso)' },
                  { key: 'noteColor', label: 'Musical Notes' },
                  { key: 'restColor', label: 'Rests (Pausas)' },
                  { key: 'lineColor', label: 'Staff Lines' }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</span>
                    <input 
                      type="color" 
                      value={(style as any)[item.key]} 
                      onChange={(e) => onChange({ [item.key]: e.target.value })} 
                      className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer hover:scale-110 transition-transform shadow-lg" 
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'play' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Animation Style</label>
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1.5 flex-wrap">
                {(['snap', 'slide', 'fade', 'assemble'] as TransitionType[]).map((t) => (
                  <button 
                    key={t}
                    onClick={() => onChange({ transitionType: t })}
                    className={`flex-1 min-w-[60px] py-2 text-[10px] font-black uppercase rounded-xl transition-all ${style.transitionType === t ? 'bg-slate-800 text-cyan-400 shadow-md border-cyan-500/30 border' : 'text-slate-600 border-transparent border'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-300 font-bold uppercase">Playhead</span>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">Scanner Line</span>
                  </div>
                  <input type="color" value={style.playheadColor} onChange={(e) => onChange({ playheadColor: e.target.value })} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-300 font-bold uppercase">Active Note</span>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">Passover Color</span>
                  </div>
                  <input type="color" value={style.activeNoteColor} onChange={(e) => onChange({ activeNoteColor: e.target.value })} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer" />
                </div>
              </div>
            </section>

            <section className="space-y-4 bg-cyan-900/5 p-5 rounded-3xl border border-cyan-900/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-cyan-400/70 uppercase">Glow Intensity</span>
                <button 
                  onClick={() => onChange({ glowEffect: !style.glowEffect })}
                  className={`w-10 h-5 rounded-full transition-all relative ${style.glowEffect ? 'bg-cyan-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${style.glowEffect ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <input type="range" min="0" max="30" step="1" value={style.shadowIntensity} onChange={(e) => onChange({ shadowIntensity: parseInt(e.target.value) })} className="w-full h-1 bg-slate-800 rounded-lg appearance-none accent-cyan-500" />
            </section>
          </div>
        )}
      </div>
    </aside>
  );
};

export default StyleSidebar;
