
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
    const clefPart = measure.showClef ? `clef=${settings.clef}` : "";
    const timePart = measure.showTimeSig ? `time=${settings.time}` : "";
    
    vextab += `tabstave notation=${notation} tablature=${tablature} key=${settings.key} ${clefPart} ${timePart}\n`;

    let currentDuration = "";
    let lastWasRest = false;

    const notesContent = measure.notes.map((n, nIdx) => {
      let prefix = "";
      const isRest = n.type === 'rest';
      
      const typeChanged = isRest !== lastWasRest;
      const durationStr = `${n.duration}${n.decorators.dot ? 'd' : ''}`;
      const durationChanged = durationStr !== currentDuration;

      if (durationChanged || typeChanged || isRest) {
        prefix = ` :${n.duration}${n.decorators.dot ? 'd' : ''} `;
        currentDuration = durationStr;
      }

      lastWasRest = isRest;
      const accidentalStr = n.accidental && n.accidental !== 'none' ? n.accidental : '';
      
      if (isRest) {
        return `  ${prefix} ##  `;
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
      return `${prefix}${n.fret}${accidentalStr}/${n.string}${vibrato}${decoratorsStr}${connector}`;
    }).join(" ");
    
    vextab += `notes ${notesContent}\n`;
  });
  
  return vextab;
}
