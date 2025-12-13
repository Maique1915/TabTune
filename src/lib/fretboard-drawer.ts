import type { ChordDiagramColors } from "@/app/context/app--context";

export class FretboardDrawer {
  private _ctx: CanvasRenderingContext2D;
  private _colors: ChordDiagramColors;
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

  constructor(
    ctx: CanvasRenderingContext2D,
    colors: ChordDiagramColors,
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
    }
  ) {
    this._ctx = ctx;
    this._colors = colors;
    this._dimensions = dimensions;

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

  /**
   * Desenha o braço do violão
   */
  drawNeck(): void {
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
  }

  /**
   * Desenha os nomes das cordas
   */
  drawStringNames(): void {
    const stringNames = ["E", "A", "D", "G", "B", "e"];

    this._ctx.fillStyle = this._colors.textColor;
    const fontSize = 40;
    this._ctx.font = `bold ${fontSize}px sans-serif`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    stringNames.forEach((name, i) => {
      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
      this._ctx.fillText(name, x, this._stringNamesY);
    });
  }

  /**
   * Desenha as cordas
   */
  drawStrings(): void {
    if (this._colors.borderWidth <= 0) return;

    this._ctx.strokeStyle = this._colors.borderColor;
    this._ctx.lineWidth = this._colors.stringThickness;

    for (let i = 0; i < this._numStrings; i++) {
      const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
      this._ctx.beginPath();
      this._ctx.moveTo(x, this._fretboardY);
      this._ctx.lineTo(x, this._fretboardY + this._fretboardHeight);
      this._ctx.stroke();
    }
  }

  /**
   * Desenha os trastes
   */
  drawFrets(): void {
    this._ctx.strokeStyle = this._colors.fretColor;

    for (let i = 0; i <= this._numFrets; i++) {
      const y = this._fretboardY + i * this._realFretSpacing;
      this._ctx.lineWidth = i === 0 ? (this._colors.borderWidth * 8) : this._colors.borderWidth;
      this._ctx.beginPath();
      this._ctx.moveTo(this._fretboardX, y);
      this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y);
      this._ctx.stroke();
    }
  }

  /**
   * Desenha o fretboard completo (braço + nomes + cordas + trastes)
   */
  drawFretboard(): void {
    this.drawNeck();
    this.drawStringNames();
    this.drawFrets();
    this.drawStrings();
  }

  /**
   * Desenha o braço progressivamente de cima para baixo
   */
  drawNeckProgressive(progress: number): void {
    const neckX = this._diagramX;
    const neckY = this._diagramY;
    const neckWidth = this._diagramWidth;
    const neckHeight = this._diagramHeight * progress;

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

    const fretboardHeight = this._fretboardHeight * progress;

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
    const numFrets = this._numFrets + 1; // Incluindo o nut
    const fretsToDraw = Math.floor(progress * numFrets);

    this._ctx.save();
    this._ctx.strokeStyle = this._colors.fretColor;

    for (let i = 0; i <= fretsToDraw && i <= this._numFrets; i++) {
      const y = this._fretboardY + i * this._realFretSpacing;
      this._ctx.lineWidth = i === 0 ? (this._colors.borderWidth * 8) : this._colors.borderWidth;
      
      // Se for o último traste sendo desenhado, pode estar parcial
      const isLastFret = i === fretsToDraw;
      const partialProgress = isLastFret ? (progress * numFrets - fretsToDraw) : 1;
      
      this._ctx.globalAlpha = isLastFret ? partialProgress : 1;
      this._ctx.beginPath();
      this._ctx.moveTo(this._fretboardX, y);
      this._ctx.lineTo(this._fretboardX + this._fretboardWidth, y);
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
      this._ctx.save();
      this._ctx.globalAlpha = phases.stringNamesProgress;
      this.drawStringNames();
      this._ctx.restore();
    }

    // Desenhar cordas progressivamente
    if (phases.stringsProgress > 0) {
      this.drawStringsProgressive(phases.stringsProgress);
    }

    // Desenhar trastes progressivamente
    if (phases.fretsProgress > 0) {
      this.drawFretsProgressive(phases.fretsProgress);
    }
  }
}