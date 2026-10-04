// Satu sumber untuk identitas, kontak, dan navigasi. Jangan menduplikasi nilai ini di komponen.

const whatsappNumber = "6282130618881";
const whatsappMessage = "Halo Aga, saya ingin diskusi proyek foto.";

export const site = {
  name: "Aga Kharta Dinata",
  wordmark: "AGA KHARTA DINATA",
  tagline: "Cahaya, Detail, Cerita.",
  description:
    "Portofolio fotografer Aga Kharta Dinata: fotografi makanan, produk, potret, dokumentasi, dan street photography. Berbasis di Tangerang dan Jakarta.",
  location: "Tangerang · Jakarta",
  url: "https://agakhartadinata.com",
  contact: {
    email: "agakhartadinata@gmail.com",
    phoneDisplay: "+62 821-3061-8881",
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
    instagramHandle: "@agadinata_",
    instagramUrl: "https://www.instagram.com/agadinata_/",
  },
  nav: [
    { label: "WORKS", href: "/works" },
    { label: "ABOUT", href: "/about" },
    { label: "EXPERIENCE", href: "/experience" },
    { label: "SERVICES", href: "/services" },
    { label: "CONTACT", href: "/contact" },
  ],
  footer: {
    cta: "Mari Abadikan Cerita Anda",
    copyright: "© 2026 Aga Kharta Dinata · Tangerang, Indonesia",
  },
} as const;
