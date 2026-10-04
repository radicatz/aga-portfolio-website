---
name: progress-update
description: Use at the end of every task or session on the Aga portfolio site to update docs/PROGRESS.md and the component inventory.
---

# Perbarui progres

Edit `docs/PROGRESS.md`:
1. Ubah status checklist fase yang disentuh (`[ ]` → `[~]` → `[x]`). Jangan menandai selesai sebelum `npm run build` dan `npm run lint` lolos dan tampilan dicek.
2. Tambah baris ke **Log keputusan** (tanggal absolut, keputusan, alasan) untuk setiap keputusan baru.
3. Perbarui **Menunggu dari Aga**: centang yang sudah dijawab, tambahkan yang baru ditemukan.
4. Tulis ulang **Catatan sesi terakhir** (3–5 baris): apa yang dikerjakan, apa yang rusak atau belum, dan langkah berikutnya yang konkret.
5. Jika komponen berubah, sinkronkan status di `docs/DESIGN-SYSTEM.md` §6.
