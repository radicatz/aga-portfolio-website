"use client";

import { motion } from "motion/react";
import { site } from "@/content/site";
import { springCard } from "@/lib/motion";

type Props = {
  label?: string;
  /** Di mobile hanya ikon (bentuk lingkaran). Dipakai tombol sticky. */
  compact?: boolean;
  className?: string;
};

/**
 * Pil WhatsApp bergaya situs (monokrom --fg/--bg, bukan hijau WhatsApp).
 * Hover: mengecil ke scale 0.9 (springCard) dan panah berputar 180°.
 */
export function WhatsAppPill({ label = "WhatsApp", compact = false, className = "" }: Props) {
  const hideOnMobile = compact ? "max-md:hidden" : "";

  return (
    <motion.a
      href={site.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={compact ? "Chat dengan Aga via WhatsApp" : undefined}
      whileHover="hover"
      variants={{ hover: { scale: 0.9 } }}
      transition={springCard}
      className={`inline-flex h-13 items-center gap-3 rounded-full bg-fg px-4 text-bg md:px-5 ${className}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 19.4L3 21z" />
        <path d="M9.2 8.6c.2 2.4 2.7 5 5.2 5.4l1-1.1a.8.8 0 0 1 .8-.2l1.5.6c.3.1.5.4.5.7v.9c0 .5-.5.9-1 .9-3.7-.2-7-3.5-7.2-7.2 0-.5.4-1 .9-1h.9c.3 0 .6.2.7.5l.6 1.5c.1.3 0 .6-.2.8l-.7.6" />
      </svg>
      <span className={`text-label ${hideOnMobile}`}>{label}</span>
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`size-4 ${hideOnMobile}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={{ hover: { rotate: 180 } }}
        transition={springCard}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </motion.svg>
    </motion.a>
  );
}
