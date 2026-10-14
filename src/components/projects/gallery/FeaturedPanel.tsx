import Link from "next/link";
import type { Project } from "@/types/content";
import { formatProjectNumber } from "@/data/projects";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils/cn";
import { ProjectCover } from "./ProjectCover";
import { accentStyle } from "./utils";

interface FeaturedPanelProps {
  project: Project;
  /** Mirror the layout (image right). */
  flip?: boolean;
  priority?: boolean;
}

/** Large editorial panel: cover + text, alternating sides, lit in the project's accent. */
export function FeaturedPanel({ project: p, flip = false, priority }: FeaturedPanelProps) {
  const num = formatProjectNumber(p.number);
  const href = `/projects/${p.slug}`;
  const titleId = `featured-${p.slug}`;
  return (
    <article aria-labelledby={titleId} style={accentStyle(p)} className="group/panel relative">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-0">
        {/* Media */}
        <Reveal className={cn("relative lg:col-span-7", flip ? "lg:order-2 lg:col-start-6" : "lg:col-start-1")}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[12%] -inset-y-[18%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_28%,transparent),transparent)] opacity-60 transition-opacity duration-700 group-hover/panel:opacity-100"
          />
          <Link href={href} className="relative block rounded-xl" aria-label={`${p.title}：查看作品`} tabIndex={-1}>
            <ProjectCover
              project={p}
              priority={priority}
              showBadge={false}
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Link>
        </Reveal>

        {/* Text */}
        <Reveal
          stagger
          y={22}
          className={cn(
            "relative z-10 flex flex-col gap-5 lg:col-span-5 lg:row-start-1 lg:bg-transparent",
            flip ? "lg:col-start-1 lg:pr-14" : "lg:col-start-8 lg:pl-14",
          )}
        >
          <p className="flex items-center gap-4 font-display">
            <span className="text-5xl font-light leading-none tabular-nums text-accent sm:text-6xl">{num}</span>
            <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">
              {p.category}
              {p.categoryEn ? <span className="text-ink-mute"> · {p.categoryEn}</span> : null}
            </span>
          </p>
          <div>
            <h3 id={titleId} className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl xl:text-[2.75rem]">
              {p.title}
            </h3>
            {p.subtitle && <p className="mt-2 font-display text-base tracking-wide text-ink-mute sm:text-lg">{p.subtitle}</p>}
          </div>
          <p className="max-w-[32rem] text-base leading-[1.8] text-ink-soft">{p.summary}</p>
          <p className="text-sm text-ink-mute">
            <span className="eyebrow mr-3">Developer</span>
            <span className="text-ink-soft">{p.developer}</span>
          </p>
          {p.technologies?.length > 0 && (
            <ul aria-label="使用技術" className="flex flex-wrap gap-2">
              {p.technologies.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          )}
          <div className="pt-2">
            <ButtonLink href={href} variant="ghost" aria-label={`查看作品：${p.title}`}>
              查看作品
              <ArrowIcon className="group-hover:translate-x-0.5" />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
