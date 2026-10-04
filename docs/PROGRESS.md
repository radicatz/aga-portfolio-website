# Progress Tracker

Status: `[ ]` belum · `[~]` sedang · `[x]` selesai. Perbarui di akhir setiap tugas (skill `progress-update`).

## Fase (lihat `docs/PLAN.md` §9)

### F0 Setup
- [x] `git init`, scaffold Next.js 16 + TS + Tailwind v4
- [x] Install `motion`, `lenis`, `next-themes`, `sharp`
- [x] Pindahkan sumber mentah ke `.context/`; `assets/` hanya untuk file siap pakai
- [x] `.gitignore` (`.context/`, `.env*`)
- [x] `docs/PLAN.md`, `CLAUDE.md`, `docs/DESIGN-SYSTEM.md`, `docs/PROGRESS.md`
- [x] 4 skill proyek di `.claude/skills/`
- [x] Verifikasi `npm run build` dan `npm run lint` (lolos)
- [x] `.mcp.json` Context7

### F1 Aset dan konten
- [x] `scripts/fetch-instagram.mjs` (10 foto IG, 12 file, tersimpan di `.context/instagram/`)
- [x] `scripts/optimize-images.mjs` + `scripts/image-sources.json` + `src/content/images.generated.ts` (91 foto, 27 MB)
- [x] `src/content/` types, site, categories, projects, experience, services, pages
- [ ] Alt text per foto masih generik (`altBase` + nomor); rapikan di F6

### F2 Fondasi
- [x] Token light/dark, font (Le Murmure + Space Grotesk, sejak Revisi 1), layout, Lenis, transisi halaman
- [x] `lib/motion.ts`, `HoverLine`, `SplitTextReveal`, `Reveal`
- [x] Navbar + MobileMenu + ThemeToggle (dropdown Works dihapus di Revisi 1)
- [x] Footer + FooterCTA + WhatsAppFab (`WhatsAppPill`)

### F3 Home
- [x] Hero + `ProjectMarquee` + `ProjectCard` + indeks kategori

### F4 Works
- [x] `/works`, `/works/[category]`, `/works/[category]/[slug]` (galeri, lightbox, Next)
- [ ] Animasi layout saat filter tab (lihat log keputusan: tiap tab = rute sendiri, jadi transisi berupa fade halaman)

### F5 Halaman lain
- [x] About, Experience (hover preview), Services (placeholder), Contact, 404

### F6 Polish
- [x] Metadata per halaman, OG image default, `sitemap.ts`, `robots.ts`, JSON-LD, skip link
- [x] Audit aksesibilitas axe: 0 pelanggaran (9 rute × light/dark)
- [x] Berat halaman: gambar terbesar 90 KB, total sekitar 1 MB
- [ ] Alt text per foto masih generik (`altBase` + nomor)
- [ ] Lighthouse mobile (Performance/Accessibility/SEO) belum dijalankan
- [ ] OG image memakai teks saja; ganti dengan foto setelah ada foto profil
- [ ] Count-up pada angka About (opsional, saat ini statis)

### Revisi 1 (feedback visual)
- [x] Font: Le Murmure (display) + Space Grotesk (body)
- [x] Ikon Guidance + WhatsApp digambar ulang (telepon dipusatkan); panah aksi berputar ke ↗ (CTA footer, FAB, pil WhatsApp, Next, ArrowLink)
- [x] Dropdown Works dihapus; CTA footer mengikuti ukuran heading; separator di atas footer dihapus
- [x] Home: marquee melambat 25% saat hover + drag/inertia; garis hover indeks kategori di atas separator
- [x] Works: judul "Dari dapur sampai jalanan." (2 baris); garis tab sejajar separator; galeri pasangan tinggi sama tanpa blok abu-abu
- [x] Lightbox desain ulang sesuai `gallery.png` + animasi geser antarfoto
- [x] Experience: banyak foto berganti saat kursor bergerak, tiap foto beda sudut
- [x] Contact: kota Tangerang · Jakarta pakai font display; catatan "*available untuk project luar kota"
- [x] Verifikasi: 42/42 uji interaksi, axe 0 pelanggaran, gambar <= 90 KB
- [x] Project nav: tanpa garis sendiri, pemisah abu-abu di atas CTA footer; kategori dua proyek hanya menampilkan "Next project"
- [x] Slideshow: zoom hover 4x (smooth spring, titik zoom mengikuti kursor, resolusi tinggi saat hover); hanya mouse
- [x] Pemisah abu-abu di atas CTA footer di semua halaman (lebar container, sama dengan garis bawahnya); garis juga di atas navigasi proyek; jarak >= 100px antara konten terakhir dan pemisah
- [ ] Foto sumber di `assets/images` dibatasi 2400px; zoom 4x pada foto landscape lebar agak lunak. Naikkan `MAX_SIDE` di `scripts/optimize-images.mjs` (mis. 3600) bila ingin lebih tajam, dengan konsekuensi ukuran aset naik
- [ ] Foto Jayatama untuk hover Experience (sementara memakai foto produk: ritual-kulit, penanda-waktu, batu-kilau)

### F7 Deploy
- [ ] Vercel + domain (`site.url` di `src/content/site.ts` masih `https://agakhartadinata.com`; ganti bila domain berbeda)

## Log keputusan
| Tanggal | Keputusan | Alasan |
|---|---|---|
| 2026-10-04 | Next.js + Motion + Tailwind | Motion = library Framer, paritas animasi |
| 2026-10-04 | `/works` halaman dengan tab + dropdown hover | Intro per kategori, URL bisa dibagikan, nyaman di mobile |
| 2026-10-04 | Default terang + toggle gelap | Mengikuti referensi; foto gelap tetap terbaca |
| 2026-10-04 | Copy ID, label nav/meta EN | Umum di kreator Indonesia |
| 2026-10-04 | Wordmark AGA KHARTA DINATA | Ejaan sesuai PDF dan IG |
| 2026-10-04 | Klien: hanya nama pemberi kerja | Aman untuk brand pihak ketiga |
| 2026-10-04 | Street = 7 foto Jakarta + 3 landscape 2023 dari IG | Permintaan user |
| 2026-10-04 | Kontak: email + WhatsApp (nomor tampil) + IG, tanpa form; WhatsApp FAB sticky bergaya situs | Permintaan user |
| 2026-10-04 | Hover mengikuti nilai persis referensi (scale 0.9, garis tumbuh) | Hasil bedah bundle JS Framer |
| 2026-10-04 | Sumber mentah di `.context/`, `assets/` hanya file website | Permintaan user |
| 2026-10-04 | Foto web disimpan di `assets/images/` dan diimpor statis (bukan `public/`) | Selaras aturan folder `assets/`; Next otomatis membuat dimensi dan blur |
| 2026-10-04 | React dinaikkan ke `^19.3.0` | Template menyematkan 19.2.8 yang tidak ada di registry |
| 2026-10-04 | Meja Ramadan 11 foto; MMC01624/01636 (sup jagung) dipindah ke Hidangan Rumahan | Hasil cek visual: bukan nuansa Timur Tengah |
| 2026-10-04 | Aroma dalam Gelap ditahan; `single jam` dan `cincin` dikeluarkan dari galeri | Resolusi 336–453px, menunggu file asli |
| 2026-10-04 | Light `--muted` #6E6D6D (referensi #7D7C7C) | Kontras 4.16:1 gagal WCAG AA; baru 5.1:1 |
| 2026-10-04 | Filter /works tidak memakai animasi layout | Tiap tab adalah rute sendiri (URL bisa dibagikan); transisi berupa fade halaman + Reveal kartu. Animasi layout butuh state klien tunggal dan mengorbankan URL per kategori |
| 2026-10-04 | Marquee tanpa drag; kartu tanpa gambar hover kedua | Mengikuti referensi (kecepatan konstan, hover = scale 0.9) |
| 2026-10-05 | Font display Le Murmure, body Space Grotesk | Permintaan user (Revisi 1) |
| 2026-10-05 | Ikon Guidance (CC BY 4.0); WhatsApp digambar ulang | Guidance tidak punya WhatsApp; user memilih redraw bergaya Guidance |
| 2026-10-05 | Nama ikon panah Guidance terbalik; `icons.ts` dikunci per arah visual | `right-arrow` Guidance sebenarnya menunjuk kiri |
| 2026-10-05 | Panah aksi berputar ke ↗ (-45°), bukan 180° | Permintaan user |
| 2026-10-05 | Marquee hover 25% (`tickerEffectHoverModifier`) + draggable (`tickerEffectDraggable`) | Terlewat di analisis awal; dikonfirmasi dari bundle referensi |
| 2026-10-05 | Galeri: pasangan foto tinggi sama, lebar sebanding rasio | Pilihan user; menghilangkan blok abu-abu tanpa crop |
| 2026-10-05 | Judul /works "Dari dapur sampai jalanan." | Pilihan user |
| 2026-10-04 | Context7 MCP didaftarkan di `.mcp.json` | Permintaan user: dokumentasi terbaru semua tech stack |

## Menunggu dari Aga (PLAN §8)
- [ ] Foto profil Aga
- [ ] File asli resolusi tinggi: `bottle, parfum, parfum 2, cincin, jam, single jam`
- [ ] Klien: Omakase & Sake, Meja Ramadan, Hidangan Rumahan, Tujuh Belas
- [ ] Lokasi Hunting di Pulau; konteks `DSC_0296`
- [ ] Lembaga penerbit sertifikasi 2024
- [ ] Deskripsi pekerjaan di Jayatama Motorindo
- [ ] Pekerjaan freelance lain (Eco8, Gojek Kemang?)
- [ ] Domain dan akun Vercel
- [ ] Persetujuan publikasi subjek potret

## Catatan sesi terakhir
2026-10-04: F0 sampai F6 selesai dan terverifikasi (lint, build 32 halaman statis, 18/18 uji interaksi, axe 0 pelanggaran, gambar <= 90 KB). Belum dikerjakan: F7 deploy, Lighthouse, alt text per foto, dan semua item "Menunggu dari Aga" (terutama foto profil dan file asli produk beresolusi rendah). Repo belum punya commit. Context7 MCP baru aktif di sesi Claude Code berikutnya (perlu persetujuan sekali).
