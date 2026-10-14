import type { Project } from "@/types/content";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader, Tag } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";

/** Tech stack groups + layered architecture diagram (pure CSS). */
export function ArchitectureSection({ project }: { project: Project }) {
  const { techStack, architecture } = project;
  const layers = architecture?.layers ?? [];

  return (
    <section id="tech" aria-labelledby="tech-title" className="scroll-mt-10 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="tech-title"
          index="03"
          eyebrow="TECH ARCHITECTURE"
          title="技術架構"
          description={architecture?.summary}
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          {layers.length > 0 && (
            <div className="lg:col-span-7">
              <h3 className="eyebrow mb-6">System layers</h3>
              <Reveal as="ol" stagger y={24} className="flex flex-col" aria-label="系統分層">
                {layers.map((layer, i) => {
                  const mix = layers.length > 1 ? Math.round((i / (layers.length - 1)) * 100) : 0;
                  const tint = `color-mix(in oklab, var(--accent) ${100 - mix}%, var(--accent-2) ${mix}%)`;
                  return (
                    <li key={layer.name} className="relative">
                      <div
                        className="relative overflow-hidden rounded-xl border bg-panel/70 p-6 md:p-7"
                        style={{
                          borderColor: `color-mix(in oklab, ${tint} 38%, transparent)`,
                          marginInline: `${i * 1.25}rem`,
                          boxShadow: `0 24px 60px -34px ${tint}`,
                        }}
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-1"
                          style={{ background: `linear-gradient(180deg, ${tint}, transparent)` }}
                        />
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                          <div className="md:max-w-[20rem]">
                            <p className="font-display text-xs tracking-[0.22em]" style={{ color: tint }}>
                              LAYER {String(i + 1).padStart(2, "0")}
                            </p>
                            <h4 className="mt-2 font-display text-xl text-ink">{layer.name}</h4>
                            <p className="mt-2 text-sm leading-[1.8] text-ink-soft">{layer.description}</p>
                          </div>
                          {layer.items && layer.items.length > 0 && (
                            <ul className="flex flex-wrap gap-2 md:max-w-[14rem] md:justify-end">
                              {layer.items.map((it) => (
                                <li key={it}>
                                  <Tag>{it}</Tag>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {i < layers.length - 1 && (
                        <div aria-hidden="true" className="flex h-9 items-center justify-center">
                          <svg width="14" height="36" viewBox="0 0 14 36" fill="none" stroke="currentColor" className="text-ink-mute">
                            <path d="M7 0v30" strokeDasharray="3 4" />
                            <path d="m2 26 5 6 5-6" />
                          </svg>
                        </div>
                      )}
                    </li>
                  );
                })}
              </Reveal>
            </div>
          )}

          {techStack && techStack.length > 0 && (
            <div className={layers.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}>
              <h3 className="eyebrow mb-6">Tech stack</h3>
              <Reveal as="dl" stagger y={18} className={layers.length > 0 ? "flex flex-col" : "grid gap-x-12 md:grid-cols-2"}>
                {techStack.map((g) => (
                  <div key={g.group} className="grid gap-3 border-t border-line py-5 sm:grid-cols-[8rem_1fr]">
                    <dt className="flex flex-col">
                      <span className="font-display text-base text-ink">{g.group}</span>
                      {g.groupEn && <span className="eyebrow !text-[0.625rem]">{g.groupEn}</span>}
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-2">
                        {g.items.map((it) => (
                          <li key={it}>
                            <Tag>{it}</Tag>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </Reveal>
            </div>
          )}
        </div>

        {architecture?.diagram && (
          <Reveal className="mt-16">
            <MediaFrame media={architecture.diagram} showCaption sizes="(min-width: 1024px) 80vw, 100vw" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
