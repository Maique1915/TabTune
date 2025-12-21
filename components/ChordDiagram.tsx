
import React from 'react';
import { Chord, ChordPosition } from '../types';
import { STRINGS } from '../constants';

interface ChordDiagramProps {
  chord: Chord;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, size = 'sm', showLabels = true }) => {
  const isSmall = size === 'sm';
  const width = isSmall ? 80 : 200;
  const height = isSmall ? 100 : 250;
  const margin = isSmall ? 10 : 25;
  const fretCount = 5;
  const stringCount = 6;

  const innerWidth = width - 2 * margin;
  const innerHeight = height - 2 * margin;
  const stringSpacing = innerWidth / (stringCount - 1);
  const fretSpacing = innerHeight / fretCount;

  return (
    <div className={`flex flex-col items-center ${isSmall ? 'p-1' : 'p-4'}`}>
      {showLabels && (
        <span className={`${isSmall ? 'text-[10px]' : 'text-xl font-bold mb-2'} text-gray-300`}>
          {chord.name}
        </span>
      )}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Frets */}
        {Array.from({ length: fretCount + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={margin}
            y1={margin + i * fretSpacing}
            x2={width - margin}
            y2={margin + i * fretSpacing}
            stroke={i === 0 ? "#cbd5e1" : "#475569"}
            strokeWidth={i === 0 ? (isSmall ? 2 : 4) : 1}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: stringCount }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={margin + i * stringSpacing}
            y1={margin}
            x2={margin + i * stringSpacing}
            y2={height - margin}
            stroke="#475569"
            strokeWidth={1}
          />
        ))}

        {/* String Labels */}
        {!isSmall && showLabels && (
          STRINGS.map((label, i) => (
            <text
              key={`label-${i}`}
              x={margin + i * stringSpacing}
              y={margin - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#ef4444"
              className="font-bold"
            >
              {label}
            </text>
          ))
        )}

        {/* Fingers/Positions */}
        {chord.positions.map((pos, idx) => {
          if (pos.fret === 0) return null;
          
          const x = margin + (pos.string - 1) * stringSpacing;
          const y = margin + (pos.fret - 0.5) * fretSpacing;
          const radius = isSmall ? 4 : 12;

          return (
            <g key={`pos-${idx}`}>
              <circle cx={x} cy={y} r={radius} fill="white" />
              {pos.finger && !isSmall && (
                <text
                  x={x}
                  y={y}
                  dy=".3em"
                  textAnchor="middle"
                  fontSize="12"
                  fill="black"
                  className="font-bold pointer-events-none"
                >
                  {pos.finger}
                </text>
              )}
            </g>
          );
        })}

        {/* Open/Muted indicators */}
        {chord.positions.map((pos, idx) => {
          if (pos.fret !== 0) return null;
          const x = margin + (pos.string - 1) * stringSpacing;
          const y = margin - 4;
          return (
            <circle key={`open-${idx}`} cx={x} cy={y} r={isSmall ? 1.5 : 3} fill="none" stroke="#475569" strokeWidth="1" />
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
