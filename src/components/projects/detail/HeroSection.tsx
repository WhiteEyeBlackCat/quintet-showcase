"use client";

import { useRef, ViewTransition } from "react";
import Link from "next/link";
import type { Project, ProjectMedia } from "@/types/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/animations/Reveal";
import { RevealHeading } from "@/components/animations/RevealHeading";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { Tag, PlaceholderBadge } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";
import { formatProjectNumber } from "@/data/projects";
import type { LinkItem } from "./sections";

interface HeroSectionProps {
  project: Project;
  prev: Project;
  next: Project;
  links: LinkItem[];
}

export function HeroSection({ project, prev, next, links }: HeroSectionProps) {
  const root = useRef<HTMLElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  const heroMedia: ProjectMedia = project.heroVideo ?? {
    type: "image",
    src: project.heroImage,
    alt: `${project.title} 主視覺${project.isPlaceholder ? "（預留畫面）" : ""}`,
    placeholder: project.isPlaceholder,
    position: project.mediaPosition,
    width: 1600,
    height: 1000,
  };
  const hasSiblings = prev.slug !== project.slug;

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      gsap.to(parallax.current, {
        y: -56,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(glow.current, {
        y: 90,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  const num = formatProjectNumber(project.number);

  return (
    <section ref={root} aria-labelledby="project-title" className="relative overflow-x-clip pb-20 pt-[calc(var(--header-h)+1.25rem)] md:pb-28">
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[8%] h-[70%] w-[75%] rounded-full opacity-60"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 34%, transparent), color-mix(in oklab, var(--accent-2) 10%, transparent) 60%, transparent)" }}
      />

      <div className="container-x relative">
        <nav aria-label="專案導覽" className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <Link
            href="/projects"
            className="group inline-flex min-h-11 items-center gap-2 font-display text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowIcon direction="left" className="transition-transform duration-300 group-hover:-translate-x-1" />
            返回作品列表
          </Link>
          {hasSiblings && (
            <div className="flex items-center gap-1 font-display text-sm text-ink-soft">
              <Link
                href={`/projects/${prev.slug}`}
                aria-label={`上一個專案：${prev.title}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 transition-colors hover:text-ink"
              >
                <ArrowIcon direction="left" />
                <span className="hidden sm:inline">Previous</span>
                <span className="text-ink-mute">{formatProjectNumber(prev.number)}</span>
              </Link>
              <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
              <Link
                href={`/projects/${next.slug}`}
                aria-label={`下一個專案：${next.title}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 transition-colors hover:text-ink"
              >
                <span className="text-ink-mute">{formatProjectNumber(next.number)}</span>
                <span className="hidden sm:inline">Next</span>
                <ArrowIcon direction="right" />
              </Link>
            </div>
          )}
        </nav>

        <div className="mt-10 grid items-center gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-7 lg:col-span-5">
            <Reveal stagger y={20} className="flex flex-col gap-6">
              <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-accent">PROJECT {num}</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                <span>{project.categoryEn ?? project.category}</span>
              </p>
            </Reveal>

            <div>
              <RevealHeading
                as="h1"
                id="project-title"
                immediate
                lines={project.titleLines ?? [project.title]}
                className="font-display text-5xl font-medium leading-[1.12] sm:text-6xl xl:text-7xl"
                lineClassName="text-display-gradient"
              />
              {project.subtitle && (
                <p className="mt-3 font-display text-xl tracking-wide text-ink-soft sm:text-2xl">{project.subtitle}</p>
              )}
            </div>

            <Reveal stagger y={18} delay={0.15} className="flex flex-col gap-7">
              <p className="max-w-[34rem] text-base leading-[1.8] text-ink-soft sm:text-lg">{project.summary}</p>

              <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="eyebrow">類別</dt>
                  <dd className="mt-1 text-ink">{project.category}</dd>
                </div>
                <div>
                  <dt className="eyebrow">開發者</dt>
                  <dd className="mt-1 text-ink">{project.developer}</dd>
                </div>
              </dl>

              <ul className="flex flex-wrap gap-2" aria-label="使用技術">
                {project.technologies.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                {links.slice(0, 3).map((l, i) => (
                  <ButtonLink key={l.key} href={l.href} external variant={i === 0 ? "primary" : "ghost"}>
                    {l.label}
                    <ArrowIcon direction="up-right" />
                  </ButtonLink>
                ))}
                {project.features.length > 0 && (
                  <ButtonLink href="#features" variant={links.length === 0 ? "primary" : "quiet"}>
                    探索功能
                    <ArrowIcon direction="down" />
                  </ButtonLink>
                )}
                {project.isPlaceholder && <PlaceholderBadge />}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div ref={parallax} className="will-change-transform [perspective:1800px]">
              <div className="origin-center transition-transform duration-700 ease-out-expo lg:[transform:rotateY(-13deg)_rotateX(5deg)_rotateZ(1deg)] lg:hover:[transform:rotateY(-6deg)_rotateX(2deg)]">
                <ViewTransition name={`project-media-${project.slug}`}>
                  <MediaFrame media={heroMedia} chrome priority sizes="(min-width: 1024px) 58vw, 100vw" />
                </ViewTransition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
