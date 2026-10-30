import Link from "next/link";
import { counts, en, program } from "@/data/program";
import { projects, formatProjectNumber } from "@/data/projects";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/primitives";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/** 06 · Verified program facts, value pillars and the five project categories. */
export function ResultsSection() {
  const placeholderProjects = projects.filter((p) => p.isPlaceholder);
  return (
    <section id="results" aria-labelledby="results-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="results-title"
          index="05"
          eyebrow="PROJECT RESULTS"
          title="計畫成果總覽"
          description="以已確認的事實，整理這場計畫的規模、價值與作品類型。"
        />

        {/* Facts */}
        <Reveal
          as="dl"
          stagger
          className="mt-16 grid grid-cols-2 overflow-hidden rounded-xl border border-line-strong bg-gradient-to-b from-panel/70 to-midnight/50 lg:grid-cols-4"
        >
          {program.facts.map((f, i) => {
            const long = f.value.length > 3;
            return (
              <div
                key={f.labelEn ?? f.label}
                className={cn(
                  "relative flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10",
                  i % 2 === 1 && "border-l border-line",
                  i >= 2 && "border-t border-line lg:border-t-0",
                  i > 0 && "lg:border-l lg:border-line",
                  i === 2 && "max-lg:border-l-0",
                )}
              >
                <dt className="eyebrow !tracking-[0.2em]">{f.labelEn}</dt>
                <dd>
                  <span
                    className={cn(
                      "block text-balance font-display font-medium leading-[1.05] text-display-gradient",
                      long ? "text-3xl sm:text-4xl lg:text-5xl" : "text-6xl sm:text-7xl lg:text-8xl",
                    )}
                  >
                    {f.value}
                  </span>
                  <span className="mt-4 block text-sm text-ink-soft sm:text-base">{f.label}</span>
                </dd>
              </div>
            );
          })}
        </Reveal>

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-12">
          {/* Pillars */}
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow mb-6">
              VALUE PILLARS · 計畫價值
            </Reveal>
            <Reveal
              as="ul"
              stagger
              className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2"
            >
              {program.pillars.map((p, i) => (
                <li key={p.titleEn} className="group relative bg-night p-6 transition-colors duration-500 hover:bg-panel sm:p-7">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-xs tracking-[0.2em] text-violet">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow !text-[0.6875rem] !tracking-[0.18em]">{p.titleEn}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-medium text-ink">{p.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.75] text-ink-soft">{p.description}</p>
                </li>
              ))}
            </Reveal>
          </div>

          {/* Categories */}
          <div className="lg:col-span-5">
            <Reveal as="p" className="eyebrow mb-6">
              {en(counts.categories)} CATEGORIES · 作品類型
            </Reveal>
            <Reveal as="ul" stagger className="border-t border-line-strong">
              {projects.map((p) => (
                <li key={p.id} className="border-b border-line">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group grid min-h-16 grid-cols-[2.75rem_1fr_auto] items-center gap-x-4 py-4 transition-colors duration-300 hover:text-white"
                  >
                    <span className="font-display text-sm tracking-[0.18em] text-violet">
                      {formatProjectNumber(p.number)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg text-ink">{p.category}</span>
                      <span className="block truncate text-sm text-ink-mute">
                        {p.title}
                        {p.categoryEn ? ` · ${p.categoryEn}` : ""}
                      </span>
                    </span>
                    <ArrowIcon
                      direction="up-right"
                      className="text-ink-mute group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan"
                    />
                  </Link>
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        {placeholderProjects.length > 0 && (
          <Reveal as="p" className="mt-14 max-w-2xl border-l border-line-strong pl-4 text-sm leading-relaxed text-ink-mute">
            備註：以上僅呈現已確認的計畫事實；
            {placeholderProjects.length === projects.length
              ? "各專案的詳細內容目前為範例（placeholder）內容"
              : `${placeholderProjects.map((p) => formatProjectNumber(p.number)).join("、")} 號作品的詳細內容目前為範例（placeholder）內容`}
            ，待取得正式資料後更新。
          </Reveal>
        )}
      </div>
    </section>
  );
}
