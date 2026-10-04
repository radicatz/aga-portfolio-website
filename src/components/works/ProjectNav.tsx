"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { works } from "@/content/pages";
import { springQuick, tween } from "@/lib/motion";

type Target = { href: string; title: string };

/**
 * Navigasi antarproyek: strip bergaris atas-bawah, kiri "← PREVIOUS PROJECT" + judul, kanan "NEXT PROJECT →" + judul.
 * Hover mengikuti referensi: opacity 0.5 (spring 0.4s). Panah berputar 45° ke arah atas sisinya:
 * "next" dari → ke ↗ (-45°), "previous" dari ← ke ↖ (+45°).
 */
export function ProjectNav({ previous, next }: { previous: Target; next: Target }) {
  return (
    <nav aria-label="Navigasi proyek" className="grid grid-cols-2 gap-6 border-y border-line/15 py-8 md:py-10">
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
