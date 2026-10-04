"use client";

import { usePathname } from "next/navigation";
import { HoverLine } from "@/components/ui/HoverLine";
import { works } from "@/content/pages";

type Props = { categories: { slug: string; label: string }[] };

/** Tab filter kategori, sticky di bawah navbar. Tiap tab adalah rute sendiri (/works/<kategori>). */
export function CategoryTabs({ categories }: Props) {
  const pathname = usePathname();
  const tabs = [{ slug: "", label: works.allLabel, href: "/works" }, ...categories.map((c) => ({ ...c, href: `/works/${c.slug}` }))];

  return (
    <nav
      aria-label="Kategori karya"
      className="sticky top-16 z-20 -mx-4 overflow-x-auto bg-bg/85 px-4 backdrop-blur-md md:-mx-6 md:px-6"
    >
      <ul className="flex min-w-max gap-8 border-b border-line/15 py-4 text-label">
        {tabs.map((t) => (
          <li key={t.href}>
            <HoverLine href={t.href} scroll={false} active={pathname === t.href} aria-current={pathname === t.href ? "page" : undefined}>
              {t.label}
            </HoverLine>
          </li>
        ))}
      </ul>
    </nav>
  );
}
