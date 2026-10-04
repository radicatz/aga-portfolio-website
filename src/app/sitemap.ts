import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { allProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/works", "/about", "/experience", "/services", "/contact"];

  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${site.url}/works/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...allProjects.map((p) => ({ url: `${site.url}/works/${p.category}/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
