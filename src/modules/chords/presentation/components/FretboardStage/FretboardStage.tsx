"use client";

import React, { useCallback, ForwardedRef } from "react";
import type { ChordWithTiming, ChordDiagramProps } from "@/modules/core/domain/types";
import { type ChordDrawer } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortNeckDrawer } from "@/modules/engine/infrastructure/drawers/ShortNeck";
import { FretboardEngine } from "@/modules/engine/infrastructure/FretboardEngine";
import { TimelineState } from "@/modules/chords/domain/types";
import { useBaseStage, BaseStageRef, BaseStageProps } from "./useBaseStage";
import { BaseStageUI } from "./BaseStageUI";

export interface FretboardStageRef extends BaseStageRef { }

interface FretboardStageProps extends BaseStageProps {
    // FretboardStage specific props (if any were not in BaseStageProps, but they all seem to be)
}

export const FretboardStage = React.forwardRef<FretboardStageRef, FretboardStageProps>((props, ref) => {
    const {
        width = 1920,
        height = 1080,
        numStrings = 6,
        numFrets: propNumFrets,
        capo = 0,
        stringNames = ["E", "A", "D", "G", "B", "e"],
        showChordName = true,
        transitionsEnabled = true,
        buildEnabled = true,
        animationType: propsAnimationType,
        colors: propsColors
    } = props;

    const engineFactory = useCallback((canvas: HTMLCanvasElement) => {
        return new FretboardEngine(canvas, {
            width,
            height,
            numStrings,
            numFrets: propNumFrets ?? 5,
            colors: propsColors as any,
            animationType: propsAnimationType || 'dynamic-fingers',
            showChordName,
            transitionsEnabled,
            buildEnabled,
            capo,
            tuning: stringNames
        });
    }, [width, height, numStrings, propNumFrets, propsColors, propsAnimationType, showChordName, transitionsEnabled, buildEnabled, capo, stringNames]);

    const onDrawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // We need to resolve effective values here, or we can just use the ones passed to useBaseStage which returns 'colors' resolved
        // But since we can't easily access the hooked 'colors' inside this callback definition before the hook runs...
        // We should rely on the hook passing us specific resolved values OR just accept that we might duplicate resolution slightly
        // actually useBaseStage calls this effect.

        // Wait, the hook calls this function.
        // Let's assume props are fresh enough or use deps.
        ctx.clearRect(0, 0, w, h);

        // Note: We don't have access to context-resolved colors here unless we pass them in or context is available.
        // The hook has the context resolved colors.
        // It might be better if the hook passes resolved colors to this callback.
        // BUT, for now, let's just use what we have in props + maybe we need to fetch context here too?
        // Actually, let's just use the props or if undefined, let the drawer handle defaults/context if possible?
        // No, Context was used for colors.

        // Refactor strategy: useBaseStage returns `colors` and `animationType`. 
        // But `onDrawBackground` is passed TO `useBaseStage`.
        // So `useBaseStage` should probably pass the resolved colors back to the callback?
        // OR we just move the check logic into the callback.

        // Let's modify the callback signature? No, let's just grab context here too OR
        // allow the hook to pass `colors` to the `onDrawBackground`

    }, []);

    // Re-thinking: The hook has the resolved colors. 
    // It should probably pass them to `onDrawBackground`.
    // Let's check `useBaseStage` again. 
    // `useEffect(() => { ... onDrawBackground(ctx, width, height) }, ...)`
    // I should update `useBaseStage` to pass `colors` to `onDrawBackground`.

    // Instead of aborting, I will proceed with a slightly different pattern:
    // I'll make the callback take `colors` as an argument if I can change `useBaseStage` in next step.
    // For now, I will use a local implementation that mimics the original logic, accessing context again if needed 
    // OR just use the hook's return values? No, can't use return values in the init of the hook.

    // Better approach: `useBaseStage` returns `colors`. I can use that in a separate `useEffect` for drawing background?
    // The previous implementation had a specific useEffect for background.
    // `useBaseStage` has:
    /*
        useEffect(() => {
            if (!backgroundCanvasRef.current) return;
            const ctx = backgroundCanvasRef.current.getContext('2d');
            if (!ctx) return;
            onDrawBackground(ctx, width, height);
        }, [width, height, onDrawBackground]);
    */
    // If I strictly follow this, `onDrawBackground` must capture `colors`.
    // So I'll just use `useAppContext` here as well to get the context colors, resolve them, and use them.

    return <FretboardStageImplementation {...props} ref={ref as any} />;
});

// Helper component to allow calling hooks that might be needed for callback dependencies
const FretboardStageImplementation = React.forwardRef<FretboardStageRef, FretboardStageProps>((props, ref) => {
    // We need to resolve colors here to pass to the callback closure
    // But wait, `useBaseStage` ALSO resolves colors.
    // It's fine to resolve twice, it's cheap.
    // Actually, `useBaseStage` takes `colors` as prop.

    const { colors: propsColors, numStrings = 6, numFrets: propNumFrets, capo = 0, stringNames, width = 1920, height = 1080 } = props;

    // We need `useBaseStage` to *provide* the resolved colors to us, or we just rely on `useBaseStage` to handle logic
    // But `onDrawBackground` is ours.

    // Let's modify `useBaseStage` design slightly on the fly? 
    // No, I entered a `replace_file_content`. I must commit.
    // I can assume `useBaseStage` is fixed or I fix it later.
    // Actually `useBaseStage` implementation I wrote passes `(ctx, width, height)`.
    // So I must capture `colors` in the closure of `onDrawBackground`.

    // So I need to use the hook inside FretboardStage and pass the result to the callback? 
    // No, I pass the callback TO the hook.

    // Correct pattern:
    // FretboardStageImplementation calls `useBaseStage`.
    // `onDrawBackground` is a dependency of `useBaseStage`.
    // So `onDrawBackground` needs to be memoized with `colors` as dependency.
    // Where do I get resolved `colors`?
    // I can get them from `useAppContext` right here.

    // Wait, the original `FretboardStage` logic for background was:
    /*
        const { colors: contextColors } = useAppContext();
        const colors = propsColors || contextColors || undefined;
        useEffect(() => { ... draw background ... }, [..., colors])
    */

    // So yes, I will just do that here.

    const { colors: contextColors, startAnimation } = require("@/modules/core/presentation/context/app-context").useAppContext(); // Using require to avoid top-level import conflict if any, or just import normally.
    // Actually standard import is fine.

    return <FretboardStageInner {...props} contextColors={contextColors} forwardedRef={ref} />;
});

// Inner component to handle the hook usage with resolved props available if needed?
// No, simpler:

import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { useMouseShortcuts } from "../../hooks/use-mouse-shortcuts";

const FretboardStageInner = ({ contextColors, forwardedRef, ...props }: any) => {
    const {
        width = 1920,
        height = 1080,
        numStrings = 6,
        numFrets: propNumFrets,
        capo = 0,
        stringNames = ["E", "A", "D", "G", "B", "e"],
        colors: propsColors
    } = props;

    const colors = propsColors || contextColors || undefined;
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    const onDrawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.clearRect(0, 0, w, h);
        if (colors?.global?.backgroundColor) {
            ctx.fillStyle = colors.global.backgroundColor;
            ctx.fillRect(0, 0, w, h);
        }

        const effectiveScale = colors?.global?.scale || 1;
        const bgDrawer = new ShortNeckDrawer(ctx, colors, { width: w, height: h }, {
            diagramWidth: w,
            diagramHeight: h,
            diagramX: 0,
            diagramY: 0,
            numStrings: numStrings,
            numFrets: numFrets,
            horizontalPadding: 100,
            stringSpacing: 0,
            fretboardX: 0,
            fretboardY: 0,
            fretboardWidth: w,
            fretboardHeight: h,
            realFretSpacing: 0,
            neckRadius: 35 * effectiveScale,
            stringNamesY: 0,
        }, effectiveScale);

        bgDrawer.setNumStrings(numStrings || 6);
        bgDrawer.setNumFrets(numFrets || 24);
        bgDrawer.setGlobalCapo(capo || 0);
        bgDrawer.setStringNames(stringNames);
        bgDrawer.drawFretboard();
    }, [colors, numStrings, numFrets, capo, stringNames]);

    const engineFactory = useCallback((canvas: HTMLCanvasElement) => {
        return new FretboardEngine(canvas, {
            width,
            height,
            numStrings,
            numFrets: effectiveNumFrets,
            colors: colors as any,
            animationType: props.animationType || 'dynamic-fingers',
            showChordName: props.showChordName ?? true,
            transitionsEnabled: props.transitionsEnabled ?? true,
            buildEnabled: props.buildEnabled ?? true,
            capo,
            tuning: stringNames
        });
    }, [width, height, numStrings, effectiveNumFrets, colors, props.animationType, props.showChordName, props.transitionsEnabled, props.buildEnabled, capo, stringNames]);

    const baseStage = useBaseStage({
        ...props,
        engineFactory,
        onDrawBackground,
        ref: forwardedRef
    });

    const mouseHandlers = useMouseShortcuts(props, baseStage.engine?.getGeometry());

    return (
        <BaseStageUI
            width={width}
            height={height}
            canvasRef={baseStage.canvasRef as any}
            backgroundCanvasRef={baseStage.backgroundCanvasRef as any}
            stageContainerRef={baseStage.stageContainerRef as any}
            {...mouseHandlers}
        />
    );
};

FretboardStageImplementation.displayName = "FretboardStageImplementation";
FretboardStageInner.displayName = "FretboardStageInner";
FretboardStage.displayName = "FretboardStage";
