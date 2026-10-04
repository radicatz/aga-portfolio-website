"use client";

import { motion } from "motion/react";
import { blurIn, springText } from "@/lib/motion";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

type Props = {
  text: string;
  as?: keyof typeof tags;
  className?: string;
  /** Jeda sebelum huruf pertama (detik). */
  delay?: number;
  /** Jeda antar huruf (detik). Referensi: 0.05. */
  stagger?: number;
};

/**
 * Judul per huruf: kabur (blur 10px, turun 10px) lalu tajam, berjalan saat mount (bukan saat scroll),
 * persis efek Text Effect referensi. Teks asli tetap tersedia lewat aria-label.
 */
export function SplitTextReveal({ text, as: Tag = "h1", className, delay = 0.05, stagger = 0.05 }: Props) {
  const Comp = tags[Tag];
  const words = text.split(" ");

  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((char, ci) => (
            <motion.span key={ci} className="inline-block" variants={blurIn} transition={springText}>
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Comp>
  );
}
