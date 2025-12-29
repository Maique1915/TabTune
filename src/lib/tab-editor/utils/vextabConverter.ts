
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
        const val = measure.clef || settings.clef;
        const shouldShowClef = measure.showClef && val !== 'tab';
        const clefPart = shouldShowClef ? `clef=${val}` : "clef=none";

        const timePart = measure.showTimeSig ? `time=${settings.time}` : "";

        vextab += `tabstave notation=${notation} tablature=${tablature} key=${settings.key} ${clefPart} ${timePart}\n`;

        let currentDuration = "";
        let lastWasRest = false;

        let lastType = measure.notes[0]?.type || 'note';
        let currentGroup: string[] = [];
        const groups: string[] = [];
        let textLine = "text";
        let hasText = false;

        measure.notes.forEach((n, nIdx) => {
            let prefix = "";
            const isRest = n.type === 'rest';

            const typeChanged = isRest !== lastWasRest;
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

            let decoratorsStr = "";
            const textSymbols: string[] = [];

            // Native VexTab Articulations (Safe keys)
            if (n.decorators.staccato) decoratorsStr += " $.a./bottom.$";
            if (n.decorators.accent) decoratorsStr += " $.a>/bottom.$";
            if (n.decorators.staccatissimo) decoratorsStr += " $.av/bottom.$";
            if (n.decorators.snapPizzicato) decoratorsStr += " $.ao/top.$";

            // Fallback to Text for Special Char Articulations
            if (n.decorators.pizzicato) textSymbols.push('+');
            if (n.decorators.tenuto) { console.log('Converter: Tenuto'); textSymbols.push('-'); }
            if (n.decorators.marcato) { console.log('Converter: Marcato'); textSymbols.push('^'); }
            if (n.decorators.fermata) { console.log('Converter: Fermata'); textSymbols.push('𝄐'); }
            if (n.decorators.fermataDown) textSymbols.push('𝄑');
            if (n.decorators.bowUp) textSymbols.push('∨');
            if (n.decorators.bowDown) textSymbols.push('⊓');
            if (n.decorators.open) textSymbols.push('o');

            // Annotations & Chords
            if (n.chord) textSymbols.unshift(n.chord); // Chords first
            if (n.annotation) textSymbols.push(n.annotation);

            // Text Sync
            textLine += ` :${n.duration}${n.decorators.dot ? 'd' : ''}, ${textSymbols.join(" ")},`;
            if (textSymbols.length > 0) hasText = true;

            lastWasRest = isRest;
            const accidentalStr = n.accidental && n.accidental !== 'none' ? n.accidental : '';

            let headStr = '';
            // VexTab Note Head Suffixes
            switch (n.noteHead) {
                case 'x': headStr = 'X'; break; // Ghost
                case 'diamond': headStr = 'd'; break; // Diamond
                case 'square': headStr = 'sq'; break; // Square (Try sq)
                case 'triangle': headStr = 'tu'; break; // Triangle Up (Try tu)
            }

            if (isRest) {
                currentGroup.push(`  ${prefix} ##  `);
                return;
            }

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

            currentGroup.push(`${prefix}${n.fret}${accidentalStr}${headStr}/${n.string}${beam}${vibrato}${decoratorsStr}${connector}`);
        });

        if (currentGroup.length > 0) groups.push(currentGroup.join(" "));

        // Emit groups as separate notes commands
        groups.forEach(g => {
            vextab += `notes ${g}\n`;
        });

        if (hasText) {
            if (textLine.endsWith(",")) textLine = textLine.slice(0, -1);
            console.log("Converter: TextLine ->", textLine);
            vextab += `${textLine}\n`;
        }
    });

    return vextab;
}
