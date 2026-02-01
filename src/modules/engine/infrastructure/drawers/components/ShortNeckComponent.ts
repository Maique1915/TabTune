import { NeckComponent } from "./NeckComponent";
import { FretsComponent } from "./FretsComponent";
import { StringsComponent } from "./StringsComponent";
import { StringNamesComponent } from "./StringNamesComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";
import { FretboardTheme } from "@/modules/core/domain/types";
import { CapoComponent } from "./CapoComponent";

export class ShortNeckComponent {
    private neck!: NeckComponent;
    private frets!: FretsComponent;
    private strings!: StringsComponent;
    private stringNames!: StringNamesComponent;
    private geometry: GeometryProvider;
    private theme: FretboardTheme;

    constructor(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.initializeComponents();
    }

    private initializeComponents() {
        // We might need to update these if geometry/theme changes
        // But for now, we instantiate them.
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
            blur: s.blur !== undefined ? s.blur : 20,
            offsetX: s.offsetX || 0,
            offsetY: s.offsetY !== undefined ? s.offsetY : 10
        };
    }

    private _mapBorder(b: any) {
        if (!b) return undefined;
        return {
            color: b.color || 'transparent',
            width: b.width !== undefined ? b.width : 4
        };
    }

    private updateComponents() {
        this.neck = new NeckComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.neck.color || "#8d8d8d",
                shadow: this._mapShadow(this.theme.fretboard.neck.shadow),
                headColor: this.theme.head?.color || "#3a3a3e",
                headShadow: this._mapShadow(this.theme.head?.shadow),
                headBorder: this._mapBorder(this.theme.head?.border)
            },
            this.geometry,
            {
                showHeadBackground: true, // Configurable?
                neckRadius: this.geometry.neckRadius, // 35 * scale inherited implicitly or explicit? Use provider settings
                headstockYOffset: this.geometry.headstockYOffset,
                diagramY: this.geometry.boardY,
                stringNamesY: this.geometry.stringNamesY
            }
        );

        this.frets = new FretsComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.frets.color || "#666666",
                thickness: this.theme.fretboard.frets.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.frets.shadow)
            },
            this.geometry
        );

        this.strings = new StringsComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.strings.color || "#444444",
                thickness: this.theme.fretboard.strings.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.strings.shadow)
            },
            this.geometry,
            {
                horizontalPadding: this.geometry.paddingX
            }
        );

        this.stringNames = new StringNamesComponent(
            NeckType.SHORT,
            ["E", "A", "D", "G", "B", "e"], // Default, likely overridden
            {
                color: this.theme.head?.textColors?.name || this.theme.global.primaryTextColor || "#ffffff",
                fontSize: 30 // hardcoded base in ShortNeck.ts
            },
            this.geometry,
            {
                horizontalPadding: this.geometry.paddingX,
                stringNamesY: this.geometry.stringNamesY,
                headstockYOffset: this.geometry.headstockYOffset
            }
        );
    }

    public setStringNames(names: string[]) {
        this.stringNames.setStringNames(names);
    }

    public setConditionalFlags(showHeadBackground: boolean) {
        // Need to update neck component options.
        // For simplicity, we can recreate or add setters to NeckComponent.
        // Since NeckComponent constructor takes options and stores them, 
        // we might need to expose a setter in NeckComponent or just recreate it.
        // Recreating is safer for statelessness.
        // However, ShortNeck logic is: setConditionalFlags -> draw()
        // We will assume updateComponents handles this if we store state.

        // Actually, NeckComponent stores `showHeadBackground`.
        // We should probably pass this into `update` or constructor.
        // For now, let's keep it simple and just update internal state if possible, or recreate.
    }

    // Or simpler:
    public draw(ctx: CanvasRenderingContext2D, phases?: {
        neckProgress?: number;
        stringNamesProgress?: number;
        stringsProgress?: number;
        fretsProgress?: number;
        nutProgress?: number;
    }, rotation: number = 0, mirror: boolean = false) {
        // If phases is undefined, draw everything
        const p = phases || { neckProgress: 1, stringNamesProgress: 1, stringsProgress: 1, fretsProgress: 1, nutProgress: 1 };

        const neckP = p.neckProgress ?? 0;
        const fretsP = p.fretsProgress ?? 0;
        const stringsP = p.stringsProgress ?? 0;
        const namesP = p.stringNamesProgress ?? 0;

        if (neckP > 0) this.neck.draw(ctx, neckP);
        if (namesP > 0) {
            this.stringNames.setRotation(rotation, mirror);
            this.stringNames.draw(ctx, namesP);
        }
        if (fretsP > 0) this.frets.draw(ctx);
        if (stringsP > 0) this.strings.draw(ctx);
    }

    public drawCapo(ctx: CanvasRenderingContext2D, capoFret: number, rotation: number, mirror: boolean) {
        if (capoFret <= 0) return;

        const settings = (this.geometry as any).settings;

        const capoComp = new CapoComponent(1, {
            color: this.theme.capo?.color || '#c0c0c0',
            border: this.theme.capo?.border || { color: '#808080', width: 2 },
            textColor: this.theme.capo?.textColors?.name || '#2c2c2c',
            opacity: 1,
            shadow: this.theme.capo?.shadow,
            numberColor: this.theme.capo?.textColors?.number // Passing it via style object (casted inside component)
        } as any, this.geometry, {
            neckAppearance: {
                backgroundColor: this.theme.fretboard.neck.color || "#8d8d8d",
                stringColor: this.theme.fretboard.strings.color || "#444444"
            },
            displayFret: capoFret
        });

        capoComp.setRotation(rotation, mirror);
        capoComp.draw(ctx);
    }
}
