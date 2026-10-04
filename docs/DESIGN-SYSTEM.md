# Design System

Sumber kebenaran untuk token, motion, dan komponen. Detail alasan dan nilai referensi ada di `docs/PLAN.md` §1 dan §4. **Perbarui file ini setiap kali ada token atau komponen baru.**

## 1. Token warna (`src/app/globals.css`)

| Token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0E0E0D` |
| `--fg` | `#0A0A0A` | `#F1F0EC` |
| `--muted` | `#6E6D6D` (referensi `#7D7C7C` hanya 4.16:1, gagal WCAG AA) | `#8C8B87` |
| `--line` | `#262525` | `#F1F0EC` |
| `--surface` | `#F6F5F2` | `#171716` |

Tailwind: `bg-bg text-fg text-muted border-line bg-surface`. Garis tipis memakai `border-line/15` atau `/100` sesuai konteks. Tema diatur lewat atribut `data-theme` (next-themes, default `light`).

## 2. Tipografi

| Peran | Font | Kelas utilitas |
|---|---|---|
| Display (hero, judul halaman/proyek, wordmark, CTA footer, nilai kontak) | **Le Murmure** (SIL OFL 1.1, `assets/fonts/le-murmure/`) | `text-display`, `font-display` |
| Judul panel (cerita proyek di lightbox) | Le Murmure | `text-heading` |
| H2 / judul kartu | Le Murmure | `text-title` |
| Body | **Space Grotesk** 300 Light (Google Fonts; default `body`) | `text-body` |
| Nav / label / meta | Space Grotesk 500 uppercase | `text-label` |

Variabel font: `--font-display-face` / `--font-body-face` (next/font di `layout.tsx`) dipetakan ke `--font-display` / `--font-body` di `globals.css`. Murmure sangat condensed: `text-display` memakai line-height 0.92. Sumber lengkap font (spesimen, glyphs) ada di `.context/fonts/murmure-main/`.

## 3. Grid dan spacing
Container maks 1440px (`.container-site`), gutter 24px desktop / 16px mobile. Ritme vertikal section: `py-section` (120 / 96 / 64px). Breakpoint: 810 (tablet), 1024 (nav desktop), 1200 (desktop).

## 4. Token motion (`src/lib/motion.ts`)

| Token | Nilai |
|---|---|
| `easeFramer` | `[0.44, 0, 0.56, 1]` |
| `tween` | `{ duration: 0.5, ease: easeFramer }` |
| `springCard` | `{ type: 'spring', duration: 1, bounce: 0.25 }` |
| `springSoft` | `{ type: 'spring', duration: 1, bounce: 0.2 }` |
| `springQuick` | `{ type: 'spring', duration: 0.4, bounce: 0.2 }` |
| `springText` | `{ type: 'spring', duration: 1, bounce: 0 }` |
| `menuTween` | `{ duration: 0.4, ease: [0.27, 0, 0.51, 1] }` |

## 5. Pola hover (jangan menyimpang)

| Elemen | Hover |
|---|---|
| Nav link, footer link, tombol teks | `HoverLine` (`.hover-line`): garis 1px tumbuh dari kiri, di bawah teks (`tween`) |
| Baris/tab yang punya separator `border-b` (tab /works, indeks kategori Home) | `.hover-rule`: garis tumbuh TEPAT di atas separator (`bottom: -1px`); elemen harus menempel ke tepi bawah kontainer bergaris |
| Link dengan panah aksi (`ArrowLink`, Next) | panah `→` berputar ke `↗` (`.arrow-ne` / Motion `rotate -45`); panah navigasi kembali `←` tidak berputar |
| Foto di slideshow (lightbox), hanya mouse | **Pengecualian disengaja** dari aturan hover yang menahan diri: foto diperbesar 4x di sekitar kursor untuk memeriksa detail (spring lembut tanpa pantulan, titik zoom meluncur mengikuti kursor, resolusi tinggi dimuat saat hover pertama). Tidak aktif di layar sentuh (swipe) dan saat reduced-motion |
| Marquee Home | kecepatan melambat halus ke 25% saat hover (nilai referensi `tickerEffectHoverModifier: 25`); bisa di-drag kiri/kanan dengan inertia |
| Kartu proyek | `scale 0.9` (`springCard`) |
| Footer CTA | teks `scale 0.9` + panah `→` berputar ke `↗` (`rotate -45`, `tween`) |
| "Next >" / link kembali | `opacity 0.5` (`springQuick`) |
| Kartu tempat kerja (About) | foto `scale 0.8, skewX -5, skewY -8` + label muncul (`springSoft`) |
| Link teks | `--muted` → `--fg` |
| WhatsApp FAB / pil | `scale 0.9` (`springCard`) + panah `→` berputar ke `↗` (`rotate -45`) |

## 6. Inventaris komponen

Status: ✅ siap · 🚧 dalam proses · ⬜ belum dibuat. Semua komponen di bawah sudah lolos lint, build, dan audit aksesibilitas (light dan dark).

| Komponen | Path | Fungsi |
|---|---|---|
| `HoverLine` | `src/components/ui/HoverLine.tsx` ✅ | Link (internal/eksternal) dengan garis bawah tumbuh; prop `active`. CSS di `globals.css` (`.hover-line`) |
| `Icon` / `WhatsAppIcon` | `src/components/ui/Icon.tsx` ✅ | Ikon Guidance (path di `icons.ts`, dikunci per ARAH VISUAL karena nama aslinya terbalik) dan WhatsApp yang digambar ulang bergaya Guidance |
| `ArrowLink` | `src/components/ui/ArrowLink.tsx` ✅ | `HoverLine` + ikon panah (`direction` right = berputar ↗, left = tetap) |
| `WhatsAppPill` | `src/components/ui/WhatsAppPill.tsx` ✅ | Pil WhatsApp monokrom; dipakai FAB dan halaman Contact |
| `SplitTextReveal` | `src/components/motion/SplitTextReveal.tsx` ✅ | Judul per huruf, blur-in saat mount. Prop `as: h1\|h2\|h3\|p\|span` |
| `Reveal` | `src/components/motion/Reveal.tsx` ✅ | Muncul sekali saat masuk viewport |
| `PageTransition` | `src/components/motion/PageTransition.tsx` ✅ | Fade antar halaman (dipakai `app/template.tsx`); hanya opacity |
| `Providers` | `src/components/layout/Providers.tsx` ✅ | next-themes, MotionConfig reduced-motion, Lenis |
| `Navbar` | `src/components/nav/Navbar.tsx` ✅ | Sticky, hide on scroll down. Menerima `categories` dari layout |
| `MobileMenu` | `src/components/nav/MobileMenu.tsx` ✅ | Overlay layar penuh, stagger |
| `ThemeToggle` | `src/components/nav/ThemeToggle.tsx` ✅ | LIGHT / DARK dengan View Transitions |
| `Footer` / `FooterCTA` | `src/components/layout/` ✅ | Footer + CTA (`text-display`, scale 0.9, panah ↗); atribusi ikon CC BY 4.0; `data-hide-fab` |
| `WhatsAppFab` | `src/components/layout/WhatsAppFab.tsx` ✅ | Tombol sticky; tersembunyi bila `[data-hide-fab]` terlihat |
| `ProjectCard` | `src/components/works/ProjectCard.tsx` ✅ | Kartu proyek, hover scale 0.9 (spring) |
| `ProjectMarquee` | `src/components/works/ProjectMarquee.tsx` ✅ | Ticker Home 50/30 px/s, hover 25%, drag + inertia; reduced-motion = carousel |
| `CategoryTabs` | `src/components/works/CategoryTabs.tsx` ✅ | Tab filter sticky |
| `WorksView` | `src/components/works/WorksView.tsx` ✅ | Judul + tab + intro + grid (/works dan /works/[category]) |
| `Gallery` / `Lightbox` | `src/components/works/` ✅ | Galeri editorial (pasangan foto tinggi sama via flex-grow = rasio, tanpa crop) + lightbox layar penuh gaya `.context/design/gallery.png` (foto + kontrol kiri, judul/cerita kanan, animasi geser+blur searah navigasi, zoom hover 4x untuk mouse, Esc/panah/swipe, focus trap) |
| `ProjectNav` | `src/components/works/ProjectNav.tsx` ✅ | Navigasi antarproyek: strip bergaris atas-bawah, "← PREVIOUS PROJECT" + judul (kiri) dan "NEXT PROJECT →" + judul (kanan); hover opacity 0.5, panah next berputar ↗ |
| `WorkplaceCard` | `src/components/about/WorkplaceCard.tsx` ✅ | Kartu tempat kerja (scale 0.8 + skew) |
| `ExperienceList` | `src/components/experience/ExperienceList.tsx` ✅ | Baris pengalaman; thumbnail ikut kursor, berganti tiap 80px gerak dengan sudut tetap berbeda per foto |
| `CopyButton` | `src/components/contact/CopyButton.tsx` ✅ | Salin email |

## 7. Alat verifikasi (`scripts/`)

| Script | Fungsi |
|---|---|
| `screenshot.mjs` | Screenshot rute × viewport × tema (`--full` untuk halaman penuh) |
| `verify-interactions.mjs` | 18 uji interaksi: tema, dropdown, hover scale, lightbox, FAB, menu mobile, reduced-motion |
| `audit-a11y.mjs` | axe-core WCAG 2.1 AA di semua jenis rute, light dan dark |
| `audit-weight.mjs` | Total byte dan gambar terbesar per rute (anggaran 500 KB) |

Semua butuh server berjalan: `npm run build && npx next start -p 3100`. Di Git Bash awali dengan `MSYS_NO_PATHCONV=1` bila argumen rute diawali `/`.

## 8. Ikon dan lisensi

Ikon panah (varian "short": `left-2-short-arrow` / `right-2-short-arrow`) dan telepon memakai set **Guidance** oleh Streamline (CC BY 4.0). Atribusi wajib ada di footer (`site.footer.iconCredit`) dan README. Guidance tidak punya ikon WhatsApp, jadi `WhatsAppIcon` digambar sendiri bergaya Guidance (gelembung + gagang telepon Guidance yang dipusatkan). Font Le Murmure berlisensi SIL OFL 1.1 (`assets/fonts/le-murmure/LICENSE.txt`).
