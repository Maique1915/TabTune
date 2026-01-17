"use client"

import React from 'react';
import type { ChordDiagramProps, Position, nutForm, StandardPosition } from '@/modules/core/domain/types';
import { getNome, notes, formatNoteName } from '@/modules/core/domain/chord-logic';
import { useAppContext } from '@/app/context/app--context';
import '@/app/chord-diagram.css';

// ------------------------------------------------------------------
// Helper: Pure Function for Transposition & Layout Logic
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// Helper: Pure Function for Transposition & Layout Logic
// ------------------------------------------------------------------
const findMinNonZeroNote = (fingers: StandardPosition[], avoid: number[]): [number, number] => {
  let min = Infinity;
  let max = 0;

  fingers.forEach(f => {
    if (f.fret > 0) {
      // Check if any string in the range is NOT avoided
      const start = f.string;
      const end = f.endString || f.string;
      const range = [Math.min(start, end), Math.max(start, end)];

      let isVisible = false;
      for (let s = range[0]; s <= range[1]; s++) {
        if (!avoid.includes(s)) {
          isVisible = true;
          break;
        }
      }

      if (isVisible) {
        if (f.fret < min) min = f.fret;
        if (f.fret > max) max = f.fret;
      }
    }
  });

  return [min === Infinity ? 0 : min, max];
};

const applyViewportShift = (
  fingers: StandardPosition[],
  avoid: number[],
  forceDisplay?: number
) => {
  const [minFret, maxFret] = findMinNonZeroNote(fingers, avoid);

  // If fits in first 5 frets, no visual shift needed (unless forced?)
  if (maxFret <= 5) {
    return { finalFingers: fingers, transportDisplay: forceDisplay ?? 0 };
  }

  // Calculate visual shift offset (scrolling down)
  const shiftOffset = minFret > 0 ? minFret - 1 : 0;

  const newFingers = fingers.map(f => ({
    ...f,
    fret: f.fret > 0 ? f.fret - shiftOffset : 0
  }));

  // Actual fret label is the offset + 1
  return { finalFingers: newFingers, transportDisplay: shiftOffset + 1 };
};

const calculateChordLayout = (
  fingers: StandardPosition[],
  capo: number | undefined,
  avoid: number[],
  stringCount: number,
  transport: number | undefined
) => {
  // 1. Determine Musical Shift based on Capo/Transport
  const isPositiveCapo = capo !== undefined && capo > 0;
  const isNegativeCapo = capo !== undefined && capo < 0;
  const isTransposition = transport !== undefined && transport > 0;

  let minNote = Infinity;
  fingers.forEach(f => {
    if (f.fret < minNote) minNote = f.fret;
  });
  if (minNote === Infinity) minNote = 0;

  let musicalShift = 0;

  if (isPositiveCapo) {
    if (minNote <= capo!) {
      musicalShift = 12;
    } else {
      musicalShift = -capo!;
    }
  } else if (isNegativeCapo) {
    musicalShift = Math.abs(capo!);
  } else if (isTransposition) {
    musicalShift = transport!;
  }

  // 2. Apply Musical Shift
  const intermediateFingers = fingers.map(f => {
    const isBarre = f.endString && f.endString !== f.string;
    // Capo/Transport usually shifts everything? 
    // Wait, in converter we had shape-preserving lock for Down Tuning.
    // Here in ChordDiagram, it's usually for static display.
    // I'll keep it simple for now as ChordDiagram usually receives pre-calculated data or does its own layout.
    return {
      ...f,
      fret: f.fret > 0 ? f.fret + musicalShift : 0
    };
  });

  // 3. Apply Viewport Logic
  return applyViewportShift(intermediateFingers, avoid);
};

const ChordDiagram: React.FC<ChordDiagramProps> = (props) => {
  const { fingers, avoid, list } = props;
  const scale = props.scale ?? (list ? 0.3 : 1);
  const stringNames = props.stringNames || ["E", "A", "D", "G", "B", "e"];
  const { colors } = useAppContext();

  // Validação de segurança
  if (!fingers || !Array.isArray(fingers)) {
    return null;
  }

  const { finalFingers, transportDisplay } = list
    ? { finalFingers: fingers, transportDisplay: props.transport ?? 0 }
    : calculateChordLayout(fingers, props.capo, avoid, stringNames.length, props.transport);



  const fingerBoxShadow = `${colors.fingerBoxShadowHOffset}px ${colors.fingerBoxShadowVOffset}px ${colors.fingerBoxShadowBlur}px ${colors.fingerBoxShadowSpread}px ${colors.fingerBoxShadowColor}`;

  // Converte uma cor HEX para RGBA com o alfa fornecido
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const fingerBackgroundColor = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);

  // Calculate dynamic dimensions based on string count
  const stringCount = stringNames.length;
  const stringSpacing = 40; // pixels between strings
  const neckPadding = 20; // padding on each side
  const neckWidth = (stringCount - 1) * stringSpacing + (neckPadding * 2);
  const diagramWidth = neckWidth + 80; // 40px padding on each side
  const diagramHeight = 370;

  // Helper to transpose string name
  const getTransposedStringName = (originalName: string, shift: number) => {
    const isLowerCase = originalName === originalName.toLowerCase();
    const upperName = originalName.toUpperCase();

    let idx = notes.indexOf(upperName);
    // Rough fallback for flats if input has them (e.g. Eb)
    if (idx === -1 && upperName.includes('B')) {
      const base = upperName.replace('B', '');
      const baseIdx = notes.indexOf(base);
      if (baseIdx !== -1) idx = (baseIdx - 1 + 12) % 12;
    }

    if (idx === -1) return originalName;

    let newIdx = (idx + shift) % 12;
    if (newIdx < 0) newIdx += 12;

    const newNote = notes[newIdx];

    // Formatting
    const formatted = formatNoteName(newNote);
    return isLowerCase ? formatted.toLowerCase() : formatted;
  };

  // Calculate Relative Capo Display Position
  const relativeCapo = (props.capo ?? 0) - (transportDisplay - 1); // Approximation if needed, but we use fixed top

  // Extra spacing if Capo is active (to fit the Fixed Capo Bar)
  const hasVisibleCapo = props.capo !== undefined && props.capo > 0;
  const extraTopSpace = hasVisibleCapo ? 35 : 0;

  const finalDiagramHeight = diagramHeight + extraTopSpace;

  return (
    <div className="rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: colors.cardColor, borderRadius: '10px', width: `${diagramWidth * scale}px`, height: `${finalDiagramHeight * scale}px` }}>
      <div className="chord" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <div className="chord-diagram" style={{ width: `${diagramWidth}px`, height: `${finalDiagramHeight}px` }}>
          {transportDisplay > 1 && (
            <div
              className="transpose"
              style={{
                backgroundColor: colors.cardColor,
                color: colors.textColor,
                top: `${80 + extraTopSpace}px`
              }}
            >
              {`${transportDisplay}ª`}
            </div>
          )}
          <div className="chord-name" style={{ color: colors.chordNameColor }}>{getNome(props.chord).replace(/#/g, '♯').replace(/b/g, '♭')}</div>

          <div className="neck" style={{
            backgroundColor: colors.fretboardColor,
            width: `${neckWidth}px`,
            marginTop: `${extraTopSpace}px`,
            position: 'relative'
          }}>
            <div className="nut-line" style={{ backgroundColor: colors.borderColor, height: `${colors.stringThickness}px` }}></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="fret" style={{ top: `${40 + 50 * (i)}px`, backgroundColor: colors.borderColor, height: `${2}px` }}></div>
            ))}
            {/* Base Strings */}
            {stringNames.map((name, i) => {
              const displayCapoNegative = props.capo !== undefined && props.capo < 0;
              const displayName = displayCapoNegative
                ? getTransposedStringName(name, props.capo!)
                : name;

              return (
                <div key={i} className="string" style={{ left: `${40 * i + 10}px`, backgroundColor: colors.borderColor, width: `${colors.stringThickness}px` }}>
                  <div className="string-name" style={{ color: colors.textColor, top: hasVisibleCapo ? '-35px' : undefined }}>{displayName}</div>
                  {avoid && avoid.includes(i + 1) && <div className="avoid" style={{ color: colors.textColor }}>x</div>}
                </div>
              );
            })}

            {finalFingers.map((f, idx) => {
              if (f.fret <= 0) return null;

              const isBarre = f.endString !== undefined && f.endString !== f.string;

              // Map 1-based string numbers to 0-based visual indices
              // (String 1 = rightmost, String 6 = leftmost)
              const idx1 = stringCount - f.string;
              const idx2 = isBarre ? (stringCount - f.endString!) : idx1;

              const minIdx = Math.min(idx1, idx2);
              const maxIdx = Math.max(idx1, idx2);

              const leftPos = 40 * minIdx + 10;
              const barreWidth = isBarre ? (maxIdx - minIdx) * 40 + 34 : 34;

              return (
                <div
                  key={idx}
                  className={`finger ${isBarre ? 'barre' : ''}`}
                  style={{
                    position: 'absolute',
                    top: `${50 * f.fret - 32}px`,
                    left: `${leftPos - 17}px`,
                    width: `${barreWidth}px`,
                    backgroundColor: fingerBackgroundColor,
                    color: colors.fingerTextColor,
                    borderColor: colors.fingerBorderColor,
                    borderWidth: `${colors.fingerBorderWidth}px`,
                    boxShadow: fingerBoxShadow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20
                  }}
                >
                  {f.finger === 0 ? 'T' : f.finger === undefined ? '?' : f.finger === -1 ? 'T' : f.finger === 'T' ? 'T' : f.finger}
                </div>
              );
            })}
            {/* Capo Rendering */}
            {hasVisibleCapo && (
              <div
                className="capo-indicator"
                style={{
                  position: 'absolute',
                  top: `-28px`, // Always fixed at the Nut position
                  left: `${-10}px`,
                  width: `${neckWidth + 20}px`,
                  height: '24px',
                  backgroundColor: '#111',
                  borderRadius: '4px',
                  border: '2px solid #333',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                }}
              >
                CAPO {props.capo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export { ChordDiagram };