
import { MeasureData, GlobalSettings, Duration } from "@/modules/editor/domain/types";
import { ChordWithTiming, ChordDiagramProps, Position, TabEffect } from "@/modules/core/domain/types";
import { getNoteDurationValue, findBestFretForPitch, getMidiFromPosition, detectChordFromMeasure } from "@/modules/editor/domain/music-math";

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
                const durationMs = durationValue * msPerBeat;

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
            const durationMs = durationValue * msPerBeat;

            const positions: Position = {};
            note.positions.forEach((pos, idx) => {
                const stringNum = pos.string;
                const fretNum = pos.fret;
                // Position key is usually the fret or string?
                // Checking `types.ts`: `key: number // Chave da posição` -> `[finger, string, fret]`.
                // In `ChordDrawerBase`, it iterates keys? No, it often uses string as key idx or just mapped.
                // Re-checking `Position` type: `{[key: number]: [finger, string, fret]}`.
                // Usually `key` represents the STRING index (1-6) for easy lookup?
                // Let's assume Key = String Number (1-6).
                if (stringNum && fretNum) {
                    // Finger 0 for now (unknown)
                    positions[stringNum] = [0, stringNum, fretNum];
                }
            });

            // Map Techniques to Effects
            const effects: TabEffect[] = [];
            if (note.technique) {
                if (note.technique.includes('s')) effects.push({ type: 'slide', string: note.positions[0]?.string || 1 });
                if (note.technique.includes('b')) effects.push({ type: 'bend', string: note.positions[0]?.string || 1 });
                if (note.technique.includes('h')) effects.push({ type: 'hammer', string: note.positions[0]?.string || 1 });
                if (note.technique.includes('p')) effects.push({ type: 'pull', string: note.positions[0]?.string || 1 });
                if (note.technique.includes('v')) effects.push({ type: 'vibrato', string: note.positions[0]?.string || 1 });
                if (note.technique.includes('t')) effects.push({ type: 'tap', string: note.positions[0]?.string || 1 });
            }

            const chordData: ChordDiagramProps = {
                chord: { note: 0, complement: 0, extension: [], bass: 0 }, // Dummy generic info
                origin: 0,
                positions: positions,
                avoid: [], // Calculate avoided strings? (Those not in positions)
                nut: note.barre ? {
                    vis: true,
                    str: [note.barre.startString, note.barre.endString],
                    pos: note.barre.fret,
                    fin: 1, // Index finger usually
                    trn: 0
                } : undefined,
                stringNames: settings.tuning
            };

            // Determine Chord Name from MEASURE (not from individual notes)
            // This makes the chord name display throughout the entire measure
            let chordName = '';

            // Priority: Measure-level chord name
            if (measure.chordName) {
                chordName = measure.chordName;
            }

            if (chordName) {
                chordData.chordName = chordName;
            }

            if (measure.showChordName !== undefined) {
                chordData.showChordName = measure.showChordName;
            }

            result.push({
                chord: chordData,
                finalChord: chordData, // No transposition logic applied here yet
                duration: durationMs,
                transportDisplay: 0,
                strumming: undefined, // Could infer from direction arrows if added later
                effects: effects.length > 0 ? effects : undefined
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
                    // Check if nextChord has a position on this string
                    // positions is { stringKey: [finger, string, fret] }
                    // key is number (string index)
                    const nextPos = nextChord.chord.positions[effect.string];
                    if (nextPos) {
                        effect.toFret = nextPos[2]; // fret is index 2 of [finger, string, fret]
                        break; // Found target
                    }
                }
            }
        });
    }

    return result;
}

function createEmptyChord(): ChordDiagramProps {
    return {
        chord: { note: 0, complement: 0, extension: [], bass: 0 },
        origin: 0,
        positions: {},
        avoid: [],
        list: false
    };
}
