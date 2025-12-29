
import React, { useEffect, useRef } from 'react';
import { ScoreData, ScoreTheme } from '../types';

declare global {
  interface Window {
    Vex: any;
  }
}

interface ScoreRendererProps {
  score: ScoreData;
  theme: ScoreTheme;
  viewMode: 'both' | 'partitura' | 'tablatura';
}

export const ScoreRenderer: React.FC<ScoreRendererProps> = ({ score, theme, viewMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVexFlow = async () => {
      if (!window.Vex) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = renderScore;
      } else {
        renderScore();
      }
    };

    const renderScore = () => {
      if (!containerRef.current || !window.Vex) return;
      
      const { Renderer, Stave, StaveNote, TabStave, TabNote, Formatter } = window.Vex.Flow;
      
      const container = containerRef.current;
      container.innerHTML = '';
      
      // Aplicar a cor de fundo ao container principal
      container.style.backgroundColor = theme.background;
      container.style.transition = 'background-color 0.3s ease';

      const renderer = new Renderer(container, Renderer.Backends.SVG);
      const width = 800;
      const height = viewMode === 'both' ? 400 : 250;
      renderer.resize(width, height);
      const context = renderer.getContext();
      
      context.setFillStyle('transparent');

      // Helper para aplicar estilos via API
      const applyStyles = (obj: any, color: string, bg: string) => {
          if (!obj) return;
          const style = { 
            fillStyle: color, 
            strokeStyle: color,
            backgroundColor: bg // Tenta aplicar via API
          };
          
          if (obj.setStyle) obj.setStyle(style);
          
          if (obj.modifiers) {
              obj.modifiers.forEach((m: any) => applyStyles(m, color, bg));
          }
      };

      let x = 20;
      const staveWidth = 350;

      score.measures.forEach((measure, idx) => {
        // --- STAFF (PARTITURA) ---
        if (viewMode === 'both' || viewMode === 'partitura') {
            const stave = new Stave(x, 40, staveWidth);
            if (idx === 0) stave.addClef(measure.clef).addTimeSignature(measure.timeSignature);
            
            stave.getModifiers().forEach((mod: any) => {
                const color = mod.getCategory && mod.getCategory() === 'clefs' ? theme.clefs : theme.timeSignature;
                applyStyles(mod, color, theme.background);
            });

            stave.setContext(context);
            stave.setStyle({ fillStyle: theme.staffLines, strokeStyle: theme.staffLines });
            stave.draw();

            const notes = measure.notes.map(n => {
                const note = new StaveNote({ keys: n.keys, duration: n.duration + (n.isRest ? 'r' : '') });
                const color = n.isRest ? theme.rests : theme.notes;
                applyStyles(note, color, theme.background);
                return note;
            });

            if (notes.length > 0) {
                Formatter.FormatAndDraw(context, stave, notes);
            }
        }

        // --- TABLATURA ---
        if (viewMode === 'both' || viewMode === 'tablatura') {
            const yOffset = viewMode === 'both' ? 180 : 40;
            const tabStave = new TabStave(x, yOffset, staveWidth);
            if (idx === 0) tabStave.addTabGlyph();
            
            tabStave.getModifiers().forEach((mod: any) => applyStyles(mod, theme.clefs, theme.background));

            tabStave.setContext(context);
            tabStave.setStyle({ fillStyle: theme.staffLines, strokeStyle: theme.staffLines });
            tabStave.draw();

            const tabNotes = measure.notes.map(n => {
                let tn;
                if (n.isRest) {
                    tn = new TabNote({ positions: [{ str: 3, fret: 'X' }], duration: n.duration + 'r' });
                    applyStyles(tn, theme.rests, theme.background);
                } else {
                    const positions = n.tabPositions || [{ str: 6, fret: 0 }];
                    tn = new TabNote({ positions, duration: n.duration });
                    applyStyles(tn, theme.tabNumbers, theme.background);
                }
                return tn;
            });

            if (tabNotes.length > 0) {
                Formatter.FormatAndDraw(context, tabStave, tabNotes);
            }
        }

        x += staveWidth;
      });
    };

    const timeout = setTimeout(loadVexFlow, 50);
    window.addEventListener('resize', renderScore);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', renderScore);
    };
  }, [score, theme, viewMode]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* CSS Injetado Dinamicamente para capturar os retângulos "white" do VexFlow */}
      <style>
        {`
          .vexflow-container svg rect[fill="white"],
          .vexflow-container svg rect[fill="#ffffff"] {
            fill: ${theme.background} !important;
          }
        `}
      </style>
      <div 
        ref={containerRef} 
        className="vexflow-container flex justify-center items-center w-full min-h-[300px] rounded-xl" 
      />
    </div>
  );
};
