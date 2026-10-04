"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectCardData } from "@/content/projects";
import { springCard } from "@/lib/motion";

type Props = {
  project: ProjectCardData;
  /** Ukuran gambar untuk next/image (sesuaikan dengan lebar kartu). */
  sizes: string;
  priority?: boolean;
  /** Salinan marquee: dikeluarkan dari urutan tab dan pembaca layar. */
  decorative?: boolean;
};

/**
 * Kartu proyek. Hover persis referensi: seluruh kartu (foto + judul) mengecil ke scale 0.9
 * dengan spring (duration 1, bounce 0.25). Tanpa zoom-in atau pergantian gambar.
 */
export function ProjectCard({ project, sizes, priority, decorative }: Props) {
  return (
    <motion.div whileHover={{ scale: 0.9 }} transition={springCard} className="group">
      <Link
        href={`/works/${project.category}/${project.slug}`}
        tabIndex={decorative ? -1 : undefined}
        aria-hidden={decorative || undefined}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src={project.cover}
            alt={decorative ? "" : project.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            className="object-cover"
            draggable={false}
          />
        </div>
        <p className="text-title mt-4">{project.title}</p>
        <p className="text-label mt-1 text-muted">
          {project.categoryLabel} — {project.year}
        </p>
      </Link>
    </motion.div>
  );
}
