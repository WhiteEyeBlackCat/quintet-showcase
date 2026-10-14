"use client";

import Link from "next/link";
import { ViewTransition, useState, useSyncExternalStore } from "react";
import type { Project } from "@/types/content";
import { formatProjectNumber } from "@/data/projects";
import { Tag } from "@/components/ui/primitives";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { ProjectCover } from "./ProjectCover";
import { accentStyle, coverMedia } from "./utils";
import { MediaFrame } from "@/components/media/MediaFrame";

const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (cb: () => void) => {
  const mql = window.matchMedia(DESKTOP);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
/** Only one cover per slug may be mounted (shared-element ViewTransition names must be unique). */
function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false);
}

/**
 * /projects index. Desktop: a typographic list with a large sticky preview that follows
 * hover / focus. Mobile: stacked cards with their own covers.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const desktop = useIsDesktop();
  const current = projects[active] ?? projects[0];

  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20" style={accentStyle(current)}>
      <ol className="flex flex-col lg:border-t lg:border-line">
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <li
              key={p.slug}
              style={accentStyle(p)}
              className="border-b border-line"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <Link
                href={`/projects/${p.slug}`}
                className="group block rounded-none py-8 lg:py-9"
                aria-label={`${formatProjectNumber(p.number)} ${p.title}，查看作品`}
              >
                {/* Mobile cover */}
                {!desktop && (
                  <div className="mb-6 lg:hidden">
                    <ProjectCover project={p} tilt={false} sizes="100vw" showBadge={false} aspect="aspect-[16/10]" />
                  </div>
                )}
                <div className="grid grid-cols-[3.25rem_1fr_auto] items-baseline gap-x-4 lg:grid-cols-[5rem_1fr_auto] lg:gap-x-6">
                  <span className={cn("font-display text-lg tabular-nums transition-colors duration-500 lg:text-2xl", on ? "text-accent" : "text-ink-mute")}>
                    {formatProjectNumber(p.number)}
                  </span>
                  <div>
                    <h2
                      className={cn(
                        "font-display text-2xl font-medium leading-tight transition-[color,transform] duration-500 ease-out-expo sm:text-3xl lg:text-4xl",
                        on ? "text-ink lg:translate-x-2" : "text-ink-soft lg:text-ink-mute",
                      )}
                    >
                      {p.title}
                    </h2>
                    {p.subtitle && <p className="mt-1.5 font-display text-sm tracking-wide text-ink-mute">{p.subtitle}</p>}
                    <p className="mt-4 max-w-[34rem] text-base leading-[1.75] text-ink-soft lg:hidden">{p.summary}</p>
                    <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-mute">
                      <span className="eyebrow">{p.category}</span>
                      <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
                      <span>{p.developer}</span>
                    </p>
                    {p.technologies?.length > 0 && (
                      <ul aria-label="使用技術" className="mt-4 flex flex-wrap gap-2 lg:hidden">
                        {p.technologies.map((t) => (
                          <li key={t}>
                            <Tag>{t}</Tag>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ArrowIcon
                    direction="up-right"
                    className={cn("size-5 transition-all duration-500", on ? "text-accent lg:translate-x-1 lg:-translate-y-1" : "text-ink-mute")}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Desktop preview */}
      <div aria-hidden="true" className="relative hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+3rem)]">
          <div
            className="pointer-events-none absolute -inset-[18%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,transparent),transparent)] transition-[background] duration-700"
          />
          <div className="relative aspect-[16/10]">
            {desktop && projects.map((p, i) => (
              <div
                key={p.slug}
                style={accentStyle(p)}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-700 ease-out-expo",
                  i === active ? "opacity-100" : "scale-[0.97] opacity-0",
                )}
              >
                <ViewTransition name={`project-media-${p.slug}`}>
                  <MediaFrame media={coverMedia(p)} sizes="45vw" showBadge={false} />
                </ViewTransition>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center justify-between font-display text-sm text-ink-mute">
            <span className="eyebrow">{formatProjectNumber(current.number)} / {formatProjectNumber(projects.length)}</span>
            <span>{current.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
