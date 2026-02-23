
import { ScoreData, MusicalMeasure } from '../../core/domain/types';
import { Note, NotePosition } from '../domain/types';

export function convertScoreToAnimatorNotes(score: ScoreData): { notes: Note[], bpm: number } {
    const animatorNotes: Note[] = [];
    let currentTickOffset = 0;
    const bpm = score.tempo || 120;
    const ticksPerQuarter = 480;
    const secondsPerTick = 60 / (bpm * ticksPerQuarter);

    score.measures.forEach((measure) => {
        measure.notes.forEach((mNote) => {
            if (mNote.type === 'rest') return;

            const positions: NotePosition[] = (mNote.tabData || []).map(tab => ({
                stringIndex: tab.str,
                fret: tab.fret
            }));

            if (positions.length === 0) return;

            animatorNotes.push({
                id: crypto.randomUUID(),
                positions,
                time: (currentTickOffset + mNote.startTime) * secondsPerTick,
                duration: mNote.ticks * secondsPerTick,
                type: 'normal'
            });
        });
        currentTickOffset += measure.totalTicks;
    });

    return { notes: animatorNotes, bpm };
}
