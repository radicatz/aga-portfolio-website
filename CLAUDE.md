# CLAUDE.md — Website Portofolio Aga Kharta Dinata

Website portofolio fotografer (Food, Product, Portrait, Documentation, Street) dengan layout, motion, dan nada copy yang mengacu ke https://lundanistudio.framer.website/. Copy dalam Bahasa Indonesia.

**Dokumen utama (baca sebelum bekerja):**
- `docs/PLAN.md` — rencana lengkap: sitemap, copy per halaman, kurasi proyek, spesifikasi motion
- `docs/DESIGN-SYSTEM.md` — token, tipografi, token motion, **inventaris komponen**
- `docs/PROGRESS.md` — progres fase, log keputusan, daftar yang menunggu dari Aga

## Stack dan perintah
Next.js (App Router) + TypeScript + Tailwind v4 + Motion (`motion/react`) + Lenis + next-themes.
- `npm run dev` · `npm run build` · `npm run lint`
- `node scripts/optimize-images.mjs` — optimasi foto dari `.context/` ke `assets/images/`
- `node scripts/fetch-instagram.mjs` — unduh foto Street dari IG (butuh env `SCRAPECREATORS_API_KEY`)
- Verifikasi (butuh `npm run build && npx next start -p 3100`): `node scripts/verify-interactions.mjs`, `node scripts/audit-a11y.mjs`, `node scripts/audit-weight.mjs`, `scripts/screenshot.mjs`. Jalankan setelah perubahan UI dan sebelum menandai tugas selesai. Detail di `docs/DESIGN-SYSTEM.md` §7.

## Dokumentasi terbaru (Context7)
`.mcp.json` mendaftarkan MCP server **Context7**. **Sebelum menulis atau mengubah kode yang memakai library di bawah, ambil dokumentasi terbarunya lewat Context7** (`resolve-library-id`, lalu `query-docs`), jangan mengandalkan ingatan. API Next 16, React 19.3, Tailwind v4, dan Motion berubah cepat.
Library: `next` (App Router, `next/image`, `next/font`, metadata), `react`, `tailwindcss` (v4, config lewat CSS `@theme`), `motion` (`motion/react`), `lenis`, `next-themes`, `sharp`.
Sesi baru akan meminta persetujuan server ini saat pertama kali dimuat. Opsional: `CONTEXT7_API_KEY` untuk batas penggunaan lebih tinggi (simpan di env, jangan di-commit).

## Struktur folder
- `.context/` — **sumber mentah** (PDF lama, foto asli, video, zip). Tidak di-commit, tidak dipakai langsung oleh website.
- `assets/` — **hanya file yang dipakai website** (foto hasil optimasi). Jangan taruh sumber mentah di sini.
- `src/content/*` — satu-satunya tempat copy dan data (site, categories, projects, experience, services)
- `src/components/*`, `src/lib/motion.ts`, `docs/*`, `scripts/*`, `.claude/skills/*`

## Aturan wajib
1. **Cek inventaris di `docs/DESIGN-SYSTEM.md` sebelum membuat komponen baru.** Pakai atau perluas yang ada. Komponen baru wajib didaftarkan di inventaris.
2. **Tanpa nilai hardcode**: warna lewat CSS variable (`--bg --fg --muted --line --surface`), transisi lewat `src/lib/motion.ts`. Jangan membuat ease/spring baru tanpa menambahkannya ke `lib/motion.ts` dan DESIGN-SYSTEM.
3. **Hover selalu menahan diri**: scale ≤ 1, garis bawah tumbuh, atau opacity turun. Nilai persis ada di `docs/PLAN.md` §1.5. Jangan zoom-in, bayangan, atau perubahan warna mencolok. **Satu pengecualian yang diminta user:** zoom 4x foto di slideshow/lightbox (hanya mouse).
4. **Copy hanya di `src/content/*`.** Komponen tidak boleh berisi copy hardcode, kecuali label UI pendek berbahasa Inggris (WORKS, ABOUT, Client, Year, Location).
5. Setiap fitur harus jalan di **mode terang dan gelap**, di **390 / 810 / 1440px**, dengan `prefers-reduced-motion`, dan bisa dipakai lewat keyboard.
6. Tombol WhatsApp memakai gaya situs (monokrom `--fg`/`--bg`). **Jangan hijau WhatsApp.**
7. **Di akhir setiap tugas, perbarui `docs/PROGRESS.md`** (skill `progress-update`).

## Aturan copy (skill `copy-id`)
Bahasa Indonesia baku, ringkas, tenang. Tanpa superlatif, emoji, atau kalimat penutup retoris. Sapaan "Anda". Halaman About **tanpa kata ganti orang ketiga** ("ia", "dia"); pakai kalimat tanpa subjek. Label nav dan meta dalam bahasa Inggris.

## Data tetap
- Nama: **Aga Kharta Dinata** (ejaan "Kharta"). Wordmark `AGA KHARTA DINATA`.
- Kontak ada di `src/content/site.ts` (satu sumber): email, WhatsApp +62 821-3061-8881, IG @agadinata_, Tangerang.
- Klien: hanya nama pemberi kerja (Yawara Boga, MyMeal, Jayatama). Brand produk ditulis generik.
- Video tidak dimasukkan ke website.

## Jangan
- Commit `.env*`, `.context/`, video, zip, atau foto mentah.
- Hotlink CDN Instagram (URL kedaluwarsa); unduh dan simpan lokal.
- Menaruh file foto beresolusi rendah sebagai cover (lihat daftar di `docs/PLAN.md` §3.4).

## Skill proyek (`.claude/skills/`)
`add-project` (tambah/ubah proyek dan foto) · `ui-component` (buat/ubah komponen) · `progress-update` (akhir tugas) · `copy-id` (tulis/revisi copy)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
