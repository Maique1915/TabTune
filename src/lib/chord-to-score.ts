import { ChordDiagramProps } from "@/lib/types";
import { ScoreNote } from "@/lib/timeline/types";

// Tuning (E2 A2 D3 G3 B3 E4)
const TUNING = [40, 45, 50, 55, 59, 64];
const STRINGS = 6;

// Helper to convert MIDI pitch to VexFlow key
export function pitchToKey(pitch: number): string {
    const notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const octave = Math.floor(pitch / 12) - 1;
    const noteIndex = pitch % 12;
    const noteName = notes[noteIndex];
    return `${noteName}/${octave}`;
}

export function getNoteFromFret(fret: number, stringVal: number): string {
    // stringVal: 1 (High E) to 6 (Low E)
    // TUNING: 0 (Low E) to 5 (High E)
    const stringIndex = 6 - stringVal;
    if (stringIndex < 0 || stringIndex >= 6) return "c/4"; // Fallback

    const basePitch = TUNING[stringIndex];
    const pitch = basePitch + fret;
    return pitchToKey(pitch);
}

export function chordToScoreNotes(chordData: ChordDiagramProps): ScoreNote[] {
    const notes: ScoreNote[] = [];
    const positions: { str: number; fret: number }[] = [];
    const keys: string[] = [];

    // Parse positions from 'positions' object or 'frets' (usually positions is what holds exact finger placement)
    // ChordDiagramProps has `positions: Position` which is a record of number -> [finger, string, fret]
    // Note: string in Position is usually 1-indexed (1=High E in some contexts, or Low E? Need to verify convention)
    // In `chords.ts` or similar, usually string 1 is High E, 6 is Low E, OR 1 is Low E. 
    // Let's assume standard VexFlow Tab convention: 1 = Top line = High E usually? 
    // VexFlow TabStave: String 1 is top line (High E).

    // Let's inspect `positions` structure more closely from `types.ts`:
    // key: number -> [finger, string, fret]
    // We need to iterate values.

    if (chordData.positions) {
        Object.values(chordData.positions).forEach((pos: number[]) => {
            const finger = pos[0];
            const string = pos[1]; // 1-6
            const fret = pos[2];

            if (fret >= 0) {
                // Convert to Tab Position
                // VexFlow expects string 1 to be high E.
                // If our data matches that, great.
                // If our data assumes 1 is Low E, we flip.
                // Based on generic guitar libs, often 1=High E.
                // Let's assume 1-based index.

                positions.push({ str: string, fret: fret });

                // Calculate Pitch
                // String 1 (High E, E4=64)
                // String 6 (Low E, E2=40)
                // We need to map string index to tuning.
                // If str 1 is High E: TUNING[5] (64)
                // If str 6 is Low E: TUNING[0] (40)

                // Let's check typical usage. If `string` comes from 1..6
                // Usually in this project (based on `chord-logic.ts` presumably), we should match.
                // I will assume 1=High E, 6=Low E for VexFlow compatibility.
                // Tuning array is Low to High (0..5 => E2..E4).
                // So string 6 => index 0. String 1 => index 5.

                const stringIndex = 6 - string; // 6->0, 1->5
                if (stringIndex >= 0 && stringIndex < 6) {
                    const basePitch = TUNING[stringIndex];
                    const pitch = basePitch + fret;
                    keys.push(pitchToKey(pitch));
                }
            }
        });
    }

    // Handle Nut/Barre if separate? 
    // `positions` usually lists all held notes. Open strings might be in `avoid` or just not listed?
    // Actually, usually `positions` only lists fretted notes.
    // We also need open strings if they are played.
    // If `positions` is comprehensive, good. If not, we might miss open strings.
    // `avoid` lists muted strings.

    // For a robust implementation we'd check all 6 strings.
    // But `chordToScoreNotes` just needs to return what's in `positions` for now.

    if (keys.length > 0) {
        // VexFlow requires keys to be sorted? Usually low to high for chords.
        // We can sort keys just in case.
        // But VexFlow might handle it.

        return [{
            keys: keys,
            duration: "w", // Default to Whole note
            positions: positions
        }];
    }

    return [];
}
