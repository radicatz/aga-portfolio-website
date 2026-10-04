import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "documentation",
    label: "Documentation",
    title: "Yang terjadi, apa adanya.",
    intro: [
      "Dokumentasi bukan soal mengatur adegan, melainkan berada di tempat yang tepat tanpa mengganggu jalannya acara. Dari pelatihan fotografi hingga perjalanan hunting ke pulau, foto-foto ini merekam orang-orang yang sedang belajar, berjalan, dan bekerja bersama.",
      "Fokusnya sederhana: momen yang jujur, komposisi yang rapi, dan cerita yang tetap utuh ketika dilihat kembali bertahun-tahun kemudian.",
    ],
  },
  {
    slug: "food",
    label: "Food",
    title: "Rasa yang bisa dilihat.",
    intro: [
      "Lebih dari tujuh tahun memotret dapur dan meja makan, dari omakase dan sake untuk restoran Jepang, katalog wine, sampai menu harian katering, mengajarkan satu hal: makanan hanya punya beberapa menit sebelum kehilangan tampilan terbaiknya.",
      "Karena itu setiap sesi disiapkan dengan cermat. Arah cahaya, tekstur, uap, dan kilau ditata agar foto tidak hanya menunjukkan bentuk hidangan, tetapi juga mengundang orang untuk mencicipinya.",
    ],
  },
  {
    slug: "portrait",
    label: "Portrait",
    title: "Wajah, dan cerita di baliknya.",
    intro: [
      "Potret yang baik dimulai dari rasa nyaman. Sebelum kamera diangkat, ada percakapan, jeda, dan waktu bagi subjek untuk menjadi dirinya sendiri.",
      "Dari sesi studio personal hingga potret bersama sebuah tim, tujuannya tetap sama: menangkap karakter, bukan sekadar rupa. Cahaya dibentuk untuk mendukung ekspresi, bukan menutupinya.",
    ],
  },
  {
    slug: "product",
    label: "Product",
    title: "Produk sebagai pusat cerita.",
    intro: [
      "Saat ini, foto produk adalah pengganti sentuhan: menjelaskan bentuk, material, dan rasa sebuah barang tanpa satu kata pun.",
      "Eksplorasi pendekatan low-key: latar gelap, cahaya terarah, dan properti alami seperti batu, kayu, dan bunga. Hasilnya visual yang bersih, fokus, dan siap dipakai untuk katalog, e-commerce, maupun kampanye.",
    ],
  },
  {
    slug: "street",
    label: "Street Photography",
    title: "Kota, pelan-pelan.",
    intro: [
      "Di luar pekerjaan komersial, kamera tetap ikut berjalan. Jalanan Jakarta menjadi tempat untuk berlatih melihat: rel kereta di siang terik, lampu kendaraan di malam hari, dan penjual kaki lima di balik nyala api.",
      "Tidak ada brief dan tidak ada target. Hanya kebiasaan untuk berhenti sejenak dan memperhatikan. Pelan-pelan, tanpa dikejar hasil. Seri ini juga memuat beberapa perjalanan alam dari tahun-tahun sebelumnya, ketika kamera pertama kali dibawa keluar kota.",
    ],
  },
];

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  categories.some((c) => c.slug === slug);
