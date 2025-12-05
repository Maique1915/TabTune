
"use client";

import type { Chord } from "@/lib/chords";
import { useAppContext } from "@/app/context/app--context";

type ChordDiagramProps = {
    chord: Chord;
    scale?: number;
}

export function ChordDiagram({ chord, scale = 1 }: ChordDiagramProps) {
    const { colors } = useAppContext();
    const cardWidth = 260 * scale;
    const cardHeight = 360 * scale;
    const fretboardWidth = cardWidth - (40 * scale);
    const fretboardHeight = cardHeight - (120 * scale);
    const strings = 6;
    const frets = 5;
    const stringSpacing = fretboardWidth / (strings - 1);
    const fretSpacing = (fretboardHeight - (60 * scale)) / (frets - 1);
  
    return (
      <div
        className="rounded-2xl shadow-lg flex flex-col items-center gap-5 p-4 pt-8"
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: colors.cardColor,
          border: `2px solid ${colors.borderColor}`,
        }}
      >
        <h2
          className="font-bold font-headline"
          style={{ 
            color: colors.textColor, 
            transform: `translateY(-${10 * scale}px)`,
            fontSize: `${32 * scale}px`
        }}
        >
          {chord.name}
        </h2>
        <div
          className="relative rounded-xl"
          style={{
            width: fretboardWidth,
            height: fretboardHeight,
            backgroundColor: colors.fretboardColor,
            border: "2px solid #222F3D",
          }}
        >
          {/* Nut */}
          <div
            className="absolute top-0 left-0 w-full"
            style={{ height: 10 * scale, backgroundColor: "#1E1E1E" }}
          />
  
          {/* String Labels */}
          <div className="absolute left-0 w-full flex justify-around px-1" style={{ top: `${3.5 * scale}px`}}>
            {["E", "A", "D", "G", "B", "e"].map((note) => (
              <span key={note} className="text-muted-foreground font-bold" style={{fontSize: `${14 * scale}px`}}>
                {note}
              </span>
            ))}
          </div>
  
          {/* Strings and Frets */}
          <div className="absolute left-0 w-full" style={{top: `${40 * scale}px`, height: `calc(100% - ${40*scale}px)`}}>
            <svg width="100%" height="100%" overflow="visible">
              {/* Strings */}
              {Array.from({ length: strings }).map((_, i) => (
                <line
                  key={`string-${i}`}
                  x1={i * stringSpacing}
                  y1={0}
                  x2={i * stringSpacing}
                  y2={fretboardHeight - (40*scale)}
                  stroke="#555"
                  strokeWidth="2"
                />
              ))}
              {/* Frets */}
              {Array.from({ length: frets }).map((_, i) => (
                <line
                  key={`fret-${i}`}
                  x1={0}
                  y1={(20 * scale) + i * fretSpacing}
                  x2={fretboardWidth}
                  y2={(20 * scale) + i * fretSpacing}
                  stroke="#777"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
  
          {/* Fingerings */}
          <div className="absolute left-0 w-full" style={{top: `${60 * scale}px`, height: `calc(100% - ${60 * scale}px)`}}>
            {chord.fingerings.map(({ stringIndex, fretIndex, finger }, i) => {
              const x = stringIndex * stringSpacing;
              const y = (fretIndex - 0.5) * fretSpacing;
              return (
                <div
                  key={`${finger}-${i}`}
                  className="absolute rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: x,
                    top: y,
                    width: 32 * scale,
                    height: 32 * scale,
                    backgroundColor: colors.fingerColor,
                    border: `${3 * scale}px solid white`,
                  }}
                >
                    {finger && <span className="text-white font-bold" style={{fontSize: `${18 * scale}px`}}>{finger}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
