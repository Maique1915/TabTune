export type EasingFn = (t: number) => number;

export const linear: EasingFn = (t) => clamp01(t);

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(t: number): number {
  return clamp(t, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const easeInOutQuad: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
};

export const easeInOutCubic: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// --- “Anime-like” easings (pure functions) ---

export function easeOutBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t) - 1;
    return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
  };
}

export function easeInBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t);
    return (overshoot + 1) * x * x * x - overshoot * x * x;
  };
}

export function easeInOutBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t);
    const c = overshoot * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c + 1) * 2 * x - c)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c + 1) * (2 * x - 2) + c) + 2) / 2;
  };
}

export function easeOutElastic(amplitude = 1, period = 0.3): EasingFn {
  return (t) => {
    const x = clamp01(t);
    if (x === 0 || x === 1) return x;

    let a = amplitude;
    let p = period;
    if (p <= 0) p = 0.3;

    let s: number;
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }

    return a * Math.pow(2, -10 * x) * Math.sin(((x - s) * (2 * Math.PI)) / p) + 1;
  };
}

export function easeInElastic(amplitude = 1, period = 0.3): EasingFn {
  const out = easeOutElastic(amplitude, period);
  return (t) => 1 - out(1 - clamp01(t));
}

export function easeInOutElastic(amplitude = 1, period = 0.45): EasingFn {
  const out = easeOutElastic(amplitude, period);
  return (t) => {
    const x = clamp01(t);
    return x < 0.5 ? (1 - out(1 - 2 * x)) / 2 : (1 + out(2 * x - 1)) / 2;
  };
}

export const easeOutBounce: EasingFn = (t) => {
  const x = clamp01(t);
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) {
    const y = x - 1.5 / d1;
    return n1 * y * y + 0.75;
  }
  if (x < 2.5 / d1) {
    const y = x - 2.25 / d1;
    return n1 * y * y + 0.9375;
  }
  const y = x - 2.625 / d1;
  return n1 * y * y + 0.984375;
};

export const easeInBounce: EasingFn = (t) => 1 - easeOutBounce(1 - clamp01(t));

export const easeInOutBounce: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
};

// --- small helpers for building animation curves ---

export function pingPong(t: number): number {
  const x = clamp01(t);
  return 1 - Math.abs(2 * x - 1);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clampResult = false
): number {
  if (inMin === inMax) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  const mapped = outMin + (outMax - outMin) * t;
  if (!clampResult) return mapped;
  return outMin < outMax ? clamp(mapped, outMin, outMax) : clamp(mapped, outMax, outMin);
}

export function fadeIn(t: number, easing: EasingFn = (x) => x): number {
  return easing(clamp01(t));
}

export function fadeOut(t: number, easing: EasingFn = (x) => x): number {
  return 1 - easing(clamp01(t));
}

/**
 * Zoom in: cresce (ex.: 1 -> 1.5).
 * Útil para "sumir" (com opacidade caindo) ou dar destaque.
 */
export function zoomIn(t: number, fromScale = 1, toScale = 1.5, easing: EasingFn = (x) => x): number {
  return lerp(fromScale, toScale, easing(clamp01(t)));
}

/**
 * Zoom out: diminui (ex.: 1.5 -> 1).
 * Útil para "aparecer" (com opacidade subindo).
 */
export function zoomOut(t: number, fromScale = 1.5, toScale = 1, easing: EasingFn = (x) => x): number {
  return lerp(fromScale, toScale, easing(clamp01(t)));
}

export function slide(t: number, from: number, to: number, easing: EasingFn = (x) => x): number {
  return lerp(from, to, easing(clamp01(t)));
}

export interface CanvasTransform {
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

/**
 * Aplica opacidade/escala/translação simples e executa o draw.
 * Não muda o ponto de origem da escala (escala em torno do (0,0)).
 */
export function withCanvasTransform(
  ctx: CanvasRenderingContext2D,
  transform: CanvasTransform,
  draw: () => void
): void {
  ctx.save();

  if (typeof transform.opacity === "number") ctx.globalAlpha = transform.opacity;
  if (typeof transform.translateX === "number" || typeof transform.translateY === "number") {
    ctx.translate(transform.translateX ?? 0, transform.translateY ?? 0);
  }
  if (typeof transform.scale === "number") ctx.scale(transform.scale, transform.scale);

  draw();
  ctx.restore();
}

/**
 * Escala em torno de um ponto (centerX, centerY) enquanto o draw desenha em coordenadas normais.
 */
export function withCanvasTransformAround(
  ctx: CanvasRenderingContext2D,
  params: { centerX: number; centerY: number; opacity?: number; scale?: number },
  draw: () => void
): void {
  ctx.save();
  if (typeof params.opacity === "number") ctx.globalAlpha = params.opacity;

  const scale = params.scale ?? 1;
  ctx.translate(params.centerX, params.centerY);
  ctx.scale(scale, scale);
  ctx.translate(-params.centerX, -params.centerY);

  draw();
  ctx.restore();
}

/**
 * Desenha algo que é renderizado em (0,0) (ex.: dedo e "x") no ponto (x,y), com escala/opacidade.
 */
export function withCanvasTransformAtPoint(
  ctx: CanvasRenderingContext2D,
  params: { x: number; y: number; opacity?: number; scale?: number },
  drawAtOrigin: () => void
): void {
  ctx.save();
  if (typeof params.opacity === "number") ctx.globalAlpha = params.opacity;

  const scale = params.scale ?? 1;
  ctx.translate(params.x, params.y);
  ctx.scale(scale, scale);

  drawAtOrigin();
  ctx.restore();
}
