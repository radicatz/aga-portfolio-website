"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { springSoft } from "@/lib/motion";

export type ExperienceRowData = {
  period: string;
  company: string;
  /** Nama tampilan dengan pemisah baris paksa (newline). */
  displayName: string;
  role: string;
  description: string;
  images: StaticImageData[];
};

// Jarak gerak kursor (px) sebelum foto berganti.
const STEP_DISTANCE = 80;
// Sudut tetap per urutan foto: tiap foto tampak miring ke arah berbeda. Tetap (bukan acak) agar render deterministik.
const ANGLES = [-6, 4, -2, 7, -4, 3, -7, 5];
const angleOf = (i: number) => ANGLES[i % ANGLES.length];

type Preview = { row: number; index: number; prevAngle: number };

/**
 * Daftar pengalaman. Saat hover (desktop), thumbnail mengikuti kursor dengan spring; setiap kursor bergerak
 * STEP_DISTANCE px, foto berganti ke foto berikutnya dengan sudut miring yang berbeda. Baris lain meredup ke 40%.
 * Di mobile hanya foto pertama yang tampil statis di dalam baris.
 */
export function ExperienceList({ items }: { items: ExperienceRowData[] }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20 });
  const y = useSpring(my, { stiffness: 150, damping: 20 });
  const last = useRef({ x: 0, y: 0 });
  const travelled = useRef(0);

  const onMove = (clientX: number, clientY: number) => {
    mx.set(clientX);
    my.set(clientY);
    const dx = clientX - last.current.x;
    const dy = clientY - last.current.y;
    last.current = { x: clientX, y: clientY };
    travelled.current += Math.hypot(dx, dy);
    if (travelled.current < STEP_DISTANCE) return;
    travelled.current = 0;
    setPreview((p) => {
      if (!p) return p;
      const count = items[p.row].images.length;
      if (count < 2) return p;
      return { row: p.row, index: (p.index + 1) % count, prevAngle: angleOf(p.index) };
    });
  };

  const current = preview ? items[preview.row].images[preview.index] : null;

  return (
    <>
      <ul
        className="border-t border-line/15"
        onMouseMove={(e) => onMove(e.clientX, e.clientY)}
        onMouseLeave={() => setPreview(null)}
      >
        {items.map((item, i) => (
          <motion.li
            key={item.company}
            onMouseEnter={(e) => {
              last.current = { x: e.clientX, y: e.clientY };
              travelled.current = 0;
              setPreview({ row: i, index: 0, prevAngle: 0 });
            }}
            animate={{ opacity: !preview || preview.row === i ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 border-b border-line/15 py-8 md:grid-cols-12 md:py-10"
          >
            <p className="text-label text-muted md:col-span-3">{item.period}</p>
            <div className="md:col-span-5">
              {/* whitespace-pre-line: pemisah baris pada displayName membuat nama selalu dua baris */}
              <p className="text-display whitespace-pre-line">{item.displayName}</p>
            </div>
            <div className="md:col-span-4">
              <p className="text-label">{item.role}</p>
              <p className="text-body mt-2 text-muted">{item.description}</p>
              <div className="relative mt-5 aspect-[4/5] w-40 overflow-hidden md:hidden">
                <Image src={item.images[0]} alt="" fill sizes="160px" className="object-cover" />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Thumbnail mengikuti kursor; wadah ikut posisi, foto di dalamnya berganti dengan sudut berbeda. */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-30 -ml-28 -mt-36 hidden aspect-[4/5] w-56 md:block"
      >
        <AnimatePresence>
          {preview && current && (
            <motion.div
              key={`${preview.row}-${preview.index}`}
              initial={{ opacity: 0, scale: 0.9, rotate: preview.prevAngle }}
              animate={{ opacity: 1, scale: 1, rotate: angleOf(preview.index) }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={springSoft}
              className="absolute inset-0 overflow-hidden"
            >
              <Image src={current} alt="" fill sizes="224px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
