
export interface TabData {
    fret: number;
    str: number;
}

export interface MusicalNote {
    id: string;
    keys: string[];
    duration: string;
    type: 'note' | 'rest';
    ticks: number;
    startTime: number;
    accidentals: (string | null)[];
    dots: number;
    tabData?: TabData[];
}

export interface MusicalMeasure {
    number: number;
    notes: MusicalNote[];
    clef: string;
    keySignature: string;
    timeSignature: {
        numerator: number;
        denominator: number;
    };
    totalTicks: number;
}

export interface ScoreData {
    title: string;
    composer: string;
    measures: MusicalMeasure[];
    tempo: number;
}
