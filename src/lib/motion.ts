"use client";

import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single place where GSAP plugins are registered. Import `gsap`,
 * `ScrollTrigger` and `useGSAP` from here — never call registerPlugin
 * elsewhere, so registration happens exactly once.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/** Motion tokens (mirror of the CSS custom properties in globals.css). */
export const motion = {
  ease: {
    out: "expo.out",
    inOut: "expo.inOut",
    soft: "power3.out",
  },
  duration: {
    fast: 0.18,
    base: 0.32,
    slow: 0.7,
    reveal: 1.0,
  },
  stagger: 0.08,
} as const;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_QUERY = "(hover: none), (pointer: coarse)";

function subscribeQuery(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

const subscribeReduced = subscribeQuery(REDUCED_QUERY);
const subscribeCoarse = subscribeQuery(COARSE_QUERY);

/** True when the user prefers reduced motion. SSR-safe (false on server). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** True on touch / no-hover devices. SSR-safe (false on server). */
export function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia(COARSE_QUERY).matches,
    () => false,
  );
}

/** Non-hook check, for use inside effects / gsap callbacks. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}

/**
 * Rough low-power heuristic: few cores, low memory, or save-data.
 * Used to reduce particle counts and skip expensive effects.
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true;
  if (nav.deviceMemory && nav.deviceMemory <= 4) return true;
  return false;
}
