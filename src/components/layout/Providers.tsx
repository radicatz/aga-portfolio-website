"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/** Tema (default terang), reduced-motion untuk semua animasi Motion, dan smooth scroll Lenis. */
export function Providers({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        {!reduced && <ReactLenis root options={{ lerp: 0.1, anchors: true }} />}
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
