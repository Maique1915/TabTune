
import React, { useState } from 'react';
import { Settings, Info, Fingerprint } from 'lucide-react';
import { AnimationStyle } from '../types';

const SidebarRight: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anim' | 'general' | 'fingers'>('anim');
  const [animStyle, setAnimStyle] = useState<AnimationStyle>(AnimationStyle.CAROUSEL);

  return (
    <div className="w-80 bg-[#111827] border-l border-slate-800 flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={18} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-200">Personalizar</h2>
      </div>

      <div className="bg-[#1f2937] rounded-lg p-1 flex mb-6">
        {[
          { id: 'anim', label: 'Animação', icon: Info },
          { id: 'general', label: 'Em geral', icon: Settings },
          { id: 'fingers', label: 'Dedos', icon: Fingerprint }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-all ${
              activeTab === tab.id ? 'bg-[#374151] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 flex-1">
        <section>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-wider">Estilo de animação</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="anim" 
                checked={animStyle === AnimationStyle.CAROUSEL} 
                onChange={() => setAnimStyle(AnimationStyle.CAROUSEL)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Carrossel</p>
                <p className="text-[10px] text-slate-500 leading-tight">Os acordes deslizam pela tela como um carrossel.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="anim" 
                checked={animStyle === AnimationStyle.STATIC} 
                onChange={() => setAnimStyle(AnimationStyle.STATIC)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Escala estática</p>
                <p className="text-[10px] text-slate-500 leading-tight">O braço da guitarra permanece centralizado, os dedos se movem suavemente entre as posições.</p>
              </div>
            </label>
          </div>
        </section>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <button className="w-full bg-[#1f2937] hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-medium transition-colors border border-slate-700">
          Restaurar padrões de fábrica
        </button>
      </div>
    </div>
  );
};

export default SidebarRight;
