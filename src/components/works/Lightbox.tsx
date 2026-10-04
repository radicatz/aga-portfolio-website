"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { lightbox } from "@/content/pages";
import { springText } from "@/lib/motion";

export type GalleryImage = { src: StaticImageData; alt: string };

type Props = {
  images: GalleryImage[];
  /** Indeks foto yang terbuka; null = tertutup. */
  index: number | null;
  onChange: (index: number | null) => void;
  title: string;
  story: string[];
};

// Foto bergeser sedikit searah navigasi sambil kabur-lalu-tajam; foto lama keluar ke arah berlawanan.
const slide = {
  enter: (dir: number) => ({ x: `${dir * 6}%`, opacity: 0, filter: "blur(8px)" }),
  center: { x: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: `${dir * -6}%`, opacity: 0, filter: "blur(8px)" }),
};

/** Perbesaran saat hover (mouse). Foto sumber maks 2400px: 4x paling tajam pada foto portrait, foto landscape lebar agak lunak. */
const ZOOM = 4;

// Zoom dibuat halus: skala naik/turun dengan durasi panjang (ease-in-out, tanpa pantulan) dan titik zoom meluncur
// mengikuti kursor, tidak melompat. Durasi dibuat panjang karena perbesaran 4x menempuh jarak visual yang jauh.
const ZOOM_IN_DURATION = 1.4;
const ZOOM_OUT_DURATION = 1.1;
// Ease-in-out: mulai pelan, menanjak di tengah, mendarat pelan (ease-out murni terasa mendadak di awal).
const ZOOM_EASE = [0.65, 0, 0.35, 1] as const;
const ORIGIN_SPRING = { stiffness: 70, damping: 18 };

const pad = (n: number) => String(n).padStart(2, "0");

// Zoom hover hanya untuk perangkat dengan mouse; layar sentuh tetap memakai swipe untuk berpindah foto.
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribeFinePointer = (cb: () => void) => {
  const m = window.matchMedia(FINE_POINTER);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useFinePointer = () =>
  useSyncExternalStore(subscribeFinePointer, () => window.matchMedia(FINE_POINTER).matches, () => false);

/**
 * Lightbox layar penuh (mengikuti .context/design/gallery.png): kiri foto + kontrol, kanan judul dan cerita proyek.
 * Esc menutup, panah/swipe berpindah dengan animasi geser, fokus terkunci dan dikembalikan saat ditutup.
 * Hover mouse pada foto memperbesarnya (zoom detail seperti halaman produk): titik zoom mengikuti kursor dan
 * versi resolusi tinggi dimuat saat hover pertama. Reduced-motion menonaktifkan zoom.
 */
export function Lightbox({ images, index, onChange, title, story }: Props) {
  const open = index !== null;
  const [dir, setDir] = useState(1);
  const [hires, setHires] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const canZoom = finePointer && !reduced;
  const targetX = useMotionValue(0.5);
  const targetY = useMotionValue(0.5);
  const originX = useSpring(targetX, ORIGIN_SPRING);
  const originY = useSpring(targetY, ORIGIN_SPRING);
  const scale = useMotionValue(1);
  const scaleAnim = useRef<ReturnType<typeof animate> | null>(null);

  /** Animasikan skala zoom ke nilai tujuan; animasi sebelumnya dihentikan agar tidak saling berebut. */
  const zoomTo = (value: number, duration: number) => {
    scaleAnim.current?.stop();
    scaleAnim.current = animate(scale, value, { duration, ease: ZOOM_EASE });
  };

  /** Perbarui titik zoom dari posisi kursor. `snap`: lompat langsung (saat kursor masuk) agar zoom mulai tepat di kursor. */
  const track = (e: PointerEvent<HTMLDivElement>, snap = false) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    targetX.set(x);
    targetY.set(y);
    if (snap) {
      originX.jump(x);
      originY.jump(y);
    }
  };

  const go = (delta: number) => {
    if (index === null) return;
    setDir(delta);
    onChange((index + delta + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = "";
      scaleAnim.current?.stop();
      scale.jump(1); // buka berikutnya selalu mulai tanpa zoom
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, scale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const focusable = dialog.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const image = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.ariaLabel}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-surface lg:grid lg:grid-cols-[1fr_minmax(340px,32%)] lg:overflow-hidden"
        >
          {/* Kolom foto */}
          <div className="flex flex-col lg:h-dvh">
            <div className="flex items-center justify-between px-4 py-5 text-label md:px-6">
              <span aria-live="polite">
                {pad((index ?? 0) + 1)} {lightbox.counterOf} {pad(images.length)}
              </span>
              <button type="button" onClick={() => onChange(null)} className="hover-line">
                {lightbox.close}
              </button>
            </div>

            <motion.div
              data-zoom-stage
              className={`relative h-[62dvh] overflow-hidden lg:h-auto lg:min-h-0 lg:flex-1 ${
                canZoom ? "cursor-zoom-in" : "cursor-grab active:cursor-grabbing"
              }`}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={springText}
              // Swipe untuk berpindah foto hanya di layar sentuh; dengan mouse, hover dipakai untuk zoom.
              drag={canZoom ? false : "x"}
              dragSnapToOrigin
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
              onPointerEnter={(e) => {
                if (!canZoom || e.pointerType !== "mouse") return;
                track(e, true);
                setHires(true);
                zoomTo(ZOOM, ZOOM_IN_DURATION);
              }}
              onPointerMove={(e) => canZoom && e.pointerType === "mouse" && track(e)}
              onPointerLeave={() => zoomTo(1, ZOOM_OUT_DURATION)}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={index}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springText}
                  className="absolute inset-0"
                >
                  {/* Lapisan zoom: terpisah dari animasi geser agar keduanya tidak saling menimpa */}
                  <motion.div data-zoom-layer className="absolute inset-0" style={{ originX, originY, scale }}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      // Setelah hover pertama, minta kandidat resolusi tertinggi agar detail tetap tajam saat diperbesar.
                      sizes={hires ? "2400px" : "(min-width: 1024px) 66vw, 100vw"}
                      className="object-contain p-2 md:p-6"
                      draggable={false}
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {images.length > 1 && (
              <div className="flex items-center justify-between px-4 py-5 text-label md:px-6">
                <button type="button" onClick={() => go(-1)} className="hover-line group inline-flex items-center gap-3" aria-label={lightbox.previous}>
                  <Icon name="arrow-left" className="size-5" />
                  {lightbox.previous}
                </button>
                <button type="button" onClick={() => go(1)} className="hover-line group inline-flex items-center gap-3" aria-label={lightbox.next}>
                  {lightbox.next}
                  <Icon name="arrow-right" className="size-5" />
                </button>
              </div>
            )}
          </div>

          {/* Panel cerita */}
          <aside className="border-t border-line/15 px-4 pb-10 pt-8 md:px-6 lg:h-dvh lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pt-6">
            <p className="text-heading">{title}</p>
            <div className="mt-8 space-y-4">
              {story.map((p) => (
                <p key={p} className="text-body">
                  {p}
                </p>
              ))}
            </div>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
