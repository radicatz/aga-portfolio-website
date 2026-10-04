# Aga Kharta Dinata — Website Portofolio

Portofolio fotografer (Food, Product, Portrait, Documentation, Street). Next.js 16 (App Router) + TypeScript + Tailwind v4 + Motion + Lenis. Layout dan motion mengacu ke [Lundani Studio](https://lundanistudio.framer.website/).

## Menjalankan

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npx next start -p 3100   # versi produksi
```

## Menambah atau mengganti foto

1. Taruh sumber di `.context/Portofolio/Foto/<Kategori>/` (folder ini tidak di-commit).
2. Daftarkan di `scripts/image-sources.json` dan `src/content/projects.ts`.
3. `node scripts/optimize-images.mjs` menghasilkan `assets/images/` dan `src/content/images.generated.ts`.

Foto Street berasal dari Instagram: `SCRAPECREATORS_API_KEY=... node scripts/fetch-instagram.mjs`.

## Dokumen

- `docs/PLAN.md` — rencana lengkap (sitemap, copy, motion)
- `docs/DESIGN-SYSTEM.md` — token, motion, inventaris komponen, alat verifikasi
- `docs/PROGRESS.md` — progres, keputusan, daftar yang menunggu dari Aga
- `CLAUDE.md` — aturan kerja untuk sesi Claude Code

## Lisensi aset pihak ketiga

- Ikon: [Guidance](https://github.com/webalys-hq/streamline-vectors) oleh Streamline, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Font display: Le Murmure oleh Jérémy Landes, [SIL OFL 1.1](assets/fonts/le-murmure/LICENSE.txt).
- Font body: Space Grotesk (Google Fonts, SIL OFL 1.1).
