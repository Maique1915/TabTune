
import { NoteData, ScoreData } from '../types';

declare var JSZip: any;

export class MusescoreParser {
  static async parseFile(file: File): Promise<ScoreData> {
    let xmlContent: string;

    if (file.name.endsWith('.mscz')) {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const mscxFile = Object.keys(content.files).find(name => name.endsWith('.mscx'));
      if (!mscxFile) throw new Error('No .mscx file found inside the .mscz archive');
      xmlContent = await content.files[mscxFile].async('string');
    } else {
      xmlContent = await file.text();
    }

    return this.parseXml(xmlContent);
  }

  private static parseXml(xmlString: string): ScoreData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const title = doc.querySelector('metaTag[name="workTitle"]')?.textContent || 
                  doc.querySelector('workTitle')?.textContent || 'Untitled';
    const composer = doc.querySelector('metaTag[name="composer"]')?.textContent || 'Unknown';
    
    const divisions = parseInt(doc.querySelector('divisions')?.textContent || '480', 10);
    const timeSigNum = parseInt(doc.querySelector('sigN')?.textContent || '4', 10);
    const timeSigDen = parseInt(doc.querySelector('sigD')?.textContent || '4', 10);
    
    const notes: NoteData[] = [];
    let maxTick = 0;

    const staves = doc.querySelectorAll('Staff');
    
    staves.forEach((staff, staffIdx) => {
      let currentTick = 0;
      const measures = staff.querySelectorAll('Measure');
      
      measures.forEach((measure, measureIdx) => {
        const voices = measure.querySelectorAll('voice');
        const containers = voices.length > 0 ? Array.from(voices) : [measure];

        containers.forEach((container, vIdx) => {
          let vTick = currentTick;
          let activeTupletId: string | undefined = undefined;

          // Recurse to find all chords/rests/tuplets in correct order
          const processElements = (elements: Element[]) => {
            elements.forEach(child => {
              if (child.tagName === 'Tuplet') {
                activeTupletId = Math.random().toString(36).substr(2, 9);
                // Tuplets in MuseScore often contain the chords inside them
                processElements(Array.from(child.children));
                activeTupletId = undefined;
                return;
              }

              if (child.tagName === 'Chord' || child.tagName === 'Rest') {
                const durationType = child.querySelector('durationType')?.textContent || 'quarter';
                const dots = child.querySelectorAll('dots').length;
                const duration = this.getDurationInTicks(durationType, divisions, dots);
                const isRest = child.tagName === 'Rest';

                if (isRest) {
                  notes.push({
                    type: 'rest', pitch: 0, startTime: vTick, duration,
                    staff: staffIdx, voice: vIdx, measureIndex: measureIdx
                  });
                } else {
                  const noteEls = child.querySelectorAll('Note');
                  noteEls.forEach(nEl => {
                    const pitch = parseInt(nEl.querySelector('pitch')?.textContent || '60', 10);
                    const accidental = nEl.querySelector('accidental')?.textContent?.toLowerCase();
                    
                    // Detailed Articulation extraction
                    const articulations: string[] = [];
                    child.querySelectorAll('Articulation').forEach(a => {
                      const subtype = a.querySelector('subtype')?.textContent;
                      if (subtype) articulations.push(subtype);
                    });

                    // Slurs detection
                    const slurIds: { id: number; type: 'start' | 'stop' }[] = [];
                    child.querySelectorAll('Slur').forEach(s => {
                      const id = parseInt(s.getAttribute('nr') || '0', 10);
                      const type = s.getAttribute('type') as 'start' | 'stop';
                      if (type) slurIds.push({ id, type });
                    });

                    notes.push({
                      type: 'note',
                      pitch,
                      startTime: vTick,
                      duration,
                      staff: staffIdx,
                      voice: vIdx,
                      measureIndex: measureIdx,
                      accidental: this.mapAccidental(accidental),
                      articulations,
                      isDotted: dots > 0,
                      tupletId: activeTupletId,
                      slurIds
                    });
                  });
                }
                vTick += duration;
                if (vTick > maxTick) maxTick = vTick;
              } else if (child.tagName === 'tick') {
                vTick = currentTick + parseInt(child.textContent || '0', 10);
              }
            });
          };

          processElements(Array.from(container.children));
        });
        currentTick += (timeSigNum * (divisions * 4 / timeSigDen));
      });
    });

    return { 
      title, composer, notes, totalTicks: maxTick, tempo: 120, divisions,
      timeSignature: { num: timeSigNum, den: timeSigDen }
    };
  }

  private static mapAccidental(acc: string | undefined): string | undefined {
    if (!acc) return undefined;
    if (acc.includes('sharp')) return '#';
    if (acc.includes('flat')) return 'b';
    if (acc.includes('natural')) return 'n';
    if (acc.includes('double-sharp')) return '##';
    if (acc.includes('double-flat')) return 'bb';
    return undefined;
  }

  private static getDurationInTicks(type: string, divisions: number, dots: number): number {
    const map: Record<string, number> = {
      'longa': divisions * 16, 'breve': divisions * 8, 'whole': divisions * 4,
      'half': divisions * 2, 'quarter': divisions, 'eighth': divisions / 2,
      '16th': divisions / 4, '32nd': divisions / 8, '64th': divisions / 16,
    };
    let base = map[type] || divisions;
    let total = base;
    for (let d = 0; d < dots; d++) {
        base = base / 2;
        total += base;
    }
    return total;
  }
}
