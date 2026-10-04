"use client";

import { motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { springSoft } from "@/lib/motion";

type Props = { company: string; period: string; image: StaticImageData; alt: string };

/**
 * Kartu tempat kerja. Hover mengikuti Team Profile referensi:
 * foto scale 0.8 + skewX -5° + skewY -8° (spring 1s, bounce 0.2). Label selalu terlihat.
 */
export function WorkplaceCard({ company, period, image, alt }: Props) {
  return (
    <motion.figure initial="rest" whileHover="hover" animate="rest" className="m-0">
      <motion.div
        variants={{ rest: { scale: 1, skewX: 0, skewY: 0 }, hover: { scale: 0.8, skewX: -5, skewY: -8 } }}
        transition={springSoft}
        className="relative aspect-[4/5] overflow-hidden bg-surface"
      >
        <Image src={image} alt={alt} fill sizes="(min-width: 810px) 30vw, 92vw" placeholder="blur" className="object-cover" />
      </motion.div>
      <figcaption className="mt-4">
        <p className="text-title">{company}</p>
        <p className="text-label mt-1 text-muted">{period}</p>
      </figcaption>
    </motion.figure>
  );
}
