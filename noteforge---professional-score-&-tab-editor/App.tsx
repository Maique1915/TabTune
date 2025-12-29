
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Customizer } from './components/Customizer';
import { ScoreRenderer } from './components/ScoreRenderer';
import { ScoreConstructor } from './components/ScoreConstructor';
import { Toolbar } from './components/Toolbar';
import { ScoreTheme, ScoreData, Duration, Clef } from './types';
import { INITIAL_THEME } from './constants';

const INITIAL_SCORE: ScoreData = {
  measures: [
    {
      id: 'm1',
      clef: 'treble',
      timeSignature: '4/4',
      notes: [
        { id: 'n1', keys: ['c/4'], duration: 'q', isRest: false, tabPositions: [{ str: 5, fret: 3 }] },
        { id: 'n2', keys: ['e/4'], duration: 'q', isRest: false, tabPositions: [{ str: 4, fret: 2 }] },
        { id: 'n3', keys: ['g/4'], duration: 'q', isRest: false, tabPositions: [{ str: 3, fret: 0 }] },
        { id: 'n4', keys: ['b/4'], duration: 'q', isRest: true }
      ]
    },
    {
        id: 'm2',
        clef: 'treble',
        timeSignature: '4/4',
        notes: [
          { id: 'n5', keys: ['c/5'], duration: 'h', isRest: false, tabPositions: [{ str: 2, fret: 1 }] },
          { id: 'n6', keys: ['a/4'], duration: 'h', isRest: false, tabPositions: [{ str: 3, fret: 2 }] }
        ]
      }
  ]
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ScoreTheme>(INITIAL_THEME);
  const [score, setScore] = useState<ScoreData>(INITIAL_SCORE);
  const [activeDuration, setActiveDuration] = useState<Duration>('q');
  const [activeClef, setActiveClef] = useState<Clef>('treble');
  const [viewMode, setViewMode] = useState<'both' | 'partitura' | 'tablatura'>('both');

  const handleThemeChange = (key: keyof ScoreTheme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleAddMeasure = () => {
    const newMeasure = {
      id: `m${Date.now()}`,
      clef: activeClef,
      timeSignature: '4/4',
      notes: []
    };
    setScore(prev => ({ ...prev, measures: [...prev.measures, newMeasure] }));
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Left Sidebar - Library */}
      <Sidebar 
        activeDuration={activeDuration} 
        onDurationChange={setActiveDuration}
        activeClef={activeClef}
        onClefChange={setActiveClef}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <Toolbar viewMode={viewMode} setViewMode={setViewMode} />
        
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-8">
          {/* Renderer Display Container */}
          <div className="relative rounded-2xl bg-zinc-900/40 border border-zinc-800/50 p-8 min-h-[400px] shadow-2xl backdrop-blur-sm group">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            <ScoreRenderer score={score} theme={theme} viewMode={viewMode} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-cyan-500/50 font-medium">
                SIGNAL: ACTIVE
            </div>
          </div>

          {/* Score Constructor Panel */}
          <ScoreConstructor 
            score={score} 
            onAddMeasure={handleAddMeasure} 
            activeDuration={activeDuration}
          />
        </div>
      </main>

      {/* Right Sidebar - Customizer */}
      <Customizer theme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
};

export default App;
