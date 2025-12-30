
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

            // Native VexTab Articulations & Decorators
            if (n.decorators.staccato) decoratorsStr += ".";
            if (n.decorators.accent) decoratorsStr += ">";
            if (n.decorators.staccatissimo) decoratorsStr += "v";
            if (n.decorators.tenuto) decoratorsStr += "-";
            if (n.decorators.marcato) decoratorsStr += "^";
            if (n.decorators.pizzicato) decoratorsStr += "+";
            if (n.decorators.snapPizzicato) decoratorsStr += "o";
            if (n.decorators.fermataUp) decoratorsStr += "@a";
            if (n.decorators.fermataDown) decoratorsStr += "@u";
            if (n.decorators.bowUp) decoratorsStr += "u";
            if (n.decorators.bowDown) decoratorsStr += "d";
            if (n.decorators.openNote) decoratorsStr += "h";

            // Fallback to Text for any remaining special annotations (if needed)
            // Note: We've moved most to native VexTab symbols above.

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
            let techniquePrefix = "";

            if (tech === 't') {
                techniquePrefix = "t";
            }

            if (tech && ['s', 'h', 'p', 'b', 't'].includes(tech)) {
                const nextNote: NoteData | undefined = measure.notes[nIdx + 1];
                const firstPos = n.positions[0];
                if (n.slideTargetId && firstPos) {
                    if (nextNote && nextNote.id === n.slideTargetId && nextNote.positions.some(p => p.string === firstPos.string)) {
                        connector = ` ${tech} `;
                    }
                } else if (firstPos) {
                    const canConnect = nextNote &&
                        nextNote.type === 'note' &&
                        nextNote.positions.some(p => p.string === firstPos.string);
                    if (canConnect) {
                        connector = ` ${tech} `;
                    }
                }
            }

            const vibrato = tech === 'v' ? 'v' : '';

            // Positions string construction
            let posStr = "";
            if (n.positions.length > 1) {
                posStr = "(" + n.positions.map(p => `${p.fret}/${p.string}`).join(".") + ")";
            } else if (n.positions.length === 1) {
                posStr = `${n.positions[0].fret}/${n.positions[0].string}`;
            } else if (!isRest) {
                // Should not happen for notes, but as fallback
                posStr = "0/1";
            }

            // Auto-beaming logic: Beam only consecutive notes (not rests) with duration 8, 16, 32
            let beam = "";
            const isBeamableDuration = (d: string) => ['8', '16', '32'].includes(d);

            if (!isRest && isBeamableDuration(n.duration)) {
                const nextNote = measure.notes[nIdx + 1];
                if (nextNote && nextNote.type === 'note' && isBeamableDuration(nextNote.duration)) {
                    beam = "^";
                }
            }

            currentGroup.push(`${prefix}${techniquePrefix}${posStr}${accidentalStr}${headStr}${beam}${vibrato}${decoratorsStr}${connector}`);
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
