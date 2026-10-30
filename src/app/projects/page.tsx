import type { Metadata } from "next";
import { team } from "@/data/team";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/animations/Reveal";
import { RevealHeading } from "@/components/animations/RevealHeading";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProjectIndex } from "@/components/projects/gallery/ProjectIndex";
import { counts, zh } from "@/data/program";

export const metadata: Metadata = {
  title: "所有專案",
  description: `QUINTET 作品展：${zh(counts.members)}位成員、${zh(counts.projects)}件以 Claude Code 輔助完成的作品。`,
};

export default function ProjectsPage() {
  return (
    <div className="relative overflow-hidden bg-night">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_0%,rgba(109,92,255,0.2),transparent_70%),radial-gradient(40%_30%_at_0%_30%,rgba(77,141,255,0.08),transparent_70%)]" />
      <div className="container-x relative pt-[calc(var(--header-h)+4rem)] pb-28 md:pt-[calc(var(--header-h)+6rem)] md:pb-40">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              All Projects
            </Reveal>
            <RevealHeading
              as="h1"
              immediate
              lines={["所有專案"]}
              className="mt-6 font-display text-5xl font-medium leading-[1.05] text-ink sm:text-6xl lg:text-7xl"
            />
            <Reveal as="p" y={16} delay={0.3} className="mt-6 max-w-xl text-base leading-[1.8] text-ink-soft sm:text-lg">
              {team.length} 位成員、{projects.length} 件作品。點選任一作品，進入完整的作品介紹。
            </Reveal>
          </div>
          <Reveal y={16} delay={0.4}>
            <ButtonLink href="/#universe" variant="ghost">
              <ArrowIcon direction="left" className="group-hover:-translate-x-0.5" />
              回到專案宇宙
            </ButtonLink>
          </Reveal>
        </header>

        <div className="mt-16 md:mt-24">
          <ProjectIndex projects={projects} />
        </div>
      </div>
    </div>
  );
}
