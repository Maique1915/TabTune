
import { describe, it, expect } from 'vitest';
import { FretboardHistoryFile, FretboardTimelineEvent } from '@/modules/core/domain/types';

// Mock logic that would be in a parser/mapper
const mapTimelineToChords = (history: FretboardHistoryFile) => {
    return history.timeline.map(event => ({
        chordName: event.chordName,
        fingers: event.positions,
        stringNames: history.settings.tuning,
        duration: event.duration
    }));
};

describe('Fretboard History Data Structure', () => {
    it('should map simplified timeline events to chord props using global settings', () => {
        const history: FretboardHistoryFile = {
            version: 2,
            settings: {
                tuning: ['E', 'A', 'D', 'G', 'B', 'e'],
                capo: 0,
                numStrings: 6
            },
            timeline: [
                {
                    startTime: 0,
                    duration: 2000,
                    chordName: 'Em',
                    positions: [
                        { string: 5, fret: 2, finger: 2 },
                        { string: 4, fret: 2, finger: 3 }
                    ]
                }
            ]
        };

        const chords = mapTimelineToChords(history);

        expect(chords).toHaveLength(1);
        expect(chords[0].chordName).toBe('Em');
        expect(chords[0].stringNames).toEqual(['E', 'A', 'D', 'G', 'B', 'e']);
        expect(chords[0].fingers).toHaveLength(2);
        expect(chords[0].fingers[0]).toEqual({ string: 5, fret: 2, finger: 2 });
    });
});
