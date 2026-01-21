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
        const headerHeight = 60 * this._scaleFactor;

        // O Fretboard (madeira) começa logo abaixo do header
        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY + headerHeight;
        this._fretboardWidth = localW;
        this._fretboardHeight = localH - headerHeight;

        // Cálculo de espaçamento
        this._horizontalPadding = 30; // Recuo lateral para as cordas não encostarem na borda da madeira
        const usableWidth = this._fretboardWidth - (this._horizontalPadding * 2 * this._scaleFactor);
        this._stringSpacing = usableWidth / (Math.max(1, this._numStrings - 1));
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
        const scale = this._scaleFactor;
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;
        const rad = (this._rotation * Math.PI) / 180;

        const baseCenterX = (CW / 2) - (this.diagramWidth / 2);
        const carouselOffsetX = this._diagramX - baseCenterX;
        const effectiveOffset = this._mirror ? -carouselOffsetX : carouselOffsetX;

        const cosR = Math.cos(rad);
        const sinR = Math.sin(rad);

        const visualCenterX = (CW / 2) + (effectiveOffset * cosR);
        const visualCenterY = (CH / 2) + (effectiveOffset * sinR);

        const offsetT = 40 * scale;
        const offsetN = 140 * scale;
        const vHalfHeight = this._getVisualFretboardHalfHeight();

        const baseY = visualCenterY - vHalfHeight;
        const posY = (type === 'name' ? baseY - offsetN : baseY - offsetT);

        return { x: visualCenterX, y: posY };
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
        // ... (preserving original transforms save/restore logic is good practice even in abstract but implementation might vary)
        // Actually, this logic is quite tied to drawing the fretboard. 
        // If the subclasses use this cache method, it should stay. 
        // But since subclasses implement `drawFretboard`, maybe they should implement caching too?
        // The user said "use abstract only to calculate things".
        // Caching involves creating a canvas and drawing to it. 
        // I will leave it here as a utility, but subclasses invoke it.
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

        // IMPORTANT: The abstract class doesn't know HOW to draw fretboard anymore via `this.drawFretboard()` if I removed it?
        // Ah, `fretboardDrawer.drawFretboard()` exists on the child property.
        // Yes, the abstract class has `public abstract fretboardDrawer`.
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
}
