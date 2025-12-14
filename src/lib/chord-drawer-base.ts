import { getNome } from "@/lib/chords";
import { FretboardDrawer } from "./fretboard-drawer";
import type { ChordDiagramColors } from "@/app/context/app--context";
import type { ChordDiagramProps, Position } from "@/lib/types";
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

  // Configurações do diagrama (valores base não escalados)

  private _baseDiagramWidth: number = 600;

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

  private _baseFingerRadius: number = 45;

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

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value;
  }

  set colors(value: ChordDiagramColors) {
    this._colors = value;
  }

  set dimensions(value: { width: number; height: number }) {
    this._dimensions = value;
    this._calculateDimensions();
  }

  set scaleFactor(value: number) {
    this._scaleFactor = value;
    this._calculateDimensions(); // Recalculate everything based on new scale
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
    this._diagramX = 0; // Desenhar a partir de (0,0) - translate já posiciona
    this._diagramY = 0;

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
    this._diagramX = (this._dimensions.width / 2) - (this.diagramWidth / 2) + offsetX;
    this._fretboardX = this._diagramX;
  }

  /**
   * Aplica centralização no canvas
   * Retorna para onde o contexto foi centralizado
   */
  applyCentering(): { x: number; y: number } {
    const centerX = this._dimensions.width / 2 - this.diagramWidth / 2;
    const centerY = this._dimensions.height / 2 - this._diagramHeight / 2;
    this._ctx.translate(centerX, centerY);
    return { x: centerX, y: centerY };
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
    translateY: number,
    centerX: number, // Origin for scale and translate
    centerY: number  // Origin for scale and translate
  ): void {
    this._ctx.save();
    this._ctx.globalAlpha = alpha;
    this._ctx.translate(centerX, centerY + translateY);
    this._ctx.scale(scale, scale);
    this._ctx.translate(-centerX, -centerY);
    this.drawChordName(text, offsetX);
    this._ctx.restore();
  }

  /**
   * Transpõe acorde para exibição
   */
  transposeForDisplay(chord: ChordDiagramProps): { finalChord: ChordDiagramProps; transportDisplay: number } {
    const { positions, nut, avoid } = chord;

    // Alguns fluxos (ex.: `src/lib/chord-logic.ts`) já normalizam o shape para caber no diagrama
    // e expõem a casa original em `chord.transport`.
    const baseTransportDisplay = chord.transport && chord.transport > 0 ? chord.transport : 1;

    const findMinNonZeroNote = (): [number, number] => {
      let min = Infinity;
      let max = 0;

      if (nut && nut.vis) {
        min = nut.pos;
      }

      (Object.entries(positions) as Array<[string, [number, number, number]]>).forEach(([str, [fret]]) => {
        const stringNumber = parseInt(str);
        if (fret > 0 && !(avoid?.includes(stringNumber))) {
          if (fret < min) {
            min = fret;
          }
          if (fret > max) {
            max = fret;
          }
        }
      });

      return [min === Infinity ? 0 : min, max];
    };

    const [minFret, maxFret] = findMinNonZeroNote();

    if (maxFret <= 4 && (!nut || !nut.vis || nut.pos <= 4)) {
      return { finalChord: chord, transportDisplay: baseTransportDisplay };
    }

    const transposition = (nut && nut.vis) ? nut.pos - 1 : minFret > 0 ? minFret - 1 : 0;

    const newPositions: Position = {};
    for (const string in positions) {
      const [fret, finger, add] = positions[string];
      newPositions[string] = [fret > 0 ? fret - transposition : 0, finger, add];
    }

    const newBarre = chord.barre ? [chord.barre[0] - transposition, chord.barre[1]] as [number, number] : undefined;

    const finalChord = { ...chord, positions: newPositions, barre: newBarre };

    return { finalChord, transportDisplay: baseTransportDisplay + transposition };
  }

  // ============ MÉTODOS DE DESENHO ============

  /**
   * Limpa o canvas
   */
  clearCanvas(): void {
    this._ctx.fillStyle = this._colors.cardColor;
    this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
  }

  /**
   * Desenha o nome do acorde
   */
  drawChordName(chordName: string, offsetX: number = 0): void {
    this._ctx.fillStyle = this._colors.chordNameColor;
    const fontSize = 80 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    const nameX = this.diagramX + this.diagramWidth / 2 + offsetX;
    const nameY = this.diagramY - (60 * this._scaleFactor);
    this._ctx.fillText(chordName, nameX, nameY);
  }

  /**
   * Desenha pestana (barre)
   */
  drawBarre(barre: [number, number]): void {
    const fretY = this.fretboardY + (barre[0] - 0.5) * this.realFretSpacing;
    const fromX = this.fretboardX + this.horizontalPadding + barre[1] * this.stringSpacing;
    const toX = this.fretboardX + this.horizontalPadding + (this.numStrings - 1 - barre[1]) * this.stringSpacing;

    this._ctx.strokeStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.lineWidth = this.barreWidth;
    this._ctx.lineCap = "round";
    this._ctx.beginPath();
    this._ctx.moveTo(fromX, fretY);
    this._ctx.lineTo(toX, fretY);
    this._ctx.stroke();
    this._ctx.lineCap = "butt";
  }

  /**
   * Desenha um dedo individual
   */
  drawFinger(stringIndex: number, fret: number, finger: number): void {
    const x = this.fretboardX + this.horizontalPadding + stringIndex * this.stringSpacing;
    const y = this.fretboardY + (fret - 0.5) * this.realFretSpacing;

    // Círculo do dedo
    this._ctx.beginPath();
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.arc(x, y, this.fingerRadius, 0, Math.PI * 2);
    this._ctx.fill();

    // Borda
    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    // Número do dedo
    this._ctx.fillStyle = this._colors.fingerTextColor;
    const fontSize = 50 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(String(finger), x, y);
  }

  /**
   * Desenha o fretboard completo (delegado para FretboardDrawer)
   */
  drawFretboard(): void {
    this.fretboardDrawer.drawFretboard();
  }

  /**
   * Desenha todos os dedos de um acorde
   */
  drawFingers(positions: Position): void {
    (Object.entries(positions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      const stringIndex = Number(key) - 1;
      if (fret > 0 && finger) {
        this.drawFinger(stringIndex, fret, finger);
      }
    });
  }

  /**
   * Desenha X nas cordas evitadas
   */
  drawAvoidedStrings(avoid: number[] | undefined): void {
    if (!avoid) return;

    const fontSize = 50 * this._scaleFactor;
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
    // Círculo
    this._ctx.beginPath();
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.arc(0, 0, this.fingerRadius, 0, Math.PI * 2);
    this._ctx.fill();

    // Borda
    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    // Número
    this._ctx.fillStyle = this._colors.fingerTextColor;
    const fontSize = 50 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(String(fingerNumber), 0, 0);
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
   * Desenha um acorde completo
   */
  drawChord(chord: ChordDiagramProps, offsetX: number = 0): void {
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    const { finalChord, transportDisplay } = this.transposeForDisplay(chord);
    const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

    this.drawChordName(chordName, offsetX);
    this.drawFretboard();

    if (finalChord.barre && finalChord.barre[0] > 0) {
      this.drawBarre(finalChord.barre);
    }

    this.drawFingers(finalChord.positions);
    this.drawAvoidedStrings(finalChord.avoid);
    this.drawTransposeIndicator(transportDisplay);
  }

  /**
   * Desenha um acorde completo com animação build-in (progressiva)
   * @param chord - Acorde a ser desenhado
   * @param progress - Progresso da animação (0-1)
   * @param offsetX - Deslocamento horizontal
   */
  drawChordWithBuildAnimation(chord: ChordDiagramProps, progress: number, offsetX: number = 0): void {
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    const { finalChord, transportDisplay } = this.transposeForDisplay(chord);
    const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");
    const phases = this.calculateAnimationPhases(progress);

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
    if (phases.neck > 0) {
      this.fretboardDrawer.drawAnimatedFretboard({
        neckProgress: phases.neck,
        stringNamesProgress: phases.stringNames,
        stringsProgress: phases.strings,
        fretsProgress: phases.frets,
        nutProgress: phases.nut,
      });
    }

    // Fase 6: Pestana (barre)
    if (phases.nut > 0 && finalChord.barre && finalChord.barre[0] > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.nut;
      this.drawBarre(finalChord.barre);
      this._ctx.restore();
    }

    // Fase 7: Dedos com zoom in
    if (phases.fingers > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.fingers;
      const scale = 0.5 + (phases.fingers * 0.5); // Start at 0.5, grow to 1

      (Object.entries(finalChord.positions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
        const stringIndex = Number(key) - 1;
        if (fret > 0 && finger) {
          const x = this._fretboardX + this.horizontalPadding + stringIndex * this._stringSpacing;
          const y = this._fretboardY + (fret - 0.5) * this._realFretSpacing;

          this._ctx.save();
          this._ctx.translate(x, y);
          this._ctx.scale(scale, scale);
          this.drawFingerAtPosition(finger);
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
          const fontSize = 50 * this._scaleFactor;
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
    currentChord: ChordDiagramProps,
    nextChord: ChordDiagramProps,
    originalProgress: number,
    offsetX: number = 0
  ): void {
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    const { finalChord: current, transportDisplay: currentTransport } = this.transposeForDisplay(currentChord);
    const { finalChord: next, transportDisplay: nextTransport } = this.transposeForDisplay(nextChord);

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

    // Fretboard sempre visível
    this.drawFretboard();

    // Pestana: zoom in/out ou interpolação
    this.drawBarreWithTransition(current.barre, next.barre, originalProgress);

    // Dedos: transição de posição com zoom in/out
    this.drawFingersWithTransition(current.positions, next.positions, originalProgress);

    // Cordas evitadas: zoom in/out
    this.drawAvoidedStringsWithTransition(current.avoid, next.avoid, originalProgress);

    // Indicador de transposição: zoom in/out
    this.drawTransposeIndicatorWithTransition(currentTransport, nextTransport, originalProgress);
  }

  /**
   * Desenha pestana com transição
   */
  private drawBarreWithTransition(
    currentBarre: [number, number] | undefined,
    nextBarre: [number, number] | undefined,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    if (!currentBarre && !nextBarre) return;

    if (currentBarre && nextBarre) {
      // Ambos existem - interpolar posição suavemente
      const fret = currentBarre[0] + (nextBarre[0] - currentBarre[0]) * progress;
      const fromString = currentBarre[1] + (nextBarre[1] - currentBarre[1]) * progress;
      this.drawBarre([fret, fromString]);
    } else if (currentBarre && !nextBarre) {
      // Pestana desaparece - zoom out
      const scale = 1 + (progress * 0.5); // 1 -> 1.5
      const y = this._fretboardY + (currentBarre[0] - 0.5) * this._realFretSpacing;
      const centerX = this._fretboardX + this.horizontalPadding + (this._numStrings - 1) * this._stringSpacing / 2;

      withCanvasTransformAround(
        this._ctx,
        { centerX, centerY: y, opacity: 1 - progress, scale },
        () => this.drawBarre(currentBarre)
      );
    } else if (!currentBarre && nextBarre) {
      // Pestana aparece - zoom in
      const scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      const y = this._fretboardY + (nextBarre[0] - 0.5) * this._realFretSpacing;
      const centerX = this._fretboardX + this.horizontalPadding + (this._numStrings - 1) * this._stringSpacing / 2;

      withCanvasTransformAround(
        this._ctx,
        { centerX, centerY: y, opacity: progress, scale },
        () => this.drawBarre(nextBarre)
      );
    }
  }

  /**
   * Desenha dedos com transição de posição
   */
  private drawFingersWithTransition(
    currentPositions: Position,
    nextPositions: Position,
    originalProgress: number
  ): void {
    const progress = easeInOutQuad(originalProgress);

    // Mapear dedos por número
    const currentFingers = new Map<number, { string: number; fret: number }>();
    const nextFingers = new Map<number, { string: number; fret: number }>();

    (Object.entries(currentPositions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      if (fret > 0 && finger) {
        currentFingers.set(finger, { string: Number(key) - 1, fret });
      }
    });

    (Object.entries(nextPositions) as Array<[string, [number, number, number]]>).forEach(([key, [fret, finger]]) => {
      if (fret > 0 && finger) {
        nextFingers.set(finger, { string: Number(key) - 1, fret });
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
        const currentX = this._fretboardX + this.horizontalPadding + current.string * this._stringSpacing;
        const currentY = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        const nextX = this._fretboardX + this.horizontalPadding + next.string * this._stringSpacing;
        const nextY = this._fretboardY + (next.fret - 0.5) * this._realFretSpacing;

        x = currentX + (nextX - currentX) * progress;
        y = currentY + (nextY - currentY) * progress;
        opacity = 1;
        scale = 1;
        drawFingerNumber = fingerNum;
      } else if (current && !next) {
        // Dedo existe no anterior, não existe no novo: some com zoom out
        x = this._fretboardX + this.horizontalPadding + current.string * this._stringSpacing;
        y = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        opacity = 1 - progress;
        scale = 1 - (progress * 0.5); // 1.5 -> 1 (zoom out)
        drawFingerNumber = fingerNum;
      } else if (!current && next) {
        // Dedo não existe no anterior, existe no novo: aparece com zoom in
        x = this._fretboardX + this.horizontalPadding + next.string * this._stringSpacing;
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
        const fontSize = 50 * this._scaleFactor; // Scaled font size
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
