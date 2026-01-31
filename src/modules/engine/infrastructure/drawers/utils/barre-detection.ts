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

    // First, check if any single finger object is already marked as a barre
    const singleFingerBarre = detectBarreFromFinger(chord.fingers);
    if (singleFingerBarre) return singleFingerBarre;

    // Group fingers by (fret, finger) pair
    const candidates = new Map<string, { fret: number, finger: number | string, notes: StandardPosition[] }>();

    chord.fingers.forEach(f => {
        if (f.fret > 0) {
            // Key using finger ID, defaulting to 'implied' if 0/undefined
            const fingerKey = (f.finger && f.finger !== 0) ? f.finger : 'implied';
            const key = `${f.fret}-${fingerKey}`;

            if (!candidates.has(key)) {
                candidates.set(key, { fret: f.fret, finger: fingerKey === 'implied' ? 1 : f.finger!, notes: [] });
            }
            candidates.get(key)!.notes.push(f);
        }
    });

    let bestCandidate: BarreInfo | null = null;
    let maxScore = 0;

    candidates.forEach((cand) => {
        if (cand.notes.length >= 2) {
            const strings = cand.notes.map(f => f.string).sort((a, b) => a - b);
            const startString = strings[0];
            const endString = strings[strings.length - 1];
            const span = Math.abs(endString - startString);

            // Heuristic Validation:
            // If explicit finger (>0), basic check (len >= 2) is allowed (score prioritization handles best fit).
            // If IMPLIED finger (0/undefined), require WIDE SPAN (>= 4 strings) to avoid false positives (like A Major Open cluster).
            // Exception: If implied but explicitly marked as endString in input, allow it.

            const isExplicit = cand.finger !== 1 || (cand.notes.some(n => n.finger === 1)); // Heuristic: '1' comes from implied or explicit 1.
            // Actually, simply: if original notes had '0', we handle them as candidate with finger 1.

            const hasExplicitFinger = cand.notes.some(n => n.finger && Number(n.finger) > 0);

            if (!hasExplicitFinger && span < 3) { // Require span >= 3 (distance 3 means 4 strings involved? No, 6-1=5. 5-2=3. 4-2=2(A major)).
                // A Major: Str 2,3,4. Span = 4-2 = 2.
                // Barrier for implied: Span > 2 (i.e. 3 or more).
                // D Major: Str 1,2,3. Span = 3-1 = 2.
                return;
            }

            // Score based on span (primary) and note count (secondary)
            // Weight span higher to prefer wider barres
            const score = (span * 10) + cand.notes.length;

            if (score > maxScore) {
                maxScore = score;
                bestCandidate = {
                    fret: cand.fret,
                    finger: cand.finger,
                    startString: startString,
                    endString: endString
                };
            }
        }
    });

    return bestCandidate;
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
