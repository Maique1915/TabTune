
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScoreData } from './types';
import { MusescoreParser } from './services/musescoreParser';
import PianoRoll from './components/PianoRoll';
import NotationView from './components/NotationView';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Music, 
  Sparkles, 
  Info,
  ChevronRight,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewMode, setViewMode] = useState<'piano-roll' | 'notation'>('notation');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined && isPlaying && score) {
      const deltaTime = time - lastTimeRef.current;
      const ticksPerMs = (score.tempo / 60000) * score.divisions;
      const ticksDelta = deltaTime * ticksPerMs;
      
      setCurrentTime(prev => {
        const next = prev + ticksDelta;
        if (next >= score.totalTicks) {
          setIsPlaying(false);
          return score.totalTicks;
        }
        return next;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, score]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const parsedScore = await MusescoreParser.parseFile(file);
      setScore(parsedScore);
      setCurrentTime(0);
      setIsPlaying(false);
      setAiAnalysis(null);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Erro ao processar arquivo MuseScore.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!score) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analise esta partitura: Titulo: ${score.title}, Compositor: ${score.composer}, Notas: ${score.notes.length}. Descreva o estilo musical em português.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiAnalysis(response.text);
    } catch (err) {
      setAiAnalysis("Não foi possível analisar no momento.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100 p-4 gap-4 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
            <Music className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            MUSE<span className="text-blue-500">VIZ</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {score && (
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
               <button 
                onClick={() => setViewMode('notation')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'notation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               >
                 <FileText size={16} />
                 <span className="text-sm font-semibold">Partitura</span>
               </button>
               <button 
                onClick={() => setViewMode('piano-roll')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'piano-roll' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               >
                 <LayoutGrid size={16} />
                 <span className="text-sm font-semibold">Modern</span>
               </button>
            </div>
          )}
          {!score ? (
            <label className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-full font-semibold cursor-pointer">
              <Upload size={18} />
              <span>Importar Score</span>
              <input type="file" accept=".mscz,.mscx" className="hidden" onChange={handleFileUpload} />
            </label>
          ) : (
            <button onClick={handleAnalyzeWithAI} disabled={isAnalyzing} className="px-5 py-2 bg-indigo-600 rounded-full font-semibold flex items-center gap-2">
                <Sparkles size={18} />
                <span>{isAnalyzing ? 'Analisando...' : 'AI Insights'}</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex gap-4 overflow-hidden">
        <div className="flex-grow flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center animate-pulse">
               <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
               <p>Carregando partitura...</p>
            </div>
          ) : score ? (
            viewMode === 'piano-roll' ? (
                <PianoRoll score={score} isPlaying={isPlaying} currentTime={currentTime} onSeek={setCurrentTime} />
            ) : (
                <NotationView score={score} currentTime={currentTime} onSeek={setCurrentTime} />
            )
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800">
               <Music size={64} className="text-slate-700 mb-6" />
               <h3 className="text-2xl font-bold mb-8">Nenhum arquivo carregado</h3>
               <label className="px-8 py-4 bg-blue-600 rounded-2xl font-bold text-lg cursor-pointer">
                  <span>Selecionar MuseScore (.mscz)</span>
                  <input type="file" accept=".mscz,.mscx" className="hidden" onChange={handleFileUpload} />
               </label>
            </div>
          )}
        </div>

        {(score || aiAnalysis) && (
            <aside className="w-80 flex flex-col gap-4">
                {score && (
                    <section className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Reprodução</h4>
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => setCurrentTime(0)} className="p-3 bg-slate-800 rounded-full"><RotateCcw size={20} /></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`p-5 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-blue-600'}`}>
                                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                            </button>
                        </div>
                    </section>
                )}
                {aiAnalysis && (
                    <section className="flex-grow p-5 bg-slate-900 rounded-2xl border border-slate-800 overflow-auto">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase mb-4 flex items-center gap-2">
                            <Sparkles size={14} /> Análise IA
                        </h4>
                        <p className="text-sm text-slate-300 italic">"{aiAnalysis}"</p>
                    </section>
                )}
            </aside>
        )}
      </main>
    </div>
  );
};

export default App;
