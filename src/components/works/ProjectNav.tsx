"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { works } from "@/content/pages";
import { springQuick, tween } from "@/lib/motion";

type Target = { href: string; title: string };

type Props = {
  /** Kosong bila kategori hanya punya dua proyek (previous = next): hanya tombol "Next project" yang tampil. */
  previous?: Target | null;
  next: Target;
};

/**
 * Navigasi antarproyek tanpa garis: kiri "← PREVIOUS PROJECT" + judul, kanan "NEXT PROJECT →" + judul.
 * Bila previous tidak ada, hanya "NEXT PROJECT" di kanan. Pemisah di bawah navigasi (atas CTA footer) dipasang oleh halaman.
 * Hover mengikuti referensi: opacity 0.5 (spring 0.4s). Panah berputar 45° ke arah atas sisinya:
 * "next" dari → ke ↗ (-45°), "previous" dari ← ke ↖ (+45°).
 */
export function ProjectNav({ previous, next }: Props) {
  return (
    <nav aria-label="Navigasi proyek" className={`grid gap-6 py-8 md:py-10 ${previous ? "grid-cols-2" : "grid-cols-1"}`}>
      {previous && (
        <Link href={previous.href} rel="prev" className="block justify-self-start text-left">
          <motion.span
            initial="rest"
            animate="rest"
            whileHover="hover"
            variants={{ rest: { opacity: 1 }, hover: { opacity: 0.5 } }}
            transition={springQuick}
            className="block"
          >
            <span className="text-label flex items-center gap-2 text-muted">
              <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }} transition={tween} className="block">
                <Icon name="arrow-left" className="size-4" />
              </motion.span>
              {works.previousLabel}
            </span>
            <span className="text-heading mt-2 block">{previous.title}</span>
          </motion.span>
        </Link>
      )}

      <Link href={next.href} rel="next" className="block justify-self-end text-right">
        <motion.span
          initial="rest"
          animate="rest"
          whileHover="hover"
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0.5 } }}
          transition={springQuick}
          className="block"
        >
          <span className="text-label flex items-center justify-end gap-2 text-muted">
            {works.nextLabel}
            <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }} transition={tween} className="block">
              <Icon name="arrow-right" className="size-4" />
            </motion.span>
          </span>
          <span className="text-heading mt-2 block">{next.title}</span>
        </motion.span>
      </Link>
    </nav>
  );
}
