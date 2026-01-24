import { BaseDrawer } from "./BaseDrawer";
import type { FretboardTheme, ChordDiagramProps, BarreInfo } from "@/modules/core/domain/types";
import { FretboardDrawer } from "./FretboardDrawer";

/**
 * Abstract base class for drawing guitar chords.
 * Extends BaseDrawer to leverage common canvas and geometry logic.
 * RESPONSIBILITY: Layout Calculations & Geometry State only.
 */
export abstract class AbstractChordDrawer extends BaseDrawer {
    public abstract fretboardDrawer: FretboardDrawer;

    // Cache for the fretboard (sprite)
    protected _fretboardCache: HTMLCanvasElement | null = null;
    // Flag to avoid drawing the fretboard on every frame after a transition ends
    protected _skipFretboard: boolean = false;

    // Constants and base values
    public static readonly BASE_WIDTH: number = 750;
    protected _baseDiagramWidth: number = AbstractChordDrawer.BASE_WIDTH;

    protected _baseNeckRadius: number = 35; // Mais arredondado como na imagem
    protected _baseFingerRadius: number = 25;
    protected _baseBarreWidth: number = 56;

    protected _stringNamesY: number = 0;
    protected _globalCapo: number = 0;
    protected _verticalPadding: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);
    }

    // ============ GETTERS & SETTERS ============

    public get diagramWidth(): number { return this._baseDiagramWidth * this._scaleFactor; }
    public get neckRadius(): number { return this._baseNeckRadius * this._scaleFactor; }
    public get barreWidth(): number { return this._baseBarreWidth * this._scaleFactor; }
    public get fingerRadius(): number { return this._baseFingerRadius * this._scaleFactor; }
    public get horizontalPadding(): number { return this._horizontalPadding * this._scaleFactor; }

    public setRotation(rotation: number): void {
        this._rotation = rotation;
    }

    public setNumStrings(num: number): void {
        super.setNumStrings(num);
        if (this.fretboardDrawer) this.fretboardDrawer.setNumStrings(num);
    }

    public setNumFrets(num: number): void {
        super.setNumFrets(num);
        if (this.fretboardDrawer) this.fretboardDrawer.setNumFrets(num);
    }

    public setCtx(ctx: CanvasRenderingContext2D): void {
        super.setCtx(ctx);
        if (this.fretboardDrawer) this.fretboardDrawer.setCtx(ctx);
    }

    public clear(): void {
        this._ctx.clearRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public calculateWithOffset(offsetX: number): void {
        this.calculateDimensions();
        this._diagramX += offsetX;
        this._fretboardX += offsetX;

        if (this.fretboardDrawer) {
            this.fretboardDrawer.setDiagramX(this._diagramX);
        }
    }

    public setGlobalCapo(capo: number): void {
        this._globalCapo = capo;
    }

    public setStringNames(names: string[]): void {
        if (this.fretboardDrawer) {
            this.fretboardDrawer.setStringNames(names);
        }
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;

        // Define o tamanho do diagrama (a caixa preta externa)
        // Baseado na imagem, o braço ocupa uns 60% da altura total
        const diagramScale = 0.6;
        this._diagramHeight = CH * diagramScale;
        this._baseDiagramWidth = (this._diagramHeight * 0.7) / this._scaleFactor;

        const localW = this._baseDiagramWidth * this._scaleFactor;
        const localH = this._diagramHeight;

        // Centralização total
        this._diagramX = (CW / 2) - (localW / 2);
        this._diagramY = (CH / 2) - (localH / 2);

        // Na imagem, o Header (onde ficam os nomes E A D G B e) tem uma altura fixa
        const headerHeight = 75 * this._scaleFactor;

        // O Fretboard (madeira) começa logo abaixo do header
        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY + headerHeight;
        this._fretboardWidth = localW;
        this._fretboardHeight = localH - headerHeight;

        // Cálculo de espaçamento
        this._horizontalPadding = 30; // Recuo lateral para as cordas não encostarem na borda da madeira
        const fretUsableWidth = this._fretboardWidth - (this._horizontalPadding * 2 * this._scaleFactor);
        this._stringSpacing = fretUsableWidth / Math.max(1, this._numStrings - 1);

        // Trastes ficam no eixo Y (vertical): espaçamento usa altura disponível
        this._realFretSpacing = this._fretboardHeight / this._numFrets;

        // Posicionamento do texto das notas (centralizado no header)
        this._stringNamesY = this._diagramY + (headerHeight / 2);

        // Atualiza o Drawer interno
        if (this.fretboardDrawer) {
            this.fretboardDrawer.updateGeometry(
                this._fretboardWidth,
                this._fretboardHeight,
                this._numStrings,
                this._numFrets,
                this._scaleFactor
            );
            this.fretboardDrawer.setDiagramX(this._diagramX);
            this.fretboardDrawer.setDiagramY(this._diagramY);
            this.fretboardDrawer.setStringNames(undefined);
        }
    }

    // ============ CALCULATIONS HELPERS ONLY (No Drawing) ============

    protected _detectBarre(chord: ChordDiagramProps): BarreInfo | null {
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
                        finger: f.finger ?? 1,
                        startString: start,
                        endString: end
                    };
                }
            }
        });

        return bestBarre;
    }

    public transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        let finalChord = { ...chord };
        let finalTransport = transportDisplay;

        if (transportDisplay > 1) {
            finalChord = {
                ...chord,
                fingers: chord.fingers.map(f => ({
                    ...f,
                    fret: f.fret > 0 ? f.fret - (transportDisplay - 1) : 0
                }))
            };
        }
        return { finalChord, transportDisplay: finalTransport };
    }

    protected _getVisualFretboardHalfHeight(): number {
        return (this._rotation % 180 === 0)
            ? (this._fretboardHeight / 2)
            : (this._fretboardWidth / 2);
    }

    protected _getLabelPosition(type: 'name' | 'transpose'): { x: number; y: number } {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;
        const centerX = CW / 2;
        const centerY = CH / 2;

        const offsetN = 100 * this._scaleFactor;
        const offsetT = 40 * this._scaleFactor;
        const offset = type === 'name' ? offsetN : offsetT;

        // Determine the visual height in screen space after rotation
        // If 90 or 270 degrees, height becomes the original diagram's width
        const isHorizontal = this._rotation % 180 !== 0;
        const visualHeight = isHorizontal ? this.diagramWidth : this._diagramHeight;

        return {
            x: centerX,
            y: centerY - (visualHeight / 2) - offset
        };
    }

    protected _updateFretboardCache(): void {
        if (typeof document === 'undefined') return;

        if (!this._fretboardCache) {
            this._fretboardCache = document.createElement('canvas');
        }

        const width = this.diagramWidth;
        const height = this._diagramHeight;

        if (this._fretboardCache.width !== width || this._fretboardCache.height !== height) {
            this._fretboardCache.width = width;
            this._fretboardCache.height = height;
        }

        const cacheCtx = this._fretboardCache.getContext('2d');
        if (!cacheCtx) return;

        cacheCtx.clearRect(0, 0, width, height);

        const originalCtx = this._ctx;
        const originalFretboardX = this._fretboardX;
        const originalFretboardY = this._fretboardY;
        const originalDiagramX = this._diagramX;
        const originalDiagramY = this._diagramY;
        const originalStringNamesY = this._stringNamesY;

        this.setCtx(cacheCtx);
        const offsetX = -originalDiagramX;
        const offsetY = -originalDiagramY;

        this._diagramX += offsetX;
        this._diagramY += offsetY;
        this._fretboardX += offsetX;
        this._fretboardY += offsetY;
        this._stringNamesY += offsetY;

        if (this.fretboardDrawer) {
            this.fretboardDrawer.setCtx(cacheCtx);
            this.fretboardDrawer.setDiagramX(this._diagramX);
            this.fretboardDrawer.setDiagramY(this._diagramY);
            this.fretboardDrawer.drawFretboard();
        }

        this.setCtx(originalCtx);
        if (this.fretboardDrawer) this.fretboardDrawer.setCtx(originalCtx);
        this._fretboardX = originalFretboardX;
        this._fretboardY = originalFretboardY;
        this._diagramX = originalDiagramX;
        this._diagramY = originalDiagramY;
        this._stringNamesY = originalStringNamesY;
        if (this.fretboardDrawer) {
            this.fretboardDrawer.setDiagramX(this._diagramX);
            this.fretboardDrawer.setDiagramY(this._diagramY);
        }
    }

    // ============ ANIMATION SUPPORT HELPERS ============

    /**
     * Calculates the local visual coordinates for a specific fret and string position.
     * Takes into account the current layout (vertical/horizontal based on implementation).
     * For AbstractChordDrawer (Vertical): X = String, Y = Fret.
     */
    /**
     * Calculates the center (x, y) coordinates for a finger on a given fret and string.
     * Default Implementation: Vertical Layout (X = String, Y = Fret)
     */
    public getFingerPosition(fret: number, string: number): { x: number, y: number } {
        const visualStringIdx = this._numStrings - string;

        // X = positions along strings (Columns)
        const x = this._fretboardX + this.horizontalPadding + visualStringIdx * this._stringSpacing;

        // Y = positions along frets (Rows) - Centered in the fret space
        const y = this._fretboardY + (Math.max(0, fret) - 0.5) * this._realFretSpacing;

        return { x, y };
    }

    /**
     * Calculates the rect for a barre.
     * Default Implementation: Vertical Layout (Barre is a horizontal pill)
     */
    public getBarreRect(fret: number, startString: number, endString: number): { x: number, y: number, width: number, height: number, radius: number } {
        const p1 = this.getFingerPosition(fret, startString);
        const p2 = this.getFingerPosition(fret, endString);

        const leftX = Math.min(p1.x, p2.x) - this.fingerRadius;
        const rightX = Math.max(p1.x, p2.x) + this.fingerRadius;

        const width = rightX - leftX;
        const height = this.fingerRadius * 2;
        const centerX = leftX + width / 2;
        const centerY = p1.y;

        return { x: centerX, y: centerY, width, height, radius: this.neckRadius };
    }

    public drawRawFinger(x: number, y: number, fingerNum: number | string, color: string, opacity: number = 1, radiusScale: number = 1): void {
        this._ctx.save();

        // Apply Shadow for Finger Body
        this.applyShadow(this._colors.fingers.shadow);

        this._ctx.fillStyle = this.hexToRgba(color, (this._colors.fingers.opacity ?? 1) * opacity);

        const radius = this.fingerRadius * radiusScale;

        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2);
        this._ctx.fill();

        const borderWidth = this._colors.fingers.border?.width ?? 0;
        if (borderWidth > 0 && opacity > 0.3) {
            this._ctx.strokeStyle = this.hexToRgba(this._colors.fingers.border?.color || '#FFFFFF', opacity);
            this._ctx.lineWidth = 3 * this._scaleFactor;
            this._ctx.stroke();
        }

        // RESET SHADOW for Text
        this.applyShadow(undefined);

        if (fingerNum !== 0 && fingerNum !== -1 && fingerNum !== 'T') {
            this._ctx.fillStyle = this._colors.fingers.textColor || '#ffffff';
            const fontSize = 35 * this._scaleFactor * radiusScale;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            this._ctx.save();
            this._ctx.translate(x, y);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(String(fingerNum), 0, 0);
            this._ctx.restore();
        }
        this._ctx.restore();
    }

    public drawRawBarre(x: number, y: number, width: number, height: number, fingerNum: number | string, color: string, opacity: number = 1): void {
        this._ctx.save();

        // Apply Shadow for Barre Body
        this.applyShadow(this._colors.fingers.shadow);

        this._ctx.fillStyle = this.hexToRgba(color, (this._colors.fingers.opacity ?? 1) * opacity);

        const radius = this.neckRadius; // Match barre radius style

        this._ctx.beginPath();
        this._safeRoundRect(x - width / 2, y - height / 2, width, height, radius);
        this._ctx.fill();

        this._ctx.strokeStyle = this.hexToRgba(this._colors.fingers.border?.color || '#FFFFFF', opacity);
        this._ctx.lineWidth = 3 * this._scaleFactor;
        this._ctx.stroke();

        // RESET SHADOW for Text
        this.applyShadow(undefined);

        // Finger Number
        if (fingerNum !== 0 && fingerNum !== -1 && opacity > 0.3) {
            this._ctx.fillStyle = this._colors.fingers.textColor || '#ffffff';
            const fontSize = 35 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            this._ctx.save();
            this._ctx.translate(x, y);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(String(fingerNum), 0, 0);
            this._ctx.restore();
        }

        this._ctx.restore();
    }

    public drawTransposeIndicator(text: string | number, alignFret: number = 1): void {
        // Default: No-op. Specialized drawers like ShortChord can override.
    }

    public drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void {
        // Default: No-op.
    }
}
