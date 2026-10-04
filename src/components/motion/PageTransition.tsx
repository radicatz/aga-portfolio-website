"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { tween } from "@/lib/motion";

/**
 * Dipakai oleh app/template.tsx: konten halaman baru masuk dengan fade.
 * Sengaja hanya opacity: filter/transform pada pembungkus halaman akan merusak elemen position:fixed (lightbox).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...tween, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
