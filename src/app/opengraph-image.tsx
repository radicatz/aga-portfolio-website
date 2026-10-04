import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — Fotografer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gambar sosial default. Ganti dengan foto Aga + karya unggulan setelah foto profil tersedia (docs/PROGRESS.md).
// Satori tidak membaca woff2, jadi memakai versi .woff dari Le Murmure.
export default async function OpengraphImage() {
  const murmure = await readFile(join(process.cwd(), "assets/fonts/le-murmure/LeMurmure-Regular.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e0d",
          color: "#f1f0ec",
          padding: 72,
          fontFamily: "Le Murmure",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 4 }}>{site.wordmark}</div>
        <div style={{ fontSize: 150, lineHeight: 0.9 }}>{site.tagline}</div>
        <div style={{ fontSize: 30, color: "#8c8b87", letterSpacing: 3 }}>{`FOTOGRAFER · ${site.location.toUpperCase()}`}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Le Murmure", data: murmure, style: "normal", weight: 400 }] },
  );
}
