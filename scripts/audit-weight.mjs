// Ukur total byte dan gambar terbesar yang dikirim tiap rute (anggaran: tidak ada gambar > 500 KB).
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3100";
const routes = ["/", "/works", "/works/food/omakase-sake", "/works/street/ritme-malam-kota", "/about"];
const browser = await chromium.launch();
let over = 0;

for (const [label, width] of [["desktop", 1440], ["mobile", 390]]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const route of routes) {
    const sizes = [];
    page.removeAllListeners("response");
    page.on("response", async (res) => {
      const body = await res.body().catch(() => null);
      if (body) sizes.push({ url: res.url(), type: res.headers()["content-type"] ?? "", bytes: body.length });
    });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const total = sizes.reduce((a, s) => a + s.bytes, 0);
    const images = sizes.filter((s) => s.type.startsWith("image/")).sort((a, b) => b.bytes - a.bytes);
    const biggest = images[0];
    if (biggest && biggest.bytes > 500 * 1024) over++;
    console.log(
      `${label.padEnd(7)} ${route.padEnd(34)} total ${(total / 1024).toFixed(0).padStart(5)} KB  gambar ${String(images.length).padStart(2)}  terbesar ${biggest ? (biggest.bytes / 1024).toFixed(0) + " KB" : "-"}`,
    );
  }
  await ctx.close();
}
await browser.close();
console.log(over ? `\n${over} rute memiliki gambar > 500 KB` : "\nSemua gambar <= 500 KB");
