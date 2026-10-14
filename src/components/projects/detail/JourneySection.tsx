"use client";

import { useRef } from "react";
import type { Project } from "@/types/content";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";

/** Development timeline: IDEA → PROTOTYPE → BUILD → DEBUG → FINAL PRODUCT. */
export function JourneySection({ project }: { project: Project }) {
  const stages = project.developmentStages ?? [];
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !line.current) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-stage]", el);
      if (prefersReducedMotion()) {
        gsap.set(line.current, { scaleY: 1 });
        items.forEach((it) => it.setAttribute("data-on", "true"));
        return;
      }
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: 0.4 } },
      );
      items.forEach((it) => {
        const marker = it.querySelector("[data-marker]") ?? it;
        ScrollTrigger.create({
          trigger: marker,
          start: "top 60%",
          onEnter: () => it.setAttribute("data-on", "true"),
          onLeaveBack: () => it.setAttribute("data-on", "false"),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-10 bg-midnight/60 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="journey-title"
          index="04"
          eyebrow="DEVELOPMENT JOURNEY"
          title="開發歷程"
          description="從一個想法，到與 Claude Code 協作完成的作品。"
        />

        <div ref={root} className="relative mt-16 lg:mt-24">
          <div aria-hidden="true" className="absolute bottom-0 left-[1.1875rem] top-0 w-px bg-line-strong md:left-[2.4375rem]" />
          <div
            ref={line}
            aria-hidden="true"
            className="absolute bottom-0 left-[1.1875rem] top-0 w-px origin-top bg-accent shadow-[0_0_14px_var(--accent)] md:left-[2.4375rem]"
          />
          <ol className="flex flex-col gap-16 md:gap-24">
            {stages.map((s, i) => (
              <li key={s.key} data-stage data-on="false" className="group/stage relative grid gap-6 pl-14 md:grid-cols-[5rem_1fr] md:gap-10 md:pl-0">
                <div className="absolute left-0 top-0 md:static" data-marker>
                  <span className="relative flex size-10 items-center justify-center rounded-full border border-line-strong bg-night font-display text-xs tracking-wider text-ink-mute transition-all duration-500 group-data-[on=true]/stage:border-accent group-data-[on=true]/stage:text-ink group-data-[on=true]/stage:shadow-[0_0_24px_-2px_var(--accent)] md:mx-auto md:size-[3.25rem] md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className={s.media ? "lg:col-span-5" : "lg:col-span-8"}>
                    <p className="eyebrow text-accent">{s.label}</p>
                    <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{s.title}</h3>
                    <p className="mt-4 max-w-[34rem] text-base leading-[1.85] text-ink-soft">{s.description}</p>
                    {s.claudeAssist && (
                      <aside
                        aria-label="Claude Code 協助"
                        className="mt-6 max-w-[34rem] rounded-xl border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-5"
                      >
                        <p className="eyebrow flex items-center gap-2 text-accent">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                          Claude Code 協助
                        </p>
                        <p className="mt-2 text-[0.9375rem] leading-[1.8] text-ink">{s.claudeAssist}</p>
                      </aside>
                    )}
                  </div>
                  {s.media && (
                    <div className="lg:col-span-7">
                      <MediaFrame media={s.media} chrome showCaption sizes="(min-width: 1024px) 50vw, 100vw" />
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
