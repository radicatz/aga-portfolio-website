"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { HoverLine } from "@/components/ui/HoverLine";
import { site } from "@/content/site";
import { menuTween } from "@/lib/motion";
import type { NavCategory } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  open: boolean;
  categories: NavCategory[];
  onNavigate: () => void;
};

/** Overlay layar penuh (<1024px). Link besar muncul berurutan. */
export function MobileMenu({ open, categories, onNavigate }: Props) {
  // Kunci scroll halaman selama menu terbuka; Esc menutup.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onNavigate();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onNavigate]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={menuTween}
          className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-bg px-4 pb-8 pt-24 lg:hidden"
        >
          <ul className="flex flex-1 flex-col gap-2">
            {site.nav.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...menuTween, delay: 0.1 + i * 0.06 }}
              >
                <Link href={item.href} onClick={onNavigate} className="text-display block py-1">
                  {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                </Link>
                {item.href === "/works" && (
                  <ul className="mb-3 mt-1 flex flex-wrap gap-x-5 gap-y-1">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <HoverLine href={`/works/${c.slug}`} onClick={onNavigate} className="text-label text-muted">
                          {c.label}
                        </HoverLine>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex items-center justify-between">
            <ThemeToggle />
            <div className="flex gap-5 text-label">
              <HoverLine href={site.contact.instagramUrl}>INSTAGRAM</HoverLine>
              <HoverLine href={`mailto:${site.contact.email}`}>EMAIL</HoverLine>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
