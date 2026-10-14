import { projects, formatProjectNumber } from "@/data/projects";
import type { UniverseProject } from "./geometry";
import { UniverseExperience } from "./UniverseExperience";

const HEADING_ID = "universe-heading";

/**
 * 02 · PROJECT UNIVERSE — the exhibition's centrepiece.
 * Five projects orbit a central identity. The markup (heading, planets as
 * links) is server-rendered; the client layer enhances it with the orbit
 * canvas, drift, hover lighting and the preview panel.
 */
export function ProjectUniverseSection() {
  const items: UniverseProject[] = projects.map((p) => ({
    slug: p.slug,
    number: formatProjectNumber(p.number),
    title: p.title,
    subtitle: p.subtitle,
    category: p.category,
    categoryEn: p.categoryEn,
    developer: p.developer,
    summary: p.summary,
    technologies: p.technologies,
    thumbnail: p.thumbnail,
    accent: p.accentColor ?? "#8B7CFF",
    accent2: p.accentColorSecondary ?? p.accentColor ?? "#4D8DFF",
    isPlaceholder: p.isPlaceholder,
  }));

  return (
    <section
      id="universe"
      aria-labelledby={HEADING_ID}
      className="grain relative overflow-hidden bg-void pb-20 pt-16 md:pb-28 md:pt-20 lg:pb-28 lg:pt-14"
    >
      {/* deep-space falloff into neighbouring sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,#0b0f22_0%,#070914_45%,#04050b_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night to-transparent" />

      <div className="container-x relative z-10 flex flex-col items-center gap-4 text-center">
        <p className="eyebrow flex items-center gap-3 whitespace-nowrap">
          <span className="text-violet">02</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>Project Universe</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line-strong sm:block" />
          <span className="hidden tabular-nums sm:inline">{String(items.length).padStart(2, "0")} Works</span>
        </p>
        <p lang="zh-Hant" style={{ textWrap: "balance" }} className="max-w-[22rem] text-[0.9375rem] leading-relaxed text-ink-soft md:hidden">
          五個不同領域的創意作品，共同構成這次計畫的作品宇宙
        </p>
      </div>

      <div className="relative z-10 mt-2 md:mt-0">
        <UniverseExperience projects={items} headingId={HEADING_ID} />
      </div>
    </section>
  );
}
