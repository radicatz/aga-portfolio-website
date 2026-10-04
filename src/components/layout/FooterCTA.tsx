"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import { tween } from "@/lib/motion";

/**
 * CTA di footer. Hover: teks mengecil ke scale 0.9 (referensi) dan panah berputar dari → ke ↗ (−45°).
 * Atribut data-hide-fab menyembunyikan tombol WhatsApp saat CTA ini terlihat.
 */
export function FooterCTA() {
  return (
    <Link href="/contact" data-hide-fab className="block py-section">
      <motion.span className="flex items-end justify-between gap-6" initial="rest" whileHover="hover" animate="rest">
        <motion.span
          variants={{ rest: { scale: 1 }, hover: { scale: 0.9 } }}
          transition={tween}
          style={{ originX: 0 }}
          className="text-display max-w-[14ch] text-balance"
        >
          {site.footer.cta}
        </motion.span>
        <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }} transition={tween} className="mb-2 block">
          <Icon name="arrow-right" className="size-10 md:size-16" />
        </motion.span>
      </motion.span>
    </Link>
  );
}
