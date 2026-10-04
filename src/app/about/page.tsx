import type { Metadata } from "next";
import { WorkplaceCard } from "@/components/about/WorkplaceCard";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { experience } from "@/content/experience";
import { about } from "@/content/pages";
import { getProjectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  title: "About",
  description: about.paragraphs[0],
};

export default function AboutPage() {
  const places = experience.map((e) => {
    const project = getProjectBySlug(e.previewProjects[0])!;
    return { ...e, image: project.cover, alt: project.images[project.coverIndex].alt };
  });

  return (
    <div className="container-site pt-12 md:pt-20">
      <SplitTextReveal text={about.title} className="text-display" />

      <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
        <Reveal className="space-y-6 md:col-span-7 md:col-start-6">
          {about.paragraphs.map((p) => (
            <p key={p} className="text-body text-muted">
              {p}
            </p>
          ))}
        </Reveal>
      </div>

      <Reveal className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line/15 pt-10 md:mt-28 md:grid-cols-4">
        {about.stats.map((s) => (
          <div key={s.label}>
            <p className="text-display">{s.value}</p>
            <p className="text-label mt-2 text-muted">{s.label}</p>
          </div>
        ))}
      </Reveal>

      <section className="pt-20 md:pt-28" aria-labelledby="approach">
        <h2 id="approach" className="text-label text-muted">
          {about.approachTitle}
        </h2>
        <ul className="mt-8 grid gap-10 border-t border-line/15 pt-8 md:grid-cols-3 md:gap-6">
          {about.approach.map((a) => (
            <li key={a.title}>
              <Reveal>
                <p className="text-title">{a.title}</p>
                <p className="text-body mt-3 text-muted">{a.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-section" aria-labelledby="workplaces">
        <h2 id="workplaces" className="text-label text-muted">
          {about.workplacesTitle}
        </h2>
        <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
          {places.map((p) => (
            <li key={p.company}>
              <Reveal>
                <WorkplaceCard company={p.company} period={p.period} image={p.image} alt={p.alt} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
