"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils/cn";

interface Chapter {
  label: string;
  title: string;
  description: string;
}

interface MissionStoryProps {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  chapters: Chapter[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function MissionStory({ eyebrow, heading, paragraphs, chapters }: MissionStoryProps) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const total = chapters.length;

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;
            const f = Math.min(1, Math.max(0, (p * total - 0.5) / (total - 1)));
            if (fill.current) fill.current.style.transform = `scaleY(${f})`;
            setActive(Math.min(total - 1, Math.floor(p * total)));
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: track, dependencies: [total] },
  );

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / total) * range;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const pinned = !reduced;

  return (
    <div ref={track} className={cn(pinned && "lg:h-[430vh]")}>
      <div
        className={cn(
          "relative overflow-hidden py-24 sm:py-32",
          pinned ? "lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center lg:py-0 lg:pt-[var(--header-h)]" : "lg:py-40",
        )}
      >
        {/* Atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_50%,rgba(109,92,255,0.14),transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(77,141,255,0.08),transparent_70%)]" />

        {/* Oversized outlined display word */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--gutter)] top-[8%] select-none whitespace-nowrap font-display text-[clamp(3.5rem,12.2vw,13rem)] font-light leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_rgba(160,170,255,0.2)] lg:top-[calc(var(--header-h)+1rem)]"
        >
          {eyebrow}
        </p>

        <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_9rem] lg:items-center lg:gap-16">
          {/* Intro */}
          <div className={cn("pt-24 sm:pt-32", pinned ? "lg:pt-28" : "lg:pt-48")}>
            <Reveal className="flex items-baseline gap-5 font-display">
              {pinned && (
                <span className="hidden items-baseline gap-4 lg:inline-flex">
                  <span className="text-6xl font-light tabular-nums text-ink">{pad(active + 1)}</span>
                  <span className="text-lg font-light tabular-nums text-ink-mute" aria-hidden="true">
                    / {pad(total)}
                  </span>
                  <span className="sr-only">
                    目前章節 {active + 1}，共 {total} 章
                  </span>
                </span>
              )}
              <span className="eyebrow">{eyebrow}</span>
            </Reveal>

            <h2 id="mission-title" className="mt-8 font-display text-4xl font-medium leading-[1.12] text-ink sm:text-5xl lg:text-[3.5rem]">
              {heading}
            </h2>

            <Reveal y={20} className="mt-8 max-w-[34rem] space-y-5 text-base leading-[1.8] text-ink-soft sm:text-lg">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>

          {/* Chapters: stacked & crossfading when pinned, a plain list otherwise */}
          <ol
            className={cn(
              "relative flex flex-col gap-3 border-t border-line",
              pinned && "lg:grid lg:min-h-[17rem] lg:gap-0 lg:border-t-0",
            )}
          >
            {chapters.map((c, i) => {
              const on = i === active;
              return (
                <li
                  key={c.label}
                  data-active={on}
                  className={cn(
                    "grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-6",
                    pinned &&
                      "lg:col-start-1 lg:row-start-1 lg:border-b-0 lg:py-0 lg:transition-[opacity,transform] lg:duration-700 lg:ease-out-expo",
                    pinned && (on ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:translate-y-6 lg:opacity-0"),
                  )}
                >
                  <span className="font-display text-sm tabular-nums text-accent lg:text-base">{pad(i + 1)}</span>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className={cn("pointer-events-none absolute -right-2 -top-24 hidden select-none font-display text-[11rem] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(160,170,255,0.12)]", pinned && "lg:block")}
                    >
                      {pad(i + 1)}
                    </span>
                    <p className="eyebrow">{c.label}</p>
                    <h3 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-[2.5rem] lg:leading-tight">{c.title}</h3>
                    <p className="mt-4 max-w-[30rem] text-base leading-[1.8] text-ink-soft">{c.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Progress rail (desktop, pinned only) */}
          {pinned && (
            <nav aria-label="計畫介紹章節" className="relative hidden h-[22rem] justify-self-end lg:block">
              <span aria-hidden="true" className="absolute right-[0.4375rem] top-[1.375rem] bottom-[1.375rem] w-px bg-line-strong" />
              <span
                ref={fill}
                aria-hidden="true"
                style={{ transform: "scaleY(0)" }}
                className="absolute right-[0.4375rem] top-[1.375rem] bottom-[1.375rem] w-px origin-top bg-gradient-to-b from-violet to-cyan shadow-[0_0_12px_var(--violet)]"
              />
              <ul className="relative flex h-full flex-col justify-between">
                {chapters.map((c, i) => {
                  const on = i === active;
                  return (
                    <li key={c.label} className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`前往章節 ${pad(i + 1)}：${c.title}`}
                        aria-current={on ? "step" : undefined}
                        className="group flex min-h-11 cursor-pointer items-center gap-4"
                      >
                        <span
                          className={cn(
                            "whitespace-nowrap font-display text-xs tracking-[0.12em] transition-colors duration-500",
                            on ? "text-ink" : "text-ink-mute group-hover:text-ink-soft",
                          )}
                        >
                          {c.title}
                        </span>
                        <span
                          className={cn(
                            "relative size-[0.9375rem] rounded-full border transition-all duration-500",
                            on
                              ? "border-violet bg-violet shadow-[0_0_18px_var(--violet)]"
                              : "border-line-strong bg-night group-hover:border-violet",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
