/**
 * Interface para encapsular posição de labels (nomes de acordes, transposição, etc)
 */
export interface LabelPosition {
    x: number;
    y: number;
}

/**
 * Tipos de labels que podem ser posicionados
 */
export type LabelType = 'name' | 'transpose' | 'stringName';

/**
 * Geometria do fretboard necessária para calcular posições
 */
export interface GeometryContext {
    fretboardX: number;
    fretboardY: number;
    fretboardWidth: number;
    fretboardHeight: number;
    diagramX: number;
    diagramY: number;
    diagramHeight: number;
    realFretSpacing: number;
    scaleFactor: number;
}

/**
 * Calcula a posição do nome do acorde (no topo do diagrama)
 * Centralizado horizontalmente e acima do fretboard
 * 
 * @param context Geometria do fretboard
 * @returns Posição {x, y} para desenhar o nome
 */
export function calculateChordNamePosition(context: GeometryContext): LabelPosition {
    const centerX = context.diagramX + context.fretboardWidth / 2;
    const centerY = context.diagramY - (30 * context.scaleFactor);
    return { x: centerX, y: centerY };
}

/**
 * Calcula a posição do indicador de transposição (fret number à esquerda do fretboard)
 * Posicionado verticalmente no topo do diagrama, horizontal à esquerda
 * 
 * @param context Geometria do fretboard
 * @returns Posição {x, y} para desenhar o indicador de transposição
 */
export function calculateTransposeIndicatorPosition(context: GeometryContext): LabelPosition {
    const x = context.diagramX - (60 * context.scaleFactor);
    const y = context.diagramY + (30 * context.scaleFactor);
    return { x, y };
}

/**
 * Interface genérica para calcular posição de qualquer tipo de label
 * Retorna posição baseada no tipo de label e contexto de geometria
 * 
 * @param labelType Tipo do label: 'name', 'transpose', 'stringName'
 * @param context Geometria do fretboard
 * @returns Posição calculada {x, y}
 */
export function calculateLabelPosition(labelType: LabelType, context: GeometryContext): LabelPosition {
    switch (labelType) {
        case 'name':
            return calculateChordNamePosition(context);
        case 'transpose':
            return calculateTransposeIndicatorPosition(context);
        case 'stringName':
            // String names são renderizadas pelo FretboardDrawer, não aqui
            return { x: context.fretboardX, y: context.diagramY };
        default:
            return { x: context.diagramX, y: context.diagramY };
    }
}
