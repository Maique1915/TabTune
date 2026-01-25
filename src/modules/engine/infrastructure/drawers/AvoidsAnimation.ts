import { ChordDiagramProps, AvoidStyle } from "@/modules/core/domain/types";
import { AvoidComponent } from "./components/AvoidComponent";
import { GeometryProvider } from "./components/GeometryProvider";

export interface AvoidsAnimationParams {
    ctx: CanvasRenderingContext2D;
    currentAvoid: number[];
    nextAvoid?: number[];
    progress: number;
    geometry: GeometryProvider;
    style: AvoidStyle;
}

/**
 * Manages the fade in/out of unplayed string indicators (Avoids).
 */
export class AvoidsAnimation {
    private avoidComponents: Map<number, AvoidComponent> = new Map();
    private lastAvoidKey: string = "";

    public draw(params: AvoidsAnimationParams): void {
        const { ctx, currentAvoid, nextAvoid, progress, geometry, style } = params;

        const currentKey = (currentAvoid || []).sort().join(',');
        const nextKey = (nextAvoid || []).sort().join(',');
        const fullKey = `${currentKey}|${nextKey}`;

        if (this.lastAvoidKey !== fullKey) {
            this.setupComponents(currentAvoid, nextAvoid, geometry, style);
            this.lastAvoidKey = fullKey;
        }

        this.avoidComponents.forEach(comp => {
            comp.update(progress);
            comp.draw(ctx);
        });
    }

    private setupComponents(current: number[], next: number[] | undefined, geometry: GeometryProvider, style: AvoidStyle): void {
        this.avoidComponents.clear();

        const currentSet = new Set(current || []);
        const nextSet = new Set(next || []);

        // Union of all strings that have an avoid mark in either state
        const allStrings = new Set([...currentSet, ...nextSet]);

        allStrings.forEach(stringNum => {
            const isCurrent = currentSet.has(stringNum);
            const isNext = nextSet.has(stringNum);

            const comp = new AvoidComponent(stringNum, { ...style, opacity: isCurrent ? 1 : 0 }, geometry);
            comp.setTargetOpacity(isNext ? 1 : 0);
            this.avoidComponents.set(stringNum, comp);
        });
    }

    public reset(): void {
        this.avoidComponents.clear();
        this.lastAvoidKey = "";
    }
}
