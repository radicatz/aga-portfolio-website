import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { HoverLine } from "@/components/ui/HoverLine";
import { Gallery } from "@/components/works/Gallery";
import { NextProject } from "@/components/works/NextProject";
import { categoryBySlug } from "@/content/categories";
import { works } from "@/content/pages";
import { allProjects, getProject, nextProject, projectsByCategory } from "@/content/projects";

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

  const next = projectsByCategory(project.category).length > 1 ? nextProject(project) : null;
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
        <Gallery images={project.images} />
      </div>

      <div className="mt-16 flex items-center justify-between text-label md:mt-24">
        <HoverLine href={`/works/${cat.slug}`}>← {works.backLabel} {cat.label}</HoverLine>
      </div>

      {next && <NextProject href={`/works/${next.category}/${next.slug}`} title={next.title} />}
    </article>
  );
}
