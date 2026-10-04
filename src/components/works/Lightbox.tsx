"use client";

import { AnimatePresence, motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

export type GalleryImage = { src: StaticImageData; alt: string };

type Props = {
  images: GalleryImage[];
  /** Indeks foto yang terbuka; null = tertutup. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Lightbox: Esc menutup, panah/swipe berpindah, fokus terkunci di dalam dialog dan dikembalikan saat ditutup. */
export function Lightbox({ images, index, onChange }: Props) {
  const open = index !== null;
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const go = (delta: number) => {
    if (index === null) return;
    onChange((index + delta + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

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
          aria-label="Galeri foto"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-surface"
        >
          <div className="flex items-center justify-between px-4 py-4 text-label md:px-6">
            <span aria-live="polite">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => onChange(null)} className="hover-line">
              TUTUP
            </button>
          </div>

          <motion.div
            key={index}
            className="relative min-h-0 flex-1 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain p-2 md:p-6" draggable={false} priority />
          </motion.div>

          {images.length > 1 && (
            <div className="flex items-center justify-between px-4 py-4 text-label md:px-6">
              <button type="button" onClick={() => go(-1)} className="hover-line" aria-label="Foto sebelumnya">
                ← SEBELUMNYA
              </button>
              <button type="button" onClick={() => go(1)} className="hover-line" aria-label="Foto berikutnya">
                BERIKUTNYA →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
