import { NeckComponent } from "./NeckComponent";
import { FretsComponent } from "./FretsComponent";
import { StringsComponent } from "./StringsComponent";
import { StringNamesComponent } from "./StringNamesComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";
import { FretboardTheme } from "@/modules/core/domain/types";
import { CapoComponent } from "./CapoComponent";

export class FullNeckComponent {
    private neck!: NeckComponent;
    private frets!: FretsComponent;
    private strings!: StringsComponent;
    private stringNames!: StringNamesComponent;
    private geometry: GeometryProvider;
    private theme: FretboardTheme;

    constructor(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.updateComponents();
    }

    public update(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.updateComponents();
    }

    private _mapShadow(s: any) {
        if (!s) return undefined;
        return {
            enabled: !!s.enabled,
            color: s.color || '#000000',
            blur: s.blur || 0,
            offsetX: s.offsetX || 0,
            offsetY: s.offsetY || 0
        };
    }

    private _mapBorder(b: any) {
        if (!b) return undefined;
        return {
            color: b.color || 'transparent',
            width: b.width || 0
        };
    }

    private updateComponents() {
        const settings = (this.geometry as any).settings;

        this.neck = new NeckComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.neck.color || "#1a1a1a",
                shadow: this._mapShadow(this.theme.fretboard.neck.shadow),
                headColor: this.theme.head?.color || "#3a3a3e",
                headShadow: this._mapShadow(this.theme.head?.shadow),
                headBorder: this._mapBorder(this.theme.head?.border)
            },
            this.geometry,
            {
                showHeadBackground: true,
                neckRadius: settings.neckRadius, // 16 * scale inherited
                headWidth: settings.realFretSpacing
            }
        );

        this.frets = new FretsComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.frets.color || "#555555",
                thickness: this.theme.fretboard.frets.thickness || 3,
                shadow: this._mapShadow(this.theme.fretboard.frets.shadow)
            },
            this.geometry,
            {
                showNut: true
            }
        );

        this.strings = new StringsComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.strings.color || "#cccccc",
                thickness: this.theme.fretboard.strings.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.strings.shadow)
            },
            this.geometry
        );

        this.stringNames = new StringNamesComponent(
            NeckType.FULL,
            ["E", "A", "D", "G", "B", "e"],
            {
                color: this.theme.global.primaryTextColor || "#ffffff",
                fontSize: 24
            },
            this.geometry,
            {
                // FullNeck calculates specific offsets for headstock width
                headWidth: settings.realFretSpacing // Headstock width logic from FullNeck.ts
            }
        );

        const rotation = this.theme.global.rotation || 0;
        const mirror = this.theme.global.mirror || false;
        this.stringNames.setRotation(rotation, mirror);
    }

    public setStringNames(names: string[]) {
        this.stringNames.setStringNames(names);
    }

    public draw(ctx: CanvasRenderingContext2D, phases?: any) {
        // FullNeck currently doesn't implement progressive drawing in the same way as ShortNeck (stubs in FullNeck.ts),
        // but it generally draws everything.

        ctx.save();
        // Global transforms are handled by the Drawer before calling components?
        // Wait, BaseDrawer applies transforms. Components typically don't apply global transforms themselves unless specified.
        // But NeckComponent, FretsComponent, etc. currently don't apply transforms internally EXCEPT for shadows/etc?
        // Actually, looking at ShortNeck.ts/FullNeck.ts, they call `this.applyTransforms()` inside the draw methods.
        // IF I move logic to components, components usually assume the Context is already transformed OR they handle it.
        // 
        // Let's look at `NeckComponent.ts`. 
        // It does `if (this.style.shadow?.enabled) ...` but it does NOT call `ctx.translate/rotate`.
        // 
        // `ShortNeck.ts` calls `this.applyTransforms()` before drawing neck, frets, strings.
        // So `ShortNeckComponent` should probably be called *after* transform is applied, OR `ShortNeckComponent` should apply it.
        // 
        // In `ShortNeck.ts`, `drawChordName` does NOT apply transforms (absolute).
        // 
        // Ideally, `ShortNeckDrawer` applies transform, then calls `ShortNeckComponent.draw()`.

        this.neck.draw(ctx);
        this.frets.draw(ctx);

        // Inlays logic was in `BaseDrawer` but `FullNeck` calls `drawInlays`. 
        // `BaseDrawer.drawInlays` is reused. 
        // We should arguably move Inlays to a component too or `FullNeckComponent` call `BaseDrawer.drawInlays` if possible?
        // No, `FullNeckComponent` doesn't inherit BaseDrawer.
        // `BaseDrawer.drawInlays` uses `this.getFingerCoords`. `GeometryProvider` has that.
        // So we can implement `drawInlays` in `FullNeckComponent` using geometry.

        this.drawInlays(ctx);

        this.strings.draw(ctx);
        this.stringNames.draw(ctx);

        ctx.restore();
    }

    public drawCapo(ctx: CanvasRenderingContext2D, globalCapo: number, transport: number = 1) {
        if (globalCapo <= 0) return;
        const capo = new CapoComponent(globalCapo, {
            color: this.theme.capo?.color || '#c0c0c0',
            border: this.theme.capo?.border || { color: '#808080', width: 2 },
            textColor: this.theme.capo?.textColors?.name || '#2c2c2c',
            opacity: 1
        }, this.geometry, { transport });

        const rotation = this.theme.global.rotation || 0;
        const mirror = this.theme.global.mirror || false;
        capo.setRotation(rotation, mirror);

        capo.draw(ctx);
    }

    private drawInlays(ctx: CanvasRenderingContext2D) {
        // Ported from BaseDrawer since we want component to handle everything
        const inlays = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        const doubleInlays = [12, 24];
        const style = this.theme.fretboard.board?.inlays || { color: '#555555', opacity: 0.5 };

        if ((style.opacity ?? 1) <= 0) return;

        ctx.save();
        // Shadow?

        const scaleFactor = (this.geometry as any).settings.scaleFactor; // Access internal settings if public?

        const radius = (28 * 0.5) * scaleFactor; // 28 is baseFingerRadius
        const numStrings = (this.geometry as any).settings.numStrings;
        const centerString = (numStrings + 1) / 2;

        ctx.fillStyle = this.theme.fretboard.board?.inlays?.color || '#555555'; // simplified
        ctx.globalAlpha = style.opacity ?? 0.5;

        inlays.forEach(fret => {
            if (fret > (this.geometry as any).settings.numFrets) return;

            if (doubleInlays.includes(fret)) {
                const spacing = 1.5;
                const topString = Math.max(1, centerString - spacing);
                const bottomString = Math.min(numStrings, centerString + spacing);

                const p1 = this.geometry.getFingerCoords(fret, topString);
                const p2 = this.geometry.getFingerCoords(fret, bottomString);

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
                ctx.arc(p2.x, p2.y, radius, 0, Math.PI * 2);
                ctx.fill();
            } else {
                const p = this.geometry.getFingerCoords(fret, centerString);
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }
}
