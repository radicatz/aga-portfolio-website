// Token transisi. Nilai diambil dari bundle Framer referensi (docs/PLAN.md §1.4–1.5).
// Jangan membuat ease/spring baru di komponen; tambahkan di sini dan di docs/DESIGN-SYSTEM.md §4.
import type { Transition } from "motion/react";

export const easeFramer = [0.44, 0, 0.56, 1] as const;

/** Hover garis, footer CTA, fade standar. */
export const tween: Transition = { type: "tween", duration: 0.5, ease: easeFramer };

/** Hover kartu proyek dan tombol WhatsApp: ada sedikit pantulan. */
export const springCard: Transition = { type: "spring", duration: 1, bounce: 0.25 };

/** Hover kartu tempat kerja, panah, kemunculan elemen kecil. */
export const springSoft: Transition = { type: "spring", duration: 1, bounce: 0.2 };

/** Hover cepat ("Next >", link kembali). */
export const springQuick: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };

/** Judul per huruf saat load. */
export const springText: Transition = { type: "spring", duration: 1, bounce: 0 };

/** Buka/tutup menu mobile. */
export const menuTween: Transition = { type: "tween", duration: 0.4, ease: [0.27, 0, 0.51, 1] };

/** Efek awal judul per huruf: kabur lalu tajam. */
export const blurIn = {
  hidden: { opacity: 0.001, filter: "blur(10px)", y: 10 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
} as const;
