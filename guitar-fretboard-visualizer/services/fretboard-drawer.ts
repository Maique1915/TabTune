
import { FretboardTheme, ChordDiagramProps } from '../types';

export interface DrawerOptions {
  width: number;
  height: number;
  numFrets?: number;
  numStrings?: number;
  capoFret?: number;
}

export class FretboardDrawer {
  private ctx: CanvasRenderingContext2D;
  private colors: FretboardTheme;
  private width: number;
  private height: number;
  private numFrets: number;
  private numStrings: number;
  private capoFret: number;

  private marginX = 50;
  private marginTop = 150; 
  private marginBottom = 60;
  private stringSpacing = 0;
  private fretSpacing = 0;
  private boardWidth = 0;
  private boardHeight = 0;

  constructor(ctx: CanvasRenderingContext2D, colors: FretboardTheme, options: DrawerOptions) {
    this.ctx = ctx;
    this.colors = colors;
    this.width = options.width;
    this.height = options.height;
    this.numFrets = options.numFrets || 6;
    this.numStrings = options.numStrings || 6;
    this.capoFret = options.capoFret || 0;

    this.calculateGeometry();
  }

  private calculateGeometry() {
    this.boardWidth = this.width - (this.marginX * 2);
    this.boardHeight = this.height - this.marginTop - this.marginBottom;
    this.stringSpacing = this.boardWidth / (this.numStrings - 1);
    this.fretSpacing = this.boardHeight / this.numFrets;
  }

  public updateOptions(options: Partial<DrawerOptions>) {
    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;
    if (options.numFrets !== undefined) this.numFrets = options.numFrets;
    if (options.numStrings !== undefined) this.numStrings = options.numStrings;
    if (options.capoFret !== undefined) this.capoFret = options.capoFret;
    this.calculateGeometry();
  }

  public clear() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public draw() {
    this.drawBoard();
    this.drawHeaderLabels();
    if (this.capoFret > 0) {
      this.drawCapo();
    }
  }

  private drawHeaderLabels() {
    const labels = ["E", "A", "D", "G", "B", "e"];
    const boxPaddingX = 20;
    const boxWidth = this.boardWidth + boxPaddingX * 2;
    const boxHeight = 75;
    const boxX = (this.width - boxWidth) / 2;
    const boxY = 15;

    this.ctx.fillStyle = "#2a2a2e";
    this.ctx.beginPath();
    // CABEÇA: Topo arredondado [TL, TR, BR, BL] -> [20, 20, 0, 0]
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, [20, 20, 0, 0]);
    this.ctx.fill();

    this.ctx.fillStyle = this.colors.accentColor;
    this.ctx.font = "900 32px 'Inter', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    labels.forEach((label, i) => {
      const x = this.marginX + i * this.stringSpacing;
      this.ctx.fillText(label, x, boxY + boxHeight / 2);
    });
  }

  private drawCapo() {
    const capoHeight = 65;
    const capoWidth = this.boardWidth + 50;
    const x = (this.width - capoWidth) / 2;
    const y = 105; 

    this.ctx.save();
    
    // Sombra para o capo
    this.ctx.shadowColor = "rgba(0,0,0,0.6)";
    this.ctx.shadowBlur = 15;
    this.ctx.shadowOffsetY = 5;

    this.ctx.fillStyle = "#3f3f44";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y - capoHeight / 2, capoWidth, capoHeight, 12);
    this.ctx.fill();

    // Borda preta no capo
    this.ctx.shadowBlur = 0; // Remove sombra da borda
    this.ctx.shadowOffsetY = 0;
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.fillStyle = this.colors.accentColor;
    this.ctx.font = "900 22px 'Inter', sans-serif";
    this.ctx.letterSpacing = "10px";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("CAPO", this.width / 2, y);
    this.ctx.restore();
  }

  private drawBoard() {
    this.ctx.fillStyle = this.colors.fretboardColor; 
    this.ctx.beginPath();
    // BRAÇO: Base arredondada [TL, TR, BR, BL] -> [0, 0, 24, 24]
    this.ctx.roundRect(this.marginX - 15, this.marginTop - 10, this.boardWidth + 30, this.boardHeight + 35, [0, 0, 24, 24]);
    this.ctx.fill();

    this.ctx.strokeStyle = this.colors.fretColor; 
    this.ctx.lineWidth = 4;
    for (let i = 0; i <= this.numFrets; i++) {
      const y = this.marginTop + i * this.fretSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(this.marginX - 15, y);
      this.ctx.lineTo(this.marginX + this.boardWidth + 15, y);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = this.colors.borderColor; 
    for (let i = 0; i < this.numStrings; i++) {
      const x = this.marginX + i * this.stringSpacing;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.marginTop - 10);
      this.ctx.lineTo(x, this.marginTop + this.boardHeight + 25);
      this.ctx.stroke();
    }
  }

  public drawChord(chord: ChordDiagramProps) {
    const { fingers, avoid } = chord;

    if (avoid) {
      this.ctx.fillStyle = "#ef4444";
      this.ctx.font = "900 28px 'Inter', sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      avoid.forEach(strNum => {
        const x = this.marginX + (6 - strNum) * this.stringSpacing;
        const y = this.marginTop + this.boardHeight + 45;
        this.ctx.fillText("✕", x, y);
      });
    }

    fingers.forEach(f => {
      if (f.fret <= 0) return;

      const visualStringIdx = 6 - f.string;
      const x = this.marginX + visualStringIdx * this.stringSpacing;
      const y = this.marginTop + (f.fret - 0.5) * this.fretSpacing;

      const radius = 24;
      
      this.ctx.save();
      this.ctx.shadowColor = "rgba(0,0,0,0.5)";
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetY = 4;

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors.fingerColor; 
      this.ctx.fill();
      
      this.ctx.shadowBlur = 0;
      this.ctx.shadowOffsetY = 0;
      
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      if (f.finger) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "900 22px 'Inter', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(String(f.finger), x, y);
      }
      this.ctx.restore();
    });
  }
}
