/**
 * 🛠️ Timeline Utils
 * Funções utilitárias para a timeline
 */

/**
 * Converte tempo em ms para formato legível
 */
export function formatTimeMs(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const decimals = Math.floor((totalSeconds % 1) * 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${decimals}`;
}

/**
 * Converte posição X para tempo em ms
 */
export function xToTime(x: number, zoom: number): number {
  return Math.max(0, (x / zoom) * 1000);
}

/**
 * Converte tempo em ms para posição X
 */
export function timeToX(time: number, zoom: number): number {
  return (time / 1000) * zoom;
}

/**
 * Arredonda tempo para o grid mais próximo
 */
export function snapToGrid(time: number, gridSize: number = 100): number {
  return Math.round(time / gridSize) * gridSize;
}

/**
 * Gera ID único para clip
 */
export function generateClipId(): string {
  return `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Limita valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
