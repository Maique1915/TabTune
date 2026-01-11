import { MeasureData, NoteData, Duration, Accidental } from '@/modules/editor/domain/types';
import { StandardPosition } from '@/modules/core/domain/types';
import JSZip from 'jszip';

const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * MusicXML Parser for Tab Editor
 * Maps MusicXML data (measures, notes, chords, techniques) to internal MeasureData structure.
 */

export const importScoreFile = async (file: File): Promise<{ measures: MeasureData[], settings: { bpm: number, time: string } }> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'mxl' || extension === 'mscz') {
        const zip = await JSZip.loadAsync(file);
        let xmlContent = '';

        if (extension === 'mxl') {
            // Compressed MusicXML: find the actual XML file
            const containerXml = await zip.file('META-INF/container.xml')?.async('string');
            if (containerXml) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(containerXml, 'text/xml');
                const fullPath = doc.querySelector('rootfile')?.getAttribute('full-path');
                if (fullPath) {
                    xmlContent = await zip.file(fullPath)?.async('string') || '';
                }
            }
            // Fallback: search for any .xml file if container.xml is missing or fails
            if (!xmlContent) {
                const xmlFile = Object.keys(zip.files).find(name => name.endsWith('.xml') && !name.startsWith('META-INF/'));
                if (xmlFile) xmlContent = await zip.file(xmlFile)?.async('string') || '';
            }
        } else if (extension === 'mscz') {
            // MuseScore Native Compressed: find .mscx
            const mscxFile = Object.keys(zip.files).find(name => name.endsWith('.mscx'));
            if (mscxFile) {
                // NOTE: MSCX is NOT MusicXML. However, MuseScore users should use MXL for export.
                // We'll try to parse it if possible, or tell them to use MXL.
                xmlContent = await zip.file(mscxFile)?.async('string') || '';
                // For now, let's assume we need to handle MSCX specifically if we want full support.
                // But MusicXML is the industry standard for exchange.
            }
        }

        if (!xmlContent) throw new Error("Could not find valid content in compressed file.");
        return parseMusicXML(xmlContent);
    } else {
        // Assume it's plain XML
        const text = await file.text();
        return parseMusicXML(text);
    }
};

export const parseMusicXML = (xmlString: string): { measures: MeasureData[], settings: { bpm: number, time: string } } => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Check for parse errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
        throw new Error("Invalid XML format");
    }

    // Detect if it's MuseScore Native (.mscx) or Standard MusicXML
    const isMuseScore = xmlDoc.getElementsByTagName("museScore").length > 0;

    if (isMuseScore) {
        return parseMuseScoreXML(xmlDoc);
    }

    return parseStandardMusicXML(xmlDoc);
};

const parseStandardMusicXML = (xmlDoc: Document): { measures: MeasureData[], settings: { bpm: number, time: string } } => {
    const measures: MeasureData[] = [];
    let currentBpm = 120;
    let currentTime = "4/4";
    let divisions = 1;

    // Get basic score info
    const WorkTitle = xmlDoc.getElementsByTagName("work-title")[0]?.textContent;

    // Process measures
    const xmlMeasures = xmlDoc.getElementsByTagName("measure");

    for (let i = 0; i < xmlMeasures.length; i++) {
        const xmlMeasure = xmlMeasures[i];

        // Update attributes (divisions, time, bpm)
        const attributes = xmlMeasure.getElementsByTagName("attributes")[0];
        if (attributes) {
            const divs = attributes.getElementsByTagName("divisions")[0];
            if (divs) divisions = parseInt(divs.textContent || "1");

            const time = attributes.getElementsByTagName("time")[0];
            if (time) {
                const beats = time.getElementsByTagName("beats")[0]?.textContent;
                const beatType = time.getElementsByTagName("beat-type")[0]?.textContent;
                if (beats && beatType) currentTime = `${beats}/${beatType}`;
            }
        }

        // Update BPM from direction
        const directions = xmlMeasure.getElementsByTagName("direction");
        for (let d = 0; d < directions.length; d++) {
            const metro = directions[d].getElementsByTagName("metronome")[0];
            if (metro) {
                const bpm = metro.getElementsByTagName("per-minute")[0];
                if (bpm) currentBpm = parseInt(bpm.textContent || "120");
            }
        }

        const notes: NoteData[] = [];
        const xmlNotes = xmlMeasure.getElementsByTagName("note");

        for (let j = 0; j < xmlNotes.length; j++) {
            const xmlNote = xmlNotes[j];

            // Check if it's a chord note
            const isChord = xmlNote.getElementsByTagName("chord").length > 0;
            const durationVal = parseInt(xmlNote.getElementsByTagName("duration")[0]?.textContent || "1");
            const durationType = mapDuration(durationVal, divisions);
            const isRest = xmlNote.getElementsByTagName("rest").length > 0;

            const positions: StandardPosition[] = [];
            let accidental: Accidental = 'none';

            if (!isRest) {
                const pitch = xmlNote.getElementsByTagName("pitch")[0];
                const notations = xmlNote.getElementsByTagName("notations")[0];
                let technical = xmlNote.getElementsByTagName("technical")[0];

                // Technical data is often inside notations
                if (!technical && notations) {
                    technical = notations.getElementsByTagName("technical")[0];
                }

                // Get fret/string from technical if available
                let fret = "0";
                let stringNum = "1";

                if (technical) {
                    const xmlFret = technical.getElementsByTagName("fret")[0];
                    const xmlString = technical.getElementsByTagName("string")[0];
                    if (xmlFret) fret = xmlFret.textContent || "0";
                    if (xmlString) stringNum = xmlString.textContent || "1";
                } else if (pitch) {
                    // Fallback: estimate fret/string from pitch (E Standard)
                    const step = pitch.getElementsByTagName("step")[0]?.textContent || "C";
                    const octave = parseInt(pitch.getElementsByTagName("octave")[0]?.textContent || "4");
                    const alter = parseInt(pitch.getElementsByTagName("alter")[0]?.textContent || "0");
                    const tab = getTabFromPitch(step, octave, alter);
                    fret = tab.fret;
                    stringNum = tab.string;
                }

                const fretNum = parseInt(fret || "0", 10);
                const stringVal = parseInt(stringNum || "1", 10);
                positions.push({ fret: fretNum, string: stringVal });

                // Accidental
                const xmlAccidental = xmlNote.getElementsByTagName("accidental")[0]?.textContent;
                if (xmlAccidental === 'sharp') accidental = '#';
                else if (xmlAccidental === 'flat') accidental = 'b';
                else if (xmlAccidental === 'natural') accidental = 'n';
                else if (xmlAccidental === 'double-sharp') accidental = '##';
                else if (xmlAccidental === 'flat-flat') accidental = 'bb';
            }

            // Techniques & Articulations
            const decorators = parseDecorators(xmlNote);
            const technique = parseTechnique(xmlNote);

            if (isChord && notes.length > 0) {
                // Add position to previous note
                notes[notes.length - 1].positions.push(...positions);
            } else {
                notes.push({
                    id: generateId(),
                    type: isRest ? 'rest' : 'note',
                    positions,
                    duration: durationType,
                    accidental,
                    decorators,
                    technique
                });
            }
        }

        measures.push({
            id: generateId(),
            notes,
            showClef: i === 0,
            clef: 'tab', // Default to tab for this editor
            showTimeSig: i === 0
        });
    }

    // Remove empty trailing measures
    const trimmedMeasures = trimEmptyTrailingMeasures(measures);

    if (trimmedMeasures.length < measures.length) {
        console.log(`[MusicXML Parser] Removed ${measures.length - trimmedMeasures.length} empty trailing measure(s)`);
    }

    return { measures: trimmedMeasures, settings: { bpm: currentBpm, time: currentTime } };
};

const mapDuration = (duration: number, divisions: number): Duration => {
    const ratio = duration / divisions;
    if (ratio >= 4) return 'w';
    if (ratio >= 2) return 'h';
    if (ratio >= 1) return 'q';
    if (ratio >= 0.5) return '8';
    if (ratio >= 0.25) return '16';
    return '32';
};

const parseDecorators = (xmlNote: Element) => {
    const decorators: any = {};
    const notations = xmlNote.getElementsByTagName("notations")[0];
    if (notations) {
        const articulations = notations.getElementsByTagName("articulations")[0];
        if (articulations) {
            if (articulations.getElementsByTagName("staccato").length > 0) decorators.staccato = true;
            if (articulations.getElementsByTagName("accent").length > 0) decorators.accent = true;
            if (articulations.getElementsByTagName("tenuto").length > 0) decorators.tenuto = true;
            if (articulations.getElementsByTagName("staccatissimo").length > 0) decorators.staccatissimo = true;
        }
        if (notations.getElementsByTagName("fermata").length > 0) decorators.fermataUp = true;
    }
    // Dots
    if (xmlNote.getElementsByTagName("dot").length > 0) decorators.dot = true;
    return decorators;
};

const parseTechnique = (xmlNote: Element): string | undefined => {
    const notations = xmlNote.getElementsByTagName("notations")[0];
    if (!notations) return undefined;

    const technical = notations.getElementsByTagName("technical")[0];
    if (technical) {
        if (technical.getElementsByTagName("hammer-on").length > 0) return 'h';
        if (technical.getElementsByTagName("pull-off").length > 0) return 'p';
        if (technical.getElementsByTagName("bend").length > 0) return 'b';
        if (technical.getElementsByTagName("tap").length > 0) return 't';
    }

    const ornaments = notations.getElementsByTagName("ornaments")[0];
    if (ornaments) {
        if (ornaments.getElementsByTagName("trill-mark").length > 0) return 'v';
    }

    if (notations.getElementsByTagName("slur").length > 0) {
        // Simple mapping for slurs as slides if no other technique is present
        const slur = notations.getElementsByTagName("slur")[0];
        if (slur.getAttribute("type") === "start") return 's';
    }

    return undefined;
};

/**
 * Check if a measure contains only rests (is empty)
 */
const isMeasureEmpty = (measure: MeasureData): boolean => {
    if (!measure.notes || measure.notes.length === 0) return true;
    return measure.notes.every(note => note.type === 'rest');
};

/**
 * Remove empty measures from the end of the measures array
 * Keeps at least one measure even if all are empty
 */
const trimEmptyTrailingMeasures = (measures: MeasureData[]): MeasureData[] => {
    if (measures.length === 0) return measures;

    // Find the last non-empty measure
    let lastNonEmptyIndex = -1;
    for (let i = measures.length - 1; i >= 0; i--) {
        if (!isMeasureEmpty(measures[i])) {
            lastNonEmptyIndex = i;
            break;
        }
    }

    // If all measures are empty, keep at least the first one
    if (lastNonEmptyIndex === -1) {
        return [measures[0]];
    }

    // Return measures up to and including the last non-empty one
    return measures.slice(0, lastNonEmptyIndex + 1);
};

const parseMuseScoreXML = (doc: Document): { measures: MeasureData[], settings: { bpm: number, time: string } } => {
    const measures: MeasureData[] = [];
    let currentBpm = 120;
    let currentTime = "4/4";

    const tempoText = doc.querySelector('Tempo text')?.textContent;
    if (tempoText) currentBpm = parseInt(tempoText) || 120;

    const measureElements = doc.querySelectorAll('Measure');
    let currentSigN = 4;
    let currentSigD = 4;

    measureElements.forEach((measureEl, index) => {
        const sigN = measureEl.querySelector('TimeSig sigN')?.textContent;
        const sigD = measureEl.querySelector('TimeSig sigD')?.textContent;
        if (sigN && sigD) {
            currentSigN = parseInt(sigN);
            currentSigD = parseInt(sigD);
            currentTime = `${currentSigN}/${currentSigD}`;
        }

        const notes: NoteData[] = [];
        const voiceItems = measureEl.querySelectorAll('voice > Chord, voice > Rest');

        voiceItems.forEach((item, itemIndex) => {
            const isRest = item.tagName === 'Rest';
            const durationTypeStr = item.querySelector('durationType')?.textContent || 'quarter';
            const duration = mapMuseScoreDuration(durationTypeStr);
            const dots = item.querySelector('dots') ? true : false;

            const positions: StandardPosition[] = [];
            const decorators: any = { dot: dots };
            let accidental: Accidental = 'none';
            let technique: string | undefined = undefined;

            if (!isRest) {
                const noteTags = item.querySelectorAll('Note');
                const usedStrings = new Set<number>(); // Track strings used in this chord

                // Debug logging for chords
                if (noteTags.length > 1) {
                    console.log(`[MuseScore Parser] Measure ${index + 1}, Item ${itemIndex + 1}: Found chord with ${noteTags.length} notes`);
                }

                noteTags.forEach((nTag, noteIdx) => {
                    let fret = nTag.querySelector('fret')?.textContent;
                    let stringNum = nTag.querySelector('string')?.textContent;

                    if (!fret || !stringNum) {
                        const pitchEl = nTag.querySelector('pitch');
                        if (pitchEl) {
                            // MSCX uses MIDI pitch directly usually
                            const midi = parseInt(pitchEl.textContent || "60");

                            // Pass usedStrings to avoid conflicts in chords
                            const tab = getTabFromMidi(midi, usedStrings);
                            fret = tab.fret;
                            stringNum = tab.string;

                            // Debug logging for MIDI conversion
                            if (noteTags.length > 1) {
                                console.log(`[MuseScore Parser]   Note ${noteIdx + 1}: MIDI ${midi} -> String ${stringNum}, Fret ${fret}`);
                            }
                        }
                    }

                    // Validate and track string usage
                    const stringNumInt = parseInt(stringNum || "1");
                    if (!isNaN(stringNumInt) && stringNumInt >= 1 && stringNumInt <= 6) {
                        if (usedStrings.has(stringNumInt)) {
                            console.warn(`[MuseScore Parser] WARNING: String ${stringNumInt} used multiple times in same chord! This may cause rendering issues.`);
                        }
                        usedStrings.add(stringNumInt);
                        const fVal = parseInt(fret || "0", 10);
                        const sVal = parseInt(stringNum || "1", 10);
                        positions.push({ fret: fVal, string: sVal });
                    } else {
                        console.error(`[MuseScore Parser] Invalid string number: ${stringNum} (parsed as ${stringNumInt}). Skipping note.`);
                    }

                    // MuseScore accidentals
                    const accidTag = nTag.querySelector('accid')?.textContent;
                    if (accidTag === 'sharp') accidental = '#';
                    else if (accidTag === 'flat') accidental = 'b';
                    else if (accidTag === 'natural') accidental = 'n';
                });

                // Techniques (Glissando/Slur in MSCX)
                const glissando = item.querySelector('Glissando');
                if (glissando) technique = 's';

                // Slurs in MuseScore - use 'l' for pure slur (no text label)
                const slur = item.querySelector('Slur');
                if (slur) technique = technique || 'l';

                // Articulations - MuseScore stores these at the Chord level
                const articulations = item.querySelectorAll('Articulation');
                articulations.forEach(artic => {
                    const subtype = artic.querySelector('subtype')?.textContent;
                    if (!subtype) return;

                    // MuseScore uses patterns like "articStaccatoBelow", "articAccentAbove", etc.
                    // We normalize by checking if the subtype contains the articulation name
                    const subtypeLower = subtype.toLowerCase();

                    if (subtypeLower.includes('staccatissimo')) decorators.staccatissimo = true;
                    else if (subtypeLower.includes('staccato')) decorators.staccato = true;
                    else if (subtypeLower.includes('accent') || subtypeLower.includes('sforzato')) decorators.accent = true;
                    else if (subtypeLower.includes('tenuto')) decorators.tenuto = true;
                    else if (subtypeLower.includes('marcato')) decorators.marcato = true;
                    else if (subtypeLower.includes('fermata')) decorators.fermataUp = true;
                });
            }

            // Validate positions before adding note
            if (!isRest && positions.length === 0) {
                console.warn(`[MuseScore Parser] Measure ${index + 1}, Item ${itemIndex + 1}: Note has no valid positions, skipping.`);
                return; // Skip this note entirely
            }

            notes.push({
                id: generateId(),
                type: isRest ? 'rest' : 'note',
                positions,
                duration,
                accidental,
                decorators,
                technique
            });
        });

        measures.push({
            id: generateId(),
            notes,
            showClef: index === 0,
            clef: 'tab',
            showTimeSig: index === 0
        });
    });

    // Remove empty trailing measures (measures with only rests after the last note)
    const trimmedMeasures = trimEmptyTrailingMeasures(measures);

    if (trimmedMeasures.length < measures.length) {
        console.log(`[MuseScore Parser] Removed ${measures.length - trimmedMeasures.length} empty trailing measure(s)`);
    }

    return { measures: trimmedMeasures, settings: { bpm: currentBpm, time: currentTime } };
};

const mapMuseScoreDuration = (msDuration: string): Duration => {
    switch (msDuration) {
        case 'whole': return 'w';
        case 'half': return 'h';
        case 'quarter': return 'q';
        case 'eighth': return '8';
        case '16th': return '16';
        case '32nd': return '32';
        default: return 'q';
    }
};

const getTabFromPitch = (step: string, octave: number, alter: number): { fret: string, string: string } => {
    const stepToOffset: { [key: string]: number } = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const midi = 12 * (octave + 1) + stepToOffset[step] + alter;
    return getTabFromMidi(midi);
};

/**
 * Convert MIDI note to guitar tablature position
 * @param midi - MIDI note number (0-127)
 * @param usedStrings - Set of string numbers already used in this chord (to avoid conflicts)
 * @returns Object with fret and string as strings
 */
const getTabFromMidi = (midi: number, usedStrings: Set<number> = new Set()): { fret: string, string: string } => {
    const tuning = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2 (strings 1-6)

    // First pass: try to find a string that isn't already used and has a reasonable fret position
    for (let i = 0; i < tuning.length; i++) {
        const stringNum = i + 1;
        if (usedStrings.has(stringNum)) continue; // Skip strings already used in this chord

        if (midi >= tuning[i]) {
            const fret = midi - tuning[i];
            if (fret <= 24) {
                return { fret: fret.toString(), string: stringNum.toString() };
            }
        }
    }

    // Second pass: if all preferred strings are taken, find ANY available string
    for (let i = 0; i < tuning.length; i++) {
        const stringNum = i + 1;
        if (usedStrings.has(stringNum)) continue;

        const fret = Math.abs(midi - tuning[i]);
        if (fret <= 24) {
            console.warn(`[MuseScore Parser] Note MIDI ${midi} placed on string ${stringNum} at fret ${fret} (non-optimal)`);
            return { fret: fret.toString(), string: stringNum.toString() };
        }
    }

    // Fallback: if all strings are used (shouldn't happen in valid guitar music), use string 6
    console.error(`[MuseScore Parser] Could not find valid position for MIDI ${midi}, all strings occupied. Using fallback.`);
    return { fret: "0", string: "6" };
};
