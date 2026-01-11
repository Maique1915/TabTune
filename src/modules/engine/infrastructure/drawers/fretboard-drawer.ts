import type { FretboardTheme } from "@/lib/types";

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
  private _scaleFactor: number; // Adicionar scaleFactor aqui
  private _rotation: number = 0;
  private _mirror: boolean = false;

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
    const neckX = this._diagramX;
    const neckY = this._diagramY;
    const neckWidth = this._diagramWidth;
    const neckHeight = this._diagramHeight;

    this._ctx.fillStyle = this._colors.fretboardColor;
    this._ctx.beginPath();
    this._ctx.moveTo(neckX + this._neckRadius, neckY);
    this._ctx.lineTo(neckX + neckWidth - this._neckRadius, neckY);
    this._ctx.quadraticCurveTo(neckX + neckWidth, neckY, neckX + neckWidth, neckY + this._neckRadius);
    this._ctx.lineTo(neckX + neckWidth, neckY + neckHeight - this._neckRadius);
    this._ctx.quadraticCurveTo(neckX + neckWidth, neckY + neckHeight, neckX + neckWidth - this._neckRadius, neckY + neckHeight);
    this._ctx.lineTo(neckX + this._neckRadius, neckY + neckHeight);
    this._ctx.quadraticCurveTo(neckX, neckY + neckHeight, neckX, neckY + neckHeight - this._neckRadius);
    this._ctx.lineTo(neckX, neckY + this._neckRadius);
    this._ctx.quadraticCurveTo(neckX, neckY, neckX + this._neckRadius, neckY);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
  }

  /**
   * Desenha os nomes das cordas
   */
  drawStringNames(progress: number = 1, customNames?: string[]): void {
    const easedProgress = this.easeInOutQuad(progress);
    const namesToDraw = customNames || ["E", "A", "D", "G", "B", "e"];

    this._ctx.save();
    const translateY = (1 - easedProgress) * (-10 * this._scaleFactor); // Scaled slide in from top

    this._ctx.fillStyle = this._colors.textColor;
    const fontSize = 40 * this._scaleFactor; // Scaled font size
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    namesToDraw.forEach((name, i) => {
      // Map index i to string position. 
      // Usually strings are drawn from left to right.
      if (i >= this._numStrings) return;

      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;

      // Counter-rotate text
      this._ctx.save();
      this._ctx.translate(x, this._stringNamesY + translateY);
      if (this._mirror) this._ctx.scale(-1, 1);
      if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
      this._ctx.fillText(name, 0, 0);
      this._ctx.restore();
    });
    this._ctx.restore();
  }

  /**
   * Desenha as cordas
   */
  drawStrings(): void {
    if (this._colors.borderWidth <= 0) return;

    this._ctx.save();
    this._ctx.strokeStyle = this._colors.borderColor;
    this._ctx.lineWidth = this._colors.stringThickness;

    for (let i = 0; i < this._numStrings; i++) {
      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
      this._ctx.beginPath();
      this._ctx.moveTo(x, this._fretboardY);
      this._ctx.lineTo(x, this._fretboardY + this._fretboardHeight);
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

    for (let i = 0; i <= this._numFrets; i++) {
      const y = this._fretboardY + i * this._realFretSpacing;
      this._ctx.lineWidth = i === 0 ? (this._colors.borderWidth * 8) : this._colors.borderWidth;
      this._ctx.beginPath();
      this._ctx.moveTo(this._fretboardX, y);
      this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y);
      this._ctx.stroke();
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
      this._ctx.lineWidth = i === 0 ? (this._colors.borderWidth * 8) : this._colors.borderWidth;

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