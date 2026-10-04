import type { Metadata } from "next";
import { ExperienceList } from "@/components/experience/ExperienceList";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { certifications, communities, experience, experienceIntro } from "@/content/experience";
import { experiencePage } from "@/content/pages";
import { getProjectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  title: "Experience",
  description: experienceIntro,
};

const MAX_PREVIEW = 8;

/** Kumpulkan foto dari beberapa proyek, lalu ambil maksimal MAX_PREVIEW secara merata agar tiap proyek terwakili. */
function pickImages(slugs: string[]) {
  const all = slugs.flatMap((slug) => getProjectBySlug(slug)?.images.map((i) => i.src) ?? []);
  if (all.length <= MAX_PREVIEW) return all;
  return Array.from({ length: MAX_PREVIEW }, (_, i) => all[Math.floor((i * all.length) / MAX_PREVIEW)]);
}

export default function ExperiencePage() {
  const rows = experience.map((e) => ({
    period: e.period,
    company: e.company,
    role: e.role,
    description: e.description,
    images: pickImages(e.previewProjects),
  }));

  return (
    <div className="container-site pt-12 md:pt-20">
      <SplitTextReveal text={experiencePage.title} className="text-display" />
      <Reveal>
        <p className="text-body mt-8 max-w-xl text-muted">{experienceIntro}</p>
      </Reveal>

      <div className="mt-14 md:mt-20">
        <ExperienceList items={rows} />
      </div>

      <div className="grid gap-12 pt-20 md:grid-cols-12 md:pt-28">
        <Reveal className="md:col-span-6">
          <h2 className="text-label text-muted">{experiencePage.certificationsTitle}</h2>
          <ul className="mt-6 border-t border-line/15">
            {certifications.map((c) => (
              <li key={c.title} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-line/15 py-5">
                <span className="text-label text-muted">{c.year}</span>
                <span className="text-body">{c.title}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="md:col-span-5 md:col-start-8">
          <h2 className="text-label text-muted">{experiencePage.communityTitle}</h2>
          <ul className="mt-6 border-t border-line/15">
            {communities.map((c) => (
              <li key={c} className="border-b border-line/15 py-5 text-body">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <p className="py-section text-label">
        <ArrowLink href="/works">{experiencePage.cta.toUpperCase()}</ArrowLink>
      </p>
    </div>
  );
}
