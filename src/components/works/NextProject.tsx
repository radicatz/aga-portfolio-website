"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { works } from "@/content/pages";
import { springQuick } from "@/lib/motion";

type Props = { href: string; title: string };

/** Blok "Next >". Hover persis referensi: opacity 0.5 (spring 0.4s, bounce 0.2). */
export function NextProject({ href, title }: Props) {
  return (
    <Link href={href} className="block border-t border-line/15 py-section">
      <motion.span whileHover={{ opacity: 0.5 }} transition={springQuick} className="block">
        <span className="text-label text-muted">{works.nextLabel} &gt;</span>
        <span className="text-display mt-4 block">{title}</span>
      </motion.span>
    </Link>
  );
}
