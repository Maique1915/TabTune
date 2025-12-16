"use client";

import React, { useRef, useEffect } from 'react';
import type { ChordDiagramProps } from '@/lib/types';
import { ChordDrawerBase } from '@/lib/chord-drawer-base';
import { useAppContext } from '@/app/context/app--context';

// This component wraps the Canvas-based chord drawing logic for use in React.
const CanvasChordDiagram: React.FC<ChordDiagramProps & { scale?: number }> = (props) => {
  const { scale = 1.0, ...chordProps } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colors } = useAppContext();

  // The ChordDrawerBase has a fixed internal base width (600).
  // We define a base size for our component's canvas and use the scale prop
  // to control the final rendered size, similar to the old component.
  const baseWidth = 350;
  const baseHeight = 1100;
  const canvasWidth = baseWidth * scale;
  const canvasHeight = baseHeight * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The drawer's internal dimensions are set to the canvas size.
    const dimensions = { width: canvas.width, height: canvas.height };
    
    // The base width of the drawing logic in ChordDrawerBase is 600px.
    // We calculate a scale factor to make that 600px drawing fit into our canvas width.
    const drawerBaseWidth = 600;
    const calculatedScaleFactor = canvas.width / drawerBaseWidth;

    const drawer = new ChordDrawerBase(ctx, colors, dimensions, calculatedScaleFactor);

    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Center the chord within the canvas
    drawer.calculateWithOffset(0);
    
    // Draw the chord. Note that the props passed to drawChord should not include the scale prop
    // meant for this React component.
    drawer.drawChord(chordProps, 1);

  }, [chordProps, colors, canvasWidth, canvasHeight, scale]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ width: canvasWidth, height: canvasHeight }} />;
};

export { CanvasChordDiagram };
