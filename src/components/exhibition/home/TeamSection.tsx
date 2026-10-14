import Link from "next/link";
import { team } from "@/data/team";
import { getProjectBySlug } from "@/data/projects";
import { Reveal } from "@/components/animations/Reveal";
import { PlaceholderBadge, SectionHeader } from "@/components/ui/primitives";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { MemberAvatar } from "./team/MemberAvatar";

/** 07 · The five creators, laid out like labelled works on an exhibition wall. */
export function TeamSection() {
  const members = team;
  return (
    <section id="team" aria-labelledby="team-title" className="relative overflow-hidden bg-midnight py-28 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            id="team-title"
            index="06"
            eyebrow="OUR TEAM"
            title="創作者"
            description="五位成員，各自帶著一個構想，與 Claude Code 一起完成作品。"
          />
          {members.some((m) => m.isPlaceholder) && (
            <PlaceholderBadge
              label={members.every((m) => m.isPlaceholder) ? "PLACEHOLDER · 成員資料為範例" : "PLACEHOLDER · 部分成員資料為範例"}
              className="self-start md:mb-2"
            />
          )}
        </div>

        {members.length === 0 ? (
          <p className="mt-16 text-ink-mute">成員資料準備中。</p>
        ) : (
          <div className="relative mt-16 md:mt-24">
            {/* Constellation line (large screens) */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 w-full lg:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points="10,35 30,70 50,35 70,70 90,35"
                fill="none"
                stroke="rgba(139,124,255,0.35)"
                strokeWidth="1"
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <Reveal as="ul" stagger className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {members.map((m, i) => {
                const project = getProjectBySlug(m.projectSlug);
                return (
                  <li
                    key={m.id}
                    className={cn(
                      "flex gap-5 sm:flex-col sm:items-start lg:items-center lg:text-center",
                      i % 2 === 1 && "lg:mt-14",
                    )}
                  >
                    <MemberAvatar src={m.avatar} name={m.name} />
                    <div className="min-w-0 lg:flex lg:flex-col lg:items-center">
                      <p className="eyebrow !text-[0.6875rem] text-violet">{String(i + 1).padStart(2, "0")} · {m.role}</p>
                      <h3 className="mt-2 font-display text-2xl font-medium text-ink">{m.name}</h3>
                      {project && (
                        <Link
                          href={`/projects/${m.projectSlug}`}
                          className="group mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-cyan hover:text-white"
                        >
                          <span>{project.title}</span>
                          <ArrowIcon direction="up-right" className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      )}
                      <p className="mt-2 text-balance text-sm leading-[1.75] text-ink-soft">{m.bio}</p>
                      {m.github && (
                        <a
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} 的 GitHub（另開新視窗）`}
                          className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-mute hover:text-ink"
                        >
                          GitHub
                          <ArrowIcon direction="up-right" className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
