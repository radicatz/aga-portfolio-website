// Alat verifikasi visual: ambil screenshot rute pada beberapa viewport dan tema.
// Pakai: OUT=<folder> node scripts/screenshot.mjs "/ /works" [1440,390] [light,dark] [--full]
// Butuh dev server berjalan (default http://localhost:3100, ubah dengan BASE=...).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3100";
const out = path.resolve(process.env.OUT ?? "screenshots");
const routes = (process.argv[2] ?? "/").split(" ").filter(Boolean);
const widths = (process.argv[3] ?? "1440").split(",").map(Number);
const themes = (process.argv[4] ?? "light").split(",");
const full = process.argv.includes("--full");

await mkdir(out, { recursive: true });
const browser = await chromium.launch();

for (const theme of themes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width < 810 ? 844 : 900 },
      reducedMotion: "no-preference",
    });
    await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(2800); // tunggu animasi judul + FAB
      if (full) {
        // Scroll pelan agar elemen whileInView muncul sebelum capture.
        const h = await page.evaluate(() => document.body.scrollHeight);
        for (let y = 0; y < h; y += 500) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(120);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(600);
      }
      const name = `${route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_")}-${width}-${theme}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: full });
      console.log(name);
    }
    await context.close();
  }
}
await browser.close();
