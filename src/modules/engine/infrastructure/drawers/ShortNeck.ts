import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps } from "@/modules/core/domain/types";
import { easeInOutQuad } from "../utils/animacao";
import { GeometryProvider, GeometrySettings } from "./components/GeometryProvider";
import { CapoComponent } from "./components/CapoComponent";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord as detectBarre } from "./utils/barre-detection";
import { NeckType } from "./components/NeckType";
import { FingerComponent } from "./components/FingerComponent";
import { TransposeIndicatorComponent } from "./components/TransposeIndicatorComponent";

export class ShortNeckDrawer extends BaseDrawer implements FretboardDrawer, ChordDrawer {
    protected _neckRadius: number = 0;
    protected _stringNamesY: number = 0;
    protected _showHeadBackground: boolean = true;

    protected override _baseNeckRadius: number = 35;
    protected override _baseFingerRadius: number = 32;
    protected override _baseFontSize: number = 42;
    protected override _baseBarreWidth: number = 64;

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
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        this._diagramWidth = diagramSettings.diagramWidth;
        this._diagramHeight = diagramSettings.diagramHeight;
        this._diagramX = diagramSettings.diagramX;
        this._diagramY = diagramSettings.diagramY;
        this._numStrings = diagramSettings.numStrings || 6;
        this._numFrets = diagramSettings.numFrets || 5;
        this._horizontalPadding = diagramSettings.horizontalPadding;
        this._stringSpacing = diagramSettings.stringSpacing;
        this._fretboardX = diagramSettings.fretboardX;
        this._fretboardY = diagramSettings.fretboardY;
        this._fretboardWidth = diagramSettings.fretboardWidth;
        this._fretboardHeight = diagramSettings.fretboardHeight;
        this._realFretSpacing = diagramSettings.realFretSpacing;
        this._neckRadius = diagramSettings.neckRadius;
        this._stringNamesY = diagramSettings.stringNamesY;

        this._geometry = new GeometryProvider(this._getGeometrySettings());
        this.calculateDimensions();
    }

    protected _getGeometrySettings(): GeometrySettings {
        return {
            fretboardX: this._fretboardX,
            fretboardY: this._fretboardY,
            fretboardWidth: this._fretboardWidth,
            fretboardHeight: this._fretboardHeight,
            numStrings: this._numStrings,
            numFrets: this._numFrets,
            stringSpacing: this._stringSpacing,
            realFretSpacing: this._realFretSpacing,
            paddingX: this._horizontalPadding,
            boardY: this._diagramY,
            stringMargin: 0,
            scaleFactor: this._scaleFactor,
            neckType: NeckType.SHORT,
            fingerRadius: this._baseFingerRadius * this._scaleFactor,
            barreWidth: this._baseBarreWidth * this._scaleFactor
        };
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;

        // Define o tamanho do diagrama (a caixa externa)
        // O braço ocupa cerca de 60% da altura total da tela
        const diagramScale = 0.6;
        this._diagramHeight = CH * diagramScale;

        // Mantém a proporção largura/altura do diagrama
        const baseWidth = (this._diagramHeight * 0.7) / this._scaleFactor;
        const localW = baseWidth * this._scaleFactor;
        const localH = this._diagramHeight;

        // Centralização total no canvas
        this._diagramX = (CW / 2) - (localW / 2);
        this._diagramY = (CH / 2) - (localH / 2);

        // O Header (onde ficam os nomes das notas) tem altura fixa
        const headerHeight = 75 * this._scaleFactor;

        // O Fretboard (área das cordas) começa abaixo do header
        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY + headerHeight;
        this._fretboardWidth = localW;
        this._fretboardHeight = localH - headerHeight;

        // Espaçamento lateral interno (padding)
        this._horizontalPadding = 30 * this._scaleFactor;
        const fretUsableWidth = this._fretboardWidth - (this._horizontalPadding * 2);

        // Espaçamento entre cordas e trastes
        this._stringSpacing = fretUsableWidth / Math.max(1, this._numStrings - 1);
        this._realFretSpacing = this._fretboardHeight / this._numFrets;

        // Posicionamento do texto das notas (centralizado no header)
        this._stringNamesY = this._diagramY + (headerHeight / 2);

        // Define o raio do braço
        this._neckRadius = 35 * this._scaleFactor;

        if (this._geometry) {
            this._geometry.update(this._getGeometrySettings());
        }
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showHeadBackground = showHeadBackground;
    }

    protected _headstockYOffset: number = 0;

    public setHeadstockGap(gap: number): void {
        this._headstockYOffset = gap;
    }

    protected _capoFret: number = 0;

    public setCapo(show: boolean, fret: number): void {
        this._capoFret = show ? fret : 0;
    }

    public setHideCapoTitle(hide: boolean): void {
        // No-op for ShortNeck
    }

    public updateGeometry(
        width: number,
        height: number,
        numStrings: number,
        numFrets: number,
        scaleFactor: number
    ): void {
        this._scaleFactor = scaleFactor;
        this.setDimensions({ width, height });
        this.setNumStrings(numStrings);
        this.setNumFrets(numFrets);
        this.calculateDimensions();
    }

    // Stub methods for ChordDrawer compatibility
    public setCanvasDimensions(dimensions: { width: number; height: number }): void {
        this.setDimensions(dimensions);
    }

    // Properties setters
    public setDiagramX(diagramX: number): void {
        this._diagramX = diagramX;
        this.calculateDimensions();
    }
    public setDiagramY(diagramY: number): void {
        this._diagramY = diagramY;
        this.calculateDimensions();
    }
    public setFretboardHeight(height: number): void {
        this._fretboardHeight = height;
        this.calculateDimensions();
    }
    public setFretSpacing(spacing: number): void {
        this._realFretSpacing = spacing;
        this.calculateDimensions();
    }
    public setNumStrings(num: number): void {
        this._numStrings = num;
        this.calculateDimensions();
    }
    public setNumFrets(num: number): void {
        this._numFrets = num;
        this.calculateDimensions();
    }
    public setStringSpacing(spacing: number): void {
        this._stringSpacing = spacing;
        this.calculateDimensions();
    }
    public setFretboardWidth(width: number): void {
        this._fretboardWidth = width;
        this.calculateDimensions();
    }
    public setHorizontalPadding(padding: number): void {
        this._horizontalPadding = padding;
        this.calculateDimensions();
    }
    // Support flexible signature to match ChordDrawer calls [index, names] or [names]
    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg1)) {
            this._stringNames = arg1;
        } else if (arg2) {
            this._stringNames = arg2;
        }
    }

    public setGlobalCapo(capo: number) { this._globalCapo = capo; }

    public getChordNameCoords(): { x: number; y: number } {
        const visualHeight = this._fretboardHeight + (75 * this._scaleFactor); // Including header
        const offsetN = 100 * this._scaleFactor;

        return {
            x: this._dimensions.width / 2,
            y: (this._dimensions.height / 2) - (visualHeight / 2) - offsetN
        };
    }

    public transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        let finalChord = { ...chord };
        let effectiveTransport = transportDisplay;

        // Auto-transpose for ShortNeck if no transport is provided and fingers are high
        effectiveTransport = FingerComponent.calculateEffectiveTransport(chord.fingers, this._numFrets, transportDisplay);

        if (effectiveTransport > 1) {
            finalChord = {
                ...chord,
                fingers: chord.fingers.map(f => ({
                    ...f,
                    fret: f.fret > 0 ? f.fret - (effectiveTransport - 1) : 0
                }))
            };
        }
        return { finalChord, transportDisplay: effectiveTransport };
    }

    // Drawing Methods

    public drawFretboard(): void {
        this.drawNeck();
        this.drawStringNames(1);
        this.drawFrets();
        this.drawStrings();
        this.drawCapo();
        this.drawCapoFretNumber();
    }

    public drawNeck(progress: number = 1): void {
        const easedProgress = easeInOutQuad(progress);

        this._ctx.save();
        this.applyTransforms();

        this.applyShadow(this._colors.fretboard.neck.shadow);
        this._ctx.fillStyle = this._colors.fretboard.neck.color || "#8d8d8d";
        this._safeRoundRect(
            this._fretboardX,
            this._fretboardY,
            this._fretboardWidth,
            this._fretboardHeight * easedProgress,
            [0, 0, this._neckRadius, this._neckRadius],
            true
        );

        if (this._showHeadBackground) {
            const headstockHeight = (this._fretboardY - this._diagramY);
            const headStartY = this._diagramY + this._headstockYOffset;

            this._ctx.fillStyle = this._colors.head?.color || "#3a3a3e";
            this.applyShadow(this._colors.head?.shadow);

            this._safeRoundRect(
                this._fretboardX,
                headStartY,
                this._fretboardWidth,
                headstockHeight,
                [this._neckRadius, this._neckRadius, 0, 0],
                true
            );

            this.applyShadow(undefined);
            if (this._colors.head?.border?.width && this._colors.head.border.width > 0) {
                this._ctx.lineWidth = this._colors.head.border.width * this._scaleFactor;
                this._ctx.strokeStyle = this._colors.head.border.color || 'transparent';
                this._ctx.stroke();
            }
        }

        this._ctx.restore();
    }

    public drawStringNames(progress: number = 1, customNames?: string[]): void {
        if (!this._showHeadBackground) return;

        const easedProgress = easeInOutQuad(progress);
        const namesToDraw = customNames || this._stringNames;

        this._ctx.save();
        this.applyTransforms();
        this.applyShadow(undefined);
        const translateY = (1 - easedProgress) * (-10 * this._scaleFactor);

        const color = this._colors.head?.textColors?.name || this._colors.global.primaryTextColor;
        const fontSize = 30 * this._scaleFactor;
        const font = `bold ${fontSize}px sans-serif`;

        namesToDraw.forEach((name, i) => {
            if (i >= this._numStrings) return;

            const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
            const y = this._stringNamesY + translateY + this._headstockYOffset;

            this._drawText(name, x, y, font, color, "center", "middle", true);
        });

        this._ctx.restore();
    }

    public drawStrings(): void {
        if (this._colors.fretboard.strings.thickness <= 0) return;

        this._ctx.save();
        this.applyTransforms();
        this.applyShadow(this._colors.fretboard.strings.shadow);

        const currentHeight = this._fretboardHeight;
        const thickness = (this._colors.fretboard.strings.thickness || 2) * this._scaleFactor;
        const color = this._colors.fretboard.strings.color || "#444444";

        // Itera sobre o número lógico das cordas (1 a N) para bater com a geometria
        for (let i = 1; i <= this._numStrings; i++) {
            const { x } = this.getFingerCoords(0, i); // Pega a coordenada X da corda
            this._drawLine(x, this._fretboardY, x, this._fretboardY + currentHeight, color, thickness);
        }
        this._ctx.restore();
    }

    public drawFrets(): void {
        const baseColor = this._colors.fretboard.frets.color || "#666666";

        this._ctx.save();
        this.applyTransforms();
        this.applyShadow(this._colors.fretboard.frets.shadow);

        // Desenha os trastes (incluindo o traste 0/pestana se necessário)
        for (let i = 1; i < this._numFrets; i++) {
            const y = this._fretboardY + i * this._realFretSpacing;
            const thickness = (this._colors.fretboard.frets.thickness || 2) * this._scaleFactor;

            // O primeiro traste (index 0) é a pestana, geralmente mais grossa
            const currentThickness = i === 0 ? thickness * 1.5 : thickness;

            this._drawLine(this._fretboardX, y, this._fretboardX + this._fretboardWidth, y, baseColor, currentThickness);
        }
        this._ctx.restore();
    }

    // Progressive Wrappers
    public drawNeckProgressive(progress: number): void {
        this.drawNeck(progress);
    }

    public drawStringsProgressive(progress: number): void {
        this.drawStrings();
    }

    public drawFretsProgressive(progress: number): void {
        this.drawFrets();
    }

    public drawAnimatedFretboard(phases: {
        neckProgress: number;
        stringNamesProgress: number;
        stringsProgress: number;
        fretsProgress: number;
        nutProgress: number;
    }): void {
        if (phases.neckProgress > 0) {
            this.drawNeckProgressive(phases.neckProgress);
        }
        if (phases.stringNamesProgress > 0) {
            this.drawStringNames(phases.stringNamesProgress);
        }
        if (phases.fretsProgress > 0) {
            this.drawFretsProgressive(phases.fretsProgress);
        }
        if (phases.stringsProgress > 0) {
            this.drawStringsProgressive(phases.stringsProgress);
        }
    }

    protected _drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
        this._ctx.save();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = width;
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
        this._ctx.restore();
    }

    private drawCapo(): void {
        if (this._capoFret <= 0) return;
        const capoComp = new CapoComponent(this._capoFret, {
            color: this._colors.capo?.color || '#c0c0c0',
            border: this._colors.capo?.border || { color: '#808080', width: 2 },
            textColor: this._colors.capo?.textColors?.name || '#2c2c2c',
            opacity: 1
        }, this._geometry);
        capoComp.draw(this._ctx);
    }

    private drawCapoFretNumber(): void {
        if (this._capoFret <= 0) return;
        this._ctx.save();
        this.applyTransforms();
        this.applyShadow(undefined);

        const capoHeight = 35 * this._scaleFactor;
        const capoY = this._fretboardY - (capoHeight / 2) - (2 * this._scaleFactor) + 27 + this._headstockYOffset;

        const x = this._fretboardX - 40 * this._scaleFactor;
        const y = capoY + capoHeight / 2;

        const text = `${this._capoFret.toString()}ª`;
        const font = `bold ${32 * this._scaleFactor}px sans-serif`;
        const color = this._colors.capo?.textColors?.number || this._colors.global.primaryTextColor;

        this._drawText(text, x, y, font, color, "center", "middle", true);
        this._ctx.restore();
    }

    protected _drawText(
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        align: CanvasTextAlign = "center",
        baseline: CanvasTextBaseline = "middle",
        counterRotate: boolean = false
    ): void {
        this._ctx.save();
        this._ctx.fillStyle = color;
        this._ctx.font = font;
        this._ctx.textAlign = align;
        this._ctx.textBaseline = baseline;

        if (counterRotate) {
            this._ctx.save();
            this._ctx.translate(x, y);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(text, 0, 0);
            this._ctx.restore();
        } else {
            this._ctx.fillText(text, x, y);
        }
        this._ctx.restore();
    }

    // ChordDrawer interface stubs
    public drawChord(chord: ChordDiagramProps, transportDisplay: number, offsetX?: number, options?: any): void {
        // Handle optional arguments overloading if needed, but matching interface is better
        // The interface defines: drawChord(chord, transport, offsetX?, options?)

        let opts = options;
        if (typeof offsetX === 'object' && offsetX !== null && options === undefined) {
            // If called as (chord, transport, options), shift args
            opts = offsetX;
        }

        if (!opts?.skipFretboard) {
            this.drawFretboard();
        }

        const { finalChord, transportDisplay: effectiveTransport } = this.transposeForDisplay(chord, transportDisplay);
        this.drawFingers(finalChord);

        const curFingers = finalChord.fingers || [];
        const getMinFret = (fingers: any[]) => {
            let minFret = Infinity;
            for (let i = 0; i < fingers.length; i++) {
                if (fingers[i].fret > 0 && fingers[i].fret < minFret) {
                    minFret = fingers[i].fret;
                }
            }
            return minFret === Infinity ? 1 : minFret;
        };

        this.drawTransposeIndicator(effectiveTransport, getMinFret(curFingers));
        this.drawAvoidedStrings(chord.avoid);

        if (finalChord.chordName && !opts?.skipChordName) {
            this.drawChordName(finalChord.chordName);
        }
    }
    public drawTransposeIndicator(transportDisplay: number, alignFret?: number): void {
        if (transportDisplay <= 1) return;

        const indicatorColor = (this._colors.head?.textColors as any)?.name
            || this._colors.global.primaryTextColor
            || "#ffffff";

        const comp = new TransposeIndicatorComponent(
            NeckType.SHORT,
            transportDisplay,
            alignFret || 1,
            { color: indicatorColor, fontSize: 35 },
            this._geometry
        );
        comp.setRotation(this._rotation, this._mirror, this._dimensions);
        comp.update(1);
        comp.draw(this._ctx);
    }

    public drawTransposeIndicatorWithTransition(curT: number, nxtT: number, curA: number, nxtA: number, progress: number): void {
        const indicatorColor = (this._colors.head?.textColors as any)?.name
            || this._colors.global.primaryTextColor
            || "#ffffff";

        const comp = new TransposeIndicatorComponent(
            NeckType.SHORT,
            curT,
            curA,
            { color: indicatorColor, fontSize: 35 },
            this._geometry
        );
        comp.setRotation(this._rotation, this._mirror, this._dimensions);

        const opacity = Number(progress < 0.5 ? curT : nxtT) > 1 ? 1 : 0;
        comp.setTarget(nxtT, nxtA, opacity);
        comp.update(progress);
        comp.draw(this._ctx);
    }

    public drawChordName(chordName: string, options?: any): void {
        if (!chordName) return;

        this._ctx.save();
        // Do NOT apply global transforms so text position is absolute (top of screen)
        // this.applyTransforms();

        const { x, y } = this.getChordNameCoords();
        const fontSize = (options?.fontSize || 60) * this._scaleFactor;
        const font = `900 ${fontSize}px "Inter", sans-serif`;
        const color = options?.color || this._colors.global.primaryTextColor || "#ffffff";

        this._ctx.globalAlpha = options?.opacity ?? 1;

        this._ctx.fillStyle = color;
        this._ctx.font = font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        // Draw directly at absolute coordinates
        this._ctx.fillText(chordName, x, y);

        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const barre = detectBarre(chord);
        if (barre) {
            this.drawBarre(barre.fret, barre.startString, barre.endString, barre.finger || 1);
        }

        chord.fingers.forEach(f => {
            if (f.fret > 0) {
                if (barre && f.fret === barre.fret && f.string >= Math.min(barre.startString, barre.endString) && f.string <= Math.max(barre.startString, barre.endString)) {
                    return;
                }
                this.drawFinger(f.fret, f.string, f.finger || 1);
            }
        });
    }

    public calculateWithOffset(offsetX: number): void { }
    public drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void {
        this.drawChord(chord, transportDisplay, { ...arguments[3], buildProgress: progress });
    }
    public drawChordWithTransition(current: ChordDiagramProps, cTrans: number, next: ChordDiagramProps, nTrans: number, progress: number, offsetX?: number, options?: any): void {
        // Simple transition implementation for fallback
        if (progress < 0.5) {
            this.drawChord(current, cTrans, { ...options, opacity: 1 - progress * 2 });
        } else {
            this.drawChord(next, nTrans, { ...options, opacity: (progress - 0.5) * 2 });
        }
    }
}