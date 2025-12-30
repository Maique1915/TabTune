
import React, { useRef, useEffect, useMemo } from 'react';
import { ScoreData, NoteData } from '../types';
import * as Vex from 'vexflow';

interface NotationViewProps {
  score: ScoreData;
  currentTime: number;
  onSeek: (ticks: number) => void;
}

const NotationView: React.FC<NotationViewProps> = ({ score, currentTime, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const config = useMemo(() => ({
    measureBaseWidth: 380,
    paddingLeft: 100,
    topMargin: 50,
    staveSeparation: 130,
  }), []);

  const midiToVex = (pitch: number): string => {
    const names = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const name = names[pitch % 12];
    const octave = Math.floor(pitch / 12) - 1;
    return `${name}/${octave}`;
  };

  const ticksToVexDuration = (ticks: number, divisions: number, isRest: boolean): string => {
    // Robust duration mapping
    let dur = 'q';
    if (ticks >= divisions * 3.5) dur = 'w';
    else if (ticks >= divisions * 1.7) dur = 'h';
    else if (ticks >= divisions * 0.8) dur = 'q';
    else if (ticks >= divisions * 0.4) dur = '8';
    else if (ticks >= divisions * 0.2) dur = '16';
    else dur = '32';
    return isRest ? dur + 'r' : dur;
  };

  useEffect(() => {
    if (!outputRef.current || !score) return;

    outputRef.current.innerHTML = '';
    
    try {
      const { 
        Renderer, Stave, StaveNote, Voice, Formatter, 
        Beam, Accidental, Articulation, StaveConnector, Dot,
        Tuplet, Curve, Modifier
      } = Vex.Flow;
      
      const ticksPerMeasure = (score.timeSignature.num * 4 * score.divisions) / score.timeSignature.den;
      const measuresCount = Math.ceil(score.totalTicks / ticksPerMeasure) || 1;
      const totalWidth = (measuresCount * config.measureBaseWidth) + config.paddingLeft + 200;

      const renderer = new Renderer(outputRef.current, Renderer.Backends.SVG);
      renderer.resize(totalWidth, 500);
      const context = renderer.getContext();

      // Cross-measure slur tracking
      const pendingSlurs = new Map<number, Vex.Flow.StaveNote>();

      for (let m = 0; m < measuresCount; m++) {
        const measureStart = m * ticksPerMeasure;
        const measureEnd = (m + 1) * ticksPerMeasure;
        const xPos = (m * config.measureBaseWidth) + config.paddingLeft;

        const trebleStave = new Stave(xPos, config.topMargin, config.measureBaseWidth);
        const bassStave = new Stave(xPos, config.topMargin + config.staveSeparation, config.measureBaseWidth);

        if (m === 0) {
          trebleStave.addClef('treble').addTimeSignature(`${score.timeSignature.num}/${score.timeSignature.den}`);
          bassStave.addClef('bass').addTimeSignature(`${score.timeSignature.num}/${score.timeSignature.den}`);
          new StaveConnector(trebleStave, bassStave).setType(StaveConnector.type.BRACE).setContext(context).draw();
          new StaveConnector(trebleStave, bassStave).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();
        }

        trebleStave.setContext(context).draw();
        bassStave.setContext(context).draw();

        const processStaffNotes = (isTreble: boolean) => {
          const minP = isTreble ? 60 : 0;
          const maxP = isTreble ? 127 : 59;
          const currentStave = isTreble ? trebleStave : bassStave;
          const clef = isTreble ? 'treble' : 'bass';

          const measureNotes = score.notes.filter(n => 
            n.startTime >= measureStart && n.startTime < measureEnd &&
            (n.type === 'rest' || (n.pitch >= minP && n.pitch <= maxP))
          );

          if (measureNotes.length === 0) {
            // Whole rest for empty measure
            const wr = new StaveNote({ clef, keys: [isTreble ? 'b/4' : 'd/3'], duration: 'wr' });
            const voice = new Voice({ num_beats: score.timeSignature.num, beat_value: score.timeSignature.den }).setStrict(false);
            voice.addTickables([wr]);
            new Formatter().joinVoices([voice]).format([voice], config.measureBaseWidth - 50);
            voice.draw(context, currentStave);
            return;
          }

          // Group by start time
          const groups = new Map<number, NoteData[]>();
          measureNotes.forEach(n => {
            const list = groups.get(n.startTime) || [];
            list.push(n);
            groups.set(n.startTime, list);
          });

          const sortedStarts = Array.from(groups.keys()).sort((a, b) => a - b);
          const staveNotes: Vex.Flow.StaveNote[] = [];
          const tupletMap = new Map<string, Vex.Flow.StaveNote[]>();

          sortedStarts.forEach(start => {
            const chord = groups.get(start)!;
            const actualNotes = chord.filter(i => i.type === 'note');
            const isRest = actualNotes.length === 0;
            const items = isRest ? chord : actualNotes;
            
            const maxDur = Math.max(...items.map(i => i.duration));
            const vexDur = ticksToVexDuration(maxDur, score.divisions, isRest);
            const keys = isRest ? [isTreble ? 'b/4' : 'd/3'] : items.map(i => midiToVex(i.pitch));

            const sn = new StaveNote({ clef, keys, duration: vexDur });

            // Dots
            if (items.some(i => i.isDotted)) sn.addModifier(new Dot(), 0);

            // Articulations & Modifiers
            items.forEach((item, idx) => {
              // Accidentals
              if (item.accidental) sn.addModifier(new Accidental(item.accidental), idx);
              
              // Articulations - Map MuseScore subtypes to VexFlow
              item.articulations?.forEach(art => {
                let type: any;
                if (art.includes('staccato')) type = Articulation.type.STACCATO;
                else if (art.includes('accent')) type = Articulation.type.ACCENT;
                else if (art.includes('marcato')) type = Articulation.type.MARCATO;
                else if (art.includes('tenuto')) type = Articulation.type.TENUTO;
                else if (art.includes('staccatissimo')) type = Articulation.type.STACCATISSIMO;
                else if (art.includes('sforzato')) type = Articulation.type.ACCENT; // Approx
                
                if (type) {
                    const articulation = new Articulation(type);
                    // Standard position for articulations
                    articulation.setPosition(Modifier.Position.ABOVE);
                    sn.addModifier(articulation, idx);
                }
              });

              // Slur handling
              item.slurIds?.forEach(slur => {
                if (slur.type === 'start') {
                    pendingSlurs.set(slur.id, sn);
                } else if (slur.type === 'stop') {
                    const startNote = pendingSlurs.get(slur.id);
                    if (startNote) {
                        // Draw immediately in same context
                        new Curve(startNote, sn).setContext(context).draw();
                        pendingSlurs.delete(slur.id);
                    }
                }
              });
            });

            // Tuplets
            const tid = items[0].tupletId;
            if (tid) {
                const group = tupletMap.get(tid) || [];
                group.push(sn);
                tupletMap.set(tid, group);
            }

            staveNotes.push(sn);
          });

          const voice = new Voice({ num_beats: score.timeSignature.num, beat_value: score.timeSignature.den }).setStrict(false);
          voice.addTickables(staveNotes);
          new Formatter().joinVoices([voice]).format([voice], config.measureBaseWidth - 60);
          voice.draw(context, currentStave);

          // Tuplet drawing
          tupletMap.forEach(notes => {
              if (notes.length > 1) {
                  new Tuplet(notes).setContext(context).draw();
              }
          });

          // Beams
          const beams = Beam.generateBeams(staveNotes);
          beams.forEach(b => b.setContext(context).draw());
        };

        processStaffNotes(true);
        processStaffNotes(false);
      }
    } catch (err) {
      console.error("VexFlow Core Error:", err);
    }
  }, [score, config]);

  const playheadX = score ? (currentTime / ((score.timeSignature.num * 4 * score.divisions) / score.timeSignature.den)) * config.measureBaseWidth + config.paddingLeft : 0;

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-4 left-6 z-30 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-blue-400 relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 leading-none mb-1">Engraving Active</span>
            <span className="text-sm font-bold leading-tight">{score?.title}</span>
          </div>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="text-xs font-mono opacity-60">
            {score?.timeSignature.num}/{score?.timeSignature.den}
          </div>
        </div>
      </div>

      {/* Main Score Area */}
      <div 
        ref={containerRef} 
        className="flex-grow overflow-x-auto overflow-y-hidden relative bg-white select-none scroll-smooth"
        onClick={(e) => {
          if (!containerRef.current || !score) return;
          const rect = containerRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left + containerRef.current.scrollLeft - config.paddingLeft;
          const ticksPerMeasure = (score.timeSignature.num * 4 * score.divisions) / score.timeSignature.den;
          onSeek(Math.max(0, (clickX / config.measureBaseWidth) * ticksPerMeasure));
        }}
      >
        <div id="vexflow-output" ref={outputRef} className="relative min-h-[500px] flex items-center" />
        
        {/* Playhead */}
        <div 
          className="absolute top-0 w-1 h-full bg-blue-600/20 z-20 pointer-events-none transition-all duration-100 ease-linear"
          style={{ left: playheadX }}
        >
          <div className="absolute top-[50px] -left-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-xl" />
          <div className="absolute top-[180px] -left-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-xl" />
        </div>
      </div>

      {/* Footer Features Indicator */}
      <div className="h-12 bg-slate-50 flex items-center justify-between px-10 border-t border-slate-200">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Slurs</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Articulations</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tuplets</span>
            </div>
        </div>
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
            MuseViz Engine v4.2.2 High-Fidelity
        </div>
      </div>
    </div>
  );
};

export default NotationView;
