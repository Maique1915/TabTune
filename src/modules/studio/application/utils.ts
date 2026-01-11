import type { TimelineTrack } from "../domain/types";

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
 * Converte delta X (px) para delta de tempo (ms).
 * Diferente de xToTime, aqui pode ser negativo (arrastar para esquerda).
 */
export function xDeltaToTime(deltaX: number, zoom: number): number {
  return (deltaX / zoom) * 1000;
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


export function generateClipId(): string {
  // Usamos apenas um sufixo aleatório para IDs gerados em tempo de execução
  return `clip-${Math.random().toString(36).substring(2, 11)}`;
}


/**
 * Limita valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calcula o tempo final máximo de todas as tracks.
 */
export function calculateMaxTrackEndTime(tracks: TimelineTrack[]): number {
  let maxEndTime = 0;
  for (const track of tracks) {
    for (const clip of track.clips) {
      const endTime = clip.start + clip.duration;
      if (endTime > maxEndTime) {
        maxEndTime = endTime;
      }
    }
  }
  return maxEndTime;
}
