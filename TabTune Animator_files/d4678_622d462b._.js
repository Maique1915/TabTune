(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ],
    [
        "path",
        {
            d: "m21 21-4.3-4.3",
            key: "1qie3q"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Search", __iconNode);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/id/src/id.tsx
__turbopack_context__.s([
    "useId",
    ()=>useId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
;
;
var useReactId = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId".toString()] || (()=>void 0);
var count = 0;
function useId(deterministicId) {
    const [id, setId] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(useReactId());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useId.useLayoutEffect": ()=>{
            if (!deterministicId) setId({
                "useId.useLayoutEffect": (reactId)=>reactId !== null && reactId !== void 0 ? reactId : String(count++)
            }["useId.useLayoutEffect"]);
        }
    }["useId.useLayoutEffect"], [
        deterministicId
    ]);
    return deterministicId || (id ? "radix-".concat(id) : "");
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-accordion/node_modules/@radix-ui/react-collapsible/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Collapsible",
    ()=>Collapsible,
    "CollapsibleContent",
    ()=>CollapsibleContent,
    "CollapsibleTrigger",
    ()=>CollapsibleTrigger,
    "Content",
    ()=>Content,
    "Root",
    ()=>Root,
    "Trigger",
    ()=>Trigger,
    "createCollapsibleScope",
    ()=>createCollapsibleScope
]);
// packages/react/collapsible/src/collapsible.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-presence/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeCollapsible, open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props;
    const [open = false, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChange
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollapsibleProvider, {
        scope: __scopeCollapsible,
        disabled,
        contentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        open,
        onOpenToggle: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "Collapsible.useCallback": ()=>setOpen({
                    "Collapsible.useCallback": (prevOpen)=>!prevOpen
                }["Collapsible.useCallback"])
        }["Collapsible.useCallback"], [
            setOpen
        ]),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            "data-state": getState(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
        })
    });
});
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME = "CollapsibleTrigger";
var CollapsibleTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, context.onOpenToggle)
    });
});
CollapsibleTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "CollapsibleContent";
var CollapsibleContent = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || context.open,
        children: (param)=>{
            let { present } = param;
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CollapsibleContentImpl, {
                ...contentProps,
                ref: forwardedRef,
                present
            });
        }
    });
});
CollapsibleContent.displayName = CONTENT_NAME;
var CollapsibleContentImpl = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeCollapsible, present, children, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
    const [isPresent, setIsPresent] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](present);
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    const heightRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const height = heightRef.current;
    const widthRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const width = widthRef.current;
    const isOpen = context.open || isPresent;
    const isMountAnimationPreventedRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](isOpen);
    const originalStylesRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](void 0);
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CollapsibleContentImpl.useEffect": ()=>{
            const rAF = requestAnimationFrame({
                "CollapsibleContentImpl.useEffect.rAF": ()=>isMountAnimationPreventedRef.current = false
            }["CollapsibleContentImpl.useEffect.rAF"]);
            return ({
                "CollapsibleContentImpl.useEffect": ()=>cancelAnimationFrame(rAF)
            })["CollapsibleContentImpl.useEffect"];
        }
    }["CollapsibleContentImpl.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "CollapsibleContentImpl.useLayoutEffect": ()=>{
            const node = ref.current;
            if (node) {
                originalStylesRef.current = originalStylesRef.current || {
                    transitionDuration: node.style.transitionDuration,
                    animationName: node.style.animationName
                };
                node.style.transitionDuration = "0s";
                node.style.animationName = "none";
                const rect = node.getBoundingClientRect();
                heightRef.current = rect.height;
                widthRef.current = rect.width;
                if (!isMountAnimationPreventedRef.current) {
                    node.style.transitionDuration = originalStylesRef.current.transitionDuration;
                    node.style.animationName = originalStylesRef.current.animationName;
                }
                setIsPresent(present);
            }
        }
    }["CollapsibleContentImpl.useLayoutEffect"], [
        context.open,
        present
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        id: context.contentId,
        hidden: !isOpen,
        ...contentProps,
        ref: composedRefs,
        style: {
            ["--radix-collapsible-content-height"]: height ? "".concat(height, "px") : void 0,
            ["--radix-collapsible-content-width"]: width ? "".concat(width, "px") : void 0,
            ...props.style
        },
        children: isOpen && children
    });
});
function getState(open) {
    return open ? "open" : "closed";
}
var Root = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/direction/src/Direction.tsx
__turbopack_context__.s([
    "DirectionProvider",
    ()=>DirectionProvider,
    "Provider",
    ()=>Provider,
    "useDirection",
    ()=>useDirection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
var DirectionContext = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0);
var DirectionProvider = (props)=>{
    const { dir, children } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DirectionContext.Provider, {
        value: dir,
        children
    });
};
function useDirection(localDir) {
    const globalDir = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](DirectionContext);
    return localDir || globalDir || "ltr";
}
var Provider = DirectionProvider;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>Accordion,
    "AccordionContent",
    ()=>AccordionContent,
    "AccordionHeader",
    ()=>AccordionHeader,
    "AccordionItem",
    ()=>AccordionItem,
    "AccordionTrigger",
    ()=>AccordionTrigger,
    "Content",
    ()=>Content2,
    "Header",
    ()=>Header,
    "Item",
    ()=>Item,
    "Root",
    ()=>Root2,
    "Trigger",
    ()=>Trigger2,
    "createAccordionScope",
    ()=>createAccordionScope
]);
// packages/react/accordion/src/accordion.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-collection/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-accordion/node_modules/@radix-ui/react-collapsible/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = [
    "Home",
    "End",
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight"
];
var [Collection, useCollection, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollection"])(ACCORDION_NAME);
var [createAccordionContext, createAccordionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(ACCORDION_NAME, [
    createCollectionScope,
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollapsibleScope"]
]);
var useCollapsibleScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollapsibleScope"])();
var Accordion = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { type, ...accordionProps } = props;
    const singleProps = accordionProps;
    const multipleProps = accordionProps;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Provider, {
        scope: props.__scopeAccordion,
        children: type === "multiple" ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionImplMultiple, {
            ...multipleProps,
            ref: forwardedRef
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionImplSingle, {
            ...singleProps,
            ref: forwardedRef
        })
    });
});
Accordion.displayName = ACCORDION_NAME;
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(ACCORDION_NAME, {
    collapsible: false
});
var AccordionImplSingle = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { value: valueProp, defaultValue, onValueChange = ()=>{}, collapsible = false, ...accordionSingleProps } = props;
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onValueChange
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionValueProvider, {
        scope: props.__scopeAccordion,
        value: value ? [
            value
        ] : [],
        onItemOpen: setValue,
        onItemClose: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
            "AccordionImplSingle.useCallback": ()=>collapsible && setValue("")
        }["AccordionImplSingle.useCallback"], [
            collapsible,
            setValue
        ]),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionCollapsibleProvider, {
            scope: props.__scopeAccordion,
            collapsible,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionImpl, {
                ...accordionSingleProps,
                ref: forwardedRef
            })
        })
    });
});
var AccordionImplMultiple = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { value: valueProp, defaultValue, onValueChange = ()=>{}, ...accordionMultipleProps } = props;
    const [value = [], setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onValueChange
    });
    const handleItemOpen = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "AccordionImplMultiple.useCallback[handleItemOpen]": (itemValue)=>setValue({
                "AccordionImplMultiple.useCallback[handleItemOpen]": function() {
                    let prevValue = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
                    return [
                        ...prevValue,
                        itemValue
                    ];
                }
            }["AccordionImplMultiple.useCallback[handleItemOpen]"])
    }["AccordionImplMultiple.useCallback[handleItemOpen]"], [
        setValue
    ]);
    const handleItemClose = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "AccordionImplMultiple.useCallback[handleItemClose]": (itemValue)=>setValue({
                "AccordionImplMultiple.useCallback[handleItemClose]": function() {
                    let prevValue = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
                    return prevValue.filter({
                        "AccordionImplMultiple.useCallback[handleItemClose]": (value2)=>value2 !== itemValue
                    }["AccordionImplMultiple.useCallback[handleItemClose]"]);
                }
            }["AccordionImplMultiple.useCallback[handleItemClose]"])
    }["AccordionImplMultiple.useCallback[handleItemClose]"], [
        setValue
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionValueProvider, {
        scope: props.__scopeAccordion,
        value,
        onItemOpen: handleItemOpen,
        onItemClose: handleItemClose,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionCollapsibleProvider, {
            scope: props.__scopeAccordion,
            collapsible: true,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionImpl, {
                ...accordionMultipleProps,
                ref: forwardedRef
            })
        })
    });
});
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
    const accordionRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(accordionRef, forwardedRef);
    const getItems = useCollection(__scopeAccordion);
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])(dir);
    const isDirectionLTR = direction === "ltr";
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
        var _triggerCollection_clampedIndex_ref_current;
        if (!ACCORDION_KEYS.includes(event.key)) return;
        const target = event.target;
        const triggerCollection = getItems().filter((item)=>{
            var _item_ref_current;
            return !((_item_ref_current = item.ref.current) === null || _item_ref_current === void 0 ? void 0 : _item_ref_current.disabled);
        });
        const triggerIndex = triggerCollection.findIndex((item)=>item.ref.current === target);
        const triggerCount = triggerCollection.length;
        if (triggerIndex === -1) return;
        event.preventDefault();
        let nextIndex = triggerIndex;
        const homeIndex = 0;
        const endIndex = triggerCount - 1;
        const moveNext = ()=>{
            nextIndex = triggerIndex + 1;
            if (nextIndex > endIndex) {
                nextIndex = homeIndex;
            }
        };
        const movePrev = ()=>{
            nextIndex = triggerIndex - 1;
            if (nextIndex < homeIndex) {
                nextIndex = endIndex;
            }
        };
        switch(event.key){
            case "Home":
                nextIndex = homeIndex;
                break;
            case "End":
                nextIndex = endIndex;
                break;
            case "ArrowRight":
                if (orientation === "horizontal") {
                    if (isDirectionLTR) {
                        moveNext();
                    } else {
                        movePrev();
                    }
                }
                break;
            case "ArrowDown":
                if (orientation === "vertical") {
                    moveNext();
                }
                break;
            case "ArrowLeft":
                if (orientation === "horizontal") {
                    if (isDirectionLTR) {
                        movePrev();
                    } else {
                        moveNext();
                    }
                }
                break;
            case "ArrowUp":
                if (orientation === "vertical") {
                    movePrev();
                }
                break;
        }
        const clampedIndex = nextIndex % triggerCount;
        (_triggerCollection_clampedIndex_ref_current = triggerCollection[clampedIndex].ref.current) === null || _triggerCollection_clampedIndex_ref_current === void 0 ? void 0 : _triggerCollection_clampedIndex_ref_current.focus();
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionImplProvider, {
        scope: __scopeAccordion,
        disabled,
        direction: dir,
        orientation,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Slot, {
            scope: __scopeAccordion,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
                ...accordionProps,
                "data-orientation": orientation,
                ref: composedRefs,
                onKeyDown: disabled ? void 0 : handleKeyDown
            })
        })
    });
});
var ITEM_NAME = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
var AccordionItem = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { __scopeAccordion, value, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
    const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    const triggerId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const open = value && valueContext.value.includes(value) || false;
    const disabled = accordionContext.disabled || props.disabled;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AccordionItemProvider, {
        scope: __scopeAccordion,
        open,
        disabled,
        triggerId,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
            "data-orientation": accordionContext.orientation,
            "data-state": getState(open),
            ...collapsibleScope,
            ...accordionItemProps,
            ref: forwardedRef,
            disabled,
            open,
            onOpenChange: (open2)=>{
                if (open2) {
                    valueContext.onItemOpen(value);
                } else {
                    valueContext.onItemClose(value);
                }
            }
        })
    });
});
AccordionItem.displayName = ITEM_NAME;
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { __scopeAccordion, ...headerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].h3, {
        "data-orientation": accordionContext.orientation,
        "data-state": getState(itemContext.open),
        "data-disabled": itemContext.disabled ? "" : void 0,
        ...headerProps,
        ref: forwardedRef
    });
});
AccordionHeader.displayName = HEADER_NAME;
var TRIGGER_NAME = "AccordionTrigger";
var AccordionTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { __scopeAccordion, ...triggerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.ItemSlot, {
        scope: __scopeAccordion,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
            "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
            "data-orientation": accordionContext.orientation,
            id: itemContext.triggerId,
            ...collapsibleScope,
            ...triggerProps,
            ref: forwardedRef
        })
    });
});
AccordionTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "AccordionContent";
var AccordionContent = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, forwardedRef)=>{
    const { __scopeAccordion, ...contentProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        role: "region",
        "aria-labelledby": itemContext.triggerId,
        "data-orientation": accordionContext.orientation,
        ...collapsibleScope,
        ...contentProps,
        ref: forwardedRef,
        style: {
            ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
            ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
            ...props.style
        }
    });
});
AccordionContent.displayName = CONTENT_NAME;
function getState(open) {
    return open ? "open" : "closed";
}
var Root2 = Accordion;
var Item = AccordionItem;
var Header = AccordionHeader;
var Trigger2 = AccordionTrigger;
var Content2 = AccordionContent;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ChevronDown", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Play
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "polygon",
        {
            points: "6 3 20 12 6 21 6 3",
            key: "1oa8hb"
        }
    ]
];
const Play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Play", __iconNode);
;
 //# sourceMappingURL=play.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Play",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Pause
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            x: "14",
            y: "4",
            width: "4",
            height: "16",
            rx: "1",
            key: "zuxfzm"
        }
    ],
    [
        "rect",
        {
            x: "6",
            y: "4",
            width: "4",
            height: "16",
            rx: "1",
            key: "1okwgv"
        }
    ]
];
const Pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Pause", __iconNode);
;
 //# sourceMappingURL=pause.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Pause",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>SkipBack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "polygon",
        {
            points: "19 20 9 12 19 4 19 20",
            key: "o2sva"
        }
    ],
    [
        "line",
        {
            x1: "5",
            x2: "5",
            y1: "19",
            y2: "5",
            key: "1ocqjk"
        }
    ]
];
const SkipBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("SkipBack", __iconNode);
;
 //# sourceMappingURL=skip-back.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript) <export default as SkipBack>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkipBack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>SkipForward
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "polygon",
        {
            points: "5 4 15 12 5 20 5 4",
            key: "16p6eg"
        }
    ],
    [
        "line",
        {
            x1: "19",
            x2: "19",
            y1: "5",
            y2: "19",
            key: "futhcm"
        }
    ]
];
const SkipForward = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("SkipForward", __iconNode);
;
 //# sourceMappingURL=skip-forward.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript) <export default as SkipForward>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkipForward",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RotateCcw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }
    ],
    [
        "path",
        {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }
    ]
];
const RotateCcw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("RotateCcw", __iconNode);
;
 //# sourceMappingURL=rotate-ccw.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotateCcw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ZoomIn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ],
    [
        "line",
        {
            x1: "21",
            x2: "16.65",
            y1: "21",
            y2: "16.65",
            key: "13gj7c"
        }
    ],
    [
        "line",
        {
            x1: "11",
            x2: "11",
            y1: "8",
            y2: "14",
            key: "1vmskp"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "14",
            y1: "11",
            y2: "11",
            key: "durymu"
        }
    ]
];
const ZoomIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ZoomIn", __iconNode);
;
 //# sourceMappingURL=zoom-in.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript) <export default as ZoomIn>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZoomIn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/maximize.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Maximize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M8 3H5a2 2 0 0 0-2 2v3",
            key: "1dcmit"
        }
    ],
    [
        "path",
        {
            d: "M21 8V5a2 2 0 0 0-2-2h-3",
            key: "1e4gt3"
        }
    ],
    [
        "path",
        {
            d: "M3 16v3a2 2 0 0 0 2 2h3",
            key: "wsl5sc"
        }
    ],
    [
        "path",
        {
            d: "M16 21h3a2 2 0 0 0 2-2v-3",
            key: "18trek"
        }
    ]
];
const Maximize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Maximize", __iconNode);
;
 //# sourceMappingURL=maximize.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/maximize.js [app-client] (ecmascript) <export default as Maximize>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Maximize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/maximize.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-slot/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/compose-refs/src/compose-refs.tsx
__turbopack_context__.s([
    "composeRefs",
    ()=>composeRefs,
    "useComposedRefs",
    ()=>useComposedRefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function setRef(ref, value) {
    if (typeof ref === "function") {
        return ref(value);
    } else if (ref !== null && ref !== void 0) {
        ref.current = value;
    }
}
function composeRefs() {
    for(var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++){
        refs[_key] = arguments[_key];
    }
    return (node)=>{
        let hasCleanup = false;
        const cleanups = refs.map((ref)=>{
            const cleanup = setRef(ref, node);
            if (!hasCleanup && typeof cleanup == "function") {
                hasCleanup = true;
            }
            return cleanup;
        });
        if (hasCleanup) {
            return ()=>{
                for(let i = 0; i < cleanups.length; i++){
                    const cleanup = cleanups[i];
                    if (typeof cleanup == "function") {
                        cleanup();
                    } else {
                        setRef(refs[i], null);
                    }
                }
            };
        }
    };
}
function useComposedRefs() {
    for(var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++){
        refs[_key] = arguments[_key];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"](composeRefs(...refs), refs);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/slot.tsx
__turbopack_context__.s([
    "Root",
    ()=>Slot,
    "Slot",
    ()=>Slot,
    "Slottable",
    ()=>Slottable,
    "createSlot",
    ()=>createSlot,
    "createSlottable",
    ()=>createSlottable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-slot/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children);
        const slottable = childrenArray.find(isSlottable);
        if (slottable) {
            const newElement = slottable.props.children;
            const newChildren = childrenArray.map((child)=>{
                if (child === slottable) {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(newElement) > 1) return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].only(null);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? newElement.props.children : null;
                } else {
                    return child;
                }
            });
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
                ...slotProps,
                ref: forwardedRef,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](newElement, void 0, newChildren) : null
            });
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
            ...slotProps,
            ref: forwardedRef,
            children
        });
    });
    Slot2.displayName = "".concat(ownerName, ".Slot");
    return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
    const SlotClone = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](children)) {
            const childrenRef = getElementRef(children);
            const props2 = mergeProps(slotProps, children.props);
            if (children.type !== __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) {
                props2.ref = forwardedRef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeRefs"])(forwardedRef, childrenRef) : childrenRef;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](children, props2);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(children) > 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].only(null) : null;
    });
    SlotClone.displayName = "".concat(ownerName, ".SlotClone");
    return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
    const Slottable2 = (param)=>{
        let { children } = param;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    };
    Slottable2.displayName = "".concat(ownerName, ".Slottable");
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
}
var Slottable = /* @__PURE__ */ createSlottable("Slottable");
function isSlottable(child) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
    const overrideProps = {
        ...childProps
    };
    for(const propName in childProps){
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    const result = childPropValue(...args);
                    slotPropValue(...args);
                    return result;
                };
            } else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        } else if (propName === "style") {
            overrideProps[propName] = {
                ...slotPropValue,
                ...childPropValue
            };
        } else if (propName === "className") {
            overrideProps[propName] = [
                slotPropValue,
                childPropValue
            ].filter(Boolean).join(" ");
        }
    }
    return {
        ...slotProps,
        ...overrideProps
    };
}
function getElementRef(element) {
    var _Object_getOwnPropertyDescriptor, _Object_getOwnPropertyDescriptor1;
    let getter = (_Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(element.props, "ref")) === null || _Object_getOwnPropertyDescriptor === void 0 ? void 0 : _Object_getOwnPropertyDescriptor.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.ref;
    }
    getter = (_Object_getOwnPropertyDescriptor1 = Object.getOwnPropertyDescriptor(element, "ref")) === null || _Object_getOwnPropertyDescriptor1 === void 0 ? void 0 : _Object_getOwnPropertyDescriptor1.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.props.ref;
    }
    return element.props.ref || element.ref;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Music
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9 18V5l12-2v13",
            key: "1jmyc2"
        }
    ],
    [
        "circle",
        {
            cx: "6",
            cy: "18",
            r: "3",
            key: "fqmcym"
        }
    ],
    [
        "circle",
        {
            cx: "18",
            cy: "16",
            r: "3",
            key: "1hluhg"
        }
    ]
];
const Music = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Music", __iconNode);
;
 //# sourceMappingURL=music.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Music",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>GripVertical
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "9",
            cy: "12",
            r: "1",
            key: "1vctgf"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "5",
            r: "1",
            key: "hp0tcf"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "19",
            r: "1",
            key: "fkjjf6"
        }
    ],
    [
        "circle",
        {
            cx: "15",
            cy: "12",
            r: "1",
            key: "1tmaij"
        }
    ],
    [
        "circle",
        {
            cx: "15",
            cy: "5",
            r: "1",
            key: "19l28e"
        }
    ],
    [
        "circle",
        {
            cx: "15",
            cy: "19",
            r: "1",
            key: "f4zoj3"
        }
    ]
];
const GripVertical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("GripVertical", __iconNode);
;
 //# sourceMappingURL=grip-vertical.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GripVertical",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trash2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
            key: "4alrt4"
        }
    ],
    [
        "path",
        {
            d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
            key: "v07s0e"
        }
    ],
    [
        "line",
        {
            x1: "10",
            x2: "10",
            y1: "11",
            y2: "17",
            key: "1uufr5"
        }
    ],
    [
        "line",
        {
            x1: "14",
            x2: "14",
            y1: "11",
            y2: "17",
            key: "xtxkd"
        }
    ]
];
const Trash2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Trash2", __iconNode);
;
 //# sourceMappingURL=trash-2.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trash2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/redux/dist/redux.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/formatProdErrorMessage.ts
__turbopack_context__.s([
    "__DO_NOT_USE__ActionTypes",
    ()=>actionTypes_default,
    "applyMiddleware",
    ()=>applyMiddleware,
    "bindActionCreators",
    ()=>bindActionCreators,
    "combineReducers",
    ()=>combineReducers,
    "compose",
    ()=>compose,
    "createStore",
    ()=>createStore,
    "isAction",
    ()=>isAction,
    "isPlainObject",
    ()=>isPlainObject,
    "legacy_createStore",
    ()=>legacy_createStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function formatProdErrorMessage(code) {
    return "Minified Redux error #".concat(code, "; visit https://redux.js.org/Errors?code=").concat(code, " for the full message or use the non-minified dev environment for full errors. ");
}
// src/utils/symbol-observable.ts
var $$observable = /* @__PURE__ */ (()=>typeof Symbol === "function" && Symbol.observable || "@@observable")();
var symbol_observable_default = $$observable;
// src/utils/actionTypes.ts
var randomString = ()=>Math.random().toString(36).substring(7).split("").join(".");
var ActionTypes = {
    INIT: "@@redux/INIT".concat(/* @__PURE__ */ randomString()),
    REPLACE: "@@redux/REPLACE".concat(/* @__PURE__ */ randomString()),
    PROBE_UNKNOWN_ACTION: ()=>"@@redux/PROBE_UNKNOWN_ACTION".concat(randomString())
};
var actionTypes_default = ActionTypes;
// src/utils/isPlainObject.ts
function isPlainObject(obj) {
    if (typeof obj !== "object" || obj === null) return false;
    let proto = obj;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}
// src/utils/kindOf.ts
function miniKindOf(val) {
    if (val === void 0) return "undefined";
    if (val === null) return "null";
    const type = typeof val;
    switch(type){
        case "boolean":
        case "string":
        case "number":
        case "symbol":
        case "function":
            {
                return type;
            }
    }
    if (Array.isArray(val)) return "array";
    if (isDate(val)) return "date";
    if (isError(val)) return "error";
    const constructorName = ctorName(val);
    switch(constructorName){
        case "Symbol":
        case "Promise":
        case "WeakMap":
        case "WeakSet":
        case "Map":
        case "Set":
            return constructorName;
    }
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
    return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
    return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
    if (val instanceof Date) return true;
    return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
    let typeOfVal = typeof val;
    if ("TURBOPACK compile-time truthy", 1) {
        typeOfVal = miniKindOf(val);
    }
    return typeOfVal;
}
// src/createStore.ts
function createStore(reducer, preloadedState, enhancer) {
    if (typeof reducer !== "function") {
        throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Expected the root reducer to be a function. Instead, received: '".concat(kindOf(reducer), "'"));
    }
    if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
        throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
    }
    if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
        enhancer = preloadedState;
        preloadedState = void 0;
    }
    if (typeof enhancer !== "undefined") {
        if (typeof enhancer !== "function") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Expected the enhancer to be a function. Instead, received: '".concat(kindOf(enhancer), "'"));
        }
        return enhancer(createStore)(reducer, preloadedState);
    }
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = /* @__PURE__ */ new Map();
    let nextListeners = currentListeners;
    let listenerIdCounter = 0;
    let isDispatching = false;
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = /* @__PURE__ */ new Map();
            currentListeners.forEach((listener, key)=>{
                nextListeners.set(key, listener);
            });
        }
    }
    function getState() {
        if (isDispatching) {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
        }
        return currentState;
    }
    function subscribe(listener) {
        if (typeof listener !== "function") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Expected the listener to be a function. Instead, received: '".concat(kindOf(listener), "'"));
        }
        if (isDispatching) {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
        }
        let isSubscribed = true;
        ensureCanMutateNextListeners();
        const listenerId = listenerIdCounter++;
        nextListeners.set(listenerId, listener);
        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            if (isDispatching) {
                throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
            }
            isSubscribed = false;
            ensureCanMutateNextListeners();
            nextListeners.delete(listenerId);
            currentListeners = null;
        };
    }
    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Actions must be plain objects. Instead, the actual type was: '".concat(kindOf(action), "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples."));
        }
        if (typeof action.type === "undefined") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
        }
        if (typeof action.type !== "string") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'Action "type" property must be a string. Instead, the actual type was: \''.concat(kindOf(action.type), "'. Value was: '").concat(action.type, "' (stringified)"));
        }
        if (isDispatching) {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Reducers may not dispatch actions.");
        }
        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally{
            isDispatching = false;
        }
        const listeners = currentListeners = nextListeners;
        listeners.forEach((listener)=>{
            listener();
        });
        return action;
    }
    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== "function") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Expected the nextReducer to be a function. Instead, received: '".concat(kindOf(nextReducer)));
        }
        currentReducer = nextReducer;
        dispatch({
            type: actionTypes_default.REPLACE
        });
    }
    function observable() {
        const outerSubscribe = subscribe;
        return {
            /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */ subscribe (observer) {
                if (typeof observer !== "object" || observer === null) {
                    throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Expected the observer to be an object. Instead, received: '".concat(kindOf(observer), "'"));
                }
                function observeState() {
                    const observerAsObserver = observer;
                    if (observerAsObserver.next) {
                        observerAsObserver.next(getState());
                    }
                }
                observeState();
                const unsubscribe = outerSubscribe(observeState);
                return {
                    unsubscribe
                };
            },
            [symbol_observable_default] () {
                return this;
            }
        };
    }
    dispatch({
        type: actionTypes_default.INIT
    });
    const store = {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [symbol_observable_default]: observable
    };
    return store;
}
function legacy_createStore(reducer, preloadedState, enhancer) {
    return createStore(reducer, preloadedState, enhancer);
}
// src/utils/warning.ts
function warning(message) {
    if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(message);
    }
    try {
        throw new Error(message);
    } catch (e) {}
}
// src/combineReducers.ts
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
    const reducerKeys = Object.keys(reducers);
    const argumentName = action && action.type === actionTypes_default.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
    if (reducerKeys.length === 0) {
        return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
    }
    if (!isPlainObject(inputState)) {
        return "The ".concat(argumentName, ' has unexpected type of "').concat(kindOf(inputState), '". Expected argument to be an object with the following keys: "').concat(reducerKeys.join('", "'), '"');
    }
    const unexpectedKeys = Object.keys(inputState).filter((key)=>!reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]);
    unexpectedKeys.forEach((key)=>{
        unexpectedKeyCache[key] = true;
    });
    if (action && action.type === actionTypes_default.REPLACE) return;
    if (unexpectedKeys.length > 0) {
        return "Unexpected ".concat(unexpectedKeys.length > 1 ? "keys" : "key", ' "').concat(unexpectedKeys.join('", "'), '" found in ').concat(argumentName, '. Expected to find one of the known reducer keys instead: "').concat(reducerKeys.join('", "'), '". Unexpected keys will be ignored.');
    }
}
function assertReducerShape(reducers) {
    Object.keys(reducers).forEach((key)=>{
        const reducer = reducers[key];
        const initialState = reducer(void 0, {
            type: actionTypes_default.INIT
        });
        if (typeof initialState === "undefined") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'The slice reducer for key "'.concat(key, "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined."));
        }
        if (typeof reducer(void 0, {
            type: actionTypes_default.PROBE_UNKNOWN_ACTION()
        }) === "undefined") {
            throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'The slice reducer for key "'.concat(key, "\" returned undefined when probed with a random type. Don't try to handle '").concat(actionTypes_default.INIT, '\' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.'));
        }
    });
}
function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for(let i = 0; i < reducerKeys.length; i++){
        const key = reducerKeys[i];
        if ("TURBOPACK compile-time truthy", 1) {
            if (typeof reducers[key] === "undefined") {
                warning('No reducer provided for key "'.concat(key, '"'));
            }
        }
        if (typeof reducers[key] === "function") {
            finalReducers[key] = reducers[key];
        }
    }
    const finalReducerKeys = Object.keys(finalReducers);
    let unexpectedKeyCache;
    if (("TURBOPACK compile-time value", "development") !== "production") {
        unexpectedKeyCache = {};
    }
    let shapeAssertionError;
    try {
        assertReducerShape(finalReducers);
    } catch (e) {
        shapeAssertionError = e;
    }
    return function combination() {
        let state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, action = arguments.length > 1 ? arguments[1] : void 0;
        if (shapeAssertionError) {
            throw shapeAssertionError;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
            if (warningMessage) {
                warning(warningMessage);
            }
        }
        let hasChanged = false;
        const nextState = {};
        for(let i = 0; i < finalReducerKeys.length; i++){
            const key = finalReducerKeys[i];
            const reducer = finalReducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            if (typeof nextStateForKey === "undefined") {
                const actionType = action && action.type;
                throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "When called with an action of type ".concat(actionType ? '"'.concat(String(actionType), '"') : "(unknown type)", ', the slice reducer for key "').concat(key, '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'));
            }
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
        return hasChanged ? nextState : state;
    };
}
// src/bindActionCreators.ts
function bindActionCreator(actionCreator, dispatch) {
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        return dispatch(actionCreator.apply(this, args));
    };
}
function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === "function") {
        return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== "object" || actionCreators === null) {
        throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "bindActionCreators expected an object or a function, but instead received: '".concat(kindOf(actionCreators), '\'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'));
    }
    const boundActionCreators = {};
    for(const key in actionCreators){
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === "function") {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    }
    return boundActionCreators;
}
// src/compose.ts
function compose() {
    for(var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++){
        funcs[_key] = arguments[_key];
    }
    if (funcs.length === 0) {
        return (arg)=>arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce((a, b)=>function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return a(b(...args));
        });
}
// src/applyMiddleware.ts
function applyMiddleware() {
    for(var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++){
        middlewares[_key] = arguments[_key];
    }
    return (createStore2)=>(reducer, preloadedState)=>{
            const store = createStore2(reducer, preloadedState);
            let dispatch = ()=>{
                throw new Error(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
            };
            const middlewareAPI = {
                getState: store.getState,
                dispatch: function(action) {
                    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                        args[_key - 1] = arguments[_key];
                    }
                    return dispatch(action, ...args);
                }
            };
            const chain = middlewares.map((middleware)=>middleware(middlewareAPI));
            dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            };
        };
}
// src/utils/isAction.ts
function isAction(action) {
    return isPlainObject(action) && "type" in action && typeof action.type === "string";
}
;
 //# sourceMappingURL=redux.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = React.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef(null);
        if (null === instRef.current) {
            var inst = {
                hasValue: !1,
                value: null
            };
            instRef.current = inst;
        } else inst = instRef.current;
        instRef = useMemo(function() {
            function memoizedSelector(nextSnapshot) {
                if (!hasMemo) {
                    hasMemo = !0;
                    memoizedSnapshot = nextSnapshot;
                    nextSnapshot = selector(nextSnapshot);
                    if (void 0 !== isEqual && inst.hasValue) {
                        var currentSelection = inst.value;
                        if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
                    }
                    return memoizedSelection = nextSnapshot;
                }
                currentSelection = memoizedSelection;
                if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
                var nextSelection = selector(nextSnapshot);
                if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
                memoizedSnapshot = nextSnapshot;
                return memoizedSelection = nextSelection;
            }
            var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
            return [
                function() {
                    return memoizedSelector(getSnapshot());
                },
                null === maybeGetServerSnapshot ? void 0 : function() {
                    return memoizedSelector(maybeGetServerSnapshot());
                }
            ];
        }, [
            getSnapshot,
            getServerSnapshot,
            selector,
            isEqual
        ]);
        var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
        useEffect(function() {
            inst.hasValue = !0;
            inst.value = value;
        }, [
            value
        ]);
        useDebugValue(value);
        return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/tab_videos/download (2)/node_modules/use-sync-external-store/with-selector.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/tab_videos/download (2)/node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js [app-client] (ecmascript)");
}
}),
"[project]/tab_videos/download (2)/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/react.ts
__turbopack_context__.s([
    "Provider",
    ()=>Provider_default,
    "ReactReduxContext",
    ()=>ReactReduxContext,
    "batch",
    ()=>batch,
    "connect",
    ()=>connect_default,
    "createDispatchHook",
    ()=>createDispatchHook,
    "createSelectorHook",
    ()=>createSelectorHook,
    "createStoreHook",
    ()=>createStoreHook,
    "shallowEqual",
    ()=>shallowEqual,
    "useDispatch",
    ()=>useDispatch,
    "useSelector",
    ()=>useSelector,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/hooks/useSelector.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/use-sync-external-store/with-selector.js [app-client] (ecmascript)");
;
// src/utils/react-is.ts
var IS_REACT_19 = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"].startsWith("19");
var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for(IS_REACT_19 ? "react.transitional.element" : "react.element");
var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
var REACT_OFFSCREEN_TYPE = /* @__PURE__ */ Symbol.for("react.offscreen");
var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Memo = REACT_MEMO_TYPE;
function isValidElementType(type) {
    return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_OFFSCREEN_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || type.getModuleId !== void 0) ? true : false;
}
function typeOf(object) {
    if (typeof object === "object" && object !== null) {
        const { $$typeof } = object;
        switch($$typeof){
            case REACT_ELEMENT_TYPE:
                switch(object = object.type, object){
                    case REACT_FRAGMENT_TYPE:
                    case REACT_PROFILER_TYPE:
                    case REACT_STRICT_MODE_TYPE:
                    case REACT_SUSPENSE_TYPE:
                    case REACT_SUSPENSE_LIST_TYPE:
                        return object;
                    default:
                        switch(object = object && object.$$typeof, object){
                            case REACT_CONTEXT_TYPE:
                            case REACT_FORWARD_REF_TYPE:
                            case REACT_LAZY_TYPE:
                            case REACT_MEMO_TYPE:
                                return object;
                            case REACT_CONSUMER_TYPE:
                                return object;
                            default:
                                return $$typeof;
                        }
                }
            case REACT_PORTAL_TYPE:
                return $$typeof;
        }
    }
}
function isContextConsumer(object) {
    return IS_REACT_19 ? typeOf(object) === REACT_CONSUMER_TYPE : typeOf(object) === REACT_CONTEXT_TYPE;
}
function isMemo(object) {
    return typeOf(object) === REACT_MEMO_TYPE;
}
// src/utils/warning.ts
function warning(message) {
    if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(message);
    }
    try {
        throw new Error(message);
    } catch (e) {}
}
// src/connect/verifySubselectors.ts
function verify(selector, methodName) {
    if (!selector) {
        throw new Error("Unexpected value for ".concat(methodName, " in connect."));
    } else if (methodName === "mapStateToProps" || methodName === "mapDispatchToProps") {
        if (!Object.prototype.hasOwnProperty.call(selector, "dependsOnOwnProps")) {
            warning("The selector for ".concat(methodName, " of connect did not specify a value for dependsOnOwnProps."));
        }
    }
}
function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps) {
    verify(mapStateToProps, "mapStateToProps");
    verify(mapDispatchToProps, "mapDispatchToProps");
    verify(mergeProps, "mergeProps");
}
// src/connect/selectorFactory.ts
function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, param) {
    let { areStatesEqual, areOwnPropsEqual, areStatePropsEqual } = param;
    let hasRunAtLeastOnce = false;
    let state;
    let ownProps;
    let stateProps;
    let dispatchProps;
    let mergedProps;
    function handleFirstCall(firstState, firstOwnProps) {
        state = firstState;
        ownProps = firstOwnProps;
        stateProps = mapStateToProps(state, ownProps);
        dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        hasRunAtLeastOnce = true;
        return mergedProps;
    }
    function handleNewPropsAndNewState() {
        stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }
    function handleNewProps() {
        if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }
    function handleNewState() {
        const nextStateProps = mapStateToProps(state, ownProps);
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
        stateProps = nextStateProps;
        if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }
    function handleSubsequentCalls(nextState, nextOwnProps) {
        const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
        const stateChanged = !areStatesEqual(nextState, state, nextOwnProps, ownProps);
        state = nextState;
        ownProps = nextOwnProps;
        if (propsChanged && stateChanged) return handleNewPropsAndNewState();
        if (propsChanged) return handleNewProps();
        if (stateChanged) return handleNewState();
        return mergedProps;
    }
    return function pureFinalPropsSelector(nextState, nextOwnProps) {
        return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    };
}
function finalPropsSelectorFactory(dispatch, param) {
    let { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...options } = param;
    const mapStateToProps = initMapStateToProps(dispatch, options);
    const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
    const mergeProps = initMergeProps(dispatch, options);
    if ("TURBOPACK compile-time truthy", 1) {
        verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps);
    }
    return pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}
// src/utils/bindActionCreators.ts
function bindActionCreators(actionCreators, dispatch) {
    const boundActionCreators = {};
    for(const key in actionCreators){
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === "function") {
            boundActionCreators[key] = function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                return dispatch(actionCreator(...args));
            };
        }
    }
    return boundActionCreators;
}
// src/utils/isPlainObject.ts
function isPlainObject(obj) {
    if (typeof obj !== "object" || obj === null) return false;
    const proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    let baseProto = proto;
    while(Object.getPrototypeOf(baseProto) !== null){
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto;
}
// src/utils/verifyPlainObject.ts
function verifyPlainObject(value, displayName, methodName) {
    if (!isPlainObject(value)) {
        warning("".concat(methodName, "() in ").concat(displayName, " must return a plain object. Instead received ").concat(value, "."));
    }
}
// src/connect/wrapMapToProps.ts
function wrapMapToPropsConstant(getConstant) {
    return function initConstantSelector(dispatch) {
        const constant = getConstant(dispatch);
        function constantSelector() {
            return constant;
        }
        constantSelector.dependsOnOwnProps = false;
        return constantSelector;
    };
}
function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}
function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, param) {
        let { displayName } = param;
        const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
            return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch, void 0);
        };
        proxy.dependsOnOwnProps = true;
        proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
            proxy.mapToProps = mapToProps;
            proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
            let props = proxy(stateOrDispatch, ownProps);
            if (typeof props === "function") {
                proxy.mapToProps = props;
                proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
                props = proxy(stateOrDispatch, ownProps);
            }
            if ("TURBOPACK compile-time truthy", 1) verifyPlainObject(props, displayName, methodName);
            return props;
        };
        return proxy;
    };
}
// src/connect/invalidArgFactory.ts
function createInvalidArgFactory(arg, name) {
    return (dispatch, options)=>{
        throw new Error("Invalid value of type ".concat(typeof arg, " for ").concat(name, " argument when connecting component ").concat(options.wrappedComponentName, "."));
    };
}
// src/connect/mapDispatchToProps.ts
function mapDispatchToPropsFactory(mapDispatchToProps) {
    return mapDispatchToProps && typeof mapDispatchToProps === "object" ? wrapMapToPropsConstant((dispatch)=>// @ts-ignore
        bindActionCreators(mapDispatchToProps, dispatch)) : !mapDispatchToProps ? wrapMapToPropsConstant((dispatch)=>({
            dispatch
        })) : typeof mapDispatchToProps === "function" ? // @ts-ignore
    wrapMapToPropsFunc(mapDispatchToProps, "mapDispatchToProps") : createInvalidArgFactory(mapDispatchToProps, "mapDispatchToProps");
}
// src/connect/mapStateToProps.ts
function mapStateToPropsFactory(mapStateToProps) {
    return !mapStateToProps ? wrapMapToPropsConstant(()=>({})) : typeof mapStateToProps === "function" ? // @ts-ignore
    wrapMapToPropsFunc(mapStateToProps, "mapStateToProps") : createInvalidArgFactory(mapStateToProps, "mapStateToProps");
}
// src/connect/mergeProps.ts
function defaultMergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps
    };
}
function wrapMergePropsFunc(mergeProps) {
    return function initMergePropsProxy(dispatch, param) {
        let { displayName, areMergedPropsEqual } = param;
        let hasRunOnce = false;
        let mergedProps;
        return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
            const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
            if (hasRunOnce) {
                if (!areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
            } else {
                hasRunOnce = true;
                mergedProps = nextMergedProps;
                if ("TURBOPACK compile-time truthy", 1) verifyPlainObject(mergedProps, displayName, "mergeProps");
            }
            return mergedProps;
        };
    };
}
function mergePropsFactory(mergeProps) {
    return !mergeProps ? ()=>defaultMergeProps : typeof mergeProps === "function" ? wrapMergePropsFunc(mergeProps) : createInvalidArgFactory(mergeProps, "mergeProps");
}
// src/utils/batch.ts
function defaultNoopBatch(callback) {
    callback();
}
// src/utils/Subscription.ts
function createListenerCollection() {
    let first = null;
    let last = null;
    return {
        clear () {
            first = null;
            last = null;
        },
        notify () {
            defaultNoopBatch(()=>{
                let listener = first;
                while(listener){
                    listener.callback();
                    listener = listener.next;
                }
            });
        },
        get () {
            const listeners = [];
            let listener = first;
            while(listener){
                listeners.push(listener);
                listener = listener.next;
            }
            return listeners;
        },
        subscribe (callback) {
            let isSubscribed = true;
            const listener = last = {
                callback,
                next: null,
                prev: last
            };
            if (listener.prev) {
                listener.prev.next = listener;
            } else {
                first = listener;
            }
            return function unsubscribe() {
                if (!isSubscribed || first === null) return;
                isSubscribed = false;
                if (listener.next) {
                    listener.next.prev = listener.prev;
                } else {
                    last = listener.prev;
                }
                if (listener.prev) {
                    listener.prev.next = listener.next;
                } else {
                    first = listener.next;
                }
            };
        }
    };
}
var nullListeners = {
    notify () {},
    get: ()=>[]
};
function createSubscription(store, parentSub) {
    let unsubscribe;
    let listeners = nullListeners;
    let subscriptionsAmount = 0;
    let selfSubscribed = false;
    function addNestedSub(listener) {
        trySubscribe();
        const cleanupListener = listeners.subscribe(listener);
        let removed = false;
        return ()=>{
            if (!removed) {
                removed = true;
                cleanupListener();
                tryUnsubscribe();
            }
        };
    }
    function notifyNestedSubs() {
        listeners.notify();
    }
    function handleChangeWrapper() {
        if (subscription.onStateChange) {
            subscription.onStateChange();
        }
    }
    function isSubscribed() {
        return selfSubscribed;
    }
    function trySubscribe() {
        subscriptionsAmount++;
        if (!unsubscribe) {
            unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
            listeners = createListenerCollection();
        }
    }
    function tryUnsubscribe() {
        subscriptionsAmount--;
        if (unsubscribe && subscriptionsAmount === 0) {
            unsubscribe();
            unsubscribe = void 0;
            listeners.clear();
            listeners = nullListeners;
        }
    }
    function trySubscribeSelf() {
        if (!selfSubscribed) {
            selfSubscribed = true;
            trySubscribe();
        }
    }
    function tryUnsubscribeSelf() {
        if (selfSubscribed) {
            selfSubscribed = false;
            tryUnsubscribe();
        }
    }
    const subscription = {
        addNestedSub,
        notifyNestedSubs,
        handleChangeWrapper,
        isSubscribed,
        trySubscribe: trySubscribeSelf,
        tryUnsubscribe: tryUnsubscribeSelf,
        getListeners: ()=>listeners
    };
    return subscription;
}
// src/utils/useIsomorphicLayoutEffect.ts
var canUseDOM = ()=>!!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var isDOM = /* @__PURE__ */ canUseDOM();
var isRunningInReactNative = ()=>typeof navigator !== "undefined" && navigator.product === "ReactNative";
var isReactNative = /* @__PURE__ */ isRunningInReactNative();
var getUseIsomorphicLayoutEffect = ()=>isDOM || isReactNative ? __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"];
var useIsomorphicLayoutEffect = /* @__PURE__ */ getUseIsomorphicLayoutEffect();
// src/utils/shallowEqual.ts
function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}
function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for(let i = 0; i < keysA.length; i++){
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
// src/utils/hoistStatics.ts
var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
};
var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};
var FORWARD_REF_STATICS = {
    $$typeof: true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
};
var MEMO_STATICS = {
    $$typeof: true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
};
var TYPE_STATICS = {
    [ForwardRef]: FORWARD_REF_STATICS,
    [Memo]: MEMO_STATICS
};
function getStatics(component) {
    if (isMemo(component)) {
        return MEMO_STATICS;
    }
    return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
}
var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent) {
    if (typeof sourceComponent !== "string") {
        if (objectPrototype) {
            const inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent);
            }
        }
        let keys = getOwnPropertyNames(sourceComponent);
        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }
        const targetStatics = getStatics(targetComponent);
        const sourceStatics = getStatics(sourceComponent);
        for(let i = 0; i < keys.length; ++i){
            const key = keys[i];
            if (!KNOWN_STATICS[key] && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
                const descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try {
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }
    }
    return targetComponent;
}
// src/components/Context.ts
var ContextKey = /* @__PURE__ */ Symbol.for("react-redux-context");
var gT = typeof globalThis !== "undefined" ? globalThis : /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */ {};
function getContext() {
    var _gT, _ContextKey;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]) return {};
    var _;
    const contextMap = (_ = (_gT = gT)[_ContextKey = ContextKey]) !== null && _ !== void 0 ? _ : _gT[_ContextKey] = /* @__PURE__ */ new Map();
    let realContext = contextMap.get(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]);
    if (!realContext) {
        realContext = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
        if ("TURBOPACK compile-time truthy", 1) {
            realContext.displayName = "ReactRedux";
        }
        contextMap.set(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"], realContext);
    }
    return realContext;
}
var ReactReduxContext = /* @__PURE__ */ getContext();
// src/components/connect.tsx
var NO_SUBSCRIPTION_ARRAY = [
    null,
    null
];
var stringifyComponent = (Comp)=>{
    try {
        return JSON.stringify(Comp);
    } catch (err) {
        return String(Comp);
    }
};
function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
    useIsomorphicLayoutEffect({
        "useIsomorphicLayoutEffectWithArgs.useIsomorphicLayoutEffect": ()=>effectFunc(...effectArgs)
    }["useIsomorphicLayoutEffectWithArgs.useIsomorphicLayoutEffect"], dependencies);
}
function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, childPropsFromStoreUpdate, notifyNestedSubs) {
    lastWrapperProps.current = wrapperProps;
    renderIsScheduled.current = false;
    if (childPropsFromStoreUpdate.current) {
        childPropsFromStoreUpdate.current = null;
        notifyNestedSubs();
    }
}
function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, additionalSubscribeListener) {
    if (!shouldHandleStateChanges) return ()=>{};
    let didUnsubscribe = false;
    let lastThrownError = null;
    const checkForUpdates = ()=>{
        if (didUnsubscribe || !isMounted.current) {
            return;
        }
        const latestStoreState = store.getState();
        let newChildProps, error;
        try {
            newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
        } catch (e) {
            error = e;
            lastThrownError = e;
        }
        if (!error) {
            lastThrownError = null;
        }
        if (newChildProps === lastChildProps.current) {
            if (!renderIsScheduled.current) {
                notifyNestedSubs();
            }
        } else {
            lastChildProps.current = newChildProps;
            childPropsFromStoreUpdate.current = newChildProps;
            renderIsScheduled.current = true;
            additionalSubscribeListener();
        }
    };
    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();
    checkForUpdates();
    const unsubscribeWrapper = ()=>{
        didUnsubscribe = true;
        subscription.tryUnsubscribe();
        subscription.onStateChange = null;
        if (lastThrownError) {
            throw lastThrownError;
        }
    };
    return unsubscribeWrapper;
}
function strictEqual(a, b) {
    return a === b;
}
var hasWarnedAboutDeprecatedPureOption = false;
function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    let { // The `pure` option has been removed, so TS doesn't like us destructuring this to check its existence.
    // @ts-ignore
    pure, areStatesEqual = strictEqual, areOwnPropsEqual = shallowEqual, areStatePropsEqual = shallowEqual, areMergedPropsEqual = shallowEqual, // use React's forwardRef to expose a ref of the wrapped component
    forwardRef = false, // the context consumer to use
    context = ReactReduxContext } = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if ("TURBOPACK compile-time truthy", 1) {
        if (pure !== void 0 && !hasWarnedAboutDeprecatedPureOption) {
            hasWarnedAboutDeprecatedPureOption = true;
            warning('The `pure` option has been removed. `connect` is now always a "pure/memoized" component');
        }
    }
    const Context = context;
    const initMapStateToProps = mapStateToPropsFactory(mapStateToProps);
    const initMapDispatchToProps = mapDispatchToPropsFactory(mapDispatchToProps);
    const initMergeProps = mergePropsFactory(mergeProps);
    const shouldHandleStateChanges = Boolean(mapStateToProps);
    const wrapWithConnect = (WrappedComponent)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const isValid = /* @__PURE__ */ isValidElementType(WrappedComponent);
            if (!isValid) throw new Error("You must pass a component to the function returned by connect. Instead received ".concat(stringifyComponent(WrappedComponent)));
        }
        const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
        const displayName = "Connect(".concat(wrappedComponentName, ")");
        const selectorFactoryOptions = {
            shouldHandleStateChanges,
            displayName,
            wrappedComponentName,
            WrappedComponent,
            // @ts-ignore
            initMapStateToProps,
            initMapDispatchToProps,
            initMergeProps,
            areStatesEqual,
            areStatePropsEqual,
            areOwnPropsEqual,
            areMergedPropsEqual
        };
        function ConnectFunction(props) {
            const [propsContext, reactReduxForwardedRef, wrapperProps] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo": ()=>{
                    const { reactReduxForwardedRef: reactReduxForwardedRef2, ...wrapperProps2 } = props;
                    return [
                        props.context,
                        reactReduxForwardedRef2,
                        wrapperProps2
                    ];
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo"], [
                props
            ]);
            const ContextToUse = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[ContextToUse]": ()=>{
                    let ResultContext = Context;
                    if (propsContext === null || propsContext === void 0 ? void 0 : propsContext.Consumer) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            const isValid = /* @__PURE__ */ isContextConsumer(// @ts-ignore
                            /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](propsContext.Consumer, null));
                            if (!isValid) {
                                throw new Error("You must pass a valid React context consumer as `props.context`");
                            }
                            ResultContext = propsContext;
                        }
                    }
                    return ResultContext;
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[ContextToUse]"], [
                propsContext,
                Context
            ]);
            const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ContextToUse);
            const didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
            const didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);
            if (("TURBOPACK compile-time value", "development") !== "production" && !didStoreComeFromProps && !didStoreComeFromContext) {
                throw new Error('Could not find "store" in the context of "'.concat(displayName, '". Either wrap the root component in a <Provider>, or pass a custom React context provider to <Provider> and the corresponding React context consumer to ').concat(displayName, " in connect options."));
            }
            const store = didStoreComeFromProps ? props.store : contextValue.store;
            const getServerState = didStoreComeFromContext ? contextValue.getServerState : store.getState;
            const childPropsSelector = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[childPropsSelector]": ()=>{
                    return finalPropsSelectorFactory(store.dispatch, selectorFactoryOptions);
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[childPropsSelector]"], [
                store
            ]);
            const [subscription, notifyNestedSubs] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo": ()=>{
                    if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY;
                    const subscription2 = createSubscription(store, didStoreComeFromProps ? void 0 : contextValue.subscription);
                    const notifyNestedSubs2 = subscription2.notifyNestedSubs.bind(subscription2);
                    return [
                        subscription2,
                        notifyNestedSubs2
                    ];
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo"], [
                store,
                didStoreComeFromProps,
                contextValue
            ]);
            const overriddenContextValue = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[overriddenContextValue]": ()=>{
                    if (didStoreComeFromProps) {
                        return contextValue;
                    }
                    return {
                        ...contextValue,
                        subscription
                    };
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[overriddenContextValue]"], [
                didStoreComeFromProps,
                contextValue,
                subscription
            ]);
            const lastChildProps = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](void 0);
            const lastWrapperProps = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](wrapperProps);
            const childPropsFromStoreUpdate = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](void 0);
            const renderIsScheduled = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
            const isMounted = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
            const latestSubscriptionCallbackError = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](void 0);
            useIsomorphicLayoutEffect({
                "connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect": ()=>{
                    isMounted.current = true;
                    return ({
                        "connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect": ()=>{
                            isMounted.current = false;
                        }
                    })["connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect"];
                }
            }["connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect"], []);
            const actualChildPropsSelector = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[actualChildPropsSelector]": ()=>{
                    const selector = {
                        "connect.wrapWithConnect.ConnectFunction.useMemo[actualChildPropsSelector].selector": ()=>{
                            if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
                                return childPropsFromStoreUpdate.current;
                            }
                            return childPropsSelector(store.getState(), wrapperProps);
                        }
                    }["connect.wrapWithConnect.ConnectFunction.useMemo[actualChildPropsSelector].selector"];
                    return selector;
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[actualChildPropsSelector]"], [
                store,
                wrapperProps
            ]);
            const subscribeForReact = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact]": ()=>{
                    const subscribe = {
                        "connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact].subscribe": (reactListener)=>{
                            if (!subscription) {
                                return ({
                                    "connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact].subscribe": ()=>{}
                                })["connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact].subscribe"];
                            }
                            return subscribeUpdates(shouldHandleStateChanges, store, subscription, // @ts-ignore
                            childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, reactListener);
                        }
                    }["connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact].subscribe"];
                    return subscribe;
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[subscribeForReact]"], [
                subscription
            ]);
            useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [
                lastWrapperProps,
                lastChildProps,
                renderIsScheduled,
                wrapperProps,
                childPropsFromStoreUpdate,
                notifyNestedSubs
            ]);
            let actualChildProps;
            try {
                actualChildProps = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"](// TODO We're passing through a big wrapper that does a bunch of extra side effects besides subscribing
                subscribeForReact, // TODO This is incredibly hacky. We've already processed the store update and calculated new child props,
                // TODO and we're just passing that through so it triggers a re-render for us rather than relying on `uSES`.
                actualChildPropsSelector, getServerState ? ({
                    "connect.wrapWithConnect.ConnectFunction.useSyncExternalStore": ()=>childPropsSelector(getServerState(), wrapperProps)
                })["connect.wrapWithConnect.ConnectFunction.useSyncExternalStore"] : actualChildPropsSelector);
            } catch (err) {
                if (latestSubscriptionCallbackError.current) {
                    ;
                    err.message += "\nThe error may be correlated with this previous error:\n".concat(latestSubscriptionCallbackError.current.stack, "\n\n");
                }
                throw err;
            }
            useIsomorphicLayoutEffect({
                "connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect": ()=>{
                    latestSubscriptionCallbackError.current = void 0;
                    childPropsFromStoreUpdate.current = void 0;
                    lastChildProps.current = actualChildProps;
                }
            }["connect.wrapWithConnect.ConnectFunction.useIsomorphicLayoutEffect"]);
            const renderedWrappedComponent = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[renderedWrappedComponent]": ()=>{
                    return(// @ts-ignore
                    /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](WrappedComponent, {
                        ...actualChildProps,
                        ref: reactReduxForwardedRef
                    }));
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[renderedWrappedComponent]"], [
                reactReduxForwardedRef,
                WrappedComponent,
                actualChildProps
            ]);
            const renderedChild = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
                "connect.wrapWithConnect.ConnectFunction.useMemo[renderedChild]": ()=>{
                    if (shouldHandleStateChanges) {
                        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ContextToUse.Provider, {
                            value: overriddenContextValue
                        }, renderedWrappedComponent);
                    }
                    return renderedWrappedComponent;
                }
            }["connect.wrapWithConnect.ConnectFunction.useMemo[renderedChild]"], [
                ContextToUse,
                renderedWrappedComponent,
                overriddenContextValue
            ]);
            return renderedChild;
        }
        const _Connect = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](ConnectFunction);
        const Connect = _Connect;
        Connect.WrappedComponent = WrappedComponent;
        Connect.displayName = ConnectFunction.displayName = displayName;
        if (forwardRef) {
            const _forwarded = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function forwardConnectRef(props, ref) {
                return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Connect, {
                    ...props,
                    reactReduxForwardedRef: ref
                });
            });
            const forwarded = _forwarded;
            forwarded.displayName = displayName;
            forwarded.WrappedComponent = WrappedComponent;
            return /* @__PURE__ */ hoistNonReactStatics(forwarded, WrappedComponent);
        }
        return /* @__PURE__ */ hoistNonReactStatics(Connect, WrappedComponent);
    };
    return wrapWithConnect;
}
var connect_default = connect;
// src/components/Provider.tsx
function Provider(providerProps) {
    const { children, context, serverState, store } = providerProps;
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "Provider.useMemo[contextValue]": ()=>{
            const subscription = createSubscription(store);
            const baseContextValue = {
                store,
                subscription,
                getServerState: serverState ? ({
                    "Provider.useMemo[contextValue]": ()=>serverState
                })["Provider.useMemo[contextValue]"] : void 0
            };
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            else {
                const { identityFunctionCheck = "once", stabilityCheck = "once" } = providerProps;
                return /* @__PURE__ */ Object.assign(baseContextValue, {
                    stabilityCheck,
                    identityFunctionCheck
                });
            }
        }
    }["Provider.useMemo[contextValue]"], [
        store,
        serverState
    ]);
    const previousState = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "Provider.useMemo[previousState]": ()=>store.getState()
    }["Provider.useMemo[previousState]"], [
        store
    ]);
    useIsomorphicLayoutEffect({
        "Provider.useIsomorphicLayoutEffect": ()=>{
            const { subscription } = contextValue;
            subscription.onStateChange = subscription.notifyNestedSubs;
            subscription.trySubscribe();
            if (previousState !== store.getState()) {
                subscription.notifyNestedSubs();
            }
            return ({
                "Provider.useIsomorphicLayoutEffect": ()=>{
                    subscription.tryUnsubscribe();
                    subscription.onStateChange = void 0;
                }
            })["Provider.useIsomorphicLayoutEffect"];
        }
    }["Provider.useIsomorphicLayoutEffect"], [
        contextValue,
        previousState
    ]);
    const Context = context || ReactReduxContext;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Context.Provider, {
        value: contextValue
    }, children);
}
var Provider_default = Provider;
// src/hooks/useReduxContext.ts
function createReduxContextHook() {
    let context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ReactReduxContext;
    return function useReduxContext2() {
        const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](context);
        if (("TURBOPACK compile-time value", "development") !== "production" && !contextValue) {
            throw new Error("could not find react-redux context value; please ensure the component is wrapped in a <Provider>");
        }
        return contextValue;
    };
}
var useReduxContext = /* @__PURE__ */ createReduxContextHook();
// src/hooks/useStore.ts
function createStoreHook() {
    let context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ReactReduxContext;
    const useReduxContext2 = context === ReactReduxContext ? useReduxContext : // @ts-ignore
    createReduxContextHook(context);
    const useStore2 = ()=>{
        const { store } = useReduxContext2();
        return store;
    };
    Object.assign(useStore2, {
        withTypes: ()=>useStore2
    });
    return useStore2;
}
var useStore = /* @__PURE__ */ createStoreHook();
// src/hooks/useDispatch.ts
function createDispatchHook() {
    let context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ReactReduxContext;
    const useStore2 = context === ReactReduxContext ? useStore : createStoreHook(context);
    const useDispatch2 = ()=>{
        const store = useStore2();
        return store.dispatch;
    };
    Object.assign(useDispatch2, {
        withTypes: ()=>useDispatch2
    });
    return useDispatch2;
}
var useDispatch = /* @__PURE__ */ createDispatchHook();
;
var refEquality = (a, b)=>a === b;
function createSelectorHook() {
    let context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ReactReduxContext;
    const useReduxContext2 = context === ReactReduxContext ? useReduxContext : createReduxContextHook(context);
    const useSelector2 = function(selector) {
        let equalityFnOrOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const { equalityFn = refEquality } = typeof equalityFnOrOptions === "function" ? {
            equalityFn: equalityFnOrOptions
        } : equalityFnOrOptions;
        if ("TURBOPACK compile-time truthy", 1) {
            if (!selector) {
                throw new Error("You must pass a selector to useSelector");
            }
            if (typeof selector !== "function") {
                throw new Error("You must pass a function as a selector to useSelector");
            }
            if (typeof equalityFn !== "function") {
                throw new Error("You must pass a function as an equality function to useSelector");
            }
        }
        const reduxContext = useReduxContext2();
        const { store, subscription, getServerState } = reduxContext;
        const firstRun = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](true);
        const wrappedSelector = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            [selector.name] (state) {
                const selected = selector(state);
                if ("TURBOPACK compile-time truthy", 1) {
                    const { devModeChecks = {} } = typeof equalityFnOrOptions === "function" ? {} : equalityFnOrOptions;
                    const { identityFunctionCheck, stabilityCheck } = reduxContext;
                    const { identityFunctionCheck: finalIdentityFunctionCheck, stabilityCheck: finalStabilityCheck } = {
                        stabilityCheck,
                        identityFunctionCheck,
                        ...devModeChecks
                    };
                    if (finalStabilityCheck === "always" || finalStabilityCheck === "once" && firstRun.current) {
                        const toCompare = selector(state);
                        if (!equalityFn(selected, toCompare)) {
                            let stack = void 0;
                            try {
                                throw new Error();
                            } catch (e) {
                                ;
                                ({ stack } = e);
                            }
                            console.warn("Selector " + (selector.name || "unknown") + " returned a different result when called with the same parameters. This can lead to unnecessary rerenders.\nSelectors that return a new reference (such as an object or an array) should be memoized: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization", {
                                state,
                                selected,
                                selected2: toCompare,
                                stack
                            });
                        }
                    }
                    if (finalIdentityFunctionCheck === "always" || finalIdentityFunctionCheck === "once" && firstRun.current) {
                        if (selected === state) {
                            let stack = void 0;
                            try {
                                throw new Error();
                            } catch (e) {
                                ;
                                ({ stack } = e);
                            }
                            console.warn("Selector " + (selector.name || "unknown") + " returned the root state when called. This can lead to unnecessary rerenders.\nSelectors that return the entire state are almost certainly a mistake, as they will cause a rerender whenever *anything* in state changes.", {
                                stack
                            });
                        }
                    }
                    if (firstRun.current) firstRun.current = false;
                }
                return selected;
            }
        }[selector.name], [
            selector
        ]);
        const selectedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStoreWithSelector"])(subscription.addNestedSub, store.getState, getServerState || store.getState, wrappedSelector, equalityFn);
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](selectedState);
        return selectedState;
    };
    Object.assign(useSelector2, {
        withTypes: ()=>useSelector2
    });
    return useSelector2;
}
var useSelector = /* @__PURE__ */ createSelectorHook();
// src/exports.ts
var batch = defaultNoopBatch;
;
 //# sourceMappingURL=react-redux.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/tiny-invariant/dist/esm/tiny-invariant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>invariant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var isProduction = ("TURBOPACK compile-time value", "development") === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    var provided = typeof message === 'function' ? message() : message;
    var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
    throw new Error(value);
}
;
}),
"[project]/tab_videos/download (2)/node_modules/css-box-model/dist/css-box-model.esm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateBox",
    ()=>calculateBox,
    "createBox",
    ()=>createBox,
    "expand",
    ()=>expand,
    "getBox",
    ()=>getBox,
    "getRect",
    ()=>getRect,
    "offset",
    ()=>offset,
    "shrink",
    ()=>shrink,
    "withScroll",
    ()=>withScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$tiny$2d$invariant$2f$dist$2f$esm$2f$tiny$2d$invariant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/tiny-invariant/dist/esm/tiny-invariant.js [app-client] (ecmascript)");
;
var getRect = function getRect(_ref) {
    var top = _ref.top, right = _ref.right, bottom = _ref.bottom, left = _ref.left;
    var width = right - left;
    var height = bottom - top;
    var rect = {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        width: width,
        height: height,
        x: left,
        y: top,
        center: {
            x: (right + left) / 2,
            y: (bottom + top) / 2
        }
    };
    return rect;
};
var expand = function expand(target, expandBy) {
    return {
        top: target.top - expandBy.top,
        left: target.left - expandBy.left,
        bottom: target.bottom + expandBy.bottom,
        right: target.right + expandBy.right
    };
};
var shrink = function shrink(target, shrinkBy) {
    return {
        top: target.top + shrinkBy.top,
        left: target.left + shrinkBy.left,
        bottom: target.bottom - shrinkBy.bottom,
        right: target.right - shrinkBy.right
    };
};
var shift = function shift(target, shiftBy) {
    return {
        top: target.top + shiftBy.y,
        left: target.left + shiftBy.x,
        bottom: target.bottom + shiftBy.y,
        right: target.right + shiftBy.x
    };
};
var noSpacing = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
var createBox = function createBox(_ref2) {
    var borderBox = _ref2.borderBox, _ref2$margin = _ref2.margin, margin = _ref2$margin === void 0 ? noSpacing : _ref2$margin, _ref2$border = _ref2.border, border = _ref2$border === void 0 ? noSpacing : _ref2$border, _ref2$padding = _ref2.padding, padding = _ref2$padding === void 0 ? noSpacing : _ref2$padding;
    var marginBox = getRect(expand(borderBox, margin));
    var paddingBox = getRect(shrink(borderBox, border));
    var contentBox = getRect(shrink(paddingBox, padding));
    return {
        marginBox: marginBox,
        borderBox: getRect(borderBox),
        paddingBox: paddingBox,
        contentBox: contentBox,
        margin: margin,
        border: border,
        padding: padding
    };
};
var parse = function parse(raw) {
    var value = raw.slice(0, -2);
    var suffix = raw.slice(-2);
    if (suffix !== 'px') {
        return 0;
    }
    var result = Number(value);
    !!isNaN(result) ? ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$tiny$2d$invariant$2f$dist$2f$esm$2f$tiny$2d$invariant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(false, "Could not parse value [raw: " + raw + ", without suffix: " + value + "]") : "TURBOPACK unreachable" : void 0;
    return result;
};
var getWindowScroll = function getWindowScroll() {
    return {
        x: window.pageXOffset,
        y: window.pageYOffset
    };
};
var offset = function offset(original, change) {
    var borderBox = original.borderBox, border = original.border, margin = original.margin, padding = original.padding;
    var shifted = shift(borderBox, change);
    return createBox({
        borderBox: shifted,
        border: border,
        margin: margin,
        padding: padding
    });
};
var withScroll = function withScroll(original, scroll) {
    if (scroll === void 0) {
        scroll = getWindowScroll();
    }
    return offset(original, scroll);
};
var calculateBox = function calculateBox(borderBox, styles) {
    var margin = {
        top: parse(styles.marginTop),
        right: parse(styles.marginRight),
        bottom: parse(styles.marginBottom),
        left: parse(styles.marginLeft)
    };
    var padding = {
        top: parse(styles.paddingTop),
        right: parse(styles.paddingRight),
        bottom: parse(styles.paddingBottom),
        left: parse(styles.paddingLeft)
    };
    var border = {
        top: parse(styles.borderTopWidth),
        right: parse(styles.borderRightWidth),
        bottom: parse(styles.borderBottomWidth),
        left: parse(styles.borderLeftWidth)
    };
    return createBox({
        borderBox: borderBox,
        margin: margin,
        padding: padding,
        border: border
    });
};
var getBox = function getBox(el) {
    var borderBox = el.getBoundingClientRect();
    var styles = window.getComputedStyle(el);
    return calculateBox(borderBox, styles);
};
;
}),
"[project]/tab_videos/download (2)/node_modules/raf-schd/dist/raf-schd.esm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var rafSchd = function rafSchd(fn) {
    var lastArgs = [];
    var frameId = null;
    var wrapperFn = function wrapperFn() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        lastArgs = args;
        if (frameId) {
            return;
        }
        frameId = requestAnimationFrame(function() {
            frameId = null;
            fn.apply(void 0, lastArgs);
        });
    };
    wrapperFn.cancel = function() {
        if (!frameId) {
            return;
        }
        cancelAnimationFrame(frameId);
        frameId = null;
    };
    return wrapperFn;
};
const __TURBOPACK__default__export__ = rafSchd;
}),
"[project]/tab_videos/download (2)/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_extends
]);
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
;
}),
"[project]/tab_videos/download (2)/node_modules/@hello-pangea/dnd/dist/dnd.esm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DragDropContext",
    ()=>DragDropContext,
    "Draggable",
    ()=>PublicDraggable,
    "Droppable",
    ()=>ConnectedDroppable,
    "useKeyboardSensor",
    ()=>useKeyboardSensor,
    "useMouseSensor",
    ()=>useMouseSensor,
    "useTouchSensor",
    ()=>useTouchSensor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/redux/dist/redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/css-box-model/dist/css-box-model.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/raf-schd/dist/raf-schd.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
const isProduction$1 = ("TURBOPACK compile-time value", "development") === 'production';
const spacesAndTabs = /[ \t]{2,}/g;
const lineStartWithSpaces = /^[ \t]*/gm;
const clean$2 = (value)=>value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
const getDevMessage = (message)=>clean$2("\n  %c@hello-pangea/dnd\n\n  %c".concat(clean$2(message), "\n\n  %c👷‍ This is a development only message. It will be removed in production builds.\n"));
const getFormattedMessage = (message)=>[
        getDevMessage(message),
        'color: #00C584; font-size: 1.2em; font-weight: bold;',
        'line-height: 1.5',
        'color: #723874;'
    ];
const isDisabledFlag = '__@hello-pangea/dnd-disable-dev-warnings';
function log(type, message) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (typeof window !== 'undefined' && window[isDisabledFlag]) {
        return;
    }
    console[type](...getFormattedMessage(message));
}
const warning = log.bind(null, 'warn');
const error = log.bind(null, 'error');
function noop$2() {}
function getOptions(shared, fromBinding) {
    return {
        ...shared,
        ...fromBinding
    };
}
function bindEvents(el, bindings, sharedOptions) {
    const unbindings = bindings.map((binding)=>{
        const options = getOptions(sharedOptions, binding.options);
        el.addEventListener(binding.eventName, binding.fn, options);
        return function unbind() {
            el.removeEventListener(binding.eventName, binding.fn, options);
        };
    });
    return function unbindAll() {
        unbindings.forEach((unbind)=>{
            unbind();
        });
    };
}
const isProduction = ("TURBOPACK compile-time value", "development") === 'production';
const prefix$1 = 'Invariant failed';
class RbdInvariant extends Error {
}
RbdInvariant.prototype.toString = function toString() {
    return this.message;
};
function invariant(condition, message) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        throw new RbdInvariant("".concat(prefix$1, ": ").concat(message || ''));
    }
}
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    componentDidMount() {
        this.unbind = bindEvents(window, [
            {
                eventName: 'error',
                fn: this.onWindowError
            }
        ]);
    }
    componentDidCatch(err) {
        if (err instanceof RbdInvariant) {
            if ("TURBOPACK compile-time truthy", 1) {
                error(err.message);
            }
            this.setState({});
            return;
        }
        throw err;
    }
    componentWillUnmount() {
        this.unbind();
    }
    render() {
        return this.props.children(this.setCallbacks);
    }
    constructor(...args){
        super(...args);
        this.callbacks = null;
        this.unbind = noop$2;
        this.onWindowError = (event)=>{
            const callbacks = this.getCallbacks();
            if (callbacks.isDragging()) {
                callbacks.tryAbort();
                ("TURBOPACK compile-time truthy", 1) ? warning("\n        An error was caught by our window 'error' event listener while a drag was occurring.\n        The active drag has been aborted.\n      ") : "TURBOPACK unreachable";
            }
            const err = event.error;
            if (err instanceof RbdInvariant) {
                event.preventDefault();
                if ("TURBOPACK compile-time truthy", 1) {
                    error(err.message);
                }
            }
        };
        this.getCallbacks = ()=>{
            if (!this.callbacks) {
                throw new Error('Unable to find AppCallbacks in <ErrorBoundary/>');
            }
            return this.callbacks;
        };
        this.setCallbacks = (callbacks)=>{
            this.callbacks = callbacks;
        };
    }
}
const dragHandleUsageInstructions = "\n  Press space bar to start a drag.\n  When dragging you can use the arrow keys to move the item around and escape to cancel.\n  Some screen readers may require you to be in focus mode or to use your pass through key\n";
const position = (index)=>index + 1;
const onDragStart = (start)=>"\n  You have lifted an item in position ".concat(position(start.source.index), "\n");
const withLocation = (source, destination)=>{
    const isInHomeList = source.droppableId === destination.droppableId;
    const startPosition = position(source.index);
    const endPosition = position(destination.index);
    if (isInHomeList) {
        return "\n      You have moved the item from position ".concat(startPosition, "\n      to position ").concat(endPosition, "\n    ");
    }
    return "\n    You have moved the item from position ".concat(startPosition, "\n    in list ").concat(source.droppableId, "\n    to list ").concat(destination.droppableId, "\n    in position ").concat(endPosition, "\n  ");
};
const withCombine = (id, source, combine)=>{
    const inHomeList = source.droppableId === combine.droppableId;
    if (inHomeList) {
        return "\n      The item ".concat(id, "\n      has been combined with ").concat(combine.draggableId);
    }
    return "\n      The item ".concat(id, "\n      in list ").concat(source.droppableId, "\n      has been combined with ").concat(combine.draggableId, "\n      in list ").concat(combine.droppableId, "\n    ");
};
const onDragUpdate = (update)=>{
    const location = update.destination;
    if (location) {
        return withLocation(update.source, location);
    }
    const combine = update.combine;
    if (combine) {
        return withCombine(update.draggableId, update.source, combine);
    }
    return 'You are over an area that cannot be dropped on';
};
const returnedToStart = (source)=>"\n  The item has returned to its starting position\n  of ".concat(position(source.index), "\n");
const onDragEnd = (result)=>{
    if (result.reason === 'CANCEL') {
        return "\n      Movement cancelled.\n      ".concat(returnedToStart(result.source), "\n    ");
    }
    const location = result.destination;
    const combine = result.combine;
    if (location) {
        return "\n      You have dropped the item.\n      ".concat(withLocation(result.source, location), "\n    ");
    }
    if (combine) {
        return "\n      You have dropped the item.\n      ".concat(withCombine(result.draggableId, result.source, combine), "\n    ");
    }
    return "\n    The item has been dropped while not over a drop area.\n    ".concat(returnedToStart(result.source), "\n  ");
};
const preset = {
    dragHandleUsageInstructions,
    onDragStart,
    onDragUpdate,
    onDragEnd
};
function isEqual$2(first, second) {
    if (first === second) {
        return true;
    }
    if (Number.isNaN(first) && Number.isNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for(let i = 0; i < newInputs.length; i++){
        if (!isEqual$2(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}
function useMemo(getResult, inputs) {
    const initial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useMemo.useState": ()=>({
                inputs,
                result: getResult()
            })
    }["useMemo.useState"])[0];
    const isFirstRun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const committed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(initial);
    const useCache = isFirstRun.current || Boolean(inputs && committed.current.inputs && areInputsEqual(inputs, committed.current.inputs));
    const cache = useCache ? committed.current : {
        inputs,
        result: getResult()
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMemo.useEffect": ()=>{
            isFirstRun.current = false;
            committed.current = cache;
        }
    }["useMemo.useEffect"], [
        cache
    ]);
    return cache.result;
}
function useCallback(callback, inputs) {
    return useMemo({
        "useCallback.useMemo": ()=>callback
    }["useCallback.useMemo"], inputs);
}
const origin = {
    x: 0,
    y: 0
};
const add = (point1, point2)=>({
        x: point1.x + point2.x,
        y: point1.y + point2.y
    });
const subtract = (point1, point2)=>({
        x: point1.x - point2.x,
        y: point1.y - point2.y
    });
const isEqual$1 = (point1, point2)=>point1.x === point2.x && point1.y === point2.y;
const negate = (point)=>({
        x: point.x !== 0 ? -point.x : 0,
        y: point.y !== 0 ? -point.y : 0
    });
const patch = function(line, value) {
    let otherValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    if (line === 'x') {
        return {
            x: value,
            y: otherValue
        };
    }
    return {
        x: otherValue,
        y: value
    };
};
const distance = (point1, point2)=>Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
const closest$1 = (target, points)=>Math.min(...points.map((point)=>distance(target, point)));
const apply = (fn)=>(point)=>({
            x: fn(point.x),
            y: fn(point.y)
        });
var executeClip = (frame, subject)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])({
        top: Math.max(subject.top, frame.top),
        right: Math.min(subject.right, frame.right),
        bottom: Math.min(subject.bottom, frame.bottom),
        left: Math.max(subject.left, frame.left)
    });
    if (result.width <= 0 || result.height <= 0) {
        return null;
    }
    return result;
};
const offsetByPosition = (spacing, point)=>({
        top: spacing.top + point.y,
        left: spacing.left + point.x,
        bottom: spacing.bottom + point.y,
        right: spacing.right + point.x
    });
const getCorners = (spacing)=>[
        {
            x: spacing.left,
            y: spacing.top
        },
        {
            x: spacing.right,
            y: spacing.top
        },
        {
            x: spacing.left,
            y: spacing.bottom
        },
        {
            x: spacing.right,
            y: spacing.bottom
        }
    ];
const noSpacing = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
const scroll$1 = (target, frame)=>{
    if (!frame) {
        return target;
    }
    return offsetByPosition(target, frame.scroll.diff.displacement);
};
const increase = (target, axis, withPlaceholder)=>{
    if (withPlaceholder && withPlaceholder.increasedBy) {
        return {
            ...target,
            [axis.end]: target[axis.end] + withPlaceholder.increasedBy[axis.line]
        };
    }
    return target;
};
const clip = (target, frame)=>{
    if (frame && frame.shouldClipSubject) {
        return executeClip(frame.pageMarginBox, target);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])(target);
};
var getSubject = (param)=>{
    let { page, withPlaceholder, axis, frame } = param;
    const scrolled = scroll$1(page.marginBox, frame);
    const increased = increase(scrolled, axis, withPlaceholder);
    const clipped = clip(increased, frame);
    return {
        page,
        withPlaceholder,
        active: clipped
    };
};
var scrollDroppable = (droppable, newScroll)=>{
    !droppable.frame ? ("TURBOPACK compile-time truthy", 1) ? invariant() : "TURBOPACK unreachable" : void 0;
    const scrollable = droppable.frame;
    const scrollDiff = subtract(newScroll, scrollable.scroll.initial);
    const scrollDisplacement = negate(scrollDiff);
    const frame = {
        ...scrollable,
        scroll: {
            initial: scrollable.scroll.initial,
            current: newScroll,
            diff: {
                value: scrollDiff,
                displacement: scrollDisplacement
            },
            max: scrollable.scroll.max
        }
    };
    const subject = getSubject({
        page: droppable.subject.page,
        withPlaceholder: droppable.subject.withPlaceholder,
        axis: droppable.axis,
        frame
    });
    const result = {
        ...droppable,
        frame,
        subject
    };
    return result;
};
function memoizeOne(resultFn) {
    let isEqual = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : areInputsEqual;
    let cache = null;
    function memoized() {
        for(var _len = arguments.length, newArgs = new Array(_len), _key = 0; _key < _len; _key++){
            newArgs[_key] = arguments[_key];
        }
        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
            return cache.lastResult;
        }
        const lastResult = resultFn.apply(this, newArgs);
        cache = {
            lastResult,
            lastArgs: newArgs,
            lastThis: this
        };
        return lastResult;
    }
    memoized.clear = function clear() {
        cache = null;
    };
    return memoized;
}
const toDroppableMap = memoizeOne((droppables)=>droppables.reduce((previous, current)=>{
        previous[current.descriptor.id] = current;
        return previous;
    }, {}));
const toDraggableMap = memoizeOne((draggables)=>draggables.reduce((previous, current)=>{
        previous[current.descriptor.id] = current;
        return previous;
    }, {}));
const toDroppableList = memoizeOne((droppables)=>Object.values(droppables));
const toDraggableList = memoizeOne((draggables)=>Object.values(draggables));
var getDraggablesInsideDroppable = memoizeOne((droppableId, draggables)=>{
    const result = toDraggableList(draggables).filter((draggable)=>droppableId === draggable.descriptor.droppableId).sort((a, b)=>a.descriptor.index - b.descriptor.index);
    return result;
});
function tryGetDestination(impact) {
    if (impact.at && impact.at.type === 'REORDER') {
        return impact.at.destination;
    }
    return null;
}
function tryGetCombine(impact) {
    if (impact.at && impact.at.type === 'COMBINE') {
        return impact.at.combine;
    }
    return null;
}
var removeDraggableFromList = memoizeOne((remove, list)=>list.filter((item)=>item.descriptor.id !== remove.descriptor.id));
var moveToNextCombine = (param)=>{
    let { isMovingForward, draggable, destination, insideDestination, previousImpact } = param;
    if (!destination.isCombineEnabled) {
        return null;
    }
    const location = tryGetDestination(previousImpact);
    if (!location) {
        return null;
    }
    function getImpact(target) {
        const at = {
            type: 'COMBINE',
            combine: {
                draggableId: target,
                droppableId: destination.descriptor.id
            }
        };
        return {
            ...previousImpact,
            at
        };
    }
    const all = previousImpact.displaced.all;
    const closestId = all.length ? all[0] : null;
    if (isMovingForward) {
        return closestId ? getImpact(closestId) : null;
    }
    const withoutDraggable = removeDraggableFromList(draggable, insideDestination);
    if (!closestId) {
        if (!withoutDraggable.length) {
            return null;
        }
        const last = withoutDraggable[withoutDraggable.length - 1];
        return getImpact(last.descriptor.id);
    }
    const indexOfClosest = withoutDraggable.findIndex((d)=>d.descriptor.id === closestId);
    !(indexOfClosest !== -1) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find displaced item in set') : "TURBOPACK unreachable" : void 0;
    const proposedIndex = indexOfClosest - 1;
    if (proposedIndex < 0) {
        return null;
    }
    const before = withoutDraggable[proposedIndex];
    return getImpact(before.descriptor.id);
};
var isHomeOf = (draggable, destination)=>draggable.descriptor.droppableId === destination.descriptor.id;
const noDisplacedBy = {
    point: origin,
    value: 0
};
const emptyGroups = {
    invisible: {},
    visible: {},
    all: []
};
const noImpact = {
    displaced: emptyGroups,
    displacedBy: noDisplacedBy,
    at: null
};
var isWithin = (lowerBound, upperBound)=>(value)=>lowerBound <= value && value <= upperBound;
var isPartiallyVisibleThroughFrame = (frame)=>{
    const isWithinVertical = isWithin(frame.top, frame.bottom);
    const isWithinHorizontal = isWithin(frame.left, frame.right);
    return (subject)=>{
        const isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
        if (isContained) {
            return true;
        }
        const isPartiallyVisibleVertically = isWithinVertical(subject.top) || isWithinVertical(subject.bottom);
        const isPartiallyVisibleHorizontally = isWithinHorizontal(subject.left) || isWithinHorizontal(subject.right);
        const isPartiallyContained = isPartiallyVisibleVertically && isPartiallyVisibleHorizontally;
        if (isPartiallyContained) {
            return true;
        }
        const isBiggerVertically = subject.top < frame.top && subject.bottom > frame.bottom;
        const isBiggerHorizontally = subject.left < frame.left && subject.right > frame.right;
        const isTargetBiggerThanFrame = isBiggerVertically && isBiggerHorizontally;
        if (isTargetBiggerThanFrame) {
            return true;
        }
        const isTargetBiggerOnOneAxis = isBiggerVertically && isPartiallyVisibleHorizontally || isBiggerHorizontally && isPartiallyVisibleVertically;
        return isTargetBiggerOnOneAxis;
    };
};
var isTotallyVisibleThroughFrame = (frame)=>{
    const isWithinVertical = isWithin(frame.top, frame.bottom);
    const isWithinHorizontal = isWithin(frame.left, frame.right);
    return (subject)=>{
        const isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
        return isContained;
    };
};
const vertical = {
    direction: 'vertical',
    line: 'y',
    crossAxisLine: 'x',
    start: 'top',
    end: 'bottom',
    size: 'height',
    crossAxisStart: 'left',
    crossAxisEnd: 'right',
    crossAxisSize: 'width'
};
const horizontal = {
    direction: 'horizontal',
    line: 'x',
    crossAxisLine: 'y',
    start: 'left',
    end: 'right',
    size: 'width',
    crossAxisStart: 'top',
    crossAxisEnd: 'bottom',
    crossAxisSize: 'height'
};
var isTotallyVisibleThroughFrameOnAxis = (axis)=>(frame)=>{
        const isWithinVertical = isWithin(frame.top, frame.bottom);
        const isWithinHorizontal = isWithin(frame.left, frame.right);
        return (subject)=>{
            if (axis === vertical) {
                return isWithinVertical(subject.top) && isWithinVertical(subject.bottom);
            }
            return isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
        };
    };
const getDroppableDisplaced = (target, destination)=>{
    const displacement = destination.frame ? destination.frame.scroll.diff.displacement : origin;
    return offsetByPosition(target, displacement);
};
const isVisibleInDroppable = (target, destination, isVisibleThroughFrameFn)=>{
    if (!destination.subject.active) {
        return false;
    }
    return isVisibleThroughFrameFn(destination.subject.active)(target);
};
const isVisibleInViewport = (target, viewport, isVisibleThroughFrameFn)=>isVisibleThroughFrameFn(viewport)(target);
const isVisible$1 = (param)=>{
    let { target: toBeDisplaced, destination, viewport, withDroppableDisplacement, isVisibleThroughFrameFn } = param;
    const displacedTarget = withDroppableDisplacement ? getDroppableDisplaced(toBeDisplaced, destination) : toBeDisplaced;
    return isVisibleInDroppable(displacedTarget, destination, isVisibleThroughFrameFn) && isVisibleInViewport(displacedTarget, viewport, isVisibleThroughFrameFn);
};
const isPartiallyVisible = (args)=>isVisible$1({
        ...args,
        isVisibleThroughFrameFn: isPartiallyVisibleThroughFrame
    });
const isTotallyVisible = (args)=>isVisible$1({
        ...args,
        isVisibleThroughFrameFn: isTotallyVisibleThroughFrame
    });
const isTotallyVisibleOnAxis = (args)=>isVisible$1({
        ...args,
        isVisibleThroughFrameFn: isTotallyVisibleThroughFrameOnAxis(args.destination.axis)
    });
const getShouldAnimate = (id, last, forceShouldAnimate)=>{
    if (typeof forceShouldAnimate === 'boolean') {
        return forceShouldAnimate;
    }
    if (!last) {
        return true;
    }
    const { invisible, visible } = last;
    if (invisible[id]) {
        return false;
    }
    const previous = visible[id];
    return previous ? previous.shouldAnimate : true;
};
function getTarget(draggable, displacedBy) {
    const marginBox = draggable.page.marginBox;
    const expandBy = {
        top: displacedBy.point.y,
        right: 0,
        bottom: 0,
        left: displacedBy.point.x
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expand"])(marginBox, expandBy));
}
function getDisplacementGroups(param) {
    let { afterDragging, destination, displacedBy, viewport, forceShouldAnimate, last } = param;
    return afterDragging.reduce(function process(groups, draggable) {
        const target = getTarget(draggable, displacedBy);
        const id = draggable.descriptor.id;
        groups.all.push(id);
        const isVisible = isPartiallyVisible({
            target,
            destination,
            viewport,
            withDroppableDisplacement: true
        });
        if (!isVisible) {
            groups.invisible[draggable.descriptor.id] = true;
            return groups;
        }
        const shouldAnimate = getShouldAnimate(id, last, forceShouldAnimate);
        const displacement = {
            draggableId: id,
            shouldAnimate
        };
        groups.visible[id] = displacement;
        return groups;
    }, {
        all: [],
        visible: {},
        invisible: {}
    });
}
function getIndexOfLastItem(draggables, options) {
    if (!draggables.length) {
        return 0;
    }
    const indexOfLastItem = draggables[draggables.length - 1].descriptor.index;
    return options.inHomeList ? indexOfLastItem : indexOfLastItem + 1;
}
function goAtEnd(param) {
    let { insideDestination, inHomeList, displacedBy, destination } = param;
    const newIndex = getIndexOfLastItem(insideDestination, {
        inHomeList
    });
    return {
        displaced: emptyGroups,
        displacedBy,
        at: {
            type: 'REORDER',
            destination: {
                droppableId: destination.descriptor.id,
                index: newIndex
            }
        }
    };
}
function calculateReorderImpact(param) {
    let { draggable, insideDestination, destination, viewport, displacedBy, last, index, forceShouldAnimate } = param;
    const inHomeList = isHomeOf(draggable, destination);
    if (index == null) {
        return goAtEnd({
            insideDestination,
            inHomeList,
            displacedBy,
            destination
        });
    }
    const match = insideDestination.find((item)=>item.descriptor.index === index);
    if (!match) {
        return goAtEnd({
            insideDestination,
            inHomeList,
            displacedBy,
            destination
        });
    }
    const withoutDragging = removeDraggableFromList(draggable, insideDestination);
    const sliceFrom = insideDestination.indexOf(match);
    const impacted = withoutDragging.slice(sliceFrom);
    const displaced = getDisplacementGroups({
        afterDragging: impacted,
        destination,
        displacedBy,
        last,
        viewport: viewport.frame,
        forceShouldAnimate
    });
    return {
        displaced,
        displacedBy,
        at: {
            type: 'REORDER',
            destination: {
                droppableId: destination.descriptor.id,
                index
            }
        }
    };
}
function didStartAfterCritical(draggableId, afterCritical) {
    return Boolean(afterCritical.effected[draggableId]);
}
var fromCombine = (param)=>{
    let { isMovingForward, destination, draggables, combine, afterCritical } = param;
    if (!destination.isCombineEnabled) {
        return null;
    }
    const combineId = combine.draggableId;
    const combineWith = draggables[combineId];
    const combineWithIndex = combineWith.descriptor.index;
    const didCombineWithStartAfterCritical = didStartAfterCritical(combineId, afterCritical);
    if (didCombineWithStartAfterCritical) {
        if (isMovingForward) {
            return combineWithIndex;
        }
        return combineWithIndex - 1;
    }
    if (isMovingForward) {
        return combineWithIndex + 1;
    }
    return combineWithIndex;
};
var fromReorder = (param)=>{
    let { isMovingForward, isInHomeList, insideDestination, location } = param;
    if (!insideDestination.length) {
        return null;
    }
    const currentIndex = location.index;
    const proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
    const firstIndex = insideDestination[0].descriptor.index;
    const lastIndex = insideDestination[insideDestination.length - 1].descriptor.index;
    const upperBound = isInHomeList ? lastIndex : lastIndex + 1;
    if (proposedIndex < firstIndex) {
        return null;
    }
    if (proposedIndex > upperBound) {
        return null;
    }
    return proposedIndex;
};
var moveToNextIndex = (param)=>{
    let { isMovingForward, isInHomeList, draggable, draggables, destination, insideDestination, previousImpact, viewport, afterCritical } = param;
    const wasAt = previousImpact.at;
    !wasAt ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot move in direction without previous impact location') : "TURBOPACK unreachable" : void 0;
    if (wasAt.type === 'REORDER') {
        const newIndex = fromReorder({
            isMovingForward,
            isInHomeList,
            location: wasAt.destination,
            insideDestination
        });
        if (newIndex == null) {
            return null;
        }
        return calculateReorderImpact({
            draggable,
            insideDestination,
            destination,
            viewport,
            last: previousImpact.displaced,
            displacedBy: previousImpact.displacedBy,
            index: newIndex
        });
    }
    const newIndex = fromCombine({
        isMovingForward,
        destination,
        displaced: previousImpact.displaced,
        draggables,
        combine: wasAt.combine,
        afterCritical
    });
    if (newIndex == null) {
        return null;
    }
    return calculateReorderImpact({
        draggable,
        insideDestination,
        destination,
        viewport,
        last: previousImpact.displaced,
        displacedBy: previousImpact.displacedBy,
        index: newIndex
    });
};
var getCombinedItemDisplacement = (param)=>{
    let { displaced, afterCritical, combineWith, displacedBy } = param;
    const isDisplaced = Boolean(displaced.visible[combineWith] || displaced.invisible[combineWith]);
    if (didStartAfterCritical(combineWith, afterCritical)) {
        return isDisplaced ? origin : negate(displacedBy.point);
    }
    return isDisplaced ? displacedBy.point : origin;
};
var whenCombining = (param)=>{
    let { afterCritical, impact, draggables } = param;
    const combine = tryGetCombine(impact);
    !combine ? ("TURBOPACK compile-time truthy", 1) ? invariant() : "TURBOPACK unreachable" : void 0;
    const combineWith = combine.draggableId;
    const center = draggables[combineWith].page.borderBox.center;
    const displaceBy = getCombinedItemDisplacement({
        displaced: impact.displaced,
        afterCritical,
        combineWith,
        displacedBy: impact.displacedBy
    });
    return add(center, displaceBy);
};
const distanceFromStartToBorderBoxCenter = (axis, box)=>box.margin[axis.start] + box.borderBox[axis.size] / 2;
const distanceFromEndToBorderBoxCenter = (axis, box)=>box.margin[axis.end] + box.borderBox[axis.size] / 2;
const getCrossAxisBorderBoxCenter = (axis, target, isMoving)=>target[axis.crossAxisStart] + isMoving.margin[axis.crossAxisStart] + isMoving.borderBox[axis.crossAxisSize] / 2;
const goAfter = (param)=>{
    let { axis, moveRelativeTo, isMoving } = param;
    return patch(axis.line, moveRelativeTo.marginBox[axis.end] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
};
const goBefore = (param)=>{
    let { axis, moveRelativeTo, isMoving } = param;
    return patch(axis.line, moveRelativeTo.marginBox[axis.start] - distanceFromEndToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
};
const goIntoStart = (param)=>{
    let { axis, moveInto, isMoving } = param;
    return patch(axis.line, moveInto.contentBox[axis.start] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveInto.contentBox, isMoving));
};
var whenReordering = (param)=>{
    let { impact, draggable, draggables, droppable, afterCritical } = param;
    const insideDestination = getDraggablesInsideDroppable(droppable.descriptor.id, draggables);
    const draggablePage = draggable.page;
    const axis = droppable.axis;
    if (!insideDestination.length) {
        return goIntoStart({
            axis,
            moveInto: droppable.page,
            isMoving: draggablePage
        });
    }
    const { displaced, displacedBy } = impact;
    const closestAfter = displaced.all[0];
    if (closestAfter) {
        const closest = draggables[closestAfter];
        if (didStartAfterCritical(closestAfter, afterCritical)) {
            return goBefore({
                axis,
                moveRelativeTo: closest.page,
                isMoving: draggablePage
            });
        }
        const withDisplacement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["offset"])(closest.page, displacedBy.point);
        return goBefore({
            axis,
            moveRelativeTo: withDisplacement,
            isMoving: draggablePage
        });
    }
    const last = insideDestination[insideDestination.length - 1];
    if (last.descriptor.id === draggable.descriptor.id) {
        return draggablePage.borderBox.center;
    }
    if (didStartAfterCritical(last.descriptor.id, afterCritical)) {
        const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["offset"])(last.page, negate(afterCritical.displacedBy.point));
        return goAfter({
            axis,
            moveRelativeTo: page,
            isMoving: draggablePage
        });
    }
    return goAfter({
        axis,
        moveRelativeTo: last.page,
        isMoving: draggablePage
    });
};
var withDroppableDisplacement = (droppable, point)=>{
    const frame = droppable.frame;
    if (!frame) {
        return point;
    }
    return add(point, frame.scroll.diff.displacement);
};
const getResultWithoutDroppableDisplacement = (param)=>{
    let { impact, draggable, droppable, draggables, afterCritical } = param;
    const original = draggable.page.borderBox.center;
    const at = impact.at;
    if (!droppable) {
        return original;
    }
    if (!at) {
        return original;
    }
    if (at.type === 'REORDER') {
        return whenReordering({
            impact,
            draggable,
            draggables,
            droppable,
            afterCritical
        });
    }
    return whenCombining({
        impact,
        draggables,
        afterCritical
    });
};
var getPageBorderBoxCenterFromImpact = (args)=>{
    const withoutDisplacement = getResultWithoutDroppableDisplacement(args);
    const droppable = args.droppable;
    const withDisplacement = droppable ? withDroppableDisplacement(droppable, withoutDisplacement) : withoutDisplacement;
    return withDisplacement;
};
var scrollViewport = (viewport, newScroll)=>{
    const diff = subtract(newScroll, viewport.scroll.initial);
    const displacement = negate(diff);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])({
        top: newScroll.y,
        bottom: newScroll.y + viewport.frame.height,
        left: newScroll.x,
        right: newScroll.x + viewport.frame.width
    });
    const updated = {
        frame,
        scroll: {
            initial: viewport.scroll.initial,
            max: viewport.scroll.max,
            current: newScroll,
            diff: {
                value: diff,
                displacement
            }
        }
    };
    return updated;
};
function getDraggables$1(ids, draggables) {
    return ids.map((id)=>draggables[id]);
}
function tryGetVisible(id, groups) {
    for(let i = 0; i < groups.length; i++){
        const displacement = groups[i].visible[id];
        if (displacement) {
            return displacement;
        }
    }
    return null;
}
var speculativelyIncrease = (param)=>{
    let { impact, viewport, destination, draggables, maxScrollChange } = param;
    const scrolledViewport = scrollViewport(viewport, add(viewport.scroll.current, maxScrollChange));
    const scrolledDroppable = destination.frame ? scrollDroppable(destination, add(destination.frame.scroll.current, maxScrollChange)) : destination;
    const last = impact.displaced;
    const withViewportScroll = getDisplacementGroups({
        afterDragging: getDraggables$1(last.all, draggables),
        destination,
        displacedBy: impact.displacedBy,
        viewport: scrolledViewport.frame,
        last,
        forceShouldAnimate: false
    });
    const withDroppableScroll = getDisplacementGroups({
        afterDragging: getDraggables$1(last.all, draggables),
        destination: scrolledDroppable,
        displacedBy: impact.displacedBy,
        viewport: viewport.frame,
        last,
        forceShouldAnimate: false
    });
    const invisible = {};
    const visible = {};
    const groups = [
        last,
        withViewportScroll,
        withDroppableScroll
    ];
    last.all.forEach((id)=>{
        const displacement = tryGetVisible(id, groups);
        if (displacement) {
            visible[id] = displacement;
            return;
        }
        invisible[id] = true;
    });
    const newImpact = {
        ...impact,
        displaced: {
            all: last.all,
            invisible,
            visible
        }
    };
    return newImpact;
};
var withViewportDisplacement = (viewport, point)=>add(viewport.scroll.diff.displacement, point);
var getClientFromPageBorderBoxCenter = (param)=>{
    let { pageBorderBoxCenter, draggable, viewport } = param;
    const withoutPageScrollChange = withViewportDisplacement(viewport, pageBorderBoxCenter);
    const offset = subtract(withoutPageScrollChange, draggable.page.borderBox.center);
    return add(draggable.client.borderBox.center, offset);
};
var isTotallyVisibleInNewLocation = (param)=>{
    let { draggable, destination, newPageBorderBoxCenter, viewport, withDroppableDisplacement, onlyOnMainAxis = false } = param;
    const changeNeeded = subtract(newPageBorderBoxCenter, draggable.page.borderBox.center);
    const shifted = offsetByPosition(draggable.page.borderBox, changeNeeded);
    const args = {
        target: shifted,
        destination,
        withDroppableDisplacement,
        viewport
    };
    return onlyOnMainAxis ? isTotallyVisibleOnAxis(args) : isTotallyVisible(args);
};
var moveToNextPlace = (param)=>{
    let { isMovingForward, draggable, destination, draggables, previousImpact, viewport, previousPageBorderBoxCenter, previousClientSelection, afterCritical } = param;
    if (!destination.isEnabled) {
        return null;
    }
    const insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    const isInHomeList = isHomeOf(draggable, destination);
    const impact = moveToNextCombine({
        isMovingForward,
        draggable,
        destination,
        insideDestination,
        previousImpact
    }) || moveToNextIndex({
        isMovingForward,
        isInHomeList,
        draggable,
        draggables,
        destination,
        insideDestination,
        previousImpact,
        viewport,
        afterCritical
    });
    if (!impact) {
        return null;
    }
    const pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
        impact,
        draggable,
        droppable: destination,
        draggables,
        afterCritical
    });
    const isVisibleInNewLocation = isTotallyVisibleInNewLocation({
        draggable,
        destination,
        newPageBorderBoxCenter: pageBorderBoxCenter,
        viewport: viewport.frame,
        withDroppableDisplacement: false,
        onlyOnMainAxis: true
    });
    if (isVisibleInNewLocation) {
        const clientSelection = getClientFromPageBorderBoxCenter({
            pageBorderBoxCenter,
            draggable,
            viewport
        });
        return {
            clientSelection,
            impact,
            scrollJumpRequest: null
        };
    }
    const distance = subtract(pageBorderBoxCenter, previousPageBorderBoxCenter);
    const cautious = speculativelyIncrease({
        impact,
        viewport,
        destination,
        draggables,
        maxScrollChange: distance
    });
    return {
        clientSelection: previousClientSelection,
        impact: cautious,
        scrollJumpRequest: distance
    };
};
const getKnownActive = (droppable)=>{
    const rect = droppable.subject.active;
    !rect ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot get clipped area from droppable') : "TURBOPACK unreachable" : void 0;
    return rect;
};
var getBestCrossAxisDroppable = (param)=>{
    let { isMovingForward, pageBorderBoxCenter, source, droppables, viewport } = param;
    const active = source.subject.active;
    if (!active) {
        return null;
    }
    const axis = source.axis;
    const isBetweenSourceClipped = isWithin(active[axis.start], active[axis.end]);
    const candidates = toDroppableList(droppables).filter((droppable)=>droppable !== source).filter((droppable)=>droppable.isEnabled).filter((droppable)=>Boolean(droppable.subject.active)).filter((droppable)=>isPartiallyVisibleThroughFrame(viewport.frame)(getKnownActive(droppable))).filter((droppable)=>{
        const activeOfTarget = getKnownActive(droppable);
        if (isMovingForward) {
            return active[axis.crossAxisEnd] < activeOfTarget[axis.crossAxisEnd];
        }
        return activeOfTarget[axis.crossAxisStart] < active[axis.crossAxisStart];
    }).filter((droppable)=>{
        const activeOfTarget = getKnownActive(droppable);
        const isBetweenDestinationClipped = isWithin(activeOfTarget[axis.start], activeOfTarget[axis.end]);
        return isBetweenSourceClipped(activeOfTarget[axis.start]) || isBetweenSourceClipped(activeOfTarget[axis.end]) || isBetweenDestinationClipped(active[axis.start]) || isBetweenDestinationClipped(active[axis.end]);
    }).sort((a, b)=>{
        const first = getKnownActive(a)[axis.crossAxisStart];
        const second = getKnownActive(b)[axis.crossAxisStart];
        if (isMovingForward) {
            return first - second;
        }
        return second - first;
    }).filter((droppable, index, array)=>getKnownActive(droppable)[axis.crossAxisStart] === getKnownActive(array[0])[axis.crossAxisStart]);
    if (!candidates.length) {
        return null;
    }
    if (candidates.length === 1) {
        return candidates[0];
    }
    const contains = candidates.filter((droppable)=>{
        const isWithinDroppable = isWithin(getKnownActive(droppable)[axis.start], getKnownActive(droppable)[axis.end]);
        return isWithinDroppable(pageBorderBoxCenter[axis.line]);
    });
    if (contains.length === 1) {
        return contains[0];
    }
    if (contains.length > 1) {
        return contains.sort((a, b)=>getKnownActive(a)[axis.start] - getKnownActive(b)[axis.start])[0];
    }
    return candidates.sort((a, b)=>{
        const first = closest$1(pageBorderBoxCenter, getCorners(getKnownActive(a)));
        const second = closest$1(pageBorderBoxCenter, getCorners(getKnownActive(b)));
        if (first !== second) {
            return first - second;
        }
        return getKnownActive(a)[axis.start] - getKnownActive(b)[axis.start];
    })[0];
};
const getCurrentPageBorderBoxCenter = (draggable, afterCritical)=>{
    const original = draggable.page.borderBox.center;
    return didStartAfterCritical(draggable.descriptor.id, afterCritical) ? subtract(original, afterCritical.displacedBy.point) : original;
};
const getCurrentPageBorderBox = (draggable, afterCritical)=>{
    const original = draggable.page.borderBox;
    return didStartAfterCritical(draggable.descriptor.id, afterCritical) ? offsetByPosition(original, negate(afterCritical.displacedBy.point)) : original;
};
var getClosestDraggable = (param)=>{
    let { pageBorderBoxCenter, viewport, destination, insideDestination, afterCritical } = param;
    const sorted = insideDestination.filter((draggable)=>isTotallyVisible({
            target: getCurrentPageBorderBox(draggable, afterCritical),
            destination,
            viewport: viewport.frame,
            withDroppableDisplacement: true
        })).sort((a, b)=>{
        const distanceToA = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(a, afterCritical)));
        const distanceToB = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(b, afterCritical)));
        if (distanceToA < distanceToB) {
            return -1;
        }
        if (distanceToB < distanceToA) {
            return 1;
        }
        return a.descriptor.index - b.descriptor.index;
    });
    return sorted[0] || null;
};
var getDisplacedBy = memoizeOne(function getDisplacedBy(axis, displaceBy) {
    const displacement = displaceBy[axis.line];
    return {
        value: displacement,
        point: patch(axis.line, displacement)
    };
});
const getRequiredGrowthForPlaceholder = (droppable, placeholderSize, draggables)=>{
    const axis = droppable.axis;
    if (droppable.descriptor.mode === 'virtual') {
        return patch(axis.line, placeholderSize[axis.line]);
    }
    const availableSpace = droppable.subject.page.contentBox[axis.size];
    const insideDroppable = getDraggablesInsideDroppable(droppable.descriptor.id, draggables);
    const spaceUsed = insideDroppable.reduce((sum, dimension)=>sum + dimension.client.marginBox[axis.size], 0);
    const requiredSpace = spaceUsed + placeholderSize[axis.line];
    const needsToGrowBy = requiredSpace - availableSpace;
    if (needsToGrowBy <= 0) {
        return null;
    }
    return patch(axis.line, needsToGrowBy);
};
const withMaxScroll = (frame, max)=>({
        ...frame,
        scroll: {
            ...frame.scroll,
            max
        }
    });
const addPlaceholder = (droppable, draggable, draggables)=>{
    const frame = droppable.frame;
    !!isHomeOf(draggable, droppable) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Should not add placeholder space to home list') : "TURBOPACK unreachable" : void 0;
    !!droppable.subject.withPlaceholder ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot add placeholder size to a subject when it already has one') : "TURBOPACK unreachable" : void 0;
    const placeholderSize = getDisplacedBy(droppable.axis, draggable.displaceBy).point;
    const requiredGrowth = getRequiredGrowthForPlaceholder(droppable, placeholderSize, draggables);
    const added = {
        placeholderSize,
        increasedBy: requiredGrowth,
        oldFrameMaxScroll: droppable.frame ? droppable.frame.scroll.max : null
    };
    if (!frame) {
        const subject = getSubject({
            page: droppable.subject.page,
            withPlaceholder: added,
            axis: droppable.axis,
            frame: droppable.frame
        });
        return {
            ...droppable,
            subject
        };
    }
    const maxScroll = requiredGrowth ? add(frame.scroll.max, requiredGrowth) : frame.scroll.max;
    const newFrame = withMaxScroll(frame, maxScroll);
    const subject = getSubject({
        page: droppable.subject.page,
        withPlaceholder: added,
        axis: droppable.axis,
        frame: newFrame
    });
    return {
        ...droppable,
        subject,
        frame: newFrame
    };
};
const removePlaceholder = (droppable)=>{
    const added = droppable.subject.withPlaceholder;
    !added ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot remove placeholder form subject when there was none') : "TURBOPACK unreachable" : void 0;
    const frame = droppable.frame;
    if (!frame) {
        const subject = getSubject({
            page: droppable.subject.page,
            axis: droppable.axis,
            frame: null,
            withPlaceholder: null
        });
        return {
            ...droppable,
            subject
        };
    }
    const oldMaxScroll = added.oldFrameMaxScroll;
    !oldMaxScroll ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected droppable with frame to have old max frame scroll when removing placeholder') : "TURBOPACK unreachable" : void 0;
    const newFrame = withMaxScroll(frame, oldMaxScroll);
    const subject = getSubject({
        page: droppable.subject.page,
        axis: droppable.axis,
        frame: newFrame,
        withPlaceholder: null
    });
    return {
        ...droppable,
        subject,
        frame: newFrame
    };
};
var moveToNewDroppable = (param)=>{
    let { previousPageBorderBoxCenter, moveRelativeTo, insideDestination, draggable, draggables, destination, viewport, afterCritical } = param;
    if (!moveRelativeTo) {
        if (insideDestination.length) {
            return null;
        }
        const proposed = {
            displaced: emptyGroups,
            displacedBy: noDisplacedBy,
            at: {
                type: 'REORDER',
                destination: {
                    droppableId: destination.descriptor.id,
                    index: 0
                }
            }
        };
        const proposedPageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
            impact: proposed,
            draggable,
            droppable: destination,
            draggables,
            afterCritical
        });
        const withPlaceholder = isHomeOf(draggable, destination) ? destination : addPlaceholder(destination, draggable, draggables);
        const isVisibleInNewLocation = isTotallyVisibleInNewLocation({
            draggable,
            destination: withPlaceholder,
            newPageBorderBoxCenter: proposedPageBorderBoxCenter,
            viewport: viewport.frame,
            withDroppableDisplacement: false,
            onlyOnMainAxis: true
        });
        return isVisibleInNewLocation ? proposed : null;
    }
    const isGoingBeforeTarget = Boolean(previousPageBorderBoxCenter[destination.axis.line] <= moveRelativeTo.page.borderBox.center[destination.axis.line]);
    const proposedIndex = (()=>{
        const relativeTo = moveRelativeTo.descriptor.index;
        if (moveRelativeTo.descriptor.id === draggable.descriptor.id) {
            return relativeTo;
        }
        if (isGoingBeforeTarget) {
            return relativeTo;
        }
        return relativeTo + 1;
    })();
    const displacedBy = getDisplacedBy(destination.axis, draggable.displaceBy);
    return calculateReorderImpact({
        draggable,
        insideDestination,
        destination,
        viewport,
        displacedBy,
        last: emptyGroups,
        index: proposedIndex
    });
};
var moveCrossAxis = (param)=>{
    let { isMovingForward, previousPageBorderBoxCenter, draggable, isOver, draggables, droppables, viewport, afterCritical } = param;
    const destination = getBestCrossAxisDroppable({
        isMovingForward,
        pageBorderBoxCenter: previousPageBorderBoxCenter,
        source: isOver,
        droppables,
        viewport
    });
    if (!destination) {
        return null;
    }
    const insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    const moveRelativeTo = getClosestDraggable({
        pageBorderBoxCenter: previousPageBorderBoxCenter,
        viewport,
        destination,
        insideDestination,
        afterCritical
    });
    const impact = moveToNewDroppable({
        previousPageBorderBoxCenter,
        destination,
        draggable,
        draggables,
        moveRelativeTo,
        insideDestination,
        viewport,
        afterCritical
    });
    if (!impact) {
        return null;
    }
    const pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
        impact,
        draggable,
        droppable: destination,
        draggables,
        afterCritical
    });
    const clientSelection = getClientFromPageBorderBoxCenter({
        pageBorderBoxCenter,
        draggable,
        viewport
    });
    return {
        clientSelection,
        impact,
        scrollJumpRequest: null
    };
};
var whatIsDraggedOver = (impact)=>{
    const at = impact.at;
    if (!at) {
        return null;
    }
    if (at.type === 'REORDER') {
        return at.destination.droppableId;
    }
    return at.combine.droppableId;
};
const getDroppableOver$1 = (impact, droppables)=>{
    const id = whatIsDraggedOver(impact);
    return id ? droppables[id] : null;
};
var moveInDirection = (param)=>{
    let { state, type } = param;
    const isActuallyOver = getDroppableOver$1(state.impact, state.dimensions.droppables);
    const isMainAxisMovementAllowed = Boolean(isActuallyOver);
    const home = state.dimensions.droppables[state.critical.droppable.id];
    const isOver = isActuallyOver || home;
    const direction = isOver.axis.direction;
    const isMovingOnMainAxis = direction === 'vertical' && (type === 'MOVE_UP' || type === 'MOVE_DOWN') || direction === 'horizontal' && (type === 'MOVE_LEFT' || type === 'MOVE_RIGHT');
    if (isMovingOnMainAxis && !isMainAxisMovementAllowed) {
        return null;
    }
    const isMovingForward = type === 'MOVE_DOWN' || type === 'MOVE_RIGHT';
    const draggable = state.dimensions.draggables[state.critical.draggable.id];
    const previousPageBorderBoxCenter = state.current.page.borderBoxCenter;
    const { draggables, droppables } = state.dimensions;
    return isMovingOnMainAxis ? moveToNextPlace({
        isMovingForward,
        previousPageBorderBoxCenter,
        draggable,
        destination: isOver,
        draggables,
        viewport: state.viewport,
        previousClientSelection: state.current.client.selection,
        previousImpact: state.impact,
        afterCritical: state.afterCritical
    }) : moveCrossAxis({
        isMovingForward,
        previousPageBorderBoxCenter,
        draggable,
        isOver,
        draggables,
        droppables,
        viewport: state.viewport,
        afterCritical: state.afterCritical
    });
};
function isMovementAllowed(state) {
    return state.phase === 'DRAGGING' || state.phase === 'COLLECTING';
}
function isPositionInFrame(frame) {
    const isWithinVertical = isWithin(frame.top, frame.bottom);
    const isWithinHorizontal = isWithin(frame.left, frame.right);
    return function run(point) {
        return isWithinVertical(point.y) && isWithinHorizontal(point.x);
    };
}
function getHasOverlap(first, second) {
    return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}
function getFurthestAway(param) {
    let { pageBorderBox, draggable, candidates } = param;
    const startCenter = draggable.page.borderBox.center;
    const sorted = candidates.map((candidate)=>{
        const axis = candidate.axis;
        const target = patch(candidate.axis.line, pageBorderBox.center[axis.line], candidate.page.borderBox.center[axis.crossAxisLine]);
        return {
            id: candidate.descriptor.id,
            distance: distance(startCenter, target)
        };
    }).sort((a, b)=>b.distance - a.distance);
    return sorted[0] ? sorted[0].id : null;
}
function getDroppableOver(param) {
    let { pageBorderBox, draggable, droppables } = param;
    const candidates = toDroppableList(droppables).filter((item)=>{
        if (!item.isEnabled) {
            return false;
        }
        const active = item.subject.active;
        if (!active) {
            return false;
        }
        if (!getHasOverlap(pageBorderBox, active)) {
            return false;
        }
        if (isPositionInFrame(active)(pageBorderBox.center)) {
            return true;
        }
        const axis = item.axis;
        const childCenter = active.center[axis.crossAxisLine];
        const crossAxisStart = pageBorderBox[axis.crossAxisStart];
        const crossAxisEnd = pageBorderBox[axis.crossAxisEnd];
        const isContained = isWithin(active[axis.crossAxisStart], active[axis.crossAxisEnd]);
        const isStartContained = isContained(crossAxisStart);
        const isEndContained = isContained(crossAxisEnd);
        if (!isStartContained && !isEndContained) {
            return true;
        }
        if (isStartContained) {
            return crossAxisStart < childCenter;
        }
        return crossAxisEnd > childCenter;
    });
    if (!candidates.length) {
        return null;
    }
    if (candidates.length === 1) {
        return candidates[0].descriptor.id;
    }
    return getFurthestAway({
        pageBorderBox,
        draggable,
        candidates
    });
}
const offsetRectByPosition = (rect, point)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])(offsetByPosition(rect, point));
var withDroppableScroll = (droppable, area)=>{
    const frame = droppable.frame;
    if (!frame) {
        return area;
    }
    return offsetRectByPosition(area, frame.scroll.diff.value);
};
function getIsDisplaced(param) {
    let { displaced, id } = param;
    return Boolean(displaced.visible[id] || displaced.invisible[id]);
}
function atIndex(param) {
    let { draggable, closest, inHomeList } = param;
    if (!closest) {
        return null;
    }
    if (!inHomeList) {
        return closest.descriptor.index;
    }
    if (closest.descriptor.index > draggable.descriptor.index) {
        return closest.descriptor.index - 1;
    }
    return closest.descriptor.index;
}
var getReorderImpact = (param)=>{
    let { pageBorderBoxWithDroppableScroll: targetRect, draggable, destination, insideDestination, last, viewport, afterCritical } = param;
    const axis = destination.axis;
    const displacedBy = getDisplacedBy(destination.axis, draggable.displaceBy);
    const displacement = displacedBy.value;
    const targetStart = targetRect[axis.start];
    const targetEnd = targetRect[axis.end];
    const withoutDragging = removeDraggableFromList(draggable, insideDestination);
    const closest = withoutDragging.find((child)=>{
        const id = child.descriptor.id;
        const childCenter = child.page.borderBox.center[axis.line];
        const didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
        const isDisplaced = getIsDisplaced({
            displaced: last,
            id
        });
        if (didStartAfterCritical$1) {
            if (isDisplaced) {
                return targetEnd <= childCenter;
            }
            return targetStart < childCenter - displacement;
        }
        if (isDisplaced) {
            return targetEnd <= childCenter + displacement;
        }
        return targetStart < childCenter;
    }) || null;
    const newIndex = atIndex({
        draggable,
        closest,
        inHomeList: isHomeOf(draggable, destination)
    });
    return calculateReorderImpact({
        draggable,
        insideDestination,
        destination,
        viewport,
        last,
        displacedBy,
        index: newIndex
    });
};
const combineThresholdDivisor = 4;
var getCombineImpact = (param)=>{
    let { draggable, pageBorderBoxWithDroppableScroll: targetRect, previousImpact, destination, insideDestination, afterCritical } = param;
    if (!destination.isCombineEnabled) {
        return null;
    }
    const axis = destination.axis;
    const displacedBy = getDisplacedBy(destination.axis, draggable.displaceBy);
    const displacement = displacedBy.value;
    const targetStart = targetRect[axis.start];
    const targetEnd = targetRect[axis.end];
    const withoutDragging = removeDraggableFromList(draggable, insideDestination);
    const combineWith = withoutDragging.find((child)=>{
        const id = child.descriptor.id;
        const childRect = child.page.borderBox;
        const childSize = childRect[axis.size];
        const threshold = childSize / combineThresholdDivisor;
        const didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
        const isDisplaced = getIsDisplaced({
            displaced: previousImpact.displaced,
            id
        });
        if (didStartAfterCritical$1) {
            if (isDisplaced) {
                return targetEnd > childRect[axis.start] + threshold && targetEnd < childRect[axis.end] - threshold;
            }
            return targetStart > childRect[axis.start] - displacement + threshold && targetStart < childRect[axis.end] - displacement - threshold;
        }
        if (isDisplaced) {
            return targetEnd > childRect[axis.start] + displacement + threshold && targetEnd < childRect[axis.end] + displacement - threshold;
        }
        return targetStart > childRect[axis.start] + threshold && targetStart < childRect[axis.end] - threshold;
    });
    if (!combineWith) {
        return null;
    }
    const impact = {
        displacedBy,
        displaced: previousImpact.displaced,
        at: {
            type: 'COMBINE',
            combine: {
                draggableId: combineWith.descriptor.id,
                droppableId: destination.descriptor.id
            }
        }
    };
    return impact;
};
var getDragImpact = (param)=>{
    let { pageOffset, draggable, draggables, droppables, previousImpact, viewport, afterCritical } = param;
    const pageBorderBox = offsetRectByPosition(draggable.page.borderBox, pageOffset);
    const destinationId = getDroppableOver({
        pageBorderBox,
        draggable,
        droppables
    });
    if (!destinationId) {
        return noImpact;
    }
    const destination = droppables[destinationId];
    const insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    const pageBorderBoxWithDroppableScroll = withDroppableScroll(destination, pageBorderBox);
    return getCombineImpact({
        pageBorderBoxWithDroppableScroll,
        draggable,
        previousImpact,
        destination,
        insideDestination,
        afterCritical
    }) || getReorderImpact({
        pageBorderBoxWithDroppableScroll,
        draggable,
        destination,
        insideDestination,
        last: previousImpact.displaced,
        viewport,
        afterCritical
    });
};
var patchDroppableMap = (droppables, updated)=>({
        ...droppables,
        [updated.descriptor.id]: updated
    });
const clearUnusedPlaceholder = (param)=>{
    let { previousImpact, impact, droppables } = param;
    const last = whatIsDraggedOver(previousImpact);
    const now = whatIsDraggedOver(impact);
    if (!last) {
        return droppables;
    }
    if (last === now) {
        return droppables;
    }
    const lastDroppable = droppables[last];
    if (!lastDroppable.subject.withPlaceholder) {
        return droppables;
    }
    const updated = removePlaceholder(lastDroppable);
    return patchDroppableMap(droppables, updated);
};
var recomputePlaceholders = (param)=>{
    let { draggable, draggables, droppables, previousImpact, impact } = param;
    const cleaned = clearUnusedPlaceholder({
        previousImpact,
        impact,
        droppables
    });
    const isOver = whatIsDraggedOver(impact);
    if (!isOver) {
        return cleaned;
    }
    const droppable = droppables[isOver];
    if (isHomeOf(draggable, droppable)) {
        return cleaned;
    }
    if (droppable.subject.withPlaceholder) {
        return cleaned;
    }
    const patched = addPlaceholder(droppable, draggable, draggables);
    return patchDroppableMap(cleaned, patched);
};
var update = (param)=>{
    let { state, clientSelection: forcedClientSelection, dimensions: forcedDimensions, viewport: forcedViewport, impact: forcedImpact, scrollJumpRequest } = param;
    const viewport = forcedViewport || state.viewport;
    const dimensions = forcedDimensions || state.dimensions;
    const clientSelection = forcedClientSelection || state.current.client.selection;
    const offset = subtract(clientSelection, state.initial.client.selection);
    const client = {
        offset,
        selection: clientSelection,
        borderBoxCenter: add(state.initial.client.borderBoxCenter, offset)
    };
    const page = {
        selection: add(client.selection, viewport.scroll.current),
        borderBoxCenter: add(client.borderBoxCenter, viewport.scroll.current),
        offset: add(client.offset, viewport.scroll.diff.value)
    };
    const current = {
        client,
        page
    };
    if (state.phase === 'COLLECTING') {
        return {
            ...state,
            dimensions,
            viewport,
            current
        };
    }
    const draggable = dimensions.draggables[state.critical.draggable.id];
    const newImpact = forcedImpact || getDragImpact({
        pageOffset: page.offset,
        draggable,
        draggables: dimensions.draggables,
        droppables: dimensions.droppables,
        previousImpact: state.impact,
        viewport,
        afterCritical: state.afterCritical
    });
    const withUpdatedPlaceholders = recomputePlaceholders({
        draggable,
        impact: newImpact,
        previousImpact: state.impact,
        draggables: dimensions.draggables,
        droppables: dimensions.droppables
    });
    const result = {
        ...state,
        current,
        dimensions: {
            draggables: dimensions.draggables,
            droppables: withUpdatedPlaceholders
        },
        impact: newImpact,
        viewport,
        scrollJumpRequest: scrollJumpRequest || null,
        forceShouldAnimate: scrollJumpRequest ? false : null
    };
    return result;
};
function getDraggables(ids, draggables) {
    return ids.map((id)=>draggables[id]);
}
var recompute = (param)=>{
    let { impact, viewport, draggables, destination, forceShouldAnimate } = param;
    const last = impact.displaced;
    const afterDragging = getDraggables(last.all, draggables);
    const displaced = getDisplacementGroups({
        afterDragging,
        destination,
        displacedBy: impact.displacedBy,
        viewport: viewport.frame,
        forceShouldAnimate,
        last
    });
    return {
        ...impact,
        displaced
    };
};
var getClientBorderBoxCenter = (param)=>{
    let { impact, draggable, droppable, draggables, viewport, afterCritical } = param;
    const pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
        impact,
        draggable,
        draggables,
        droppable,
        afterCritical
    });
    return getClientFromPageBorderBoxCenter({
        pageBorderBoxCenter,
        draggable,
        viewport
    });
};
var refreshSnap = (param)=>{
    let { state, dimensions: forcedDimensions, viewport: forcedViewport } = param;
    !(state.movementMode === 'SNAP') ? ("TURBOPACK compile-time truthy", 1) ? invariant() : "TURBOPACK unreachable" : void 0;
    const needsVisibilityCheck = state.impact;
    const viewport = forcedViewport || state.viewport;
    const dimensions = forcedDimensions || state.dimensions;
    const { draggables, droppables } = dimensions;
    const draggable = draggables[state.critical.draggable.id];
    const isOver = whatIsDraggedOver(needsVisibilityCheck);
    !isOver ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Must be over a destination in SNAP movement mode') : "TURBOPACK unreachable" : void 0;
    const destination = droppables[isOver];
    const impact = recompute({
        impact: needsVisibilityCheck,
        viewport,
        destination,
        draggables
    });
    const clientSelection = getClientBorderBoxCenter({
        impact,
        draggable,
        droppable: destination,
        draggables,
        viewport,
        afterCritical: state.afterCritical
    });
    return update({
        impact,
        clientSelection,
        state,
        dimensions,
        viewport
    });
};
var getHomeLocation = (descriptor)=>({
        index: descriptor.index,
        droppableId: descriptor.droppableId
    });
var getLiftEffect = (param)=>{
    let { draggable, home, draggables, viewport } = param;
    const displacedBy = getDisplacedBy(home.axis, draggable.displaceBy);
    const insideHome = getDraggablesInsideDroppable(home.descriptor.id, draggables);
    const rawIndex = insideHome.indexOf(draggable);
    !(rawIndex !== -1) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected draggable to be inside home list') : "TURBOPACK unreachable" : void 0;
    const afterDragging = insideHome.slice(rawIndex + 1);
    const effected = afterDragging.reduce((previous, item)=>{
        previous[item.descriptor.id] = true;
        return previous;
    }, {});
    const afterCritical = {
        inVirtualList: home.descriptor.mode === 'virtual',
        displacedBy,
        effected
    };
    const displaced = getDisplacementGroups({
        afterDragging,
        destination: home,
        displacedBy,
        last: null,
        viewport: viewport.frame,
        forceShouldAnimate: false
    });
    const impact = {
        displaced,
        displacedBy,
        at: {
            type: 'REORDER',
            destination: getHomeLocation(draggable.descriptor)
        }
    };
    return {
        impact,
        afterCritical
    };
};
var patchDimensionMap = (dimensions, updated)=>({
        draggables: dimensions.draggables,
        droppables: patchDroppableMap(dimensions.droppables, updated)
    });
const start = (key)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        {
            return;
        }
    }
};
const finish = (key)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        {
            return;
        }
    }
};
var offsetDraggable = (param)=>{
    let { draggable, offset: offset$1, initialWindowScroll } = param;
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["offset"])(draggable.client, offset$1);
    const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withScroll"])(client, initialWindowScroll);
    const moved = {
        ...draggable,
        placeholder: {
            ...draggable.placeholder,
            client
        },
        client,
        page
    };
    return moved;
};
var getFrame = (droppable)=>{
    const frame = droppable.frame;
    !frame ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected Droppable to have a frame') : "TURBOPACK unreachable" : void 0;
    return frame;
};
var adjustAdditionsForScrollChanges = (param)=>{
    let { additions, updatedDroppables, viewport } = param;
    const windowScrollChange = viewport.scroll.diff.value;
    return additions.map((draggable)=>{
        const droppableId = draggable.descriptor.droppableId;
        const modified = updatedDroppables[droppableId];
        const frame = getFrame(modified);
        const droppableScrollChange = frame.scroll.diff.value;
        const totalChange = add(windowScrollChange, droppableScrollChange);
        const moved = offsetDraggable({
            draggable,
            offset: totalChange,
            initialWindowScroll: viewport.scroll.initial
        });
        return moved;
    });
};
var publishWhileDraggingInVirtual = (param)=>{
    let { state, published } = param;
    start();
    const withScrollChange = published.modified.map((update)=>{
        const existing = state.dimensions.droppables[update.droppableId];
        const scrolled = scrollDroppable(existing, update.scroll);
        return scrolled;
    });
    const droppables = {
        ...state.dimensions.droppables,
        ...toDroppableMap(withScrollChange)
    };
    const updatedAdditions = toDraggableMap(adjustAdditionsForScrollChanges({
        additions: published.additions,
        updatedDroppables: droppables,
        viewport: state.viewport
    }));
    const draggables = {
        ...state.dimensions.draggables,
        ...updatedAdditions
    };
    published.removals.forEach((id)=>{
        delete draggables[id];
    });
    const dimensions = {
        droppables,
        draggables
    };
    const wasOverId = whatIsDraggedOver(state.impact);
    const wasOver = wasOverId ? dimensions.droppables[wasOverId] : null;
    const draggable = dimensions.draggables[state.critical.draggable.id];
    const home = dimensions.droppables[state.critical.droppable.id];
    const { impact: onLiftImpact, afterCritical } = getLiftEffect({
        draggable,
        home,
        draggables,
        viewport: state.viewport
    });
    const previousImpact = wasOver && wasOver.isCombineEnabled ? state.impact : onLiftImpact;
    const impact = getDragImpact({
        pageOffset: state.current.page.offset,
        draggable: dimensions.draggables[state.critical.draggable.id],
        draggables: dimensions.draggables,
        droppables: dimensions.droppables,
        previousImpact,
        viewport: state.viewport,
        afterCritical
    });
    finish();
    const draggingState = {
        ...state,
        phase: 'DRAGGING',
        impact,
        onLiftImpact,
        dimensions,
        afterCritical,
        forceShouldAnimate: false
    };
    if (state.phase === 'COLLECTING') {
        return draggingState;
    }
    const dropPending = {
        ...draggingState,
        phase: 'DROP_PENDING',
        reason: state.reason,
        isWaiting: false
    };
    return dropPending;
};
const isSnapping = (state)=>state.movementMode === 'SNAP';
const postDroppableChange = (state, updated, isEnabledChanging)=>{
    const dimensions = patchDimensionMap(state.dimensions, updated);
    if (!isSnapping(state) || isEnabledChanging) {
        return update({
            state,
            dimensions
        });
    }
    return refreshSnap({
        state,
        dimensions
    });
};
function removeScrollJumpRequest(state) {
    if (state.isDragging && state.movementMode === 'SNAP') {
        return {
            ...state,
            scrollJumpRequest: null
        };
    }
    return state;
}
const idle$2 = {
    phase: 'IDLE',
    completed: null,
    shouldFlush: false
};
var reducer = function() {
    let state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : idle$2, action = arguments.length > 1 ? arguments[1] : void 0;
    if (action.type === 'FLUSH') {
        return {
            ...idle$2,
            shouldFlush: true
        };
    }
    if (action.type === 'INITIAL_PUBLISH') {
        !(state.phase === 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'INITIAL_PUBLISH must come after a IDLE phase') : "TURBOPACK unreachable" : void 0;
        const { critical, clientSelection, viewport, dimensions, movementMode } = action.payload;
        const draggable = dimensions.draggables[critical.draggable.id];
        const home = dimensions.droppables[critical.droppable.id];
        const client = {
            selection: clientSelection,
            borderBoxCenter: draggable.client.borderBox.center,
            offset: origin
        };
        const initial = {
            client,
            page: {
                selection: add(client.selection, viewport.scroll.initial),
                borderBoxCenter: add(client.selection, viewport.scroll.initial),
                offset: add(client.selection, viewport.scroll.diff.value)
            }
        };
        const isWindowScrollAllowed = toDroppableList(dimensions.droppables).every((item)=>!item.isFixedOnPage);
        const { impact, afterCritical } = getLiftEffect({
            draggable,
            home,
            draggables: dimensions.draggables,
            viewport
        });
        const result = {
            phase: 'DRAGGING',
            isDragging: true,
            critical,
            movementMode,
            dimensions,
            initial,
            current: initial,
            isWindowScrollAllowed,
            impact,
            afterCritical,
            onLiftImpact: impact,
            viewport,
            scrollJumpRequest: null,
            forceShouldAnimate: null
        };
        return result;
    }
    if (action.type === 'COLLECTION_STARTING') {
        if (state.phase === 'COLLECTING' || state.phase === 'DROP_PENDING') {
            return state;
        }
        !(state.phase === 'DRAGGING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Collection cannot start from phase ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const result = {
            ...state,
            phase: 'COLLECTING'
        };
        return result;
    }
    if (action.type === 'PUBLISH_WHILE_DRAGGING') {
        !(state.phase === 'COLLECTING' || state.phase === 'DROP_PENDING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Unexpected ".concat(action.type, " received in phase ").concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        return publishWhileDraggingInVirtual({
            state,
            published: action.payload
        });
    }
    if (action.type === 'MOVE') {
        if (state.phase === 'DROP_PENDING') {
            return state;
        }
        !isMovementAllowed(state) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "".concat(action.type, " not permitted in phase ").concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const { client: clientSelection } = action.payload;
        if (isEqual$1(clientSelection, state.current.client.selection)) {
            return state;
        }
        return update({
            state,
            clientSelection,
            impact: isSnapping(state) ? state.impact : null
        });
    }
    if (action.type === 'UPDATE_DROPPABLE_SCROLL') {
        if (state.phase === 'DROP_PENDING') {
            return removeScrollJumpRequest(state);
        }
        if (state.phase === 'COLLECTING') {
            return removeScrollJumpRequest(state);
        }
        !isMovementAllowed(state) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "".concat(action.type, " not permitted in phase ").concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const { id, newScroll } = action.payload;
        const target = state.dimensions.droppables[id];
        if (!target) {
            return state;
        }
        const scrolled = scrollDroppable(target, newScroll);
        return postDroppableChange(state, scrolled, false);
    }
    if (action.type === 'UPDATE_DROPPABLE_IS_ENABLED') {
        if (state.phase === 'DROP_PENDING') {
            return state;
        }
        !isMovementAllowed(state) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Attempting to move in an unsupported phase ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const { id, isEnabled } = action.payload;
        const target = state.dimensions.droppables[id];
        !target ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot find Droppable[id: ".concat(id, "] to toggle its enabled state")) : "TURBOPACK unreachable" : void 0;
        !(target.isEnabled !== isEnabled) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Trying to set droppable isEnabled to ".concat(String(isEnabled), "\n      but it is already ").concat(String(target.isEnabled))) : "TURBOPACK unreachable" : void 0;
        const updated = {
            ...target,
            isEnabled
        };
        return postDroppableChange(state, updated, true);
    }
    if (action.type === 'UPDATE_DROPPABLE_IS_COMBINE_ENABLED') {
        if (state.phase === 'DROP_PENDING') {
            return state;
        }
        !isMovementAllowed(state) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Attempting to move in an unsupported phase ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const { id, isCombineEnabled } = action.payload;
        const target = state.dimensions.droppables[id];
        !target ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot find Droppable[id: ".concat(id, "] to toggle its isCombineEnabled state")) : "TURBOPACK unreachable" : void 0;
        !(target.isCombineEnabled !== isCombineEnabled) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Trying to set droppable isCombineEnabled to ".concat(String(isCombineEnabled), "\n      but it is already ").concat(String(target.isCombineEnabled))) : "TURBOPACK unreachable" : void 0;
        const updated = {
            ...target,
            isCombineEnabled
        };
        return postDroppableChange(state, updated, true);
    }
    if (action.type === 'MOVE_BY_WINDOW_SCROLL') {
        if (state.phase === 'DROP_PENDING' || state.phase === 'DROP_ANIMATING') {
            return state;
        }
        !isMovementAllowed(state) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot move by window in phase ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        !state.isWindowScrollAllowed ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Window scrolling is currently not supported for fixed lists') : "TURBOPACK unreachable" : void 0;
        const newScroll = action.payload.newScroll;
        if (isEqual$1(state.viewport.scroll.current, newScroll)) {
            return removeScrollJumpRequest(state);
        }
        const viewport = scrollViewport(state.viewport, newScroll);
        if (isSnapping(state)) {
            return refreshSnap({
                state,
                viewport
            });
        }
        return update({
            state,
            viewport
        });
    }
    if (action.type === 'UPDATE_VIEWPORT_MAX_SCROLL') {
        if (!isMovementAllowed(state)) {
            return state;
        }
        const maxScroll = action.payload.maxScroll;
        if (isEqual$1(maxScroll, state.viewport.scroll.max)) {
            return state;
        }
        const withMaxScroll = {
            ...state.viewport,
            scroll: {
                ...state.viewport.scroll,
                max: maxScroll
            }
        };
        return {
            ...state,
            viewport: withMaxScroll
        };
    }
    if (action.type === 'MOVE_UP' || action.type === 'MOVE_DOWN' || action.type === 'MOVE_LEFT' || action.type === 'MOVE_RIGHT') {
        if (state.phase === 'COLLECTING' || state.phase === 'DROP_PENDING') {
            return state;
        }
        !(state.phase === 'DRAGGING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "".concat(action.type, " received while not in DRAGGING phase")) : "TURBOPACK unreachable" : void 0;
        const result = moveInDirection({
            state,
            type: action.type
        });
        if (!result) {
            return state;
        }
        return update({
            state,
            impact: result.impact,
            clientSelection: result.clientSelection,
            scrollJumpRequest: result.scrollJumpRequest
        });
    }
    if (action.type === 'DROP_PENDING') {
        const reason = action.payload.reason;
        !(state.phase === 'COLLECTING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Can only move into the DROP_PENDING phase from the COLLECTING phase') : "TURBOPACK unreachable" : void 0;
        const newState = {
            ...state,
            phase: 'DROP_PENDING',
            isWaiting: true,
            reason
        };
        return newState;
    }
    if (action.type === 'DROP_ANIMATE') {
        const { completed, dropDuration, newHomeClientOffset } = action.payload;
        !(state.phase === 'DRAGGING' || state.phase === 'DROP_PENDING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot animate drop from phase ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
        const result = {
            phase: 'DROP_ANIMATING',
            completed,
            dropDuration,
            newHomeClientOffset,
            dimensions: state.dimensions
        };
        return result;
    }
    if (action.type === 'DROP_COMPLETE') {
        const { completed } = action.payload;
        return {
            phase: 'IDLE',
            completed,
            shouldFlush: false
        };
    }
    return state;
};
function guard(action, predicate) {
    return action instanceof Object && 'type' in action && action.type === predicate;
}
const beforeInitialCapture = (args)=>({
        type: 'BEFORE_INITIAL_CAPTURE',
        payload: args
    });
const lift$1 = (args)=>({
        type: 'LIFT',
        payload: args
    });
const initialPublish = (args)=>({
        type: 'INITIAL_PUBLISH',
        payload: args
    });
const publishWhileDragging = (args)=>({
        type: 'PUBLISH_WHILE_DRAGGING',
        payload: args
    });
const collectionStarting = ()=>({
        type: 'COLLECTION_STARTING',
        payload: null
    });
const updateDroppableScroll = (args)=>({
        type: 'UPDATE_DROPPABLE_SCROLL',
        payload: args
    });
const updateDroppableIsEnabled = (args)=>({
        type: 'UPDATE_DROPPABLE_IS_ENABLED',
        payload: args
    });
const updateDroppableIsCombineEnabled = (args)=>({
        type: 'UPDATE_DROPPABLE_IS_COMBINE_ENABLED',
        payload: args
    });
const move = (args)=>({
        type: 'MOVE',
        payload: args
    });
const moveByWindowScroll = (args)=>({
        type: 'MOVE_BY_WINDOW_SCROLL',
        payload: args
    });
const updateViewportMaxScroll = (args)=>({
        type: 'UPDATE_VIEWPORT_MAX_SCROLL',
        payload: args
    });
const moveUp = ()=>({
        type: 'MOVE_UP',
        payload: null
    });
const moveDown = ()=>({
        type: 'MOVE_DOWN',
        payload: null
    });
const moveRight = ()=>({
        type: 'MOVE_RIGHT',
        payload: null
    });
const moveLeft = ()=>({
        type: 'MOVE_LEFT',
        payload: null
    });
const flush = ()=>({
        type: 'FLUSH',
        payload: null
    });
const animateDrop = (args)=>({
        type: 'DROP_ANIMATE',
        payload: args
    });
const completeDrop = (args)=>({
        type: 'DROP_COMPLETE',
        payload: args
    });
const drop = (args)=>({
        type: 'DROP',
        payload: args
    });
const dropPending = (args)=>({
        type: 'DROP_PENDING',
        payload: args
    });
const dropAnimationFinished = ()=>({
        type: 'DROP_ANIMATION_FINISHED',
        payload: null
    });
function checkIndexes(insideDestination) {
    if (insideDestination.length <= 1) {
        return;
    }
    const indexes = insideDestination.map((d)=>d.descriptor.index);
    const errors = {};
    for(let i = 1; i < indexes.length; i++){
        const current = indexes[i];
        const previous = indexes[i - 1];
        if (current !== previous + 1) {
            errors[current] = true;
        }
    }
    if (!Object.keys(errors).length) {
        return;
    }
    const formatted = indexes.map((index)=>{
        const hasError = Boolean(errors[index]);
        return hasError ? "[🔥".concat(index, "]") : "".concat(index);
    }).join(', ');
    ("TURBOPACK compile-time truthy", 1) ? warning("\n    Detected non-consecutive <Draggable /> indexes.\n\n    (This can cause unexpected bugs)\n\n    ".concat(formatted, "\n  ")) : "TURBOPACK unreachable";
}
function validateDimensions(critical, dimensions) {
    if ("TURBOPACK compile-time truthy", 1) {
        const insideDestination = getDraggablesInsideDroppable(critical.droppable.id, dimensions.draggables);
        checkIndexes(insideDestination);
    }
}
var lift = (marshal)=>(param)=>{
        let { getState, dispatch } = param;
        return (next)=>(action)=>{
                if (!guard(action, 'LIFT')) {
                    next(action);
                    return;
                }
                const { id, clientSelection, movementMode } = action.payload;
                const initial = getState();
                if (initial.phase === 'DROP_ANIMATING') {
                    dispatch(completeDrop({
                        completed: initial.completed
                    }));
                }
                !(getState().phase === 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Unexpected phase to start a drag') : "TURBOPACK unreachable" : void 0;
                dispatch(flush());
                dispatch(beforeInitialCapture({
                    draggableId: id,
                    movementMode
                }));
                const scrollOptions = {
                    shouldPublishImmediately: movementMode === 'SNAP'
                };
                const request = {
                    draggableId: id,
                    scrollOptions
                };
                const { critical, dimensions, viewport } = marshal.startPublishing(request);
                validateDimensions(critical, dimensions);
                dispatch(initialPublish({
                    critical,
                    dimensions,
                    clientSelection,
                    movementMode,
                    viewport
                }));
            };
    };
var style = (marshal)=>()=>(next)=>(action)=>{
                if (guard(action, 'INITIAL_PUBLISH')) {
                    marshal.dragging();
                }
                if (guard(action, 'DROP_ANIMATE')) {
                    marshal.dropping(action.payload.completed.result.reason);
                }
                if (guard(action, 'FLUSH') || guard(action, 'DROP_COMPLETE')) {
                    marshal.resting();
                }
                next(action);
            };
const curves = {
    outOfTheWay: 'cubic-bezier(0.2, 0, 0, 1)',
    drop: 'cubic-bezier(.2,1,.1,1)'
};
const combine = {
    opacity: {
        drop: 0,
        combining: 0.7
    },
    scale: {
        drop: 0.75
    }
};
const timings = {
    outOfTheWay: 0.2,
    minDropTime: 0.33,
    maxDropTime: 0.55
};
const outOfTheWayTiming = "".concat(timings.outOfTheWay, "s ").concat(curves.outOfTheWay);
const transitions = {
    fluid: "opacity ".concat(outOfTheWayTiming),
    snap: "transform ".concat(outOfTheWayTiming, ", opacity ").concat(outOfTheWayTiming),
    drop: (duration)=>{
        const timing = "".concat(duration, "s ").concat(curves.drop);
        return "transform ".concat(timing, ", opacity ").concat(timing);
    },
    outOfTheWay: "transform ".concat(outOfTheWayTiming),
    placeholder: "height ".concat(outOfTheWayTiming, ", width ").concat(outOfTheWayTiming, ", margin ").concat(outOfTheWayTiming)
};
const moveTo = (offset)=>isEqual$1(offset, origin) ? undefined : "translate(".concat(offset.x, "px, ").concat(offset.y, "px)");
const transforms = {
    moveTo,
    drop: (offset, isCombining)=>{
        const translate = moveTo(offset);
        if (!translate) {
            return undefined;
        }
        if (!isCombining) {
            return translate;
        }
        return "".concat(translate, " scale(").concat(combine.scale.drop, ")");
    }
};
const { minDropTime, maxDropTime } = timings;
const dropTimeRange = maxDropTime - minDropTime;
const maxDropTimeAtDistance = 1500;
const cancelDropModifier = 0.6;
var getDropDuration = (param)=>{
    let { current, destination, reason } = param;
    const distance$1 = distance(current, destination);
    if (distance$1 <= 0) {
        return minDropTime;
    }
    if (distance$1 >= maxDropTimeAtDistance) {
        return maxDropTime;
    }
    const percentage = distance$1 / maxDropTimeAtDistance;
    const duration = minDropTime + dropTimeRange * percentage;
    const withDuration = reason === 'CANCEL' ? duration * cancelDropModifier : duration;
    return Number(withDuration.toFixed(2));
};
var getNewHomeClientOffset = (param)=>{
    let { impact, draggable, dimensions, viewport, afterCritical } = param;
    const { draggables, droppables } = dimensions;
    const droppableId = whatIsDraggedOver(impact);
    const destination = droppableId ? droppables[droppableId] : null;
    const home = droppables[draggable.descriptor.droppableId];
    const newClientCenter = getClientBorderBoxCenter({
        impact,
        draggable,
        draggables,
        afterCritical,
        droppable: destination || home,
        viewport
    });
    const offset = subtract(newClientCenter, draggable.client.borderBox.center);
    return offset;
};
var getDropImpact = (param)=>{
    let { draggables, reason, lastImpact, home, viewport, onLiftImpact } = param;
    if (!lastImpact.at || reason !== 'DROP') {
        const recomputedHomeImpact = recompute({
            draggables,
            impact: onLiftImpact,
            destination: home,
            viewport,
            forceShouldAnimate: true
        });
        return {
            impact: recomputedHomeImpact,
            didDropInsideDroppable: false
        };
    }
    if (lastImpact.at.type === 'REORDER') {
        return {
            impact: lastImpact,
            didDropInsideDroppable: true
        };
    }
    const withoutMovement = {
        ...lastImpact,
        displaced: emptyGroups
    };
    return {
        impact: withoutMovement,
        didDropInsideDroppable: true
    };
};
const dropMiddleware = (param)=>{
    let { getState, dispatch } = param;
    return (next)=>(action)=>{
            if (!guard(action, 'DROP')) {
                next(action);
                return;
            }
            const state = getState();
            const reason = action.payload.reason;
            if (state.phase === 'COLLECTING') {
                dispatch(dropPending({
                    reason
                }));
                return;
            }
            if (state.phase === 'IDLE') {
                return;
            }
            const isWaitingForDrop = state.phase === 'DROP_PENDING' && state.isWaiting;
            !!isWaitingForDrop ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'A DROP action occurred while DROP_PENDING and still waiting') : "TURBOPACK unreachable" : void 0;
            !(state.phase === 'DRAGGING' || state.phase === 'DROP_PENDING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot drop in phase: ".concat(state.phase)) : "TURBOPACK unreachable" : void 0;
            const critical = state.critical;
            const dimensions = state.dimensions;
            const draggable = dimensions.draggables[state.critical.draggable.id];
            const { impact, didDropInsideDroppable } = getDropImpact({
                reason,
                lastImpact: state.impact,
                afterCritical: state.afterCritical,
                onLiftImpact: state.onLiftImpact,
                home: state.dimensions.droppables[state.critical.droppable.id],
                viewport: state.viewport,
                draggables: state.dimensions.draggables
            });
            const destination = didDropInsideDroppable ? tryGetDestination(impact) : null;
            const combine = didDropInsideDroppable ? tryGetCombine(impact) : null;
            const source = {
                index: critical.draggable.index,
                droppableId: critical.droppable.id
            };
            const result = {
                draggableId: draggable.descriptor.id,
                type: draggable.descriptor.type,
                source,
                reason,
                mode: state.movementMode,
                destination,
                combine
            };
            const newHomeClientOffset = getNewHomeClientOffset({
                impact,
                draggable,
                dimensions,
                viewport: state.viewport,
                afterCritical: state.afterCritical
            });
            const completed = {
                critical: state.critical,
                afterCritical: state.afterCritical,
                result,
                impact
            };
            const isAnimationRequired = !isEqual$1(state.current.client.offset, newHomeClientOffset) || Boolean(result.combine);
            if (!isAnimationRequired) {
                dispatch(completeDrop({
                    completed
                }));
                return;
            }
            const dropDuration = getDropDuration({
                current: state.current.client.offset,
                destination: newHomeClientOffset,
                reason
            });
            const args = {
                newHomeClientOffset,
                dropDuration,
                completed
            };
            dispatch(animateDrop(args));
        };
};
var getWindowScroll = ()=>({
        x: window.pageXOffset,
        y: window.pageYOffset
    });
function getWindowScrollBinding(update) {
    return {
        eventName: 'scroll',
        options: {
            passive: true,
            capture: false
        },
        fn: (event)=>{
            if (event.target !== window && event.target !== window.document) {
                return;
            }
            update();
        }
    };
}
function getScrollListener(param) {
    let { onWindowScroll } = param;
    function updateScroll() {
        onWindowScroll(getWindowScroll());
    }
    const scheduled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(updateScroll);
    const binding = getWindowScrollBinding(scheduled);
    let unbind = noop$2;
    function isActive() {
        return unbind !== noop$2;
    }
    function start() {
        !!isActive() ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot start scroll listener when already active') : "TURBOPACK unreachable" : void 0;
        unbind = bindEvents(window, [
            binding
        ]);
    }
    function stop() {
        !isActive() ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot stop scroll listener when not active') : "TURBOPACK unreachable" : void 0;
        scheduled.cancel();
        unbind();
        unbind = noop$2;
    }
    return {
        start,
        stop,
        isActive
    };
}
const shouldStop$1 = (action)=>guard(action, 'DROP_COMPLETE') || guard(action, 'DROP_ANIMATE') || guard(action, 'FLUSH');
const scrollListener = (store)=>{
    const listener = getScrollListener({
        onWindowScroll: (newScroll)=>{
            store.dispatch(moveByWindowScroll({
                newScroll
            }));
        }
    });
    return (next)=>(action)=>{
            if (!listener.isActive() && guard(action, 'INITIAL_PUBLISH')) {
                listener.start();
            }
            if (listener.isActive() && shouldStop$1(action)) {
                listener.stop();
            }
            next(action);
        };
};
var getExpiringAnnounce = (announce)=>{
    let wasCalled = false;
    let isExpired = false;
    const timeoutId = setTimeout(()=>{
        isExpired = true;
    });
    const result = (message)=>{
        if (wasCalled) {
            ("TURBOPACK compile-time truthy", 1) ? warning('Announcement already made. Not making a second announcement') : "TURBOPACK unreachable";
            return;
        }
        if (isExpired) {
            ("TURBOPACK compile-time truthy", 1) ? warning("\n        Announcements cannot be made asynchronously.\n        Default message has already been announced.\n      ") : "TURBOPACK unreachable";
            return;
        }
        wasCalled = true;
        announce(message);
        clearTimeout(timeoutId);
    };
    result.wasCalled = ()=>wasCalled;
    return result;
};
var getAsyncMarshal = ()=>{
    const entries = [];
    const execute = (timerId)=>{
        const index = entries.findIndex((item)=>item.timerId === timerId);
        !(index !== -1) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find timer') : "TURBOPACK unreachable" : void 0;
        const [entry] = entries.splice(index, 1);
        entry.callback();
    };
    const add = (fn)=>{
        const timerId = setTimeout(()=>execute(timerId));
        const entry = {
            timerId,
            callback: fn
        };
        entries.push(entry);
    };
    const flush = ()=>{
        if (!entries.length) {
            return;
        }
        const shallow = [
            ...entries
        ];
        entries.length = 0;
        shallow.forEach((entry)=>{
            clearTimeout(entry.timerId);
            entry.callback();
        });
    };
    return {
        add,
        flush
    };
};
const areLocationsEqual = (first, second)=>{
    if (first == null && second == null) {
        return true;
    }
    if (first == null || second == null) {
        return false;
    }
    return first.droppableId === second.droppableId && first.index === second.index;
};
const isCombineEqual = (first, second)=>{
    if (first == null && second == null) {
        return true;
    }
    if (first == null || second == null) {
        return false;
    }
    return first.draggableId === second.draggableId && first.droppableId === second.droppableId;
};
const isCriticalEqual = (first, second)=>{
    if (first === second) {
        return true;
    }
    const isDraggableEqual = first.draggable.id === second.draggable.id && first.draggable.droppableId === second.draggable.droppableId && first.draggable.type === second.draggable.type && first.draggable.index === second.draggable.index;
    const isDroppableEqual = first.droppable.id === second.droppable.id && first.droppable.type === second.droppable.type;
    return isDraggableEqual && isDroppableEqual;
};
const withTimings = (key, fn)=>{
    start();
    fn();
    finish();
};
const getDragStart = (critical, mode)=>({
        draggableId: critical.draggable.id,
        type: critical.droppable.type,
        source: {
            droppableId: critical.droppable.id,
            index: critical.draggable.index
        },
        mode
    });
function execute(responder, data, announce, getDefaultMessage) {
    if (!responder) {
        announce(getDefaultMessage(data));
        return;
    }
    const willExpire = getExpiringAnnounce(announce);
    const provided = {
        announce: willExpire
    };
    responder(data, provided);
    if (!willExpire.wasCalled()) {
        announce(getDefaultMessage(data));
    }
}
var getPublisher = (getResponders, announce)=>{
    const asyncMarshal = getAsyncMarshal();
    let dragging = null;
    const beforeCapture = (draggableId, mode)=>{
        !!dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fire onBeforeCapture as a drag start has already been published') : "TURBOPACK unreachable" : void 0;
        withTimings('onBeforeCapture', ()=>{
            const fn = getResponders().onBeforeCapture;
            if (fn) {
                const before = {
                    draggableId,
                    mode
                };
                fn(before);
            }
        });
    };
    const beforeStart = (critical, mode)=>{
        !!dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fire onBeforeDragStart as a drag start has already been published') : "TURBOPACK unreachable" : void 0;
        withTimings('onBeforeDragStart', ()=>{
            const fn = getResponders().onBeforeDragStart;
            if (fn) {
                fn(getDragStart(critical, mode));
            }
        });
    };
    const start = (critical, mode)=>{
        !!dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fire onBeforeDragStart as a drag start has already been published') : "TURBOPACK unreachable" : void 0;
        const data = getDragStart(critical, mode);
        dragging = {
            mode,
            lastCritical: critical,
            lastLocation: data.source,
            lastCombine: null
        };
        asyncMarshal.add(()=>{
            withTimings('onDragStart', ()=>execute(getResponders().onDragStart, data, announce, preset.onDragStart));
        });
    };
    const update = (critical, impact)=>{
        const location = tryGetDestination(impact);
        const combine = tryGetCombine(impact);
        !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fire onDragMove when onDragStart has not been called') : "TURBOPACK unreachable" : void 0;
        const hasCriticalChanged = !isCriticalEqual(critical, dragging.lastCritical);
        if (hasCriticalChanged) {
            dragging.lastCritical = critical;
        }
        const hasLocationChanged = !areLocationsEqual(dragging.lastLocation, location);
        if (hasLocationChanged) {
            dragging.lastLocation = location;
        }
        const hasGroupingChanged = !isCombineEqual(dragging.lastCombine, combine);
        if (hasGroupingChanged) {
            dragging.lastCombine = combine;
        }
        if (!hasCriticalChanged && !hasLocationChanged && !hasGroupingChanged) {
            return;
        }
        const data = {
            ...getDragStart(critical, dragging.mode),
            combine,
            destination: location
        };
        asyncMarshal.add(()=>{
            withTimings('onDragUpdate', ()=>execute(getResponders().onDragUpdate, data, announce, preset.onDragUpdate));
        });
    };
    const flush = ()=>{
        !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Can only flush responders while dragging') : "TURBOPACK unreachable" : void 0;
        asyncMarshal.flush();
    };
    const drop = (result)=>{
        !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fire onDragEnd when there is no matching onDragStart') : "TURBOPACK unreachable" : void 0;
        dragging = null;
        withTimings('onDragEnd', ()=>execute(getResponders().onDragEnd, result, announce, preset.onDragEnd));
    };
    const abort = ()=>{
        if (!dragging) {
            return;
        }
        const result = {
            ...getDragStart(dragging.lastCritical, dragging.mode),
            combine: null,
            destination: null,
            reason: 'CANCEL'
        };
        drop(result);
    };
    return {
        beforeCapture,
        beforeStart,
        start,
        update,
        flush,
        drop,
        abort
    };
};
var responders = (getResponders, announce)=>{
    const publisher = getPublisher(getResponders, announce);
    return (store)=>(next)=>(action)=>{
                if (guard(action, 'BEFORE_INITIAL_CAPTURE')) {
                    publisher.beforeCapture(action.payload.draggableId, action.payload.movementMode);
                    return;
                }
                if (guard(action, 'INITIAL_PUBLISH')) {
                    const critical = action.payload.critical;
                    publisher.beforeStart(critical, action.payload.movementMode);
                    next(action);
                    publisher.start(critical, action.payload.movementMode);
                    return;
                }
                if (guard(action, 'DROP_COMPLETE')) {
                    const result = action.payload.completed.result;
                    publisher.flush();
                    next(action);
                    publisher.drop(result);
                    return;
                }
                next(action);
                if (guard(action, 'FLUSH')) {
                    publisher.abort();
                    return;
                }
                const state = store.getState();
                if (state.phase === 'DRAGGING') {
                    publisher.update(state.critical, state.impact);
                }
            };
};
const dropAnimationFinishMiddleware = (store)=>(next)=>(action)=>{
            if (!guard(action, 'DROP_ANIMATION_FINISHED')) {
                next(action);
                return;
            }
            const state = store.getState();
            !(state.phase === 'DROP_ANIMATING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot finish a drop animating when no drop is occurring') : "TURBOPACK unreachable" : void 0;
            store.dispatch(completeDrop({
                completed: state.completed
            }));
        };
const dropAnimationFlushOnScrollMiddleware = (store)=>{
    let unbind = null;
    let frameId = null;
    function clear() {
        if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        if (unbind) {
            unbind();
            unbind = null;
        }
    }
    return (next)=>(action)=>{
            if (guard(action, 'FLUSH') || guard(action, 'DROP_COMPLETE') || guard(action, 'DROP_ANIMATION_FINISHED')) {
                clear();
            }
            next(action);
            if (!guard(action, 'DROP_ANIMATE')) {
                return;
            }
            const binding = {
                eventName: 'scroll',
                options: {
                    capture: true,
                    passive: false,
                    once: true
                },
                fn: function flushDropAnimation() {
                    const state = store.getState();
                    if (state.phase === 'DROP_ANIMATING') {
                        store.dispatch(dropAnimationFinished());
                    }
                }
            };
            frameId = requestAnimationFrame(()=>{
                frameId = null;
                unbind = bindEvents(window, [
                    binding
                ]);
            });
        };
};
var dimensionMarshalStopper = (marshal)=>()=>(next)=>(action)=>{
                if (guard(action, 'DROP_COMPLETE') || guard(action, 'FLUSH') || guard(action, 'DROP_ANIMATE')) {
                    marshal.stopPublishing();
                }
                next(action);
            };
var focus = (marshal)=>{
    let isWatching = false;
    return ()=>(next)=>(action)=>{
                if (guard(action, 'INITIAL_PUBLISH')) {
                    isWatching = true;
                    marshal.tryRecordFocus(action.payload.critical.draggable.id);
                    next(action);
                    marshal.tryRestoreFocusRecorded();
                    return;
                }
                next(action);
                if (!isWatching) {
                    return;
                }
                if (guard(action, 'FLUSH')) {
                    isWatching = false;
                    marshal.tryRestoreFocusRecorded();
                    return;
                }
                if (guard(action, 'DROP_COMPLETE')) {
                    isWatching = false;
                    const result = action.payload.completed.result;
                    if (result.combine) {
                        marshal.tryShiftRecord(result.draggableId, result.combine.draggableId);
                    }
                    marshal.tryRestoreFocusRecorded();
                }
            };
};
const shouldStop = (action)=>guard(action, 'DROP_COMPLETE') || guard(action, 'DROP_ANIMATE') || guard(action, 'FLUSH');
var autoScroll = (autoScroller)=>(store)=>(next)=>(action)=>{
                if (shouldStop(action)) {
                    autoScroller.stop();
                    next(action);
                    return;
                }
                if (guard(action, 'INITIAL_PUBLISH')) {
                    next(action);
                    const state = store.getState();
                    !(state.phase === 'DRAGGING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected phase to be DRAGGING after INITIAL_PUBLISH') : "TURBOPACK unreachable" : void 0;
                    autoScroller.start(state);
                    return;
                }
                next(action);
                autoScroller.scroll(store.getState());
            };
const pendingDrop = (store)=>(next)=>(action)=>{
            next(action);
            if (!guard(action, 'PUBLISH_WHILE_DRAGGING')) {
                return;
            }
            const postActionState = store.getState();
            if (postActionState.phase !== 'DROP_PENDING') {
                return;
            }
            if (postActionState.isWaiting) {
                return;
            }
            store.dispatch(drop({
                reason: postActionState.reason
            }));
        };
const composeEnhancers = ("TURBOPACK compile-time value", "development") !== 'production' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: '@hello-pangea/dnd'
}) : __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compose"];
var createStore = (param)=>{
    let { dimensionMarshal, focusMarshal, styleMarshal, getResponders, announce, autoScroller } = param;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(reducer, composeEnhancers((0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyMiddleware"])(style(styleMarshal), dimensionMarshalStopper(dimensionMarshal), lift(dimensionMarshal), dropMiddleware, dropAnimationFinishMiddleware, dropAnimationFlushOnScrollMiddleware, pendingDrop, autoScroll(autoScroller), scrollListener, focus(focusMarshal), responders(getResponders, announce))));
};
const clean$1 = ()=>({
        additions: {},
        removals: {},
        modified: {}
    });
function createPublisher(param) {
    let { registry, callbacks } = param;
    let staging = clean$1();
    let frameId = null;
    const collect = ()=>{
        if (frameId) {
            return;
        }
        callbacks.collectionStarting();
        frameId = requestAnimationFrame(()=>{
            frameId = null;
            start();
            const { additions, removals, modified } = staging;
            const added = Object.keys(additions).map((id)=>registry.draggable.getById(id).getDimension(origin)).sort((a, b)=>a.descriptor.index - b.descriptor.index);
            const updated = Object.keys(modified).map((id)=>{
                const entry = registry.droppable.getById(id);
                const scroll = entry.callbacks.getScrollWhileDragging();
                return {
                    droppableId: id,
                    scroll
                };
            });
            const result = {
                additions: added,
                removals: Object.keys(removals),
                modified: updated
            };
            staging = clean$1();
            finish();
            callbacks.publish(result);
        });
    };
    const add = (entry)=>{
        const id = entry.descriptor.id;
        staging.additions[id] = entry;
        staging.modified[entry.descriptor.droppableId] = true;
        if (staging.removals[id]) {
            delete staging.removals[id];
        }
        collect();
    };
    const remove = (entry)=>{
        const descriptor = entry.descriptor;
        staging.removals[descriptor.id] = true;
        staging.modified[descriptor.droppableId] = true;
        if (staging.additions[descriptor.id]) {
            delete staging.additions[descriptor.id];
        }
        collect();
    };
    const stop = ()=>{
        if (!frameId) {
            return;
        }
        cancelAnimationFrame(frameId);
        frameId = null;
        staging = clean$1();
    };
    return {
        add,
        remove,
        stop
    };
}
var getMaxScroll = (param)=>{
    let { scrollHeight, scrollWidth, height, width } = param;
    const maxScroll = subtract({
        x: scrollWidth,
        y: scrollHeight
    }, {
        x: width,
        y: height
    });
    const adjustedMaxScroll = {
        x: Math.max(0, maxScroll.x),
        y: Math.max(0, maxScroll.y)
    };
    return adjustedMaxScroll;
};
var getDocumentElement = ()=>{
    const doc = document.documentElement;
    !doc ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot find document.documentElement') : "TURBOPACK unreachable" : void 0;
    return doc;
};
var getMaxWindowScroll = ()=>{
    const doc = getDocumentElement();
    const maxScroll = getMaxScroll({
        scrollHeight: doc.scrollHeight,
        scrollWidth: doc.scrollWidth,
        width: doc.clientWidth,
        height: doc.clientHeight
    });
    return maxScroll;
};
var getViewport = ()=>{
    const scroll = getWindowScroll();
    const maxScroll = getMaxWindowScroll();
    const top = scroll.y;
    const left = scroll.x;
    const doc = getDocumentElement();
    const width = doc.clientWidth;
    const height = doc.clientHeight;
    const right = left + width;
    const bottom = top + height;
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])({
        top,
        left,
        right,
        bottom
    });
    const viewport = {
        frame,
        scroll: {
            initial: scroll,
            current: scroll,
            max: maxScroll,
            diff: {
                value: origin,
                displacement: origin
            }
        }
    };
    return viewport;
};
var getInitialPublish = (param)=>{
    let { critical, scrollOptions, registry } = param;
    start();
    const viewport = getViewport();
    const windowScroll = viewport.scroll.current;
    const home = critical.droppable;
    const droppables = registry.droppable.getAllByType(home.type).map((entry)=>entry.callbacks.getDimensionAndWatchScroll(windowScroll, scrollOptions));
    const draggables = registry.draggable.getAllByType(critical.draggable.type).map((entry)=>entry.getDimension(windowScroll));
    const dimensions = {
        draggables: toDraggableMap(draggables),
        droppables: toDroppableMap(droppables)
    };
    finish();
    const result = {
        dimensions,
        critical,
        viewport
    };
    return result;
};
function shouldPublishUpdate(registry, dragging, entry) {
    if (entry.descriptor.id === dragging.id) {
        return false;
    }
    if (entry.descriptor.type !== dragging.type) {
        return false;
    }
    const home = registry.droppable.getById(entry.descriptor.droppableId);
    if (home.descriptor.mode !== 'virtual') {
        ("TURBOPACK compile-time truthy", 1) ? warning("\n      You are attempting to add or remove a Draggable [id: ".concat(entry.descriptor.id, "]\n      while a drag is occurring. This is only supported for virtual lists.\n\n      See https://github.com/hello-pangea/dnd/blob/main/docs/patterns/virtual-lists.md\n    ")) : "TURBOPACK unreachable";
        return false;
    }
    return true;
}
var createDimensionMarshal = (registry, callbacks)=>{
    let collection = null;
    const publisher = createPublisher({
        callbacks: {
            publish: callbacks.publishWhileDragging,
            collectionStarting: callbacks.collectionStarting
        },
        registry
    });
    const updateDroppableIsEnabled = (id, isEnabled)=>{
        !registry.droppable.exists(id) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot update is enabled flag of Droppable ".concat(id, " as it is not registered")) : "TURBOPACK unreachable" : void 0;
        if (!collection) {
            return;
        }
        callbacks.updateDroppableIsEnabled({
            id,
            isEnabled
        });
    };
    const updateDroppableIsCombineEnabled = (id, isCombineEnabled)=>{
        if (!collection) {
            return;
        }
        !registry.droppable.exists(id) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot update isCombineEnabled flag of Droppable ".concat(id, " as it is not registered")) : "TURBOPACK unreachable" : void 0;
        callbacks.updateDroppableIsCombineEnabled({
            id,
            isCombineEnabled
        });
    };
    const updateDroppableScroll = (id, newScroll)=>{
        if (!collection) {
            return;
        }
        !registry.droppable.exists(id) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot update the scroll on Droppable ".concat(id, " as it is not registered")) : "TURBOPACK unreachable" : void 0;
        callbacks.updateDroppableScroll({
            id,
            newScroll
        });
    };
    const scrollDroppable = (id, change)=>{
        if (!collection) {
            return;
        }
        registry.droppable.getById(id).callbacks.scroll(change);
    };
    const stopPublishing = ()=>{
        if (!collection) {
            return;
        }
        publisher.stop();
        const home = collection.critical.droppable;
        registry.droppable.getAllByType(home.type).forEach((entry)=>entry.callbacks.dragStopped());
        collection.unsubscribe();
        collection = null;
    };
    const subscriber = (event)=>{
        !collection ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Should only be subscribed when a collection is occurring') : "TURBOPACK unreachable" : void 0;
        const dragging = collection.critical.draggable;
        if (event.type === 'ADDITION') {
            if (shouldPublishUpdate(registry, dragging, event.value)) {
                publisher.add(event.value);
            }
        }
        if (event.type === 'REMOVAL') {
            if (shouldPublishUpdate(registry, dragging, event.value)) {
                publisher.remove(event.value);
            }
        }
    };
    const startPublishing = (request)=>{
        !!collection ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot start capturing critical dimensions as there is already a collection') : "TURBOPACK unreachable" : void 0;
        const entry = registry.draggable.getById(request.draggableId);
        const home = registry.droppable.getById(entry.descriptor.droppableId);
        const critical = {
            draggable: entry.descriptor,
            droppable: home.descriptor
        };
        const unsubscribe = registry.subscribe(subscriber);
        collection = {
            critical,
            unsubscribe
        };
        return getInitialPublish({
            critical,
            registry,
            scrollOptions: request.scrollOptions
        });
    };
    const marshal = {
        updateDroppableIsEnabled,
        updateDroppableIsCombineEnabled,
        scrollDroppable,
        updateDroppableScroll,
        startPublishing,
        stopPublishing
    };
    return marshal;
};
var canStartDrag = (state, id)=>{
    if (state.phase === 'IDLE') {
        return true;
    }
    if (state.phase !== 'DROP_ANIMATING') {
        return false;
    }
    if (state.completed.result.draggableId === id) {
        return false;
    }
    return state.completed.result.reason === 'DROP';
};
var scrollWindow = (change)=>{
    window.scrollBy(change.x, change.y);
};
const getScrollableDroppables = memoizeOne((droppables)=>toDroppableList(droppables).filter((droppable)=>{
        if (!droppable.isEnabled) {
            return false;
        }
        if (!droppable.frame) {
            return false;
        }
        return true;
    }));
const getScrollableDroppableOver = (target, droppables)=>{
    const maybe = getScrollableDroppables(droppables).find((droppable)=>{
        !droppable.frame ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Invalid result') : "TURBOPACK unreachable" : void 0;
        return isPositionInFrame(droppable.frame.pageMarginBox)(target);
    }) || null;
    return maybe;
};
var getBestScrollableDroppable = (param)=>{
    let { center, destination, droppables } = param;
    if (destination) {
        const dimension = droppables[destination];
        if (!dimension.frame) {
            return null;
        }
        return dimension;
    }
    const dimension = getScrollableDroppableOver(center, droppables);
    return dimension;
};
const defaultAutoScrollerOptions = {
    startFromPercentage: 0.25,
    maxScrollAtPercentage: 0.05,
    maxPixelScroll: 28,
    ease: (percentage)=>percentage ** 2,
    durationDampening: {
        stopDampeningAt: 1200,
        accelerateAt: 360
    },
    disabled: false
};
var getDistanceThresholds = function(container, axis) {
    let getAutoScrollerOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ()=>defaultAutoScrollerOptions;
    const autoScrollerOptions = getAutoScrollerOptions();
    const startScrollingFrom = container[axis.size] * autoScrollerOptions.startFromPercentage;
    const maxScrollValueAt = container[axis.size] * autoScrollerOptions.maxScrollAtPercentage;
    const thresholds = {
        startScrollingFrom,
        maxScrollValueAt
    };
    return thresholds;
};
var getPercentage = (param)=>{
    let { startOfRange, endOfRange, current } = param;
    const range = endOfRange - startOfRange;
    if (range === 0) {
        ("TURBOPACK compile-time truthy", 1) ? warning("\n      Detected distance range of 0 in the fluid auto scroller\n      This is unexpected and would cause a divide by 0 issue.\n      Not allowing an auto scroll\n    ") : "TURBOPACK unreachable";
        return 0;
    }
    const currentInRange = current - startOfRange;
    const percentage = currentInRange / range;
    return percentage;
};
var minScroll = 1;
var getValueFromDistance = function(distanceToEdge, thresholds) {
    let getAutoScrollerOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ()=>defaultAutoScrollerOptions;
    const autoScrollerOptions = getAutoScrollerOptions();
    if (distanceToEdge > thresholds.startScrollingFrom) {
        return 0;
    }
    if (distanceToEdge <= thresholds.maxScrollValueAt) {
        return autoScrollerOptions.maxPixelScroll;
    }
    if (distanceToEdge === thresholds.startScrollingFrom) {
        return minScroll;
    }
    const percentageFromMaxScrollValueAt = getPercentage({
        startOfRange: thresholds.maxScrollValueAt,
        endOfRange: thresholds.startScrollingFrom,
        current: distanceToEdge
    });
    const percentageFromStartScrollingFrom = 1 - percentageFromMaxScrollValueAt;
    const scroll = autoScrollerOptions.maxPixelScroll * autoScrollerOptions.ease(percentageFromStartScrollingFrom);
    return Math.ceil(scroll);
};
var dampenValueByTime = (proposedScroll, dragStartTime, getAutoScrollerOptions)=>{
    const autoScrollerOptions = getAutoScrollerOptions();
    const accelerateAt = autoScrollerOptions.durationDampening.accelerateAt;
    const stopAt = autoScrollerOptions.durationDampening.stopDampeningAt;
    const startOfRange = dragStartTime;
    const endOfRange = stopAt;
    const now = Date.now();
    const runTime = now - startOfRange;
    if (runTime >= stopAt) {
        return proposedScroll;
    }
    if (runTime < accelerateAt) {
        return minScroll;
    }
    const betweenAccelerateAtAndStopAtPercentage = getPercentage({
        startOfRange: accelerateAt,
        endOfRange,
        current: runTime
    });
    const scroll = proposedScroll * autoScrollerOptions.ease(betweenAccelerateAtAndStopAtPercentage);
    return Math.ceil(scroll);
};
var getValue = (param)=>{
    let { distanceToEdge, thresholds, dragStartTime, shouldUseTimeDampening, getAutoScrollerOptions } = param;
    const scroll = getValueFromDistance(distanceToEdge, thresholds, getAutoScrollerOptions);
    if (scroll === 0) {
        return 0;
    }
    if (!shouldUseTimeDampening) {
        return scroll;
    }
    return Math.max(dampenValueByTime(scroll, dragStartTime, getAutoScrollerOptions), minScroll);
};
var getScrollOnAxis = (param)=>{
    let { container, distanceToEdges, dragStartTime, axis, shouldUseTimeDampening, getAutoScrollerOptions } = param;
    const thresholds = getDistanceThresholds(container, axis, getAutoScrollerOptions);
    const isCloserToEnd = distanceToEdges[axis.end] < distanceToEdges[axis.start];
    if (isCloserToEnd) {
        return getValue({
            distanceToEdge: distanceToEdges[axis.end],
            thresholds,
            dragStartTime,
            shouldUseTimeDampening,
            getAutoScrollerOptions
        });
    }
    return -1 * getValue({
        distanceToEdge: distanceToEdges[axis.start],
        thresholds,
        dragStartTime,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
};
var adjustForSizeLimits = (param)=>{
    let { container, subject, proposedScroll } = param;
    const isTooBigVertically = subject.height > container.height;
    const isTooBigHorizontally = subject.width > container.width;
    if (!isTooBigHorizontally && !isTooBigVertically) {
        return proposedScroll;
    }
    if (isTooBigHorizontally && isTooBigVertically) {
        return null;
    }
    return {
        x: isTooBigHorizontally ? 0 : proposedScroll.x,
        y: isTooBigVertically ? 0 : proposedScroll.y
    };
};
const clean = apply((value)=>value === 0 ? 0 : value);
var getScroll$1 = (param)=>{
    let { dragStartTime, container, subject, center, shouldUseTimeDampening, getAutoScrollerOptions } = param;
    const distanceToEdges = {
        top: center.y - container.top,
        right: container.right - center.x,
        bottom: container.bottom - center.y,
        left: center.x - container.left
    };
    const y = getScrollOnAxis({
        container,
        distanceToEdges,
        dragStartTime,
        axis: vertical,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
    const x = getScrollOnAxis({
        container,
        distanceToEdges,
        dragStartTime,
        axis: horizontal,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
    const required = clean({
        x,
        y
    });
    if (isEqual$1(required, origin)) {
        return null;
    }
    const limited = adjustForSizeLimits({
        container,
        subject,
        proposedScroll: required
    });
    if (!limited) {
        return null;
    }
    return isEqual$1(limited, origin) ? null : limited;
};
const smallestSigned = apply((value)=>{
    if (value === 0) {
        return 0;
    }
    return value > 0 ? 1 : -1;
});
const getOverlap = (()=>{
    const getRemainder = (target, max)=>{
        if (target < 0) {
            return target;
        }
        if (target > max) {
            return target - max;
        }
        return 0;
    };
    return (param)=>{
        let { current, max, change } = param;
        const targetScroll = add(current, change);
        const overlap = {
            x: getRemainder(targetScroll.x, max.x),
            y: getRemainder(targetScroll.y, max.y)
        };
        if (isEqual$1(overlap, origin)) {
            return null;
        }
        return overlap;
    };
})();
const canPartiallyScroll = (param)=>{
    let { max: rawMax, current, change } = param;
    const max = {
        x: Math.max(current.x, rawMax.x),
        y: Math.max(current.y, rawMax.y)
    };
    const smallestChange = smallestSigned(change);
    const overlap = getOverlap({
        max,
        current,
        change: smallestChange
    });
    if (!overlap) {
        return true;
    }
    if (smallestChange.x !== 0 && overlap.x === 0) {
        return true;
    }
    if (smallestChange.y !== 0 && overlap.y === 0) {
        return true;
    }
    return false;
};
const canScrollWindow = (viewport, change)=>canPartiallyScroll({
        current: viewport.scroll.current,
        max: viewport.scroll.max,
        change
    });
const getWindowOverlap = (viewport, change)=>{
    if (!canScrollWindow(viewport, change)) {
        return null;
    }
    const max = viewport.scroll.max;
    const current = viewport.scroll.current;
    return getOverlap({
        current,
        max,
        change
    });
};
const canScrollDroppable = (droppable, change)=>{
    const frame = droppable.frame;
    if (!frame) {
        return false;
    }
    return canPartiallyScroll({
        current: frame.scroll.current,
        max: frame.scroll.max,
        change
    });
};
const getDroppableOverlap = (droppable, change)=>{
    const frame = droppable.frame;
    if (!frame) {
        return null;
    }
    if (!canScrollDroppable(droppable, change)) {
        return null;
    }
    return getOverlap({
        current: frame.scroll.current,
        max: frame.scroll.max,
        change
    });
};
var getWindowScrollChange = (param)=>{
    let { viewport, subject, center, dragStartTime, shouldUseTimeDampening, getAutoScrollerOptions } = param;
    const scroll = getScroll$1({
        dragStartTime,
        container: viewport.frame,
        subject,
        center,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
    return scroll && canScrollWindow(viewport, scroll) ? scroll : null;
};
var getDroppableScrollChange = (param)=>{
    let { droppable, subject, center, dragStartTime, shouldUseTimeDampening, getAutoScrollerOptions } = param;
    const frame = droppable.frame;
    if (!frame) {
        return null;
    }
    const scroll = getScroll$1({
        dragStartTime,
        container: frame.pageMarginBox,
        subject,
        center,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
    return scroll && canScrollDroppable(droppable, scroll) ? scroll : null;
};
var scroll = (param)=>{
    let { state, dragStartTime, shouldUseTimeDampening, scrollWindow, scrollDroppable, getAutoScrollerOptions } = param;
    const center = state.current.page.borderBoxCenter;
    const draggable = state.dimensions.draggables[state.critical.draggable.id];
    const subject = draggable.page.marginBox;
    if (state.isWindowScrollAllowed) {
        const viewport = state.viewport;
        const change = getWindowScrollChange({
            dragStartTime,
            viewport,
            subject,
            center,
            shouldUseTimeDampening,
            getAutoScrollerOptions
        });
        if (change) {
            scrollWindow(change);
            return;
        }
    }
    const droppable = getBestScrollableDroppable({
        center,
        destination: whatIsDraggedOver(state.impact),
        droppables: state.dimensions.droppables
    });
    if (!droppable) {
        return;
    }
    const change = getDroppableScrollChange({
        dragStartTime,
        droppable,
        subject,
        center,
        shouldUseTimeDampening,
        getAutoScrollerOptions
    });
    if (change) {
        scrollDroppable(droppable.descriptor.id, change);
    }
};
var createFluidScroller = (param)=>{
    let { scrollWindow, scrollDroppable, getAutoScrollerOptions = ()=>defaultAutoScrollerOptions } = param;
    const scheduleWindowScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(scrollWindow);
    const scheduleDroppableScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(scrollDroppable);
    let dragging = null;
    const tryScroll = (state)=>{
        !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot fluid scroll if not dragging') : "TURBOPACK unreachable" : void 0;
        const { shouldUseTimeDampening, dragStartTime } = dragging;
        scroll({
            state,
            scrollWindow: scheduleWindowScroll,
            scrollDroppable: scheduleDroppableScroll,
            dragStartTime,
            shouldUseTimeDampening,
            getAutoScrollerOptions
        });
    };
    const start$1 = (state)=>{
        start();
        !!dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot start auto scrolling when already started') : "TURBOPACK unreachable" : void 0;
        const dragStartTime = Date.now();
        let wasScrollNeeded = false;
        const fakeScrollCallback = ()=>{
            wasScrollNeeded = true;
        };
        scroll({
            state,
            dragStartTime: 0,
            shouldUseTimeDampening: false,
            scrollWindow: fakeScrollCallback,
            scrollDroppable: fakeScrollCallback,
            getAutoScrollerOptions
        });
        dragging = {
            dragStartTime,
            shouldUseTimeDampening: wasScrollNeeded
        };
        finish();
        if (wasScrollNeeded) {
            tryScroll(state);
        }
    };
    const stop = ()=>{
        if (!dragging) {
            return;
        }
        scheduleWindowScroll.cancel();
        scheduleDroppableScroll.cancel();
        dragging = null;
    };
    return {
        start: start$1,
        stop,
        scroll: tryScroll
    };
};
var createJumpScroller = (param)=>{
    let { move, scrollDroppable, scrollWindow } = param;
    const moveByOffset = (state, offset)=>{
        const client = add(state.current.client.selection, offset);
        move({
            client
        });
    };
    const scrollDroppableAsMuchAsItCan = (droppable, change)=>{
        if (!canScrollDroppable(droppable, change)) {
            return change;
        }
        const overlap = getDroppableOverlap(droppable, change);
        if (!overlap) {
            scrollDroppable(droppable.descriptor.id, change);
            return null;
        }
        const whatTheDroppableCanScroll = subtract(change, overlap);
        scrollDroppable(droppable.descriptor.id, whatTheDroppableCanScroll);
        const remainder = subtract(change, whatTheDroppableCanScroll);
        return remainder;
    };
    const scrollWindowAsMuchAsItCan = (isWindowScrollAllowed, viewport, change)=>{
        if (!isWindowScrollAllowed) {
            return change;
        }
        if (!canScrollWindow(viewport, change)) {
            return change;
        }
        const overlap = getWindowOverlap(viewport, change);
        if (!overlap) {
            scrollWindow(change);
            return null;
        }
        const whatTheWindowCanScroll = subtract(change, overlap);
        scrollWindow(whatTheWindowCanScroll);
        const remainder = subtract(change, whatTheWindowCanScroll);
        return remainder;
    };
    const jumpScroller = (state)=>{
        const request = state.scrollJumpRequest;
        if (!request) {
            return;
        }
        const destination = whatIsDraggedOver(state.impact);
        !destination ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot perform a jump scroll when there is no destination') : "TURBOPACK unreachable" : void 0;
        const droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimensions.droppables[destination], request);
        if (!droppableRemainder) {
            return;
        }
        const viewport = state.viewport;
        const windowRemainder = scrollWindowAsMuchAsItCan(state.isWindowScrollAllowed, viewport, droppableRemainder);
        if (!windowRemainder) {
            return;
        }
        moveByOffset(state, windowRemainder);
    };
    return jumpScroller;
};
var createAutoScroller = (param)=>{
    let { scrollDroppable, scrollWindow, move, getAutoScrollerOptions } = param;
    const fluidScroller = createFluidScroller({
        scrollWindow,
        scrollDroppable,
        getAutoScrollerOptions
    });
    const jumpScroll = createJumpScroller({
        move,
        scrollWindow,
        scrollDroppable
    });
    const scroll = (state)=>{
        const autoScrollerOptions = getAutoScrollerOptions();
        if (autoScrollerOptions.disabled || state.phase !== 'DRAGGING') {
            return;
        }
        if (state.movementMode === 'FLUID') {
            fluidScroller.scroll(state);
            return;
        }
        if (!state.scrollJumpRequest) {
            return;
        }
        jumpScroll(state);
    };
    const scroller = {
        scroll,
        start: fluidScroller.start,
        stop: fluidScroller.stop
    };
    return scroller;
};
const prefix = 'data-rfd';
const dragHandle = (()=>{
    const base = "".concat(prefix, "-drag-handle");
    return {
        base,
        draggableId: "".concat(base, "-draggable-id"),
        contextId: "".concat(base, "-context-id")
    };
})();
const draggable = (()=>{
    const base = "".concat(prefix, "-draggable");
    return {
        base,
        contextId: "".concat(base, "-context-id"),
        id: "".concat(base, "-id")
    };
})();
const droppable = (()=>{
    const base = "".concat(prefix, "-droppable");
    return {
        base,
        contextId: "".concat(base, "-context-id"),
        id: "".concat(base, "-id")
    };
})();
const scrollContainer = {
    contextId: "".concat(prefix, "-scroll-container-context-id")
};
const makeGetSelector = (context)=>(attribute)=>"[".concat(attribute, '="').concat(context, '"]');
const getStyles = (rules, property)=>rules.map((rule)=>{
        const value = rule.styles[property];
        if (!value) {
            return '';
        }
        return "".concat(rule.selector, " { ").concat(value, " }");
    }).join(' ');
const noPointerEvents = 'pointer-events: none;';
var getStyles$1 = (contextId)=>{
    const getSelector = makeGetSelector(contextId);
    const dragHandle$1 = (()=>{
        const grabCursor = "\n      cursor: -webkit-grab;\n      cursor: grab;\n    ";
        return {
            selector: getSelector(dragHandle.contextId),
            styles: {
                always: "\n          -webkit-touch-callout: none;\n          -webkit-tap-highlight-color: rgba(0,0,0,0);\n          touch-action: manipulation;\n        ",
                resting: grabCursor,
                dragging: noPointerEvents,
                dropAnimating: grabCursor
            }
        };
    })();
    const draggable$1 = (()=>{
        const transition = "\n      transition: ".concat(transitions.outOfTheWay, ";\n    ");
        return {
            selector: getSelector(draggable.contextId),
            styles: {
                dragging: transition,
                dropAnimating: transition,
                userCancel: transition
            }
        };
    })();
    const droppable$1 = {
        selector: getSelector(droppable.contextId),
        styles: {
            always: "overflow-anchor: none;"
        }
    };
    const body = {
        selector: 'body',
        styles: {
            dragging: "\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        overflow-anchor: none;\n      "
        }
    };
    const rules = [
        draggable$1,
        dragHandle$1,
        droppable$1,
        body
    ];
    return {
        always: getStyles(rules, 'always'),
        resting: getStyles(rules, 'resting'),
        dragging: getStyles(rules, 'dragging'),
        dropAnimating: getStyles(rules, 'dropAnimating'),
        userCancel: getStyles(rules, 'userCancel')
    };
};
const useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"];
const getHead = ()=>{
    const head = document.querySelector('head');
    !head ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot find the head to append a style to') : "TURBOPACK unreachable" : void 0;
    return head;
};
const createStyleEl = (nonce)=>{
    const el = document.createElement('style');
    if (nonce) {
        el.setAttribute('nonce', nonce);
    }
    el.type = 'text/css';
    return el;
};
function useStyleMarshal(contextId, nonce) {
    const styles = useMemo({
        "useStyleMarshal.useMemo[styles]": ()=>getStyles$1(contextId)
    }["useStyleMarshal.useMemo[styles]"], [
        contextId
    ]);
    const alwaysRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dynamicRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setDynamicStyle = useCallback(memoizeOne({
        "useStyleMarshal.useCallback[setDynamicStyle]": (proposed)=>{
            const el = dynamicRef.current;
            !el ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot set dynamic style element if it is not set') : "TURBOPACK unreachable" : void 0;
            el.textContent = proposed;
        }
    }["useStyleMarshal.useCallback[setDynamicStyle]"]), []);
    const setAlwaysStyle = useCallback({
        "useStyleMarshal.useCallback[setAlwaysStyle]": (proposed)=>{
            const el = alwaysRef.current;
            !el ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot set dynamic style element if it is not set') : "TURBOPACK unreachable" : void 0;
            el.textContent = proposed;
        }
    }["useStyleMarshal.useCallback[setAlwaysStyle]"], []);
    useIsomorphicLayoutEffect({
        "useStyleMarshal.useIsomorphicLayoutEffect": ()=>{
            !(!alwaysRef.current && !dynamicRef.current) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'style elements already mounted') : "TURBOPACK unreachable" : void 0;
            const always = createStyleEl(nonce);
            const dynamic = createStyleEl(nonce);
            alwaysRef.current = always;
            dynamicRef.current = dynamic;
            always.setAttribute("".concat(prefix, "-always"), contextId);
            dynamic.setAttribute("".concat(prefix, "-dynamic"), contextId);
            getHead().appendChild(always);
            getHead().appendChild(dynamic);
            setAlwaysStyle(styles.always);
            setDynamicStyle(styles.resting);
            return ({
                "useStyleMarshal.useIsomorphicLayoutEffect": ()=>{
                    const remove = {
                        "useStyleMarshal.useIsomorphicLayoutEffect.remove": (ref)=>{
                            const current = ref.current;
                            !current ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot unmount ref as it is not set') : "TURBOPACK unreachable" : void 0;
                            getHead().removeChild(current);
                            ref.current = null;
                        }
                    }["useStyleMarshal.useIsomorphicLayoutEffect.remove"];
                    remove(alwaysRef);
                    remove(dynamicRef);
                }
            })["useStyleMarshal.useIsomorphicLayoutEffect"];
        }
    }["useStyleMarshal.useIsomorphicLayoutEffect"], [
        nonce,
        setAlwaysStyle,
        setDynamicStyle,
        styles.always,
        styles.resting,
        contextId
    ]);
    const dragging = useCallback({
        "useStyleMarshal.useCallback[dragging]": ()=>setDynamicStyle(styles.dragging)
    }["useStyleMarshal.useCallback[dragging]"], [
        setDynamicStyle,
        styles.dragging
    ]);
    const dropping = useCallback({
        "useStyleMarshal.useCallback[dropping]": (reason)=>{
            if (reason === 'DROP') {
                setDynamicStyle(styles.dropAnimating);
                return;
            }
            setDynamicStyle(styles.userCancel);
        }
    }["useStyleMarshal.useCallback[dropping]"], [
        setDynamicStyle,
        styles.dropAnimating,
        styles.userCancel
    ]);
    const resting = useCallback({
        "useStyleMarshal.useCallback[resting]": ()=>{
            if (!dynamicRef.current) {
                return;
            }
            setDynamicStyle(styles.resting);
        }
    }["useStyleMarshal.useCallback[resting]"], [
        setDynamicStyle,
        styles.resting
    ]);
    const marshal = useMemo({
        "useStyleMarshal.useMemo[marshal]": ()=>({
                dragging,
                dropping,
                resting
            })
    }["useStyleMarshal.useMemo[marshal]"], [
        dragging,
        dropping,
        resting
    ]);
    return marshal;
}
function querySelectorAll(parentNode, selector) {
    return Array.from(parentNode.querySelectorAll(selector));
}
var getWindowFromEl = (el)=>{
    if (el && el.ownerDocument && el.ownerDocument.defaultView) {
        return el.ownerDocument.defaultView;
    }
    return window;
};
function isHtmlElement(el) {
    return el instanceof getWindowFromEl(el).HTMLElement;
}
function findDragHandle(contextId, draggableId) {
    const selector = "[".concat(dragHandle.contextId, '="').concat(contextId, '"]');
    const possible = querySelectorAll(document, selector);
    if (!possible.length) {
        ("TURBOPACK compile-time truthy", 1) ? warning('Unable to find any drag handles in the context "'.concat(contextId, '"')) : "TURBOPACK unreachable";
        return null;
    }
    const handle = possible.find((el)=>{
        return el.getAttribute(dragHandle.draggableId) === draggableId;
    });
    if (!handle) {
        ("TURBOPACK compile-time truthy", 1) ? warning('Unable to find drag handle with id "'.concat(draggableId, '" as no handle with a matching id was found')) : "TURBOPACK unreachable";
        return null;
    }
    if (!isHtmlElement(handle)) {
        ("TURBOPACK compile-time truthy", 1) ? warning('drag handle needs to be a HTMLElement') : "TURBOPACK unreachable";
        return null;
    }
    return handle;
}
function useFocusMarshal(contextId) {
    const entriesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const recordRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const restoreFocusFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const register = useCallback(function register(id, focus) {
        const entry = {
            id,
            focus
        };
        entriesRef.current[id] = entry;
        return function unregister() {
            const entries = entriesRef.current;
            const current = entries[id];
            if (current !== entry) {
                delete entries[id];
            }
        };
    }, []);
    const tryGiveFocus = useCallback(function tryGiveFocus(tryGiveFocusTo) {
        const handle = findDragHandle(contextId, tryGiveFocusTo);
        if (handle && handle !== document.activeElement) {
            handle.focus();
        }
    }, [
        contextId
    ]);
    const tryShiftRecord = useCallback(function tryShiftRecord(previous, redirectTo) {
        if (recordRef.current === previous) {
            recordRef.current = redirectTo;
        }
    }, []);
    const tryRestoreFocusRecorded = useCallback(function tryRestoreFocusRecorded() {
        if (restoreFocusFrameRef.current) {
            return;
        }
        if (!isMountedRef.current) {
            return;
        }
        restoreFocusFrameRef.current = requestAnimationFrame({
            "useFocusMarshal.useCallback[tryRestoreFocusRecorded].tryRestoreFocusRecorded": ()=>{
                restoreFocusFrameRef.current = null;
                const record = recordRef.current;
                if (record) {
                    tryGiveFocus(record);
                }
            }
        }["useFocusMarshal.useCallback[tryRestoreFocusRecorded].tryRestoreFocusRecorded"]);
    }, [
        tryGiveFocus
    ]);
    const tryRecordFocus = useCallback(function tryRecordFocus(id) {
        recordRef.current = null;
        const focused = document.activeElement;
        if (!focused) {
            return;
        }
        if (focused.getAttribute(dragHandle.draggableId) !== id) {
            return;
        }
        recordRef.current = id;
    }, []);
    useIsomorphicLayoutEffect({
        "useFocusMarshal.useIsomorphicLayoutEffect": ()=>{
            isMountedRef.current = true;
            return function clearFrameOnUnmount() {
                isMountedRef.current = false;
                const frameId = restoreFocusFrameRef.current;
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
            };
        }
    }["useFocusMarshal.useIsomorphicLayoutEffect"], []);
    const marshal = useMemo({
        "useFocusMarshal.useMemo[marshal]": ()=>({
                register,
                tryRecordFocus,
                tryRestoreFocusRecorded,
                tryShiftRecord
            })
    }["useFocusMarshal.useMemo[marshal]"], [
        register,
        tryRecordFocus,
        tryRestoreFocusRecorded,
        tryShiftRecord
    ]);
    return marshal;
}
function createRegistry() {
    const entries = {
        draggables: {},
        droppables: {}
    };
    const subscribers = [];
    function subscribe(cb) {
        subscribers.push(cb);
        return function unsubscribe() {
            const index = subscribers.indexOf(cb);
            if (index === -1) {
                return;
            }
            subscribers.splice(index, 1);
        };
    }
    function notify(event) {
        if (subscribers.length) {
            subscribers.forEach((cb)=>cb(event));
        }
    }
    function findDraggableById(id) {
        return entries.draggables[id] || null;
    }
    function getDraggableById(id) {
        const entry = findDraggableById(id);
        !entry ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot find draggable entry with id [".concat(id, "]")) : "TURBOPACK unreachable" : void 0;
        return entry;
    }
    const draggableAPI = {
        register: (entry)=>{
            entries.draggables[entry.descriptor.id] = entry;
            notify({
                type: 'ADDITION',
                value: entry
            });
        },
        update: (entry, last)=>{
            const current = entries.draggables[last.descriptor.id];
            if (!current) {
                return;
            }
            if (current.uniqueId !== entry.uniqueId) {
                return;
            }
            delete entries.draggables[last.descriptor.id];
            entries.draggables[entry.descriptor.id] = entry;
        },
        unregister: (entry)=>{
            const draggableId = entry.descriptor.id;
            const current = findDraggableById(draggableId);
            if (!current) {
                return;
            }
            if (entry.uniqueId !== current.uniqueId) {
                return;
            }
            delete entries.draggables[draggableId];
            if (entries.droppables[entry.descriptor.droppableId]) {
                notify({
                    type: 'REMOVAL',
                    value: entry
                });
            }
        },
        getById: getDraggableById,
        findById: findDraggableById,
        exists: (id)=>Boolean(findDraggableById(id)),
        getAllByType: (type)=>Object.values(entries.draggables).filter((entry)=>entry.descriptor.type === type)
    };
    function findDroppableById(id) {
        return entries.droppables[id] || null;
    }
    function getDroppableById(id) {
        const entry = findDroppableById(id);
        !entry ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot find droppable entry with id [".concat(id, "]")) : "TURBOPACK unreachable" : void 0;
        return entry;
    }
    const droppableAPI = {
        register: (entry)=>{
            entries.droppables[entry.descriptor.id] = entry;
        },
        unregister: (entry)=>{
            const current = findDroppableById(entry.descriptor.id);
            if (!current) {
                return;
            }
            if (entry.uniqueId !== current.uniqueId) {
                return;
            }
            delete entries.droppables[entry.descriptor.id];
        },
        getById: getDroppableById,
        findById: findDroppableById,
        exists: (id)=>Boolean(findDroppableById(id)),
        getAllByType: (type)=>Object.values(entries.droppables).filter((entry)=>entry.descriptor.type === type)
    };
    function clean() {
        entries.draggables = {};
        entries.droppables = {};
        subscribers.length = 0;
    }
    return {
        draggable: draggableAPI,
        droppable: droppableAPI,
        subscribe,
        clean
    };
}
function useRegistry() {
    const registry = useMemo(createRegistry, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRegistry.useEffect": ()=>{
            return function unmount() {
                registry.clean();
            };
        }
    }["useRegistry.useEffect"], [
        registry
    ]);
    return registry;
}
var StoreContext = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(null);
var getBodyElement = ()=>{
    const body = document.body;
    !body ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot find document.body') : "TURBOPACK unreachable" : void 0;
    return body;
};
const visuallyHidden = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    border: '0',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    'clip-path': 'inset(100%)'
};
const getId = (contextId)=>"rfd-announcement-".concat(contextId);
function useAnnouncer(contextId) {
    const id = useMemo({
        "useAnnouncer.useMemo[id]": ()=>getId(contextId)
    }["useAnnouncer.useMemo[id]"], [
        contextId
    ]);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(function setup() {
        const el = document.createElement('div');
        ref.current = el;
        el.id = id;
        el.setAttribute('aria-live', 'assertive');
        el.setAttribute('aria-atomic', 'true');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(el.style, visuallyHidden);
        getBodyElement().appendChild(el);
        return function cleanup() {
            setTimeout(function remove() {
                const body = getBodyElement();
                if (body.contains(el)) {
                    body.removeChild(el);
                }
                if (el === ref.current) {
                    ref.current = null;
                }
            });
        };
    }, [
        id
    ]);
    const announce = useCallback({
        "useAnnouncer.useCallback[announce]": (message)=>{
            const el = ref.current;
            if (el) {
                el.textContent = message;
                return;
            }
            ("TURBOPACK compile-time truthy", 1) ? warning('\n      A screen reader message was trying to be announced but it was unable to do so.\n      This can occur if you unmount your <DragDropContext /> in your onDragEnd.\n      Consider calling provided.announce() before the unmount so that the instruction will\n      not be lost for users relying on a screen reader.\n\n      Message not passed to screen reader:\n\n      "'.concat(message, '"\n    ')) : "TURBOPACK unreachable";
        }
    }["useAnnouncer.useCallback[announce]"], []);
    return announce;
}
const defaults = {
    separator: '::'
};
function useUniqueId(prefix) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaults;
    const id = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useId();
    return useMemo({
        "useUniqueId.useMemo": ()=>"".concat(prefix).concat(options.separator).concat(id)
    }["useUniqueId.useMemo"], [
        options.separator,
        prefix,
        id
    ]);
}
function getElementId(param) {
    let { contextId, uniqueId } = param;
    return "rfd-hidden-text-".concat(contextId, "-").concat(uniqueId);
}
function useHiddenTextElement(param) {
    let { contextId, text } = param;
    const uniqueId = useUniqueId('hidden-text', {
        separator: '-'
    });
    const id = useMemo({
        "useHiddenTextElement.useMemo[id]": ()=>getElementId({
                contextId,
                uniqueId
            })
    }["useHiddenTextElement.useMemo[id]"], [
        uniqueId,
        contextId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(function mount() {
        const el = document.createElement('div');
        el.id = id;
        el.textContent = text;
        el.style.display = 'none';
        getBodyElement().appendChild(el);
        return function unmount() {
            const body = getBodyElement();
            if (body.contains(el)) {
                body.removeChild(el);
            }
        };
    }, [
        id,
        text
    ]);
    return id;
}
var AppContext = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(null);
var peerDependencies = {
    react: "^18.0.0 || ^19.0.0"
};
const semver = /(\d+)\.(\d+)\.(\d+)/;
const getVersion = (value)=>{
    const result = semver.exec(value);
    !(result != null) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Unable to parse React version ".concat(value)) : "TURBOPACK unreachable" : void 0;
    const major = Number(result[1]);
    const minor = Number(result[2]);
    const patch = Number(result[3]);
    return {
        major,
        minor,
        patch,
        raw: value
    };
};
const isSatisfied = (expected, actual)=>{
    if (actual.major > expected.major) {
        return true;
    }
    if (actual.major < expected.major) {
        return false;
    }
    if (actual.minor > expected.minor) {
        return true;
    }
    if (actual.minor < expected.minor) {
        return false;
    }
    return actual.patch >= expected.patch;
};
var checkReactVersion = (peerDepValue, actualValue)=>{
    const peerDep = getVersion(peerDepValue);
    const actual = getVersion(actualValue);
    if (isSatisfied(peerDep, actual)) {
        return;
    }
    ("TURBOPACK compile-time truthy", 1) ? warning("\n    React version: [".concat(actual.raw, "]\n    does not satisfy expected peer dependency version: [").concat(peerDep.raw, "]\n\n    This can result in run time bugs, and even fatal crashes\n  ")) : "TURBOPACK unreachable";
};
const suffix = "\n  We expect a html5 doctype: <!doctype html>\n  This is to ensure consistent browser layout and measurement\n\n  More information: https://github.com/hello-pangea/dnd/blob/main/docs/guides/doctype.md\n";
var checkDoctype = (doc)=>{
    const doctype = doc.doctype;
    if (!doctype) {
        ("TURBOPACK compile-time truthy", 1) ? warning("\n      No <!doctype html> found.\n\n      ".concat(suffix, "\n    ")) : "TURBOPACK unreachable";
        return;
    }
    if (doctype.name.toLowerCase() !== 'html') {
        ("TURBOPACK compile-time truthy", 1) ? warning("\n      Unexpected <!doctype> found: (".concat(doctype.name, ")\n\n      ").concat(suffix, "\n    ")) : "TURBOPACK unreachable";
    }
    if (doctype.publicId !== '') {
        ("TURBOPACK compile-time truthy", 1) ? warning("\n      Unexpected <!doctype> publicId found: (".concat(doctype.publicId, ")\n      A html5 doctype does not have a publicId\n\n      ").concat(suffix, "\n    ")) : "TURBOPACK unreachable";
    }
};
function useDev(useHook) {
    if ("TURBOPACK compile-time truthy", 1) {
        useHook();
    }
}
function useDevSetupWarning(fn, inputs) {
    useDev({
        "useDevSetupWarning.useDev": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
                "useDevSetupWarning.useDev.useEffect": ()=>{
                    try {
                        fn();
                    } catch (e) {
                        error("\n          A setup problem was encountered.\n\n          > ".concat(e.message, "\n        "));
                    }
                }
            }["useDevSetupWarning.useDev.useEffect"], inputs);
        }
    }["useDevSetupWarning.useDev"]);
}
function useStartupValidation() {
    useDevSetupWarning({
        "useStartupValidation.useDevSetupWarning": ()=>{
            checkReactVersion(peerDependencies.react, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].version);
            checkDoctype(document);
        }
    }["useStartupValidation.useDevSetupWarning"], []);
}
function usePrevious(current) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(current);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePrevious.useEffect": ()=>{
            ref.current = current;
        }
    }["usePrevious.useEffect"]);
    return ref;
}
function create() {
    let lock = null;
    function isClaimed() {
        return Boolean(lock);
    }
    function isActive(value) {
        return value === lock;
    }
    function claim(abandon) {
        !!lock ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot claim lock as it is already claimed') : "TURBOPACK unreachable" : void 0;
        const newLock = {
            abandon
        };
        lock = newLock;
        return newLock;
    }
    function release() {
        !lock ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot release lock when there is no lock') : "TURBOPACK unreachable" : void 0;
        lock = null;
    }
    function tryAbandon() {
        if (lock) {
            lock.abandon();
            release();
        }
    }
    return {
        isClaimed,
        isActive,
        claim,
        release,
        tryAbandon
    };
}
function isDragging(state) {
    if (state.phase === 'IDLE' || state.phase === 'DROP_ANIMATING') {
        return false;
    }
    return state.isDragging;
}
const tab = 9;
const enter = 13;
const escape = 27;
const space = 32;
const pageUp = 33;
const pageDown = 34;
const end = 35;
const home = 36;
const arrowLeft = 37;
const arrowUp = 38;
const arrowRight = 39;
const arrowDown = 40;
const preventedKeys = {
    [enter]: true,
    [tab]: true
};
var preventStandardKeyEvents = (event)=>{
    if (preventedKeys[event.keyCode]) {
        event.preventDefault();
    }
};
const supportedEventName = (()=>{
    const base = 'visibilitychange';
    if (typeof document === 'undefined') {
        return base;
    }
    const candidates = [
        base,
        "ms".concat(base),
        "webkit".concat(base),
        "moz".concat(base),
        "o".concat(base)
    ];
    const supported = candidates.find((eventName)=>"on".concat(eventName) in document);
    return supported || base;
})();
const primaryButton = 0;
const sloppyClickThreshold = 5;
function isSloppyClickThresholdExceeded(original, current) {
    return Math.abs(current.x - original.x) >= sloppyClickThreshold || Math.abs(current.y - original.y) >= sloppyClickThreshold;
}
const idle$1 = {
    type: 'IDLE'
};
function getCaptureBindings(param) {
    let { cancel, completed, getPhase, setPhase } = param;
    return [
        {
            eventName: 'mousemove',
            fn: (event)=>{
                const { button, clientX, clientY } = event;
                if (button !== primaryButton) {
                    return;
                }
                const point = {
                    x: clientX,
                    y: clientY
                };
                const phase = getPhase();
                if (phase.type === 'DRAGGING') {
                    event.preventDefault();
                    phase.actions.move(point);
                    return;
                }
                !(phase.type === 'PENDING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot be IDLE') : "TURBOPACK unreachable" : void 0;
                const pending = phase.point;
                if (!isSloppyClickThresholdExceeded(pending, point)) {
                    return;
                }
                event.preventDefault();
                const actions = phase.actions.fluidLift(point);
                setPhase({
                    type: 'DRAGGING',
                    actions
                });
            }
        },
        {
            eventName: 'mouseup',
            fn: (event)=>{
                const phase = getPhase();
                if (phase.type !== 'DRAGGING') {
                    cancel();
                    return;
                }
                event.preventDefault();
                phase.actions.drop({
                    shouldBlockNextClick: true
                });
                completed();
            }
        },
        {
            eventName: 'mousedown',
            fn: (event)=>{
                if (getPhase().type === 'DRAGGING') {
                    event.preventDefault();
                }
                cancel();
            }
        },
        {
            eventName: 'keydown',
            fn: (event)=>{
                const phase = getPhase();
                if (phase.type === 'PENDING') {
                    cancel();
                    return;
                }
                if (event.keyCode === escape) {
                    event.preventDefault();
                    cancel();
                    return;
                }
                preventStandardKeyEvents(event);
            }
        },
        {
            eventName: 'resize',
            fn: cancel
        },
        {
            eventName: 'scroll',
            options: {
                passive: true,
                capture: false
            },
            fn: ()=>{
                if (getPhase().type === 'PENDING') {
                    cancel();
                }
            }
        },
        {
            eventName: 'webkitmouseforcedown',
            fn: (event)=>{
                const phase = getPhase();
                !(phase.type !== 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Unexpected phase') : "TURBOPACK unreachable" : void 0;
                if (phase.actions.shouldRespectForcePress()) {
                    cancel();
                    return;
                }
                event.preventDefault();
            }
        },
        {
            eventName: supportedEventName,
            fn: cancel
        }
    ];
}
function useMouseSensor(api) {
    const phaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(idle$1);
    const unbindEventsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(noop$2);
    const startCaptureBinding = useMemo({
        "useMouseSensor.useMemo[startCaptureBinding]": ()=>({
                eventName: 'mousedown',
                fn: function onMouseDown(event) {
                    if (event.defaultPrevented) {
                        return;
                    }
                    if (event.button !== primaryButton) {
                        return;
                    }
                    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                        return;
                    }
                    const draggableId = api.findClosestDraggableId(event);
                    if (!draggableId) {
                        return;
                    }
                    const actions = api.tryGetLock(draggableId, stop, {
                        sourceEvent: event
                    });
                    if (!actions) {
                        return;
                    }
                    event.preventDefault();
                    const point = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    unbindEventsRef.current();
                    startPendingDrag(actions, point);
                }
            })
    }["useMouseSensor.useMemo[startCaptureBinding]"], [
        api
    ]);
    const preventForcePressBinding = useMemo({
        "useMouseSensor.useMemo[preventForcePressBinding]": ()=>({
                eventName: 'webkitmouseforcewillbegin',
                fn: ({
                    "useMouseSensor.useMemo[preventForcePressBinding]": (event)=>{
                        if (event.defaultPrevented) {
                            return;
                        }
                        const id = api.findClosestDraggableId(event);
                        if (!id) {
                            return;
                        }
                        const options = api.findOptionsForDraggable(id);
                        if (!options) {
                            return;
                        }
                        if (options.shouldRespectForcePress) {
                            return;
                        }
                        if (!api.canGetLock(id)) {
                            return;
                        }
                        event.preventDefault();
                    }
                })["useMouseSensor.useMemo[preventForcePressBinding]"]
            })
    }["useMouseSensor.useMemo[preventForcePressBinding]"], [
        api
    ]);
    const listenForCapture = useCallback(function listenForCapture() {
        const options = {
            passive: false,
            capture: true
        };
        unbindEventsRef.current = bindEvents(window, [
            preventForcePressBinding,
            startCaptureBinding
        ], options);
    }, [
        preventForcePressBinding,
        startCaptureBinding
    ]);
    const stop = useCallback({
        "useMouseSensor.useCallback[stop]": ()=>{
            const current = phaseRef.current;
            if (current.type === 'IDLE') {
                return;
            }
            phaseRef.current = idle$1;
            unbindEventsRef.current();
            listenForCapture();
        }
    }["useMouseSensor.useCallback[stop]"], [
        listenForCapture
    ]);
    const cancel = useCallback({
        "useMouseSensor.useCallback[cancel]": ()=>{
            const phase = phaseRef.current;
            stop();
            if (phase.type === 'DRAGGING') {
                phase.actions.cancel({
                    shouldBlockNextClick: true
                });
            }
            if (phase.type === 'PENDING') {
                phase.actions.abort();
            }
        }
    }["useMouseSensor.useCallback[cancel]"], [
        stop
    ]);
    const bindCapturingEvents = useCallback(function bindCapturingEvents() {
        const options = {
            capture: true,
            passive: false
        };
        const bindings = getCaptureBindings({
            cancel,
            completed: stop,
            getPhase: {
                "useMouseSensor.useCallback[bindCapturingEvents].bindCapturingEvents.bindings": ()=>phaseRef.current
            }["useMouseSensor.useCallback[bindCapturingEvents].bindCapturingEvents.bindings"],
            setPhase: {
                "useMouseSensor.useCallback[bindCapturingEvents].bindCapturingEvents.bindings": (phase)=>{
                    phaseRef.current = phase;
                }
            }["useMouseSensor.useCallback[bindCapturingEvents].bindCapturingEvents.bindings"]
        });
        unbindEventsRef.current = bindEvents(window, bindings, options);
    }, [
        cancel,
        stop
    ]);
    const startPendingDrag = useCallback(function startPendingDrag(actions, point) {
        !(phaseRef.current.type === 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected to move from IDLE to PENDING drag') : "TURBOPACK unreachable" : void 0;
        phaseRef.current = {
            type: 'PENDING',
            point,
            actions
        };
        bindCapturingEvents();
    }, [
        bindCapturingEvents
    ]);
    useIsomorphicLayoutEffect(function mount() {
        listenForCapture();
        return function unmount() {
            unbindEventsRef.current();
        };
    }, [
        listenForCapture
    ]);
}
function noop$1() {}
const scrollJumpKeys = {
    [pageDown]: true,
    [pageUp]: true,
    [home]: true,
    [end]: true
};
function getDraggingBindings(actions, stop) {
    function cancel() {
        stop();
        actions.cancel();
    }
    function drop() {
        stop();
        actions.drop();
    }
    return [
        {
            eventName: 'keydown',
            fn: (event)=>{
                if (event.keyCode === escape) {
                    event.preventDefault();
                    cancel();
                    return;
                }
                if (event.keyCode === space) {
                    event.preventDefault();
                    drop();
                    return;
                }
                if (event.keyCode === arrowDown) {
                    event.preventDefault();
                    actions.moveDown();
                    return;
                }
                if (event.keyCode === arrowUp) {
                    event.preventDefault();
                    actions.moveUp();
                    return;
                }
                if (event.keyCode === arrowRight) {
                    event.preventDefault();
                    actions.moveRight();
                    return;
                }
                if (event.keyCode === arrowLeft) {
                    event.preventDefault();
                    actions.moveLeft();
                    return;
                }
                if (scrollJumpKeys[event.keyCode]) {
                    event.preventDefault();
                    return;
                }
                preventStandardKeyEvents(event);
            }
        },
        {
            eventName: 'mousedown',
            fn: cancel
        },
        {
            eventName: 'mouseup',
            fn: cancel
        },
        {
            eventName: 'click',
            fn: cancel
        },
        {
            eventName: 'touchstart',
            fn: cancel
        },
        {
            eventName: 'resize',
            fn: cancel
        },
        {
            eventName: 'wheel',
            fn: cancel,
            options: {
                passive: true
            }
        },
        {
            eventName: supportedEventName,
            fn: cancel
        }
    ];
}
function useKeyboardSensor(api) {
    const unbindEventsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(noop$1);
    const startCaptureBinding = useMemo({
        "useKeyboardSensor.useMemo[startCaptureBinding]": ()=>({
                eventName: 'keydown',
                fn: function onKeyDown(event) {
                    if (event.defaultPrevented) {
                        return;
                    }
                    if (event.keyCode !== space) {
                        return;
                    }
                    const draggableId = api.findClosestDraggableId(event);
                    if (!draggableId) {
                        return;
                    }
                    const preDrag = api.tryGetLock(draggableId, stop, {
                        sourceEvent: event
                    });
                    if (!preDrag) {
                        return;
                    }
                    event.preventDefault();
                    let isCapturing = true;
                    const actions = preDrag.snapLift();
                    unbindEventsRef.current();
                    function stop() {
                        !isCapturing ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot stop capturing a keyboard drag when not capturing') : "TURBOPACK unreachable" : void 0;
                        isCapturing = false;
                        unbindEventsRef.current();
                        listenForCapture();
                    }
                    unbindEventsRef.current = bindEvents(window, getDraggingBindings(actions, stop), {
                        capture: true,
                        passive: false
                    });
                }
            })
    }["useKeyboardSensor.useMemo[startCaptureBinding]"], [
        api
    ]);
    const listenForCapture = useCallback(function tryStartCapture() {
        const options = {
            passive: false,
            capture: true
        };
        unbindEventsRef.current = bindEvents(window, [
            startCaptureBinding
        ], options);
    }, [
        startCaptureBinding
    ]);
    useIsomorphicLayoutEffect(function mount() {
        listenForCapture();
        return function unmount() {
            unbindEventsRef.current();
        };
    }, [
        listenForCapture
    ]);
}
const idle = {
    type: 'IDLE'
};
const timeForLongPress = 120;
const forcePressThreshold = 0.15;
function getWindowBindings(param) {
    let { cancel, getPhase } = param;
    return [
        {
            eventName: 'orientationchange',
            fn: cancel
        },
        {
            eventName: 'resize',
            fn: cancel
        },
        {
            eventName: 'contextmenu',
            fn: (event)=>{
                event.preventDefault();
            }
        },
        {
            eventName: 'keydown',
            fn: (event)=>{
                if (getPhase().type !== 'DRAGGING') {
                    cancel();
                    return;
                }
                if (event.keyCode === escape) {
                    event.preventDefault();
                }
                cancel();
            }
        },
        {
            eventName: supportedEventName,
            fn: cancel
        }
    ];
}
function getHandleBindings(param) {
    let { cancel, completed, getPhase } = param;
    return [
        {
            eventName: 'touchmove',
            options: {
                capture: false
            },
            fn: (event)=>{
                const phase = getPhase();
                if (phase.type !== 'DRAGGING') {
                    cancel();
                    return;
                }
                phase.hasMoved = true;
                const { clientX, clientY } = event.touches[0];
                const point = {
                    x: clientX,
                    y: clientY
                };
                event.preventDefault();
                phase.actions.move(point);
            }
        },
        {
            eventName: 'touchend',
            fn: (event)=>{
                const phase = getPhase();
                if (phase.type !== 'DRAGGING') {
                    cancel();
                    return;
                }
                event.preventDefault();
                phase.actions.drop({
                    shouldBlockNextClick: true
                });
                completed();
            }
        },
        {
            eventName: 'touchcancel',
            fn: (event)=>{
                if (getPhase().type !== 'DRAGGING') {
                    cancel();
                    return;
                }
                event.preventDefault();
                cancel();
            }
        },
        {
            eventName: 'touchforcechange',
            fn: (event)=>{
                const phase = getPhase();
                !(phase.type !== 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant() : "TURBOPACK unreachable" : void 0;
                const touch = event.touches[0];
                if (!touch) {
                    return;
                }
                const isForcePress = touch.force >= forcePressThreshold;
                if (!isForcePress) {
                    return;
                }
                const shouldRespect = phase.actions.shouldRespectForcePress();
                if (phase.type === 'PENDING') {
                    if (shouldRespect) {
                        cancel();
                    }
                    return;
                }
                if (shouldRespect) {
                    if (phase.hasMoved) {
                        event.preventDefault();
                        return;
                    }
                    cancel();
                    return;
                }
                event.preventDefault();
            }
        },
        {
            eventName: supportedEventName,
            fn: cancel
        }
    ];
}
function useTouchSensor(api) {
    const phaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(idle);
    const unbindEventsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(noop$2);
    const getPhase = useCallback(function getPhase() {
        return phaseRef.current;
    }, []);
    const setPhase = useCallback(function setPhase(phase) {
        phaseRef.current = phase;
    }, []);
    const startCaptureBinding = useMemo({
        "useTouchSensor.useMemo[startCaptureBinding]": ()=>({
                eventName: 'touchstart',
                fn: function onTouchStart(event) {
                    if (event.defaultPrevented) {
                        return;
                    }
                    const draggableId = api.findClosestDraggableId(event);
                    if (!draggableId) {
                        return;
                    }
                    const actions = api.tryGetLock(draggableId, stop, {
                        sourceEvent: event
                    });
                    if (!actions) {
                        return;
                    }
                    const touch = event.touches[0];
                    const { clientX, clientY } = touch;
                    const point = {
                        x: clientX,
                        y: clientY
                    };
                    unbindEventsRef.current();
                    startPendingDrag(actions, point);
                }
            })
    }["useTouchSensor.useMemo[startCaptureBinding]"], [
        api
    ]);
    const listenForCapture = useCallback(function listenForCapture() {
        const options = {
            capture: true,
            passive: false
        };
        unbindEventsRef.current = bindEvents(window, [
            startCaptureBinding
        ], options);
    }, [
        startCaptureBinding
    ]);
    const stop = useCallback({
        "useTouchSensor.useCallback[stop]": ()=>{
            const current = phaseRef.current;
            if (current.type === 'IDLE') {
                return;
            }
            if (current.type === 'PENDING') {
                clearTimeout(current.longPressTimerId);
            }
            setPhase(idle);
            unbindEventsRef.current();
            listenForCapture();
        }
    }["useTouchSensor.useCallback[stop]"], [
        listenForCapture,
        setPhase
    ]);
    const cancel = useCallback({
        "useTouchSensor.useCallback[cancel]": ()=>{
            const phase = phaseRef.current;
            stop();
            if (phase.type === 'DRAGGING') {
                phase.actions.cancel({
                    shouldBlockNextClick: true
                });
            }
            if (phase.type === 'PENDING') {
                phase.actions.abort();
            }
        }
    }["useTouchSensor.useCallback[cancel]"], [
        stop
    ]);
    const bindCapturingEvents = useCallback(function bindCapturingEvents() {
        const options = {
            capture: true,
            passive: false
        };
        const args = {
            cancel,
            completed: stop,
            getPhase
        };
        const unbindTarget = bindEvents(window, getHandleBindings(args), options);
        const unbindWindow = bindEvents(window, getWindowBindings(args), options);
        unbindEventsRef.current = function unbindAll() {
            unbindTarget();
            unbindWindow();
        };
    }, [
        cancel,
        getPhase,
        stop
    ]);
    const startDragging = useCallback(function startDragging() {
        const phase = getPhase();
        !(phase.type === 'PENDING') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot start dragging from phase ".concat(phase.type)) : "TURBOPACK unreachable" : void 0;
        const actions = phase.actions.fluidLift(phase.point);
        setPhase({
            type: 'DRAGGING',
            actions,
            hasMoved: false
        });
    }, [
        getPhase,
        setPhase
    ]);
    const startPendingDrag = useCallback(function startPendingDrag(actions, point) {
        !(getPhase().type === 'IDLE') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected to move from IDLE to PENDING drag') : "TURBOPACK unreachable" : void 0;
        const longPressTimerId = setTimeout(startDragging, timeForLongPress);
        setPhase({
            type: 'PENDING',
            point,
            actions,
            longPressTimerId
        });
        bindCapturingEvents();
    }, [
        bindCapturingEvents,
        getPhase,
        setPhase,
        startDragging
    ]);
    useIsomorphicLayoutEffect(function mount() {
        listenForCapture();
        return function unmount() {
            unbindEventsRef.current();
            const phase = getPhase();
            if (phase.type === 'PENDING') {
                clearTimeout(phase.longPressTimerId);
                setPhase(idle);
            }
        };
    }, [
        getPhase,
        listenForCapture,
        setPhase
    ]);
    useIsomorphicLayoutEffect(function webkitHack() {
        const unbind = bindEvents(window, [
            {
                eventName: 'touchmove',
                fn: {
                    "useTouchSensor.useIsomorphicLayoutEffect.webkitHack.unbind": ()=>{}
                }["useTouchSensor.useIsomorphicLayoutEffect.webkitHack.unbind"],
                options: {
                    capture: false,
                    passive: false
                }
            }
        ]);
        return unbind;
    }, []);
}
function useValidateSensorHooks(sensorHooks) {
    useDev({
        "useValidateSensorHooks.useDev": ()=>{
            const previousRef = usePrevious(sensorHooks);
            useDevSetupWarning({
                "useValidateSensorHooks.useDev.useDevSetupWarning": ()=>{
                    !(previousRef.current.length === sensorHooks.length) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot change the amount of sensor hooks after mounting') : "TURBOPACK unreachable" : void 0;
                }
            }["useValidateSensorHooks.useDev.useDevSetupWarning"]);
        }
    }["useValidateSensorHooks.useDev"]);
}
const interactiveTagNames = [
    'input',
    'button',
    'textarea',
    'select',
    'option',
    'optgroup',
    'video',
    'audio'
];
function isAnInteractiveElement(parent, current) {
    if (current == null) {
        return false;
    }
    const hasAnInteractiveTag = interactiveTagNames.includes(current.tagName.toLowerCase());
    if (hasAnInteractiveTag) {
        return true;
    }
    const attribute = current.getAttribute('contenteditable');
    if (attribute === 'true' || attribute === '') {
        return true;
    }
    if (current === parent) {
        return false;
    }
    return isAnInteractiveElement(parent, current.parentElement);
}
function isEventInInteractiveElement(draggable, event) {
    const target = event.target;
    if (!isHtmlElement(target)) {
        return false;
    }
    return isAnInteractiveElement(draggable, target);
}
var getBorderBoxCenterPosition = (el)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRect"])(el.getBoundingClientRect()).center;
function isElement(el) {
    return el instanceof getWindowFromEl(el).Element;
}
const supportedMatchesName = (()=>{
    const base = 'matches';
    if (typeof document === 'undefined') {
        return base;
    }
    const candidates = [
        base,
        'msMatchesSelector',
        'webkitMatchesSelector'
    ];
    const value = candidates.find((name)=>name in Element.prototype);
    return value || base;
})();
function closestPonyfill(el, selector) {
    if (el == null) {
        return null;
    }
    if (el[supportedMatchesName](selector)) {
        return el;
    }
    return closestPonyfill(el.parentElement, selector);
}
function closest(el, selector) {
    if (el.closest) {
        return el.closest(selector);
    }
    return closestPonyfill(el, selector);
}
function getSelector(contextId) {
    return "[".concat(dragHandle.contextId, '="').concat(contextId, '"]');
}
function findClosestDragHandleFromEvent(contextId, event) {
    const target = event.target;
    if (!isElement(target)) {
        ("TURBOPACK compile-time truthy", 1) ? warning('event.target must be a Element') : "TURBOPACK unreachable";
        return null;
    }
    const selector = getSelector(contextId);
    const handle = closest(target, selector);
    if (!handle) {
        return null;
    }
    if (!isHtmlElement(handle)) {
        ("TURBOPACK compile-time truthy", 1) ? warning('drag handle must be a HTMLElement') : "TURBOPACK unreachable";
        return null;
    }
    return handle;
}
function tryGetClosestDraggableIdFromEvent(contextId, event) {
    const handle = findClosestDragHandleFromEvent(contextId, event);
    if (!handle) {
        return null;
    }
    return handle.getAttribute(dragHandle.draggableId);
}
function findDraggable(contextId, draggableId) {
    const selector = "[".concat(draggable.contextId, '="').concat(contextId, '"]');
    const possible = querySelectorAll(document, selector);
    const draggable$1 = possible.find((el)=>{
        return el.getAttribute(draggable.id) === draggableId;
    });
    if (!draggable$1) {
        return null;
    }
    if (!isHtmlElement(draggable$1)) {
        ("TURBOPACK compile-time truthy", 1) ? warning('Draggable element is not a HTMLElement') : "TURBOPACK unreachable";
        return null;
    }
    return draggable$1;
}
function preventDefault(event) {
    event.preventDefault();
}
function isActive(param) {
    let { expected, phase, isLockActive, shouldWarn } = param;
    if (!isLockActive()) {
        if (shouldWarn) {
            ("TURBOPACK compile-time truthy", 1) ? warning("\n        Cannot perform action.\n        The sensor no longer has an action lock.\n\n        Tips:\n\n        - Throw away your action handlers when forceStop() is called\n        - Check actions.isActive() if you really need to\n      ") : "TURBOPACK unreachable";
        }
        return false;
    }
    if (expected !== phase) {
        if (shouldWarn) {
            ("TURBOPACK compile-time truthy", 1) ? warning("\n        Cannot perform action.\n        The actions you used belong to an outdated phase\n\n        Current phase: ".concat(expected, "\n        You called an action from outdated phase: ").concat(phase, "\n\n        Tips:\n\n        - Do not use preDragActions actions after calling preDragActions.lift()\n      ")) : "TURBOPACK unreachable";
        }
        return false;
    }
    return true;
}
function canStart(param) {
    let { lockAPI, store, registry, draggableId } = param;
    if (lockAPI.isClaimed()) {
        return false;
    }
    const entry = registry.draggable.findById(draggableId);
    if (!entry) {
        ("TURBOPACK compile-time truthy", 1) ? warning("Unable to find draggable with id: ".concat(draggableId)) : "TURBOPACK unreachable";
        return false;
    }
    if (!entry.options.isEnabled) {
        return false;
    }
    if (!canStartDrag(store.getState(), draggableId)) {
        return false;
    }
    return true;
}
function tryStart(param) {
    let { lockAPI, contextId, store, registry, draggableId, forceSensorStop, sourceEvent } = param;
    const shouldStart = canStart({
        lockAPI,
        store,
        registry,
        draggableId
    });
    if (!shouldStart) {
        return null;
    }
    const entry = registry.draggable.getById(draggableId);
    const el = findDraggable(contextId, entry.descriptor.id);
    if (!el) {
        ("TURBOPACK compile-time truthy", 1) ? warning("Unable to find draggable element with id: ".concat(draggableId)) : "TURBOPACK unreachable";
        return null;
    }
    if (sourceEvent && !entry.options.canDragInteractiveElements && isEventInInteractiveElement(el, sourceEvent)) {
        return null;
    }
    const lock = lockAPI.claim(forceSensorStop || noop$2);
    let phase = 'PRE_DRAG';
    function getShouldRespectForcePress() {
        return entry.options.shouldRespectForcePress;
    }
    function isLockActive() {
        return lockAPI.isActive(lock);
    }
    function tryDispatch(expected, getAction) {
        if (isActive({
            expected,
            phase,
            isLockActive,
            shouldWarn: true
        })) {
            store.dispatch(getAction());
        }
    }
    const tryDispatchWhenDragging = tryDispatch.bind(null, 'DRAGGING');
    function lift(args) {
        function completed() {
            lockAPI.release();
            phase = 'COMPLETED';
        }
        if (phase !== 'PRE_DRAG') {
            completed();
            ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Cannot lift in phase ".concat(phase)) : "TURBOPACK unreachable";
        }
        store.dispatch(lift$1(args.liftActionArgs));
        phase = 'DRAGGING';
        function finish(reason) {
            let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                shouldBlockNextClick: false
            };
            args.cleanup();
            if (options.shouldBlockNextClick) {
                const unbind = bindEvents(window, [
                    {
                        eventName: 'click',
                        fn: preventDefault,
                        options: {
                            once: true,
                            passive: false,
                            capture: true
                        }
                    }
                ]);
                setTimeout(unbind);
            }
            completed();
            store.dispatch(drop({
                reason
            }));
        }
        return {
            isActive: ()=>isActive({
                    expected: 'DRAGGING',
                    phase,
                    isLockActive,
                    shouldWarn: false
                }),
            shouldRespectForcePress: getShouldRespectForcePress,
            drop: (options)=>finish('DROP', options),
            cancel: (options)=>finish('CANCEL', options),
            ...args.actions
        };
    }
    function fluidLift(clientSelection) {
        const move$1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])((client)=>{
            tryDispatchWhenDragging(()=>move({
                    client
                }));
        });
        const api = lift({
            liftActionArgs: {
                id: draggableId,
                clientSelection,
                movementMode: 'FLUID'
            },
            cleanup: ()=>move$1.cancel(),
            actions: {
                move: move$1
            }
        });
        return {
            ...api,
            move: move$1
        };
    }
    function snapLift() {
        const actions = {
            moveUp: ()=>tryDispatchWhenDragging(moveUp),
            moveRight: ()=>tryDispatchWhenDragging(moveRight),
            moveDown: ()=>tryDispatchWhenDragging(moveDown),
            moveLeft: ()=>tryDispatchWhenDragging(moveLeft)
        };
        return lift({
            liftActionArgs: {
                id: draggableId,
                clientSelection: getBorderBoxCenterPosition(el),
                movementMode: 'SNAP'
            },
            cleanup: noop$2,
            actions
        });
    }
    function abortPreDrag() {
        const shouldRelease = isActive({
            expected: 'PRE_DRAG',
            phase,
            isLockActive,
            shouldWarn: true
        });
        if (shouldRelease) {
            lockAPI.release();
        }
    }
    const preDrag = {
        isActive: ()=>isActive({
                expected: 'PRE_DRAG',
                phase,
                isLockActive,
                shouldWarn: false
            }),
        shouldRespectForcePress: getShouldRespectForcePress,
        fluidLift,
        snapLift,
        abort: abortPreDrag
    };
    return preDrag;
}
const defaultSensors = [
    useMouseSensor,
    useKeyboardSensor,
    useTouchSensor
];
function useSensorMarshal(param) {
    let { contextId, store, registry, customSensors, enableDefaultSensors } = param;
    const useSensors = [
        ...enableDefaultSensors ? defaultSensors : [],
        ...customSensors || []
    ];
    const lockAPI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useSensorMarshal.useState": ()=>create()
    }["useSensorMarshal.useState"])[0];
    const tryAbandonLock = useCallback(function tryAbandonLock(previous, current) {
        if (isDragging(previous) && !isDragging(current)) {
            lockAPI.tryAbandon();
        }
    }, [
        lockAPI
    ]);
    useIsomorphicLayoutEffect(function listenToStore() {
        let previous = store.getState();
        const unsubscribe = store.subscribe({
            "useSensorMarshal.useIsomorphicLayoutEffect.listenToStore.unsubscribe": ()=>{
                const current = store.getState();
                tryAbandonLock(previous, current);
                previous = current;
            }
        }["useSensorMarshal.useIsomorphicLayoutEffect.listenToStore.unsubscribe"]);
        return unsubscribe;
    }, [
        lockAPI,
        store,
        tryAbandonLock
    ]);
    useIsomorphicLayoutEffect({
        "useSensorMarshal.useIsomorphicLayoutEffect": ()=>{
            return lockAPI.tryAbandon;
        }
    }["useSensorMarshal.useIsomorphicLayoutEffect"], [
        lockAPI.tryAbandon
    ]);
    const canGetLock = useCallback({
        "useSensorMarshal.useCallback[canGetLock]": (draggableId)=>{
            return canStart({
                lockAPI,
                registry,
                store,
                draggableId
            });
        }
    }["useSensorMarshal.useCallback[canGetLock]"], [
        lockAPI,
        registry,
        store
    ]);
    const tryGetLock = useCallback({
        "useSensorMarshal.useCallback[tryGetLock]": (draggableId, forceStop, options)=>tryStart({
                lockAPI,
                registry,
                contextId,
                store,
                draggableId,
                forceSensorStop: forceStop || null,
                sourceEvent: options && options.sourceEvent ? options.sourceEvent : null
            })
    }["useSensorMarshal.useCallback[tryGetLock]"], [
        contextId,
        lockAPI,
        registry,
        store
    ]);
    const findClosestDraggableId = useCallback({
        "useSensorMarshal.useCallback[findClosestDraggableId]": (event)=>tryGetClosestDraggableIdFromEvent(contextId, event)
    }["useSensorMarshal.useCallback[findClosestDraggableId]"], [
        contextId
    ]);
    const findOptionsForDraggable = useCallback({
        "useSensorMarshal.useCallback[findOptionsForDraggable]": (id)=>{
            const entry = registry.draggable.findById(id);
            return entry ? entry.options : null;
        }
    }["useSensorMarshal.useCallback[findOptionsForDraggable]"], [
        registry.draggable
    ]);
    const tryReleaseLock = useCallback(function tryReleaseLock() {
        if (!lockAPI.isClaimed()) {
            return;
        }
        lockAPI.tryAbandon();
        if (store.getState().phase !== 'IDLE') {
            store.dispatch(flush());
        }
    }, [
        lockAPI,
        store
    ]);
    const isLockClaimed = useCallback({
        "useSensorMarshal.useCallback[isLockClaimed]": ()=>lockAPI.isClaimed()
    }["useSensorMarshal.useCallback[isLockClaimed]"], [
        lockAPI
    ]);
    const api = useMemo({
        "useSensorMarshal.useMemo[api]": ()=>({
                canGetLock,
                tryGetLock,
                findClosestDraggableId,
                findOptionsForDraggable,
                tryReleaseLock,
                isLockClaimed
            })
    }["useSensorMarshal.useMemo[api]"], [
        canGetLock,
        tryGetLock,
        findClosestDraggableId,
        findOptionsForDraggable,
        tryReleaseLock,
        isLockClaimed
    ]);
    useValidateSensorHooks(useSensors);
    for(let i = 0; i < useSensors.length; i++){
        useSensors[i](api);
    }
}
const createResponders = (props)=>({
        onBeforeCapture: (t)=>{
            const onBeforeCapureCallback = ()=>{
                if (props.onBeforeCapture) {
                    props.onBeforeCapture(t);
                }
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"])(onBeforeCapureCallback);
        },
        onBeforeDragStart: props.onBeforeDragStart,
        onDragStart: props.onDragStart,
        onDragEnd: props.onDragEnd,
        onDragUpdate: props.onDragUpdate
    });
const createAutoScrollerOptions = (props)=>({
        ...defaultAutoScrollerOptions,
        ...props.autoScrollerOptions,
        durationDampening: {
            ...defaultAutoScrollerOptions.durationDampening,
            ...props.autoScrollerOptions
        }
    });
function getStore(lazyRef) {
    !lazyRef.current ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find store from lazy ref') : "TURBOPACK unreachable" : void 0;
    return lazyRef.current;
}
function App(props) {
    const { contextId, setCallbacks, sensors, nonce, dragHandleUsageInstructions } = props;
    const lazyStoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    useStartupValidation();
    const lastPropsRef = usePrevious(props);
    const getResponders = useCallback({
        "App.useCallback[getResponders]": ()=>{
            return createResponders(lastPropsRef.current);
        }
    }["App.useCallback[getResponders]"], [
        lastPropsRef
    ]);
    const getAutoScrollerOptions = useCallback({
        "App.useCallback[getAutoScrollerOptions]": ()=>{
            return createAutoScrollerOptions(lastPropsRef.current);
        }
    }["App.useCallback[getAutoScrollerOptions]"], [
        lastPropsRef
    ]);
    const announce = useAnnouncer(contextId);
    const dragHandleUsageInstructionsId = useHiddenTextElement({
        contextId,
        text: dragHandleUsageInstructions
    });
    const styleMarshal = useStyleMarshal(contextId, nonce);
    const lazyDispatch = useCallback({
        "App.useCallback[lazyDispatch]": (action)=>{
            getStore(lazyStoreRef).dispatch(action);
        }
    }["App.useCallback[lazyDispatch]"], []);
    const marshalCallbacks = useMemo({
        "App.useMemo[marshalCallbacks]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bindActionCreators"])({
                publishWhileDragging,
                updateDroppableScroll,
                updateDroppableIsEnabled,
                updateDroppableIsCombineEnabled,
                collectionStarting
            }, lazyDispatch)
    }["App.useMemo[marshalCallbacks]"], [
        lazyDispatch
    ]);
    const registry = useRegistry();
    const dimensionMarshal = useMemo({
        "App.useMemo[dimensionMarshal]": ()=>{
            return createDimensionMarshal(registry, marshalCallbacks);
        }
    }["App.useMemo[dimensionMarshal]"], [
        registry,
        marshalCallbacks
    ]);
    const autoScroller = useMemo({
        "App.useMemo[autoScroller]": ()=>createAutoScroller({
                scrollWindow,
                scrollDroppable: dimensionMarshal.scrollDroppable,
                getAutoScrollerOptions,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bindActionCreators"])({
                    move
                }, lazyDispatch)
            })
    }["App.useMemo[autoScroller]"], [
        dimensionMarshal.scrollDroppable,
        lazyDispatch,
        getAutoScrollerOptions
    ]);
    const focusMarshal = useFocusMarshal(contextId);
    const store = useMemo({
        "App.useMemo[store]": ()=>createStore({
                announce,
                autoScroller,
                dimensionMarshal,
                focusMarshal,
                getResponders,
                styleMarshal
            })
    }["App.useMemo[store]"], [
        announce,
        autoScroller,
        dimensionMarshal,
        focusMarshal,
        getResponders,
        styleMarshal
    ]);
    if ("TURBOPACK compile-time truthy", 1) {
        if (lazyStoreRef.current && lazyStoreRef.current !== store) {
            ("TURBOPACK compile-time truthy", 1) ? warning('unexpected store change') : "TURBOPACK unreachable";
        }
    }
    lazyStoreRef.current = store;
    const tryResetStore = useCallback({
        "App.useCallback[tryResetStore]": ()=>{
            const current = getStore(lazyStoreRef);
            const state = current.getState();
            if (state.phase !== 'IDLE') {
                current.dispatch(flush());
            }
        }
    }["App.useCallback[tryResetStore]"], []);
    const isDragging = useCallback({
        "App.useCallback[isDragging]": ()=>{
            const state = getStore(lazyStoreRef).getState();
            if (state.phase === 'DROP_ANIMATING') {
                return true;
            }
            if (state.phase === 'IDLE') {
                return false;
            }
            return state.isDragging;
        }
    }["App.useCallback[isDragging]"], []);
    const appCallbacks = useMemo({
        "App.useMemo[appCallbacks]": ()=>({
                isDragging,
                tryAbort: tryResetStore
            })
    }["App.useMemo[appCallbacks]"], [
        isDragging,
        tryResetStore
    ]);
    setCallbacks(appCallbacks);
    const getCanLift = useCallback({
        "App.useCallback[getCanLift]": (id)=>canStartDrag(getStore(lazyStoreRef).getState(), id)
    }["App.useCallback[getCanLift]"], []);
    const getIsMovementAllowed = useCallback({
        "App.useCallback[getIsMovementAllowed]": ()=>isMovementAllowed(getStore(lazyStoreRef).getState())
    }["App.useCallback[getIsMovementAllowed]"], []);
    const appContext = useMemo({
        "App.useMemo[appContext]": ()=>({
                marshal: dimensionMarshal,
                focus: focusMarshal,
                contextId,
                canLift: getCanLift,
                isMovementAllowed: getIsMovementAllowed,
                dragHandleUsageInstructionsId,
                registry
            })
    }["App.useMemo[appContext]"], [
        contextId,
        dimensionMarshal,
        dragHandleUsageInstructionsId,
        focusMarshal,
        getCanLift,
        getIsMovementAllowed,
        registry
    ]);
    useSensorMarshal({
        contextId,
        store,
        registry,
        customSensors: sensors || null,
        enableDefaultSensors: props.enableDefaultSensors !== false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            return tryResetStore;
        }
    }["App.useEffect"], [
        tryResetStore
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AppContext.Provider, {
        value: appContext
    }, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        context: StoreContext,
        store: store
    }, props.children));
}
function useUniqueContextId() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useId();
}
function DragDropContext(props) {
    const contextId = useUniqueContextId();
    const dragHandleUsageInstructions = props.dragHandleUsageInstructions || preset.dragHandleUsageInstructions;
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ErrorBoundary, null, (setCallbacks)=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(App, {
            nonce: props.nonce,
            contextId: contextId,
            setCallbacks: setCallbacks,
            dragHandleUsageInstructions: dragHandleUsageInstructions,
            enableDefaultSensors: props.enableDefaultSensors,
            sensors: props.sensors,
            onBeforeCapture: props.onBeforeCapture,
            onBeforeDragStart: props.onBeforeDragStart,
            onDragStart: props.onDragStart,
            onDragUpdate: props.onDragUpdate,
            onDragEnd: props.onDragEnd,
            autoScrollerOptions: props.autoScrollerOptions
        }, props.children));
}
const zIndexOptions = {
    dragging: 5000,
    dropAnimating: 4500
};
const getDraggingTransition = (shouldAnimateDragMovement, dropping)=>{
    if (dropping) {
        return transitions.drop(dropping.duration);
    }
    if (shouldAnimateDragMovement) {
        return transitions.snap;
    }
    return transitions.fluid;
};
const getDraggingOpacity = (isCombining, isDropAnimating)=>{
    if (!isCombining) {
        return undefined;
    }
    return isDropAnimating ? combine.opacity.drop : combine.opacity.combining;
};
const getShouldDraggingAnimate = (dragging)=>{
    if (dragging.forceShouldAnimate != null) {
        return dragging.forceShouldAnimate;
    }
    return dragging.mode === 'SNAP';
};
function getDraggingStyle(dragging) {
    const dimension = dragging.dimension;
    const box = dimension.client;
    const { offset, combineWith, dropping } = dragging;
    const isCombining = Boolean(combineWith);
    const shouldAnimate = getShouldDraggingAnimate(dragging);
    const isDropAnimating = Boolean(dropping);
    const transform = isDropAnimating ? transforms.drop(offset, isCombining) : transforms.moveTo(offset);
    const style = {
        position: 'fixed',
        top: box.marginBox.top,
        left: box.marginBox.left,
        boxSizing: 'border-box',
        width: box.borderBox.width,
        height: box.borderBox.height,
        transition: getDraggingTransition(shouldAnimate, dropping),
        transform,
        opacity: getDraggingOpacity(isCombining, isDropAnimating),
        zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
        pointerEvents: 'none'
    };
    return style;
}
function getSecondaryStyle(secondary) {
    return {
        transform: transforms.moveTo(secondary.offset),
        transition: secondary.shouldAnimateDisplacement ? undefined : 'none'
    };
}
function getStyle$1(mapped) {
    return mapped.type === 'DRAGGING' ? getDraggingStyle(mapped) : getSecondaryStyle(mapped);
}
function getDimension$1(descriptor, el) {
    let windowScroll = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : origin;
    const computedStyles = window.getComputedStyle(el);
    const borderBox = el.getBoundingClientRect();
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBox"])(borderBox, computedStyles);
    const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withScroll"])(client, windowScroll);
    const placeholder = {
        client,
        tagName: el.tagName.toLowerCase(),
        display: computedStyles.display
    };
    const displaceBy = {
        x: client.marginBox.width,
        y: client.marginBox.height
    };
    const dimension = {
        descriptor,
        placeholder,
        displaceBy,
        client,
        page
    };
    return dimension;
}
function useDraggablePublisher(args) {
    const uniqueId = useUniqueId('draggable');
    const { descriptor, registry, getDraggableRef, canDragInteractiveElements, shouldRespectForcePress, isEnabled } = args;
    const options = useMemo({
        "useDraggablePublisher.useMemo[options]": ()=>({
                canDragInteractiveElements,
                shouldRespectForcePress,
                isEnabled
            })
    }["useDraggablePublisher.useMemo[options]"], [
        canDragInteractiveElements,
        isEnabled,
        shouldRespectForcePress
    ]);
    const getDimension = useCallback({
        "useDraggablePublisher.useCallback[getDimension]": (windowScroll)=>{
            const el = getDraggableRef();
            !el ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot get dimension when no ref is set') : "TURBOPACK unreachable" : void 0;
            return getDimension$1(descriptor, el, windowScroll);
        }
    }["useDraggablePublisher.useCallback[getDimension]"], [
        descriptor,
        getDraggableRef
    ]);
    const entry = useMemo({
        "useDraggablePublisher.useMemo[entry]": ()=>({
                uniqueId,
                descriptor,
                options,
                getDimension
            })
    }["useDraggablePublisher.useMemo[entry]"], [
        descriptor,
        getDimension,
        options,
        uniqueId
    ]);
    const publishedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(entry);
    const isFirstPublishRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    useIsomorphicLayoutEffect({
        "useDraggablePublisher.useIsomorphicLayoutEffect": ()=>{
            registry.draggable.register(publishedRef.current);
            return ({
                "useDraggablePublisher.useIsomorphicLayoutEffect": ()=>registry.draggable.unregister(publishedRef.current)
            })["useDraggablePublisher.useIsomorphicLayoutEffect"];
        }
    }["useDraggablePublisher.useIsomorphicLayoutEffect"], [
        registry.draggable
    ]);
    useIsomorphicLayoutEffect({
        "useDraggablePublisher.useIsomorphicLayoutEffect": ()=>{
            if (isFirstPublishRef.current) {
                isFirstPublishRef.current = false;
                return;
            }
            const last = publishedRef.current;
            publishedRef.current = entry;
            registry.draggable.update(entry, last);
        }
    }["useDraggablePublisher.useIsomorphicLayoutEffect"], [
        entry,
        registry.draggable
    ]);
}
var DroppableContext = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(null);
function checkIsValidInnerRef(el) {
    !(el && isHtmlElement(el)) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "\n    provided.innerRef has not been provided with a HTMLElement.\n\n    You can find a guide on using the innerRef callback functions at:\n    https://github.com/hello-pangea/dnd/blob/main/docs/guides/using-inner-ref.md\n  ") : "TURBOPACK unreachable" : void 0;
}
function useValidation$1(props, contextId, getRef) {
    useDevSetupWarning({
        "useValidation$1.useDevSetupWarning": ()=>{
            function prefix(id) {
                return "Draggable[id: ".concat(id, "]: ");
            }
            const id = props.draggableId;
            !id ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Draggable requires a draggableId') : "TURBOPACK unreachable" : void 0;
            !(typeof id === 'string') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "Draggable requires a [string] draggableId.\n      Provided: [type: ".concat(typeof id, "] (value: ").concat(id, ")")) : "TURBOPACK unreachable" : void 0;
            !Number.isInteger(props.index) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "".concat(prefix(id), " requires an integer index prop")) : "TURBOPACK unreachable" : void 0;
            if (props.mapped.type === 'DRAGGING') {
                return;
            }
            checkIsValidInnerRef(getRef());
            if (props.isEnabled) {
                !findDragHandle(contextId, id) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "".concat(prefix(id), " Unable to find drag handle")) : "TURBOPACK unreachable" : void 0;
            }
        }
    }["useValidation$1.useDevSetupWarning"]);
}
function useClonePropValidation(isClone) {
    useDev({
        "useClonePropValidation.useDev": ()=>{
            const initialRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(isClone);
            useDevSetupWarning({
                "useClonePropValidation.useDev.useDevSetupWarning": ()=>{
                    !(isClone === initialRef.current) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Draggable isClone prop value changed during component life') : "TURBOPACK unreachable" : void 0;
                }
            }["useClonePropValidation.useDev.useDevSetupWarning"], [
                isClone
            ]);
        }
    }["useClonePropValidation.useDev"]);
}
function useRequiredContext(Context) {
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(Context);
    !result ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find required context') : "TURBOPACK unreachable" : void 0;
    return result;
}
function preventHtml5Dnd(event) {
    event.preventDefault();
}
const Draggable = (props)=>{
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setRef = useCallback({
        "Draggable.useCallback[setRef]": function() {
            let el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
            ref.current = el;
        }
    }["Draggable.useCallback[setRef]"], []);
    const getRef = useCallback({
        "Draggable.useCallback[getRef]": ()=>ref.current
    }["Draggable.useCallback[getRef]"], []);
    const { contextId, dragHandleUsageInstructionsId, registry } = useRequiredContext(AppContext);
    const { type, droppableId } = useRequiredContext(DroppableContext);
    const descriptor = useMemo({
        "Draggable.useMemo[descriptor]": ()=>({
                id: props.draggableId,
                index: props.index,
                type,
                droppableId
            })
    }["Draggable.useMemo[descriptor]"], [
        props.draggableId,
        props.index,
        type,
        droppableId
    ]);
    const { children, draggableId, isEnabled, shouldRespectForcePress, canDragInteractiveElements, isClone, mapped, dropAnimationFinished: dropAnimationFinishedAction } = props;
    useValidation$1(props, contextId, getRef);
    useClonePropValidation(isClone);
    if (!isClone) {
        const forPublisher = useMemo({
            "Draggable.useMemo[forPublisher]": ()=>({
                    descriptor,
                    registry,
                    getDraggableRef: getRef,
                    canDragInteractiveElements,
                    shouldRespectForcePress,
                    isEnabled
                })
        }["Draggable.useMemo[forPublisher]"], [
            descriptor,
            registry,
            getRef,
            canDragInteractiveElements,
            shouldRespectForcePress,
            isEnabled
        ]);
        useDraggablePublisher(forPublisher);
    }
    const dragHandleProps = useMemo({
        "Draggable.useMemo[dragHandleProps]": ()=>isEnabled ? {
                tabIndex: 0,
                role: 'button',
                'aria-describedby': dragHandleUsageInstructionsId,
                'data-rfd-drag-handle-draggable-id': draggableId,
                'data-rfd-drag-handle-context-id': contextId,
                draggable: false,
                onDragStart: preventHtml5Dnd
            } : null
    }["Draggable.useMemo[dragHandleProps]"], [
        contextId,
        dragHandleUsageInstructionsId,
        draggableId,
        isEnabled
    ]);
    const onMoveEnd = useCallback({
        "Draggable.useCallback[onMoveEnd]": (event)=>{
            if (mapped.type !== 'DRAGGING') {
                return;
            }
            if (!mapped.dropping) {
                return;
            }
            if (event.propertyName !== 'transform') {
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"])(dropAnimationFinishedAction);
        }
    }["Draggable.useCallback[onMoveEnd]"], [
        dropAnimationFinishedAction,
        mapped
    ]);
    const provided = useMemo({
        "Draggable.useMemo[provided]": ()=>{
            const style = getStyle$1(mapped);
            const onTransitionEnd = mapped.type === 'DRAGGING' && mapped.dropping ? onMoveEnd : undefined;
            const result = {
                innerRef: setRef,
                draggableProps: {
                    'data-rfd-draggable-context-id': contextId,
                    'data-rfd-draggable-id': draggableId,
                    style,
                    onTransitionEnd
                },
                dragHandleProps
            };
            return result;
        }
    }["Draggable.useMemo[provided]"], [
        contextId,
        dragHandleProps,
        draggableId,
        mapped,
        onMoveEnd,
        setRef
    ]);
    const rubric = useMemo({
        "Draggable.useMemo[rubric]": ()=>({
                draggableId: descriptor.id,
                type: descriptor.type,
                source: {
                    index: descriptor.index,
                    droppableId: descriptor.droppableId
                }
            })
    }["Draggable.useMemo[rubric]"], [
        descriptor.droppableId,
        descriptor.id,
        descriptor.index,
        descriptor.type
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, children(provided, mapped.snapshot, rubric));
};
var isStrictEqual = (a, b)=>a === b;
var whatIsDraggedOverFromResult = (result)=>{
    const { combine, destination } = result;
    if (destination) {
        return destination.droppableId;
    }
    if (combine) {
        return combine.droppableId;
    }
    return null;
};
const getCombineWithFromResult = (result)=>{
    return result.combine ? result.combine.draggableId : null;
};
const getCombineWithFromImpact = (impact)=>{
    return impact.at && impact.at.type === 'COMBINE' ? impact.at.combine.draggableId : null;
};
function getDraggableSelector() {
    const memoizedOffset = memoizeOne((x, y)=>({
            x,
            y
        }));
    const getMemoizedSnapshot = memoizeOne(function(mode, isClone) {
        let draggingOver = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, combineWith = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, dropping = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
        return {
            isDragging: true,
            isClone,
            isDropAnimating: Boolean(dropping),
            dropAnimation: dropping,
            mode,
            draggingOver,
            combineWith,
            combineTargetFor: null
        };
    });
    const getMemoizedProps = memoizeOne(function(offset, mode, dimension, isClone) {
        let draggingOver = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null, combineWith = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : null, forceShouldAnimate = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : null;
        return {
            mapped: {
                type: 'DRAGGING',
                dropping: null,
                draggingOver,
                combineWith,
                mode,
                offset,
                dimension,
                forceShouldAnimate,
                snapshot: getMemoizedSnapshot(mode, isClone, draggingOver, combineWith, null)
            }
        };
    });
    const selector = (state, ownProps)=>{
        if (isDragging(state)) {
            if (state.critical.draggable.id !== ownProps.draggableId) {
                return null;
            }
            const offset = state.current.client.offset;
            const dimension = state.dimensions.draggables[ownProps.draggableId];
            const draggingOver = whatIsDraggedOver(state.impact);
            const combineWith = getCombineWithFromImpact(state.impact);
            const forceShouldAnimate = state.forceShouldAnimate;
            return getMemoizedProps(memoizedOffset(offset.x, offset.y), state.movementMode, dimension, ownProps.isClone, draggingOver, combineWith, forceShouldAnimate);
        }
        if (state.phase === 'DROP_ANIMATING') {
            const completed = state.completed;
            if (completed.result.draggableId !== ownProps.draggableId) {
                return null;
            }
            const isClone = ownProps.isClone;
            const dimension = state.dimensions.draggables[ownProps.draggableId];
            const result = completed.result;
            const mode = result.mode;
            const draggingOver = whatIsDraggedOverFromResult(result);
            const combineWith = getCombineWithFromResult(result);
            const duration = state.dropDuration;
            const dropping = {
                duration,
                curve: curves.drop,
                moveTo: state.newHomeClientOffset,
                opacity: combineWith ? combine.opacity.drop : null,
                scale: combineWith ? combine.scale.drop : null
            };
            return {
                mapped: {
                    type: 'DRAGGING',
                    offset: state.newHomeClientOffset,
                    dimension,
                    dropping,
                    draggingOver,
                    combineWith,
                    mode,
                    forceShouldAnimate: null,
                    snapshot: getMemoizedSnapshot(mode, isClone, draggingOver, combineWith, dropping)
                }
            };
        }
        return null;
    };
    return selector;
}
function getSecondarySnapshot() {
    let combineTargetFor = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    return {
        isDragging: false,
        isDropAnimating: false,
        isClone: false,
        dropAnimation: null,
        mode: null,
        draggingOver: null,
        combineTargetFor,
        combineWith: null
    };
}
const atRest = {
    mapped: {
        type: 'SECONDARY',
        offset: origin,
        combineTargetFor: null,
        shouldAnimateDisplacement: true,
        snapshot: getSecondarySnapshot(null)
    }
};
function getSecondarySelector() {
    const memoizedOffset = memoizeOne((x, y)=>({
            x,
            y
        }));
    const getMemoizedSnapshot = memoizeOne(getSecondarySnapshot);
    const getMemoizedProps = memoizeOne(function(offset) {
        let combineTargetFor = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, shouldAnimateDisplacement = arguments.length > 2 ? arguments[2] : void 0;
        return {
            mapped: {
                type: 'SECONDARY',
                offset,
                combineTargetFor,
                shouldAnimateDisplacement,
                snapshot: getMemoizedSnapshot(combineTargetFor)
            }
        };
    });
    const getFallback = (combineTargetFor)=>{
        return combineTargetFor ? getMemoizedProps(origin, combineTargetFor, true) : null;
    };
    const getProps = (ownId, draggingId, impact, afterCritical)=>{
        const visualDisplacement = impact.displaced.visible[ownId];
        const isAfterCriticalInVirtualList = Boolean(afterCritical.inVirtualList && afterCritical.effected[ownId]);
        const combine = tryGetCombine(impact);
        const combineTargetFor = combine && combine.draggableId === ownId ? draggingId : null;
        if (!visualDisplacement) {
            if (!isAfterCriticalInVirtualList) {
                return getFallback(combineTargetFor);
            }
            if (impact.displaced.invisible[ownId]) {
                return null;
            }
            const change = negate(afterCritical.displacedBy.point);
            const offset = memoizedOffset(change.x, change.y);
            return getMemoizedProps(offset, combineTargetFor, true);
        }
        if (isAfterCriticalInVirtualList) {
            return getFallback(combineTargetFor);
        }
        const displaceBy = impact.displacedBy.point;
        const offset = memoizedOffset(displaceBy.x, displaceBy.y);
        return getMemoizedProps(offset, combineTargetFor, visualDisplacement.shouldAnimate);
    };
    const selector = (state, ownProps)=>{
        if (isDragging(state)) {
            if (state.critical.draggable.id === ownProps.draggableId) {
                return null;
            }
            return getProps(ownProps.draggableId, state.critical.draggable.id, state.impact, state.afterCritical);
        }
        if (state.phase === 'DROP_ANIMATING') {
            const completed = state.completed;
            if (completed.result.draggableId === ownProps.draggableId) {
                return null;
            }
            return getProps(ownProps.draggableId, completed.result.draggableId, completed.impact, completed.afterCritical);
        }
        return null;
    };
    return selector;
}
const makeMapStateToProps$1 = ()=>{
    const draggingSelector = getDraggableSelector();
    const secondarySelector = getSecondarySelector();
    const selector = (state, ownProps)=>draggingSelector(state, ownProps) || secondarySelector(state, ownProps) || atRest;
    return selector;
};
const mapDispatchToProps$1 = {
    dropAnimationFinished: dropAnimationFinished
};
const ConnectedDraggable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connect"])(makeMapStateToProps$1, mapDispatchToProps$1, null, {
    context: StoreContext,
    areStatePropsEqual: isStrictEqual
})(Draggable);
function PrivateDraggable(props) {
    const droppableContext = useRequiredContext(DroppableContext);
    const isUsingCloneFor = droppableContext.isUsingCloneFor;
    if (isUsingCloneFor === props.draggableId && !props.isClone) {
        return null;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ConnectedDraggable, props);
}
function PublicDraggable(props) {
    const isEnabled = typeof props.isDragDisabled === 'boolean' ? !props.isDragDisabled : true;
    const canDragInteractiveElements = Boolean(props.disableInteractiveElementBlocking);
    const shouldRespectForcePress = Boolean(props.shouldRespectForcePress);
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PrivateDraggable, (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, props, {
        isClone: false,
        isEnabled: isEnabled,
        canDragInteractiveElements: canDragInteractiveElements,
        shouldRespectForcePress: shouldRespectForcePress
    }));
}
const isEqual = (base)=>(value)=>base === value;
const isScroll = isEqual('scroll');
const isAuto = isEqual('auto');
const isVisible = isEqual('visible');
const isEither = (overflow, fn)=>fn(overflow.overflowX) || fn(overflow.overflowY);
const isBoth = (overflow, fn)=>fn(overflow.overflowX) && fn(overflow.overflowY);
const isElementScrollable = (el)=>{
    const style = window.getComputedStyle(el);
    const overflow = {
        overflowX: style.overflowX,
        overflowY: style.overflowY
    };
    return isEither(overflow, isScroll) || isEither(overflow, isAuto);
};
const isBodyScrollable = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const body = getBodyElement();
    const html = document.documentElement;
    !html ? ("TURBOPACK compile-time truthy", 1) ? invariant() : "TURBOPACK unreachable" : void 0;
    if (!isElementScrollable(body)) {
        return false;
    }
    const htmlStyle = window.getComputedStyle(html);
    const htmlOverflow = {
        overflowX: htmlStyle.overflowX,
        overflowY: htmlStyle.overflowY
    };
    if (isBoth(htmlOverflow, isVisible)) {
        return false;
    }
    ("TURBOPACK compile-time truthy", 1) ? warning("\n    We have detected that your <body> element might be a scroll container.\n    We have found no reliable way of detecting whether the <body> element is a scroll container.\n    Under most circumstances a <body> scroll bar will be on the <html> element (document.documentElement)\n\n    Because we cannot determine if the <body> is a scroll container, and generally it is not one,\n    we will be treating the <body> as *not* a scroll container\n\n    More information: https://github.com/hello-pangea/dnd/blob/main/docs/guides/how-we-detect-scroll-containers.md\n  ") : "TURBOPACK unreachable";
    return false;
};
const getClosestScrollable = (el)=>{
    if (el == null) {
        return null;
    }
    if (el === document.body) {
        return isBodyScrollable() ? "TURBOPACK unreachable" : null;
    }
    if (el === document.documentElement) {
        return null;
    }
    if (!isElementScrollable(el)) {
        return getClosestScrollable(el.parentElement);
    }
    return el;
};
var checkForNestedScrollContainers = (scrollable)=>{
    if (!scrollable) {
        return;
    }
    const anotherScrollParent = getClosestScrollable(scrollable.parentElement);
    if (!anotherScrollParent) {
        return;
    }
    ("TURBOPACK compile-time truthy", 1) ? warning("\n    Droppable: unsupported nested scroll container detected.\n    A Droppable can only have one scroll parent (which can be itself)\n    Nested scroll containers are currently not supported.\n\n    We hope to support nested scroll containers soon: https://github.com/atlassian/react-beautiful-dnd/issues/131\n  ") : "TURBOPACK unreachable";
};
var getScroll = (el)=>({
        x: el.scrollLeft,
        y: el.scrollTop
    });
const getIsFixed = (el)=>{
    if (!el) {
        return false;
    }
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed') {
        return true;
    }
    return getIsFixed(el.parentElement);
};
var getEnv = (start)=>{
    const closestScrollable = getClosestScrollable(start);
    const isFixedOnPage = getIsFixed(start);
    return {
        closestScrollable,
        isFixedOnPage
    };
};
var getDroppableDimension = (param)=>{
    let { descriptor, isEnabled, isCombineEnabled, isFixedOnPage, direction, client, page, closest } = param;
    const frame = (()=>{
        if (!closest) {
            return null;
        }
        const { scrollSize, client: frameClient } = closest;
        const maxScroll = getMaxScroll({
            scrollHeight: scrollSize.scrollHeight,
            scrollWidth: scrollSize.scrollWidth,
            height: frameClient.paddingBox.height,
            width: frameClient.paddingBox.width
        });
        return {
            pageMarginBox: closest.page.marginBox,
            frameClient,
            scrollSize,
            shouldClipSubject: closest.shouldClipSubject,
            scroll: {
                initial: closest.scroll,
                current: closest.scroll,
                max: maxScroll,
                diff: {
                    value: origin,
                    displacement: origin
                }
            }
        };
    })();
    const axis = direction === 'vertical' ? vertical : horizontal;
    const subject = getSubject({
        page,
        withPlaceholder: null,
        axis,
        frame
    });
    const dimension = {
        descriptor,
        isCombineEnabled,
        isFixedOnPage,
        axis,
        isEnabled,
        client,
        page,
        frame,
        subject
    };
    return dimension;
};
const getClient = (targetRef, closestScrollable)=>{
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBox"])(targetRef);
    if (!closestScrollable) {
        return base;
    }
    if (targetRef !== closestScrollable) {
        return base;
    }
    const top = base.paddingBox.top - closestScrollable.scrollTop;
    const left = base.paddingBox.left - closestScrollable.scrollLeft;
    const bottom = top + closestScrollable.scrollHeight;
    const right = left + closestScrollable.scrollWidth;
    const paddingBox = {
        top,
        right,
        bottom,
        left
    };
    const borderBox = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expand"])(paddingBox, base.border);
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBox"])({
        borderBox,
        margin: base.margin,
        border: base.border,
        padding: base.padding
    });
    return client;
};
var getDimension = (param)=>{
    let { ref, descriptor, env, windowScroll, direction, isDropDisabled, isCombineEnabled, shouldClipSubject } = param;
    const closestScrollable = env.closestScrollable;
    const client = getClient(ref, closestScrollable);
    const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withScroll"])(client, windowScroll);
    const closest = (()=>{
        if (!closestScrollable) {
            return null;
        }
        const frameClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBox"])(closestScrollable);
        const scrollSize = {
            scrollHeight: closestScrollable.scrollHeight,
            scrollWidth: closestScrollable.scrollWidth
        };
        return {
            client: frameClient,
            page: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$css$2d$box$2d$model$2f$dist$2f$css$2d$box$2d$model$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withScroll"])(frameClient, windowScroll),
            scroll: getScroll(closestScrollable),
            scrollSize,
            shouldClipSubject
        };
    })();
    const dimension = getDroppableDimension({
        descriptor,
        isEnabled: !isDropDisabled,
        isCombineEnabled,
        isFixedOnPage: env.isFixedOnPage,
        direction,
        client,
        page,
        closest
    });
    return dimension;
};
const immediate = {
    passive: false
};
const delayed = {
    passive: true
};
var getListenerOptions = (options)=>options.shouldPublishImmediately ? immediate : delayed;
const getClosestScrollableFromDrag = (dragging)=>dragging && dragging.env.closestScrollable || null;
function useDroppablePublisher(args) {
    const whileDraggingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const appContext = useRequiredContext(AppContext);
    const uniqueId = useUniqueId('droppable');
    const { registry, marshal } = appContext;
    const previousRef = usePrevious(args);
    const descriptor = useMemo({
        "useDroppablePublisher.useMemo[descriptor]": ()=>({
                id: args.droppableId,
                type: args.type,
                mode: args.mode
            })
    }["useDroppablePublisher.useMemo[descriptor]"], [
        args.droppableId,
        args.mode,
        args.type
    ]);
    const publishedDescriptorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(descriptor);
    const memoizedUpdateScroll = useMemo({
        "useDroppablePublisher.useMemo[memoizedUpdateScroll]": ()=>memoizeOne({
                "useDroppablePublisher.useMemo[memoizedUpdateScroll]": (x, y)=>{
                    !whileDraggingRef.current ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Can only update scroll when dragging') : "TURBOPACK unreachable" : void 0;
                    const scroll = {
                        x,
                        y
                    };
                    marshal.updateDroppableScroll(descriptor.id, scroll);
                }
            }["useDroppablePublisher.useMemo[memoizedUpdateScroll]"])
    }["useDroppablePublisher.useMemo[memoizedUpdateScroll]"], [
        descriptor.id,
        marshal
    ]);
    const getClosestScroll = useCallback({
        "useDroppablePublisher.useCallback[getClosestScroll]": ()=>{
            const dragging = whileDraggingRef.current;
            if (!dragging || !dragging.env.closestScrollable) {
                return origin;
            }
            return getScroll(dragging.env.closestScrollable);
        }
    }["useDroppablePublisher.useCallback[getClosestScroll]"], []);
    const updateScroll = useCallback({
        "useDroppablePublisher.useCallback[updateScroll]": ()=>{
            const scroll = getClosestScroll();
            memoizedUpdateScroll(scroll.x, scroll.y);
        }
    }["useDroppablePublisher.useCallback[updateScroll]"], [
        getClosestScroll,
        memoizedUpdateScroll
    ]);
    const scheduleScrollUpdate = useMemo({
        "useDroppablePublisher.useMemo[scheduleScrollUpdate]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$raf$2d$schd$2f$dist$2f$raf$2d$schd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(updateScroll)
    }["useDroppablePublisher.useMemo[scheduleScrollUpdate]"], [
        updateScroll
    ]);
    const onClosestScroll = useCallback({
        "useDroppablePublisher.useCallback[onClosestScroll]": ()=>{
            const dragging = whileDraggingRef.current;
            const closest = getClosestScrollableFromDrag(dragging);
            !(dragging && closest) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find scroll options while scrolling') : "TURBOPACK unreachable" : void 0;
            const options = dragging.scrollOptions;
            if (options.shouldPublishImmediately) {
                updateScroll();
                return;
            }
            scheduleScrollUpdate();
        }
    }["useDroppablePublisher.useCallback[onClosestScroll]"], [
        scheduleScrollUpdate,
        updateScroll
    ]);
    const getDimensionAndWatchScroll = useCallback({
        "useDroppablePublisher.useCallback[getDimensionAndWatchScroll]": (windowScroll, options)=>{
            !!whileDraggingRef.current ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot collect a droppable while a drag is occurring') : "TURBOPACK unreachable" : void 0;
            const previous = previousRef.current;
            const ref = previous.getDroppableRef();
            !ref ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot collect without a droppable ref') : "TURBOPACK unreachable" : void 0;
            const env = getEnv(ref);
            const dragging = {
                ref,
                descriptor,
                env,
                scrollOptions: options
            };
            whileDraggingRef.current = dragging;
            const dimension = getDimension({
                ref,
                descriptor,
                env,
                windowScroll,
                direction: previous.direction,
                isDropDisabled: previous.isDropDisabled,
                isCombineEnabled: previous.isCombineEnabled,
                shouldClipSubject: !previous.ignoreContainerClipping
            });
            const scrollable = env.closestScrollable;
            if (scrollable) {
                scrollable.setAttribute(scrollContainer.contextId, appContext.contextId);
                scrollable.addEventListener('scroll', onClosestScroll, getListenerOptions(dragging.scrollOptions));
                if ("TURBOPACK compile-time truthy", 1) {
                    checkForNestedScrollContainers(scrollable);
                }
            }
            return dimension;
        }
    }["useDroppablePublisher.useCallback[getDimensionAndWatchScroll]"], [
        appContext.contextId,
        descriptor,
        onClosestScroll,
        previousRef
    ]);
    const getScrollWhileDragging = useCallback({
        "useDroppablePublisher.useCallback[getScrollWhileDragging]": ()=>{
            const dragging = whileDraggingRef.current;
            const closest = getClosestScrollableFromDrag(dragging);
            !(dragging && closest) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Can only recollect Droppable client for Droppables that have a scroll container') : "TURBOPACK unreachable" : void 0;
            return getScroll(closest);
        }
    }["useDroppablePublisher.useCallback[getScrollWhileDragging]"], []);
    const dragStopped = useCallback({
        "useDroppablePublisher.useCallback[dragStopped]": ()=>{
            const dragging = whileDraggingRef.current;
            !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot stop drag when no active drag') : "TURBOPACK unreachable" : void 0;
            const closest = getClosestScrollableFromDrag(dragging);
            whileDraggingRef.current = null;
            if (!closest) {
                return;
            }
            scheduleScrollUpdate.cancel();
            closest.removeAttribute(scrollContainer.contextId);
            closest.removeEventListener('scroll', onClosestScroll, getListenerOptions(dragging.scrollOptions));
        }
    }["useDroppablePublisher.useCallback[dragStopped]"], [
        onClosestScroll,
        scheduleScrollUpdate
    ]);
    const scroll = useCallback({
        "useDroppablePublisher.useCallback[scroll]": (change)=>{
            const dragging = whileDraggingRef.current;
            !dragging ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot scroll when there is no drag') : "TURBOPACK unreachable" : void 0;
            const closest = getClosestScrollableFromDrag(dragging);
            !closest ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Cannot scroll a droppable with no closest scrollable') : "TURBOPACK unreachable" : void 0;
            closest.scrollTop += change.y;
            closest.scrollLeft += change.x;
        }
    }["useDroppablePublisher.useCallback[scroll]"], []);
    const callbacks = useMemo({
        "useDroppablePublisher.useMemo[callbacks]": ()=>{
            return {
                getDimensionAndWatchScroll,
                getScrollWhileDragging,
                dragStopped,
                scroll
            };
        }
    }["useDroppablePublisher.useMemo[callbacks]"], [
        dragStopped,
        getDimensionAndWatchScroll,
        getScrollWhileDragging,
        scroll
    ]);
    const entry = useMemo({
        "useDroppablePublisher.useMemo[entry]": ()=>({
                uniqueId,
                descriptor,
                callbacks
            })
    }["useDroppablePublisher.useMemo[entry]"], [
        callbacks,
        descriptor,
        uniqueId
    ]);
    useIsomorphicLayoutEffect({
        "useDroppablePublisher.useIsomorphicLayoutEffect": ()=>{
            publishedDescriptorRef.current = entry.descriptor;
            registry.droppable.register(entry);
            return ({
                "useDroppablePublisher.useIsomorphicLayoutEffect": ()=>{
                    if (whileDraggingRef.current) {
                        ("TURBOPACK compile-time truthy", 1) ? warning('Unsupported: changing the droppableId or type of a Droppable during a drag') : "TURBOPACK unreachable";
                        dragStopped();
                    }
                    registry.droppable.unregister(entry);
                }
            })["useDroppablePublisher.useIsomorphicLayoutEffect"];
        }
    }["useDroppablePublisher.useIsomorphicLayoutEffect"], [
        callbacks,
        descriptor,
        dragStopped,
        entry,
        marshal,
        registry.droppable
    ]);
    useIsomorphicLayoutEffect({
        "useDroppablePublisher.useIsomorphicLayoutEffect": ()=>{
            if (!whileDraggingRef.current) {
                return;
            }
            marshal.updateDroppableIsEnabled(publishedDescriptorRef.current.id, !args.isDropDisabled);
        }
    }["useDroppablePublisher.useIsomorphicLayoutEffect"], [
        args.isDropDisabled,
        marshal
    ]);
    useIsomorphicLayoutEffect({
        "useDroppablePublisher.useIsomorphicLayoutEffect": ()=>{
            if (!whileDraggingRef.current) {
                return;
            }
            marshal.updateDroppableIsCombineEnabled(publishedDescriptorRef.current.id, args.isCombineEnabled);
        }
    }["useDroppablePublisher.useIsomorphicLayoutEffect"], [
        args.isCombineEnabled,
        marshal
    ]);
}
function noop() {}
const empty = {
    width: 0,
    height: 0,
    margin: noSpacing
};
const getSize = (param)=>{
    let { isAnimatingOpenOnMount, placeholder, animate } = param;
    if (isAnimatingOpenOnMount) {
        return empty;
    }
    if (animate === 'close') {
        return empty;
    }
    return {
        height: placeholder.client.borderBox.height,
        width: placeholder.client.borderBox.width,
        margin: placeholder.client.margin
    };
};
const getStyle = (param)=>{
    let { isAnimatingOpenOnMount, placeholder, animate } = param;
    const size = getSize({
        isAnimatingOpenOnMount,
        placeholder,
        animate
    });
    return {
        display: placeholder.display,
        boxSizing: 'border-box',
        width: size.width,
        height: size.height,
        marginTop: size.margin.top,
        marginRight: size.margin.right,
        marginBottom: size.margin.bottom,
        marginLeft: size.margin.left,
        flexShrink: '0',
        flexGrow: '0',
        pointerEvents: 'none',
        transition: animate !== 'none' ? transitions.placeholder : null
    };
};
const Placeholder = (props)=>{
    const animateOpenTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tryClearAnimateOpenTimer = useCallback({
        "Placeholder.useCallback[tryClearAnimateOpenTimer]": ()=>{
            if (!animateOpenTimerRef.current) {
                return;
            }
            clearTimeout(animateOpenTimerRef.current);
            animateOpenTimerRef.current = null;
        }
    }["Placeholder.useCallback[tryClearAnimateOpenTimer]"], []);
    const { animate, onTransitionEnd, onClose, contextId } = props;
    const [isAnimatingOpenOnMount, setIsAnimatingOpenOnMount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(props.animate === 'open');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Placeholder.useEffect": ()=>{
            if (!isAnimatingOpenOnMount) {
                return noop;
            }
            if (animate !== 'open') {
                tryClearAnimateOpenTimer();
                setIsAnimatingOpenOnMount(false);
                return noop;
            }
            if (animateOpenTimerRef.current) {
                return noop;
            }
            animateOpenTimerRef.current = setTimeout({
                "Placeholder.useEffect": ()=>{
                    animateOpenTimerRef.current = null;
                    setIsAnimatingOpenOnMount(false);
                }
            }["Placeholder.useEffect"]);
            return tryClearAnimateOpenTimer;
        }
    }["Placeholder.useEffect"], [
        animate,
        isAnimatingOpenOnMount,
        tryClearAnimateOpenTimer
    ]);
    const onSizeChangeEnd = useCallback({
        "Placeholder.useCallback[onSizeChangeEnd]": (event)=>{
            if (event.propertyName !== 'height') {
                return;
            }
            onTransitionEnd();
            if (animate === 'close') {
                onClose();
            }
        }
    }["Placeholder.useCallback[onSizeChangeEnd]"], [
        animate,
        onClose,
        onTransitionEnd
    ]);
    const style = getStyle({
        isAnimatingOpenOnMount,
        animate: props.animate,
        placeholder: props.placeholder
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(props.placeholder.tagName, {
        style,
        'data-rfd-placeholder-context-id': contextId,
        onTransitionEnd: onSizeChangeEnd,
        ref: props.innerRef
    });
};
var Placeholder$1 = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(Placeholder);
function isBoolean(value) {
    return typeof value === 'boolean';
}
function runChecks(args, checks) {
    checks.forEach((check)=>check(args));
}
const shared = [
    function required(param) {
        let { props } = param;
        !props.droppableId ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'A Droppable requires a droppableId prop') : "TURBOPACK unreachable" : void 0;
        !(typeof props.droppableId === 'string') ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, "A Droppable requires a [string] droppableId. Provided: [".concat(typeof props.droppableId, "]")) : "TURBOPACK unreachable" : void 0;
    },
    function boolean(param) {
        let { props } = param;
        !isBoolean(props.isDropDisabled) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'isDropDisabled must be a boolean') : "TURBOPACK unreachable" : void 0;
        !isBoolean(props.isCombineEnabled) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'isCombineEnabled must be a boolean') : "TURBOPACK unreachable" : void 0;
        !isBoolean(props.ignoreContainerClipping) ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'ignoreContainerClipping must be a boolean') : "TURBOPACK unreachable" : void 0;
    },
    function ref(param) {
        let { getDroppableRef } = param;
        checkIsValidInnerRef(getDroppableRef());
    }
];
const standard = [
    function placeholder(param) {
        let { props, getPlaceholderRef } = param;
        if (!props.placeholder) {
            return;
        }
        const ref = getPlaceholderRef();
        if (ref) {
            return;
        }
        ("TURBOPACK compile-time truthy", 1) ? warning('\n      Droppable setup issue [droppableId: "'.concat(props.droppableId, '"]:\n      DroppableProvided > placeholder could not be found.\n\n      Please be sure to add the {provided.placeholder} React Node as a child of your Droppable.\n      More information: https://github.com/hello-pangea/dnd/blob/main/docs/api/droppable.md\n    ')) : "TURBOPACK unreachable";
    }
];
const virtual = [
    function hasClone(param) {
        let { props } = param;
        !props.renderClone ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Must provide a clone render function (renderClone) for virtual lists') : "TURBOPACK unreachable" : void 0;
    },
    function hasNoPlaceholder(param) {
        let { getPlaceholderRef } = param;
        !!getPlaceholderRef() ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Expected virtual list to not have a placeholder') : "TURBOPACK unreachable" : void 0;
    }
];
function useValidation(args) {
    useDevSetupWarning({
        "useValidation.useDevSetupWarning": ()=>{
            runChecks(args, shared);
            if (args.props.mode === 'standard') {
                runChecks(args, standard);
            }
            if (args.props.mode === 'virtual') {
                runChecks(args, virtual);
            }
        }
    }["useValidation.useDevSetupWarning"]);
}
class AnimateInOut extends __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].PureComponent {
    static getDerivedStateFromProps(props, state) {
        if (!props.shouldAnimate) {
            return {
                isVisible: Boolean(props.on),
                data: props.on,
                animate: 'none'
            };
        }
        if (props.on) {
            return {
                isVisible: true,
                data: props.on,
                animate: 'open'
            };
        }
        if (state.isVisible) {
            return {
                isVisible: true,
                data: state.data,
                animate: 'close'
            };
        }
        return {
            isVisible: false,
            animate: 'close',
            data: null
        };
    }
    render() {
        if (!this.state.isVisible) {
            return null;
        }
        const provided = {
            onClose: this.onClose,
            data: this.state.data,
            animate: this.state.animate
        };
        return this.props.children(provided);
    }
    constructor(...args){
        super(...args);
        this.state = {
            isVisible: Boolean(this.props.on),
            data: this.props.on,
            animate: this.props.shouldAnimate && this.props.on ? 'open' : 'none'
        };
        this.onClose = ()=>{
            if (this.state.animate !== 'close') {
                return;
            }
            this.setState({
                isVisible: false
            });
        };
    }
}
const Droppable = (props)=>{
    const appContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    !appContext ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'Could not find app context') : "TURBOPACK unreachable" : void 0;
    const { contextId, isMovementAllowed } = appContext;
    const droppableRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const placeholderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { children, droppableId, type, mode, direction, ignoreContainerClipping, isDropDisabled, isCombineEnabled, snapshot, useClone, updateViewportMaxScroll, getContainerForClone } = props;
    const getDroppableRef = useCallback({
        "Droppable.useCallback[getDroppableRef]": ()=>droppableRef.current
    }["Droppable.useCallback[getDroppableRef]"], []);
    const setDroppableRef = useCallback({
        "Droppable.useCallback[setDroppableRef]": function() {
            let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
            droppableRef.current = value;
        }
    }["Droppable.useCallback[setDroppableRef]"], []);
    const getPlaceholderRef = useCallback({
        "Droppable.useCallback[getPlaceholderRef]": ()=>placeholderRef.current
    }["Droppable.useCallback[getPlaceholderRef]"], []);
    const setPlaceholderRef = useCallback({
        "Droppable.useCallback[setPlaceholderRef]": function() {
            let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
            placeholderRef.current = value;
        }
    }["Droppable.useCallback[setPlaceholderRef]"], []);
    useValidation({
        props,
        getDroppableRef,
        getPlaceholderRef
    });
    const onPlaceholderTransitionEnd = useCallback({
        "Droppable.useCallback[onPlaceholderTransitionEnd]": ()=>{
            if (isMovementAllowed()) {
                updateViewportMaxScroll({
                    maxScroll: getMaxWindowScroll()
                });
            }
        }
    }["Droppable.useCallback[onPlaceholderTransitionEnd]"], [
        isMovementAllowed,
        updateViewportMaxScroll
    ]);
    useDroppablePublisher({
        droppableId,
        type,
        mode,
        direction,
        isDropDisabled,
        isCombineEnabled,
        ignoreContainerClipping,
        getDroppableRef
    });
    const placeholder = useMemo({
        "Droppable.useMemo[placeholder]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnimateInOut, {
                on: props.placeholder,
                shouldAnimate: props.shouldAnimatePlaceholder
            }, {
                "Droppable.useMemo[placeholder]": (param)=>{
                    let { onClose, data, animate } = param;
                    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Placeholder$1, {
                        placeholder: data,
                        onClose: onClose,
                        innerRef: setPlaceholderRef,
                        animate: animate,
                        contextId: contextId,
                        onTransitionEnd: onPlaceholderTransitionEnd
                    });
                }
            }["Droppable.useMemo[placeholder]"])
    }["Droppable.useMemo[placeholder]"], [
        contextId,
        onPlaceholderTransitionEnd,
        props.placeholder,
        props.shouldAnimatePlaceholder,
        setPlaceholderRef
    ]);
    const provided = useMemo({
        "Droppable.useMemo[provided]": ()=>({
                innerRef: setDroppableRef,
                placeholder,
                droppableProps: {
                    'data-rfd-droppable-id': droppableId,
                    'data-rfd-droppable-context-id': contextId
                }
            })
    }["Droppable.useMemo[provided]"], [
        contextId,
        droppableId,
        placeholder,
        setDroppableRef
    ]);
    const isUsingCloneFor = useClone ? useClone.dragging.draggableId : null;
    const droppableContext = useMemo({
        "Droppable.useMemo[droppableContext]": ()=>({
                droppableId,
                type,
                isUsingCloneFor
            })
    }["Droppable.useMemo[droppableContext]"], [
        droppableId,
        isUsingCloneFor,
        type
    ]);
    function getClone() {
        if (!useClone) {
            return null;
        }
        const { dragging, render } = useClone;
        const node = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PrivateDraggable, {
            draggableId: dragging.draggableId,
            index: dragging.source.index,
            isClone: true,
            isEnabled: true,
            shouldRespectForcePress: false,
            canDragInteractiveElements: true
        }, (draggableProvided, draggableSnapshot)=>render(draggableProvided, draggableSnapshot, dragging));
        return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createPortal(node, getContainerForClone());
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(DroppableContext.Provider, {
        value: droppableContext
    }, children(provided, snapshot), getClone());
};
function getBody() {
    !document.body ? ("TURBOPACK compile-time truthy", 1) ? invariant(false, 'document.body is not ready') : "TURBOPACK unreachable" : void 0;
    return document.body;
}
const defaultProps = {
    mode: 'standard',
    type: 'DEFAULT',
    direction: 'vertical',
    isDropDisabled: false,
    isCombineEnabled: false,
    ignoreContainerClipping: false,
    renderClone: null,
    getContainerForClone: getBody
};
const attachDefaultPropsToOwnProps = (ownProps)=>{
    let mergedProps = {
        ...ownProps
    };
    let defaultPropKey;
    for(defaultPropKey in defaultProps){
        if (ownProps[defaultPropKey] === undefined) {
            mergedProps = {
                ...mergedProps,
                [defaultPropKey]: defaultProps[defaultPropKey]
            };
        }
    }
    return mergedProps;
};
const isMatchingType = (type, critical)=>type === critical.droppable.type;
const getDraggable = (critical, dimensions)=>dimensions.draggables[critical.draggable.id];
const makeMapStateToProps = ()=>{
    const idleWithAnimation = {
        placeholder: null,
        shouldAnimatePlaceholder: true,
        snapshot: {
            isDraggingOver: false,
            draggingOverWith: null,
            draggingFromThisWith: null,
            isUsingPlaceholder: false
        },
        useClone: null
    };
    const idleWithoutAnimation = {
        ...idleWithAnimation,
        shouldAnimatePlaceholder: false
    };
    const getDraggableRubric = memoizeOne((descriptor)=>({
            draggableId: descriptor.id,
            type: descriptor.type,
            source: {
                index: descriptor.index,
                droppableId: descriptor.droppableId
            }
        }));
    const getMapProps = memoizeOne((id, isEnabled, isDraggingOverForConsumer, isDraggingOverForImpact, dragging, renderClone)=>{
        const draggableId = dragging.descriptor.id;
        const isHome = dragging.descriptor.droppableId === id;
        if (isHome) {
            const useClone = renderClone ? {
                render: renderClone,
                dragging: getDraggableRubric(dragging.descriptor)
            } : null;
            const snapshot = {
                isDraggingOver: isDraggingOverForConsumer,
                draggingOverWith: isDraggingOverForConsumer ? draggableId : null,
                draggingFromThisWith: draggableId,
                isUsingPlaceholder: true
            };
            return {
                placeholder: dragging.placeholder,
                shouldAnimatePlaceholder: false,
                snapshot,
                useClone
            };
        }
        if (!isEnabled) {
            return idleWithoutAnimation;
        }
        if (!isDraggingOverForImpact) {
            return idleWithAnimation;
        }
        const snapshot = {
            isDraggingOver: isDraggingOverForConsumer,
            draggingOverWith: draggableId,
            draggingFromThisWith: null,
            isUsingPlaceholder: true
        };
        return {
            placeholder: dragging.placeholder,
            shouldAnimatePlaceholder: true,
            snapshot,
            useClone: null
        };
    });
    const selector = (state, ownProps)=>{
        const ownPropsWithDefaultProps = attachDefaultPropsToOwnProps(ownProps);
        const id = ownPropsWithDefaultProps.droppableId;
        const type = ownPropsWithDefaultProps.type;
        const isEnabled = !ownPropsWithDefaultProps.isDropDisabled;
        const renderClone = ownPropsWithDefaultProps.renderClone;
        if (isDragging(state)) {
            const critical = state.critical;
            if (!isMatchingType(type, critical)) {
                return idleWithoutAnimation;
            }
            const dragging = getDraggable(critical, state.dimensions);
            const isDraggingOver = whatIsDraggedOver(state.impact) === id;
            return getMapProps(id, isEnabled, isDraggingOver, isDraggingOver, dragging, renderClone);
        }
        if (state.phase === 'DROP_ANIMATING') {
            const completed = state.completed;
            if (!isMatchingType(type, completed.critical)) {
                return idleWithoutAnimation;
            }
            const dragging = getDraggable(completed.critical, state.dimensions);
            return getMapProps(id, isEnabled, whatIsDraggedOverFromResult(completed.result) === id, whatIsDraggedOver(completed.impact) === id, dragging, renderClone);
        }
        if (state.phase === 'IDLE' && state.completed && !state.shouldFlush) {
            const completed = state.completed;
            if (!isMatchingType(type, completed.critical)) {
                return idleWithoutAnimation;
            }
            const wasOver = whatIsDraggedOver(completed.impact) === id;
            const wasCombining = Boolean(completed.impact.at && completed.impact.at.type === 'COMBINE');
            const isHome = completed.critical.droppable.id === id;
            if (wasOver) {
                return wasCombining ? idleWithAnimation : idleWithoutAnimation;
            }
            if (isHome) {
                return idleWithAnimation;
            }
            return idleWithoutAnimation;
        }
        return idleWithoutAnimation;
    };
    return selector;
};
const mapDispatchToProps = {
    updateViewportMaxScroll: updateViewportMaxScroll
};
const ConnectedDroppable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connect"])(makeMapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps)=>{
    return {
        ...attachDefaultPropsToOwnProps(ownProps),
        ...stateProps,
        ...dispatchProps
    };
}, {
    context: StoreContext,
    areStatePropsEqual: isStrictEqual
})(Droppable);
;
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Palette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "13.5",
            cy: "6.5",
            r: ".5",
            fill: "currentColor",
            key: "1okk4w"
        }
    ],
    [
        "circle",
        {
            cx: "17.5",
            cy: "10.5",
            r: ".5",
            fill: "currentColor",
            key: "f64h9f"
        }
    ],
    [
        "circle",
        {
            cx: "8.5",
            cy: "7.5",
            r: ".5",
            fill: "currentColor",
            key: "fotxhn"
        }
    ],
    [
        "circle",
        {
            cx: "6.5",
            cy: "12.5",
            r: ".5",
            fill: "currentColor",
            key: "qy21gx"
        }
    ],
    [
        "path",
        {
            d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
            key: "12rzf8"
        }
    ]
];
const Palette = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Palette", __iconNode);
;
 //# sourceMappingURL=palette.js.map
}),
"[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Palette",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript)");
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label,
    "Root",
    ()=>Root
]);
// packages/react/label/src/label.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
var NAME = "Label";
var Label = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].label, {
        ...props,
        ref: forwardedRef,
        onMouseDown: (event)=>{
            var _props_onMouseDown;
            const target = event.target;
            if (target.closest("button, input, select, textarea")) return;
            (_props_onMouseDown = props.onMouseDown) === null || _props_onMouseDown === void 0 ? void 0 : _props_onMouseDown.call(props, event);
            if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }
    });
});
Label.displayName = NAME;
var Root = Label;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-roving-focus/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Item",
    ()=>Item,
    "Root",
    ()=>Root,
    "RovingFocusGroup",
    ()=>RovingFocusGroup,
    "RovingFocusGroupItem",
    ()=>RovingFocusGroupItem,
    "createRovingFocusGroupScope",
    ()=>createRovingFocusGroupScope
]);
// packages/react/roving-focus/src/roving-focus-group.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-collection/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
};
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$collection$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollection"])(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(GROUP_NAME, [
    createCollectionScope
]);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Provider, {
        scope: props.__scopeRovingFocusGroup,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.Slot, {
            scope: props.__scopeRovingFocusGroup,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RovingFocusGroupImpl, {
                ...props,
                ref: forwardedRef
            })
        })
    });
});
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const composedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, ref);
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])(dir);
    const [currentTabStopId = null, setCurrentTabStopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: currentTabStopIdProp,
        defaultProp: defaultCurrentTabStopId,
        onChange: onCurrentTabStopIdChange
    });
    const [isTabbingBackOut, setIsTabbingBackOut] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const handleEntryFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(onEntryFocus);
    const getItems = useCollection(__scopeRovingFocusGroup);
    const isClickFocusRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const [focusableItemsCount, setFocusableItemsCount] = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RovingFocusGroupImpl.useEffect": ()=>{
            const node = ref.current;
            if (node) {
                node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
                return ({
                    "RovingFocusGroupImpl.useEffect": ()=>node.removeEventListener(ENTRY_FOCUS, handleEntryFocus)
                })["RovingFocusGroupImpl.useEffect"];
            }
        }
    }["RovingFocusGroupImpl.useEffect"], [
        handleEntryFocus
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RovingFocusProvider, {
        scope: __scopeRovingFocusGroup,
        orientation,
        dir: direction,
        loop,
        currentTabStopId,
        onItemFocus: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.useCallback": (tabStopId)=>setCurrentTabStopId(tabStopId)
        }["RovingFocusGroupImpl.useCallback"], [
            setCurrentTabStopId
        ]),
        onItemShiftTab: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.useCallback": ()=>setIsTabbingBackOut(true)
        }["RovingFocusGroupImpl.useCallback"], []),
        onFocusableItemAdd: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.useCallback": ()=>setFocusableItemsCount({
                    "RovingFocusGroupImpl.useCallback": (prevCount)=>prevCount + 1
                }["RovingFocusGroupImpl.useCallback"])
        }["RovingFocusGroupImpl.useCallback"], []),
        onFocusableItemRemove: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
            "RovingFocusGroupImpl.useCallback": ()=>setFocusableItemsCount({
                    "RovingFocusGroupImpl.useCallback": (prevCount)=>prevCount - 1
                }["RovingFocusGroupImpl.useCallback"])
        }["RovingFocusGroupImpl.useCallback"], []),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
            "data-orientation": orientation,
            ...groupProps,
            ref: composedRefs,
            style: {
                outline: "none",
                ...props.style
            },
            onMouseDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onMouseDown, ()=>{
                isClickFocusRef.current = true;
            }),
            onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, (event)=>{
                const isKeyboardFocus = !isClickFocusRef.current;
                if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
                    const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
                    event.currentTarget.dispatchEvent(entryFocusEvent);
                    if (!entryFocusEvent.defaultPrevented) {
                        const items = getItems().filter((item)=>item.focusable);
                        const activeItem = items.find((item)=>item.active);
                        const currentItem = items.find((item)=>item.id === currentTabStopId);
                        const candidateItems = [
                            activeItem,
                            currentItem,
                            ...items
                        ].filter(Boolean);
                        const candidateNodes = candidateItems.map((item)=>item.ref.current);
                        focusFirst(candidateNodes, preventScrollOnEntryFocus);
                    }
                }
                isClickFocusRef.current = false;
            }),
            onBlur: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onBlur, ()=>setIsTabbingBackOut(false))
        })
    });
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, ...itemProps } = props;
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove } = context;
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "RovingFocusGroupItem.useEffect": ()=>{
            if (focusable) {
                onFocusableItemAdd();
                return ({
                    "RovingFocusGroupItem.useEffect": ()=>onFocusableItemRemove()
                })["RovingFocusGroupItem.useEffect"];
            }
        }
    }["RovingFocusGroupItem.useEffect"], [
        focusable,
        onFocusableItemAdd,
        onFocusableItemRemove
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Collection.ItemSlot, {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onMouseDown, (event)=>{
                if (!focusable) event.preventDefault();
                else context.onItemFocus(id);
            }),
            onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, ()=>context.onItemFocus(id)),
            onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                if (event.key === "Tab" && event.shiftKey) {
                    context.onItemShiftTab();
                    return;
                }
                if (event.target !== event.currentTarget) return;
                const focusIntent = getFocusIntent(event, context.orientation, context.dir);
                if (focusIntent !== void 0) {
                    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                    event.preventDefault();
                    const items = getItems().filter((item)=>item.focusable);
                    let candidateNodes = items.map((item)=>item.ref.current);
                    if (focusIntent === "last") candidateNodes.reverse();
                    else if (focusIntent === "prev" || focusIntent === "next") {
                        if (focusIntent === "prev") candidateNodes.reverse();
                        const currentIndex = candidateNodes.indexOf(event.currentTarget);
                        candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                    }
                    setTimeout(()=>focusFirst(candidateNodes));
                }
            })
        })
    });
});
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
};
function getDirectionAwareKey(key, dir) {
    if (dir !== "rtl") return key;
    return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
    const key = getDirectionAwareKey(event.key, dir);
    if (orientation === "vertical" && [
        "ArrowLeft",
        "ArrowRight"
    ].includes(key)) return void 0;
    if (orientation === "horizontal" && [
        "ArrowUp",
        "ArrowDown"
    ].includes(key)) return void 0;
    return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates) {
    let preventScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates){
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
        candidate.focus({
            preventScroll
        });
        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
}
function wrapArray(array, startIndex) {
    return array.map((_, index)=>array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/tab_videos/download (2)/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>Content,
    "List",
    ()=>List,
    "Root",
    ()=>Root2,
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger,
    "Trigger",
    ()=>Trigger,
    "createTabsScope",
    ()=>createTabsScope
]);
// packages/react/tabs/src/tabs.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-context/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-roving-focus/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-presence/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-direction/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-id/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$context$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextScope"])(TABS_NAME, [
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRovingFocusGroupScope"]
]);
var useRovingFocusGroupScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRovingFocusGroupScope"])();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeTabs, value: valueProp, onValueChange, defaultValue, orientation = "horizontal", dir, activationMode = "automatic", ...tabsProps } = props;
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$direction$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])(dir);
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$controllable$2d$state$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControllableState"])({
        prop: valueProp,
        onChange: onValueChange,
        defaultProp: defaultValue
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(TabsProvider, {
        scope: __scopeTabs,
        baseId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$id$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
        })
    });
});
Tabs.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
        })
    });
});
TabsList.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$roving$2d$focus$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onMouseDown, (event)=>{
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                    context.onValueChange(value);
                } else {
                    event.preventDefault();
                }
            }),
            onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onKeyDown, (event)=>{
                if ([
                    " ",
                    "Enter"
                ].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onFocus, ()=>{
                const isAutomaticActivation = context.activationMode !== "manual";
                if (!isSelected && !disabled && isAutomaticActivation) {
                    context.onValueChange(value);
                }
            })
        })
    });
});
TabsTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](isSelected);
    __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "TabsContent.useEffect": ()=>{
            const rAF = requestAnimationFrame({
                "TabsContent.useEffect.rAF": ()=>isMountAnimationPreventedRef.current = false
            }["TabsContent.useEffect.rAF"]);
            return ({
                "TabsContent.useEffect": ()=>cancelAnimationFrame(rAF)
            })["TabsContent.useEffect"];
        }
    }["TabsContent.useEffect"], []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$presence$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Presence"], {
        present: forceMount || isSelected,
        children: (param)=>{
            let { present } = param;
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
                "data-state": isSelected ? "active" : "inactive",
                "data-orientation": context.orientation,
                role: "tabpanel",
                "aria-labelledby": triggerId,
                hidden: !present,
                id: contentId,
                tabIndex: 0,
                ...contentProps,
                ref: forwardedRef,
                style: {
                    ...props.style,
                    animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
                },
                children: present && children
            });
        }
    });
});
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
    return "".concat(baseId, "-trigger-").concat(value);
}
function makeContentId(baseId, value) {
    return "".concat(baseId, "-content-").concat(value);
}
var Root2 = Tabs;
var List = TabsList;
var Trigger = TabsTrigger;
var Content = TabsContent;
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=d4678_622d462b._.js.map