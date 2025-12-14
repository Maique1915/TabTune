"use client"

import React from 'react';
import type { ChordDiagramProps, Position, nutForm } from '@/lib/types';
import { getNome } from '@/lib/chords';
import { useAppContext } from '@/app/context/app--context';
import '@/app/chord-diagram.css';

const ChordDiagram: React.FC<ChordDiagramProps> = (props) => {
  const { positions, nut, barre, avoid, list } = props;
  const scale = props.scale ?? (list ? 0.3 : 1);
  const stringNames = ["E", "A", "D", "G", "B", "e"];
  const { colors } = useAppContext();

  // Validação de segurança
  if (!positions || typeof positions !== 'object') {
    return null;
  }

  const findMinNonZeroNote = (positions: Position, avoid: number[], nut?: nutForm): [number, number] => {
    let min = Infinity;
    let max = 0;

    if (nut && nut.vis) {
      min = nut.pos;
    }

    Object.entries(positions).forEach(([str, [fret]]) => {
      const stringNumber = parseInt(str);
      if (fret > 0 && !avoid.includes(stringNumber)) {
        if (fret < min) {
          min = fret;
        }
        if (fret > max) {
          max = fret;
        }
      }
    });

    return [min === Infinity ? 0 : min, max];
  };

  const transposeForDisplay = () => {
    const [minFret, maxFret] = findMinNonZeroNote(positions, avoid, nut);

        if (maxFret <= 5 && (!nut || !nut.vis || nut.pos <= 5)) {       return { finalPositions: positions, finalNut: nut, transportDisplay: props.transport ?? 0 };
    }
    
    const transposition = (nut && nut.vis) ? nut.pos -1 : minFret > 0 ? minFret -1 : 0
    
    const newPositions: Position = {};
    for (const string in positions) {
      const [fret, finger, add] = positions[string];
      newPositions[string] = [fret > 0 ? fret - transposition : 0, finger, add];
    }
    
    const newNut = nut && nut.vis ? { ...nut, pos: nut.pos - transposition } : nut;

    return { finalPositions: newPositions, finalNut: newNut, transportDisplay: transposition + 1 };
  };

  const { finalPositions, finalNut, transportDisplay } = list ? { finalPositions: positions, finalNut: nut, transportDisplay: props.transport ?? 0} : transposeForDisplay();

  const fingerBoxShadow = `${colors.fingerBoxShadowHOffset}px ${colors.fingerBoxShadowVOffset}px ${colors.fingerBoxShadowBlur}px ${colors.fingerBoxShadowSpread}px ${colors.fingerBoxShadowColor}`;

  // Converte uma cor HEX para RGBA com o alfa fornecido
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const fingerBackgroundColor = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);

  return (
    <div className="rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: colors.cardColor, borderRadius: '10px', width: `${350 * scale}px`, height: `${370 * scale}px` }}>
        <div className="chord" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <div className="chord-diagram">
        {transportDisplay > 0 && <div className="transpose" style={{backgroundColor: colors.cardColor, color: colors.textColor}}>{`${transportDisplay}ª`}</div>}
        <div className="chord-name" style={{ color: colors.chordNameColor }}>{getNome(props.chord).replace(/#/g, '♯').replace(/b/g, '♭')}</div>
        <div className="neck" style={{ backgroundColor: colors.fretboardColor}}>
          <div className="nut-line" style={{ backgroundColor: colors.borderColor, height: `${colors.stringThickness}px` }}></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="fret" style={{ top: `${40 + 50 * (i)}px`, backgroundColor: colors.borderColor, height: `${2}px` }}></div>
          ))}
          {stringNames.map((name, i) => (
            <div key={i} className="string" style={{ left: `${40 * i + 10}px`, backgroundColor: colors.borderColor, width: `${colors.stringThickness}px` }}>
              <div className="string-name" style={{ color: colors.textColor }}>{name}</div>
              {finalNut && finalNut.vis && finalNut.str && finalNut.str[0] === i + 1 && (
                <div className="finger barre" style={{ top: `${50 * finalNut.pos - 42}px`, width:`${34 + 40 * (finalNut.str[1] - finalNut.str[0])}px`, backgroundColor: fingerBackgroundColor, color: colors.fingerTextColor, borderColor: colors.fingerBorderColor, borderWidth: `${colors.fingerBorderWidth}px`, boxShadow: fingerBoxShadow }}>
                 {finalNut.fin}
                </div>
              )}
              {finalPositions[i + 1] && finalPositions[i + 1][0] > 0 && (!finalNut || !finalNut.vis || finalPositions[i+1][1] !== finalNut.fin) &&(
                <div className="finger" style={{ top: `${50 * finalPositions[i + 1][0] - 42}px`, backgroundColor: fingerBackgroundColor, color: colors.fingerTextColor, borderColor: colors.fingerBorderColor, borderWidth: `${colors.fingerBorderWidth}px`, boxShadow: fingerBoxShadow }}>
                  {finalPositions[i + 1][1]}
                </div>
              )}
              {avoid && avoid.includes(i + 1) && <div className="avoid" style={{ color: colors.textColor }}>x</div>}
            </div>
          ))}
          {barre && (
            <div
              className="barre"
              style={{
                top: `${60 * barre[0] - 20}px`,
                left: `${44 * (barre[1] - 1) + 40}px`,
                width: `${44 * (barre[1] - 1)}px`,
                backgroundColor: fingerBackgroundColor,
                borderColor: colors.fingerBorderColor,
                borderWidth: `${colors.fingerBorderWidth}px`,
                boxShadow: fingerBoxShadow,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export {ChordDiagram};