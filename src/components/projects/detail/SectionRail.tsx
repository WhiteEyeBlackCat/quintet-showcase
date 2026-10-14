"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { DetailSection } from "./sections";

/** Sticky left section rail (desktop only) with active-section tracking. */
export function SectionRail({ sections }: { sections: DetailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.01, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -40 });
    else el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="章節導覽"
      className="group/rail fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 xl:block 2xl:left-5"
    >
      <ol className="flex flex-col gap-1">
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => jump(e, s.id)}
                aria-current={on ? "location" : undefined}
                className="relative flex min-h-11 items-center gap-3 rounded-full py-1 pr-3 outline-offset-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 shrink-0 rounded-full border transition-all duration-500 ease-out-expo",
                    on ? "scale-125 border-accent bg-accent shadow-[0_0_14px_var(--accent)]" : "border-ink-mute bg-transparent",
                  )}
                />
                <span
                  className={cn(
                    "pointer-events-none whitespace-nowrap rounded-md bg-void/80 px-2 py-0.5 font-display text-[0.6875rem] uppercase tracking-[0.2em] transition-all duration-300",
                    on ? "text-ink" : "text-ink-mute",
                    "opacity-0 -translate-x-1 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100",
                    on && "2xl:translate-x-0 2xl:opacity-100",
                  )}
                >
                  <span className="mr-2 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                  <span className="sr-only">（{s.labelZh}）</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
