// Ikon dari set "Guidance" oleh Streamline (https://github.com/webalys-hq/streamline-vectors),
// lisensi CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Atribusi tampil di footer.
// Path disalin apa adanya dari Iconify (prefix "guidance"), viewBox 0 0 24 24, stroke tanpa fill.
//
// PERHATIAN: nama asli Guidance untuk panah terbalik secara visual ("left-2-short-arrow" ujungnya ke kanan).
// Kunci di bawah memakai ARAH VISUAL; nama asli dicatat di komentar. Memakai varian "short" (kepala panah pendek).
export const guidanceIcons = {
  // guidance:left-2-short-arrow (ujung ke kanan)
  "arrow-right":
    "M12 1.5c0 1.11 1.1 2.771 2.212 4.166c1.432 1.796 3.141 3.365 5.102 4.563c1.469.897 3.253 1.758 4.686 1.758M12 22.5c0-1.11 1.1-2.771 2.212-4.166c1.432-1.796 3.141-3.365 5.102-4.563c1.469-.897 3.253-1.758 4.686-1.758M24 12H0",
  // guidance:right-2-short-arrow (ujung ke kiri)
  "arrow-left":
    "M12 1.5c0 1.11-1.1 2.771-2.212 4.166c-1.432 1.796-3.141 3.365-5.102 4.563c-1.469.897-3.253 1.758-4.686 1.758M12 22.5c0-1.11-1.1-2.771-2.212-4.166c-1.432-1.796-3.141-3.365-5.102-4.563c-1.469-.897-3.253-1.758-4.686-1.758M0 12h24",
  // guidance:phone
  phone: "M2 4.706C2 14.257 9.743 22 19.294 22L23 18.294l-4.323-4.323l-3.089 3.088l-8.647-8.647l3.088-3.088L5.706 1z",
} as const;

export type IconName = keyof typeof guidanceIcons;
