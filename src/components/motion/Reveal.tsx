"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { springText } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Muncul sekali saat masuk viewport: opacity + blur + sedikit turun. */
export function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, filter: "blur(8px)", y: 24 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...springText, delay }}
    >
      {children}
    </motion.div>
  );
}
