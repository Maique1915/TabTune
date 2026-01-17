
import React, { useRef, useEffect } from 'react';
import { FretboardDrawer } from '../services/fretboard-drawer';
import { ChordDiagramProps, FretboardTheme } from '../types';
import { DEFAULT_THEME } from '../constants';

interface GuitarFretboardProps {
  chord?: ChordDiagramProps;
  capoFret?: number;
  width?: number;
  height?: number;
  theme?: FretboardTheme;
}

const GuitarFretboard: React.FC<GuitarFretboardProps> = ({
  chord,
  capoFret = 0,
  width = 400,
  height = 620,
  theme = DEFAULT_THEME
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<FretboardDrawer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const numFrets = height > 700 ? 12 : 5;

    if (!drawerRef.current) {
      drawerRef.current = new FretboardDrawer(ctx, theme, { width, height, capoFret, numFrets });
    } else {
      drawerRef.current.updateOptions({ width, height, capoFret, numFrets });
    }

    const draw = () => {
      if (!drawerRef.current) return;
      drawerRef.current.clear();
      drawerRef.current.draw();
      if (chord) {
        drawerRef.current.drawChord(chord);
      }
    };

    draw();
  }, [chord, capoFret, width, height, theme]);

  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-2">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto rounded-[2rem]"
      />
    </div>
  );
};

export default GuitarFretboard;
