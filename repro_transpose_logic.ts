
// Mock Types
interface Position {
    string: number;
    fret: number;
    finger?: number | string;
    endString?: number;
    avoid?: boolean;
}

interface BarreData {
    fret: number;
    startString: number;
    endString: number;
    finger?: number | string;
}

interface NoteData {
    id: string;
    positions: Position[];
    barre?: BarreData;
    chordName?: string;
}

interface MeasureData {
    notes: NoteData[];
    chordName?: string;
}

// Mock Utility functions
const transposeChordName = (name: string, semitones: number) => `${name} (Tr ${semitones})`; // Mock

// REPRODUCTION LOGIC (Copied from use-studio-chords-editor.ts)
// We only need the map logic for the notes.

function transposeMeasure(measure: MeasureData, semitones: number, smartTranspose: boolean, isSelectiveMode: boolean): MeasureData {

    // NOTE: This logic is adapted from handleTransposeMeasure

    // Analysis for Smart Transpose (Before Transposition)
    let isStartingOpen = false;
    const targetNotes = measure.notes; // Assume we target all for this test

    if (smartTranspose) {
        const allFrets = targetNotes.flatMap(n => n.positions.filter(p => !p.avoid).map(p => p.fret));
        if (allFrets.length > 0) {
            const minFret = Math.min(...allFrets);
            isStartingOpen = minFret === 0;
        }
    }

    const transposedNotes = measure.notes.map((note: NoteData) => {
        // Assume targetIds.includes(note.id) is true

        let newPositions = note.positions.map((pos) => {
            if (pos.avoid) return pos;
            return {
                ...pos,
                fret: pos.fret + semitones
            };
        });

        // Smart Transpose Logic (After Transposition Calculation)
        if (smartTranspose) {
            const allNewFrets = newPositions.filter(p => !p.avoid).map(p => p.fret);
            if (allNewFrets.length > 0) {
                const newMinFret = Math.min(...allNewFrets);
                const isEndingOpen = newMinFret === 0;

                // Case 1: Open -> Barre (Shift Fingers Up)
                if (isStartingOpen && !isEndingOpen) {
                    newPositions = newPositions.map(p => {
                        if (p.avoid) return p;
                        let newFinger = p.finger;
                        if (typeof p.finger === 'number') {
                            newFinger = p.finger + 1;
                        }
                        if (p.fret === newMinFret && !newFinger) {
                            newFinger = 1;
                        }
                        return { ...p, finger: newFinger };
                    });
                }
                // Case 2: Barre -> Open (Shift Fingers Down)
                else if (!isStartingOpen && isEndingOpen) {
                    newPositions = newPositions.map(p => {
                        if (p.avoid) return p;
                        let newFinger = p.finger;
                        if (p.fret === 0) {
                            newFinger = undefined;
                        } else if (typeof p.finger === 'number') {
                            newFinger = Math.max(1, p.finger - 1);
                        }
                        return { ...p, finger: newFinger };
                    });
                }
            }
        }

        // Preserve and shift Barre if it exists
        let newBarre = note.barre;
        if (newBarre) {
            const shiftedFret = newBarre.fret + semitones;

            // Default to preserving the shifted barre
            newBarre = { ...newBarre, fret: shiftedFret };

            // Smart Transpose: We no longer remove the barre if it becomes open (fret 0).
            // We keep it as a "Hidden Barre" to preserve structure for future transpositions.

            // Bounds check
            if (newBarre && (newBarre.fret < 0 || newBarre.fret > 24)) {
                newBarre = undefined;
                console.log("Barre discarded due to bounds check: ", (newBarre as any)?.fret);
            }
        }

        return {
            ...note,
            positions: newPositions,
            barre: newBarre
        };
    });

    return { ...measure, notes: transposedNotes };
}

// === TESTS ===

// 1. Setup Fm7 (Barre at Fret 1)
const fm7: NoteData = {
    id: 'n1',
    positions: [
        { string: 6, fret: 1, finger: 1 }, // Barre
        { string: 5, fret: 3, finger: 3 },
        { string: 4, fret: 1, finger: 1 }, // Barre
        { string: 3, fret: 1, finger: 1 }, // Barre 
        { string: 2, fret: 1, finger: 1 }, // Barre
        { string: 1, fret: 1, finger: 1 }  // Barre
    ],
    barre: { fret: 1, startString: 6, endString: 1, finger: 1 }
};

const measure: MeasureData = { notes: [fm7], chordName: 'Fm7' };

console.log("Initial State (Fm7):");
console.log("- Barre Fret:", fm7.barre?.fret);
console.log("- Positions:", fm7.positions.map(p => `S${p.string}:F${p.fret}`).join(", "));

// 2. Transpose Down (-1) with Auto Finger ON (Smart)
// Expected: Em7 (Open). Fingers shifted down. Barre preserved at 0.
const em7_measure = transposeMeasure(measure, -1, true, false); // smart=true
const em7 = em7_measure.notes[0];

console.log("\nStep 1: Transpose -1 (Auto Finger ON) -> Em7");
console.log("- Barre Fret (Expected 0):", em7.barre?.fret);
console.log("- Positions (Expected F0, F2):", em7.positions.map(p => `S${p.string}:F${p.fret}`).join(", "));

if (em7.barre?.fret !== 0) {
    console.error("FAIL: Barre should be 0, but is", em7.barre?.fret);
} else {
    console.log("PASS: Hidden Barre preserved at 0.");
}

// 3. Transpose Up (+1) with Auto Finger OFF (Simple)
// Expected: Fm7. Fingers shifted up. Barre shifted up (0->1).
const fm7_restored_measure = transposeMeasure(em7_measure, 1, false, false); // smart=false
const fm7_restored = fm7_restored_measure.notes[0];

console.log("\nStep 2: Transpose +1 (Auto Finger OFF) -> Fm7 (Restoration Logic Expected)");
console.log("- Barre Fret (Expected 1):", fm7_restored.barre?.fret);
console.log("- Positions (Expected F1, F3):", fm7_restored.positions.map(p => `S${p.string}:F${p.fret}`).join(", "));

if (fm7_restored.barre?.fret !== 1) {
    console.error("FAIL: Barre should be restored to 1, but is", fm7_restored.barre?.fret);
} else {
    console.log("PASS: Barre restored correctly.");
}
