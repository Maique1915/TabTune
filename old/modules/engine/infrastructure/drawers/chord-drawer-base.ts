import { getNome } from "@/modules/core/domain/chord-logic";
import { FretboardDrawer } from "./fretboard-drawer";
import type { FretboardTheme } from "@/modules/core/domain/types";
import type { ChordDiagramProps, Position, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { easeInOutQuad, withCanvasTransformAround, withCanvasTransformAtPoint } from "../utils/animacao";

/**
 * Classe base para desenhar acordes de violão
 * Compartilha lógica e configurações entre diferentes tipos de animação
 */
export class ChordDrawerBase {
  // Atributos privados
  private _ctx: CanvasRenderingContext2D;
  private _colors: FretboardTheme;
  private _dimensions: { width: number; height: number };
  public fretboardDrawer: FretboardDrawer;

  // Cache para o braço do violão (sprite)
  private _fretboardCache: HTMLCanvasElement | null = null;
  // Flag to avoid drawing the fretboard on every frame after a transition ends
  private _skipFretboard: boolean = false;
  private _rotation: number = 0;
  private _mirror: boolean = false;

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

  private _baseNeckRadius: number = 24;

  private _baseFingerRadius: number = 28;

  private _baseBarreWidth: number = 56; // 2 * fingerRadius para consistência

  private _stringNamesY: number = 0;

  private _scaleFactor: number = 1;

  private _globalCapo: number = 0; // Global capo value from settings menu

  private _stringNames: string[] = ["E", "A", "D", "G", "B", "e"];





  constructor(

    ctx: CanvasRenderingContext2D,

    colors: FretboardTheme,

    dimensions: { width: number; height: number },

    scaleFactor: number = 1

  ) {

    this._ctx = ctx;

    this._colors = colors;

    this._dimensions = dimensions;
    this._scaleFactor = scaleFactor;
    this._rotation = colors.rotation || 0;
    this._mirror = colors.mirror || false;

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
    this.fretboardDrawer.setTransforms(this._rotation as any, this._mirror);

  }

  // ============ GETTERS ============

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  get colors(): FretboardTheme {
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

  public setColors(value: FretboardTheme) {
    this._colors = value;
    this._rotation = value.rotation || 0;
    this._mirror = value.mirror || false;
    this.fretboardDrawer.setColors(value);
    this.fretboardDrawer.setTransforms(this._rotation as any, this._mirror);
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
    this.fretboardDrawer.setScaleFactor(value);
    this._calculateDimensions(); // Recalculate everything based on new scale
    this._fretboardCache = null; // Invalidate cache
  }

  public setNumStrings(value: number): void {
    if (this._numStrings !== value) {
      this._numStrings = value;
      this.fretboardDrawer.setNumStrings(value);
      this._calculateDimensions();
      this._fretboardCache = null;
    }
  }

  public setNumFrets(value: number): void {
    if (this._numFrets !== value) {
      this._numFrets = value;
      this.fretboardDrawer.setNumFrets(value);
      this._calculateDimensions();
      this._fretboardCache = null;
    }
  }

  public setGlobalCapo(value: number): void {
    this._globalCapo = value;
    // Pass to fretboardDrawer so it can use it in drawFretboard
    this.fretboardDrawer.setCapo(value > 0, value);
    this._fretboardCache = null; // Invalidate cache when capo changes
  }

  public setStringNames(names: string[] | undefined): void {
    if (names) {
      this._stringNames = names;
      this.fretboardDrawer.setStringNames(names);
      this._fretboardCache = null; // Invalidate cache when tuning changes
    }
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
    // Use the current _numStrings for spacing calculation
    this._stringSpacing = stringAreaWidth / (Math.max(1, this._numStrings - 1));

    this._fretboardX = this._diagramX;
    this._fretboardY = this._diagramY + (75 * this._scaleFactor);
    this._fretboardWidth = scaledDiagramWidth;
    this._fretboardHeight = this._diagramHeight - (75 * this._scaleFactor);
    this._realFretSpacing = this._fretboardHeight / (1 + this._numFrets);

    if (this.fretboardDrawer) {
      this.fretboardDrawer.setFretboardHeight(this._fretboardHeight);
      this.fretboardDrawer.setFretSpacing(this._realFretSpacing);
    }

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
    if (this.fretboardDrawer) {
      this.fretboardDrawer.setDiagramX(this._diagramX);
      this.fretboardDrawer.setDiagramY(this._diagramY);
      this.fretboardDrawer.setFretboardHeight(this._fretboardHeight);
      this.fretboardDrawer.setFretSpacing(this._realFretSpacing);
    }

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
   * Applies rotation and mirror transforms around the center of the diagram.
   */
  public applyTransforms(): void {
    const centerX = this._dimensions.width / 2;
    const centerY = this._dimensions.height / 2;

    this._ctx.translate(centerX, centerY);
    if (this._rotation) {
      this._ctx.rotate((this._rotation * Math.PI) / 180);
    }
    if (this._mirror) {
      this._ctx.scale(-1, 1);
    }
    this._ctx.translate(-centerX, -centerY);
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




  // ============ MÉTODOS DE DESENHO ============

  /**
   * Internal helper to draw a finger (circle) or barre (rectangle) and its finger number.
   */
  private _drawShapeAndFingerNumber(
    centerX: number,
    centerY: number,
    finger: number | string,
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
    if (finger !== undefined && finger !== null && finger !== -2) {
      this._ctx.fillStyle = this._colors.fingerTextColor;
      const fontSize = 45 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";

      const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

      // Counter-rotate and counter-scale for text
      this._ctx.save();
      this._ctx.translate(centerX, centerY);
      if (this._mirror) this._ctx.scale(-1, 1);
      if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
      this._ctx.fillText(displayText, 0, 0);
      this._ctx.restore();
    }
  }

  /**
   * Internal helper to draw a finger (circle) or barre (rectangle) and its finger number
   * relative to (0,0) for animated contexts.
   */
  private _drawAnimatedShapeAndFingerNumber(
    finger: number | string,
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

    if (finger !== undefined && finger !== null && finger !== -2) {
      this._ctx.fillStyle = this._colors.fingerTextColor;
      const fontSize = 45 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";

      const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

      // Counter-rotate and counter-scale for text
      this._ctx.save();
      if (this._mirror) this._ctx.scale(-1, 1);
      if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
      this._ctx.fillText(displayText, 0, 0);
      this._ctx.restore();
    }
  }

  /**
   * Draws a barre shape at the current transformed (0,0) for animated contexts.
   * @param finger The finger number.
   * @param barreVisualWidth The actual drawn width of the barre.
   */
  private _drawBarreShapeAtPosition(finger: number | string, barreVisualWidth: number): void {
    this._drawAnimatedShapeAndFingerNumber(finger, true, barreVisualWidth);
  }

  /**
   * Detects the primary barre in a chord from the unified fingers array.
   * Returns the barre that spans the most strings.
   */
  private _detectBarre(chord: ChordDiagramProps): BarreInfo | null {
    const { fingers } = chord;
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxStrings = 1;

    fingers.forEach(f => {
      const isBarre = f.endString !== undefined && f.endString !== f.string;
      if (isBarre) {
        const start = Math.min(f.string, f.endString!);
        const end = Math.max(f.string, f.endString!);
        const span = end - start + 1;

        if (span > maxStrings) {
          maxStrings = span;
          bestBarre = {
            fret: f.fret,
            finger: f.finger ?? 1, // Ensure finger is always present, default to 1
            startString: start,
            endString: end
          };
        }
      }
    });

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
   * Applies translation that maps to a "Top" visual movement in screen space.
   */
  private _applyVisualTopTranslation(translateValue: number): void {
    this._ctx.translate(0, -translateValue);
  }

  /**
   * Applies chord-specific settings (numStrings, stringNames) to the drawer.
   */
  private _applyChordSettings(chord: ChordDiagramProps): void {
    const chordNumStrings = chord.stringNames?.length ?? 6;
    if (chordNumStrings !== this._numStrings) {
      this._numStrings = chordNumStrings;
      this._calculateDimensions();
      this.fretboardDrawer.setNumStrings(this._numStrings);
      this.fretboardDrawer.setStringSpacing(this._stringSpacing);
      this.fretboardDrawer.setFretboardWidth(this._fretboardWidth);
      this.fretboardDrawer.setHorizontalPadding(this.horizontalPadding);
      // Fretboard cache must be invalidated when numStrings changes
      this._fretboardCache = null;
    }
    // Note: stringNames are passed directly to drawing methods that need them
  }

  /**
   * Returns the visual "height" (distance from center to vertical edge) on screen
   * based on current rotation.
   */
  private _getVisualFretboardHalfHeight(): number {
    return (this._rotation % 180 === 0)
      ? (this.fretboardHeight / 2)
      : (this.fretboardWidth / 2);
  }

  /**
   * Helper to get label positions (name or transpose) based on logical coordinates.
   * Returns coordinates in absolute canvas space, assuming unrotated/unmirrored state.
   */
  private _getLabelPosition(type: 'name' | 'transpose'): { x: number; y: number } {
    const scale = this._scaleFactor;
    const CW = this._dimensions.width;
    const CH = this._dimensions.height;
    const rad = (this._rotation * Math.PI) / 180;

    // Derive carousel offsetX from current _diagramX position
    const baseCenterX = (CW / 2) - (this.diagramWidth / 2);
    const carouselOffsetX = this._diagramX - baseCenterX;

    // IMPORTANT: Mirroring flips the logical X axis of the diagram.
    // In transformations where rotation maps logical X to screen Y (like 90 or 270),
    // mirroring must also flip the screen Y movement.
    // By using an effectiveOffset that accounts for the mirror flip before projection,
    // we ensure labels and diagrams move in unison.
    const effectiveOffset = this._mirror ? -carouselOffsetX : carouselOffsetX;

    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    const visualCenterX = (CW / 2) + (effectiveOffset * cosR);
    const visualCenterY = (CH / 2) + (effectiveOffset * sinR);

    // Distances from the visual top edge in screen space
    const offsetT = 40 * scale;
    const offsetN = 140 * scale;
    const vHalfHeight = this._getVisualFretboardHalfHeight();

    // Labels are always pinned to the visual screen-top of the chord
    const baseY = visualCenterY - vHalfHeight;
    const posY = (type === 'name' ? baseY - offsetN : baseY - offsetT);

    return { x: visualCenterX, y: posY };
  }

  /**
   * Desenha o nome do acorde
   */
  drawChordName(chordName: string): void {
    this._ctx.fillStyle = this._colors.chordNameColor;
    const fontSize = 75 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    const pos = this._getLabelPosition('name');

    // Drawing in absolute screen space
    this._ctx.save();
    this._ctx.translate(pos.x, pos.y);
    this._ctx.fillText(chordName, 0, 0);
    this._ctx.restore();
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
    finger: number | string,
    fromStringIndex: number,
    toStringIndex: number
  ): void {
    const fretY = this.fretboardY + (fret - 0.5) * this.realFretSpacing;

    const isBarre = fromStringIndex !== toStringIndex;

    let centerX: number;
    let barreVisualWidth: number = 0; // Only used if isBarre is true

    if (isBarre) {
      // Ensure we calculate from left to right regardless of index order
      const leftIdx = Math.min(fromStringIndex, toStringIndex);
      const rightIdx = Math.max(fromStringIndex, toStringIndex);

      let fromX = this.fretboardX + this.horizontalPadding + leftIdx * this.stringSpacing;
      let toX = this.fretboardX + this.horizontalPadding + rightIdx * this.stringSpacing;

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
   * Desenha todos os dedos de um acorde (incluindo pestanas unificadas)
   */
  drawFingers(chord: ChordDiagramProps, barreInfo: BarreInfo | null = null): void {
    const { fingers } = chord;
    if (!fingers) return;

    fingers.forEach(f => {
      if (f.fret > 0) {
        const isBarre = f.endString !== undefined && f.endString !== f.string;
        const start = isBarre ? Math.min(f.string, f.endString!) : f.string;
        const end = isBarre ? Math.max(f.string, f.endString!) : f.string;

        // Invert mapping: string 1 (high e) -> rightmost, string 6 (low E) -> leftmost
        const startIdx = this._numStrings - start;
        const endIdx = this._numStrings - end;

        this.drawFretPosition(f.fret, f.finger ?? 1, startIdx, endIdx);
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
        // Invert mapping: string 1 -> rightmost, string 6 -> leftmost
        const visualIdx = this._numStrings - stringNumber;
        const x = this.fretboardX + this.horizontalPadding + visualIdx * this.stringSpacing;
        this._ctx.fillStyle = this._colors.textColor;

        this._ctx.save();
        this._ctx.translate(x, y);
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText("x", 0, 0);
        this._ctx.restore();
      }
    }
  }

  /**
   * Desenha indicador de transposição (casa)
   */
  /**
   * Desenha indicador de transposição (casa)
   * Agora desenha dentro do contexto transformado (não em screen space salvo se fallback).
   */
  drawTransposeIndicator(transportDisplay: number, barreInfo: BarreInfo | null = null): void {
    if (transportDisplay <= 1) return;

    // Use the padding area for the indicator
    // Position it at roughly 25% of the left padding to keep it away from the barre/neck
    const x = this.fretboardX + (this.horizontalPadding * 0.25);

    // Align vertically with the reference fret (Barre or Fret 1)
    const refFret = barreInfo ? barreInfo.fret : 1;
    const fretY = this.fretboardY + (refFret - 0.5) * this.realFretSpacing;

    this._ctx.save();
    this._ctx.translate(x, fretY);

    // Counter-rotate to keep text upright
    if (this._mirror) this._ctx.scale(-1, 1);
    if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

    // Color fallback to white if undefined
    const textColor = this._colors.textColor || '#FFFFFF';
    this._ctx.fillStyle = barreInfo ? (this._colors.fingerTextColor || '#FFFFFF') : textColor;

    // Font size - slightly reduced for better proportion
    const fontSize = 36 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    // Draw text (e.g. "6ª")
    this._ctx.fillText(`${transportDisplay}ª`, -60, 0);
    this._ctx.restore();
  }

  private _drawTransposeIndicatorTextAtOrigin(transportDisplay: number): void {
    this._ctx.fillStyle = this._colors.textColor;
    const fontSize = 45 * this._scaleFactor; // Same as finger numbers
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(`${transportDisplay}ª`, -60, 0);
  }

  /**
   * Desenha um dedo individual em uma posição específica, com opacidade e escala (para animações)
   * Espera que o contexto já esteja transladado e escalado.
   */
  drawFingerAtPosition(fingerNumber: number | string): void {
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
  private _findMinNonZeroNote(fingers: StandardPosition[], avoid: number[]): [number, number] {
    let min = Infinity;
    let max = 0;

    fingers.forEach(f => {
      if (f.fret > 0) {
        // Check if any string in the range is NOT avoided
        const start = f.string;
        const end = f.endString || f.string;
        const range = [Math.min(start, end), Math.max(start, end)];

        let isVisible = false;
        for (let s = range[0]; s <= range[1]; s++) {
          if (!avoid || !avoid.includes(s)) {
            isVisible = true;
            break;
          }
        }

        if (isVisible) {
          if (f.fret < min) min = f.fret;
          if (f.fret > max) max = f.fret;
        }
      }
    });

    return [min === Infinity ? 0 : min, max];
  }

  /**
   * Transposes the chord data to fit within available frets if necessary.
   * Logic ported from chord-diagram.tsx
   */
  public transposeForDisplay(chord: ChordDiagramProps, currentTransport: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
    const { fingers, avoid } = chord;
    const [minFret, maxFret] = this._findMinNonZeroNote(fingers, avoid || []);

    // If fits in 5 frets, keep as is
    if (maxFret <= 5) {
      return { finalChord: chord, transportDisplay: currentTransport };
    }

    const transposition = minFret > 0 ? minFret - 1 : 0;

    const newFingers = fingers.map(f => ({
      ...f,
      fret: f.fret > 0 ? f.fret - transposition : 0
    }));

    return {
      finalChord: {
        ...chord,
        fingers: newFingers
      },
      transportDisplay: transposition + 1
    };
  }
  /**
   * Desenha um acorde completo
   */

  /**
   * Calculates the configuration for the independent Capo (Visual Shift).
   */
  private _getCapoConfig(): { isActive: boolean; fret: number; showNut: boolean } {
    if (this._globalCapo > 0) {
      return { isActive: true, fret: this._globalCapo, showNut: false };
    }
    return { isActive: false, fret: 0, showNut: true };
  }

  /**
   * Calculates the configuration for the independent Transpose (Data Shift / High Fret).
   */
  private _getTransposeConfig(transportDisplay: number): { isActive: boolean; fret: number; showNut: boolean } {
    if (transportDisplay > 1) {
      return { isActive: true, fret: transportDisplay, showNut: false };
    }
    return { isActive: false, fret: 1, showNut: true };
  }

  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
    const { finalChord, transportDisplay } = this.transposeForDisplay(inputChord, inputTransportDisplay);

    this._applyChordSettings(finalChord);

    const chordName = finalChord.chordName || (finalChord.chord ? getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");
    const barreInfo = this._detectBarre(finalChord);

    if (finalChord.showChordName !== false) {
      this.drawChordName(chordName);
    }

    this._ctx.save();
    this.applyTransforms();

    if (!options.skipFretboard) {
      this._skipFretboard = false;

      // === SEPARATED LOGIC FOR CAPO AND TRANSPOSE ===
      const capoConfig = this._getCapoConfig();
      const transposeConfig = this._getTransposeConfig(transportDisplay);

      // Conflict Resolution:
      // If either Capo or Transpose (High Fret) is active, valid Nut is hidden.
      // Capo replaces Nut. High Fret implies no Nut.
      const showNut = capoConfig.showNut && transposeConfig.showNut;

      this.fretboardDrawer.setConditionalFlags(showNut, showNut);
      this.fretboardDrawer.setStringNames(finalChord.stringNames);
      this.fretboardDrawer.setHeadstockGap(showNut ? 20 * this._scaleFactor : 0);

      // Draw Capo (Visual Shift)
      // Completely independent of Transpose logic.
      this.fretboardDrawer.setHideCapoTitle(false); // Always show title for real Capo
      this.fretboardDrawer.setCapo(capoConfig.isActive, capoConfig.fret);
      this.fretboardDrawer.drawCapo();

      this.drawFretboard();

      // Draw Transpose Indicator (Data Shift / High Fret)
      // Completely independent of Capo logic.
      // Shows "Xª" label for starting fret.
      // We pass 1 (supress) if Capo is active? 
      // User said "one should not depend on the other".
      // But if Capo is active (e.g. at 2), and Transport is 1...
      // drawTransposeIndicator(1) does nothing. 
      // If Transport is 5. drawTransposeIndicator(5) draws "5ª".
      // Using `transposeConfig.fret` (which is transportDisplay) is correct.
      // However, if Capo is active, drawCapo already puts a label.
      // If we are at standard position (transport 1) relative to Capo...
      // We DON'T want "1ª" from transpose indicator.
      // transposeConfig.isActive check handles this (isActive is false for 1).

      if (transposeConfig.isActive) {
        this.drawTransposeIndicator(transposeConfig.fret, barreInfo);
      }
    }

    // Draw all fingers (including barres if present in the array)
    this.drawFingers(finalChord);
    this.drawAvoidedStrings(finalChord.avoid);

    // Draw Transpose Indicator (Data Shift / High Fret)
    // Must be drawn even if fretboard is skipped (e.g. static-fingers animation)
    const transposeConfig = this._getTransposeConfig(transportDisplay);
    if (transposeConfig.isActive) {
      this.drawTransposeIndicator(transposeConfig.fret, barreInfo);
    }

    this._ctx.restore();
  }

  /**
   * Desenha um acorde completo com animação build-in (progressiva)
   */
  drawChordWithBuildAnimation(inputChord: ChordDiagramProps, inputTransportDisplay: number, progress: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
    const { finalChord, transportDisplay } = this.transposeForDisplay(inputChord, inputTransportDisplay);

    console.log("Chord animation started (build-in):", finalChord);
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    this._applyChordSettings(finalChord);

    const chordName = finalChord.chordName || (finalChord.chord ? getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");
    const phases = this.calculateAnimationPhases(progress);
    const barreInfo = this._detectBarre(finalChord);

    // Draw labels in screen space
    // Fase 1: Nome do acorde
    if (phases.chordName > 0 && finalChord.showChordName !== false) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.chordName;
      const translateVal = (1 - phases.chordName) * 30; // Slide in from top
      this._applyVisualTopTranslation(translateVal);
      this.drawChordName(chordName);
      this._ctx.restore();
    }

    // Phase 9 moved inside transforms

    this._ctx.save();
    this.applyTransforms();

    // Fase 9: Indicador de transposição com fade (dentro do transform)
    if (phases.transpose > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.transpose;
      // Slide vertical leve se não estiver na pestana? Ou apenas fade.
      // Vamos usar apenas fade para garantir posição correta na pestana.
      this.drawTransposeIndicator(transportDisplay, barreInfo);
      this._ctx.restore();
    }


    // Fase 2-6: Fretboard (neck, stringNames, strings, frets, nut)

    // Only draw if NOT skipping fretboard
    if (!options.skipFretboard && phases.neck > 0) {
      this._skipFretboard = false;

      // === SEPARATED LOGIC FOR CAPO AND TRANSPOSE (ANIMATION) ===
      const capoConfig = this._getCapoConfig();
      const transposeConfig = this._getTransposeConfig(transportDisplay);

      // Conflict Resolution:
      const showNut = capoConfig.showNut && transposeConfig.showNut;

      // Set flags for consistent rendering during animation
      this.fretboardDrawer.setConditionalFlags(showNut, showNut);

      // Set gap to separate headstock from neck (only for open position)
      this.fretboardDrawer.setHeadstockGap(showNut ? 20 * this._scaleFactor : 0);

      // Set Capo for movable chords OR if a global capo is active
      this.fretboardDrawer.setHideCapoTitle(false);
      this.fretboardDrawer.setCapo(capoConfig.isActive, capoConfig.fret);

      this.fretboardDrawer.drawAnimatedFretboard({
        neckProgress: phases.neck,
        stringNamesProgress: phases.stringNames,
        stringsProgress: phases.strings,
        fretsProgress: phases.frets,
        nutProgress: phases.nut,
      });

      // Draw Capo if active (using neck progress for fade-in)
      if (capoConfig.isActive) {
        this._ctx.save();
        this._ctx.globalAlpha = phases.neck; // Fade in with neck
        this.fretboardDrawer.drawCapo();
        this._ctx.restore();
      }
    }

    // Phase 6 & 7: Unified Fingers draw
    if (phases.fingers > 0 || (phases.nut > 0 && barreInfo)) {
      finalChord.fingers.forEach(f => {
        if (f.fret <= 0) return;

        const isBarre = f.endString !== undefined && f.endString !== f.string;
        const currentPhase = isBarre ? phases.nut : phases.fingers;
        if (currentPhase <= 0) return;

        const start = isBarre ? Math.min(f.string, f.endString!) : f.string;
        const end = isBarre ? Math.max(f.string, f.endString!) : f.string;

        // Invert mapping: string 1 -> rightmost, string 6 -> leftmost
        const startIdx = this._numStrings - start;
        const endIdx = this._numStrings - end;
        const width = isBarre ? Math.abs(endIdx - startIdx) * this._stringSpacing : 0;
        const centerX = Math.min(startIdx, endIdx) * this._stringSpacing + (width / 2);

        const x = this._fretboardX + this.horizontalPadding + centerX;
        const y = this._fretboardY + (f.fret - 1) * this._realFretSpacing + (this._realFretSpacing / 2);

        this._ctx.save();
        this._ctx.globalAlpha = currentPhase;
        this._ctx.translate(x, y);
        const finalScale = 0.5 + (currentPhase * 0.5);
        this._ctx.scale(finalScale, finalScale);

        this._drawAnimatedShapeAndFingerNumber(f.finger ?? 1, isBarre, width + this.fingerRadius * 2);
        this._ctx.restore();
      });
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
          // Invert mapping: string 1 -> rightmost, string 6 -> leftmost
          const visualIdx = this._numStrings - stringNumber;
          const x = this._fretboardX + this.horizontalPadding + visualIdx * this._stringSpacing;

          this._ctx.save();
          this._ctx.translate(x, y);
          this._ctx.scale(scale, scale);
          this._ctx.fillStyle = this._colors.textColor;
          const fontSize = 45 * this._scaleFactor;
          this._ctx.font = `bold ${fontSize}px sans-serif`;
          this._ctx.textAlign = "center";
          this._ctx.textBaseline = "middle";

          // Counter-rotate text here because it's at origin
          this._ctx.save();
          if (this._mirror) this._ctx.scale(-1, 1);
          if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
          this._ctx.fillText("x", 0, 0);
          this._ctx.restore();

          this._ctx.restore();
        }
      }
      this._ctx.restore();
    }

    this._ctx.restore(); // Final global restore
  }

  /**
   * Desenha um acorde completo com animação de transição de outro acorde
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
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    this._applyChordSettings(nextFinalChord);

    const { finalChord: current, transportDisplay: currentTransport } = this.transposeForDisplay(currentFinalChord, currentTransportDisplay);
    const { finalChord: next, transportDisplay: nextTransport } = this.transposeForDisplay(nextFinalChord, nextTransportDisplay);

    const currentBarreInfo = this._detectBarre(current);
    const nextBarreInfo = this._detectBarre(next);

    const currentName = current.chord ? getNome(current.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";
    const nextName = next.chord ? getNome(next.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";

    const easedProgress = easeInOutQuad(originalProgress);
    const namePos = this._getLabelPosition('name');
    const centerX = namePos.x;
    const centerY = namePos.y;

    // Nome: transição (OUTSIDE applyTransforms)
    const scaleOut = 1 - (easedProgress * 0.2);
    const currentNameTranslateY = -easedProgress * (20 * this._scaleFactor);
    this._drawTextWithTransform(currentName, 1 - easedProgress, scaleOut, currentNameTranslateY, centerX, centerY);

    const scaleIn = 0.8 + (easedProgress * 0.2);
    const nextNameTranslateY = (1 - easedProgress) * (20 * this._scaleFactor);
    this._drawTextWithTransform(nextName, easedProgress, scaleIn, nextNameTranslateY, centerX, centerY);

    // Transpose Indicator: transição agora movida para dentro do applyTransforms para usar coordenadas locais


    this._ctx.save();
    this.applyTransforms();

    // Fretboard cache
    if (!this._fretboardCache) {
      this._updateFretboardCache();
    }

    if (!this._skipFretboard && !options.skipFretboard) {
      // Interpolate string names based on progress
      const stringNamesProgress = easedProgress; // Use eased progress for string names fade/transition
      this.fretboardDrawer.drawStringNames(stringNamesProgress, next.stringNames); // Pass target chord names
      this.drawFretboard();
    }

    if (originalProgress >= 1) {
      this._skipFretboard = true;
    } else {
      this._skipFretboard = false;
    }

    // Helpers
    this.drawBarreWithTransition(currentBarreInfo, nextBarreInfo, current.fingers, next.fingers, originalProgress);
    this.drawFingersWithTransition(current.fingers, next.fingers, currentBarreInfo, nextBarreInfo, originalProgress);
    this.drawAvoidedStringsWithTransition(current.avoid, next.avoid, originalProgress);
    this.drawTransposeIndicatorWithTransition(currentTransport, nextTransport, currentBarreInfo, nextBarreInfo, originalProgress);

    this._ctx.restore();
  }

  private drawBarreWithTransition(
    currentBarre: BarreInfo | null,
    nextBarre: BarreInfo | null,
    currentFingers: StandardPosition[] = [],
    nextFingers: StandardPosition[] = [],
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);
    if (!currentBarre && !nextBarre) return;

    if (currentBarre && nextBarre) {
      // Barre moving to Barre
      const getFin = (f: any) => (f === 'T' ? 0 : Number(f) || 1);
      const fret = currentBarre.fret + (nextBarre.fret - currentBarre.fret) * progress;
      const startString = currentBarre.startString + (nextBarre.startString - currentBarre.startString) * progress;
      const endString = currentBarre.endString + (nextBarre.endString - currentBarre.endString) * progress;
      const finger = Math.round(getFin(currentBarre.finger) + (getFin(nextBarre.finger) - getFin(currentBarre.finger)) * progress);

      const fretY = this.fretboardY + (fret - 0.5) * this.realFretSpacing;
      let fromX = this.fretboardX + this.horizontalPadding + (startString - 1) * this.stringSpacing;
      let toX = this.fretboardX + this.horizontalPadding + (endString - 1) * this.stringSpacing;
      fromX -= this.fingerRadius;
      toX += this.fingerRadius;
      const barreActualWidth = toX - fromX;
      const centerX = fromX + barreActualWidth / 2;

      this._ctx.save();
      this._ctx.translate(centerX, fretY);
      this._drawBarreShapeAtPosition(finger, barreActualWidth);
      this._ctx.restore();
    } else if (currentBarre && !nextBarre) {
      // Barre fading out OR morphing to Finger
      const finger = currentBarre.finger ?? 1;
      let targetFinger: { string: number, fret: number } | null = null;

      // Check if the barre finger exists in the next chord as a normal finger
      for (const f of nextFingers) {
        if (f.finger === finger && f.fret > 0 && (f.endString === undefined || f.endString === f.string)) {
          targetFinger = { string: f.string, fret: f.fret };
          break;
        }
      }

      const fretYStart = this.fretboardY + (currentBarre.fret - 0.5) * this.realFretSpacing;

      if (targetFinger) {
        // MORPH: Barre -> Finger
        const fretYEnd = this.fretboardY + (targetFinger.fret - 0.5) * this.realFretSpacing;
        const currentY = fretYStart + (fretYEnd - fretYStart) * progress;

        const startFromX = this.fretboardX + this.horizontalPadding + (currentBarre.startString - 1) * this.stringSpacing - this.fingerRadius;
        const startToX = this.fretboardX + this.horizontalPadding + (currentBarre.endString - 1) * this.stringSpacing + this.fingerRadius;
        const startWidth = startToX - startFromX;
        const startCenterX = startFromX + startWidth / 2;

        const endCenterX = this.fretboardX + this.horizontalPadding + (targetFinger.string - 1) * this.stringSpacing;
        const endWidth = this.fingerRadius * 2;
        const endHeight = this.fingerRadius * 2;

        const currentCenterX = startCenterX + (endCenterX - startCenterX) * progress;
        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = this.barreWidth + (endHeight - this.barreWidth) * progress;

        this._ctx.save();
        this._ctx.translate(currentCenterX, currentY);

        this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
        this._ctx.beginPath();
        // Use a large radius to ensure it looks circular when square
        this._ctx.roundRect(-currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight, this.neckRadius * 2);
        this._ctx.fill();

        if (this._colors.fingerBorderWidth > 0) {
          this._ctx.strokeStyle = this._colors.fingerBorderColor;
          this._ctx.lineWidth = this._colors.fingerBorderWidth;
          this._ctx.stroke();
        }

        this._ctx.fillStyle = this._colors.fingerTextColor;
        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.save();
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(String(finger), 0, 0);
        this._ctx.restore();

        this._ctx.restore();

      } else {
        // FADE OUT
        const scale = 1 + (progress * 0.5);
        const fromX = this.fretboardX + this.horizontalPadding + (currentBarre.startString - 1) * this.stringSpacing;
        const toX = this.fretboardX + this.horizontalPadding + (currentBarre.endString - 1) * this.stringSpacing;
        const centerX = fromX + (toX - fromX) / 2;

        withCanvasTransformAround(this._ctx, { centerX, centerY: fretYStart, opacity: 1 - progress, scale }, () => {
          let fX = this.fretboardX + this.horizontalPadding + (currentBarre.startString - 1) * this.stringSpacing;
          let tX = this.fretboardX + this.horizontalPadding + (currentBarre.endString - 1) * this.stringSpacing;
          fX -= this.fingerRadius;
          tX += this.fingerRadius;
          this._drawBarreShapeAtPosition(currentBarre.finger ?? 1, tX - fX);
        });
      }

    } else if (!currentBarre && nextBarre) {
      // Morphing Finger -> Barre OR Barre Fade In
      const finger = nextBarre.finger ?? 1;
      let sourceFinger: { string: number, fret: number } | null = null;

      // Check if the barre finger exists in the current chord as a normal finger
      for (const f of currentFingers) {
        if (f.finger === finger && f.fret > 0 && (f.endString === undefined || f.endString === f.string)) {
          sourceFinger = { string: f.string, fret: f.fret };
          break;
        }
      }

      const fretYEnd = this.fretboardY + (nextBarre.fret - 0.5) * this.realFretSpacing;

      if (sourceFinger) {
        // MORPH: Finger -> Barre
        const fretYStart = this.fretboardY + (sourceFinger.fret - 0.5) * this.realFretSpacing;
        const currentY = fretYStart + (fretYEnd - fretYStart) * progress;

        const endFromX = this.fretboardX + this.horizontalPadding + (nextBarre.startString - 1) * this.stringSpacing - this.fingerRadius;
        const endToX = this.fretboardX + this.horizontalPadding + (nextBarre.endString - 1) * this.stringSpacing + this.fingerRadius;
        const endWidth = endToX - endFromX;
        const endCenterX = endFromX + endWidth / 2;
        const endHeight = this.barreWidth;

        const startCenterX = this.fretboardX + this.horizontalPadding + (sourceFinger.string - 1) * this.stringSpacing;
        const startWidth = this.fingerRadius * 2;
        const startHeight = this.fingerRadius * 2;

        const currentCenterX = startCenterX + (endCenterX - startCenterX) * progress;
        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = startHeight + (endHeight - startHeight) * progress;

        this._ctx.save();
        this._ctx.translate(currentCenterX, currentY);

        this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
        this._ctx.beginPath();
        this._ctx.roundRect(-currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight, this.neckRadius * 2);
        this._ctx.fill();

        if (this._colors.fingerBorderWidth > 0) {
          this._ctx.strokeStyle = this._colors.fingerBorderColor;
          this._ctx.lineWidth = this._colors.fingerBorderWidth;
          this._ctx.stroke();
        }

        this._ctx.fillStyle = this._colors.fingerTextColor;
        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.save();
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(String(finger), 0, 0);
        this._ctx.restore();

        this._ctx.restore();

      } else {
        // FADE IN
        const scale = 1.5 - (progress * 0.5);
        const fromX = this.fretboardX + this.horizontalPadding + (nextBarre.startString - 1) * this.stringSpacing;
        const toX = this.fretboardX + this.horizontalPadding + (nextBarre.endString - 1) * this.stringSpacing;
        const centerX = fromX + (toX - fromX) / 2;

        withCanvasTransformAround(this._ctx, { centerX, centerY: fretYEnd, opacity: progress, scale }, () => {
          let fX = this.fretboardX + this.horizontalPadding + (nextBarre.startString - 1) * this.stringSpacing;
          let tX = this.fretboardX + this.horizontalPadding + (nextBarre.endString - 1) * this.stringSpacing;
          fX -= this.fingerRadius;
          tX += this.fingerRadius;
          this._drawBarreShapeAtPosition(nextBarre.finger ?? 1, tX - fX);
        });
      }
    }
  }

  private drawFingersWithTransition(
    currentFingersRaw: StandardPosition[] = [],
    nextFingersRaw: StandardPosition[] = [],
    currentBarreInfo: BarreInfo | null,
    nextBarreInfo: BarreInfo | null,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);
    const currentFingers = new Map<number | string, { string: number; fret: number }>();
    const nextFingers = new Map<number | string, { string: number; fret: number }>();

    currentFingersRaw.forEach(f => {
      const { string: stringNum, fret, finger } = f;
      const stringIndex = stringNum - 1;
      // Use 1-based comparison for BarreInfo strings
      const sNum = stringIndex + 1;
      if (currentBarreInfo && fret === currentBarreInfo.fret && finger === currentBarreInfo.finger && sNum >= currentBarreInfo.startString && sNum <= currentBarreInfo.endString) return;
      if (fret > 0 && finger !== undefined) currentFingers.set(finger, { string: stringIndex, fret });
    });

    nextFingersRaw.forEach(f => {
      const { string: stringNum, fret, finger } = f;
      const stringIndex = stringNum - 1;
      // Use 1-based comparison for BarreInfo strings
      const sNum = stringIndex + 1;
      if (nextBarreInfo && fret === nextBarreInfo.fret && finger === nextBarreInfo.finger && sNum >= nextBarreInfo.startString && sNum <= nextBarreInfo.endString) return;
      if (fret > 0 && finger !== undefined) nextFingers.set(finger, { string: stringIndex, fret });
    });

    const allFingers = new Set([...currentFingers.keys(), ...nextFingers.keys()]);

    allFingers.forEach((fingerNum) => {
      const curr = currentFingers.get(fingerNum);
      const nxt = nextFingers.get(fingerNum);
      let x: number, y: number, opacity: number, scale: number;

      if (curr && nxt) {
        const cX = this.fretboardX + this.horizontalPadding + (curr.string - 1) * this.stringSpacing;
        const cY = this.fretboardY + (curr.fret - 0.5) * this.realFretSpacing;
        const nX = this.fretboardX + this.horizontalPadding + (nxt.string - 1) * this.stringSpacing;
        const nY = this.fretboardY + (nxt.fret - 0.5) * this.realFretSpacing;
        x = cX + (nX - cX) * progress;
        y = cY + (nY - cY) * progress;
        opacity = 1; scale = 1;
      } else if (curr && !nxt) {
        // Skip if this finger is becoming the Barre in the next chord
        if (nextBarreInfo && fingerNum === nextBarreInfo.finger) return;

        x = this.fretboardX + this.horizontalPadding + (curr.string - 1) * this.stringSpacing;
        y = this.fretboardY + (curr.fret - 0.5) * this.realFretSpacing;
        opacity = 1 - progress; scale = 1 - (progress * 0.5);
      } else if (!curr && nxt) {
        // Skip if this finger was the Barre in the previous chord
        if (currentBarreInfo && fingerNum === currentBarreInfo.finger) return;

        x = this.fretboardX + this.horizontalPadding + (nxt.string - 1) * this.stringSpacing;
        y = this.fretboardY + (nxt.fret - 0.5) * this.realFretSpacing;
        opacity = progress; scale = 0.5 + (progress * 0.5);
      } else return;

      withCanvasTransformAtPoint(this._ctx, { x, y, opacity, scale }, () => this.drawFingerAtPosition(fingerNum));
    });
  }

  private drawAvoidedStringsWithTransition(currentAvoid: number[] | undefined, nextAvoid: number[] | undefined, originalProgress: number): void {
    const progress = easeInOutQuad(originalProgress);
    const curr = currentAvoid || [];
    const nxt = nextAvoid || [];
    const all = new Set([...curr, ...nxt]);

    all.forEach((stringNum) => {
      const inCurr = curr.includes(stringNum);
      const inNxt = nxt.includes(stringNum);
      const y = this.diagramY + this.diagramHeight + this.realFretSpacing * 0.4;
      const x = this.fretboardX + this.horizontalPadding + (stringNum - 1) * this.stringSpacing;
      let opacity: number, scale: number;

      if (inCurr && inNxt) { opacity = 1; scale = 1; }
      else if (inCurr && !inNxt) { opacity = 1 - progress; scale = 1 + (progress * 0.5); }
      else if (!inCurr && inNxt) { opacity = progress; scale = 1.5 - (progress * 0.5); }
      else return;

      withCanvasTransformAtPoint(this._ctx, { x, y, opacity, scale }, () => {
        this._ctx.fillStyle = this._colors.textColor;
        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        // Counter-rotate text
        this._ctx.save();
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText("x", 0, 0);
        this._ctx.restore();
      });
    });
  }

  public drawTransposeIndicatorWithTransition(
    currentTransport: number,
    nextTransport: number,
    currentBarre: BarreInfo | null,
    nextBarre: BarreInfo | null,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    // Helper to get target position (local coordinates)
    const getPos = (transport: number, barre: BarreInfo | null) => {
      // Use logic consistent with static drawTransposeIndicator
      const x = this.fretboardX + (this.horizontalPadding * 0.25);
      const refFret = barre ? barre.fret : 1;
      const y = this.fretboardY + (refFret - 0.5) * this.realFretSpacing;
      return { x, y };
    };

    const startPos = getPos(currentTransport, currentBarre);
    const endPos = getPos(nextTransport, nextBarre);

    // Interpolate position
    let x = 0;
    let y = 0;

    if (currentTransport > 1 && nextTransport > 1) {
      // Both exist, interpolate
      x = startPos.x + (endPos.x - startPos.x) * progress;
      y = startPos.y + (endPos.y - startPos.y) * progress;
    } else if (currentTransport > 1) {
      // Fading out - stay at start position
      x = startPos.x;
      y = startPos.y;
    } else {
      // Fading in - stay at end position
      x = endPos.x;
      y = endPos.y;
    }

    const drawAt = (transport: number, opacity: number, scale: number) => {
      this._ctx.save();
      this._ctx.translate(x, y);

      // Handle rotation/mirror for text (keep upright)
      if (this._mirror) this._ctx.scale(-1, 1);
      if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

      this._ctx.globalAlpha = opacity;
      // We can apply scale here too
      this._ctx.scale(scale, scale);

      // Match styles from drawTransposeIndicator
      const textColor = this._colors.textColor || '#FFFFFF';
      // Use logic for color based on start/end pos? 
      // Ideally interpolate color, but start/end might be different (Barre vs Non-Barre).
      // For simplicity, use white if EITHER is barre, or just primary.
      // Let's us textColor for now or white.
      // Actually, static uses: barreInfo ? fingers.textColor : primary.

      // We will use primary text color for simplicity in transition 
      // or we can strictly match the 'current' state?
      // Let's use primaryTextColor with fallback.
      this._ctx.fillStyle = textColor;

      const fontSize = 36 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";

      this._ctx.fillText(`${transport}ª`, -60, 0); // Include user's manual offset
      this._ctx.restore();
    };

    if (currentTransport > 1 && nextTransport > 1) {
      // Morphing number? Or just cross-fade if different?
      // If numbers are different, cross-fade. If same, just move.
      if (currentTransport === nextTransport) {
        drawAt(currentTransport, 1, 1);
      } else {
        drawAt(currentTransport, 1 - progress, 1);
        drawAt(nextTransport, progress, 1);
      }
    } else if (currentTransport > 1 && nextTransport <= 1) {
      // Fade out
      drawAt(currentTransport, 1 - progress, 1 - (progress * 0.5));
    } else if (currentTransport <= 1 && nextTransport > 1) {
      // Fade in
      drawAt(nextTransport, progress, 0.5 + (progress * 0.5));
    }
  }

  private _drawTextWithTransform(text: string, opacity: number, scale: number, translateY: number, centerX: number, centerY: number): void {
    this._ctx.save();
    this._ctx.globalAlpha = opacity;
    this._ctx.translate(centerX, centerY + translateY);
    this._ctx.scale(scale, scale);

    this._ctx.fillStyle = this._colors.chordNameColor;
    const fontSize = 75 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(text, 0, 0);
    this._ctx.restore();
  }
}
