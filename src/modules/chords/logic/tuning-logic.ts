import { NOTE_NAMES } from '@/modules/editor/domain/music-math';

export const calculateShiftedTuning = (baseTuning: string[], shift: number): string[] => {
    if (shift >= 0) return [...baseTuning]; // Fix names for Capo or Standard

    return baseTuning.map(note => {
        // Extract note part (handles cases like 'e' for high E)
        const isHighE = note === 'e';
        const baseNote = isHighE ? 'E' : note;

        // Find index in NOTE_NAMES. Root might be like 'C#', 'Bb', etc.
        // NOTE_NAMES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        let idx = NOTE_NAMES.indexOf(baseNote);

        // Handle common flat aliases if not found directly
        if (idx === -1) {
            const aliases: Record<string, string> = {
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B', 'Fb': 'E'
            };
            if (aliases[baseNote]) idx = NOTE_NAMES.indexOf(aliases[baseNote]);
        }

        if (idx === -1) return note; // Fallback

        let newIdx = (idx + shift) % 12;
        if (newIdx < 0) newIdx += 12;

        let newNote = NOTE_NAMES[newIdx];

        // Use flats if shift is negative (Down tuning)
        if (shift < 0) {
            const sharpToFlat: Record<string, string> = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
            };
            if (sharpToFlat[newNote]) newNote = sharpToFlat[newNote];
        }

        return isHighE ? newNote.toLowerCase() : newNote;
    });
};
