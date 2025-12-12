(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "DEFAULT_COLORS",
    ()=>DEFAULT_COLORS,
    "useAppContext",
    ()=>useAppContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DEFAULT_COLORS = {
    cardColor: "#1E1E1E",
    fingerColor: "#FFFFFF",
    fretboardColor: "#333333",
    borderColor: "#FFFFFF",
    textColor: "#FFFFFF",
    borderWidth: 0,
    stringThickness: 2,
    fingerTextColor: "#000000",
    fingerBorderColor: "#FFFFFF",
    fingerBorderWidth: 1,
    fingerBoxShadowHOffset: 0,
    fingerBoxShadowVOffset: 0,
    fingerBoxShadowBlur: 0,
    fingerBoxShadowSpread: 0,
    fingerBoxShadowColor: "rgba(0,0,0,0)",
    fingerOpacity: 1
};
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppProvider(param) {
    let { children } = param;
    _s();
    const [selectedChords, setSelectedChords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [colors, setColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_COLORS);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            selectedChords,
            setSelectedChords,
            colors,
            setColors
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/app/context/app--context.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(AppProvider, "EnllhWARf9CpJJeb5b17b+HVpxo=");
_c = AppProvider;
function useAppContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
_s1(useAppContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, type, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>Accordion,
    "AccordionContent",
    ()=>AccordionContent,
    "AccordionItem",
    ()=>AccordionItem,
    "AccordionTrigger",
    ()=>AccordionTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Accordion = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AccordionItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = AccordionItem;
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = (param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 shrink-0 transition-transform duration-200"
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
                    lineNumber: 37,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = AccordionTrigger;
AccordionTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const AccordionContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = (param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pb-4 pt-0", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
            lineNumber: 52,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/accordion.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c5 = AccordionContent;
AccordionContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "AccordionItem$React.forwardRef");
__turbopack_context__.k.register(_c1, "AccordionItem");
__turbopack_context__.k.register(_c2, "AccordionTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "AccordionTrigger");
__turbopack_context__.k.register(_c4, "AccordionContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "AccordionContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(param) {
    let { className, variant, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/badge.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/lib/chords.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "basses",
    ()=>basses,
    "chordData",
    ()=>chordData,
    "complements",
    ()=>complements,
    "getBasse",
    ()=>getBasse,
    "getComplement",
    ()=>getComplement,
    "getNome",
    ()=>getNome,
    "getNote",
    ()=>getNote,
    "notes",
    ()=>notes
]);
const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];
const complements = [
    'Major',
    'm',
    '7',
    'm7',
    '7+',
    'm7(b5)',
    '6',
    'm6',
    'm7(9)',
    '7(#5)',
    '°'
];
const basses = [
    'Tonica',
    '/2',
    '/3',
    '/4',
    '/5',
    '/6',
    '/7',
    '/8',
    '/9',
    '/10',
    '/11',
    '/12'
];
const getNote = (value)=>{
    return notes.indexOf(value);
};
const getComplement = (value)=>{
    return complements.indexOf(value);
};
const getBasse = (value)=>{
    return basses.indexOf(value);
};
const getNome = (param)=>{
    let { note, complement, bass } = param;
    return notes[note] + (complements[complement] || '') + (bass > 0 ? basses[bass] : '');
};
const chordData = [
    {
        chord: {
            note: getNote('E'),
            complement: getComplement('Major'),
            bass: 0
        },
        positions: {
            2: [
                2,
                2,
                1
            ],
            3: [
                2,
                3,
                1
            ],
            4: [
                1,
                1,
                1
            ]
        },
        avoid: [],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('E')
    },
    {
        chord: {
            note: getNote('B'),
            complement: getComplement('m7(9)'),
            bass: 0
        },
        positions: {
            2: [
                2,
                2,
                1
            ],
            4: [
                2,
                3,
                1
            ],
            5: [
                2,
                4,
                1
            ]
        },
        avoid: [
            1,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('B')
    },
    {
        chord: {
            note: getNote('E'),
            complement: getComplement('m7'),
            bass: 0
        },
        positions: {
            2: [
                2,
                2,
                0
            ]
        },
        avoid: [],
        nut: {
            vis: true,
            str: [
                1,
                6
            ],
            pos: 0,
            fin: 1,
            add: true,
            trn: 0
        },
        origin: getNote('E')
    },
    {
        chord: {
            note: getNote('A'),
            complement: getComplement('m7(b5)'),
            bass: 0
        },
        positions: {
            3: [
                1,
                2,
                1
            ],
            4: [
                0,
                1,
                0
            ],
            5: [
                1,
                3,
                1
            ]
        },
        avoid: [
            1,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('A')
    },
    {
        chord: {
            note: getNote('A'),
            complement: getComplement('7'),
            bass: 0
        },
        positions: {
            4: [
                6,
                1,
                1
            ],
            5: [
                8,
                3,
                1
            ],
            6: [
                9,
                4,
                1
            ]
        },
        avoid: [
            1,
            3
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('A')
    },
    {
        chord: {
            note: getNote('F'),
            complement: getComplement('m6'),
            bass: 0
        },
        positions: {
            1: [
                1,
                2,
                1
            ],
            4: [
                1,
                3,
                1
            ],
            5: [
                1,
                4,
                1
            ]
        },
        avoid: [
            2,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('F')
    },
    {
        chord: {
            note: getNote('F'),
            complement: getComplement('m7'),
            bass: 0
        },
        positions: {
            1: [
                1,
                1,
                0
            ],
            3: [
                1,
                2,
                0
            ],
            4: [
                1,
                3,
                0
            ],
            5: [
                1,
                4,
                0
            ]
        },
        avoid: [
            2,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('F')
    },
    {
        chord: {
            note: getNote('A#'),
            complement: getComplement('m7(b5)'),
            bass: 0
        },
        positions: {
            2: [
                1,
                2,
                1
            ],
            4: [
                1,
                3,
                1
            ],
            5: [
                2,
                4,
                1
            ],
            6: [
                0,
                1,
                0
            ]
        },
        avoid: [
            1,
            3
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('A#')
    },
    {
        chord: {
            note: getNote('E'),
            complement: getComplement('7'),
            bass: 0
        },
        positions: {
            1: [
                0,
                -2,
                0
            ],
            3: [
                0,
                -1,
                0
            ],
            4: [
                1,
                1,
                1
            ],
            5: [
                0,
                0,
                0
            ]
        },
        avoid: [
            2,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('E')
    },
    {
        chord: {
            note: getNote('A'),
            complement: getComplement('Major'),
            bass: 0
        },
        positions: {
            3: [
                2,
                2,
                1
            ],
            4: [
                2,
                3,
                1
            ],
            5: [
                2,
                1,
                1
            ]
        },
        avoid: [
            1
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('A')
    },
    {
        chord: {
            note: getNote('D'),
            complement: getComplement('Major'),
            bass: 0
        },
        positions: {
            4: [
                2,
                1,
                1
            ],
            5: [
                3,
                3,
                1
            ],
            6: [
                2,
                2,
                1
            ]
        },
        avoid: [
            1,
            2
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('D')
    },
    {
        chord: {
            note: getNote('G'),
            complement: getComplement('Major'),
            bass: 0
        },
        positions: {
            1: [
                3,
                3,
                1
            ],
            2: [
                2,
                2,
                1
            ],
            6: [
                3,
                4,
                1
            ]
        },
        avoid: [],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('G')
    },
    {
        chord: {
            note: getNote('F'),
            complement: getComplement('°'),
            bass: 0
        },
        positions: {
            1: [
                1,
                1,
                1
            ],
            3: [
                1,
                2,
                1
            ],
            5: [
                1,
                3,
                1
            ]
        },
        avoid: [
            2,
            4,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('F')
    },
    {
        chord: {
            note: getNote('A'),
            complement: getComplement('°'),
            bass: 0
        },
        positions: {
            2: [
                1,
                1,
                1
            ],
            4: [
                2,
                2,
                1
            ],
            6: [
                1,
                3,
                1
            ]
        },
        avoid: [
            1,
            3,
            5
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('A')
    },
    {
        chord: {
            note: getNote('D'),
            complement: getComplement('°'),
            bass: 0
        },
        positions: {
            1: [
                1,
                1,
                1
            ],
            3: [
                2,
                2,
                1
            ],
            5: [
                1,
                3,
                1
            ]
        },
        avoid: [
            2,
            4,
            6
        ],
        nut: {
            vis: false,
            str: [
                0,
                0
            ],
            pos: 0,
            fin: 0,
            add: false,
            trn: 1
        },
        origin: getNote('D')
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChordDiagram",
    ()=>ChordDiagram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/chords.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ChordDiagram = (props)=>{
    _s();
    const { positions, nut, barre, avoid, list } = props;
    var _props_scale;
    const scale = (_props_scale = props.scale) !== null && _props_scale !== void 0 ? _props_scale : list ? 0.3 : 1;
    const stringNames = [
        "E",
        "A",
        "D",
        "G",
        "B",
        "e"
    ];
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const findMinNonZeroNote = (positions, avoid, nut)=>{
        let min = Infinity;
        let max = 0;
        if (nut && nut.vis) {
            min = nut.pos;
        }
        Object.entries(positions).forEach((param)=>{
            let [str, [fret]] = param;
            const stringNumber = parseInt(str);
            if (fret > 0 && !avoid.includes(stringNumber)) {
                if (fret < min) {
                    min = fret;
                }
                if (fret > max) {
                    max = fret;
                }
            }
        });
        return [
            min === Infinity ? 0 : min,
            max
        ];
    };
    const transposeForDisplay = ()=>{
        const [minFret, maxFret] = findMinNonZeroNote(positions, avoid, nut);
        if (maxFret <= 5 && (!nut || !nut.vis || nut.pos <= 5)) {
            var _props_transport;
            return {
                finalPositions: positions,
                finalNut: nut,
                transportDisplay: (_props_transport = props.transport) !== null && _props_transport !== void 0 ? _props_transport : 0
            };
        }
        const transposition = nut && nut.vis ? nut.pos - 1 : minFret > 0 ? minFret - 1 : 0;
        const newPositions = {};
        for(const string in positions){
            const [fret, finger, add] = positions[string];
            newPositions[string] = [
                fret > 0 ? fret - transposition : 0,
                finger,
                add
            ];
        }
        const newNut = nut && nut.vis ? {
            ...nut,
            pos: nut.pos - transposition
        } : nut;
        return {
            finalPositions: newPositions,
            finalNut: newNut,
            transportDisplay: transposition + 1
        };
    };
    var _props_transport;
    const { finalPositions, finalNut, transportDisplay } = list ? {
        finalPositions: positions,
        finalNut: nut,
        transportDisplay: (_props_transport = props.transport) !== null && _props_transport !== void 0 ? _props_transport : 0
    } : transposeForDisplay();
    const fingerBoxShadow = "".concat(colors.fingerBoxShadowHOffset, "px ").concat(colors.fingerBoxShadowVOffset, "px ").concat(colors.fingerBoxShadowBlur, "px ").concat(colors.fingerBoxShadowSpread, "px ").concat(colors.fingerBoxShadowColor);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg overflow-hidden",
        style: {
            backgroundColor: colors.cardColor,
            borderWidth: "".concat(colors.borderWidth, "px"),
            borderColor: colors.borderColor,
            borderRadius: '10px',
            width: "".concat(350 * scale, "px"),
            height: "".concat(370 * scale, "px")
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "chord",
            style: {
                transform: "scale(".concat(scale, ")"),
                transformOrigin: 'top left'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chord-diagram",
                children: [
                    transportDisplay > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "transpose",
                        style: {
                            backgroundColor: colors.cardColor,
                            color: colors.textColor
                        },
                        children: "".concat(transportDisplay, "ª")
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                        lineNumber: 66,
                        columnNumber: 34
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chord-name",
                        style: {
                            color: colors.textColor
                        },
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNome"])(props.chord)
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "neck",
                        style: {
                            backgroundColor: colors.fretboardColor,
                            borderWidth: "".concat(colors.borderWidth, "px"),
                            borderColor: colors.borderColor
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "nut-line",
                                style: {
                                    backgroundColor: colors.borderColor,
                                    height: "".concat(colors.stringThickness, "px")
                                }
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            [
                                ...Array(5)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fret",
                                    style: {
                                        top: "".concat(40 + 50 * i, "px"),
                                        backgroundColor: colors.borderColor,
                                        height: "".concat(2, "px")
                                    }
                                }, i, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))),
                            stringNames.map((name, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "string",
                                    style: {
                                        left: "".concat(40 * i + 10, "px"),
                                        backgroundColor: colors.borderColor,
                                        width: "".concat(colors.stringThickness, "px")
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "string-name",
                                            style: {
                                                color: colors.textColor
                                            },
                                            children: name
                                        }, void 0, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        finalNut && finalNut.vis && finalNut.str && finalNut.str[0] === i + 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "finger barre",
                                            style: {
                                                top: "".concat(50 * finalNut.pos - 42, "px"),
                                                width: "".concat(34 + 40 * (finalNut.str[1] - finalNut.str[0]), "px"),
                                                backgroundColor: colors.fingerColor,
                                                color: colors.fingerTextColor,
                                                borderColor: colors.fingerBorderColor,
                                                borderWidth: "".concat(colors.fingerBorderWidth, "px"),
                                                boxShadow: fingerBoxShadow,
                                                opacity: colors.fingerOpacity
                                            },
                                            children: finalNut.fin
                                        }, void 0, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        finalPositions[i + 1] && finalPositions[i + 1][0] > 0 && (!finalNut || !finalNut.vis || finalPositions[i + 1][1] !== finalNut.fin) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "finger",
                                            style: {
                                                top: "".concat(50 * finalPositions[i + 1][0] - 42, "px"),
                                                backgroundColor: colors.fingerColor,
                                                color: colors.fingerTextColor,
                                                borderColor: colors.fingerBorderColor,
                                                borderWidth: "".concat(colors.fingerBorderWidth, "px"),
                                                boxShadow: fingerBoxShadow,
                                                opacity: colors.fingerOpacity
                                            },
                                            children: finalPositions[i + 1][1]
                                        }, void 0, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        avoid && avoid.includes(i + 1) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "avoid",
                                            style: {
                                                color: colors.textColor
                                            },
                                            children: "x"
                                        }, void 0, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                            lineNumber: 86,
                                            columnNumber: 50
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, i, true, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))),
                            barre && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "barre",
                                style: {
                                    top: "".concat(60 * barre[0] - 20, "px"),
                                    left: "".concat(44 * (barre[1] - 1) + 40, "px"),
                                    width: "".concat(44 * (barre[1] - 1), "px"),
                                    backgroundColor: colors.fingerColor,
                                    borderColor: colors.fingerBorderColor,
                                    borderWidth: "".concat(colors.fingerBorderWidth, "px"),
                                    boxShadow: fingerBoxShadow,
                                    opacity: colors.fingerOpacity
                                }
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
                lineNumber: 65,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
            lineNumber: 64,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ChordDiagram, "b1J8Qp+Vqf3S3P942kYRgPkzfp0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"]
    ];
});
_c = ChordDiagram;
;
var _c;
__turbopack_context__.k.register(_c, "ChordDiagram");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/app/library-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryPanel",
    ()=>LibraryPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/accordion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/chords.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const categories = [
    "All",
    "Major",
    "Minor",
    "7th"
];
function LibraryPanel() {
    _s();
    const { selectedChords, setSelectedChords } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleChordSelect = (chord)=>{
        setSelectedChords((prev)=>[
                ...prev,
                chord
            ]);
        toast({
            title: "".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNome"])(chord.chord), " added")
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "flex h-full w-80 flex-col bg-panel border-r border-l shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-white mb-4",
                        children: "Library"
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Search Library...",
                                className: "pl-10 h-10 bg-input rounded-lg"
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 overflow-x-auto pb-2",
                    children: categories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: index === 0 ? "default" : "secondary",
                            className: "cursor-pointer shrink-0 ".concat(index === 0 ? "bg-accent text-accent-foreground hover:bg-accent/80" : "bg-input text-foreground hover:bg-primary/50"),
                            children: category
                        }, category, false, {
                            fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Accordion"], {
                    type: "single",
                    collapsible: true,
                    defaultValue: "item-1",
                    className: "w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"], {
                        value: "item-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"], {
                                className: "px-4 text-base font-semibold",
                                children: "Chords"
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 p-4",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chordData"].map((chord, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "group relative cursor-pointer rounded-lg overflow-hidden w-[105px] h-[111px]",
                                            onClick: ()=>handleChordSelect(chord),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChordDiagram"], {
                                                    ...chord,
                                                    scale: 0.3
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "absolute bottom-2 left-2 text-sm font-bold text-white line-clamp-2",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$chords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNome"])(chord.chord)
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, JSON.stringify(chord.chord), true, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                            lineNumber: 69,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/tab_videos/download (2)/src/components/app/library-panel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(LibraryPanel, "0gnTmjBChCKbwfJqV0T+Ka86vD4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = LibraryPanel;
var _c;
__turbopack_context__.k.register(_c, "LibraryPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/app/main-stage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainStage",
    ()=>MainStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/maximize.js [app-client] (ecmascript) <export default as Maximize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function MainStage() {
    _s();
    const { selectedChords } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const currentChord = selectedChords[selectedChords.length - 1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 flex flex-col bg-toolbar p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 text-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "100%"
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-foreground hover:bg-primary/50 hover:text-primary-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__["Maximize"], {}, void 0, false, {
                                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 bg-black rounded-lg w-[525px] h-[555px] overflow-hidden",
                children: currentChord ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChordDiagram"], {
                    ...currentChord,
                    scale: 1.5
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                    lineNumber: 52,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "Select a chord from the library to get started"
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                    lineNumber: 54,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/tab_videos/download (2)/src/components/app/main-stage.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(MainStage, "YuAGBSglbWivULrqFU/WfOQircQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"]
    ];
});
_c = MainStage;
var _c;
__turbopack_context__.k.register(_c, "MainStage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SelectedChordsPanel",
    ()=>SelectedChordsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/app/chord-diagram.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@hello-pangea/dnd/dist/dnd.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SelectedChordsPanel() {
    _s();
    const { selectedChords, setSelectedChords } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const [chords, setChords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedChordIndex, setSelectedChordIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SelectedChordsPanel.useEffect": ()=>{
            setChords(selectedChords);
        }
    }["SelectedChordsPanel.useEffect"], [
        selectedChords
    ]);
    const handleOnDragEnd = (result)=>{
        if (!result.destination) return;
        const items = Array.from(chords);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setChords(items);
        setSelectedChords(items);
    };
    const handleDeleteChord = (index)=>{
        const updatedChords = chords.filter((_, i)=>i !== index);
        setChords(updatedChords);
        setSelectedChords(updatedChords);
        setSelectedChordIndex(null);
    };
    const handleItemClick = (index)=>{
        if (selectedChordIndex === index) {
            handleDeleteChord(index);
        } else {
            setSelectedChordIndex(index);
        }
    };
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SelectedChordsPanel.useEffect": ()=>{
            const handleClickOutside = {
                "SelectedChordsPanel.useEffect.handleClickOutside": (event)=>{
                    if (containerRef.current && !containerRef.current.contains(event.target)) {
                        setSelectedChordIndex(null);
                    }
                }
            }["SelectedChordsPanel.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "SelectedChordsPanel.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            })["SelectedChordsPanel.useEffect"];
        }
    }["SelectedChordsPanel.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-64 shrink-0 bg-panel border-t p-4 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                        className: "h-4 w-4 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold text-white",
                        children: "Selected Chords"
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 relative overflow-x-auto overflow-y-hidden",
                ref: containerRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragDropContext"], {
                    onDragEnd: handleOnDragEnd,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Droppable"], {
                        droppableId: "chords",
                        direction: "horizontal",
                        children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ...provided.droppableProps,
                                ref: provided.innerRef,
                                className: "absolute inset-0 flex items-center p-2",
                                children: [
                                    chords.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex items-center justify-center h-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: "Your selected chords will appear here."
                                        }, void 0, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                            lineNumber: 74,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                        lineNumber: 73,
                                        columnNumber: 29
                                    }, this),
                                    chords.map((chord, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Draggable"], {
                                            draggableId: "chord-".concat(index),
                                            index: index,
                                            children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: provided.innerRef,
                                                    ...provided.draggableProps,
                                                    ...provided.dragHandleProps,
                                                    className: "group relative bg-toolbar p-2 rounded-lg overflow-hidden w-[175px] h-[185px]",
                                                    onClick: ()=>handleItemClick(index),
                                                    children: [
                                                        "                                                                                                                    ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                                                            className: "h-6 w-6 text-muted-foreground cursor-grab"
                                                        }, void 0, false, {
                                                            fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                            lineNumber: 86,
                                                            columnNumber: 266
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: '175px',
                                                                height: '185px',
                                                                overflow: 'hidden'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$app$2f$chord$2d$diagram$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChordDiagram"], {
                                                                ...chord,
                                                                scale: 0.5
                                                            }, void 0, false, {
                                                                fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                                lineNumber: 88,
                                                                columnNumber: 121
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                            lineNumber: 87,
                                                            columnNumber: 117
                                                        }, this),
                                                        "                                         ",
                                                        selectedChordIndex === index && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "destructive",
                                                            size: "icon",
                                                            className: "absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-destructive/80 hover:text-destructive-foreground",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDeleteChord(index);
                                                            },
                                                            "aria-label": "Delete chord",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                                lineNumber: 100,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                            lineNumber: 90,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                                    lineNumber: 80,
                                                    columnNumber: 149
                                                }, this)
                                        }, index, false, {
                                            fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                            lineNumber: 78,
                                            columnNumber: 29
                                        }, this)),
                                    provided.placeholder
                                ]
                            }, void 0, true, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                                lineNumber: 71,
                                columnNumber: 21
                            }, this)
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/tab_videos/download (2)/src/components/app/selected-chords-panel.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(SelectedChordsPanel, "nFw6bb28gjZFQeE5cHNMhPzM8I0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"]
    ];
});
_c = SelectedChordsPanel;
var _c;
__turbopack_context__.k.register(_c, "SelectedChordsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/label.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/ui/tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const TabsList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/tabs.tsx",
        lineNumber: 14,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = TabsList;
TabsList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"].displayName;
const TabsTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/tabs.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = TabsTrigger;
TabsTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const TabsContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/tab_videos/download (2)/src/components/ui/tabs.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c5 = TabsContent;
TabsContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "TabsList$React.forwardRef");
__turbopack_context__.k.register(_c1, "TabsList");
__turbopack_context__.k.register(_c2, "TabsTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "TabsTrigger");
__turbopack_context__.k.register(_c4, "TabsContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "TabsContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsPanel",
    ()=>SettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tab_videos/download (2)/src/app/context/app--context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SettingsPanel() {
    _s();
    const { colors, setColors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const handleColorChange = (key, value)=>{
        setColors((prev)=>({
                ...prev,
                [key]: value
            }));
    };
    const handleResetToDefault = ()=>{
        setColors(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLORS"]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "flex h-full w-80 flex-col bg-panel border-l shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {}, void 0, false, {
                            fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        "Customize"
                    ]
                }, void 0, true, {
                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                        defaultValue: "general",
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                className: "grid w-full grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "general",
                                        children: "General"
                                    }, void 0, false, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "fingers",
                                        children: "Fingers"
                                    }, void 0, false, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                value: "general",
                                className: "space-y-4 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "cardColor",
                                                children: "Background"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 42,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "cardColor",
                                                    type: "color",
                                                    value: colors.cardColor,
                                                    onChange: (e)=>handleColorChange("cardColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 43,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fretboardColor",
                                                children: "Guitar Neck"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 54,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "fretboardColor",
                                                    type: "color",
                                                    value: colors.fretboardColor,
                                                    onChange: (e)=>handleColorChange("fretboardColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 55,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "borderColor",
                                                children: "Borders"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 66,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "borderColor",
                                                    type: "color",
                                                    value: colors.borderColor,
                                                    onChange: (e)=>handleColorChange("borderColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 67,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "textColor",
                                                children: "Text"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 78,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "textColor",
                                                    type: "color",
                                                    value: colors.textColor,
                                                    onChange: (e)=>handleColorChange("textColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 80,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 79,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "borderWidth",
                                                children: "Border Width"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 90,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "borderWidth",
                                                type: "number",
                                                value: colors.borderWidth,
                                                onChange: (e)=>handleColorChange("borderWidth", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "stringThickness",
                                                children: "String Thickness"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 100,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "stringThickness",
                                                type: "number",
                                                value: colors.stringThickness,
                                                onChange: (e)=>handleColorChange("stringThickness", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                value: "fingers",
                                className: "space-y-4 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerColor",
                                                children: "Background"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "fingerColor",
                                                    type: "color",
                                                    value: colors.fingerColor,
                                                    onChange: (e)=>handleColorChange("fingerColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerTextColor",
                                                children: "Text"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 124,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "fingerTextColor",
                                                    type: "color",
                                                    value: colors.fingerTextColor,
                                                    onChange: (e)=>handleColorChange("fingerTextColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBorderColor",
                                                children: "Border"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "fingerBorderColor",
                                                    type: "color",
                                                    value: colors.fingerBorderColor,
                                                    onChange: (e)=>handleColorChange("fingerBorderColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBorderWidth",
                                                children: "Border Width"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 148,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerBorderWidth",
                                                type: "number",
                                                value: colors.fingerBorderWidth,
                                                onChange: (e)=>handleColorChange("fingerBorderWidth", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 149,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBoxShadowHOffset",
                                                children: "Shadow H-Offset"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerBoxShadowHOffset",
                                                type: "number",
                                                value: colors.fingerBoxShadowHOffset,
                                                onChange: (e)=>handleColorChange("fingerBoxShadowHOffset", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 159,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBoxShadowVOffset",
                                                children: "Shadow V-Offset"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 168,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerBoxShadowVOffset",
                                                type: "number",
                                                value: colors.fingerBoxShadowVOffset,
                                                onChange: (e)=>handleColorChange("fingerBoxShadowVOffset", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 169,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBoxShadowBlur",
                                                children: "Shadow Blur"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 178,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerBoxShadowBlur",
                                                type: "number",
                                                value: colors.fingerBoxShadowBlur,
                                                onChange: (e)=>handleColorChange("fingerBoxShadowBlur", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBoxShadowSpread",
                                                children: "Shadow Spread"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 188,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerBoxShadowSpread",
                                                type: "number",
                                                value: colors.fingerBoxShadowSpread,
                                                onChange: (e)=>handleColorChange("fingerBoxShadowSpread", parseInt(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 189,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerBoxShadowColor",
                                                children: "Shadow Color"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "fingerBoxShadowColor",
                                                    type: "color",
                                                    value: colors.fingerBoxShadowColor,
                                                    onChange: (e)=>handleColorChange("fingerBoxShadowColor", e.target.value),
                                                    className: "w-10 h-10 p-1 bg-input border-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "fingerOpacity",
                                                children: "Opacity"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 210,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "fingerOpacity",
                                                type: "number",
                                                min: "0",
                                                max: "1",
                                                step: "0.05",
                                                value: colors.fingerOpacity,
                                                onChange: (e)=>handleColorChange("fingerOpacity", parseFloat(e.target.value)),
                                                className: "w-20 bg-input"
                                            }, void 0, false, {
                                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                                lineNumber: 211,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleResetToDefault,
                        className: "w-full mt-4",
                        children: "Reset to Default"
                    }, void 0, false, {
                        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/tab_videos/download (2)/src/components/app/settings-panel.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(SettingsPanel, "V/1E66m1e40HfE6VBPXvRRKfHBQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$tab_videos$2f$download__$28$2$292f$src$2f$app$2f$context$2f$app$2d2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"]
    ];
});
_c = SettingsPanel;
var _c;
__turbopack_context__.k.register(_c, "SettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=tab_videos_download%20%282%29_src_6ae0b261._.js.map