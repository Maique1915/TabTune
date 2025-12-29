
import { MeasureData, GlobalSettings, ScoreStyle, NoteData } from '../types';

export function convertToVextab(measures: MeasureData[], settings: GlobalSettings, style?: ScoreStyle): string {
    const notation = settings.showNotation ? "true" : "false";
    const tablature = settings.showTablature ? "true" : "false";
    const space = style?.staveSpace ?? 20;

    let vextab = `options space=${space}\n`;

    measures.forEach((measure) => {
        if (measure.notes.length === 0) return;

        // Omitimos os parâmetros se não forem necessários. 
        // O Vextab colocará padrões, que removeremos manualmente no ScorePreview.
        const clefPart = measure.showClef ? `clef=${settings.clef}` : "clef=none";
        const timePart = measure.showTimeSig ? `time=${settings.time}` : "";

        vextab += `tabstave notation=${notation} tablature=${tablature} key=${settings.key} ${clefPart} ${timePart}\n`;

        let currentDuration = "";
        let lastWasRest = false;

        let lastType = measure.notes[0]?.type || 'note';
        let currentGroup: string[] = [];
        const groups: string[] = [];

        measure.notes.forEach((n, nIdx) => {
            let prefix = "";
            const isRest = n.type === 'rest';

            const typeChanged = isRest !== lastWasRest; // Used for prefix calculation
            // Check for group split (Note <-> Rest)
            if (n.type !== lastType) {
                if (currentGroup.length > 0) groups.push(currentGroup.join(" "));
                currentGroup = [];
                lastType = n.type;
            }

            const durationStr = `${n.duration}${n.decorators.dot ? 'd' : ''}`;
            const durationChanged = durationStr !== currentDuration;

            if (durationChanged || typeChanged || isRest) {
                prefix = ` :${n.duration}${n.decorators.dot ? 'd' : ''} `;
                currentDuration = durationStr;
            }

            lastWasRest = isRest;
            const accidentalStr = n.accidental && n.accidental !== 'none' ? n.accidental : '';

            if (isRest) {
                currentGroup.push(`  ${prefix} ##  `);
                return;
            }

            let decoratorsStr = "";
            if (n.decorators.staccato) decoratorsStr += "v";
            if (n.decorators.accent) decoratorsStr += "V";
            if (n.decorators.marcato) decoratorsStr += "^";

            let tech = n.technique || "";
            let connector = "";

            if (tech && ['s', 'h', 'p', 'b'].includes(tech)) {
                const nextNote: NoteData | undefined = measure.notes[nIdx + 1];
                if (n.slideTargetId) {
                    if (nextNote && nextNote.id === n.slideTargetId && nextNote.string === n.string) {
                        connector = ` ${tech} `;
                    }
                } else {
                    const canConnect = nextNote &&
                        nextNote.type === 'note' &&
                        nextNote.string === n.string;
                    if (canConnect) {
                        connector = ` ${tech} `;
                    }
                }
            }

            const vibrato = tech === 'v' ? 'v' : '';

            // Auto-beaming logic: Beam only consecutive notes (not rests) with duration 8, 16, 32
            let beam = "";
            const isBeamableDuration = (d: string) => ['8', '16', '32'].includes(d);

            if (!isRest && isBeamableDuration(n.duration)) {
                // Only beam if we are NOT at the end of a group (checking next note type)
                // Actually, if we split groups, the next note in THIS group is naturally a note.
                // But we need to look ahead in the source array to see if we should beam *visually*.
                // With explicit ^, we force it.
                // The split prevents beaming across groups.

                const nextNote = measure.notes[nIdx + 1];
                if (nextNote && nextNote.type === 'note' && isBeamableDuration(nextNote.duration)) {
                    beam = "^";
                }
            }

            currentGroup.push(`${prefix}${n.fret}${accidentalStr}/${n.string}${beam}${vibrato}${decoratorsStr}${connector}`);
        });

        if (currentGroup.length > 0) groups.push(currentGroup.join(" "));

        // Emit groups as separate notes commands
        groups.forEach(g => {
            vextab += `notes ${g}\n`;
        });
    });

    return vextab;
}
