import type { CSSProperties } from "react";
import type { Project } from "@/types/content";
import { getNextProject, getPrevProject } from "@/data/projects";
import { HeroSection } from "./HeroSection";
import { SectionRail } from "./SectionRail";
import { OverviewSection } from "./OverviewSection";
import { FeaturesSection } from "./FeaturesSection";
import { ArchitectureSection } from "./ArchitectureSection";
import { JourneySection } from "./JourneySection";
import { ChallengesSection } from "./ChallengesSection";
import { ResultsSection } from "./ResultsSection";
import { LinksSection } from "./LinksSection";
import { NextProject } from "./NextProject";
import { getDetailSections, getProjectLinks } from "./sections";

/** Data-driven project page. Each section renders only when its data exists. */
export function ProjectDetail({ project }: { project: Project }) {
  const next = getNextProject(project.slug);
  const prev = getPrevProject(project.slug);
  const sections = getDetailSections(project);
  const links = getProjectLinks(project);
  const ids = new Set(sections.map((s) => s.id));

  return (
    <div
      className="relative"
      style={
        {
          "--accent": project.accentColor ?? "var(--violet)",
          "--accent-2": project.accentColorSecondary ?? "var(--blue)",
        } as CSSProperties
      }
    >
      <SectionRail sections={sections} />
      <HeroSection project={project} prev={prev} next={next} links={links} />
      <OverviewSection project={project} />
      {ids.has("features") && <FeaturesSection project={project} />}
      {ids.has("tech") && <ArchitectureSection project={project} />}
      {ids.has("journey") && <JourneySection project={project} />}
      {ids.has("challenges") && <ChallengesSection project={project} />}
      {ids.has("results") && <ResultsSection project={project} />}
      <LinksSection links={links} />
      {next.slug !== project.slug && <NextProject next={next} />}
    </div>
  );
}
