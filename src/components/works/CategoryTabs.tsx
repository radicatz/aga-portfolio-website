"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
      {/* Tab menempel ke tepi bawah ul; .hover-rule menumpuk garis hover/aktif tepat di atas separator border-b. */}
      <ul className="flex min-w-max gap-8 border-b border-line/15 text-label">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              scroll={false}
              className="hover-rule block py-4"
              data-active={pathname === t.href ? "true" : undefined}
              aria-current={pathname === t.href ? "page" : undefined}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
