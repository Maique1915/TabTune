/**
 * Interface para contexto de desenho de cordas evitadas
 */
export interface AvoidedStringsContext {
    ctx: CanvasRenderingContext2D;
    fretboardX: number;
    fretboardY: number;
    fretboardHeight: number;
    horizontalPadding: number;
    stringSpacing: number;
    realFretSpacing: number;
    numStrings: number;
    scaleFactor: number;
    textColor: string;
    mirror?: boolean;
    rotation?: number;
}

/**
 * Calcula a posição X de uma corda na tela
 * Leva em conta padding horizontal e espaçamento das cordas
 * 
 * @param context Contexto de desenho
 * @param stringNum Número da corda (1-6 para guitarra)
 * @returns Posição X na tela
 */
export function calculateAvoidedStringX(context: AvoidedStringsContext, stringNum: number): number {
    return context.fretboardX + context.horizontalPadding + (context.numStrings - stringNum) * context.stringSpacing;
}

/**
 * Calcula a posição Y de uma corda evitada (abaixo do fretboard)
 * 
 * @param context Contexto de desenho
 * @returns Posição Y na tela
 */
export function calculateAvoidedStringY(context: AvoidedStringsContext): number {
    return context.fretboardY + context.fretboardHeight + context.realFretSpacing * 0.4;
}

/**
 * Desenha o símbolo "x" para uma corda evitada em uma posição específica
 * 
 * @param context Contexto de desenho
 * @param x Posição X
 * @param y Posição Y
 */
export function drawAvoidedStringMark(context: AvoidedStringsContext, x: number, y: number): void {
    context.ctx.save();
    context.ctx.translate(x, y);
    
    if (context.mirror) context.ctx.scale(-1, 1);
    if (context.rotation) context.ctx.rotate((-context.rotation * Math.PI) / 180);
    
    context.ctx.fillStyle = context.textColor;
    const fontSize = 45 * context.scaleFactor;
    context.ctx.font = `bold ${fontSize}px sans-serif`;
    context.ctx.textAlign = "center";
    context.ctx.textBaseline = "middle";
    context.ctx.fillText("x", 0, 0);
    
    context.ctx.restore();
}

/**
 * Renderiza todas as cordas evitadas de uma vez
 * Combinação de calculateAvoidedStringX/Y + drawAvoidedStringMark
 * 
 * @param context Contexto de desenho
 * @param avoidedStrings Array de números de cordas a evitar (ex: [2, 4])
 */
export function drawAvoidedStrings(context: AvoidedStringsContext, avoidedStrings: number[]): void {
    if (!avoidedStrings || avoidedStrings.length === 0) return;

    const y = calculateAvoidedStringY(context);

    avoidedStrings.forEach(stringNum => {
        const x = calculateAvoidedStringX(context, stringNum);
        drawAvoidedStringMark(context, x, y);
    });
}
