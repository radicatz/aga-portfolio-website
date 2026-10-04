import { categoryBySlug } from "./categories";
import { projectImages } from "./images.generated";
import type { CategorySlug, Project } from "./types";

export const projects: Project[] = [
  // ───────── Food ─────────
  {
    slug: "omakase-sake",
    title: "Omakase & Sake",
    category: "food",
    client: "Restoran Jepang, Jakarta",
    year: "2024",
    location: "Jakarta",
    excerpt: "Sake dalam kemasan kayu, nigiri yang baru dibentuk, dan hidangan penutup dalam porsi kecil.",
    story: [
      "Seri untuk sebuah restoran Jepang: sake dalam kemasan kayu, nigiri yang baru dibentuk, dan hidangan penutup yang disajikan dalam porsi kecil. Latar gelap dan cahaya samping yang sempit dipakai untuk menonjolkan kilau ikan dan tekstur nasi, mengikuti suasana ruang makan yang tenang dan intim.",
    ],
    coverIndex: 10,
    altBase: "Hidangan Jepang dan sake dengan latar gelap",
    featured: 1,
    todo: "Konfirmasi klien: Yawara Boga? Tanggal file 2024, sedangkan masa kerja di Yawara berakhir 2023.",
  },
  {
    slug: "cellar-notes",
    title: "Cellar Notes",
    category: "food",
    client: "Katalog Wine",
    year: "2024",
    location: "Jakarta",
    excerpt: "Satu botol, satu sumber cahaya, latar batu gelap.",
    story: [
      "Katalog wine dengan pendekatan yang konsisten: satu botol, satu sumber cahaya, latar batu gelap. Label dibiarkan terbaca jelas, sementara pantulan kaca dijaga tetap halus agar setiap botol tampil setara di halaman katalog.",
    ],
    coverIndex: 0,
    altBase: "Botol wine dengan latar batu gelap",
    featured: 5,
  },
  {
    slug: "meja-ramadan",
    title: "Meja Ramadan",
    category: "food",
    client: "Klien Katering",
    year: "2025",
    location: "Tangerang",
    excerpt: "Menu berbuka bernuansa Timur Tengah di antara ornamen kuningan dan panel kisi emas.",
    story: [
      "Menu berbuka dengan nuansa Timur Tengah: nasi rempah, ayam panggang, dan sup kacang, ditata di antara ornamen kuningan dan panel kisi emas. Setiap hidangan dipotret dalam dua komposisi, tegak dan mendatar, agar siap untuk katalog maupun media sosial.",
    ],
    coverIndex: 8,
    altBase: "Hidangan berbuka bernuansa Timur Tengah",
    featured: 7,
    todo: "Konfirmasi klien: MyMeal?",
  },
  {
    slug: "hidangan-rumahan",
    title: "Hidangan Rumahan",
    category: "food",
    client: "Klien Katering",
    year: "2025",
    location: "Tangerang",
    excerpt: "Pangsit goreng, sup jagung, dan tumisan daging dengan cahaya hangat.",
    story: [
      "Sesi singkat untuk menu harian: pangsit goreng, sup jagung, dan tumisan daging di atas papan kayu. Cahaya hangat dan properti sederhana menjaga kesan akrab, seperti makanan yang baru saja diangkat dari dapur.",
    ],
    coverIndex: 0,
    altBase: "Hidangan rumahan di atas papan kayu",
    todo: "Konfirmasi klien: MyMeal?",
  },

  // ───────── Product ─────────
  {
    slug: "ritual-kulit",
    title: "Ritual Kulit",
    category: "product",
    client: "Brand Skincare Lokal",
    year: "2026",
    location: "Studio, Tangerang",
    excerpt: "Setiap produk ditempatkan di lingkungan yang mencerminkan kandungannya.",
    story: [
      "Rangkaian foto untuk beberapa lini perawatan kulit. Setiap produk ditempatkan dalam lingkungan yang mencerminkan kandungannya: lumut untuk gel berbahan alami, kayu dan tanah untuk toner, gradasi lembut untuk tabir surya. Cahaya dibuat bersih supaya warna kemasan tetap akurat.",
    ],
    coverIndex: 1,
    altBase: "Produk perawatan kulit di studio",
    featured: 2,
  },
  {
    slug: "penanda-waktu",
    title: "Penanda Waktu",
    category: "product",
    client: "Brand Jam Tangan",
    year: "2026",
    location: "Studio, Tangerang",
    excerpt: "Jam tangan di antara kain satin hitam dan bebatuan vulkanik.",
    story: [
      "Jam tangan dipotret di antara kain satin hitam dan bebatuan vulkanik. Pencahayaan sempit menyorot hanya bagian yang penting, yaitu angka, jarum, dan tekstur strap, sementara sisanya dibiarkan tenggelam dalam gelap.",
    ],
    coverIndex: 2,
    altBase: "Jam tangan dengan latar gelap",
  },
  {
    slug: "batu-kilau",
    title: "Batu & Kilau",
    category: "product",
    client: "Brand Perhiasan",
    year: "2025",
    location: "Studio, Tangerang",
    excerpt: "Cincin berbatu biru dengan bunga segar dan batu kasar sebagai pasangan.",
    story: [
      "Cincin berbatu biru dan putih dengan bunga segar dan batu kasar sebagai pasangan. Kontras antara permukaan yang kasar dan potongan permata yang tajam memberi ruang bagi kilau untuk terlihat lebih hidup.",
    ],
    coverIndex: 1,
    altBase: "Cincin berbatu biru dengan bunga",
    featured: 6,
    todo: "Tambahkan foto cincin.jpg saat file asli resolusi tinggi tersedia.",
  },

  // ───────── Portrait ─────────
  {
    slug: "denim-cahaya-lembut",
    title: "Denim & Cahaya Lembut",
    category: "portrait",
    client: "Sesi Personal",
    year: "2024",
    location: "Studio, Tangerang",
    excerpt: "Jaket denim, kerudung netral, dan cahaya lembut dari satu arah.",
    story: [
      "Sesi potret studio dengan satu konsep sederhana: jaket denim, kerudung netral, dan cahaya lembut dari satu arah. Variasi latar abu-abu gelap hingga putih menghadirkan dua suasana yang berbeda dari satu sesi yang sama.",
    ],
    coverIndex: 0,
    altBase: "Potret perempuan berjaket denim di studio",
    featured: 4,
    todo: "Pastikan persetujuan publikasi dari subjek.",
  },
  {
    slug: "hitam-putih-kursi",
    title: "Hitam, Putih, dan Sebuah Kursi",
    category: "portrait",
    client: "Sesi Personal",
    year: "2024",
    location: "Studio, Tangerang",
    excerpt: "Latar putih bersih, busana hitam, dan sebuah kursi sebagai satu-satunya properti.",
    story: [
      "Latar putih bersih, busana hitam, dan sebuah kursi sebagai satu-satunya properti. Pose dibuat santai dan diulang dengan sedikit perubahan, misalnya kacamata hitam yang dilepas, sehingga karakter subjek muncul dari detail kecil.",
    ],
    coverIndex: 0,
    altBase: "Potret berbusana hitam dengan kursi putih",
    todo: "Pastikan persetujuan publikasi dari subjek.",
  },
  {
    slug: "tujuh-belas",
    title: "Tujuh Belas",
    category: "portrait",
    client: "Klien Korporat",
    year: "2025",
    location: "Tangerang",
    excerpt: "Potret tim untuk perayaan hari jadi ke-17 sebuah perusahaan.",
    story: [
      "Potret tim untuk perayaan hari jadi ke-17 sebuah perusahaan. Dari foto bersama yang riuh dengan balon angka emas hingga potret close-up dengan kue ulang tahun dalam cahaya low-key, sesi ini merekam kebersamaan dan rasa bangga di hari yang sama.",
    ],
    coverIndex: 2,
    altBase: "Potret perayaan hari jadi ke-17",
    todo: "Konfirmasi perusahaan dan persetujuan publikasi.",
  },

  // ───────── Documentation ─────────
  {
    slug: "hunting-di-pulau",
    title: "Hunting di Pulau",
    category: "documentation",
    client: "Komunitas Fotografi",
    year: "2024",
    location: "Kepulauan Seribu",
    excerpt: "Dermaga kayu, kapal penyeberangan, dan reruntuhan benteng bata merah.",
    story: [
      "Perjalanan hunting bersama komunitas ke pulau di utara Jakarta. Dari dermaga kayu dan kapal penyeberangan sampai reruntuhan benteng bata merah, seri ini merekam orang-orang yang sibuk mencari sudut terbaik, sementara sejarah berdiri diam di sekeliling mereka.",
    ],
    coverIndex: 2,
    altBase: "Peserta hunting fotografi di pulau",
    featured: 8,
    todo: "Konfirmasi lokasi (Pulau Kelor/Onrust?) dan tahun.",
  },
  {
    slug: "pelatihan-fotografi",
    title: "Pelatihan Fotografi",
    category: "documentation",
    client: "Dinas Pariwisata dan Ekonomi Kreatif DKI Jakarta",
    year: "2023",
    location: "Jakarta",
    excerpt: "Foto bersama peserta dan panitia sebagai penutup rangkaian pelatihan.",
    story: [
      "Dokumentasi program pelatihan fotografi Dinas Pariwisata dan Ekonomi Kreatif Provinsi DKI Jakarta, program yang juga diikuti Aga sebagai peserta. Foto bersama peserta dan panitia menjadi penutup rangkaian kegiatan.",
    ],
    coverIndex: 0,
    altBase: "Foto bersama peserta pelatihan fotografi",
    todo: "DSC_0296 (acara di karpet ungu) belum dipakai; tanyakan konteksnya.",
  },

  // ───────── Street ─────────
  {
    slug: "ritme-malam-kota",
    title: "Ritme Malam Kota",
    category: "street",
    client: "Personal",
    year: "2025",
    location: "Jakarta",
    excerpt: "Jakarta setelah matahari turun, dan orang-orang yang terus bergerak di dalamnya.",
    story: [
      "Jakarta setelah matahari turun: langit yang terbakar di atas kemacetan, pengendara yang memantul di genangan, penjual kaki lima di balik nyala api, dan seseorang yang menemukan jeda di balik kaca. Lima foto tentang kota yang tidak pernah benar-benar berhenti, dan orang-orang yang terus bergerak di dalamnya.",
    ],
    coverIndex: 1,
    altBase: "Suasana jalanan Jakarta saat senja dan malam",
    featured: 3,
  },
  {
    slug: "kembali-hunting",
    title: "Kembali Hunting",
    category: "street",
    client: "Personal",
    year: "2026",
    location: "Jakarta",
    excerpt: "Siang hari di sepanjang rel kereta, tanpa target.",
    story: [
      "Siang hari di sepanjang rel kereta: kereta yang melintas, pejalan kaki yang menyeberang, dan teman seperjalanan yang sibuk memeriksa hasil jepretan. Seri ini dibuat tanpa target, hanya kembali membiasakan mata untuk melihat.",
    ],
    coverIndex: 0,
    altBase: "Rel kereta dan pejalan kaki di Jakarta",
  },
  {
    slug: "sebelum-kota",
    title: "Sebelum Kota",
    category: "street",
    client: "Personal",
    year: "2023",
    location: "Bandung · Labuan Bajo",
    excerpt: "Matahari pagi di Cukul, curug di selatan Bandung, dan senja di Labuan Bajo.",
    story: [
      "Beberapa perjalanan dari 2023: matahari pagi di Cukul, curug di selatan Bandung, dan senja di Labuan Bajo. Foto-foto awal yang membentuk kebiasaan untuk menunggu cahaya yang tepat.",
    ],
    coverIndex: 0,
    altBase: "Pemandangan alam dari perjalanan 2023",
  },
];

const withImages = (project: Project) => {
  const images = projectImages[project.slug] ?? [];
  return {
    ...project,
    cover: images[project.coverIndex] ?? images[0],
    images: images.map((src, i) => ({
      src,
      alt: `${project.altBase} (${i + 1} dari ${images.length})`,
    })),
  };
};

export type ProjectWithImages = ReturnType<typeof withImages>;

export const allProjects: ProjectWithImages[] = projects.map(withImages);

export const projectsByCategory = (category: CategorySlug) =>
  allProjects.filter((p) => p.category === category);

export const getProjectBySlug = (slug: string) => allProjects.find((p) => p.slug === slug);

export const getProject = (category: string, slug: string) =>
  allProjects.find((p) => p.category === category && p.slug === slug);

export const featuredProjects = allProjects
  .filter((p) => p.featured !== undefined)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

/** Proyek berikutnya dalam kategori yang sama (berputar). */
export const nextProject = (project: ProjectWithImages) => {
  const siblings = projectsByCategory(project.category);
  const i = siblings.findIndex((p) => p.slug === project.slug);
  return siblings[(i + 1) % siblings.length];
};

/** Data minimal untuk kartu proyek (marquee Home dan grid /works). */
export const toCardData = (p: ProjectWithImages) => ({
  slug: p.slug,
  category: p.category,
  categoryLabel: categoryBySlug(p.category)?.label ?? p.category,
  title: p.title,
  year: p.year,
  cover: p.cover,
  alt: p.images[p.coverIndex]?.alt ?? p.title,
});

export type ProjectCardData = ReturnType<typeof toCardData>;
