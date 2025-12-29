
import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '../types';

interface ScorePreviewProps {
  code: string;
  measures: MeasureData[];
  timeSignature: string;
  playbackPosition: number;
  isPlaying: boolean;
  style: ScoreStyle;
}

declare global {
  interface Window {
    VexTab: any;
    Artist: any;
    Vex: any;
  }
}

const MeasureThumbnail = memo(({ 
  measureCode, 
  header, 
  isActive, 
  progress, 
  style,
  shouldAnimate,
  showClef,
  showTimeSig
}: { 
  measureCode: string; 
  header: string; 
  isActive: boolean;
  progress: number;
  style: ScoreStyle;
  shouldAnimate: boolean;
  showClef: boolean;
  showTimeSig: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buildProgress, setBuildProgress] = useState((style.transitionType === 'assemble' && shouldAnimate) ? 0 : 100);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new MutationObserver(() => {
      containerRef.current?.querySelectorAll('a').forEach(a => a.remove());
    });
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (style.transitionType !== 'assemble' || !shouldAnimate) {
      setBuildProgress(100);
      return;
    }
    setBuildProgress(0);
    let start: number;
    const duration = 1000; 
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const p = Math.min((timestamp - start) / duration, 1);
      setBuildProgress(p * 100);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [measureCode, style.transitionType, shouldAnimate]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !window.VexTab || !window.Vex) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = style.paperColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderLayer = (targetColor?: string, filterNotes: boolean = false) => {
      const renderer = new window.Vex.Flow.Renderer(canvas, window.Vex.Flow.Renderer.Backends.CANVAS);
      const context = renderer.getContext();
      
      // --- LÓGICA DE CENTRALIZAÇÃO VERTICAL ---
      // Detectamos se notation e tablature estão habilitados no código para calcular o offset Y
      const hasNotation = measureCode.includes('notation=true');
      const hasTab = measureCode.includes('tablature=true');
      
      let startY = 40; // Padrão para ambos visíveis
      if (hasNotation && !hasTab) {
        startY = 120; // Apenas partitura: desce mais para o centro
      } else if (!hasNotation && hasTab) {
        startY = 100; // Apenas TAB: desce para o centro (TAB costuma ser mais alto que partitura vazia)
      }

      const artist = new window.Artist(10, startY, 780, { scale: style.scale * 1.5 });
      const vextab = new window.VexTab(artist);
      
      try {
        vextab.parse(`${header}\n${measureCode}`);
        setRenderError(null);

        if (artist.staves) {
          artist.staves.forEach((staveInstance: any) => {
            const vStaves = [staveInstance.stave, staveInstance.tab_stave].filter(Boolean);
            
            vStaves.forEach((vfStave: any) => {
              // --- ESTRATÉGIA DE OCULTAÇÃO AGRESSIVA ---
              if (!showClef) {
                if (vfStave.clef) vfStave.clef = null;
                if (vfStave.setClef) vfStave.setClef(null);
              }
              if (!showTimeSig) {
                if (vfStave.timeSignature) vfStave.timeSignature = null;
              }

              if (vfStave.getModifiers) {
                const mods = vfStave.getModifiers();
                mods.forEach((mod: any) => {
                  const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                  const isClef = category.includes('clef');
                  const isTime = category.includes('time');

                  if ((!showClef && isClef) || (!showTimeSig && isTime)) {
                    mod.draw = () => {}; 
                    if (mod.setWidth) mod.setWidth(0);
                    if (mod.setX) mod.setX(0);
                    if (mod.setPadding) mod.setPadding(0);
                  }
                });

                vfStave.modifiers = vfStave.modifiers.filter((mod: any) => {
                  const cat = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                  if (!showClef && cat.includes('clef')) return false;
                  if (!showTimeSig && cat.includes('time')) return false;
                  return true;
                });
              }

              const sColor = targetColor || style.lineColor;
              if (vfStave.setStyle) vfStave.setContext(context).setStyle({ strokeStyle: sColor, fillStyle: sColor });
              
              if (vfStave.getModifiers) {
                vfStave.getModifiers().forEach((mod: any) => {
                  const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                  let color = targetColor || style.noteColor;
                  if (category.includes('clef')) color = targetColor || style.clefColor;
                  else if (category.includes('time')) color = targetColor || style.timeSigColor;
                  const styleObj = { fillStyle: color, strokeStyle: color };
                  if (mod.setStyle) mod.setStyle(styleObj);
                  if (mod.glyph && mod.glyph.setStyle) mod.glyph.setStyle(styleObj);
                });
              }
            });

            if (!filterNotes) {
              [staveInstance.note_notes, staveInstance.tab_notes].forEach(notesGroup => {
                if (notesGroup) {
                  notesGroup.forEach((note: any) => {
                    const isRest = note.isRest === true || (typeof note.isRest === 'function' && note.isRest());
                    const finalColor = targetColor || (isRest ? style.restColor : style.noteColor);
                    if (note.setStyle) note.setStyle({ fillStyle: finalColor, strokeStyle: finalColor });
                    if (note.setStemStyle) note.setStemStyle({ strokeStyle: finalColor });
                    if (isRest) {
                      if (note.setBeam) note.setBeam(null);
                    } else if (note.getBeam && note.getBeam()) {
                      note.getBeam().setStyle({ fillStyle: finalColor, strokeStyle: finalColor });
                    }
                  });
                }
              });
            }
          });
        }
        
        artist.render(renderer);
      } catch (err: any) {
        setRenderError(err.message || "Vextab Error");
      }
    };

    if (style.transitionType === 'assemble' && shouldAnimate) {
      renderLayer(undefined, true);
      ctx.save();
      ctx.beginPath();
      const maskX = 80 + (buildProgress / 100) * (canvas.width - 80);
      ctx.rect(0, 0, maskX, canvas.height);
      ctx.clip();
      renderLayer();
      ctx.restore();
    } else {
      renderLayer();
    }

    if (isActive && !renderError) {
      const playheadX = (progress / 100) * canvas.width;
      ctx.beginPath();
      ctx.strokeStyle = style.playheadColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      if (style.glowEffect) { ctx.shadowBlur = style.shadowIntensity; ctx.shadowColor = style.playheadColor; }
      ctx.moveTo(playheadX, 20);
      ctx.lineTo(playheadX, canvas.height - 20);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = style.playheadColor;
      ctx.beginPath();
      ctx.arc(playheadX, 20, 6, 0, Math.PI * 2);
      ctx.arc(playheadX, canvas.height - 20, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => { draw(); }, [measureCode, header, progress, isActive, style, buildProgress, shouldAnimate, showClef, showTimeSig]);

  return (
    <div 
      ref={containerRef}
      className="rounded-[3.5rem] shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative flex items-center justify-center min-h-[310px]"
      style={{ backgroundColor: style.paperColor }}
    >
      <div className="score-canvas-viewport w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} width={800} height={340} className={`w-full h-auto block transition-opacity duration-300 ${renderError ? 'opacity-20 blur-sm' : 'opacity-100'}`} />
      </div>
      {renderError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
           <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
           </div>
           <p className="text-slate-500 text-[10px] font-mono max-w-xs">{renderError}</p>
        </div>
      )}
    </div>
  );
});

const ScorePreview: React.FC<ScorePreviewProps> = ({ code, playbackPosition, isPlaying, style, measures }) => {
  const { header, rawMeasureCodes } = useMemo(() => {
    try {
      const lines = code.split('\n');
      const headerStr = lines.filter(l => l.startsWith('options')).join('\n');
      const content = code.replace(headerStr, '').trim();
      const blocks = content.split(/(?=tabstave)/g).filter(b => b.trim().length > 0);
      return { header: headerStr, rawMeasureCodes: blocks };
    } catch (e) {
      return { header: '', rawMeasureCodes: [] };
    }
  }, [code]);

  const currentMeasureIndex = useMemo(() => {
    if (rawMeasureCodes.length === 0) return 0;
    const idx = Math.floor((playbackPosition / 100) * rawMeasureCodes.length);
    return Math.min(idx, rawMeasureCodes.length - 1);
  }, [playbackPosition, rawMeasureCodes.length]);

  const measureProgress = useMemo(() => {
    if (rawMeasureCodes.length === 0) return 0;
    const measureWeight = 100 / rawMeasureCodes.length;
    return ((playbackPosition % measureWeight) / measureWeight) * 100;
  }, [playbackPosition, rawMeasureCodes.length]);

  const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === rawMeasureCodes.length - 1;

  // Encontrar o MeasureData correspondente para pegar as flags de visibilidade
  const activeMeasureData = measures[currentMeasureIndex];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
        <div className="w-full max-w-5xl relative h-[310px]">
          {rawMeasureCodes.map((mCode, idx) => (
            idx === currentMeasureIndex && (
              <div 
                key={`${idx}-${style.transitionType}`}
                className={`absolute inset-0 w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ''}`}
              >
                <MeasureThumbnail 
                  measureCode={mCode} 
                  header={header} 
                  isActive={isPlaying}
                  progress={measureProgress}
                  style={style}
                  shouldAnimate={shouldAnimate}
                  showClef={activeMeasureData?.showClef ?? false}
                  showTimeSig={activeMeasureData?.showTimeSig ?? false}
                />
              </div>
            )
          ))}
        </div>
      </div>
      
      <div className="h-24 flex items-center justify-between px-12 z-20 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Timeline</span>
            <div className="flex space-x-2">
              {rawMeasureCodes.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentMeasureIndex ? 'bg-cyan-500 w-16 shadow-[0_0_15px_#06b6d4]' : 'bg-slate-800 w-4 hover:bg-slate-700'}`} 
                />
              ))}
            </div>
         </div>
         <div className="flex items-center space-x-4 bg-slate-900/50 px-6 py-2 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black text-cyan-400 uppercase">Section {currentMeasureIndex + 1}</span>
            <div className="w-px h-4 bg-slate-800" />
            <span className="text-[10px] font-black text-slate-500">{rawMeasureCodes.length} MEASURES</span>
         </div>
      </div>

      <style>{`
        .score-animation-slide { animation: scoreSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .score-animation-fade { animation: scoreFadeIn 0.6s ease-out forwards; }
        @keyframes scoreSlideIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(20px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes scoreFadeIn {
          0% { opacity: 0; filter: blur(15px); }
          100% { opacity: 1; filter: blur(0); }
        }
        .score-canvas-viewport { overflow: hidden; height: 340px !important; }
      `}</style>
    </div>
  );
};

export default ScorePreview;
