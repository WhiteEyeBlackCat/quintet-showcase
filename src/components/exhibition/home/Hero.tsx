import { program } from "@/data/program";
import { RevealHeading } from "@/components/animations/RevealHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { HeroScene } from "./hero/HeroScene";
import { ScrollCue } from "./hero/ScrollCue";

export function Hero() {
  return (
    <section id="hero" aria-label={program.name} className="relative isolate min-h-dvh overflow-hidden bg-void">
      <HeroScene />

      {/* Readability scrims: bottom on mobile, left on desktop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--void)_0%,rgba(4,5,11,0.92)_42%,rgba(4,5,11,0.35)_62%,transparent_80%)] lg:bg-[linear-gradient(to_right,var(--void)_0%,rgba(4,5,11,0.82)_32%,rgba(4,5,11,0.25)_55%,transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />

      <div className="container-x relative z-10 flex min-h-dvh flex-col justify-end pt-[calc(min(29svh,16rem)+var(--header-h))] pb-24 lg:justify-center lg:pt-[calc(var(--header-h)+2rem)] lg:pb-28">
        <div className="max-w-[52rem]">
          <RevealHeading
            as="h1"
            lines={[...program.title]}
            immediate
            delay={0.2}
            className="font-display text-[clamp(2.15rem,10.4vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.02em] text-ink sm:text-[clamp(3rem,7vw,4.5rem)] lg:whitespace-nowrap lg:text-[clamp(3.25rem,5.1vw,5.4rem)] [&>span:nth-child(2)_[data-line]]:text-display-gradient"
          />

          <Reveal y={16} delay={0.7} className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-cyan" />
            <p className="font-display text-[0.8125rem] font-medium uppercase leading-relaxed tracking-[0.2em] text-cyan sm:text-sm">
              {program.tagline.split(/(AI-POWERED)/).map((part, i) =>
                part === "AI-POWERED" ? <span key={i} className="whitespace-nowrap">{part}</span> : part,
              )}
            </p>
          </Reveal>

          <Reveal y={20} delay={0.85} className="mt-6 max-w-[34rem] space-y-1 text-base leading-[1.75] text-ink-soft sm:text-lg">
            {program.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Reveal>

          <Reveal y={20} delay={1.0} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#universe" magnetic>
              探索作品
              <ArrowIcon className="group-hover:translate-x-0.5" direction="right" />
            </ButtonLink>
            <ButtonLink href="/#mission" variant="ghost">
              了解計畫
            </ButtonLink>
          </Reveal>

          <Reveal y={20} delay={1.15} as="dl" className="mt-12 grid max-w-[34rem] grid-cols-[auto_auto_1fr] gap-x-6 border-t border-line pt-6 sm:gap-x-10">
            {program.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs tracking-[0.12em] text-ink-mute">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold leading-none text-ink sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Vertical brand line (desktop) */}
      <p
        aria-hidden="true"
        className="eyebrow absolute right-[var(--gutter)] top-1/2 z-10 hidden -translate-y-1/2 [writing-mode:vertical-rl] 2xl:block"
      >
        From Ideas to Reality
      </p>

      <div className="container-x absolute inset-x-0 bottom-5 z-10 flex justify-start">
        <ScrollCue targetId="mission" label="向下捲動至計畫介紹" />
      </div>
    </section>
  );
}
