import { ChordDiagramProps, FretboardTheme, Achord } from "@/modules/core/domain/types";
import { MeasureData, NoteData, Duration, GlobalSettings } from "@/modules/editor/domain/types";

export interface FullHistoryState {
    version: number;
    chords: ChordDiagramProps[];
    measures?: MeasureData[]; // Added to preserve exact editor state
    settings?: GlobalSettings;
    theme?: FretboardTheme;
}

export function createFullHistory(measures: MeasureData[], settings: GlobalSettings, theme: FretboardTheme): FullHistoryState {
    const chords = fretboardToHistory(measures, settings);
    return {
        version: 1,
        chords,
        measures,
        settings,
        theme
    };
}

/**
 * Parses a chord name string into an Achord structure used by the system.
 */
function parseChordValues(chordName: string | undefined): Achord {
    if (!chordName) return { note: 0, complement: 0, extension: [], bass: 0 };

    console.log('[history-manager] Parsing:', chordName);

    // Hardcoded arrays to avoid import issues
    const notesRef = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const extensionsRef = ['sus2', 'sus4', 'aug', '5', "6", "7", "7+", "9", "11", "13", "(#5)", "(b5)"];
    const bassesRef = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];

    // 1. Extract Bass if present (after last '/')
    let baseName = chordName;
    let bassIndex = 0;

    const slashIndex = chordName.lastIndexOf('/');
    if (slashIndex > -1) {
        const bassPart = chordName.substring(slashIndex); // e.g., "/G"
        bassIndex = bassesRef.indexOf(bassPart);

        if (bassIndex > -1) {
            baseName = chordName.substring(0, slashIndex);
        } else {
            bassIndex = 0;
        }
    }

    // 2. Extract Root
    let rootIndex = -1;
    let rootLen = 0;

    // Sort notes by length desc to match F# before F
    const sortedNotes = [...notesRef].sort((a, b) => b.length - a.length);

    for (const note of sortedNotes) {
        if (baseName.startsWith(note)) {
            rootIndex = notesRef.indexOf(note);
            rootLen = note.length;
            break;
        }
    }

    if (rootIndex === -1) {
        console.warn('[history-manager] Failed to find root for:', baseName);
        return { note: 0, complement: 0, extension: [], bass: 0 };
    }

    // 3. Extract Remainder (Quality + Extensions)
    const remainder = baseName.substring(rootLen);

    // 4. Determine Complement (Quality)
    let complementIndex = 0; // Major
    let extStr = remainder;

    if (remainder.startsWith('m') && !remainder.startsWith('maj')) {
        complementIndex = 1; // m
        extStr = remainder.substring(1);
    }
    else if (remainder.startsWith('°') || remainder.startsWith('dim')) {
        complementIndex = 2; // °
        extStr = remainder.startsWith('dim') ? remainder.substring(3) : remainder.substring(1);
    }

    // 5. Extract Extensions
    const extIndices: number[] = [];
    let processingExts = extStr;

    const sortedExts = extensionsRef.map((e, i) => ({ val: e, idx: i })).sort((a, b) => b.val.length - a.val.length);

    for (const { val, idx } of sortedExts) {
        if (processingExts.includes(val)) {
            extIndices.push(idx);
            processingExts = processingExts.replace(val, '');
        }
    }

    const result = {
        note: rootIndex,
        complement: complementIndex,
        extension: extIndices.sort((a, b) => a - b),
        bass: bassIndex
    };

    console.log('[history-manager] Parsed Result:', result);
    return result;
}

/**
 * Downloads the history object as a JSON file.
 */
export function downloadHistory(data: any, filename: string = "history.json") {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file and returns the parsed history object.
 * Returns a normalized object containing chords, measures (optional), and settings/theme.
 */
export function readHistoryFile(file: File): Promise<{
    chords: ChordDiagramProps[],
    measures?: MeasureData[],
    settings?: GlobalSettings,
    theme?: FretboardTheme
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        const normalizeFingers = (f: any): any[] => {
            if (Array.isArray(f)) return f;
            if (f && typeof f === 'object') {
                return Object.keys(f).map(key => {
                    const val = f[key];
                    // val is expected to be [fret, finger] or [fret, finger, endString/fret?]
                    // Legacy dict was [fret, finger]
                    return { string: parseInt(key), fret: val[0], finger: val[1] };
                });
            }
            return [];
        };

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                console.log('[history-manager] Parsed JSON keys:', Object.keys(json));

                // V2 Format: Timeline
                if (json.timeline && Array.isArray(json.timeline)) {
                    console.log('[history-manager] Detected V2 History Format');
                    const settings = json.settings || {};
                    const tuning = settings.tuning || ['E', 'A', 'D', 'G', 'B', 'e'];

                    const chords: ChordDiagramProps[] = json.timeline.map((event: any) => {
                        const achord = parseChordValues(event.chordName);
                        return {
                            chord: achord,
                            origin: achord.note,
                            fingers: event.positions || [],
                            avoid: [],
                            stringNames: event.tuning || tuning,
                            chordName: event.chordName,
                            showChordName: true,
                            capo: event.capo || settings.capo || 0,
                            extends: {
                                durationMs: event.duration
                            }
                        };
                    });

                    resolve({
                        chords,
                        settings: json.settings,
                        theme: json.theme
                    });
                }
                // Legacy Formats
                else if (json.chords || Array.isArray(json)) {
                    let chords = Array.isArray(json) ? json : json.chords;
                    // Normalize fingers from Dict to Array if needed
                    chords = chords.map((c: any) => ({
                        ...c,
                        fingers: normalizeFingers(c.fingers)
                    }));

                    resolve({
                        chords,
                        measures: json.measures,
                        settings: json.settings,
                        theme: json.theme
                    });
                } else {
                    reject(new Error("Invalid history file format."));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

import { getNoteDurationValue, getMeasureCapacity } from "@/modules/editor/domain/music-math";

/**
 * Converts Fretboard measures to the unified history format (ChordDiagramProps[]).
 * Merges all notes in a measure into a single ChordDiagramProps to represent the full chord shape.
 */
export function fretboardToHistory(measures: MeasureData[], settings: GlobalSettings): ChordDiagramProps[] {
    const history: ChordDiagramProps[] = [];
    const bpm = settings.bpm || 120;
    const msPerBeat = 60000 / bpm;

    // Calculate measure duration based on Time Signature
    // capacity is in "Whole Note" units (e.g., 4/4 = 1.0)
    // We assume 1 Whole Note = 4 Quarter Notes (Beats)
    const capacity = getMeasureCapacity(settings.time);
    const measureDurationMs = capacity * 4 * msPerBeat;

    measures.forEach(measure => {
        // 1. Collect all positions from all notes in the measure
        const mergedPositions: any = {};
        let barreData: any = undefined;

        measure.notes.forEach(note => {
            // Merge positions
            note.positions.forEach(pos => {
                if (pos.string > 0) {
                    // Studio expects [fret, finger]
                    mergedPositions[pos.string] = [pos.fret, pos.finger || 0];
                }
            });

            // Barre information is now derived from positions in the current data model.
            // Old barre property on NoteData is no longer supported.
        });

        // 2. Parse Chord Name to populate Achord
        const chordName = measure.chordName || '';
        const achord = parseChordValues(chordName);

        // 3. Create the unified ChordDiagramProps
        const chordData: ChordDiagramProps = {
            chord: achord,
            origin: achord.note,
            fingers: mergedPositions, // Corrected from positions to fingers
            avoid: [],
            stringNames: settings.tuning,
            chordName: chordName,
            showChordName: measure.showChordName,
            capo: settings.tuningShift && settings.tuningShift > 0 ? settings.tuningShift : 0,
            extends: {
                durationMs: measureDurationMs,
                measureId: measure.id,
            }
        };

        // Legacy nutForm mapping removed. Barre information is now handled via StandardPosition's endString.
        history.push(chordData);
    });

    return history;
}


/**
 * Converts the unified history format (ChordDiagramProps[]) back to Fretboard measures.
 * Maps each History Chord to ONE Fretboard Measure containing ONE Note (Chord).
 */
export function historyToFretboard(history: ChordDiagramProps[]): MeasureData[] {
    const measures: MeasureData[] = [];

    history.forEach(chord => {
        // Create a new measure for THIS chord
        const measure = createEmptyMeasure();

        // Restore chord name
        measure.chordName = chord.chordName;
        measure.showChordName = chord.showChordName;

        const ext = chord.extends || {};

        // Calculate duration code from durationMs if possible, or default to whole/quarter?
        // If we came from Studio, we might have durationMs.
        // If we came from Fretboard, we might have durationMs.
        // We'll default to 'w' (whole) or 'q' if short?
        // For simplicity, let's try to map ms back to duration or just use 'w' to fill measure.
        // Or if we stored 'extends.duration', use that.
        let durationCode: Duration = 'q';
        if (ext.duration) {
            durationCode = ext.duration;
        } else if (ext.durationMs) {
            // Approximate? 
            if (ext.durationMs >= 2000) durationCode = 'w'; // > 2s roughly
            else if (ext.durationMs >= 1000) durationCode = 'h';
            else durationCode = 'q';
        }

        // Create the single "Chord Note"
        const note: NoteData = {
            id: generateId(),
            type: 'note',
            duration: durationCode,
            positions: [],
            decorators: ext.decorators || {},
            accidental: ext.accidental || 'none',
            technique: ext.technique,
            manualChord: ext.manualChord,
        };

        // Legacy barre restoration from nut removed. Barre information should be derived from positions.

        // Populate positions from fingers
        if (chord.fingers) { // Changed from chord.positions to chord.fingers
            chord.fingers.forEach(fingerPos => { // Iterating directly over StandardPosition
                note.positions.push({
                    finger: fingerPos.finger,
                    string: fingerPos.string,
                    fret: fingerPos.fret,
                    endString: fingerPos.endString, // Include endString for barre
                });
            });
        }

        // Handle empty/rest
        if (note.positions.length === 0) {
            note.type = 'rest';
            note.positions = [{ fret: 0, string: 1 }];
        }

        measure.notes.push(note);
        measures.push(measure);
    });

    return measures;
}


// --- Studio Import/Export ---
import { TimelineState, TimelineTrack, TimelineClip, ClipType } from "@/modules/chords/domain/types";


/**
 * Converts Studio Timeline to unified history.

 * We only export Chord tracks for now.
 */
export function studioToHistory(timeline: TimelineState, theme?: FretboardTheme): FullHistoryState {
    const history: ChordDiagramProps[] = [];

    // Flatten all chord clips from all chord tracks
    // Sort by start time to maintain sequence
    const allClips: TimelineClip[] = [];
    timeline.tracks.forEach(t => {
        if (t.type === 'chord' || t.name.toLowerCase().includes('chord')) {
            allClips.push(...t.clips);
        }
    });

    allClips.sort((a, b) => a.start - b.start);

    allClips.forEach(clip => {
        if (clip.type === 'chord') {
            const chordProp = { ...clip.chord };
            // Ensure extends exists
            if (!chordProp.extends) chordProp.extends = {};

            // Save duration in ms if not present
            if (!chordProp.extends.durationMs) {
                chordProp.extends.durationMs = clip.duration;
            }

            // If we don't have note duration ('q', 'w'), try to approximate or leave empty
            // logic to reverse-engineer 'q' from ms could go here if needed.

            history.push(chordProp);
        }
    });

    return {
        version: 1,
        chords: history,
        theme
    };
}

/**
 * Converts history to a new TimelineState for Studio.
 * This overwrites the existing state or creates a new one.
 */
export function historyToStudio(history: ChordDiagramProps[]): TimelineState {
    const trackId = generateId();
    const track: TimelineTrack = {
        id: trackId,
        name: 'Imported Chords',
        type: 'chord',
        clips: []
    };

    let currentTime = 0;
    const BPM = 120; // Default BPM for import if unknown
    const msPerBeat = 60000 / BPM;

    history.forEach(chord => {
        const clipId = generateId();
        let durationMs = 1000; // Default 1s

        if (chord.extends?.durationMs) {
            durationMs = chord.extends.durationMs;
        } else if (chord.extends?.duration) {
            // Convert 'q' etc to ms
            const val = getNoteDurationValue(chord.extends.duration, !!chord.extends.decorators?.dot);
            durationMs = val * msPerBeat;
        }

        const clip: TimelineClip = {
            id: clipId,
            start: currentTime,
            duration: durationMs,
            type: 'chord',
            chord: chord,
            finalChord: chord, // No transp yet
        } as any;
        // Force cast because TimelineClip union is strict, and I'm lazy to fully strictly type the union check here in this snippet, 
        // but clip is definitely a ChordClip structure.

        track.clips.push(clip);
        currentTime += durationMs;
    });

    return {
        tracks: [track],
        totalDuration: Math.max(currentTime, 10000), // Min 10s
        zoom: 100
    };
}

function createEmptyMeasure(): MeasureData {
    return {
        id: generateId(),
        isCollapsed: false,
        showClef: true,
        showTimeSig: true,
        notes: []
    };
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
