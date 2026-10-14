"use client";

import { useEffect, useRef } from "react";

const RINGS = [
  { r: 22, dur: 90, dot: "#8b7cff", dir: 1 },
  { r: 32, dur: 140, dot: "#5ee3f0", dir: -1 },
  { r: 44, dur: 200, dot: "#e879d0", dir: 1 },
];

/** Slowly orbiting rings + glow. CSS-animated; paused while offscreen. */
export function ClosingOrbits() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.inview = entry.isIntersecting ? "true" : "false";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-inview="false"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden [&_.orbit]:[animation-play-state:paused] data-[inview=true]:[&_.orbit]:[animation-play-state:running]"
    >
      <div
        className="absolute size-[44rem] max-w-[140vw] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(109,92,255,0.28), rgba(77,141,255,0.08) 55%, transparent)" }}
      />
      {RINGS.map((ring, i) => (
        <svg
          key={i}
          viewBox="-50 -50 100 100"
          className="orbit absolute w-[min(150vw,78rem)] animate-spin"
          style={{
            animationDuration: `${ring.dur}s`,
            animationDirection: ring.dir > 0 ? "normal" : "reverse",
            transform: "rotateX(62deg)",
          }}
        >
          <circle r={ring.r} fill="none" stroke="rgba(160,170,255,0.18)" strokeWidth="0.15" />
          <circle cx={ring.r} cy="0" r="0.8" fill={ring.dot} />
          <circle cx={-ring.r * 0.6} cy={ring.r * 0.8} r="0.4" fill={ring.dot} opacity="0.6" />
        </svg>
      ))}
    </div>
  );
}
