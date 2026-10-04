"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox, type GalleryImage } from "./Lightbox";

type Item = GalleryImage & { index: number };

const isLandscape = (x: Item) => x.src.width > x.src.height;

/** Susun foto menjadi baris editorial: landscape selebar penuh, portrait berpasangan. */
function toRows(images: GalleryImage[]): Item[][] {
  const rows: Item[][] = [];
  const items = images.map((img, index) => ({ ...img, index }));
  let i = 0;
  while (i < items.length) {
    const a = items[i];
    if (isLandscape(a) || i === 0) {
      rows.push([a]); // foto pertama selalu jadi hero
      i += 1;
    } else if (i + 1 < items.length && !isLandscape(items[i + 1])) {
      rows.push([a, items[i + 1]]);
      i += 2;
    } else {
      rows.push([a]);
      i += 1;
    }
  }
  return rows;
}

type Props = {
  images: GalleryImage[];
  /** Judul dan cerita proyek, ditampilkan di panel samping lightbox. */
  title: string;
  story: string[];
};

export function Gallery({ images, title, story }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const rows = toRows(images);

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {rows.map((row, r) => {
          const pair = row.length === 2;
          return (
            <div
              key={r}
              // Pasangan: lebar tiap foto sebanding rasio aslinya (flex-grow = w/h), sehingga tinggi sama,
              // tanpa crop dan tanpa ruang kosong. Tunggal: landscape penuh, portrait setengah lebar di tengah.
              className={pair ? "flex gap-4 md:gap-6" : isLandscape(row[0]) ? "" : "mx-auto md:w-1/2"}
            >
              {row.map((img) => (
                <motion.button
                  key={img.index}
                  type="button"
                  onClick={() => setOpen(img.index)}
                  aria-label={`Perbesar foto ${img.index + 1}`}
                  className="block min-w-0 cursor-zoom-in overflow-hidden"
                  style={pair ? { flex: `${img.src.width / img.src.height} 1 0%` } : { width: "100%" }}
                  initial={{ clipPath: "inset(8% 0% 8% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, ease: [0.44, 0, 0.56, 1] }}
                >
                  <motion.div
                    initial={{ scale: 1.06 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.9, ease: [0.44, 0, 0.56, 1] }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      sizes={pair || !isLandscape(img) ? "(min-width: 810px) 50vw, 100vw" : "(min-width: 1440px) 1392px, 100vw"}
                      placeholder="blur"
                      priority={img.index === 0}
                      className="block h-auto w-full"
                    />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          );
        })}
      </div>
      <Lightbox images={images} index={open} onChange={setOpen} title={title} story={story} />
    </>
  );
}
