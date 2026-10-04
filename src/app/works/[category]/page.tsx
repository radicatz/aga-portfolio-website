import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorksView } from "@/components/works/WorksView";
import { categories, categoryBySlug } from "@/content/categories";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/works/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const c = categoryBySlug(category);
  if (!c) return {};
  return { title: c.label, description: c.intro[0] };
}

export default async function CategoryPage(props: PageProps<"/works/[category]">) {
  const { category } = await props.params;
  const c = categoryBySlug(category);
  if (!c) notFound();
  return <WorksView category={c.slug} />;
}
