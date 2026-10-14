import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/content";
import { formatProjectNumber } from "@/data/projects";
import { ArrowIcon } from "@/components/ui/Button";

/** Large transition panel to the next project, tinted with that project's accent. */
export function NextProject({ next }: { next: Project }) {
  return (
    <section aria-labelledby="next-title" className="relative overflow-hidden border-t border-line">
      <Link
        href={`/projects/${next.slug}`}
        aria-label={`前往下一個專案：${next.title}`}
        style={{ "--accent": next.accentColor, "--accent-2": next.accentColorSecondary } as React.CSSProperties}
        className="group relative block py-24 md:py-36"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-40 transition-opacity duration-700 group-hover:opacity-90"
          style={{ background: "radial-gradient(ellipse 60% 80% at 80% 60%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)" }}
        />
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <p className="eyebrow flex items-center gap-3">
              <span>NEXT PROJECT</span>
              <span aria-hidden="true" className="h-px w-10 bg-line-strong transition-all duration-700 ease-out-expo group-hover:w-20 group-hover:bg-accent" />
            </p>
            <p className="font-display text-7xl font-medium leading-none text-accent sm:text-8xl">{formatProjectNumber(next.number)}</p>
            <h2 id="next-title" className="text-display-gradient font-display text-4xl font-medium leading-tight sm:text-5xl">
              {next.title}
            </h2>
            {next.subtitle && <p className="font-display text-lg text-ink-soft">{next.subtitle}</p>}
            <span className="mt-2 inline-flex items-center gap-3 font-display text-sm tracking-wide text-ink">
              前往專案
              <span className="flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                <ArrowIcon direction="right" />
              </span>
            </span>
          </div>
          <div className="lg:col-span-6">
            <div className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.02] lg:[transform:perspective(1600px)_rotateY(9deg)] lg:group-hover:[transform:perspective(1600px)_rotateY(3deg)_scale(1.02)]">
              <ViewTransition name={`project-media-${next.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line-strong bg-panel shadow-[0_40px_120px_-40px_color-mix(in_oklab,var(--accent)_55%,transparent)]">
                  <Image src={next.thumbnail} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                </div>
              </ViewTransition>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
