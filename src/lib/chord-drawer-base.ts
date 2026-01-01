import { getNome } from "@/lib/chords";
import { FretboardDrawer } from "./fretboard-drawer";
import type { ChordDiagramColors } from "@/app/context/app--context";
import type { ChordDiagramProps, Position, BarreInfo } from "@/lib/types";
import { easeInOutQuad, withCanvasTransformAround, withCanvasTransformAtPoint } from "@/lib/animacao";

/**
 * Classe base para desenhar acordes de violão
 * Compartilha lógica e configurações entre diferentes tipos de animação
 */
export class ChordDrawerBase {
  // Atributos privados
  private _ctx: CanvasRenderingContext2D;
  private _colors: ChordDiagramColors;
  private _dimensions: { width: number; height: number };
  public fretboardDrawer: FretboardDrawer;

  // Cache para o braço do violão (sprite)
  private _fretboardCache: HTMLCanvasElement | null = null;
  // Flag to avoid drawing the fretboard on every frame after a transition ends
  private _skipFretboard: boolean = false;

  // Configurações do diagrama (valores base não escalados)

  // Configurações do diagrama (valores base não escalados)
  public static readonly BASE_WIDTH: number = 500;
  private _baseDiagramWidth: number = ChordDrawerBase.BASE_WIDTH;

  private _diagramHeight: number = 0;

  private _diagramX: number = 0;

  private _diagramY: number = 0;

  private _numStrings: number = 6;

  private _numFrets: number = 4;

  private _baseHorizontalPadding: number = 40;

  private _stringSpacing: number = 0;



  // Configurações do fretboard

  private _fretboardX: number = 0;

  private _fretboardY: number = 0;

  private _fretboardWidth: number = 0;

  private _fretboardHeight: number = 0;

  private _realFretSpacing: number = 0;



  // Configurações visuais (valores base não escalados)

  private _baseNeckRadius: number = 30;

  private _baseFingerRadius: number = 35;

  private _baseBarreWidth: number = 90;

  private _stringNamesY: number = 0;

  private _scaleFactor: number = 1;





  constructor(

    ctx: CanvasRenderingContext2D,

    colors: ChordDiagramColors,

    dimensions: { width: number; height: number },

    scaleFactor: number = 1

  ) {

    this._ctx = ctx;

    this._colors = colors;

    this._dimensions = dimensions;

    this._scaleFactor = scaleFactor;



    this._calculateDimensions();



    this.fretboardDrawer = new FretboardDrawer(ctx, colors, dimensions, {

      diagramWidth: this.diagramWidth,

      diagramHeight: this._diagramHeight,

      diagramX: this._diagramX,

      diagramY: this._diagramY,

      numStrings: this._numStrings,

      numFrets: this._numFrets,

      horizontalPadding: this.horizontalPadding,

      stringSpacing: this._stringSpacing,

      fretboardX: this._fretboardX,

      fretboardY: this._fretboardY,

      fretboardWidth: this._fretboardWidth,

      fretboardHeight: this._fretboardHeight,

      realFretSpacing: this._realFretSpacing,

      neckRadius: this.neckRadius,

      stringNamesY: this._stringNamesY,

    }, this._scaleFactor); // Pass scaleFactor here

  }

  // ============ GETTERS ============

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  get colors(): ChordDiagramColors {
    return this._colors;
  }

  get dimensions(): { width: number; height: number } {
    return this._dimensions;
  }

  get diagramWidth(): number {
    return this._baseDiagramWidth * this._scaleFactor;
  }

  get diagramHeight(): number {
    return this._diagramHeight;
  }

  get diagramX(): number {
    return this._diagramX;
  }

  get diagramY(): number {
    return this._diagramY;
  }

  get numStrings(): number {
    return this._numStrings;
  }

  get numFrets(): number {
    return this._numFrets;
  }

  get horizontalPadding(): number {
    return this._baseHorizontalPadding * this._scaleFactor;
  }

  get stringSpacing(): number {
    return this._stringSpacing;
  }

  get fretboardX(): number {
    return this._fretboardX;
  }

  get fretboardY(): number {
    return this._fretboardY;
  }

  get fretboardWidth(): number {
    return this._fretboardWidth;
  }

  get fretboardHeight(): number {
    return this._fretboardHeight;
  }

  get realFretSpacing(): number {
    return this._realFretSpacing;
  }

  get neckRadius(): number {
    return this._baseNeckRadius * this._scaleFactor;
  }

  get fingerRadius(): number {
    return this._baseFingerRadius * this._scaleFactor;
  }

  get barreWidth(): number {
    return this._baseBarreWidth * this._scaleFactor;
  }

  // ============ SETTERS ============

  public setCtx(value: CanvasRenderingContext2D) {
    this._ctx = value;
    this.fretboardDrawer.setCtx(value);
    // Não precisa invalidar cache se mudar apenas contexto de destino, 
    // mas se for resize/cor sim.
  }

  public setColors(value: ChordDiagramColors) {
    this._colors = value;
    this.fretboardDrawer.setColors(value);
    this._fretboardCache = null; // Invalidate cache
  }

  public setDimensions(value: { width: number; height: number }) {
    this._dimensions = value;
    this._calculateDimensions();
    this.fretboardDrawer.setDimensions(value);
    this._fretboardCache = null; // Invalidate cache
  }

  set scaleFactor(value: number) {
    this._scaleFactor = value;
    this._calculateDimensions(); // Recalculate everything based on new scale
    this._fretboardCache = null; // Invalidate cache
  }

  // ============ MÉTODOS UTILITÁRIOS ============

  // Easing centralizado em `src/lib/animacao.ts`.

  /**
   * Calcula todas as dimensões baseadas nos atributos atuais
   */
  private _calculateDimensions(): void {
    const scaledDiagramWidth = this._baseDiagramWidth * this._scaleFactor;
    const scaledHorizontalPadding = this._baseHorizontalPadding * this._scaleFactor;

    this._diagramHeight = scaledDiagramWidth + (scaledDiagramWidth * 2 / 5);

    // Center the diagram horizontally and vertically
    this._diagramX = (this._dimensions.width / 2) - (scaledDiagramWidth / 2);
    this._diagramY = (this._dimensions.height / 2) - (this._diagramHeight / 2);

    const stringAreaWidth = scaledDiagramWidth - (scaledHorizontalPadding * 2);
    this._stringSpacing = stringAreaWidth / (this._numStrings - 1);

    this._fretboardX = this._diagramX;
    this._fretboardY = this._diagramY + (75 * this._scaleFactor);
    this._fretboardWidth = scaledDiagramWidth;
    this._fretboardHeight = this._diagramHeight - (75 * this._scaleFactor);
    this._realFretSpacing = this._fretboardHeight / (1 + this._numFrets);

    this._stringNamesY = this._diagramY + (40 * this._scaleFactor);
  }

  /**
   * Recalcula dimensões com offset X (usado no carousel)
   */
  calculateWithOffset(offsetX: number): void {
    // Update dimensions that depend on scale/width first
    this._diagramHeight = this.diagramWidth + (this.diagramWidth * 2 / 5);
    this._fretboardHeight = this._diagramHeight - (75 * this._scaleFactor);
    this._realFretSpacing = this._fretboardHeight / (1 + this._numFrets);

    // Calculate centered X and Y positions
    this._diagramX = (this._dimensions.width / 2) - (this.diagramWidth / 2) + offsetX;
    this._diagramY = (this._dimensions.height / 2) - (this.diagramHeight / 2);

    // Update dependent positions in this class
    this._fretboardX = this._diagramX;
    this._fretboardY = this._diagramY + (75 * this._scaleFactor);
    this._stringNamesY = this._diagramY + (40 * this._scaleFactor);

    // Propagate position changes to the fretboard drawer
    this.fretboardDrawer.setDiagramX(this._diagramX);
    this.fretboardDrawer.setDiagramY(this._diagramY);

    // Invalidate cache only if offset actually changes render (usually it does for full sprite)
    // Note: If we cached *only* the fretboard relative to itself, we wouldn't need to invalidate on offset.
    // But typically we cache the whole stage or the fretboard bounding box.
    // For simplicity, let's invalidate or ensure draw uses offset correctly.
    // Ideally, we cache the fretboard 'image' at (0,0) and draw it at (x,y).
    // So changing X/Y shouldn't invalidate cache, just where we draw it.
    // BUT FretboardDrawer uses absolute coordinates internally?
    // Let's check: fretboardDrawer accepts diagramX/Y. So yes, it bakes coordinates.
    // So we MUST invalidate cache if X/Y changes OR change FretboardDrawer to draw at 0,0 and translate.
    // For now, easiest optimization is invalidate.
    // Invalidate cache ONLY if dimensions/scale act in a way that changes the intrinsic look.
    // Translation (X/Y) does NOT invalidate cache anymore because we draw the cached sprite at dynamic X/Y.
    // this._fretboardCache = null; 
  }

  /**
   * Aplica centralização no canvas
   * Retorna para onde o contexto foi centralizado
   * NOTA: Agora que _diagramX e _diagramY já estão centralizados, não precisamos translate adicional
   */
  applyCentering(): { x: number; y: number } {
    // Não aplica translate pois as coordenadas já estão centralizadas
    return { x: 0, y: 0 };
  }

  /**
   * Remove a centralização aplicada
   */
  removeCentering(offset: { x: number; y: number }): void {
    this._ctx.translate(-offset.x, -offset.y);
  }



  /**
   * Converte HEX para RGBA
   */
  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Wrappers de transform centralizados em `src/lib/animacao.ts`.

  /**
   * Helper para desenhar texto com transformações de animação
   */
  private _drawTextWithTransform(
    text: string,
    offsetX: number,
    alpha: number,
    scale: number,
    translateY: number, // This is the offset that needs to be applied after scaling
    centerX: number,
    centerY: number
  ): void {
    this._ctx.save();
    this._ctx.globalAlpha = alpha;
    this._ctx.translate(centerX, centerY); // Move origin to centerX, centerY
    this._ctx.scale(scale, scale); // Scale around this new origin
    this._ctx.translate(-centerX, -centerY); // Move origin back
    // Now apply the translateY as a final translation offset
    this._ctx.translate(0, translateY);
    this.drawChordName(text, offsetX);
    this._ctx.restore();
  }



  // ============ MÉTODOS DE DESENHO ============

  /**
   * Internal helper to draw a finger (circle) or barre (rectangle) and its finger number.
   */
  private _drawShapeAndFingerNumber(
    centerX: number,
    centerY: number,
    finger: number,
    isBarre: boolean,
    barreVisualWidth: number // The actual drawn width of the barre (fromX to toX)
  ): void {
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.beginPath();

    if (isBarre) {
      // Draw rectangle for barre
      this._ctx.roundRect(
        centerX - barreVisualWidth / 2, // x
        centerY - (this.barreWidth / 2), // y
        barreVisualWidth,
        this.barreWidth,
        this.neckRadius * 2
      );
    } else {
      // Draw circle for individual finger
      this._ctx.arc(centerX, centerY, this.fingerRadius, 0, Math.PI * 2);
    }
    this._ctx.fill();

    // Borda
    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    // Número do dedo
    if (finger > 0) {
      this._ctx.fillStyle = this._colors.fingerTextColor;
      const fontSize = 45 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
      this._ctx.fillText(String(finger), centerX, centerY);
    }
  }

  /**
   * Internal helper to draw a finger (circle) or barre (rectangle) and its finger number
   * relative to (0,0) for animated contexts.
   */
  private _drawAnimatedShapeAndFingerNumber(
    finger: number,
    isBarre: boolean,
    barreVisualWidth: number // The actual drawn width of the barre (fromX to toX)
  ): void {
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.beginPath();

    if (isBarre) {
      this._ctx.roundRect(
        -barreVisualWidth / 2, // x
        -(this.barreWidth / 2), // y
        barreVisualWidth,
        this.barreWidth,
        this.neckRadius * 2
      );
    } else {
      this._ctx.arc(0, 0, this.fingerRadius, 0, Math.PI * 2);
    }
    this._ctx.fill();

    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    if (finger > 0) {
      this._ctx.fillStyle = this._colors.fingerTextColor;
      const fontSize = 45 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
      this._ctx.fillText(String(finger), 0, 0);
    }
  }

  /**
   * Draws a barre shape at the current transformed (0,0) for animated contexts.
   * @param finger The finger number.
   * @param barreVisualWidth The actual drawn width of the barre.
   */
  private _drawBarreShapeAtPosition(finger: number, barreVisualWidth: number): void {
    this._drawAnimatedShapeAndFingerNumber(finger, true, barreVisualWidth);
  }

  /**
   * Detects the primary barre in a chord, prioritizing explicit `nut` properties.
   */
  private _detectBarre(chord: ChordDiagramProps): BarreInfo | null {
    const { positions, nut } = chord;

    // 1. Prioritize explicit barre from `nut` property
    if (nut && nut.vis && nut.pos > 0) {
      const [fromString, toString] = nut.str || [0, 0];
      if (toString > fromString) { // A barre must span at least two strings
        return {
          fret: nut.pos,
          finger: nut.fin,
          fromString: fromString,
          toString: toString,
        };
      }
    }

    // 2. If no explicit `nut` barre, detect implicitly from `positions`
    const fingerCounts: { [key: string]: number[] } = {}; // key: "fret-finger", value: [stringIndices]
    (Object.entries(positions) as Array<[string, [number, number, any]]>).forEach(([str, [fret, finger]]) => {
      if (fret > 0 && finger > 0) {
        const key = `${fret}-${finger}`;
        if (!fingerCounts[key]) {
          fingerCounts[key] = [];
        }
        fingerCounts[key].push(Number(str));
      }
    });

    let bestBarre: BarreInfo | null = null;
    let maxStrings = 1; // A barre must have at least 2 strings

    for (const key in fingerCounts) {
      const strings = fingerCounts[key];
      if (strings.length > maxStrings) {
        const [fret, finger] = key.split('-').map(Number);
        const fromString = Math.min(...strings);
        const toString = Math.max(...strings);

        maxStrings = strings.length;
        bestBarre = { fret, finger, fromString, toString };
      }
    }

    return bestBarre;
  }

  /**
   * Limpa o canvas
   */
  clearCanvas(): void {
    this._ctx.fillStyle = this._colors.cardColor;
    this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
  }

  /**
   * Alias para clearCanvas para compatibilidade
   */
  clear(): void {
    this.clearCanvas();
  }

  /**
   * Desenha o nome do acorde
   */
  drawChordName(chordName: string, offsetX: number = 0): void {
    this._ctx.fillStyle = this._colors.chordNameColor;
    const fontSize = 75 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    const nameX = this.diagramX + this.diagramWidth / 2;
    const nameY = this.diagramY - (75 * this._scaleFactor);
    this._ctx.fillText(chordName, nameX, nameY);
  }

  /**
   * Draws either a single finger (circle) or a barre (rectangle).
   * If fromStringIndex === toStringIndex, it draws a single finger.
   * Otherwise, it draws a barre.
   * @param fret The fret number (1-based).
   * @param finger The finger number (1-based), or 0 for open string.
   * @param fromStringIndex The 0-based index of the starting string (inclusive).
   * @param toStringIndex The 0-based index of the ending string (inclusive).
   */
  drawFretPosition(
    fret: number,
    finger: number,
    fromStringIndex: number,
    toStringIndex: number
  ): void {
    const fretY = this.fretboardY + (fret - 0.5) * this.realFretSpacing;

    const isBarre = fromStringIndex !== toStringIndex;

    let centerX: number;
    let barreVisualWidth: number = 0; // Only used if isBarre is true

    if (isBarre) {
      let fromX = this.fretboardX + this.horizontalPadding + fromStringIndex * this.stringSpacing;
      let toX = this.fretboardX + this.horizontalPadding + toStringIndex * this.stringSpacing;

      fromX -= this.fingerRadius;
      toX += this.fingerRadius;

      barreVisualWidth = toX - fromX;
      centerX = fromX + barreVisualWidth / 2;
    } else {
      // Single finger
      centerX = this.fretboardX + this.horizontalPadding + fromStringIndex * this.stringSpacing;
    }

    this._drawShapeAndFingerNumber(centerX, fretY, finger, isBarre, barreVisualWidth);
  }

  /**
   * Atualiza o cache do fretboard desenhando-o em um canvas offscreen
   */
  /**
   * Atualiza o cache do fretboard desenhando-o em um canvas offscreen
   * O cache agora é gerado em posição "neutra" (local 0,0) para ser reutilizado em qualquer posição X/Y.
   */
  private _updateFretboardCache(): void {
    if (typeof document === 'undefined') return;

    if (!this._fretboardCache) {
      this._fretboardCache = document.createElement('canvas');
      console.log("❄️ Creating Fretboard Sprite Cache (Static Fingers behavior check)");
    }

    // Margem de segurança para sombras/bordas
    const margin = 10 * this._scaleFactor;
    const width = this._fretboardWidth + (this.horizontalPadding * 2);
    const height = this._diagramHeight; // Altura total do diagrama para incluir nomes das cordas no topo

    // Redimensiona se necessário
    if (this._fretboardCache.width !== width || this._fretboardCache.height !== height) {
      this._fretboardCache.width = width;
      this._fretboardCache.height = height;
    }

    const cacheCtx = this._fretboardCache.getContext('2d');
    if (!cacheCtx) return;

    // Limpa o cache
    cacheCtx.clearRect(0, 0, width, height);

    // Salva estado original do drawer
    const originalCtx = this._ctx;

    // Configura o drawer para desenhar no cache nas coordenadas locais (0,0)
    // O fretboard deve começar no X=0 (com padding interno) e Y relativo aos nomes das cordas
    // DiagramX local = 0
    // DiagramY local = 0
    this.fretboardDrawer.setCtx(cacheCtx);

    // Armazena valores originais para restaurar depois
    const originalDx = this.diagramX;
    const originalDy = this.diagramY;

    // Seta posições locais para o render
    this.fretboardDrawer.setDiagramX(0);
    this.fretboardDrawer.setDiagramY(0);

    this.fretboardDrawer.drawFretboard();

    // Restaura coordenadas e contexto originais
    this.fretboardDrawer.setDiagramX(originalDx);
    this.fretboardDrawer.setDiagramY(originalDy);
    this.fretboardDrawer.setCtx(originalCtx);
  }

  /**
   * Limpa recursos e caches
   */
  public dispose(): void {
    this._fretboardCache = null;
    // We don't nullify ctx because it's passed from outside (the main canvas),
    // but clearing the internal sprite canvas releases that specific memory.
  }

  /**
   * Desenha o fretboard completo (delegado para FretboardDrawer)
   * Usa cache se disponível
   */
  drawFretboard(): void {
    if (!this._fretboardCache) {
      this._updateFretboardCache();
    }

    if (this._fretboardCache) {
      // Desenha o cache na posição atual
      // O cache foi gerado assumindo diagramX=0, diagramY=0. 
      // Então desenhamos em this.diagramX, this.diagramY.
      this._ctx.drawImage(this._fretboardCache, this.diagramX, this.diagramY);
    } else {
      // Fallback
      this.fretboardDrawer.drawFretboard();
    }
  }

  /**
   * Desenha todos os dedos de um acorde
   */
  drawFingers(positions: Position, barreInfo: BarreInfo | null = null): void {
    (Object.entries(positions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      const stringIndex = Number(key); // stringIndex is 1-based here

      // Don't draw if finger is 0 (open string, not pressed) or -1 (muted)
      if (fret > 0 && finger > 0) {
        // Check if this finger is part of the barre AND it's the same finger as the barre
        if (
          barreInfo &&
          fret === barreInfo.fret &&
          finger === barreInfo.finger &&
          stringIndex >= barreInfo.fromString &&
          stringIndex <= barreInfo.toString
        ) {
          // This finger is covered by the barre, so don't draw it individually
          return;
        }
        this.drawFretPosition(fret, finger, stringIndex - 1, stringIndex - 1);
      }
    });
  }

  /**
   * Desenha X nas cordas evitadas
   */
  drawAvoidedStrings(avoid: number[] | undefined): void {
    if (!avoid) return;

    const fontSize = 45 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    for (let i = 0; i < this._numStrings; i++) {
      const stringNumber = i + 1;
      if (avoid.includes(stringNumber)) {
        const y = this.diagramY + this.diagramHeight + (this.realFretSpacing * 0.4 * this._scaleFactor);
        const x = this.fretboardX + this.horizontalPadding + i * this.stringSpacing;
        this._ctx.fillStyle = this._colors.textColor;
        this._ctx.fillText("x", x, y);
      }
    }
  }

  /**
   * Desenha indicador de transposição (casa)
   */
  drawTransposeIndicator(transportDisplay: number): void {
    if (transportDisplay <= 1) return;

    const x = this.fretboardX - this.realFretSpacing;
    const y = this.fretboardY + (this.realFretSpacing / 2);

    this._ctx.save();
    this._ctx.translate(x, y);
    this._drawTransposeIndicatorTextAtOrigin(transportDisplay);
    this._ctx.restore();
  }

  private _drawTransposeIndicatorTextAtOrigin(transportDisplay: number): void {
    this._ctx.fillStyle = this._colors.textColor;
    const fontSize = 60 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(`${transportDisplay}ª`, 0, 0);
  }

  /**
   * Desenha um dedo individual em uma posição específica, com opacidade e escala (para animações)
   * Espera que o contexto já esteja transladado e escalado.
   */
  drawFingerAtPosition(fingerNumber: number): void {
    this._drawAnimatedShapeAndFingerNumber(fingerNumber, false, 0);
  }

  /**
   * Calcula as fases de animação de build-in
   * Retorna um objeto com o progresso de cada fase (0-1)
   */
  calculateAnimationPhases(progress: number): {
    chordName: number;
    neck: number;
    stringNames: number;
    strings: number;
    frets: number;
    nut: number;
    fingers: number;
    avoided: number;
    transpose: number;
  } {
    return {
      // Fase 1 (0-0.1): Nome do acorde fade in
      chordName: easeInOutQuad(Math.min(progress / 0.1, 1)),

      // Fase 2 (0.1-0.3): Braço do violão
      neck: easeInOutQuad(Math.max(0, Math.min((progress - 0.1) / 0.2, 1))),

      // Fase 3 (0.3-0.4): Nomes das cordas
      stringNames: easeInOutQuad(Math.max(0, Math.min((progress - 0.3) / 0.1, 1))),

      // Fase 4 (0.4-0.5): Cordas
      strings: easeInOutQuad(Math.max(0, Math.min((progress - 0.4) / 0.1, 1))),

      // Fase 5 (0.5-0.65): Trastes (um por um)
      frets: easeInOutQuad(Math.max(0, Math.min((progress - 0.5) / 0.15, 1))),

      // Fase 6 (0.65-0.75): Pestana
      nut: easeInOutQuad(Math.max(0, Math.min((progress - 0.65) / 0.1, 1))),

      // Fase 7 (0.75-0.9): Dedos
      fingers: easeInOutQuad(Math.max(0, Math.min((progress - 0.75) / 0.15, 1))),

      // Fase 8 (0.9-0.95): Cordas evitadas
      avoided: easeInOutQuad(Math.max(0, Math.min((progress - 0.9) / 0.05, 1))),

      // Fase 9 (0.95-1.0): Indicador de transposição
      transpose: easeInOutQuad(Math.max(0, Math.min((progress - 0.95) / 0.05, 1))),
    };
  }

  /**
   * Helper to find min and max non-zero frets
   */
  private _findMinNonZeroNote(positions: Position, avoid: number[], nut?: any): [number, number] {
    let min = Infinity;
    let max = 0;

    if (nut && nut.vis) {
      min = nut.pos;
    }

    Object.entries(positions).forEach(([str, val]) => {
      const [fret] = val as any; // Cast safely
      const stringNumber = parseInt(str);
      // Ensure we don't count discouraged strings if needed, though original logic just checks avoid array
      // But 'avoid' array in props logic was separate. Here checking fret > 0 is key.
      if (fret > 0 && (!avoid || !avoid.includes(stringNumber))) {
        if (fret < min) {
          min = fret;
        }
        if (fret > max) {
          max = fret;
        }
      }
    });

    return [min === Infinity ? 0 : min, max];
  }

  /**
   * Transposes the chord data to fit within available frets if necessary.
   * Logic ported from chord-diagram.tsx
   */
  private _transposeForDisplay(chord: ChordDiagramProps, currentTransport: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
    const { positions, nut, avoid } = chord;
    const [minFret, maxFret] = this._findMinNonZeroNote(positions, avoid || [], nut);

    // If fits in 5 frets and doesn't explicitly start high with a nut, keep as is
    if (maxFret <= 5 && (!nut || !nut.vis || nut.pos <= 5)) {
      return { finalChord: chord, transportDisplay: currentTransport };
    }

    const transposition = (nut && nut.vis) ? nut.pos - 1 : minFret > 0 ? minFret - 1 : 0;

    const newPositions: Position = {};
    for (const string in positions) {
      const val = positions[string];
      const [fret, finger, add] = val as [number, number, any];
      newPositions[string] = [fret > 0 ? fret - transposition : 0, finger, add];
    }

    const newNut = nut && nut.vis ? { ...nut, pos: nut.pos - transposition } : nut;

    return {
      finalChord: {
        ...chord,
        positions: newPositions,
        nut: newNut
      },
      transportDisplay: transposition + 1
    };
  }

  /**
   * Desenha um acorde completo
   */
  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
    const { finalChord, transportDisplay } = this._transposeForDisplay(inputChord, inputTransportDisplay);

    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");
    const barreInfo = this._detectBarre(finalChord);

    this.drawChordName(chordName, offsetX);

    if (!options.skipFretboard) {
      // Reset flag for static draw
      this._skipFretboard = false;
      this.drawFretboard();
    }

    if (
      barreInfo &&
      typeof barreInfo.fromString === "number" &&
      typeof barreInfo.toString === "number"
    ) {
      this.drawFretPosition(
        barreInfo.fret,
        barreInfo.finger ?? 1,
        barreInfo.fromString - 1,
        barreInfo.toString - 1
      );
    }

    this.drawFingers(finalChord.positions, barreInfo);
    this.drawAvoidedStrings(finalChord.avoid);
    this.drawTransposeIndicator(transportDisplay);
  }

  /**
   * Desenha um acorde completo com animação build-in (progressiva)
   * @param chord - Acorde a ser desenhado
   * @param progress - Progresso da animação (0-1)
   * @param offsetX - Deslocamento horizontal
   */
  drawChordWithBuildAnimation(inputChord: ChordDiagramProps, inputTransportDisplay: number, progress: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
    const { finalChord, transportDisplay } = this._transposeForDisplay(inputChord, inputTransportDisplay);

    console.log("Chord animation started (build-in):", finalChord);
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }
    // Reset flag for build animation
    this._skipFretboard = false;

    const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");
    const phases = this.calculateAnimationPhases(progress);
    const barreInfo = this._detectBarre(finalChord);


    // Fase 1: Nome do acorde
    if (phases.chordName > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.chordName;
      const translateY = (1 - phases.chordName) * -20; // Slide in from top
      this._ctx.translate(0, translateY);
      this.drawChordName(chordName, offsetX);
      this._ctx.restore();
    }

    // Fase 2-6: Fretboard (neck, stringNames, strings, frets, nut)
    // Only draw if NOT skipping fretboard
    if (!options.skipFretboard && phases.neck > 0) {
      this.fretboardDrawer.drawAnimatedFretboard({
        neckProgress: phases.neck,
        stringNamesProgress: phases.stringNames,
        stringsProgress: phases.strings,
        fretsProgress: phases.frets,
        nutProgress: phases.nut,
      });
    }

    // Fase 6: Pestana (barre)
    if (phases.nut > 0 && barreInfo) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.nut;

      const fretY = this.fretboardY + (barreInfo.fret - 0.5) * this.realFretSpacing;
      let fromX = this.fretboardX + this.horizontalPadding + (barreInfo.fromString - 1) * this.stringSpacing;
      let toX = this.fretboardX + this.horizontalPadding + (barreInfo.toString - 1) * this.stringSpacing;
      fromX -= this.fingerRadius;
      toX += this.fingerRadius;
      const barreActualWidth = toX - fromX;
      const centerX = fromX + barreActualWidth / 2;

      this._ctx.translate(centerX, fretY); // Move origin to barre center
      this._drawBarreShapeAtPosition(barreInfo.finger ?? 1, barreActualWidth);
      this._ctx.restore();
    }

    // Fase 7: Dedos com zoom in
    if (phases.fingers > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.fingers;
      const scale = 0.5 + (phases.fingers * 0.5); // Start at 0.5, grow to 1

      (Object.entries(finalChord.positions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, fingerNumber]]) => {
        const stringIndex = Number(key); // 1-based string index
        if (fret > 0 && fingerNumber > 0) {
          // Check if this finger is part of the barre, don't draw individually if it is
          if (
            barreInfo &&
            fret === barreInfo.fret &&
            fingerNumber === barreInfo.finger &&
            stringIndex >= barreInfo.fromString &&
            stringIndex <= barreInfo.toString
          ) {
            return;
          }

          const x = this._fretboardX + this.horizontalPadding + (stringIndex - 1) * this._stringSpacing;
          const y = this._fretboardY + (fret - 0.5) * this._realFretSpacing;

          this._ctx.save();
          this._ctx.translate(x, y);
          this._ctx.scale(scale, scale);
          this.drawFingerAtPosition(fingerNumber);
          this._ctx.restore();
        }
      });
      this._ctx.restore();
    }

    // Fase 8: Cordas evitadas com zoom in
    if (phases.avoided > 0 && finalChord.avoid) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.avoided;
      const scale = 0.5 + (phases.avoided * 0.5); // Start at 0.5, grow to 1

      for (let i = 0; i < this._numStrings; i++) {
        const stringNumber = i + 1;
        if (finalChord.avoid.includes(stringNumber)) {
          const y = this._diagramY + this._diagramHeight + this._realFretSpacing * 0.4;
          const x = this._fretboardX + this.horizontalPadding + i * this._stringSpacing;

          this._ctx.save();
          this._ctx.translate(x, y);
          this._ctx.scale(scale, scale);
          this._ctx.fillStyle = this._colors.textColor;
          const fontSize = 45 * this._scaleFactor;
          this._ctx.font = `bold ${fontSize}px sans-serif`;
          this._ctx.textAlign = "center";
          this._ctx.textBaseline = "middle";
          this._ctx.fillText("x", 0, 0);
          this._ctx.restore();
        }
      }
      this._ctx.restore();
    }

    // Fase 9: Indicador de transposição com fade e slide
    if (phases.transpose > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.transpose;
      const translateX = (1 - phases.transpose) * -30; // Slide in from left
      this._ctx.translate(translateX, 0);
      this.drawTransposeIndicator(transportDisplay);
      this._ctx.restore();
    }

  }


  /**
   * Desenha um acorde completo com animação de transição de outro acorde
   * @param currentChord - Acorde atual
   * @param nextChord - Próximo acorde
   * @param progress - Progresso da transição (0-1)
   * @param offsetX - Deslocamento horizontal
   */
  drawChordWithTransition(
    currentFinalChord: ChordDiagramProps,
    currentTransportDisplay: number,
    nextFinalChord: ChordDiagramProps,
    nextTransportDisplay: number,
    originalProgress: number,
    offsetX: number = 0,
    options: { skipFretboard?: boolean } = {}
  ): void {
    console.log("Chord animation started (transition - current):", currentFinalChord);
    console.log("Chord animation started (transition - next):", nextFinalChord);
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    // Ensure fretboard will be drawn for this transition
    this._skipFretboard = false;
    const current = currentFinalChord; // Use directly
    const next = nextFinalChord;       // Use directly
    const currentTransport = currentTransportDisplay; // Use directly
    const nextTransport = nextTransportDisplay;       // Use directly

    const currentBarreInfo = this._detectBarre(current);
    const nextBarreInfo = this._detectBarre(next);

    const currentName = getNome(current.chord).replace(/#/g, "♯").replace(/b/g, "♭");
    const nextName = getNome(next.chord).replace(/#/g, "♯").replace(/b/g, "♭");

    const easedProgress = easeInOutQuad(originalProgress);

    const centerX = this.diagramX + this.diagramWidth / 2;
    const centerY = this.diagramY / 2; // Roughly center Y for chord name

    // Nome do acorde: zoom out do antigo e zoom in do novo
    const scaleOut = 1 - (easedProgress * 0.2); // 1 -> 0.8
    const currentNameTranslateY = -easedProgress * (20 * this._scaleFactor); // Move up, scaled
    this._drawTextWithTransform(
      currentName,
      offsetX,
      1 - easedProgress,
      scaleOut,
      currentNameTranslateY,
      centerX,
      centerY
    );

    const scaleIn = 0.8 + (easedProgress * 0.2); // 0.8 -> 1 (start smaller and grow)
    const nextNameTranslateY = (1 - easedProgress) * (20 * this._scaleFactor); // Move down, scaled
    this._drawTextWithTransform(
      nextName,
      offsetX,
      easedProgress,
      scaleIn,
      nextNameTranslateY,
      centerX,
      centerY
    );

    // Fretboard drawing – skip if flag is set OR options.skipFretboard is true
    if (!this._skipFretboard && !options.skipFretboard) {
      this.drawFretboard();
    }
    // When transition finishes, set flag to skip further fretboard draws for this chord
    if (originalProgress >= 1) {
      this._skipFretboard = true;
    }

    // Pestana: zoom in/out ou interpolação
    this.drawBarreWithTransition(currentBarreInfo, nextBarreInfo, originalProgress);

    // Dedos: transição de posição com zoom in/out
    this.drawFingersWithTransition(current.positions, next.positions, currentBarreInfo, nextBarreInfo, originalProgress);

    // Cordas evitadas: zoom in/out
    this.drawAvoidedStringsWithTransition(current.avoid, next.avoid, originalProgress);

    // Indicador de transposição: zoom in/out
    this.drawTransposeIndicatorWithTransition(currentTransport, nextTransport, originalProgress);
  }

  /**
   * Desenha pestana com transição
   */
  private drawBarreWithTransition(
    currentBarre: BarreInfo | null,
    nextBarre: BarreInfo | null,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    if (!currentBarre && !nextBarre) return;

    if (currentBarre && nextBarre) {
      const fret = currentBarre.fret + (nextBarre.fret - currentBarre.fret) * progress;
      const fromString = currentBarre.fromString + (nextBarre.fromString - currentBarre.fromString) * progress;
      const toString = currentBarre.toString + (nextBarre.toString - currentBarre.toString) * progress;
      // Interpolate finger
      const finger = Math.round((currentBarre.finger ?? 1) + ((nextBarre.finger ?? 1) - (currentBarre.finger ?? 1)) * progress);

      const fretY = this.fretboardY + (fret - 0.5) * this.realFretSpacing;
      let fromX = this.fretboardX + this.horizontalPadding + (fromString - 1) * this.stringSpacing;
      let toX = this.fretboardX + this.horizontalPadding + (toString - 1) * this.stringSpacing;
      fromX -= this.fingerRadius;
      toX += this.fingerRadius;
      const barreActualWidth = toX - fromX;
      const centerX = fromX + barreActualWidth / 2;

      this._ctx.save();
      this._ctx.translate(centerX, fretY);
      this._drawBarreShapeAtPosition(finger, barreActualWidth);
      this._ctx.restore();
    } else if (currentBarre && !nextBarre) {
      // Pestana desaparece - zoom out
      const scale = 1 + (progress * 0.5); // 1 -> 1.5
      const y = this._fretboardY + (currentBarre.fret - 0.5) * this._realFretSpacing;

      const fromStringIndex = currentBarre.fromString - 1;
      const toStringIndex = currentBarre.toString - 1;
      const fromX = this._fretboardX + this.horizontalPadding + fromStringIndex * this._stringSpacing;
      const toX = this._fretboardX + this.horizontalPadding + toStringIndex * this._stringSpacing;
      const centerX = fromX + (toX - fromX) / 2;

      withCanvasTransformAround(
        this._ctx,
        { centerX, centerY: y, opacity: 1 - progress, scale },
        () => {
          let fromX = this.fretboardX + this.horizontalPadding + (currentBarre.fromString - 1) * this.stringSpacing;
          let toX = this.fretboardX + this.horizontalPadding + (currentBarre.toString - 1) * this.stringSpacing;
          fromX -= this.fingerRadius;
          toX += this.fingerRadius;
          const barreActualWidth = toX - fromX;
          this._drawBarreShapeAtPosition(currentBarre.finger ?? 1, barreActualWidth);
        }
      );
    } else if (!currentBarre && nextBarre) {
      // Pestana aparece - zoom in
      const scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      const y = this._fretboardY + (nextBarre.fret - 0.5) * this._realFretSpacing;

      const fromStringIndex = nextBarre.fromString - 1;
      const toStringIndex = nextBarre.toString - 1;
      const fromX = this._fretboardX + this.horizontalPadding + fromStringIndex * this._stringSpacing;
      const toX = this._fretboardX + this.horizontalPadding + toStringIndex * this._stringSpacing;
      const centerX = fromX + (toX - fromX) / 2;

      withCanvasTransformAround(
        this._ctx,
        { centerX, centerY: y, opacity: progress, scale },
        () => {
          let fromX = this.fretboardX + this.horizontalPadding + (nextBarre.fromString - 1) * this.stringSpacing;
          let toX = this.fretboardX + this.horizontalPadding + (nextBarre.toString - 1) * this.stringSpacing;
          fromX -= this.fingerRadius;
          toX += this.fingerRadius;
          const barreActualWidth = toX - fromX;
          this._drawBarreShapeAtPosition(nextBarre.finger ?? 1, barreActualWidth);
        }
      );
    }
  }

  /**
   * Desenha dedos com transição de posição
   */
  private drawFingersWithTransition(
    currentPositions: Position,
    nextPositions: Position,
    currentBarreInfo: BarreInfo | null,
    nextBarreInfo: BarreInfo | null,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    // Mapear dedos por número
    const currentFingers = new Map<number, { string: number; fret: number }>();
    const nextFingers = new Map<number, { string: number; fret: number }>();

    (Object.entries(currentPositions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      const stringIndex = Number(key);
      if (
        currentBarreInfo &&
        fret === currentBarreInfo.fret &&
        finger === currentBarreInfo.finger &&
        stringIndex >= currentBarreInfo.fromString &&
        stringIndex <= currentBarreInfo.toString
      ) {
        return;
      }

      if (fret > 0 && finger) {
        currentFingers.set(finger, { string: stringIndex, fret });
      }
    });

    (Object.entries(nextPositions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      const stringIndex = Number(key);
      if (
        nextBarreInfo &&
        fret === nextBarreInfo.fret &&
        finger === nextBarreInfo.finger &&
        stringIndex >= nextBarreInfo.fromString &&
        stringIndex <= nextBarreInfo.toString
      ) {
        return;
      }

      if (fret > 0 && finger) {
        nextFingers.set(finger, { string: stringIndex, fret });
      }
    });

    const allFingers = new Set([...currentFingers.keys(), ...nextFingers.keys()]);

    allFingers.forEach((fingerNum) => {
      const current = currentFingers.get(fingerNum);
      const next = nextFingers.get(fingerNum);

      let x: number, y: number, opacity: number, scale: number;
      let drawFingerNumber: number;

      if (current && next) {
        // Dedo existe em ambos - interpolar posição
        const currentX = this._fretboardX + this.horizontalPadding + (current.string - 1) * this._stringSpacing;
        const currentY = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        const nextX = this._fretboardX + this.horizontalPadding + (next.string - 1) * this._stringSpacing;
        const nextY = this._fretboardY + (next.fret - 0.5) * this._realFretSpacing;

        x = currentX + (nextX - currentX) * progress;
        y = currentY + (nextY - currentY) * progress;
        opacity = 1;
        scale = 1;
        drawFingerNumber = fingerNum;
      } else if (current && !next) {
        // Dedo existe no anterior, não existe no novo: some com zoom out
        x = this._fretboardX + this.horizontalPadding + (current.string - 1) * this._stringSpacing;
        y = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        opacity = 1 - progress;
        scale = 1 - (progress * 0.5); // 1.5 -> 1 (zoom out)
        drawFingerNumber = fingerNum;
      } else if (!current && next) {
        // Dedo não existe no anterior, existe no novo: aparece com zoom in
        x = this._fretboardX + this.horizontalPadding + (next.string - 1) * this._stringSpacing;
        y = this._fretboardY + (next.fret - 0.5) * this._realFretSpacing;
        opacity = progress;
        scale = 0.5 + (progress * 0.5); // 0.5 -> 1.0 (zoom in)
        drawFingerNumber = fingerNum;
      } else {
        return;
      }

      withCanvasTransformAtPoint(
        this._ctx,
        { x, y, opacity, scale },
        () => this.drawFingerAtPosition(drawFingerNumber)
      );
    });
  }

  /**
   * Desenha cordas evitadas com transição
   */
  private drawAvoidedStringsWithTransition(
    currentAvoid: number[] | undefined,
    nextAvoid: number[] | undefined,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    const current = currentAvoid || [];
    const next = nextAvoid || [];
    const allStrings = new Set([...current, ...next]);

    allStrings.forEach((stringNum) => {
      const inCurrent = current.includes(stringNum);
      const inNext = next.includes(stringNum);

      const y = this._diagramY + this._diagramHeight + this._realFretSpacing * 0.4;
      const x = this._fretboardX + this.horizontalPadding + (stringNum - 1) * this._stringSpacing;

      let opacity: number, scale: number;

      if (inCurrent && inNext) {
        // X existe em ambos
        opacity = 1;
        scale = 1;
      } else if (inCurrent && !inNext) {
        // X desaparece - zoom out
        opacity = 1 - progress;
        scale = 1 + (progress * 0.5); // 1 -> 1.5
      } else if (!inCurrent && inNext) {
        // X aparece - zoom in
        opacity = progress;
        scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      } else {
        return;
      }

      // Draw function for the "x"
      const drawX = () => {
        this._ctx.fillStyle = this._colors.textColor;
        const fontSize = 45 * this._scaleFactor; // Scaled font size
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillText("x", 0, 0);
      }

      withCanvasTransformAtPoint(this._ctx, { x, y, opacity, scale }, drawX);
    });
  }

  /**
   * Desenha indicador de transposição com transição
   */
  private drawTransposeIndicatorWithTransition(
    currentTransport: number,
    nextTransport: number,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    const x = this._fretboardX - this._realFretSpacing;
    const y = this._fretboardY + (this._realFretSpacing / 2);

    const drawAtOrigin = (transport: number) => this._drawTransposeIndicatorTextAtOrigin(transport);

    if (currentTransport > 1 && nextTransport > 1) {
      withCanvasTransformAtPoint(this._ctx, { x, y, opacity: 1, scale: 1 }, () => drawAtOrigin(currentTransport));
      return;
    }

    if (currentTransport > 1 && nextTransport <= 1) {
      // desaparece: escala 1 -> 0.5, opacidade 1 -> 0
      const scale = 1 - (progress * 0.5);
      withCanvasTransformAtPoint(this._ctx, { x, y, opacity: 1 - progress, scale }, () => drawAtOrigin(currentTransport));
      return;
    }

    if (currentTransport <= 1 && nextTransport > 1) {
      // aparece: escala 0.5 -> 1, opacidade 0 -> 1
      const scale = 0.5 + (progress * 0.5);
      withCanvasTransformAtPoint(this._ctx, { x, y, opacity: progress, scale }, () => drawAtOrigin(nextTransport));
    }
  }
}
