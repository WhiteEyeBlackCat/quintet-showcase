/**
 * Shared orbit geometry for the Project Universe.
 * Plain module (no "use client") so server markup and the client loop
 * compute identical positions.
 */

/** Data the universe needs from each project (serialisable, trimmed). */
export interface UniverseProject {
  slug: string;
  number: string;
  title: string;
  subtitle?: string;
  category: string;
  categoryEn?: string;
  developer: string;
  summary: string;
  technologies: string[];
  thumbnail: string;
  accent: string;
  accent2: string;
  isPlaceholder: boolean;
}

const DEG = Math.PI / 180;

/**
 * Slot angles (radians) on the projected ellipse, y pointing down.
 * Five projects form a pentagon: 01 top, 02 left, 03 right,
 * 04 bottom-left, 05 bottom-right.
 */
const FIVE_SLOTS = [-90, 198, -18, 126, 54].map((d) => d * DEG);

export function slotAngle(index: number, count: number): number {
  if (count === 5) return FIVE_SLOTS[index];
  return (-90 + (360 / count) * index) * DEG;
}

/** 0 = far side (top of the tilted ellipse), 1 = nearest (bottom). */
export function depthOf(angle: number): number {
  return (Math.sin(angle) + 1) / 2;
}

/** Visual parameters for a given depth. */
export function depthStyle(depth: number, compact: boolean) {
  return {
    scale: compact ? 0.9 + 0.16 * depth : 0.84 + 0.22 * depth,
    opacity: 0.8 + 0.2 * depth,
  };
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [139, 124, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
