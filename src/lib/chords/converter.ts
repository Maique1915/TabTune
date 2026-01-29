
import { MeasureData, GlobalSettings, Duration } from "@/modules/editor/domain/types";
import { ChordWithTiming, ChordDiagramProps, Position, TabEffect, StandardPosition } from "@/modules/core/domain/types";
import { getNoteDurationValue, findBestFretForPitch, getMidiFromPosition, detectChordFromMeasure, getMsFromDuration } from "@/modules/editor/domain/music-math";

/**
 * Converts a list of MeasureData (from Tab Editor) into a flat list of ChordWithTiming (for Fretboard Visualizer).
 * 
 * @param measures The sequence of measures.
 * @param settings Global settings (BPM, Time Signature).
 * @returns Array of chords with absolute timing and duration.
 */
export function measuresToChords(measures: MeasureData[], settings: GlobalSettings): ChordWithTiming[] {
    const result: ChordWithTiming[] = [];
    const bpm = settings.bpm || 120;
    const msPerBeat = 60000 / bpm;
    // Assuming 4/4 as standard for calculation if not handled more complexly.
    // getNoteDurationValue returns 1 for quarter note (1 beat).

    // Iterate through measures and notes to build the sequence
    measures.forEach(measure => {
        let measureNotes = measure.notes;

        // Group notes by "simultaneity" if we had support for real polyphony in the visualizer input.
        // Currently, ChordWithTiming implies a SINGLE chord/event at a time (or arpeggiated).
        // Since TabEditor is monophonic-per-voice or polyphonic-simultaneous, we need to map 
        // the visualizer's "Chord" concept to the Tab's "Column of Notes".

        // However, tab-editor structures data as a list of NoteData. 
        // Notes in `measure.notes` are usually sequential for a single voice.
        // If there are multiple simultaneous notes (chords), they might be represented differently 
        // OR the visualizer needs to handle "chords" constructed from single notes.
        // 
        // LOOKING AT `VisualEditor`: It renders note by note.
        // LOOKING AT `MeasureData`: `notes: NoteData[]`.
        // `NoteData` has `positions: NotePosition[]`. 
        // THIS MEANS: A single `NoteData` object can contain multiple positions (a chord).

        measureNotes.forEach(note => {
            if (note.type === 'rest') {
                // Rests take up time but have no visualization.
                // We could emit a "silent" chord or just skip.
                // For the visualizer playback, preserving time is crucial.
                // FretboardStage computes time based on duration. 
                // If we skip, the next chord starts immediately? 
                // FretboardStage seems to sum durations: `totalMs += ...`.
                // So we SHOULD generate an empty "rest" chord to hold the time.

                const durationValue = getNoteDurationValue(note.duration, !!note.decorators?.dot);
                const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators?.dot, bpm);

                result.push({
                    chord: createEmptyChord(),
                    finalChord: createEmptyChord(),
                    duration: durationMs,
                    transportDisplay: 0,
                    // Mark as rest implicitly by having empty positions?
                });
                return;
            }

            // It is a note (or chord of notes)
            const durationValue = getNoteDurationValue(note.duration, !!note.decorators?.dot);
            const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators?.dot, bpm);

            const fingers: StandardPosition[] = note.positions
                .filter(pos => !pos.avoid)
                .map(pos => ({
                    string: pos.string,
                    endString: pos.endString,
                    fret: pos.fret,
                    finger: pos.finger
                }));

            const avoid: number[] = note.positions
                .filter(pos => pos.avoid)
                .map(pos => pos.string);

            // Map Techniques to Effects
            const effects: TabEffect[] = [];
            if (note.technique) {
                if (note.technique.includes('s')) effects.push({ type: 'slide', string: fingers[0]?.string || 1 });
                if (note.technique.includes('b')) effects.push({ type: 'bend', string: fingers[0]?.string || 1 });
                if (note.technique.includes('h')) effects.push({ type: 'hammer', string: fingers[0]?.string || 1 });
                if (note.technique.includes('p')) effects.push({ type: 'pull', string: fingers[0]?.string || 1 });
                if (note.technique.includes('v')) effects.push({ type: 'vibrato', string: fingers[0]?.string || 1 });
                if (note.technique.includes('t')) effects.push({ type: 'tap', string: fingers[0]?.string || 1 });
            }

            const chordData: ChordDiagramProps = {
                chord: { note: 0, complement: 0, extension: [], bass: 0 },
                origin: 0,
                fingers: fingers,
                avoid: avoid,
                stringNames: settings.tuning,
                extends: {
                    duration: note.duration,
                    type: note.type,
                    decorators: note.decorators,
                    accidental: note.accidental,
                    technique: note.technique,
                    manualChord: note.manualChord,
                    measureId: measure.id,
                    noteId: note.id
                }
            };

            let chordName = '';
            if (measure.chordName) chordName = measure.chordName;
            if (chordName) chordData.chordName = chordName;
            if (measure.showChordName !== undefined) {
                chordData.showChordName = measure.showChordName;
            }

            // Apply musical shift (Capo/Tuning Shift)
            // Apply musical shift (Capo/Tuning Shift)
            // REMOVIDO: O usuário quer que o "Visual Shift" (Capo) NÃO mude a posição dos dedos.
            // A posição dos dedos (fret) deve permanecer absoluta em relação ao braço/capo conforme definido no editor.
            // O ChordDrawerBase agora lida visualmente com a exibição do Capo sem mover os pontos.
            // A transposição de altura de som (pitch) deve ser lidada pelo AudioEngine separadamente, se necessário.
            const shiftedFingers = fingers; // Mantém os dedos originais

            // Deep clone to prevent reference sharing
            const clonedFingers = shiftedFingers.map(f => ({ ...f }));
            const clonedAvoid = [...avoid];
            const clonedExtends = chordData.extends ? { ...chordData.extends } : undefined;

            result.push({
                chord: {
                    ...chordData,
                    fingers: fingers.map(f => ({ ...f })),
                    avoid: [...avoid],
                    extends: clonedExtends
                },
                finalChord: {
                    ...chordData,
                    fingers: clonedFingers,
                    avoid: clonedAvoid,
                    extends: clonedExtends ? { ...clonedExtends } : undefined
                },
                duration: durationMs,
                transportDisplay: 0,
                strumming: undefined,
                effects: effects.length > 0 ? effects.map(e => ({ ...e })) : undefined
            });
        });
    });

    // Post-processing: Link effects to target notes
    for (let i = 0; i < result.length; i++) {
        const currentChord = result[i];
        if (!currentChord.effects) continue;

        currentChord.effects.forEach(effect => {
            if (['slide', 'hammer', 'pull', 'bend'].includes(effect.type)) {
                // Find next note on the same string
                for (let j = i + 1; j < result.length; j++) {
                    const nextChord = result[j];
                    // Search in fingers array
                    const nextFinger = nextChord.chord.fingers.find(f => f.string === effect.string || (f.endString && effect.string >= Math.min(f.string, f.endString) && effect.string <= Math.max(f.string, f.endString)));
                    if (nextFinger) {
                        effect.toFret = nextFinger.fret;
                        break; // Found target
                    }
                }
            }
        });
    }

    // Debug: Log to verify no reference sharing
    if (result.length > 0) {
        console.log('[measuresToChords] Generated', result.length, 'chords');
        result.forEach((chord, idx) => {
            const fingersStr = chord.finalChord.fingers.map(f => `${f.string}:${f.fret}`).join(',');
            console.log(`  [${idx}] ${chord.finalChord.chordName || 'unnamed'} - fingers: ${fingersStr}`);
        });
    }

    return result;
}

function createEmptyChord(): ChordDiagramProps {
    // Always return fresh objects to prevent reference sharing
    return {
        chord: { note: 0, complement: 0, extension: [], bass: 0 },
        origin: 0,
        fingers: [],
        avoid: [],
        list: false
    };
}
