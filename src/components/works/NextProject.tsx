"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { works } from "@/content/pages";
import { springQuick, tween } from "@/lib/motion";

type Props = { href: string; title: string };

/** Blok "Next". Hover: opacity 0.5 (referensi, spring 0.4s) dan panah → berputar ke ↗. */
export function NextProject({ href, title }: Props) {
  return (
    <Link href={href} className="block border-t border-line/15 py-section">
      <motion.span initial="rest" animate="rest" whileHover="hover" variants={{ rest: { opacity: 1 }, hover: { opacity: 0.5 } }} transition={springQuick} className="block">
        <span className="text-label flex items-center gap-3 text-muted">
          {works.nextLabel}
          <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }} transition={tween} className="block">
            <Icon name="arrow-right" className="size-5" />
          </motion.span>
        </span>
        <span className="text-display mt-4 block">{title}</span>
      </motion.span>
    </Link>
  );
}
