"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HoverLine } from "@/components/ui/HoverLine";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { WorksDropdown } from "./WorksDropdown";

export type NavCategory = { slug: string; label: string; count: number };

/** Sticky; tersembunyi saat scroll turun, muncul saat scroll naik. */
export function Navbar({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  // Menu otomatis tertutup saat pathname berubah (state terikat ke pathname, tanpa effect).
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 120 && !menuOpen);
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
        className={`fixed inset-x-0 top-0 z-40 ${menuOpen ? "bg-transparent" : "bg-bg/85 backdrop-blur-md"}`}
      >
        <nav aria-label="Utama" className="container-site flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-[20px] uppercase tracking-wide">
            {site.wordmark}
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {site.nav.map((item) =>
              item.href === "/works" ? (
                <WorksDropdown key={item.href} categories={categories} active={isActive("/works")} />
              ) : (
                <HoverLine
                  key={item.href}
                  href={item.href}
                  className="text-label"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </HoverLine>
              ),
            )}
            <ThemeToggle className="ml-4" />
          </div>

          <button
            type="button"
            className="relative size-10 lg:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span
              className="absolute left-2 top-[17px] block h-px w-6 bg-fg"
              animate={{ y: menuOpen ? 3 : 0, rotate: menuOpen ? 45 : 0 }}
              transition={{ duration: 0.4, ease: [0.27, 0, 0.51, 1] }}
            />
            <motion.span
              className="absolute left-2 top-[23px] block h-px w-6 bg-fg"
              animate={{ y: menuOpen ? -3 : 0, rotate: menuOpen ? -45 : 0 }}
              transition={{ duration: 0.4, ease: [0.27, 0, 0.51, 1] }}
            />
          </button>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} categories={categories} onNavigate={() => setMenuOpen(false)} />
    </>
  );
}
