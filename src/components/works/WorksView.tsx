import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { categories, categoryBySlug } from "@/content/categories";
import { works } from "@/content/pages";
import { allProjects, projectsByCategory, toCardData } from "@/content/projects";
import type { CategorySlug } from "@/content/types";
import { CategoryTabs } from "./CategoryTabs";
import { ProjectCard } from "./ProjectCard";

const SIZES = "(min-width: 810px) 46vw, 92vw";

/** Isi halaman /works (semua) dan /works/[category] (terfilter): judul, tab, intro, grid proyek. */
export function WorksView({ category }: { category?: CategorySlug }) {
  const current = category ? categoryBySlug(category) : undefined;
  const list = (category ? projectsByCategory(category) : allProjects).map(toCardData);
  const intro = current ? current.intro : [works.intro];

  return (
    <div className="container-site pt-12 md:pt-20">
      <SplitTextReveal text={current ? current.title : works.heading} className="text-display" />

      <div className="mt-10 md:mt-14">
        <CategoryTabs categories={categories.map(({ slug, label }) => ({ slug, label }))} />
      </div>

      <Reveal className="mt-10 grid gap-6 md:mt-14 md:grid-cols-12">
        <div className="space-y-5 md:col-span-6 md:col-start-7">
          {intro.map((p) => (
            <p key={p} className="text-body text-muted">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <ul className="mt-16 grid gap-x-6 gap-y-14 md:mt-24 md:grid-cols-2">
        {list.map((p, i) => (
          <li key={p.slug} className={i % 2 === 1 ? "md:mt-24" : undefined}>
            <Reveal delay={(i % 2) * 0.1}>
              <ProjectCard project={p} sizes={SIZES} priority={i < 2} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
