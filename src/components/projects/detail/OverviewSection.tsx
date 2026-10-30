import type { Project } from "@/types/content";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/primitives";

export function OverviewSection({ project }: { project: Project }) {
  const facets = [
    { label: "專案動機", en: "WHY", body: project.motivation },
    { label: "目標客群", en: "FOR WHOM", body: project.audience },
    { label: "解決什麼問題", en: "PROBLEM", body: project.problem },
  ].filter((f): f is { label: string; en: string; body: string } => !!f.body);

  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-10 py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeader id="overview-title" index="01" eyebrow="OVERVIEW" title="專案概覽" />
        </div>
        <div className="flex flex-col gap-14 lg:col-span-8">
          <Reveal>
            <p className="max-w-[38rem] whitespace-pre-line font-display text-xl leading-[1.75] text-ink sm:text-2xl sm:leading-[1.7]">
              {project.description}
            </p>
          </Reveal>
          {facets.length > 0 && (
            <Reveal stagger y={22} className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
              {facets.map((f) => (
                <div key={f.en} className="flex flex-col gap-4 bg-night p-7">
                  <h3 className="flex items-baseline gap-3">
                    <span className="font-display text-lg text-ink">{f.label}</span>
                    <span className="eyebrow text-accent/80 !text-[0.625rem]">{f.en}</span>
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.8] text-ink-soft">{f.body}</p>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
