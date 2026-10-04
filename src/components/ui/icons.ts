// Ikon dari set "Guidance" oleh Streamline (https://github.com/webalys-hq/streamline-vectors),
// lisensi CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Atribusi tampil di footer.
// Path disalin apa adanya dari Iconify (prefix "guidance"), viewBox 0 0 24 24, stroke tanpa fill.
//
// PERHATIAN: nama asli Guidance untuk panah terbalik secara visual ("right-arrow" ujungnya ke kiri).
// Kunci di bawah memakai ARAH VISUAL; nama asli dicatat di komentar.
export const guidanceIcons = {
  // guidance:left-arrow (ujung ke kanan)
  "arrow-right":
    "M16 5c0 .742.733 1.85 1.475 2.78c.954 1.2 2.094 2.247 3.401 3.046C21.856 11.425 23.044 12 24 12m0 0c-.956 0-2.145.575-3.124 1.174c-1.307.8-2.447 1.847-3.401 3.045C16.733 17.15 16 18.26 16 19m8-7H0",
  // guidance:right-arrow (ujung ke kiri)
  "arrow-left":
    "M8 5c0 .742-.733 1.85-1.475 2.78c-.954 1.2-2.094 2.247-3.401 3.046C2.144 11.425.956 12 0 12m0 0c.956 0 2.145.575 3.124 1.174c1.307.8 2.447 1.847 3.401 3.045C7.267 17.15 8 18.26 8 19m-8-7h24",
  // guidance:phone
  phone: "M2 4.706C2 14.257 9.743 22 19.294 22L23 18.294l-4.323-4.323l-3.089 3.088l-8.647-8.647l3.088-3.088L5.706 1z",
} as const;

export type IconName = keyof typeof guidanceIcons;
