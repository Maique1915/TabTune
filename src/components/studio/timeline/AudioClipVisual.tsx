"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/app/context/app--context';

interface AudioClipVisualProps {
  waveform: number[];
}

export const AudioClipVisual: React.FC<AudioClipVisualProps> = ({ waveform }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { colors } = useAppContext();

  // Observe the size of the canvas element to set its resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    
    resizeObserver.observe(canvas);
    
    return () => resizeObserver.disconnect();
  }, []);

  // Redraw the waveform when the size or data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform || waveform.length === 0 || size.width === 0 || size.height === 0) return;

    // Set the canvas buffer size to match its display size
    canvas.width = size.width;
    canvas.height = size.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = size.width;
    const height = size.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / waveform.length;
    ctx.fillStyle = colors.textColor;

    for (let i = 0; i < waveform.length; i++) {
        const val = waveform[i];
        const barHeight = val * height;
        const y = (height - barHeight) / 2;
        ctx.fillRect(i * barWidth, y, 1, barHeight); // Draw thin lines for better detail
    }

  }, [waveform, colors.textColor, size]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
