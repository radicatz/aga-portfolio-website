import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { servicesPage } from "@/content/pages";
import { getProjectBySlug } from "@/content/projects";
import { services, servicesIntro } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro,
};

export default function ServicesPage() {
  return (
    <div className="container-site pt-12 md:pt-20">
      <SplitTextReveal text={servicesPage.title} className="text-display" />
      <Reveal>
        <p className="text-body mt-8 max-w-xl text-muted">{servicesIntro}</p>
      </Reveal>

      <ul className="mt-14 grid gap-x-6 gap-y-14 md:mt-20 md:grid-cols-2">
        {services.map((s) => {
          const project = getProjectBySlug(s.previewProject)!;
          return (
            <li key={s.title}>
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={project.cover}
                    alt={project.images[project.coverIndex].alt}
                    fill
                    sizes="(min-width: 810px) 46vw, 92vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <h2 className="text-title">{s.title}</h2>
                  <span className="text-label border border-line/30 px-2 py-1 text-muted">{servicesPage.badge}</span>
                </div>
                <p className="text-body mt-2 max-w-md text-muted">{s.description}</p>
                <p className="text-label mt-5">
                  <ArrowLink href="/contact">{servicesPage.cta.toUpperCase()}</ArrowLink>
                </p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
