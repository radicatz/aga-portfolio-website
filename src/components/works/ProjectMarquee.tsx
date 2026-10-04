"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { ProjectCardData } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const GAP = 16;
// Lebar kartu mengikuti referensi: 22.14% (desktop), 30% (tablet), ~68% (mobile).
const CARD_WIDTH = "w-[68vw] shrink-0 tablet:w-[30vw] desktop:w-[22.14vw]";
const SIZES = "(min-width: 1200px) 22vw, (min-width: 810px) 30vw, 68vw";

/**
 * Ticker proyek: bergerak terus ke kiri pada 50px/detik (desktop) / 30px/detik (mobile),
 * konstan dan tidak melambat saat hover (sama dengan Framer Ticker referensi).
 * Daftar digandakan agar loop mulus. Dengan reduced-motion: carousel scroll horizontal biasa.
 */
export function ProjectMarquee({ items }: { items: ProjectCardData[] }) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    const el = track.current;
    if (reduced || !el) return;
    const loop = (el.scrollWidth + GAP) / 2; // satu set kartu + satu gap
    const speed = window.innerWidth >= 1024 ? 50 : 30;
    let next = x.get() - (speed * Math.min(delta, 64)) / 1000;
    if (next <= -loop) next += loop;
    x.set(next);
  });

  if (reduced) {
    return (
      <ul className="container-site flex snap-x gap-4 overflow-x-auto pb-4" aria-label="Karya pilihan">
        {items.map((p) => (
          <li key={p.slug} className={`${CARD_WIDTH} snap-start`}>
            <ProjectCard project={p} sizes={SIZES} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="overflow-hidden" aria-label="Karya pilihan" role="region">
      <motion.ul ref={track} style={{ x, gap: GAP }} className="flex w-max py-2">
        {[...items, ...items].map((p, i) => {
          const decorative = i >= items.length;
          return (
            <li key={`${p.slug}-${i}`} className={CARD_WIDTH} aria-hidden={decorative || undefined}>
              <ProjectCard project={p} sizes={SIZES} priority={i < 4} decorative={decorative} />
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
