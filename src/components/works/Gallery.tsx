"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox, type GalleryImage } from "./Lightbox";

type Item = GalleryImage & { index: number };

/** Susun foto menjadi baris editorial: landscape selebar penuh, portrait berpasangan. */
function toRows(images: GalleryImage[]): Item[][] {
  const rows: Item[][] = [];
  const items = images.map((img, index) => ({ ...img, index }));
  let i = 0;
  while (i < items.length) {
    const a = items[i];
    const isLandscape = (x: Item) => x.src.width > x.src.height;
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

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const rows = toRows(images);

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {rows.map((row, r) => (
          <div key={r} className={row.length === 2 ? "grid grid-cols-2 gap-4 md:gap-6" : row[0].src.width > row[0].src.height ? "" : "mx-auto md:w-1/2"}>
            {row.map((img) => (
              <motion.button
                key={img.index}
                type="button"
                onClick={() => setOpen(img.index)}
                aria-label={`Perbesar foto ${img.index + 1}`}
                className="block w-full cursor-zoom-in overflow-hidden bg-surface"
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
                    sizes={row.length === 2 || img.src.width <= img.src.height ? "(min-width: 810px) 50vw, 100vw" : "(min-width: 1440px) 1392px, 100vw"}
                    placeholder="blur"
                    priority={img.index === 0}
                    className="h-auto w-full"
                  />
                </motion.div>
              </motion.button>
            ))}
          </div>
        ))}
      </div>
      <Lightbox images={images} index={open} onChange={setOpen} />
    </>
  );
}
