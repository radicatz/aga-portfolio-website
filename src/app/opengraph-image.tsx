import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — Fotografer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gambar sosial default. Ganti dengan foto Aga + karya unggulan setelah foto profil tersedia (docs/PROGRESS.md).
export default function OpengraphImage() {
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
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4 }}>{site.wordmark}</div>
        <div style={{ fontSize: 120, lineHeight: 1 }}>{site.tagline}</div>
        <div style={{ fontSize: 26, color: "#8c8b87", letterSpacing: 3 }}>{`FOTOGRAFER · ${site.location.toUpperCase()}`}</div>
      </div>
    ),
    size,
  );
}
