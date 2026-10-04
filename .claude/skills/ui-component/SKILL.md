---
name: ui-component
description: Use when creating or modifying a UI component on the Aga portfolio site, to keep reuse, design tokens, and motion consistent.
---

# Buat atau ubah komponen UI

1. **Baca inventaris** di `docs/DESIGN-SYSTEM.md` §6. Jika ada komponen yang mendekati, pakai atau perluas; jangan duplikasi.
2. **Hanya token**: warna lewat `--bg --fg --muted --line --surface`, tipografi lewat kelas `text-display|cta|title|body|label`, transisi lewat `src/lib/motion.ts`. Jika butuh nilai baru, tambahkan dulu ke token dan ke DESIGN-SYSTEM.
3. **Hover** harus mengikuti tabel pola di DESIGN-SYSTEM §5 (scale ≤ 1, garis tumbuh via `HoverLine`, opacity turun). Tanpa zoom-in, bayangan, atau perubahan warna mencolok.
4. **Copy** tidak boleh hardcode di komponen; ambil dari `src/content/*`. Label UI pendek berbahasa Inggris boleh.
5. **Cek wajib**: mode terang dan gelap, 390 / 810 / 1440px, `prefers-reduced-motion` (animasi jadi fade atau mati), navigasi keyboard (`:focus-visible` sama dengan hover), `aria-label` untuk elemen ikon.
6. Komponen client hanya bila perlu interaksi (`"use client"`); sisanya server component.
7. **Daftarkan** komponen ke inventaris DESIGN-SYSTEM (nama, path, fungsi, status) lalu jalankan skill `progress-update`.
