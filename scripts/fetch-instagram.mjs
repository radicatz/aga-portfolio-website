// Unduh foto Street Photography dari Instagram @agadinata_ via ScrapeCreators.
// Pakai: SCRAPECREATORS_API_KEY=... node scripts/fetch-instagram.mjs
// Hasil mentah masuk ke .context/instagram/<shortcode>_<n>.jpg (tidak di-commit).
// URL CDN Instagram kedaluwarsa, jadi file selalu disimpan lokal.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HANDLE = "agadinata_";
const OUT_DIR = path.resolve(".context/instagram");

// Shortcode yang dipakai website (lihat docs/PLAN.md §3.5).
// Dua post studio low-key (DdbBbJ5pH0C, DdJgSu3p0om) sengaja tidak dimasukkan.
const WANTED = [
  "DSXbEXaiTcT", "DR5LUkUE4EQ", "DRcGOmNiaD9", "DRZr-G_iWHr", "DRPmBzkCe3G", // Ritme Malam Kota
  "Dcno0DRCWJj", "DTKe_teiXMy", // Kembali Hunting
  "CoOhGcyr_VU", "CoJU-BjL-oo", "CoL6C-NL-93", // Sebelum Kota
];

const key = process.env.SCRAPECREATORS_API_KEY;
if (!key) {
  console.error("Set SCRAPECREATORS_API_KEY terlebih dahulu.");
  process.exit(1);
}

const res = await fetch(
  `https://api.scrapecreators.com/v2/instagram/user/posts?handle=${HANDLE}`,
  { headers: { "x-api-key": key } },
);
if (!res.ok) {
  console.error(`API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { items = [] } = await res.json();

const best = (media) =>
  (media.image_versions2?.candidates ?? []).sort((a, b) => b.width - a.width)[0];

await mkdir(OUT_DIR, { recursive: true });
const found = new Set();

for (const post of items) {
  if (!WANTED.includes(post.code)) continue;
  found.add(post.code);
  const medias = post.carousel_media ?? [post];
  for (const [i, media] of medias.entries()) {
    const candidate = best(media);
    if (!candidate) continue;
    const img = await fetch(candidate.url);
    if (!img.ok) throw new Error(`Gagal mengunduh ${post.code}_${i}: ${img.status}`);
    const file = path.join(OUT_DIR, `${post.code}_${i}.jpg`);
    await writeFile(file, Buffer.from(await img.arrayBuffer()));
    console.log(`${post.code}_${i}.jpg  ${candidate.width}x${candidate.height}`);
  }
}

const missing = WANTED.filter((code) => !found.has(code));
if (missing.length) {
  console.error(`Tidak ditemukan di halaman pertama API: ${missing.join(", ")}`);
  process.exit(1);
}
