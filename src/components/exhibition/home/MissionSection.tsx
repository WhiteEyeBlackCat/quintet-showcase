import { program } from "@/data/program";
import { MissionStory } from "./mission/MissionStory";

/** Program introduction — scroll-told on desktop, a plain list on mobile. */
export function MissionSection() {
  const { mission } = program;
  return (
    <section id="mission" aria-labelledby="mission-title" className="relative bg-night">
      <MissionStory
        eyebrow={mission.eyebrow}
        heading={mission.heading}
        paragraphs={mission.paragraphs}
        chapters={mission.chapters}
      />
    </section>
  );
}
