"use client";

import { prefersReducedMotion } from "@/lib/motion";

export function ScrollCue({ targetId, label }: { targetId: string; label: string }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
  return (
    <a
      href={`#${targetId}`}
      onClick={onClick}
      aria-label={`Scroll · ${label}`}
      className="group flex min-h-11 items-center gap-3 rounded-md text-ink-mute transition-colors hover:text-ink"
    >
      <span className="eyebrow !text-inherit">Scroll</span>
      <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-line-strong">
        <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gradient-to-b from-transparent to-cyan" />
      </span>
    </a>
  );
}
