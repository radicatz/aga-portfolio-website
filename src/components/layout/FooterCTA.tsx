"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { site } from "@/content/site";
import { tween } from "@/lib/motion";

/**
 * CTA raksasa di footer. Hover persis referensi: teks mengecil ke scale 0.9 dan panah berputar 180°
 * (tween 0.5s). Atribut data-hide-fab menyembunyikan tombol WhatsApp saat CTA ini terlihat.
 */
export function FooterCTA() {
  return (
    <Link href="/contact" data-hide-fab className="group block py-section">
      <motion.span className="flex items-end justify-between gap-6" initial="rest" whileHover="hover" animate="rest">
        <motion.span
          variants={{ rest: { scale: 1 }, hover: { scale: 0.9 } }}
          transition={tween}
          style={{ originX: 0 }}
          className="text-cta max-w-[12ch] text-balance"
        >
          {site.footer.cta}
        </motion.span>
        <motion.svg
          aria-hidden
          viewBox="0 0 48 48"
          className="mb-2 size-12 shrink-0 md:size-20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          variants={{ rest: { rotate: 0 }, hover: { rotate: 180 } }}
          transition={tween}
        >
          <path d="M8 24h32M28 12l12 12-12 12" />
        </motion.svg>
      </motion.span>
    </Link>
  );
}
