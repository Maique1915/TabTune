import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";

/**
 * Detecta se há uma pestana (barre) em uma lista de posições de dedos.
 * Uma pestana é quando um dedo cobre múltiplas cordas no mesmo traste.
 * 
 * @param fingers Array de posições de dedos com fret, string e informações de fim
 * @returns Informações da pestana (fret, finger, startString, endString) ou null se não houver
 */
export function detectBarreFromFinger(fingers: StandardPosition[]): BarreInfo | null {
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxSpan = 0;

    fingers.forEach(f => {
        // Verifica se o dedo cobre múltiplas cordas (tem endString diferente de string)
        if (f.endString !== undefined && f.endString !== f.string) {
            const span = Math.abs(f.endString - f.string);
            if (span > maxSpan) {
                maxSpan = span;
                bestBarre = {
                    fret: f.fret,
                    finger: f.finger ?? 1,
                    startString: f.string,
                    endString: f.endString
                };
            }
        }
    });

    return bestBarre;
}

/**
 * Detecta pestana em um acorde ChordDiagramProps (estrutura com positions ou fingers).
 * Extrai as posições de dedos e usa detectBarreFromFinger() internamente.
 * 
 * @param chord Objeto ChordDiagramProps contendo fingers com fret, string e informações
 * @returns Informações da pestana ou null se não houver
 */
export function detectBarreFromChord(chord: ChordDiagramProps): BarreInfo | null {
    if (!chord.fingers || chord.fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxStrings = 1;

    // Agrupa dedos por fret para detectar barres por fret (múltiplas cordas)
    const fingersByFret: Map<number, StandardPosition[]> = new Map();

    chord.fingers.forEach(f => {
        if (f.fret > 0) {
            if (!fingersByFret.has(f.fret)) {
                fingersByFret.set(f.fret, []);
            }
            fingersByFret.get(f.fret)!.push(f);
        }
    });

    // Encontra o fret com mais dedos (candidato mais forte para pestana)
    fingersByFret.forEach((fingersAtFret, fret) => {
        if (fingersAtFret.length > maxStrings) {
            maxStrings = fingersAtFret.length;
            const strings = fingersAtFret.map(f => f.string).sort((a, b) => a - b);
            bestBarre = {
                fret: fret,
                finger: fingersAtFret[0].finger ?? 1,
                startString: strings[0],
                endString: strings[strings.length - 1]
            };
        }
    });

    return bestBarre;
}

/**
 * Wrapper para detectar barre de forma consistente.
 * Escolhe automaticamente entre detectBarreFromFinger ou detectBarreFromChord
 * baseado no tipo de entrada.
 * 
 * @param input Array de StandardPosition[] ou ChordDiagramProps
 * @returns Informações da pestana ou null
 */
export function detectBarre(input: StandardPosition[] | ChordDiagramProps): BarreInfo | null {
    if (Array.isArray(input)) {
        return detectBarreFromFinger(input);
    } else {
        return detectBarreFromChord(input);
    }
}
