"use client";

import { useRef } from "react";
import { program } from "@/data/program";
import { gsap, ScrollTrigger, useGSAP, motion, prefersReducedMotion } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";
import { JOURNEY_ART_ORDER, StageIllustration } from "./journey/StageIllustration";

/** 05 · Program-level development methodology as a scroll-filled timeline. */
export function JourneySection() {
  const root = useRef<HTMLElement>(null);
  const stages = program.journey;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-stage]", el);

      if (prefersReducedMotion()) {
        items.forEach((s) => {
          s.dataset.active = "true";
        });
        gsap.set(el.querySelectorAll("[data-line-fill]"), { scaleY: 1 });
        return;
      }

      items.forEach((s) => {
        const fill = s.querySelector("[data-line-fill]");
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: s, start: "top 62%", end: "bottom 62%", scrub: 0.5 },
            },
          );
        }
        ScrollTrigger.create({
          trigger: s,
          start: "top 62%",
          onEnter: () => {
            s.dataset.active = "true";
          },
          onLeaveBack: () => {
            s.dataset.active = "false";
          },
        });
        gsap.from(s.querySelectorAll("[data-rise]"), {
          opacity: 0,
          y: 30,
          duration: motion.duration.reveal,
          ease: motion.ease.out,
          stagger: 0.12,
          scrollTrigger: { trigger: s, start: "top 80%", once: true },
        });
        gsap.from(s.querySelectorAll("[data-art]"), {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 1.3,
          ease: motion.ease.out,
          scrollTrigger: { trigger: s, start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="journey"
      aria-labelledby="journey-title"
      className="relative overflow-hidden bg-midnight py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 size-[60rem] -translate-x-1/2 rounded-full opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(109,92,255,0.16), transparent)" }}
      />
      <div className="container-x relative">
        <SectionHeader
          id="journey-title"
          index="04"
          eyebrow="DEVELOPMENT JOURNEY"
          title="從構想到作品的開發旅程"
          description="每位成員的專案，都經歷相同的五個階段。這是這場計畫共通的開發方式：人提出方向，AI 協作，再由人審閱與決定。"
        />

        <ol className="mt-20 md:mt-28">
          {stages.map((stage, i) => {
            const flip = i % 2 === 1;
            const last = i === stages.length - 1;
            return (
              <li
                key={stage.number}
                data-stage=""
                data-active="false"
                className={cn(
                  "group/stage grid grid-cols-[2.5rem_1fr] gap-x-5 md:grid-cols-[1fr_4.5rem_1fr] md:gap-x-10 lg:gap-x-16",
                  !last && "pb-16 md:pb-24",
                )}
              >
                {/* Node + connecting segment */}
                <div className="relative col-start-1 row-span-2 row-start-1 md:col-start-2 md:row-span-1">
                  <span
                    className="relative z-10 mx-auto flex size-10 items-center justify-center rounded-full border border-line-strong bg-night font-display text-xs tracking-wider text-ink-mute transition-[border-color,box-shadow,color,background-color] duration-700 ease-out-expo group-data-[active=true]/stage:border-violet group-data-[active=true]/stage:bg-[color-mix(in_oklab,var(--violet)_28%,var(--night))] group-data-[active=true]/stage:text-white group-data-[active=true]/stage:shadow-[0_0_0_6px_rgba(139,124,255,0.12),0_0_32px_rgba(139,124,255,0.65)] md:size-12 md:text-sm"
                  >
                    {stage.number}
                  </span>
                  {!last && (
                    <span aria-hidden="true" className="absolute -bottom-5 left-1/2 top-5 w-px -translate-x-1/2 bg-line md:-bottom-5">
                      <span
                        data-line-fill=""
                        className="absolute inset-0 origin-top bg-gradient-to-b from-violet via-blue to-violet shadow-[0_0_12px_rgba(139,124,255,0.8)]"
                        style={{ transform: "scaleY(0)" }}
                      />
                    </span>
                  )}
                </div>

                {/* Text */}
                <div
                  className={cn(
                    "col-start-2 row-start-1 pt-1.5 md:pt-3",
                    flip ? "md:col-start-3 md:text-left" : "md:col-start-1 md:text-right",
                  )}
                >
                  <p data-rise="" className="eyebrow !text-violet">
                    {stage.label}
                  </p>
                  <h3
                    data-rise=""
                    className="mt-3 font-display text-3xl font-medium text-ink transition-colors duration-700 md:text-4xl"
                  >
                    {stage.title}
                  </h3>
                  <p
                    data-rise=""
                    className={cn(
                      "mt-4 max-w-[34ch] text-base leading-[1.8] text-ink-soft",
                      !flip && "md:ml-auto",
                    )}
                  >
                    {stage.description}
                  </p>
                </div>

                {/* Illustration */}
                <div
                  className={cn(
                    "col-start-2 row-start-2 mt-8 md:row-start-1 md:mt-0",
                    flip ? "md:col-start-1" : "md:col-start-3",
                  )}
                >
                  <div
                    data-art=""
                    className={cn(
                      "w-full max-w-sm opacity-70 saturate-75 transition-[opacity,filter] duration-700 group-data-[active=true]/stage:opacity-100 group-data-[active=true]/stage:saturate-100",
                      flip ? "md:ml-auto" : "md:mr-auto",
                    )}
                  >
                    <div className="rounded-xl shadow-[0_30px_80px_-30px_rgba(109,92,255,0.45)]">
                      <StageIllustration stage={JOURNEY_ART_ORDER[i] ?? "idea"} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
