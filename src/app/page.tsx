import { ExhibitionIntro } from "@/components/exhibition/intro/ExhibitionIntro";
import { Hero } from "@/components/exhibition/home/Hero";
import { MissionSection } from "@/components/exhibition/home/MissionSection";
import { ProjectUniverseSection } from "@/components/exhibition/universe/ProjectUniverseSection";
import { FeaturedProjects } from "@/components/exhibition/home/FeaturedProjects";
import { JourneySection } from "@/components/exhibition/home/JourneySection";
import { ResultsSection } from "@/components/exhibition/home/ResultsSection";
import { TeamSection } from "@/components/exhibition/home/TeamSection";
import { ClosingSection } from "@/components/exhibition/home/ClosingSection";

/**
 * Homepage — the exhibition journey, in order.
 * Section anchors: #hero #mission #universe #gallery #journey #results #team #closing
 */
export default function HomePage() {
  return (
    <>
      <ExhibitionIntro />
      <Hero />
      <MissionSection />
      <ProjectUniverseSection />
      <FeaturedProjects />
      <JourneySection />
      <ResultsSection />
      <TeamSection />
      <ClosingSection />
    </>
  );
}
