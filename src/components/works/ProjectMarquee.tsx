"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useRef, type PointerEvent } from "react";
import type { ProjectCardData } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const GAP = 16;
// Lebar kartu mengikuti referensi: 22.14% (desktop), 30% (tablet), ~68% (mobile).
const CARD_WIDTH = "w-[68vw] shrink-0 tablet:w-[30vw] desktop:w-[22.14vw]";
const SIZES = "(min-width: 1200px) 22vw, (min-width: 810px) 30vw, 68vw";

// Referensi (Framer Ticker): tickerEffectHoverModifier = 25 -> saat hover kecepatan turun ke 25%.
const HOVER_SPEED_FACTOR = 0.25;
// Geser lebih dari ini (px) dianggap drag, bukan klik.
const DRAG_THRESHOLD = 5;
// Jarak drag: strip bergerak sekian kali jarak geser kursor, jadi drag pendek sudah menempuh jarak jauh.
const DRAG_GAIN = 0.5;
// Strip mengejar posisi tujuan secara halus (konstanta waktu, ms). Makin besar makin lembut/lambat mengikuti.
const FOLLOW_TAU = 300;
// Peluruhan inertia setelah drag dilepas (ms, konstanta waktu). Makin besar makin panjang meluncur.
const INERTIA_DECAY = 450;
// Batas kecepatan inertia (px/detik, setelah dikali DRAG_GAIN).
const MAX_INERTIA = 5000;

/**
 * Ticker proyek (Framer Ticker referensi, tickerEffectDraggable = true):
 * - Bergerak terus ke kiri pada 50px/detik (desktop) / 30px/detik (mobile).
 * - Hover: melambat halus ke 25%.
 * - Drag/swipe ke kiri atau kanan: strip menempuh DRAG_GAIN kali jarak kursor dan mengejar posisinya dengan
 *   pelan-pelan (tidak melompat). Saat dilepas, kecepatan terakhir diteruskan sebagai inertia yang meluruh halus,
 *   lalu kembali ke kecepatan otomatis. Swipe vertikal tetap men-scroll halaman.
 * Daftar digandakan agar loop mulus. Dengan reduced-motion: carousel scroll horizontal biasa.
 */
export function ProjectMarquee({ items }: { items: ProjectCardData[] }) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const targetX = useRef(0); // posisi tujuan; x mengejarnya dengan halus
  const hovered = useRef(false);
  const factor = useRef(1); // 1 = kecepatan penuh, diinterpolasi ke 0.25 saat hover

  const drag = useRef({
    active: false,
    // Pointer capture baru dipasang setelah gerakan melewati DRAG_THRESHOLD. Bila dipasang saat mouse-down,
    // browser mengirim "click" ke kontainer (bukan ke tautan di bawah kursor), sehingga kartu tidak bisa diklik.
    captured: false,
    moved: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  }); // velocity px/detik (kursor)
  const inertia = useRef(0); // px/detik (posisi strip), meluruh setelah drag dilepas

  useAnimationFrame((_, delta) => {
    const el = track.current;
    if (reduced || !el) return;
    const dt = Math.min(delta, 64);
    const loop = (el.scrollWidth + GAP) / 2; // satu set kartu + satu gap

    if (!drag.current.active) {
      const hoverTarget = hovered.current ? HOVER_SPEED_FACTOR : 1;
      factor.current += (hoverTarget - factor.current) * Math.min(1, dt / 180);
      const auto = -(window.innerWidth >= 1024 ? 50 : 30) * factor.current;

      inertia.current *= Math.exp(-dt / INERTIA_DECAY);
      if (Math.abs(inertia.current) < 1) inertia.current = 0;

      targetX.current += ((auto + inertia.current) * dt) / 1000;
    }

    // x mengejar tujuan dengan halus (eksponensial), bukan langsung melompat.
    let cur = x.get();
    cur += (targetX.current - cur) * (1 - Math.exp(-dt / FOLLOW_TAU));

    // Loop mulus: geser x dan tujuan bersama-sama agar selisihnya tetap.
    while (cur > 0) {
      cur -= loop;
      targetX.current -= loop;
    }
    while (cur <= -loop) {
      cur += loop;
      targetX.current += loop;
    }
    x.set(cur);
  });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      active: true,
      captured: false,
      moved: 0,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
    inertia.current = 0;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const now = performance.now();
    const dtMs = Math.max(1, now - d.lastT);
    d.moved += Math.abs(dx);
    // Sudah jelas drag (bukan klik): tangkap pointer agar drag tetap berjalan walau kursor keluar dari kontainer.
    if (!d.captured && d.moved > DRAG_THRESHOLD) {
      e.currentTarget.setPointerCapture(e.pointerId);
      d.captured = true;
    }
    // Kecepatan dihaluskan agar gerakan terakhir sebelum dilepas yang menentukan inertia.
    d.velocity = d.velocity * 0.6 + (dx / dtMs) * 1000 * 0.4;
    d.lastX = e.clientX;
    d.lastT = now;
    targetX.current += dx * DRAG_GAIN;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured && e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    d.captured = false;
    // Hanya beri inertia bila pointer masih bergerak saat dilepas (bukan berhenti dulu sebelum lepas).
    const v = performance.now() - d.lastT < 80 ? d.velocity * DRAG_GAIN : 0;
    inertia.current = Math.max(-MAX_INERTIA, Math.min(MAX_INERTIA, v));
  };

  if (reduced) {
    return (
      <ul
        className="container-site flex snap-x gap-4 overflow-x-auto pb-4"
        aria-label="Karya pilihan"
      >
        {items.map((p) => (
          <li key={p.slug} className={`${CARD_WIDTH} snap-start`}>
            <ProjectCard project={p} sizes={SIZES} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing [&_a]:cursor-[inherit]"
      aria-label="Karya pilihan"
      role="region"
      onPointerEnter={() => {
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
      // Cadangan: batalkan drag-and-drop bawaan browser (tautan/gambar) agar drag marquee tidak terputus.
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // Setelah drag, cegah klik yang jatuh di atas kartu agar tidak berpindah halaman.
      onClickCapture={(e) => {
        if (drag.current.moved > DRAG_THRESHOLD) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = 0;
        }
      }}
    >
      <motion.ul
        ref={track}
        style={{ x, gap: GAP }}
        className="flex w-max py-2"
      >
        {[...items, ...items].map((p, i) => {
          const decorative = i >= items.length;
          return (
            <li
              key={`${p.slug}-${i}`}
              className={CARD_WIDTH}
              aria-hidden={decorative || undefined}
            >
              <ProjectCard
                project={p}
                sizes={SIZES}
                priority={i < 4}
                decorative={decorative}
              />
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
