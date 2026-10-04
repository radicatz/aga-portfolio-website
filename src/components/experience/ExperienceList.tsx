"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

export type ExperienceRowData = {
  period: string;
  company: string;
  role: string;
  description: string;
  image: StaticImageData;
};

/**
 * Daftar pengalaman. Saat hover (desktop), thumbnail karya periode itu mengikuti kursor dengan spring
 * dan baris lain meredup ke 40%. Di mobile thumbnail tampil statis di dalam baris.
 */
export function ExperienceList({ items }: { items: ExperienceRowData[] }) {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20 });
  const y = useSpring(my, { stiffness: 150, damping: 20 });

  return (
    <>
      <ul
        className="border-t border-line/15"
        onMouseMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
        onMouseLeave={() => setActive(null)}
      >
        {items.map((item, i) => (
          <motion.li
            key={item.company}
            onMouseEnter={() => setActive(i)}
            animate={{ opacity: active === null || active === i ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 border-b border-line/15 py-8 md:grid-cols-12 md:py-10"
          >
            <p className="text-label text-muted md:col-span-3">{item.period}</p>
            <div className="md:col-span-5">
              <p className="text-display">{item.company}</p>
            </div>
            <div className="md:col-span-4">
              <p className="text-label">{item.role}</p>
              <p className="text-body mt-2 text-muted">{item.description}</p>
              <div className="relative mt-5 aspect-[4/5] w-40 overflow-hidden bg-surface md:hidden">
                <Image src={item.image} alt="" fill sizes="160px" className="object-cover" />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={active}
            aria-hidden
            style={{ x, y, rotate: 3 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed left-0 top-0 z-30 -ml-28 -mt-36 hidden aspect-[4/5] w-56 overflow-hidden bg-surface md:block"
          >
            <Image src={items[active].image} alt="" fill sizes="224px" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
