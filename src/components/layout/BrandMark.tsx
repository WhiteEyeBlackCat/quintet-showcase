import { useId } from "react";

/** Exhibition mark: a ring with five orbiting points (five minds, five builds). Decorative. */
export function BrandMark({ className }: { className?: string }) {
  const gid = useId();
  const points = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: 16 + Math.cos(a) * 11, y: 16 + Math.sin(a) * 11 };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B7CFF" />
          <stop offset="1" stopColor="#5EE3F0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="11" stroke={`url(#${gid})`} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="16" cy="16" r="4" fill={`url(#${gid})`} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="1.6" fill="#EEF0FF" />
      ))}
    </svg>
  );
}
