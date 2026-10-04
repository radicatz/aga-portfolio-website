---
name: add-project
description: Use when adding or editing a photo project (Food, Product, Portrait, Documentation, Street) on the Aga portfolio site, including its photos, metadata, and storytelling copy.
---

# Tambah atau ubah proyek

1. **Foto**: taruh/ambil sumber di `.context/Portofolio/Foto/<Kategori>/` (atau hasil `scripts/fetch-instagram.mjs` untuk Street). Jangan taruh foto mentah di `assets/`.
2. **Entri data** di `src/content/projects.ts` mengikuti tipe `Project`:
   - `slug` kebab-case, `title` pendek (2–4 kata, Indonesia), `category` salah satu dari 5 slug
   - `client` hanya nama pemberi kerja atau deskripsi generik; `year`; `location`
   - `excerpt` 1 kalimat, `story` 1–2 paragraf, `cover`, `images[]` (dengan `alt` Bahasa Indonesia deskriptif)
   - `featured` (angka) hanya bila tampil di marquee Home
   - Info yang belum pasti: isi `todo` (tidak dirender) dan catat di `docs/PROGRESS.md` bagian "Menunggu dari Aga"
3. **Optimasi**: daftarkan file di konfigurasi `scripts/optimize-images.mjs`, jalankan `node scripts/optimize-images.mjs`. Hasil masuk `assets/images/<kategori>/<slug>/NN.jpg` dan `src/content/images.generated.ts`. Jangan memakai file beresolusi rendah sebagai cover (lihat `docs/PLAN.md` §3.4).
4. **Copy**: ikuti skill `copy-id`. Pola: judul pendek → 1–2 paragraf faktual dan sensorik (cahaya, tekstur, momen) → tanpa superlatif. Rujukan di `docs/PLAN.md` §6.
5. **Cek**: buka `/works/<kategori>` dan `/works/<kategori>/<slug>` di light dan dark, 390 / 810 / 1440px.
6. Jalankan skill `progress-update`.
