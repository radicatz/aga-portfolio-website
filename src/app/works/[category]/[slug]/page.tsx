import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { HoverLine } from "@/components/ui/HoverLine";
import { Gallery } from "@/components/works/Gallery";
import { ProjectNav } from "@/components/works/ProjectNav";
import { categoryBySlug } from "@/content/categories";
import { allProjects, getProject, nextProject, previousProject, projectsByCategory } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/works/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await props.params;
  const project = getProject(category, slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: { title: project.title, description: project.excerpt, images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }] },
  };
}

export default async function ProjectPage(props: PageProps<"/works/[category]/[slug]">) {
  const { category, slug } = await props.params;
  const project = getProject(category, slug);
  const cat = categoryBySlug(category);
  if (!project || !cat) notFound();

  const hasSiblings = projectsByCategory(project.category).length > 1;
  const next = hasSiblings ? nextProject(project) : null;
  const previous = hasSiblings ? previousProject(project) : null;
  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Location", value: project.location },
    { label: "Category", value: cat.label },
  ];

  return (
    <article className="container-site pt-12 md:pt-20">
      <p className="text-label text-muted">
        <HoverLine href="/works">WORKS</HoverLine> / <HoverLine href={`/works/${cat.slug}`}>{cat.label.toUpperCase()}</HoverLine>
      </p>
      <SplitTextReveal text={project.title} className="text-display mt-6 max-w-[16ch]" />

      <Reveal className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line/15 pt-6 md:col-span-6 md:grid-cols-2">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-label text-muted">{m.label}</dt>
              <dd className="text-body mt-1">{m.value}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-5 border-t border-line/15 pt-6 md:col-span-6">
          {project.story.map((p) => (
            <p key={p} className="text-body">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 md:mt-24">
        <Gallery images={project.images} title={project.title} story={project.story} />
      </div>

      {next && previous && (
        // border-b: pemisah abu-abu di atas CTA footer "Mari Abadikan Cerita Anda" (hanya di halaman proyek yang punya navigasi)
        <div className="mt-16 border-b border-line/15 md:mt-24">
          <ProjectNav
            // Kategori dengan dua proyek: previous = next, jadi hanya tombol "Next project" yang ditampilkan.
            previous={previous.slug === next.slug ? null : { href: `/works/${previous.category}/${previous.slug}`, title: previous.title }}
            next={{ href: `/works/${next.category}/${next.slug}`, title: next.title }}
          />
        </div>
      )}
    </article>
  );
}
