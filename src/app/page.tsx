import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectMarquee } from "@/components/works/ProjectMarquee";
import Link from "next/link";
import { categories } from "@/content/categories";
import { home } from "@/content/pages";
import { featuredProjects, projectsByCategory, toCardData } from "@/content/projects";

export default function HomePage() {
  const cards = featuredProjects.map(toCardData);

  return (
    <>
      <section className="container-site pb-12 pt-16 md:pb-16 md:pt-24">
        <p className="text-label text-muted">{home.eyebrow}</p>
        <SplitTextReveal text={home.title} className="text-display mt-6 max-w-[14ch]" />
        <Reveal delay={0.6}>
          <p className="text-body mt-8 max-w-xl text-muted">{home.subtitle}</p>
        </Reveal>
      </section>

      <section aria-label="Karya pilihan" className="pb-section">
        <ProjectMarquee items={cards} />
      </section>

      <section className="container-site pb-section">
        <Reveal>
          <p className="text-label text-muted">{home.categoriesLabel}</p>
          <ul className="mt-6 border-t border-line/15">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-line/15">
                <Link
                  href={`/works/${c.slug}`}
                  className="group flex w-full items-baseline justify-between gap-6 py-5 md:py-6"
                >
                  <span className="text-title hover-line">{c.label}</span>
                  <span className="text-label text-muted">{String(projectsByCategory(c.slug).length).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
