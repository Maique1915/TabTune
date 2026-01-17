import type { FretboardTheme } from "@/modules/core/domain/types";

export class FretboardDrawer {
  private _ctx: CanvasRenderingContext2D;
  private _colors: FretboardTheme;
  private _dimensions: { width: number; height: number };

  // Diagram settings
  private _diagramWidth: number;
  private _diagramHeight: number;
  private _diagramX: number;
  private _diagramY: number;
  private _numStrings: number;
  private _numFrets: number;
  private _horizontalPadding: number;
  private _stringSpacing: number;

  // Fretboard settings
  private _fretboardX: number;
  private _fretboardY: number;
  private _fretboardWidth: number;
  private _fretboardHeight: number;
  private _realFretSpacing: number;

  // Visual settings
  private _neckRadius: number;
  private _stringNamesY: number;
  private _scaleFactor: number;
  private _rotation: number = 0;
  private _mirror: boolean = false;

  // Conditional Rendering Flags
  private _showNut: boolean = true;
  private _showHeadBackground: boolean = true;
  private _headstockGap: number = 0;
  private _showCapo: boolean = false;
  private _capoFret: number = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    colors: FretboardTheme,
    dimensions: { width: number; height: number },
    diagramSettings: {
      diagramWidth: number;
      diagramHeight: number;
      diagramX: number;
      diagramY: number;
      numStrings: number;
      numFrets: number;
      horizontalPadding: number;
      stringSpacing: number;
      fretboardX: number;
      fretboardY: number;
      fretboardWidth: number;
      fretboardHeight: number;
      realFretSpacing: number;
      neckRadius: number;
      stringNamesY: number;
    },
    scaleFactor: number = 1 // Adicionar scaleFactor como parâmetro do construtor
  ) {
    this._ctx = ctx;
    this._colors = colors;
    this._dimensions = dimensions;
    this._scaleFactor = scaleFactor; // Inicializar scaleFactor

    // Set diagram settings from the provided object
    this._diagramWidth = diagramSettings.diagramWidth;
    this._diagramHeight = diagramSettings.diagramHeight;
    this._diagramX = diagramSettings.diagramX;
    this._diagramY = diagramSettings.diagramY;
    this._numStrings = diagramSettings.numStrings;
    this._numFrets = diagramSettings.numFrets;
    this._horizontalPadding = diagramSettings.horizontalPadding;
    this._stringSpacing = diagramSettings.stringSpacing;
    this._fretboardX = diagramSettings.fretboardX;
    this._fretboardY = diagramSettings.fretboardY;
    this._fretboardWidth = diagramSettings.fretboardWidth;
    this._fretboardHeight = diagramSettings.fretboardHeight;
    this._realFretSpacing = diagramSettings.realFretSpacing;
    this._neckRadius = diagramSettings.neckRadius;
    this._stringNamesY = diagramSettings.stringNamesY;
  }

  private calculateDimensions(
    width: number,
    height: number,
    numStrings: number,
    numFrets: number,
    scaleFactor: number
  ): void {
    this._diagramWidth = width;
    this._diagramHeight = height;
    this._scaleFactor = scaleFactor;

    // For SHORT NECK mode, reserve space at top for header
    const headerSpace = numFrets <= 6 ? 120 * scaleFactor : 0;

    // Adjust available height for fretboard
    const availableHeight = height - headerSpace;

    this._horizontalPadding = 55 * scaleFactor;
    this._fretboardWidth = width - this._horizontalPadding * 2;
    this._fretboardHeight = availableHeight * 0.8;

    this._stringSpacing = this._fretboardWidth / (numStrings - 1);
    this._realFretSpacing = this._fretboardHeight / numFrets;

    this._fretboardX = this._horizontalPadding;
    // Start fretboard lower when in SHORT NECK mode
    this._fretboardY = headerSpace + (availableHeight - this._fretboardHeight) / 2;

    this._diagramX = 0;
    this._diagramY = this._fretboardY;

    this._neckRadius = 20 * scaleFactor;
    this._stringNamesY = this._fretboardY - 40 * scaleFactor;
  }
  public setDiagramX(diagramX: number): void {
    this._diagramX = diagramX;
    this._fretboardX = diagramX;
  }
  public setDiagramY(diagramY: number): void {
    this._diagramY = diagramY;
    this._fretboardY = this._diagramY + (75 * this._scaleFactor); // Recalculate based on current scaleFactor
    this._stringNamesY = this._diagramY + (40 * this._scaleFactor); // Also depends on _diagramY
  }

  public setTransforms(rotation: 0 | 90 | 270, mirror: boolean) {
    this._rotation = rotation;
    this._mirror = mirror;
  }

  public setNumStrings(num: number): void {
    this._numStrings = num;
  }

  public setNumFrets(num: number): void {
    this._numFrets = num;
  }

  public setScaleFactor(scale: number): void {
    this._scaleFactor = scale;
  }

  public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
    this._showNut = showNut;
    this._showHeadBackground = showHeadBackground;
  }

  public setHeadstockGap(gap: number): void {
    this._headstockGap = gap;
  }

  public setCapo(show: boolean, fret: number = 0): void {
    this._showCapo = show;
    this._capoFret = fret;
  }

  public setStringNames(names: string[] | undefined): void {
    // We'll use this in drawStringNames
  }

  public setStringSpacing(spacing: number): void {
    this._stringSpacing = spacing;
  }

  public setFretboardWidth(width: number): void {
    this._fretboardWidth = width;
    this._diagramWidth = width; // Usually same
  }

  public setHorizontalPadding(padding: number): void {
    this._horizontalPadding = padding;
  }


  public setColors(colors: FretboardTheme): void {
    this._colors = colors;
  }

  public setDimensions(dimensions: { width: number; height: number }): void {
    this._dimensions = dimensions;
  }

  public setCtx(ctx: CanvasRenderingContext2D): void {
    this._ctx = ctx;
  }
  /**
   * Função de easing cúbico (easeInOutQuad) para transições suaves.
   * t: current time (progress from 0 to 1)
   */
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Desenha o braço do violão
   */
  drawNeck(): void {
    this._ctx.save();
    const isShortNeck = this._numFrets <= 6;
    const neckX = this._diagramX;
    const neckWidth = this._diagramWidth;

    if (isShortNeck) {
      const radius = 24 * this._scaleFactor;
      const extraBottomPadding = 40 * this._scaleFactor;

      // 1. CABEÇA (Headstock) - Largura igual ao braço e mais separada
      const headWidth = this._diagramWidth;
      const headX = this._diagramX;
      const headY = this._diagramY;
      // Altura reduzida para criar maior espaço de separação (gap = 45)
      const headHeight = 55 * this._scaleFactor;

      this._ctx.fillStyle = this._colors.fretboardColor; // Cor do tema para a cabeça
      this._ctx.beginPath();
      // Ambos os cantos superiores arredondados de forma igual
      this._ctx.roundRect(headX, headY, headWidth, headHeight, [radius, radius, 0, 0]);
      this._ctx.fill();

      // 2. BRAÇO (Neck)
      const neckWidth = this._diagramWidth;
      const neckX = this._diagramX;
      // O braço começa no Nut (fretboardY), criando o vão solicitado
      const neckY = this._fretboardY;
      const neckHeight = (this._diagramHeight - (this._fretboardY - this._diagramY)) + extraBottomPadding;

      this._ctx.fillStyle = this._colors.fretboardColor;
      this._ctx.beginPath();
      // Cantos inferiores arredondados para acabamento de card
      this._ctx.roundRect(neckX, neckY, neckWidth, neckHeight, [0, 0, radius, radius]);
      this._ctx.fill();
    } else {
      this._ctx.fillStyle = this._colors.fretboardColor;
      const neckY = this._diagramY;
      const neckHeight = this._diagramHeight;
      this._ctx.beginPath();
      // Lógica original para braço completo (Full Neck)
      if (this._showHeadBackground) {
        this._ctx.moveTo(neckX + this._neckRadius, neckY);
        this._ctx.lineTo(neckX + neckWidth - this._neckRadius, neckY);
        this._ctx.quadraticCurveTo(neckX + neckWidth, neckY, neckX + neckWidth, neckY + this._neckRadius);
      } else {
        this._ctx.moveTo(neckX, neckY);
        this._ctx.lineTo(neckX + neckWidth, neckY);
        this._ctx.lineTo(neckX + neckWidth, neckY + this._neckRadius);
      }

      // Lateral Direita
      this._ctx.lineTo(neckX + neckWidth, neckY + neckHeight - this._neckRadius);

      // Canto Inferior Direito
      this._ctx.quadraticCurveTo(neckX + neckWidth, neckY + neckHeight, neckX + neckWidth - this._neckRadius, neckY + neckHeight);
      this._ctx.lineTo(neckX + this._neckRadius, neckY + neckHeight);

      // Canto Inferior Esquerdo
      this._ctx.quadraticCurveTo(neckX, neckY + neckHeight, neckX, neckY + neckHeight - this._neckRadius);

      // Lateral Esquerda
      this._ctx.lineTo(neckX, neckY + (this._showHeadBackground ? this._neckRadius : 0));

      // Canto Superior Esquerdo
      if (this._showHeadBackground) {
        this._ctx.quadraticCurveTo(neckX, neckY, neckX + this._neckRadius, neckY);
      }
      this._ctx.closePath();
      this._ctx.fill();
    }

    this._ctx.restore();
  }

  /**
   * Desenha os nomes das cordas
   */
  drawStringNames(progress: number = 1, customNames?: string[]): void {
    const easedProgress = this.easeInOutQuad(progress);
    const namesToDraw = customNames || ["E", "A", "D", "G", "B", "e"];
    const isShortNeck = this._numFrets <= 6;

    this._ctx.save();

    if (isShortNeck) {
      // Para SHORT_NECK, desenhamos os nomes usando a cor de texto do tema (Orange no padrão)
      this._ctx.fillStyle = this._colors.textColor;
      this._ctx.globalAlpha = easedProgress;

      const fontSize = 28 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";

      // Centralizado no box da cabeça (headHeight = 30)
      const headHeight = 55 * this._scaleFactor;
      const headerCenterY = this._diagramY + (headHeight / 2);

      namesToDraw.forEach((name, i) => {
        if (i >= this._numStrings) return;
        const stringX = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;

        this._ctx.save();
        this._ctx.translate(stringX, headerCenterY);
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(name, 0, 0);
        this._ctx.restore();
      });
    } else {
      // Original rendering for FULL NECK
      const translateY = (1 - easedProgress) * (-10 * this._scaleFactor);

      this._ctx.fillStyle = this._colors.textColor;
      const fontSize = 40 * this._scaleFactor;
      this._ctx.font = `bold ${fontSize}px sans-serif`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";

      namesToDraw.forEach((name, i) => {
        if (i >= this._numStrings) return;
        const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;

        this._ctx.save();
        this._ctx.translate(x, this._stringNamesY + translateY - this._headstockGap);
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(name, 0, 0);
        this._ctx.restore();
      });
    }
    this._ctx.restore();
  }

  /**
   * Desenha o capotraste (capo) entre a cabeça e o braço
   */
  drawCapo(): void {
    if (!this._showCapo) return;

    this._ctx.save();

    const capoWidth = this._fretboardWidth + (this._horizontalPadding * 0.5);
    const capoHeight = 40 * this._scaleFactor;
    const capoX = this._fretboardX + (this._fretboardWidth / 2) - (capoWidth / 2);
    // Position capo in the gap, just below the headstock
    const capoY = this._stringNamesY - (this._headstockGap / 2) - (capoHeight / 2);
    const cornerRadius = 12 * this._scaleFactor;

    // Draw capo background
    this._ctx.fillStyle = this._colors.cardColor; // Usar cardColor para o corpo do capotraste
    this._ctx.beginPath();
    this._ctx.roundRect(capoX, capoY, capoWidth, capoHeight, cornerRadius);
    this._ctx.fill();

    // Draw "CAPO" text
    this._ctx.fillStyle = this._colors.textColor; // Usar textColor (Laranja no Midnight) para o texto
    const fontSize = 28 * this._scaleFactor;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    this._ctx.save();
    this._ctx.translate(capoX + (capoWidth / 2), capoY + (capoHeight / 2));
    if (this._mirror) this._ctx.scale(-1, 1);
    if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
    this._ctx.fillText("CAPO", 0, 0);
    this._ctx.restore();

    this._ctx.restore();
  }

  /**
   * Desenha as cordas
   */
  drawStrings(): void {
    if (this._colors.borderWidth <= 0) return;
    const isShortNeck = this._numFrets <= 6;

    this._ctx.save();
    // Usar borderColor do tema para as cordas
    this._ctx.strokeStyle = this._colors.borderColor;
    this._ctx.lineWidth = isShortNeck ? 2 * this._scaleFactor : this._colors.stringThickness;

    for (let i = 0; i < this._numStrings; i++) {
      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
      const startY = this._fretboardY;
      const endY = this._fretboardY + this._fretboardHeight;

      this._ctx.beginPath();
      this._ctx.moveTo(x, startY);
      this._ctx.lineTo(x, endY);
      this._ctx.stroke();
    }
    this._ctx.restore();
  }

  /**
   * Desenha os trastes
   */
  drawFrets(): void {
    this._ctx.save();
    this._ctx.strokeStyle = this._colors.fretColor;
    const isShortNeck = this._numFrets <= 6;

    for (let i = 0; i <= this._numFrets; i++) {
      const y = this._fretboardY + i * this._realFretSpacing;

      if (isShortNeck) {
        // Trastes uniformes usando fretColor do tema
        this._ctx.lineWidth = 2 * this._scaleFactor;
        this._ctx.strokeStyle = this._colors.fretColor;
        this._ctx.beginPath();
        this._ctx.moveTo(this._fretboardX, y);
        this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y);
        this._ctx.stroke();
      } else {
        // Nut (i=0) is drawn thick only if showNut is true
        this._ctx.lineWidth = (i === 0 && this._showNut) ? (this._colors.borderWidth * 8) : this._colors.borderWidth;
        this._ctx.strokeStyle = this._colors.fretColor;
        this._ctx.beginPath();
        this._ctx.moveTo(this._fretboardX, y);
        this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y);
        this._ctx.stroke();
      }
    }
    this._ctx.restore();
  }

  /**
   * Desenha o fretboard completo (braço + nomes + cordas + trastes)
   */
  drawFretboard(): void {
    this.drawNeck();
    this.drawStringNames(1); // Pass 1 for static drawing
    this.drawFrets();
    this.drawStrings();
  }

  /**
   * Desenha o braço progressivamente de cima para baixo
   */
  drawNeckProgressive(progress: number): void {
    const easedProgress = this.easeInOutQuad(progress);
    const neckX = this._diagramX;
    const neckY = this._diagramY;
    const neckWidth = this._diagramWidth;
    const neckHeight = this._diagramHeight * easedProgress;

    this._ctx.save();
    this._ctx.fillStyle = this._colors.fretboardColor;
    this._ctx.beginPath();
    this._ctx.moveTo(neckX + this._neckRadius, neckY);
    this._ctx.lineTo(neckX + neckWidth - this._neckRadius, neckY);
    this._ctx.quadraticCurveTo(neckX + neckWidth, neckY, neckX + neckWidth, neckY + this._neckRadius);
    this._ctx.lineTo(neckX + neckWidth, neckY + neckHeight);
    this._ctx.lineTo(neckX, neckY + neckHeight);
    this._ctx.lineTo(neckX, neckY + this._neckRadius);
    this._ctx.quadraticCurveTo(neckX, neckY, neckX + this._neckRadius, neckY);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
  }

  /**
   * Desenha as cordas progressivamente de cima para baixo
   */
  drawStringsProgressive(progress: number): void {
    if (this._colors.borderWidth <= 0) return;

    const easedProgress = this.easeInOutQuad(progress);
    const fretboardHeight = this._fretboardHeight * easedProgress;

    this._ctx.save();
    this._ctx.strokeStyle = this._colors.borderColor;
    this._ctx.lineWidth = this._colors.stringThickness;

    for (let i = 0; i < this._numStrings; i++) {
      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
      this._ctx.beginPath();
      this._ctx.moveTo(x, this._fretboardY);
      this._ctx.lineTo(x, this._fretboardY + fretboardHeight);
      this._ctx.stroke();
    }
    this._ctx.restore();
  }

  /**
   * Desenha os trastes um por um
   */
  drawFretsProgressive(progress: number): void {
    const easedProgress = this.easeInOutQuad(progress);
    const numFrets = this._numFrets + 1; // Incluindo o nut
    const fretsToDraw = Math.floor(easedProgress * numFrets);

    this._ctx.save();
    this._ctx.strokeStyle = this._colors.fretColor;

    for (let i = 0; i <= fretsToDraw && i <= this._numFrets; i++) {
      const y = this._fretboardY + i * this._realFretSpacing;
      // Nut (i=0) is drawn thick only if showNut is true
      this._ctx.lineWidth = (i === 0 && this._showNut) ? (this._colors.borderWidth * 8) : this._colors.borderWidth;

      // Se for o último traste sendo desenhado, pode estar parcial
      const isLastFret = i === fretsToDraw;
      const currentFretProgress = isLastFret ? (easedProgress * numFrets - fretsToDraw) : 1;

      this._ctx.globalAlpha = currentFretProgress;
      const translateY = (1 - currentFretProgress) * (-5 * this._scaleFactor); // Scaled Subtle slide in from top

      this._ctx.beginPath();
      this._ctx.moveTo(this._fretboardX, y + translateY);
      this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y + translateY);
      this._ctx.stroke();
    }
    this._ctx.restore();
  }

  /**
   * Desenha o fretboard com animação progressiva
   */
  drawAnimatedFretboard(phases: {
    neckProgress: number;
    stringNamesProgress: number;
    stringsProgress: number;
    fretsProgress: number;
    nutProgress: number;
  }): void {
    // Desenhar braço progressivamente
    if (phases.neckProgress > 0) {
      this.drawNeckProgressive(phases.neckProgress);
    }

    // Desenhar nomes das cordas com fade
    if (phases.stringNamesProgress > 0) {
      this.drawStringNames(phases.stringNamesProgress);
    }


    // Desenhar trastes progressivamente
    if (phases.fretsProgress > 0) {
      this.drawFretsProgressive(phases.fretsProgress);
    }

    // Desenhar cordas progressivamente
    if (phases.stringsProgress > 0) {
      this.drawStringsProgressive(phases.stringsProgress);
    }

  }
}