import type { Project } from "@/types/content";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader, PlaceholderBadge } from "@/components/ui/primitives";

export function ChallengesSection({ project }: { project: Project }) {
  const items = project.challenges ?? [];
  return (
    <section id="challenges" aria-labelledby="challenges-title" className="scroll-mt-10 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="challenges-title"
          index="05"
          eyebrow="CHALLENGES & SOLUTIONS"
          title="挑戰與解法"
          description="開發過程中遇到的挑戰，以及處理的方式。"
        />
        {project.isPlaceholder && <PlaceholderBadge className="mt-6" />}
        <ol className="mt-16 flex flex-col lg:mt-24">
          {items.map((c, i) => (
            <Reveal as="li" key={c.title} className="grid gap-8 border-t border-line py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
              <div className="lg:col-span-4">
                <p className="font-display text-sm tracking-[0.2em] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-2xl leading-snug text-ink">{c.title}</h3>
              </div>
              <dl className="grid gap-8 md:grid-cols-2 lg:col-span-8">
                <div>
                  <dt className="eyebrow">遇到的問題 · Problem</dt>
                  <dd className="mt-3 text-base leading-[1.85] text-ink-soft">{c.problem}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-accent/90">我們的做法 · Approach</dt>
                  <dd className="mt-3 text-base leading-[1.85] text-ink">{c.approach}</dd>
                </div>
                {c.lesson && (
                  <div className="md:col-span-2">
                    <dt className="eyebrow">學到的事 · Lesson</dt>
                    <dd className="mt-3 border-l-2 border-accent pl-5 font-display text-lg leading-[1.7] text-ink">{c.lesson}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
