"use client"

import React from 'react';
import type { ChordDiagramProps, Position, nutForm } from '@/lib/types';
import { getNome } from '@/lib/chords';
import "@/styles/ChordDiagram.css";

const ChordDiagram: React.FC<ChordDiagramProps> = (props) => {
  const { positions, nut, barre, avoid, list } = props;
  const scale = props.scale ?? (list ? 0.3 : 1);
  const stringNames = ["E", "A", "D", "G", "B", "e"];

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

    if (maxFret <= 5 && (!nut || !nut.vis || nut.pos <= 5)) {
      return { finalPositions: positions, finalNut: nut, transportDisplay: props.transport ?? 0 };
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

  return (
    <div className="chord">
      <div className="chord-diagram" style={{ transform: `scale(${scale})` }}>
        {transportDisplay > 0 && <div className="transpose">{`${transportDisplay}ª`}</div>}
        <div className="chord-name">{getNome(props.chord)}</div>
        <div className="neck">
          <div className="nut-line"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="fret" style={{ top: `${40 + 50 * (i)}px` }}></div>
          ))}
          {stringNames.map((name, i) => (
            <div key={i} className="string" style={{ left: `${40 * i + 10}px` }}>
              <div className="string-name">{name}</div>
              {finalNut && finalNut.vis && finalNut.str && finalNut.str[0] === i + 1 && (
                <div className="finger barre" style={{ top: `${50 * finalNut.pos - 42}px`, width:`${34 + 40 * (finalNut.str[1] - finalNut.str[0])}px`}}>
                 {finalNut.fin}
                </div>
              )}
              {finalPositions[i + 1] && finalPositions[i + 1][0] > 0 && (!finalNut || !finalNut.vis || finalPositions[i+1][1] !== finalNut.fin) &&(
                <div className="finger" style={{ top: `${50 * finalPositions[i + 1][0] - 42}px` }}>
                  {finalPositions[i + 1][1]}
                </div>
              )}
              {avoid && avoid.includes(i + 1) && <div className="avoid">x</div>}
            </div>
          ))}
          {barre && (
            <div
              className="barre"
              style={{
                top: `${60 * barre[0] - 20}px`,
                left: `${44 * (barre[1] - 1) + 40}px`,
                width: `${44 * (barre[1] - 1)}px`
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChordDiagram;
