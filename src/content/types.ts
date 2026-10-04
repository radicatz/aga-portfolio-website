export type CategorySlug = "documentation" | "food" | "portrait" | "product" | "street";

export interface Category {
  slug: CategorySlug;
  label: string;
  title: string;
  intro: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: CategorySlug;
  client: string;
  year: string;
  location: string;
  excerpt: string;
  story: string[];
  /** Indeks foto yang dipakai sebagai cover (dari images.generated.ts). */
  coverIndex: number;
  /** Deskripsi dasar untuk alt text; ditambah nomor foto saat dirender. */
  altBase: string;
  /** Urutan di marquee Home. Kosong = tidak tampil. */
  featured?: number;
  /** Catatan yang perlu dikonfirmasi ke Aga. Tidak dirender. */
  todo?: string;
}

export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  description: string;
  /** Slug proyek yang fotonya dipakai sebagai thumbnail hover (berganti saat kursor bergerak). */
  previewProjects: string[];
  todo?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  previewProject: string;
}
