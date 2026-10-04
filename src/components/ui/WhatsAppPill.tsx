"use client";

import { motion } from "motion/react";
import { site } from "@/content/site";
import { springCard, tween } from "@/lib/motion";
import { Icon, WhatsAppIcon } from "./Icon";

type Props = {
  label?: string;
  /** Di mobile hanya ikon (bentuk lingkaran). Dipakai tombol sticky. */
  compact?: boolean;
  className?: string;
};

/**
 * Pil WhatsApp bergaya situs (monokrom --fg/--bg, bukan hijau WhatsApp).
 * Hover: mengecil ke scale 0.9 (springCard) dan panah berputar dari → ke ↗ (−45°).
 */
export function WhatsAppPill({ label = "WhatsApp", compact = false, className = "" }: Props) {
  const hideOnMobile = compact ? "max-md:hidden" : "";

  return (
    <motion.a
      href={site.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={compact ? "Chat dengan Aga via WhatsApp" : undefined}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{ rest: { scale: 1 }, hover: { scale: 0.9 } }}
      transition={springCard}
      className={`inline-flex h-13 items-center gap-3 rounded-full bg-fg px-4 text-bg md:px-5 ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      <span className={`text-label ${hideOnMobile}`}>{label}</span>
      <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }} transition={tween} className={`block ${hideOnMobile}`}>
        <Icon name="arrow-right" className="size-4" />
      </motion.span>
    </motion.a>
  );
}
