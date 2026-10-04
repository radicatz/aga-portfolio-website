"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HoverLine } from "@/components/ui/HoverLine";
import type { NavCategory } from "./Navbar";

type Props = {
  categories: NavCategory[];
  active: boolean;
};

/** Link WORKS dengan panel kategori yang terbuka saat hover/fokus (desktop). Klik tetap membuka /works. */
export function WorksDropdown({ categories, active }: Props) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const root = useRef<HTMLDivElement>(null);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={root}
      className="relative text-label"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) hide();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <HoverLine
        href="/works"
        active={active || open}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-label"
      >
        WORKS
      </HoverLine>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4"
          >
            <ul className="min-w-60 border border-line/15 bg-surface p-4">
              {categories.map((c, i) => (
                <motion.li
                  key={c.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <Link
                    href={`/works/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between gap-6 py-2 text-body"
                  >
                    <span className="hover-line">{c.label}</span>
                    <span className="text-label text-muted">{String(c.count).padStart(2, "0")}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
