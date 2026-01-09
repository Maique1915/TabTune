export interface InstrumentPreset {
    id: string;
    name: string;
    tunings: string[][];
}

export const INSTRUMENTS: InstrumentPreset[] = [
    {
        id: "violao",
        name: "Violão / Guitarra (6 cordas)",
        tunings: [
            ["E", "A", "D", "G", "B", "e"],
            ["D", "A", "D", "G", "B", "e"],
            ["D", "A", "D", "G", "A", "D"],
            ["E", "B", "E", "G#", "B", "E"]
        ]
    },
    {
        id: "baixo-4",
        name: "Baixo (4 cordas)",
        tunings: [
            ["E", "A", "D", "G"],
            ["D", "A", "D", "G"],
            ["B", "E", "A", "D"]
        ]
    },
    {
        id: "baixo-5",
        name: "Baixo (5 cordas)",
        tunings: [
            ["B", "E", "A", "D", "G"],
            ["E", "A", "D", "G", "C"]
        ]
    },
    {
        id: "ukulele",
        name: "Ukulele",
        tunings: [
            ["G", "C", "E", "A"],
            ["A", "D", "F#", "B"]
        ]
    },
    {
        id: "cavaco",
        name: "Cavaquinho",
        tunings: [
            ["D", "G", "B", "D"],
            ["D", "G", "B", "E"]
        ]
    }
];
