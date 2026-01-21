
import { ScoreData, MusicalMeasure, MusicalNote, TabData } from '../types';
import { KEY_SIGNATURE_MAP, CLEF_MAP, MIDI_TO_NOTE_NAME, DURATION_MAP } from '../constants';

declare const JSZip: any;

export class MSCZParser {
  static async parse(file: File): Promise<ScoreData> {
    const zip = await JSZip.loadAsync(file);
    const mscxFile = Object.keys(zip.files).find(name => name.endsWith('.mscx'));
    
    if (!mscxFile) throw new Error("Arquivo .mscz inválido.");

    const xmlText = await zip.files[mscxFile].async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    return this.extractData(xmlDoc);
  }

  private static extractData(doc: Document): ScoreData {
    const title = doc.querySelector('metaTag[name="workTitle"]')?.textContent || 'Sem Título';
    const composer = doc.querySelector('metaTag[name="composer"]')?.textContent || 'Desconhecido';
    const tempoText = doc.querySelector('Tempo text')?.textContent || '120';
    const tempo = parseInt(tempoText) || 120;

    const measures: MusicalMeasure[] = [];
    const measureElements = doc.querySelectorAll('Measure');
    
    let currentClef = 'treble';
    let currentKey = 'C';
    let currentSigN = 4;
    let currentSigD = 4;

    measureElements.forEach((measureEl, index) => {
      const clefTag = measureEl.querySelector('Clef');
      if (clefTag) {
        const sign = clefTag.querySelector('sign')?.textContent || 'G';
        const line = clefTag.querySelector('line')?.textContent || '2';
        currentClef = CLEF_MAP[sign + line] || CLEF_MAP[sign] || 'treble';
      }

      const keyTag = measureEl.querySelector('KeySig accid');
      if (keyTag) {
        currentKey = KEY_SIGNATURE_MAP[parseInt(keyTag.textContent || '0')] || 'C';
      }

      const sigN = measureEl.querySelector('TimeSig sigN')?.textContent;
      const sigD = measureEl.querySelector('TimeSig sigD')?.textContent;
      if (sigN && sigD) {
        currentSigN = parseInt(sigN);
        currentSigD = parseInt(sigD);
      }

      const notes: MusicalNote[] = [];
      let measureTickOffset = 0;
      
      const voiceItems = measureEl.querySelectorAll('voice > Chord, voice > Rest');
      voiceItems.forEach((item) => {
        const durationType = item.querySelector('durationType')?.textContent || 'quarter';
        const dots = parseInt(item.querySelector('dots')?.textContent || '0');
        const vexDuration = DURATION_MAP[durationType] || 'q';
        const isRest = item.tagName === 'Rest';
        
        let baseTicks = 480;
        if (durationType === 'whole') baseTicks = 1920;
        else if (durationType === 'half') baseTicks = 960;
        else if (durationType === 'eighth') baseTicks = 240;
        else if (durationType === '16th') baseTicks = 120;
        else if (durationType === '32nd') baseTicks = 60;

        let totalTicks = baseTicks;
        let added = baseTicks / 2;
        for(let i=0; i<dots; i++) {
          totalTicks += added;
          added /= 2;
        }
        
        const noteKeys: string[] = [];
        const accidentals: (string | null)[] = [];
        const tabEntries: TabData[] = [];

        if (!isRest) {
          const noteTags = item.querySelectorAll('Note');
          noteTags.forEach(nTag => {
            const pitch = parseInt(nTag.querySelector('pitch')?.textContent || '60');
            const accidTag = nTag.querySelector('accidental')?.textContent;
            const fretTag = nTag.querySelector('fret')?.textContent;
            const stringTag = nTag.querySelector('string')?.textContent;
            
            noteKeys.push(MIDI_TO_NOTE_NAME[pitch] || 'c/4');
            
            let vexAccid = null;
            if (accidTag === 'flat') vexAccid = 'b';
            else if (accidTag === 'sharp') vexAccid = '#';
            else if (accidTag === 'natural') vexAccid = 'n';
            
            accidentals.push(vexAccid);

            if (fretTag && stringTag) {
              tabEntries.push({
                fret: parseInt(fretTag),
                str: parseInt(stringTag)
              });
            }
          });
        } else {
          noteKeys.push('b/4');
          accidentals.push(null);
        }

        // Fix: Added missing 'id' property required by MusicalNote interface
        notes.push({
          id: Math.random().toString(36).substring(2, 11),
          keys: noteKeys,
          duration: vexDuration + (isRest ? 'r' : ''),
          type: isRest ? 'rest' : 'note',
          ticks: totalTicks,
          startTime: measureTickOffset,
          accidentals,
          dots,
          tabData: tabEntries.length > 0 ? tabEntries : undefined
        });

        measureTickOffset += totalTicks;
      });

      measures.push({
        number: index + 1,
        notes,
        clef: currentClef,
        keySignature: currentKey,
        timeSignature: { numerator: currentSigN, denominator: currentSigD },
        totalTicks: measureTickOffset
      });
    });

    return { title, composer, measures, tempo };
  }
}
