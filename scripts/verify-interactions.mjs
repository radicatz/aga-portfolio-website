// Uji interaksi end-to-end terhadap server yang berjalan (default http://localhost:3100).
// Pakai: node scripts/verify-interactions.mjs
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3100";
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const browser = await chromium.launch();

// ───── Desktop ─────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(base + "/", { waitUntil: "networkidle" });
  check("tema default = light", (await page.getAttribute("html", "data-theme")) === "light");

  await page.getByRole("button", { name: "DARK" }).click();
  await page.waitForTimeout(500);
  check("toggle ke dark", (await page.getAttribute("html", "data-theme")) === "dark");
  await page.reload({ waitUntil: "networkidle" });
  check("dark bertahan setelah reload", (await page.getAttribute("html", "data-theme")) === "dark");
  await page.getByRole("button", { name: "LIGHT" }).click();
  await page.waitForTimeout(500);

  // Dropdown Works
  await page.getByRole("link", { name: "WORKS", exact: true }).first().hover();
  await page.waitForTimeout(400);
  const dropdownLinks = await page.locator('a[href^="/works/"]:visible').filter({ hasText: /Documentation|Food|Portrait|Product|Street/ }).count();
  check("dropdown Works menampilkan 5 kategori", dropdownLinks >= 5, `${dropdownLinks} link`);
  await page.mouse.move(700, 600);

  // Hover kartu marquee: scale ~0.9
  const card = page.locator("section[aria-label='Karya pilihan'] a[href^='/works/']:not([aria-hidden])").first();
  // Kartu marquee selalu bergerak, jadi hover lewat koordinat (bukan card.hover() yang menunggu elemen stabil).
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, Math.min(box.y + 120, 800));
  await page.waitForTimeout(1300);
  const scale = await card.evaluate((el) => {
    const m = getComputedStyle(el.parentElement).transform;
    return m === "none" ? 1 : parseFloat(m.split("(")[1]);
  });
  check("hover kartu proyek -> scale 0.9", Math.abs(scale - 0.9) < 0.03, `scale=${scale.toFixed(3)}`);

  // Underline nav tumbuh saat hover
  const link = page.getByRole("link", { name: "ABOUT", exact: true }).first();
  await link.hover();
  await page.waitForTimeout(700);
  const width = await link.evaluate((el) => parseFloat(getComputedStyle(el, "::after").width));
  check("hover nav -> garis bawah tumbuh", width > 20, `${width}px`);

  // Lightbox
  await page.goto(base + "/works/food/cellar-notes", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /Perbesar foto 1$/ }).click();
  const dialog = page.getByRole("dialog");
  check("lightbox terbuka", await dialog.isVisible());
  check("counter 01 / 06", (await dialog.textContent()).includes("01 / 06"));
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  check("panah kanan -> 02 / 06", (await dialog.textContent()).includes("02 / 06"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  check("Esc menutup lightbox", (await page.getByRole("dialog").count()) === 0);

  // Tombol WhatsApp
  await page.goto(base + "/works", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const fab = page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" });
  const href = await fab.getAttribute("href");
  check("FAB WhatsApp tampil + link benar", href?.startsWith("https://wa.me/6282130618881?text="), href ?? "tidak ada");
  const bg = await fab.locator("xpath=.").evaluate((el) => getComputedStyle(el).backgroundColor);
  check("FAB bukan hijau WhatsApp", !/rgb\(37, 211, 102\)/.test(bg), bg);

  // FAB hilang di /contact
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  check("FAB tersembunyi saat blok kontak terlihat", (await page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" }).count()) === 0);

  check("tanpa error console", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

// ───── Mobile ─────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Buka menu" }).click();
  await page.waitForTimeout(700);
  check("menu mobile terbuka", await page.locator("#mobile-menu").isVisible());
  await page.locator("#mobile-menu").getByRole("link", { name: "About" }).click();
  await page.waitForURL("**/about");
  await page.waitForTimeout(600);
  check("menu mobile menutup setelah navigasi", (await page.locator("#mobile-menu").count()) === 0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check("tanpa scroll horizontal di 390px", !overflow);
  await ctx.close();
}

// ───── Reduced motion ─────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const x1 = await page.locator("ul[aria-label='Karya pilihan']").count();
  check("reduced-motion: marquee jadi carousel scroll manual", x1 === 1);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} lolos`);
process.exit(failed ? 1 : 0);
