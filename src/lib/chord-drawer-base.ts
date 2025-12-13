import { getNome } from "@/lib/chords";
import { FretboardDrawer } from "./fretboard-drawer";

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

  // Configurações do diagrama
  private _diagramWidth: number = 600;
  private _diagramHeight: number = 0;
  private _diagramX: number = 0;
  private _diagramY: number = 0;
  private _numStrings: number = 6;
  private _numFrets: number = 4;
  private _horizontalPadding: number = 40;
  private _stringSpacing: number = 0;

  // Configurações do fretboard
  private _fretboardX: number = 0;
  private _fretboardY: number = 0;
  private _fretboardWidth: number = 0;
  private _fretboardHeight: number = 0;
  private _realFretSpacing: number = 0;

  // Configurações visuais
  private _neckRadius: number = 30;
  private _fingerRadius: number = 45;
  private _barreWidth: number = 90;
  private _stringNamesY: number = 0;


  constructor(
    ctx: CanvasRenderingContext2D,
    colors: ChordDiagramColors,
    dimensions: { width: number; height: number }
  ) {
    this._ctx = ctx;
    this._colors = colors;
    this._dimensions = dimensions;
    this._calculateDimensions();

    this.fretboardDrawer = new FretboardDrawer(ctx, colors, dimensions, {
      diagramWidth: this._diagramWidth,
      diagramHeight: this._diagramHeight,
      diagramX: this._diagramX,
      diagramY: this._diagramY,
      numStrings: this._numStrings,
      numFrets: this._numFrets,
      horizontalPadding: this._horizontalPadding,
      stringSpacing: this._stringSpacing,
      fretboardX: this._fretboardX,
      fretboardY: this._fretboardY,
      fretboardWidth: this._fretboardWidth,
      fretboardHeight: this._fretboardHeight,
      realFretSpacing: this._realFretSpacing,
      neckRadius: this._neckRadius,
      stringNamesY: this._stringNamesY,
    });
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
    return this._diagramWidth;
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
    return this._horizontalPadding;
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
    return this._neckRadius;
  }

  get fingerRadius(): number {
    return this._fingerRadius;
  }

  get barreWidth(): number {
    return this._barreWidth;
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

  set diagramWidth(value: number) {
    this._diagramWidth = value;
    this._calculateDimensions();
  }

  set neckRadius(value: number) {
    this._neckRadius = value;
  }

  set fingerRadius(value: number) {
    this._fingerRadius = value;
  }

  set barreWidth(value: number) {
    this._barreWidth = value;
  }

  set horizontalPadding(value: number) {
    this._horizontalPadding = value;
    this._calculateDimensions();
  }

  // ============ MÉTODOS UTILITÁRIOS ============

  /**
   * Calcula todas as dimensões baseadas nos atributos atuais
   */
  private _calculateDimensions(): void {
    this._diagramHeight = this._diagramWidth + (this._diagramWidth * 2 / 5);
    this._diagramX = 0; // Desenhar a partir de (0,0) - translate já posiciona
    this._diagramY = 0;

    const stringAreaWidth = this._diagramWidth - (this._horizontalPadding * 2);
    this._stringSpacing = stringAreaWidth / (this._numStrings - 1);

    this._fretboardX = this._diagramX;
    this._fretboardY = this._diagramY + 75;
    this._fretboardWidth = this._diagramWidth;
    this._fretboardHeight = this._diagramHeight - 75;
    this._realFretSpacing = this._fretboardHeight / (1 + this._numFrets);

    this._stringNamesY = this._diagramY + 40;
  }

  /**
   * Recalcula dimensões com offset X (usado no carousel)
   */
  calculateWithOffset(offsetX: number): void {
    this._diagramX = (this._dimensions.width / 2) - (this._diagramWidth / 2) + offsetX;
    this._fretboardX = this._diagramX;
  }

  /**
   * Aplica centralização no canvas
   * Retorna para onde o contexto foi centralizado
   */
  applyCentering(): { x: number; y: number } {
    const centerX = this._dimensions.width / 2 - this._diagramWidth / 2;
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

  /**
   * Transpõe acorde para exibição
   */
  transposeForDisplay(chord: ChordDiagramProps): { finalChord: ChordDiagramProps; transportDisplay: number } {
    const { positions, nut, avoid } = chord;

    const findMinNonZeroNote = (): [number, number] => {
      let min = Infinity;
      let max = 0;

      if (nut && nut.vis) {
        min = nut.pos;
      }

      Object.entries(positions).forEach(([str, [fret]]) => {
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
      return { finalChord: chord, transportDisplay: 1 };
    }

    const transposition = (nut && nut.vis) ? nut.pos - 1 : minFret > 0 ? minFret - 1 : 0;

    const newPositions: Position = {};
    for (const string in positions) {
      const [fret, finger, add] = positions[string];
      newPositions[string] = [fret > 0 ? fret - transposition : 0, finger, add];
    }

    const newBarre = chord.barre ? [chord.barre[0] - transposition, chord.barre[1]] as [number, number] : undefined;

    const finalChord = { ...chord, positions: newPositions, barre: newBarre };

    return { finalChord, transportDisplay: transposition + 1 };
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
    const fontSize = 80;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    const nameX = this._diagramX + this._diagramWidth / 2 + offsetX;
    const nameY = this._diagramY - 60;
    this._ctx.fillText(chordName, nameX, nameY);
  }

  /**
   * Desenha o fretboard completo (braço + nomes + cordas + trastes)
   */
  drawFretboard(): void {
    this.fretboardDrawer.drawFretboard();
  }

  /**
   * Desenha pestana (barre)
   */
  drawBarre(barre: [number, number]): void {
    const fretY = this._fretboardY + (barre[0] - 0.5) * this._realFretSpacing;
    const fromX = this._fretboardX + this._horizontalPadding + barre[1] * this._stringSpacing;
    const toX = this._fretboardX + this._horizontalPadding + (this._numStrings - 1 - barre[1]) * this._stringSpacing;

    this._ctx.strokeStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.lineWidth = this._barreWidth;
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
    const x = this._fretboardX + this._horizontalPadding + stringIndex * this._stringSpacing;
    const y = this._fretboardY + (fret - 0.5) * this._realFretSpacing;

    // Círculo do dedo
    this._ctx.beginPath();
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.arc(x, y, this._fingerRadius, 0, Math.PI * 2);
    this._ctx.fill();

    // Borda
    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    // Número do dedo
    this._ctx.fillStyle = this._colors.fingerTextColor;
    const fontSize = this._realFretSpacing * 0.4;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(String(finger), x, y);
  }

  /**
   * Desenha todos os dedos de um acorde
   */
  drawFingers(positions: Position): void {
    Object.entries(positions).forEach(([key, [fret, finger]]) => {
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

    const fontSize = 50;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    for (let i = 0; i < this._numStrings; i++) {
      const stringNumber = i + 1;
      if (avoid.includes(stringNumber)) {
        const y = this._diagramY + this._diagramHeight + this._realFretSpacing * 0.4;
        const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
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

    this._ctx.fillStyle = this._colors.textColor;
    const fontSize = 60;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "right";
    this._ctx.fillText(
      `${transportDisplay}ª`,
      this._fretboardX - this._realFretSpacing,
      this._fretboardY + (this._realFretSpacing / 2)
    );
  }

  /**
   * Desenha um dedo individual em uma posição específica, com opacidade e escala (para animações)
   * Espera que o contexto já esteja transladado e escalado.
   */
  drawFingerAtPosition(fingerNumber: number): void {
    // Círculo
    this._ctx.beginPath();
    this._ctx.fillStyle = this.hexToRgba(this._colors.fingerColor, this._colors.fingerBackgroundAlpha);
    this._ctx.arc(0, 0, this._fingerRadius, 0, Math.PI * 2);
    this._ctx.fill();

    // Borda
    if (this._colors.fingerBorderWidth > 0) {
      this._ctx.strokeStyle = this._colors.fingerBorderColor;
      this._ctx.lineWidth = this._colors.fingerBorderWidth;
      this._ctx.stroke();
    }

    // Número
    this._ctx.fillStyle = this._colors.fingerTextColor;
    this._ctx.font = "bold 50px sans-serif";
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
      chordName: Math.min(progress / 0.1, 1),
      
      // Fase 2 (0.1-0.3): Braço do violão
      neck: Math.max(0, Math.min((progress - 0.1) / 0.2, 1)),
      
      // Fase 3 (0.3-0.4): Nomes das cordas
      stringNames: Math.max(0, Math.min((progress - 0.3) / 0.1, 1)),
      
      // Fase 4 (0.4-0.5): Cordas
      strings: Math.max(0, Math.min((progress - 0.4) / 0.1, 1)),
      
      // Fase 5 (0.5-0.65): Trastes (um por um)
      frets: Math.max(0, Math.min((progress - 0.5) / 0.15, 1)),
      
      // Fase 6 (0.65-0.75): Pestana
      nut: Math.max(0, Math.min((progress - 0.65) / 0.1, 1)),
      
      // Fase 7 (0.75-0.9): Dedos
      fingers: Math.max(0, Math.min((progress - 0.75) / 0.15, 1)),
      
      // Fase 8 (0.9-0.95): Cordas evitadas
      avoided: Math.max(0, Math.min((progress - 0.9) / 0.05, 1)),
      
      // Fase 9 (0.95-1.0): Indicador de transposição
      transpose: Math.max(0, Math.min((progress - 0.95) / 0.05, 1)),
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
      const scale = 1.5 - (phases.fingers * 0.5); // Zoom in: 1.5 -> 1
      
      Object.entries(finalChord.positions).forEach(([key, [fret, finger]]) => {
        const stringIndex = Number(key) - 1;
        if (fret > 0 && finger) {
          const x = this._fretboardX + this._horizontalPadding + stringIndex * this._stringSpacing;
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
      const scale = 1.5 - (phases.avoided * 0.5); // Zoom in: 1.5 -> 1
      
      for (let i = 0; i < this._numStrings; i++) {
        const stringNumber = i + 1;
        if (finalChord.avoid.includes(stringNumber)) {
          const y = this._diagramY + this._diagramHeight + this._realFretSpacing * 0.4;
          const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
          
          this._ctx.save();
          this._ctx.translate(x, y);
          this._ctx.scale(scale, scale);
          this._ctx.fillStyle = this._colors.textColor;
          const fontSize = 50;
          this._ctx.font = `bold ${fontSize}px sans-serif`;
          this._ctx.textAlign = "center";
          this._ctx.textBaseline = "middle";
          this._ctx.fillText("x", 0, 0);
          this._ctx.restore();
        }
      }
      this._ctx.restore();
    }

    // Fase 9: Indicador de transposição com fade
    if (phases.transpose > 0) {
      this._ctx.save();
      this._ctx.globalAlpha = phases.transpose;
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
    progress: number,
    offsetX: number = 0
  ): void {
    if (offsetX !== 0) {
      this.calculateWithOffset(offsetX);
    }

    const { finalChord: current, transportDisplay: currentTransport } = this.transposeForDisplay(currentChord);
    const { finalChord: next, transportDisplay: nextTransport } = this.transposeForDisplay(nextChord);
    
    const currentName = getNome(current.chord).replace(/#/g, "♯").replace(/b/g, "♭");
    const nextName = getNome(next.chord).replace(/#/g, "♯").replace(/b/g, "♭");

    // Nome do acorde: zoom out do antigo e zoom in do novo
    this._ctx.save();
    this._ctx.globalAlpha = 1 - progress;
    const scaleOut = 1 + (progress * 0.5); // 1 -> 1.5
    this._ctx.translate(this._diagramX + this._diagramWidth / 2, this._diagramY / 2);
    this._ctx.scale(scaleOut, scaleOut);
    this._ctx.translate(-(this._diagramX + this._diagramWidth / 2), -(this._diagramY / 2));
    this.drawChordName(currentName, offsetX);
    this._ctx.restore();

    this._ctx.save();
    this._ctx.globalAlpha = progress;
    const scaleIn = 1.5 - (progress * 0.5); // 1.5 -> 1
    this._ctx.translate(this._diagramX + this._diagramWidth / 2, this._diagramY / 2);
    this._ctx.scale(scaleIn, scaleIn);
    this._ctx.translate(-(this._diagramX + this._diagramWidth / 2), -(this._diagramY / 2));
    this.drawChordName(nextName, offsetX);
    this._ctx.restore();

    // Fretboard sempre visível
    this.drawFretboard();

    // Pestana: zoom in/out ou interpolação
    this.drawBarreWithTransition(current.barre, next.barre, progress);

    // Dedos: transição de posição com zoom in/out
    this.drawFingersWithTransition(current.positions, next.positions, progress);

    // Cordas evitadas: zoom in/out
    this.drawAvoidedStringsWithTransition(current.avoid, next.avoid, progress);

    // Indicador de transposição: zoom in/out
    this.drawTransposeIndicatorWithTransition(currentTransport, nextTransport, progress);
  }

  /**
   * Desenha pestana com transição
   */
  private drawBarreWithTransition(
    currentBarre: [number, number] | undefined,
    nextBarre: [number, number] | undefined,
    progress: number
  ): void {
    if (!currentBarre && !nextBarre) return;

    if (currentBarre && nextBarre) {
      // Ambos existem - interpolar posição suavemente
      const fret = currentBarre[0] + (nextBarre[0] - currentBarre[0]) * progress;
      const fromString = currentBarre[1] + (nextBarre[1] - currentBarre[1]) * progress;
      this.drawBarre([fret, fromString]);
    } else if (currentBarre && !nextBarre) {
      // Pestana desaparece - zoom out
      this._ctx.save();
      this._ctx.globalAlpha = 1 - progress;
      const scale = 1 + (progress * 0.5); // 1 -> 1.5
      const y = this._fretboardY + (currentBarre[0] - 0.5) * this._realFretSpacing;
      const centerX = this._fretboardX + this._horizontalPadding + (this._numStrings - 1) * this._stringSpacing / 2;
      
      this._ctx.translate(centerX, y);
      this._ctx.scale(scale, scale);
      this._ctx.translate(-centerX, -y);
      this.drawBarre(currentBarre);
      this._ctx.restore();
    } else if (!currentBarre && nextBarre) {
      // Pestana aparece - zoom in
      this._ctx.save();
      this._ctx.globalAlpha = progress;
      const scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      const y = this._fretboardY + (nextBarre[0] - 0.5) * this._realFretSpacing;
      const centerX = this._fretboardX + this._horizontalPadding + (this._numStrings - 1) * this._stringSpacing / 2;
      
      this._ctx.translate(centerX, y);
      this._ctx.scale(scale, scale);
      this._ctx.translate(-centerX, -y);
      this.drawBarre(nextBarre);
      this._ctx.restore();
    }
  }

  /**
   * Desenha dedos com transição de posição
   */
  private drawFingersWithTransition(
    currentPositions: Position,
    nextPositions: Position,
    progress: number
  ): void {
    // Mapear dedos por número
    const currentFingers = new Map<number, { string: number; fret: number }>();
    const nextFingers = new Map<number, { string: number; fret: number }>();

    Object.entries(currentPositions).forEach(([key, [fret, finger]]) => {
      if (fret > 0 && finger) {
        currentFingers.set(finger, { string: Number(key) - 1, fret });
      }
    });

    Object.entries(nextPositions).forEach(([key, [fret, finger]]) => {
      if (fret > 0 && finger) {
        nextFingers.set(finger, { string: Number(key) - 1, fret });
      }
    });

    const allFingers = new Set([...currentFingers.keys(), ...nextFingers.keys()]);

    allFingers.forEach((fingerNum) => {
      const current = currentFingers.get(fingerNum);
      const next = nextFingers.get(fingerNum);

      let x: number, y: number, opacity: number, scale: number;

      if (current && next) {
        // Dedo existe em ambos - interpolar posição
        const currentX = this._fretboardX + this._horizontalPadding + current.string * this._stringSpacing;
        const currentY = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        const nextX = this._fretboardX + this._horizontalPadding + next.string * this._stringSpacing;
        const nextY = this._fretboardY + (next.fret - 0.5) * this._realFretSpacing;

        x = currentX + (nextX - currentX) * progress;
        y = currentY + (nextY - currentY) * progress;
        opacity = 1;
        scale = 1;
      } else if (current && !next) {
        // Dedo desaparece - zoom out
        x = this._fretboardX + this._horizontalPadding + current.string * this._stringSpacing;
        y = this._fretboardY + (current.fret - 0.5) * this._realFretSpacing;
        opacity = 1 - progress;
        scale = 1 + (progress * 0.5); // 1 -> 1.5
      } else if (!current && next) {
        // Dedo aparece - zoom in
        x = this._fretboardX + this._horizontalPadding + next.string * this._stringSpacing;
        y = this._fretboardY + (next.fret - 0.5) * this._realFretSpacing;
        opacity = progress;
        scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      } else {
        return;
      }

      this._ctx.save();
      this._ctx.globalAlpha = opacity;
      this._ctx.translate(x, y);
      this._ctx.scale(scale, scale);
      this.drawFingerAtPosition(fingerNum);
      this._ctx.restore();
    });
  }

  /**
   * Desenha cordas evitadas com transição
   */
  private drawAvoidedStringsWithTransition(
    currentAvoid: number[] | undefined,
    nextAvoid: number[] | undefined,
    progress: number
  ): void {
    const current = currentAvoid || [];
    const next = nextAvoid || [];
    const allStrings = new Set([...current, ...next]);

    allStrings.forEach((stringNum) => {
      const inCurrent = current.includes(stringNum);
      const inNext = next.includes(stringNum);

      const y = this._diagramY + this._diagramHeight + this._realFretSpacing * 0.4;
      const x = this._fretboardX + this._horizontalPadding + (stringNum - 1) * this._stringSpacing;

      this._ctx.save();
      this._ctx.translate(x, y);

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
        this._ctx.restore();
        return;
      }

      this._ctx.globalAlpha = opacity;
      this._ctx.scale(scale, scale);
      this._ctx.fillStyle = this._colors.textColor;
      const fontSize = 50;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
      this._ctx.fillText("x", 0, 0);

      this._ctx.restore();
    });
  }

  /**
   * Desenha indicador de transposição com transição
   */
  private drawTransposeIndicatorWithTransition(
    currentTransport: number,
    nextTransport: number,
    progress: number
  ): void {
    const x = this._fretboardX - this._realFretSpacing;
    const y = this._fretboardY + (this._realFretSpacing / 2);

    if (currentTransport > 1 && nextTransport > 1) {
      // Ambos existem - manter visível (interpolação de texto não é suave)
      this.drawTransposeIndicator(currentTransport);
    } else if (currentTransport > 1 && nextTransport <= 1) {
      // Indicador desaparece - zoom out
      this._ctx.save();
      this._ctx.globalAlpha = 1 - progress;
      const scale = 1 + (progress * 0.5); // 1 -> 1.5
      this._ctx.translate(x, y);
      this._ctx.scale(scale, scale);
      this._ctx.translate(-x, -y);
      this.drawTransposeIndicator(currentTransport);
      this._ctx.restore();
    } else if (currentTransport <= 1 && nextTransport > 1) {
      // Indicador aparece - zoom in
      this._ctx.save();
      this._ctx.globalAlpha = progress;
      const scale = 1.5 - (progress * 0.5); // 1.5 -> 1
      this._ctx.translate(x, y);
      this._ctx.scale(scale, scale);
      this._ctx.translate(-x, -y);
      this.drawTransposeIndicator(nextTransport);
      this._ctx.restore();
    }
  }
}
