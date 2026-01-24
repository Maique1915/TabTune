import { AbstractChordDrawer } from "./AbstractChordDrawer"; // Will keep shared geometry/math
import { ShortNeckDrawer } from "./ShortNeck";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps, BarreInfo } from "@/modules/core/domain/types";
import { getNome, prepareShortChordVisuals, extensions as extensionMap } from "@/modules/core/domain/chord-logic";
import { easeInOutQuad } from "../utils/animacao";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord } from "./utils/barre-detection";
import { drawAvoidedStrings, AvoidedStringsContext } from "./utils/avoided-strings-utils";
import { calculateLabelPosition } from "./utils/label-positioning";

export class ShortChord extends AbstractChordDrawer implements ChordDrawer {
    public fretboardDrawer: FretboardDrawer;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        this.calculateDimensions();

        this.fretboardDrawer = new ShortNeckDrawer(ctx, colors, dimensions, {
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
        }, this._scaleFactor);

        this.fretboardDrawer.setTransforms(this._rotation as any, this._mirror);
        this.fretboardDrawer.setSkipGlobalTransform(true);
    }

    // ============ LOGIC OVERRIDES ============

    public transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        // 1. Calculate min and max frets (ignoring open strings/muted)
        const frets = chord.fingers
            .filter(f => f.fret > 0)
            .map(f => f.fret);

        // If all open/muted, standard behavior
        if (frets.length === 0) {
            return super.transposeForDisplay(chord, transportDisplay);
        }

        const maxFret = Math.max(...frets);
        const minFret = Math.min(...frets);

        console.log(`[AutoTranspose] Frets: ${frets}, Max: ${maxFret}, NumFrets: ${this._numFrets}, Min: ${minFret}`);

        // 2. Check overflow
        // If the highest fret exceeds the limit of available frets (usually 5 for short neck),
        // we force auto-transposition to ensure chords near the bottom are normalized to the top.
        if (maxFret > this._numFrets) {
            // "Lock to first fret": verify checks if any note passed the limit.
            // If yes, we set the transport display (the side number) to the lowest fret of the shape.
            // visualFret = actualFret - (minFret - 1).
            // This effectively places the lowest note at Visual Fret 1.
            const autoTransportDisplay = minFret;
            console.log(`[AutoTranspose] Triggered. New Transport: ${autoTransportDisplay}`);
            return super.transposeForDisplay(chord, autoTransportDisplay);
        }

        // Default behavior if fits in neck
        return super.transposeForDisplay(chord, transportDisplay);
    }

    // ============ DRAWING METHODS ============



    private _drawShapeAndFingerNumber(
        centerX: number,
        centerY: number,
        finger: number | string,
        isBarre: boolean,
        barreVisualWidth: number
    ): void {
        this._ctx.save();

        this.applyShadow(this._colors.fingers.shadow);

        this._ctx.fillStyle = this.hexToRgba(this._colors.fingers.color || "#1a1a1a", this._colors.fingers.opacity ?? 1);
        this._ctx.beginPath();

        if (isBarre) {
            // In vertical mode: barre spans strings (width = barreVisualWidth), thickness is vertical (height = barreWidth)
            const width = barreVisualWidth;
            const height = this.barreWidth;
            this._ctx.roundRect(centerX - width / 2, centerY - height / 2, width, height, this.neckRadius);
        } else {
            this._ctx.arc(centerX, centerY, this.fingerRadius, 0, Math.PI * 2);
        }
        this._ctx.fill();
        this.applyShadow(undefined);

        this._ctx.strokeStyle = this._colors.fingers.border?.color || "#ffffff";
        this._ctx.lineWidth = (this._colors.fingers.border?.width || 3) * this._scaleFactor;
        this._ctx.stroke();

        if (finger !== undefined && finger !== null && finger !== -2) {
            this._ctx.fillStyle = this._colors.fingers.textColor || "#ffffff";
            const fontSize = 30 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

            this._ctx.save();
            this._ctx.translate(centerX, centerY);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

            // Optical correction for baseline centering
            const opticalCorrection = fontSize * 0.06;
            this._ctx.fillText(displayText, 0, opticalCorrection);
            this._ctx.restore();
        }

        this._ctx.restore();
    }

    private _drawAnimatedShapeAndFingerNumber(
        finger: number | string,
        isBarre: boolean,
        barreVisualWidth: number
    ): void {
        // Updated to match static style (#1a1a1a fill, white border, shadow)
        this.applyShadow(this._colors.fingers.shadow);

        this._ctx.fillStyle = this.hexToRgba(this._colors.fingers.color || "#1a1a1a", this._colors.fingers.opacity ?? 1);
        this._ctx.beginPath();

        if (isBarre) {
            this._ctx.roundRect(
                -barreVisualWidth / 2,
                -(this.barreWidth / 2),
                barreVisualWidth,
                this.barreWidth,
                this.neckRadius
            );
        } else {
            this._ctx.arc(0, 0, this.fingerRadius, 0, Math.PI * 2);
        }
        this._ctx.fill();
        this.applyShadow(undefined);

        this._ctx.strokeStyle = this._colors.fingers.border?.color || "#ffffff";
        this._ctx.lineWidth = (this._colors.fingers.border?.width || 3) * this._scaleFactor;
        this._ctx.stroke();

        if (finger !== undefined && finger !== null && finger !== -2) {
            this._ctx.fillStyle = this._colors.fingers.textColor || "#ffffff";
            const fontSize = 30 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

            this._ctx.save();
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

            // Optical correction for baseline centering
            const opticalCorrection = fontSize * 0.06;
            this._ctx.fillText(displayText, 0, opticalCorrection);
            this._ctx.restore();
        }
    }

    private _drawBarreShapeAtPosition(finger: number | string, barreVisualWidth: number): void {
        this._drawAnimatedShapeAndFingerNumber(finger, true, barreVisualWidth);
    }

    private _getCapoConfig(): { isActive: boolean; fret: number; showNut: boolean } {
        if (this._globalCapo > 0) return { isActive: true, fret: this._globalCapo, showNut: false };
        return { isActive: false, fret: 0, showNut: true };
    }

    private _getTransposeConfig(transportDisplay: number): { isActive: boolean; fret: number; showNut: boolean } {
        if (transportDisplay > 1) return { isActive: true, fret: transportDisplay, showNut: false };
        return { isActive: false, fret: 1, showNut: true };
    }

    private _prepareFretboardDrawer(customStringNames: string[] | undefined = undefined, showNut: boolean | undefined = undefined): void {
        const capoConfig = this._getCapoConfig();
        // Just use capo config for drawFretboard simple calls? or assume transition logic is irrelevant there?
        // For drawFretboard (background), we usually want the global state.

        let shouldShowNut = showNut;
        if (shouldShowNut === undefined) {
            shouldShowNut = capoConfig.showNut;
        }

        const yOffset = this._globalCapo > 0 ? -50 * this._scaleFactor : 0;

        this.fretboardDrawer.setHeadstockGap(yOffset);
        // Force headstock background to be visible even if nut is hidden (capo case)
        this.fretboardDrawer.setConditionalFlags(shouldShowNut, true);

        if (customStringNames) {
            this.fretboardDrawer.setStringNames(1, customStringNames);
        }

        this.fretboardDrawer.setCapo(capoConfig.isActive, capoConfig.fret);
    }

    public drawFretboard(): void {
        this._prepareFretboardDrawer();
        this.fretboardDrawer.drawFretboard();
    }

    // ...

    public drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean, skipChordName?: boolean } = {}): void {
        // Use external logic
        const visuals = prepareShortChordVisuals(
            inputChord,
            this._numFrets,
            this._globalCapo,
            inputTransportDisplay
        );

        const { finalChord, startFret, barre, formattedName, capoConfig, transposeConfig } = visuals;

        this._applyChordSettings(finalChord);

        const rawExtensions = finalChord.chord?.extension ? finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
        if (finalChord.showChordName !== false && !options.skipChordName) this.drawChordName(formattedName, { extensions: rawExtensions });

        this._ctx.save();
        this.applyTransforms();

        if (!options.skipFretboard) {
            this._skipFretboard = false;
            const showNut = capoConfig.showNut && transposeConfig.showNut;
            const stringNames = (finalChord.stringNames && finalChord.stringNames.length > 0) ? finalChord.stringNames : ["E", "A", "D", "G", "B", "e"];
            this._prepareFretboardDrawer(stringNames, showNut);
            this.fretboardDrawer.drawFretboard();
        }

        if (transposeConfig.isActive) {
            // Find minimum visual fret to align the indicator
            const visibleFrets = finalChord.fingers.filter(f => f.fret > 0).map(f => f.fret);
            const minVisualFret = visibleFrets.length > 0 ? Math.min(...visibleFrets) : 1;
            this.drawTransposeIndicator(transposeConfig.fret, minVisualFret);
        }

        this._drawFingersInternal(finalChord);
        this.drawAvoidedStrings(finalChord.avoid);
        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const visuals = prepareShortChordVisuals(chord, this._numFrets, this._globalCapo, 1);
        this._ctx.save();
        this.applyTransforms();
        this._drawFingersInternal(visuals.finalChord);
        this.drawAvoidedStrings(visuals.finalChord.avoid);
        this._ctx.restore();
    }

    protected _drawFingersInternal(chord: ChordDiagramProps, opacity: number = 1): void {
        chord.fingers.forEach(f => {
            if (f.fret <= 0) return;
            this.drawFretPosition(f.fret, f.finger ?? 1, this._numStrings - f.string, this._numStrings - (f.endString ?? f.string));
        });
    }

    drawAvoidedStrings(avoid: number[] | undefined): void {
        if (!avoid) return;

        const context: AvoidedStringsContext = {
            ctx: this._ctx,
            fretboardX: this._fretboardX,
            fretboardY: this._fretboardY,
            fretboardHeight: this._fretboardHeight,
            horizontalPadding: this.horizontalPadding,
            stringSpacing: this._stringSpacing,
            realFretSpacing: this._realFretSpacing,
            numStrings: this._numStrings,
            scaleFactor: this._scaleFactor,
            textColor: this._colors.global.primaryTextColor,
            mirror: this._mirror,
            rotation: this._rotation
        };

        drawAvoidedStrings(context, avoid);
    }

    public drawTransposeIndicator(text: string | number, alignFret: number = 1): void {
        if (!text || Number(text) <= 1) return;

        // Match CapoFretNumber position logic from ShortNeck.ts for consistency
        const xOffsets = 30 * this._scaleFactor;
        const x = this._fretboardX - xOffsets;

        // Position: Vertically aligned with the center of the specific fret space (+ optical correction)
        const y = this._fretboardY + (alignFret - 0.5) * this._realFretSpacing;
        this._ctx.save();

        // Move to the target point
        this._ctx.translate(x, y);

        // Counter-rotations to keep text upright and correct direction
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        // Use theme color for numbers or Orange fallback
        const color = this._colors.capo?.textColors?.number || '#e67e22';
        this._ctx.fillStyle = color;

        // Center horizontally within the margin (30px margin -> 15px center offset)
        const offsetVal = 15 * this._scaleFactor;

        // Determine direction based on rotation
        const isHorizontal = this._rotation === 90 || this._rotation === 270;
        const sign = isHorizontal ? 1 : -1;

        this._ctx.fillText(`${text}ª`, sign * offsetVal, 0);
        this._ctx.restore();
    }

    // Additional drawing methods (Name, Animations)

    drawChordName(chordName: string, options?: { opacity?: number, extensions?: string[] }): void {
        const themeOpacity = this._colors.chordName.opacity ?? 1;
        const transitionOpacity = options?.opacity ?? 1;
        const finalOpacity = themeOpacity * transitionOpacity;
        if (finalOpacity <= 0 || !chordName) return;

        const pos = this._getLabelPosition('name'); // Returns screen coords for center

        // Use shared drawing logic. 
        // Static view usually wants upright text (no mirror/rotation applied to text itself), 
        // while positioning handled by _getLabelPosition.
        this._drawTextWithTransform(
            chordName,
            finalOpacity,
            1, // scale
            0, // translateY
            pos.x,
            pos.y,
            options?.extensions,
            true // ignoreTransforms (keep upright)
        );
    }

    // Animation Methods Implementation (Simplified Copy)

    drawChordWithBuildAnimation(
        chord: ChordDiagramProps,
        transportDisplay: number,
        progress: number,
        offsetX: number = 0
    ): void {
        if (offsetX !== 0) this.calculateWithOffset(offsetX);

        const visuals = prepareShortChordVisuals(chord, this._numFrets, this._globalCapo, transportDisplay);
        const { finalChord, startFret, formattedName, capoConfig, transposeConfig } = visuals;

        this._applyChordSettings(finalChord);

        const easedProgress = easeInOutQuad(progress);

        if (finalChord.showChordName !== false) {
            this.drawChordName(formattedName, { opacity: easedProgress });
        }

        this._ctx.save();
        this.applyTransforms();

        if (!this._fretboardCache) this._updateFretboardCache();

        if (this._fretboardCache && !this._skipFretboard) {
            this._ctx.save();
            this._ctx.globalAlpha = easedProgress;
            this._ctx.drawImage(this._fretboardCache, this._diagramX, this._diagramY);
            this._ctx.restore();
        }

        if (progress >= 1) {
            this._skipFretboard = true;
        }

        this._drawFogProgressive(finalChord, progress);

        if (transposeConfig.isActive) {
            const visibleFrets = finalChord.fingers.filter(f => f.fret > 0).map(f => f.fret);
            const minVisualFret = visibleFrets.length > 0 ? Math.min(...visibleFrets) : 1;
            this.drawTransposeIndicator(transposeConfig.fret, minVisualFret);
        }

        this._ctx.restore();
    }

    private _drawFogProgressive(chord: ChordDiagramProps, progress: number): void {
        const fingersToDraw = Math.floor(progress * chord.fingers.length);
        for (let i = 0; i <= fingersToDraw; i++) {
            const f = chord.fingers[i];
            if (!f || f.fret <= 0) continue;

            let alpha = 1;
            if (i === fingersToDraw) {
                alpha = (progress * chord.fingers.length) - fingersToDraw;
            }

            this._ctx.save();
            this._ctx.globalAlpha = alpha;
            this.drawFretPosition(f.fret, f.finger ?? 1, this._numStrings - f.string, this._numStrings - (f.endString ?? f.string));
            this._ctx.restore();
        }
    }

    drawChordWithTransition(
        currentFinalChord: ChordDiagramProps,
        currentTransportDisplay: number,
        nextFinalChord: ChordDiagramProps,
        nextTransportDisplay: number,
        originalProgress: number,
        offsetX: number = 0,
        options: { skipFretboard?: boolean } = {}
    ): void {
        if (offsetX !== 0) this.calculateWithOffset(offsetX);

        // Pre-calculate both states
        const cVisuals = prepareShortChordVisuals(currentFinalChord, this._numFrets, this._globalCapo, currentTransportDisplay);
        const nVisuals = prepareShortChordVisuals(nextFinalChord, this._numFrets, this._globalCapo, nextTransportDisplay);

        this._applyChordSettings(nVisuals.finalChord);

        const easedProgress = easeInOutQuad(originalProgress);
        const namePos = this._getLabelPosition('name'); // Center coords
        const centerX = namePos.x;
        const centerY = namePos.y;

        // Chord Name Transition
        const scaleOut = 1 - (easedProgress * 0.2);
        const currentNameTranslateY = -easedProgress * (20 * this._scaleFactor);
        const currentExts = cVisuals.finalChord.chord?.extension ? cVisuals.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
        this._drawTextWithTransform(cVisuals.formattedName, 1 - easedProgress, scaleOut, currentNameTranslateY, centerX, centerY, currentExts, true);

        const scaleIn = 0.8 + (easedProgress * 0.2);
        const nextNameTranslateY = (1 - easedProgress) * (20 * this._scaleFactor);
        const nextExts = nVisuals.finalChord.chord?.extension ? nVisuals.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
        this._drawTextWithTransform(nVisuals.formattedName, easedProgress, scaleIn, nextNameTranslateY, centerX, centerY, nextExts, true);

        this._ctx.save();
        this.applyTransforms();

        if (!this._fretboardCache) this._updateFretboardCache();

        if (!this._skipFretboard && !options.skipFretboard) {
            this.fretboardDrawer.drawStringNames(easedProgress, nVisuals.finalChord.stringNames);
            this.fretboardDrawer.drawFretboard();
        }

        if (originalProgress >= 1) {
            this._skipFretboard = true;
        } else {
            this._skipFretboard = false;
        }

        // Calculate min frets for transition alignment
        const getMinFret = (c: ChordDiagramProps) => {
            const visible = c.fingers.filter(f => f.fret > 0).map(f => f.fret);
            return visible.length > 0 ? Math.min(...visible) : 1;
        };

        const cMinFret = getMinFret(cVisuals.finalChord);
        const nMinFret = getMinFret(nVisuals.finalChord);

        // Helper transitions
        this.drawBarreWithTransition(null, null, cVisuals.finalChord.fingers, nVisuals.finalChord.fingers, originalProgress);
        this.drawFingersWithTransition(cVisuals.finalChord.fingers, nVisuals.finalChord.fingers, null, null, originalProgress);
        this.drawAvoidedStringsWithTransition(cVisuals.finalChord.avoid, nVisuals.finalChord.avoid, originalProgress);

        // Transpose indicator transition - using logic from configs
        const cTrans = cVisuals.transposeConfig.isActive ? cVisuals.transposeConfig.fret : 1;
        const nTrans = nVisuals.transposeConfig.isActive ? nVisuals.transposeConfig.fret : 1;

        this.drawTransposeIndicatorWithTransition(cTrans, nTrans, cMinFret, nMinFret, originalProgress);

        this._ctx.restore();
    }

    drawBarreWithTransition(cBarre: BarreInfo | null, nBarre: BarreInfo | null, cFingers: any[], nFingers: any[], progress: number): void {
        const cDetected = detectBarreFromChord({ fingers: cFingers } as any);
        if (cDetected) {
            this._drawBarreShapeAtPosition(cDetected.finger ?? 1, (1 - progress) * this.barreWidth);
            this._ctx.save();
            this._ctx.globalAlpha = 1 - progress;
            this._ctx.restore();
        }
    }

    drawFingersWithTransition(cFingers: any[], nFingers: any[], cBarre: BarreInfo | null, nBarre: BarreInfo | null, progress: number): void {
        this._drawFingersInternal({ fingers: nFingers } as any, progress);
    }

    drawAvoidedStringsWithTransition(cAvoid: number[] | undefined, nAvoid: number[] | undefined, progress: number): void {
        // Stub
    }

    drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void {
        const eased = easeInOutQuad(progress);
        if (cTransport === nTransport && nTransport > 1) {
            this.drawTransposeIndicator(nTransport, nAlignedFret);
            return;
        }

        if (cTransport > 1 && nTransport > 1) {
            this._ctx.save(); this._ctx.globalAlpha = 1 - eased; this.drawTransposeIndicator(cTransport, cAlignedFret); this._ctx.restore();
            this._ctx.save(); this._ctx.globalAlpha = eased; this.drawTransposeIndicator(nTransport, nAlignedFret); this._ctx.restore();
        } else if (nTransport > 1) {
            this._ctx.save(); this._ctx.globalAlpha = eased; this.drawTransposeIndicator(nTransport, nAlignedFret); this._ctx.restore();
        } else if (cTransport > 1) {
            this._ctx.save(); this._ctx.globalAlpha = 1 - eased; this.drawTransposeIndicator(cTransport, cAlignedFret); this._ctx.restore();
        }
    }

    // Helper from abstract
    protected _drawTextWithTransform(
        text: string,
        opacity: number,
        scale: number,
        translateY: number,
        centerX: number,
        centerY: number,
        extensions?: string[],
        ignoreTransforms: boolean = false
    ): void {
        if (opacity <= 0 || !text) return;

        this._ctx.save();
        this._ctx.translate(centerX, centerY);

        if (!ignoreTransforms) {
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        }

        this._ctx.translate(0, translateY);
        this._ctx.scale(scale, scale);

        // 1. Parsing
        // 1. Parsing
        let displayBase = text;
        const rawExtensions = extensions || [];

        let extensionsToStack: string[] = [];

        // Helper to formatting ext for regex matching against displayBase (which is pre-formatted)
        const formatExtForMatch = (ext: string) => ext.replace(/#/g, "♯").replace(/b/g, "♭");

        if (rawExtensions.length > 0) {
            // Case A: Explicit extensions provided
            extensionsToStack = rawExtensions.slice().sort((a, b) => extensionMap.indexOf(a) - extensionMap.indexOf(b));

            // Clean base string from these extensions
            extensionsToStack.forEach(ext => {
                const formatted = formatExtForMatch(ext);
                const esc = formatted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                displayBase = displayBase.replace(new RegExp(esc, 'g'), '');

                // Also try cleaning raw/case-insensitive just in case
                const escRaw = ext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                displayBase = displayBase.replace(new RegExp(escRaw, 'gi'), '');
            });
        } else {
            // Case B: Fallback Parsing
            const foundExts: string[] = [];

            // Local copy sorted by length desc for parsing safety
            const extsToCheck = [...extensionMap].sort((a, b) => b.length - a.length);

            extsToCheck.forEach(ext => {
                let matched = false;

                // 1. Try Unicode match
                const formatted = formatExtForMatch(ext);
                if (displayBase.includes(formatted)) {
                    if (!matched) { foundExts.push(formatted); matched = true; }
                    const esc = formatted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    displayBase = displayBase.replace(new RegExp(esc, 'g'), '');
                }

                // 2. Try Raw/Case-Insensitive match (e.g. B11 vs b11)
                const escRaw = ext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const rawRegex = new RegExp(escRaw, 'gi');
                if (displayBase.match(rawRegex)) {
                    // Found in ASCII/Case-variant form.
                    // Push VALID FORMATTED version to stack for consistent look
                    if (!matched) { foundExts.push(formatted); matched = true; }
                    displayBase = displayBase.replace(rawRegex, '');
                }
            });

            // Now re-sort them by musical order. 
            const unformat = (s: string) => s.replace(/♯/g, "#").replace(/♭/g, "b");

            extensionsToStack = foundExts.sort((a, b) => {
                return extensionMap.indexOf(unformat(a)) - extensionMap.indexOf(unformat(b));
            });
        }

        // Ensure stack items are formatted (Case A might have been ASCII)
        extensionsToStack = extensionsToStack.map(formatExtForMatch);

        // 2. Extract Bass (if any)
        // Look for slash at the end of the string
        let bass = "";
        const bassMatch = displayBase.match(/(\/[A-G][♯♭#b]?)$/);
        if (bassMatch) {
            bass = bassMatch[1];
            // Remove bass from displayBase
            displayBase = displayBase.substring(0, displayBase.length - bass.length);
        }

        // Apply formatting (sharps/flats)
        displayBase = displayBase.replace(/#/g, "♯").replace(/b/g, "♭");
        bass = bass.replace(/#/g, "♯").replace(/b/g, "♭");

        const match = displayBase.match(/^([A-G][♯♭]?)(.*)$/);
        const root = match ? match[1] : displayBase;
        const remainder = match ? match[2] : "";

        // Sizes
        const rootFontSize = 75 * this._scaleFactor;
        const remainderFontSize = 75 * this._scaleFactor; // User requested SAME as root
        const bassFontSize = 75 * this._scaleFactor;      // User requested SAME as root
        const extensionFontSize = 35 * this._scaleFactor;

        // Measures
        this._ctx.font = `bold ${rootFontSize}px sans-serif`;
        const rootWidth = this._ctx.measureText(root).width;

        this._ctx.font = `bold ${remainderFontSize}px sans-serif`;
        const remainderWidth = this._ctx.measureText(remainder).width;

        this._ctx.font = `bold ${bassFontSize}px sans-serif`;
        const bassWidth = this._ctx.measureText(bass).width;

        // Calculate Stack Width
        this._ctx.font = `bold ${extensionFontSize}px sans-serif`;
        let maxStackWidth = 0;
        extensionsToStack.forEach(ext => {
            const w = this._ctx.measureText(ext).width;
            if (w > maxStackWidth) maxStackWidth = w;
        });

        // Layout: [Root][Quality][Stack][Bass]
        // Note: Bass at the END as per request "no fim o baixo /G"
        // And Dm is D+m.

        const totalWidth = rootWidth + remainderWidth + (extensionsToStack.length > 0 ? maxStackWidth + (5 * this._scaleFactor) : 0) + bassWidth;
        const startX = -totalWidth / 2;

        // Apply Shadow for Chord Name
        this.applyShadow(this._colors.chordName.shadow);

        this._ctx.fillStyle = this.hexToRgba(this._colors.chordName.color, opacity);
        this._ctx.textAlign = "left";
        this._ctx.textBaseline = "middle";

        let currentX = startX;

        // Draw Root
        this._ctx.font = `bold ${rootFontSize}px sans-serif`;
        this._ctx.fillText(root, currentX, 0);
        currentX += rootWidth;

        // Draw Remainder (Quality)
        if (remainder) {
            this._ctx.font = `bold ${remainderFontSize}px sans-serif`;
            this._ctx.fillText(remainder, currentX, 0); // Aligned baseline with root
            currentX += remainderWidth;
        }

        // Draw Stacked Extensions
        if (extensionsToStack.length > 0) {
            // Add small padding before stack
            currentX += 5 * this._scaleFactor;

            this._ctx.font = `bold ${extensionFontSize}px sans-serif`;
            const lineHeight = extensionFontSize * 0.85;

            const totalStackHeight = extensionsToStack.length * lineHeight;
            let stackY = -(totalStackHeight / 2) + (lineHeight / 2);
            stackY -= 5 * this._scaleFactor; // fine tune

            const stackX = currentX; // Center stack or left align? Text is left aligned.

            extensionsToStack.forEach((ext, i) => {
                this._ctx.fillText(ext, stackX, stackY + (i * lineHeight));
            });

            currentX += maxStackWidth + (5 * this._scaleFactor); // space after stack
        }

        // Draw Bass
        if (bass) {
            this._ctx.font = `bold ${bassFontSize}px sans-serif`;
            this._ctx.fillText(bass, currentX, 0);
            currentX += bassWidth;
        }

        this.applyShadow(undefined);
        this._ctx.restore();
    }

    private _applyChordSettings(chord: ChordDiagramProps): void {
        const chordNumStrings = chord.stringNames?.length ?? 6;
        if (chordNumStrings !== this._numStrings) {
            this.setNumStrings(chordNumStrings);
            this.fretboardDrawer.setNumStrings(this._numStrings);
            this.fretboardDrawer.setStringSpacing(this._stringSpacing);
            this.fretboardDrawer.setFretboardWidth(this._fretboardWidth);
            this.fretboardDrawer.setHorizontalPadding(this.horizontalPadding);
            this._fretboardCache = null;
        }
    }

    // Needed for drawTranspsoeIndicator
    drawFretPosition(
        fret: number,
        finger: number | string,
        fromStringIndex: number,
        toStringIndex: number
    ): void {
        const fretY = this._fretboardY + (fret - 0.5) * this._realFretSpacing;
        const isBarre = fromStringIndex !== toStringIndex;
        let centerX: number;
        let barreVisualWidth: number = 0;

        if (isBarre) {
            const leftIdx = Math.min(fromStringIndex, toStringIndex);
            const rightIdx = Math.max(fromStringIndex, toStringIndex);
            let fromX = this._fretboardX + this.horizontalPadding + leftIdx * this._stringSpacing;
            let toX = this._fretboardX + this.horizontalPadding + rightIdx * this._stringSpacing;
            fromX -= this.fingerRadius;
            toX += this.fingerRadius;
            barreVisualWidth = toX - fromX;
            centerX = fromX + barreVisualWidth / 2;
        } else {
            centerX = this._fretboardX + this.horizontalPadding + fromStringIndex * this._stringSpacing;
        }

        this._drawShapeAndFingerNumber(centerX, fretY, finger, isBarre, barreVisualWidth);
    }
}
