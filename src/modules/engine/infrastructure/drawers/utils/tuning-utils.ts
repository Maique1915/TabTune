export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/**
 * Transposes a note name by a given number of semitones.
 */
export function transposeNote(note: string, semitones: number): string {
    if (!note) return "";

    const isLower = note === note.toLowerCase();
    const cleanNote = note.toUpperCase();

    let index = NOTES.indexOf(cleanNote);
    if (index === -1) index = NOTES_FLAT.indexOf(cleanNote);

    if (index === -1) return note; // Return original if not found

    // Calculate new index
    let newIndex = (index + semitones) % 12;
    if (newIndex < 0) newIndex += 12;

    // Prefer flats for DOWN transposition
    const transposed = semitones < 0 ? NOTES_FLAT[newIndex] : NOTES[newIndex];

    return isLower ? transposed.toLowerCase() : transposed;
}

/**
 * Transposes an array of string names (e.g., ["E", "A", "D", "G", "B", "e"]).
 */
export function transposeStringNames(names: string[], semitones: number): string[] {
    return names.map(n => transposeNote(n, semitones));
}
