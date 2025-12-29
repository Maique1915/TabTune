import { ScoreStyle } from './types';

/**
 * ScoreStyler
 * A utility class to apply styling to VexFlow objects and rendered SVG elements.
 * Handles compatibility between VexFlow 4 and 5 object models.
 */
export class ScoreStyler {
    private style: ScoreStyle;

    constructor(style: ScoreStyle) {
        this.style = style;
    }

    /**
     * Updates the internal style configuration.
     */
    public updateStyle(newStyle: ScoreStyle) {
        this.style = newStyle;
    }

    /**
     * The "Nuclear Option" for applying styles deep into VexFlow objects.
     * Works by patching the draw method or using V5 config APIs.
     */
    public applyDeepStyle(obj: any, color: string) {
        if (!obj || typeof obj !== 'object') return;

        // 1. Standard setStyle (Works in VexFlow 4 and some V5 objects)
        try {
            if (typeof obj.setStyle === 'function') {
                obj.setStyle({ fillStyle: color, strokeStyle: color });
            }
        } catch (e) {
            // Ignore errors if setStyle fails
        }

        // 2. Override Draw (The real fix for persistent styling)
        if (!obj.__patched_draw && typeof obj.draw === 'function') {
            const originalDraw = obj.draw;
            obj.draw = function (this: any) {
                // Force Context State
                if (this.context) {
                    this.context.save();
                    this.context.fillStyle = color;
                    this.context.strokeStyle = color;
                }

                // Update properties just in case (Legacy Props)
                this.fillStyle = color;
                this.strokeStyle = color;

                // Render Options (VexFlow 4+)
                if (this.render_options) {
                    this.render_options.fillStyle = color;
                    this.render_options.strokeStyle = color;
                    this.render_options.stroke = color;
                    this.render_options.fill = color;
                }

                // Element Style (VexFlow 5 new object model)
                if (this.style) {
                    this.style.fill = color;
                    this.style.stroke = color;
                }

                // Execute
                let result;
                try {
                    result = originalDraw.apply(this, arguments);
                } catch (err) {
                    // console.warn("Draw error in patched object", err);
                }

                if (this.context) {
                    this.context.restore();
                }
                return result;
            };
            obj.__patched_draw = true;
        }

        // 3. Official API (V5) - config attributes
        if (obj.setConfigForAttribute) {
            const cat = (obj.getCategory ? obj.getCategory() : "").toLowerCase();
            if (cat.includes('clef')) obj.setConfigForAttribute('clef', { fillStyle: color, strokeStyle: color });
            if (cat.includes('time')) obj.setConfigForAttribute('timeSignature', { fillStyle: color, strokeStyle: color });
        }
    }

    /**
     * Styles a VexFlow Stave and its modifiers (Clef, TimeSig, KeySig).
     */
    public styleStave(stave: any) {
        if (!stave) return;

        const { lineColor, clefColor, timeSigColor, symbolColor } = this.style;

        // Base Stave Lines
        if (stave.setStyle) {
            stave.setStyle({ strokeStyle: lineColor, fillStyle: lineColor });
        }

        // Modifiers
        if (stave.getModifiers) {
            stave.getModifiers().forEach((mod: any) => {
                const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();

                if (category.includes('clef')) {
                    this.applyDeepStyle(mod, clefColor);
                } else if (category.includes('time') || category.includes('timesignature')) {
                    this.applyDeepStyle(mod, timeSigColor);
                } else if (category.includes('lines') || category.includes('barline')) {
                    this.applyDeepStyle(mod, lineColor);
                } else if (category.includes('key')) {
                    this.applyDeepStyle(mod, clefColor);
                } else if (category.includes('tab')) {
                    this.applyDeepStyle(mod, symbolColor); // "TAB" text
                }
            });
        }

        // V5 Configs
        if (stave.setConfigForAttribute) {
            stave.setConfigForAttribute('clef', { fillStyle: clefColor, strokeStyle: clefColor });
            stave.setConfigForAttribute('timeSignature', { fillStyle: timeSigColor, strokeStyle: timeSigColor });
            stave.setConfigForAttribute('keySignature', { fillStyle: clefColor, strokeStyle: clefColor });

            const constructorName = stave.constructor ? stave.constructor.name : '';
            if (constructorName === 'TabStave' || (stave.Category && stave.Category === 'TabStave')) {
                stave.setConfigForAttribute('tabGlyph', { fillStyle: clefColor, strokeStyle: clefColor });
            }
        }
    }

    /**
     * Styles a list of notes (Standard or Tab).
     */
    public styleNotes(notes: any[], isTab: boolean = false) {
        if (!notes || !Array.isArray(notes)) return;

        const { noteColor, restColor, tabNumberColor, symbolColor } = this.style;

        notes.forEach(note => {
            const isRest = note.isRest === true || (typeof note.isRest === 'function' && note.isRest());
            let finalColor = isRest ? restColor : noteColor;

            if (isTab) {
                // For tab notes, main color is the number color
                finalColor = isRest ? restColor : tabNumberColor;
            }

            // Apply to Note
            this.applyDeepStyle(note, finalColor);
            if (note.setStemStyle) note.setStemStyle({ strokeStyle: finalColor });
            if (note.setLedgerLineStyle) note.setLedgerLineStyle({ strokeStyle: finalColor, fillStyle: finalColor });

            // Apply to Modifiers (Accidentals, Dots, Etc.)
            if (note.getModifiers) {
                note.getModifiers().forEach((mod: any) => {
                    // Usually modifiers follow note color, except for specific Tab symbols maybe
                    this.applyDeepStyle(mod, isTab ? symbolColor : finalColor);
                });
            }

            // Beams
            if (isRest) {
                if (note.setBeam) note.setBeam(null);
            } else if (note.getBeam && note.getBeam()) {
                const beam = note.getBeam();
                if (beam.setStyle) beam.setStyle({ fillStyle: finalColor, strokeStyle: finalColor });
            }
        });
    }

    /**
     * Post-render SVG manipulation to catch elements that VexFlow might have missed.
     */
    public stylePostRenderSVG(svg: SVGSVGElement | HTMLElement) {
        if (!svg) return;

        // Helper to color by class
        const colorByClass = (className: string, color: string, strokeToo: boolean = true) => {
            const elements = svg.querySelectorAll(`.${className}, .${className} path, .${className} rect, .${className} text`);
            elements.forEach((el: Element) => {
                if (el instanceof HTMLElement || el instanceof SVGElement) {
                    el.style.fill = color;
                    if (strokeToo) el.style.stroke = color;
                }
            });
        };

        const { clefColor, timeSigColor, lineColor, tabNumberColor, symbolColor } = this.style;

        // Apply colors matching ScoreStyle
        colorByClass('vf-clef', clefColor);
        colorByClass('vf-timesignature', timeSigColor);
        colorByClass('vf-key-signature', clefColor);
        colorByClass('vf-stave', lineColor);

        // Tab Numbers
        const tabNotes = svg.querySelectorAll('.vf-tab-note text, .vf-tab-note path');
        tabNotes.forEach((el: Element) => {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                if (el.tagName.toLowerCase() === 'text') {
                    el.style.fill = tabNumberColor;
                    el.style.stroke = tabNumberColor;
                } else {
                    el.style.fill = symbolColor;
                    el.style.stroke = symbolColor;
                }
            }
        });

        // Modifiers & Symbols
        const symbols = svg.querySelectorAll('.vf-modifier, .vf-articulation, .vf-ornament');
        symbols.forEach((el: Element) => {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                el.style.fill = symbolColor;
                el.style.stroke = symbolColor;
            }
        });

        // Tab Glyph
        const tabGlyphs = svg.querySelectorAll('.vf-tab-stave .vf-clef, .vf-tab-glyph');
        tabGlyphs.forEach((el: Element) => {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                el.style.fill = symbolColor;
                el.style.stroke = symbolColor;
            }
        });
    }

    /**
     * Removes or recolors white backgrounds on SVG elements (Fix for VexFlow TabNotes).
     */
    public removeBackgrounds(svg: SVGSVGElement | HTMLElement) {
        if (!svg) return;

        const { paperColor } = this.style;
        const bgRects = svg.querySelectorAll('rect[fill="white"], rect[fill="#ffffff"]');

        bgRects.forEach((rect: any) => {
            // Make invisible or match paper color
            rect.style.fill = paperColor !== '#ffffff' ? paperColor : 'transparent';
            rect.style.opacity = paperColor === '#ffffff' ? '0' : '1';
        });
    }
}
