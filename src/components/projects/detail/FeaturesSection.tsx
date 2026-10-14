"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types/content";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";
import { cn } from "@/lib/utils/cn";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Scroll-driven feature storytelling.
 * Desktop: text blocks scroll normally on the left while a sticky panel on the
 * right crossfades to the active feature's media (no pinning, no scroll hijack).
 * Below lg: each feature is a stacked block with its own media.
 */
export function FeaturesSection({ project }: { project: Project }) {
  const features = project.features;
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = blocks.current.filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [features.length]);

  const goTo = (i: number) => {
    const el = blocks.current[i];
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -window.innerHeight * 0.3 });
    else el.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const current = features[active] ?? features[0];

  return (
    <section id="features" aria-labelledby="features-title" className="relative scroll-mt-10 bg-midnight/60 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="features-title"
          index="02"
          eyebrow="KEY FEATURES"
          title="核心功能"
          description="逐一認識這個專案的核心功能與對應畫面。"
        />

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          {/* Text blocks */}
          <ol className="flex flex-col gap-20 lg:col-span-5 lg:gap-0">
            {features.map((f, i) => {
              const on = i === active;
              return (
                <li
                  key={f.id}
                  ref={(el) => {
                    blocks.current[i] = el;
                  }}
                  data-index={i}
                  data-active={on}
                  className="flex flex-col justify-center gap-6 lg:min-h-[78vh]"
                >
                  <Reveal>
                    <div data-off={!on} className="flex flex-col gap-5 transition-opacity duration-500 lg:data-[off=true]:opacity-30">
                    <div className="flex items-baseline gap-4">
                      <span className={cn("font-display text-sm tracking-[0.2em] transition-colors duration-500", on ? "text-accent" : "text-ink-mute")}>
                        {pad(i + 1)}
                      </span>
                      <span aria-hidden="true" className={cn("h-px transition-all duration-700 ease-out-expo", on ? "w-14 bg-accent" : "w-6 bg-line-strong")} />
                    </div>
                    <h3 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
                      {f.title}
                      {f.titleEn && <span className="mt-2 block text-base font-normal tracking-wide text-ink-mute">{f.titleEn}</span>}
                    </h3>
                    <p className="max-w-[30rem] text-base leading-[1.85] text-ink-soft">{f.description}</p>
                    {f.highlights && f.highlights.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {f.highlights.map((h, hi) => (
                          <li
                            key={h}
                            style={{ transitionDelay: on ? `${hi * 70}ms` : "0ms" }}
                            className={cn(
                              "rounded-md border px-3 py-1.5 text-sm transition-all duration-500 ease-out-expo",
                              on ? "border-[color-mix(in_oklab,var(--accent)_55%,transparent)] text-ink lg:translate-y-0 lg:opacity-100" : "border-line text-ink-soft lg:translate-y-1 lg:opacity-70",
                            )}
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    </div>
                  </Reveal>

                  {/* Mobile / tablet: own media */}
                  {f.media && (
                    <div className="lg:hidden">
                      <MediaFrame media={f.media} chrome sizes="(min-width: 640px) 80vw, 100vw" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Sticky media panel (desktop) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)] flex flex-col gap-6">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-50"
                  style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 30%, transparent), transparent)" }}
                />
                <div className="relative aspect-[16/10]">
                  {features.map((f, i) => (
                    <div
                      key={f.id}
                      aria-hidden={i !== active}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-700 ease-out-expo",
                        i === active ? "translate-x-0 scale-100 opacity-100" : i < active ? "-translate-x-6 scale-[0.97] opacity-0" : "translate-x-6 scale-[0.97] opacity-0",
                      )}
                    >
                      {f.media && <MediaFrame media={f.media} chrome sizes="58vw" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <p className="font-display text-sm tracking-[0.2em] text-ink" aria-label={`第 ${active + 1} 項，共 ${features.length} 項`}>
                  <span className="text-accent">{pad(active + 1)}</span>
                  <span className="text-ink-mute"> / {pad(features.length)}</span>
                </p>
                <div aria-hidden="true" className="relative h-px flex-1 bg-line-strong">
                  <div
                    className="absolute inset-y-0 left-0 h-px origin-left bg-accent shadow-[0_0_10px_var(--accent)] transition-transform duration-700 ease-out-expo"
                    style={{ width: "100%", transform: `scaleX(${(active + 1) / features.length})` }}
                  />
                </div>
                <p className="max-w-[16rem] truncate text-sm text-ink-soft">{current?.title}</p>
              </div>

              <ul className="flex flex-wrap gap-2" aria-label="功能索引">
                {features.map((f, i) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "true" : undefined}
                      className={cn(
                        "min-h-11 cursor-pointer rounded-md border px-3.5 font-display text-sm transition-colors duration-300",
                        i === active ? "border-[color-mix(in_oklab,var(--accent)_60%,transparent)] bg-white/[0.05] text-ink" : "border-line text-ink-mute hover:text-ink",
                      )}
                    >
                      <span className={cn("mr-2", i === active ? "text-accent" : "")}>{pad(i + 1)}</span>
                      {f.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
