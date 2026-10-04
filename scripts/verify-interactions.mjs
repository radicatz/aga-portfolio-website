// Uji interaksi end-to-end terhadap server yang berjalan (default http://localhost:3100).
// Pakai: node scripts/verify-interactions.mjs
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3100";
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** Nilai translateX dari matriks transform sebuah elemen. */
const translateX = (page, selector) =>
  page.evaluate((s) => {
    const m = getComputedStyle(document.querySelector(s)).transform;
    return m === "none" ? 0 : new DOMMatrix(m).m41;
  }, selector);
/** Sudut rotasi (derajat) dari matriks transform. */
const rotationDeg = (el) =>
  el.evaluate((node) => {
    const m = getComputedStyle(node).transform;
    if (m === "none") return 0;
    const d = new DOMMatrix(m);
    return Math.round(((Math.atan2(d.b, d.a) * 180) / Math.PI) * 10) / 10;
  });

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

  // Font
  const fonts = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    display: getComputedStyle(document.querySelector("h1")).fontFamily,
    loaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
  }));
  check("font body = Space Grotesk", /Space_Grotesk|Space Grotesk/i.test(fonts.body), fonts.body.slice(0, 50));
  check("font display = Le Murmure (dimuat)", fonts.loaded.length >= 2 && !/Instrument|Manrope/i.test(fonts.display + fonts.body), `${fonts.loaded.length} font dimuat`);

  await page.getByRole("button", { name: "DARK" }).click();
  await sleep(500);
  check("toggle ke dark", (await page.getAttribute("html", "data-theme")) === "dark");
  await page.reload({ waitUntil: "networkidle" });
  check("dark bertahan setelah reload", (await page.getAttribute("html", "data-theme")) === "dark");
  await page.getByRole("button", { name: "LIGHT" }).click();
  await sleep(500);

  // Navbar: tidak ada dropdown, WORKS = link biasa ke /works
  const worksLink = page.getByRole("link", { name: "WORKS", exact: true }).first();
  check("WORKS mengarah ke /works", (await worksLink.getAttribute("href")) === "/works");
  await worksLink.hover();
  await sleep(500);
  check("tidak ada dropdown Works", (await page.locator("header a[href^='/works/']").count()) === 0);
  await page.mouse.move(700, 120);

  // Marquee: kecepatan normal vs hover (25%)
  const trackSel = "section[aria-label='Karya pilihan'] ul";
  await sleep(1200);
  const a0 = await translateX(page, trackSel);
  await sleep(500);
  const a1 = await translateX(page, trackSel);
  const normal = Math.abs(a1 - a0) / 0.5;
  await page.mouse.move(700, 700); // di atas marquee
  await sleep(1400); // biarkan interpolasi kecepatan selesai
  const b0 = await translateX(page, trackSel);
  await sleep(500);
  const b1 = await translateX(page, trackSel);
  const slow = Math.abs(b1 - b0) / 0.5;
  check("marquee melambat saat hover (~25%)", slow < normal * 0.45 && slow > 0, `normal ${normal.toFixed(0)} px/s, hover ${slow.toFixed(0)} px/s`);

  // Marquee: drag manual menggeser dan tidak berpindah halaman
  const before = await translateX(page, trackSel);
  await page.mouse.move(900, 700);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) {
    await page.mouse.move(900 - i * 40, 700);
    await sleep(16);
  }
  await sleep(120); // berhenti sebentar agar tanpa inertia
  await page.mouse.up();
  await sleep(100);
  const afterDrag = await translateX(page, trackSel);
  check("drag marquee menggeser track", Math.abs(afterDrag - before) > 250, `${(afterDrag - before).toFixed(0)} px`);
  check("drag tidak memicu navigasi kartu", new URL(page.url()).pathname === "/");

  // Marquee: flick (drag cepat lalu lepas) menimbulkan inertia: lebih cepat dari kecepatan otomatis
  await page.mouse.move(1100, 700);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(1100 - i * 60, 700);
    await sleep(8);
  }
  await page.mouse.up();
  const f0 = await translateX(page, trackSel);
  await sleep(150);
  const f1 = await translateX(page, trackSel);
  check("flick memberi inertia (lebih cepat dari otomatis)", Math.abs(f1 - f0) / 0.15 > 120, `${(Math.abs(f1 - f0) / 0.15).toFixed(0)} px/s`);

  // Hover kartu marquee: scale 0.9
  await page.mouse.move(700, 120);
  await sleep(1500);
  // Pilih kartu yang sedang terlihat penuh di viewport (setelah drag, kartu pertama bisa berada di luar layar).
  const target = await page.evaluate(() => {
    const links = [...document.querySelectorAll("section[aria-label='Karya pilihan'] a[href^='/works/']")];
    const visible = links.map((a) => a.getBoundingClientRect()).find((r) => r.left > 60 && r.right < window.innerWidth - 60 && r.top < 700);
    return visible ? { x: visible.left + visible.width / 2, y: Math.min(visible.top + 120, 800) } : null;
  });
  await page.mouse.move(target.x, target.y);
  await sleep(1300);
  const scale = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y)?.closest("a[href^='/works/']");
    const m = el ? getComputedStyle(el.parentElement).transform : "none";
    return m === "none" ? 1 : parseFloat(m.split("(")[1]);
  }, target);
  check("hover kartu proyek -> scale 0.9", Math.abs(scale - 0.9) < 0.03, `scale=${scale.toFixed(3)}`);
  await page.mouse.move(700, 120);

  // Underline nav tumbuh saat hover
  const link = page.getByRole("link", { name: "ABOUT", exact: true }).first();
  await link.hover();
  await sleep(700);
  const width = await link.evaluate((el) => parseFloat(getComputedStyle(el, "::after").width));
  check("hover nav -> garis bawah tumbuh", width > 20, `${width}px`);

  // Baris indeks kategori: garis hover tepat di atas separator
  const row = page.locator("a.hover-rule", { hasText: "Documentation" }).first();
  await row.scrollIntoViewIfNeeded();
  await sleep(1200);
  await row.hover();
  await sleep(700);
  const rowGeo = await row.evaluate((el) => ({
    afterWidth: parseFloat(getComputedStyle(el, "::after").width),
    afterBottom: getComputedStyle(el, "::after").bottom,
    linkBottom: el.getBoundingClientRect().bottom,
    liBottom: el.parentElement.getBoundingClientRect().bottom,
  }));
  check("indeks kategori: garis hover menimpa separator", rowGeo.afterWidth > 100 && rowGeo.afterBottom === "-1px" && Math.abs(rowGeo.liBottom - rowGeo.linkBottom - 1) < 0.6, `lebar ${rowGeo.afterWidth.toFixed(0)}px`);

  // Footer CTA: panah berputar ke ↗ (-45°)
  const cta = page.locator("a[data-hide-fab][href='/contact']");
  await cta.scrollIntoViewIfNeeded();
  await cta.hover();
  await sleep(900);
  const arrowRot = await rotationDeg(cta.locator("svg").first().locator(".."));
  check("panah Footer CTA berputar ke ↗ (-45°)", Math.abs(arrowRot + 45) < 2, `${arrowRot}°`);

  // Works: judul 2 baris + tab sejajar separator
  await page.goto(base + "/works", { waitUntil: "networkidle" });
  await sleep(1800);
  const h1 = await page.evaluate(() => {
    const h = document.querySelector("h1");
    const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize);
    return { lines: Math.round(h.getBoundingClientRect().height / lh), text: h.getAttribute("aria-label") };
  });
  check("judul /works = 2 baris", h1.lines === 2 && h1.text === "Dari dapur sampai jalanan.", `${h1.lines} baris`);
  const tab = page.getByRole("link", { name: "Food", exact: true });
  await tab.hover();
  await sleep(700);
  const tabGeo = await tab.evaluate((el) => ({
    afterWidth: parseFloat(getComputedStyle(el, "::after").width),
    linkBottom: el.getBoundingClientRect().bottom,
    ulBottom: el.closest("ul").getBoundingClientRect().bottom,
  }));
  check("tab Works: garis hover sejajar separator", tabGeo.afterWidth > 20 && Math.abs(tabGeo.ulBottom - tabGeo.linkBottom - 1) < 0.6, `selisih ${(tabGeo.ulBottom - tabGeo.linkBottom).toFixed(2)}px`);

  // Tidak ada separator sebelum CTA footer
  const footerBorder = await page.evaluate(() => getComputedStyle(document.querySelector("footer")).borderTopWidth);
  check("tanpa separator di atas footer", footerBorder === "0px", footerBorder);

  // Galeri: pasangan foto tinggi sama, tanpa latar abu-abu
  await page.goto(base + "/works/food/omakase-sake", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await sleep(1500);
  const gallery = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("button[aria-label^='Perbesar foto']")];
    const rows = new Map();
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      const key = Math.round(r.top + window.scrollY);
      rows.set(key, [...(rows.get(key) ?? []), { h: r.height }]);
    }
    const pairs = [...rows.values()].filter((v) => v.length === 2);
    return {
      pairs: pairs.length,
      maxDiff: Math.max(0, ...pairs.map((p) => Math.abs(p[0].h - p[1].h))),
      bgs: [...new Set(buttons.map((b) => getComputedStyle(b).backgroundColor))],
    };
  });
  check("galeri: pasangan foto tinggi sama", gallery.pairs > 0 && gallery.maxDiff < 2, `${gallery.pairs} pasang, selisih maks ${gallery.maxDiff.toFixed(2)}px`);
  check("galeri: tanpa latar abu-abu di sel", gallery.bgs.every((c) => c === "rgba(0, 0, 0, 0)"), gallery.bgs.join(" | "));

  // Lightbox (mengikuti gallery.png)
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(500);
  await page.getByRole("button", { name: /Perbesar foto 1$/ }).click();
  const dialog = page.getByRole("dialog");
  await sleep(700);
  check("lightbox terbuka layar penuh", (await dialog.isVisible()) && (await dialog.evaluate((d) => d.getBoundingClientRect().width)) === 1440);
  const text = await dialog.textContent();
  check("lightbox: judul + cerita proyek di panel", text.includes("Omakase & Sake") && text.includes("Seri untuk sebuah restoran Jepang"));
  check("counter 01 / 16", text.includes("01 / 16"));
  const srcBefore = await dialog.locator("img").first().getAttribute("src");
  await dialog.getByRole("button", { name: "SELANJUTNYA" }).click();
  await sleep(150);
  const midAnimating = await dialog.locator("img").count();
  await sleep(1200);
  const srcAfter = await dialog.locator("img").first().getAttribute("src");
  check("tombol SELANJUTNYA -> 02 / 16, foto berganti", (await dialog.textContent()).includes("02 / 16") && srcBefore !== srcAfter);
  check("transisi foto: dua foto ada bersamaan saat animasi", midAnimating >= 2, `${midAnimating} img`);
  await dialog.getByRole("button", { name: "SEBELUMNYA" }).click();
  await sleep(1200);
  check("tombol SEBELUMNYA -> 01 / 16", (await dialog.textContent()).includes("01 / 16"));
  await page.keyboard.press("ArrowRight");
  await sleep(1200);
  check("panah kanan keyboard -> 02 / 16", (await dialog.textContent()).includes("02 / 16"));
  await page.keyboard.press("Escape");
  await sleep(500);
  check("Esc menutup lightbox", (await page.getByRole("dialog").count()) === 0);

  // Experience: foto berganti saat kursor bergerak, tiap foto beda sudut
  await page.goto(base + "/experience", { waitUntil: "networkidle" });
  await sleep(1500);
  const rowEl = page.locator("ul > li").filter({ hasText: "MyMeal Catering" });
  const rb = await rowEl.boundingBox();
  await page.mouse.move(rb.x + 200, rb.y + 60);
  await sleep(800);
  const thumb = page.locator("div.pointer-events-none.fixed img");
  const s0 = await thumb.first().getAttribute("src");
  const r0 = await rotationDeg(thumb.first().locator(".."));
  for (let i = 1; i <= 14; i++) {
    await page.mouse.move(rb.x + 200 + i * 12, rb.y + 60 + (i % 2) * 6);
    await sleep(25);
  }
  await sleep(1300);
  const s1 = await thumb.first().getAttribute("src");
  const r1 = await rotationDeg(thumb.first().locator(".."));
  check("experience: foto berganti saat kursor bergerak", Boolean(s0 && s1 && s0 !== s1));
  check("experience: tiap foto beda sudut", r0 !== r1, `${r0}° -> ${r1}°`);

  // Contact: lokasi memakai font display, catatan font body
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await sleep(1800);
  const loc = await page.evaluate(() => {
    const dd = [...document.querySelectorAll("dt")].find((d) => d.textContent === "Lokasi").nextElementSibling;
    const [cities, note] = dd.querySelectorAll("p");
    const email = document.querySelector("a[href^='mailto:']");
    return {
      cities: cities.textContent,
      note: note.textContent,
      citiesFont: getComputedStyle(cities).fontFamily,
      emailFont: getComputedStyle(email).fontFamily,
      noteFont: getComputedStyle(note).fontFamily,
    };
  });
  check("contact: kota = font sama dengan email", loc.cities === "Tangerang · Jakarta" && loc.citiesFont === loc.emailFont, loc.cities);
  check("contact: catatan memakai font body + copy baru", loc.note === "*available untuk project luar kota" && loc.noteFont !== loc.citiesFont, loc.note);

  // WhatsApp FAB
  await page.goto(base + "/works", { waitUntil: "networkidle" });
  await sleep(2200);
  const fab = page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" });
  const href = await fab.getAttribute("href");
  check("FAB WhatsApp tampil + link benar", Boolean(href?.startsWith("https://wa.me/6282130618881?text=")), href ?? "tidak ada");
  const bg = await fab.evaluate((el) => getComputedStyle(el).backgroundColor);
  check("FAB bukan hijau WhatsApp", !/rgb\(37, 211, 102\)/.test(bg), bg);
  await fab.hover();
  await sleep(900);
  const fabArrow = await rotationDeg(fab.locator("svg").last().locator(".."));
  check("panah FAB berputar ke ↗ (-45°)", Math.abs(fabArrow + 45) < 2, `${fabArrow}°`);

  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await sleep(2200);
  check("FAB tersembunyi saat blok kontak terlihat", (await page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" }).count()) === 0);

  check("tanpa error console", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

// ───── Mobile ─────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Buka menu" }).click();
  await sleep(700);
  check("menu mobile terbuka", await page.locator("#mobile-menu").isVisible());
  await page.locator("#mobile-menu").getByRole("link", { name: "About" }).click();
  await page.waitForURL("**/about");
  await sleep(600);
  check("menu mobile menutup setelah navigasi", (await page.locator("#mobile-menu").count()) === 0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check("tanpa scroll horizontal di 390px", !overflow);

  // Marquee mobile: touch-action pan-y agar swipe horizontal men-drag dan vertikal tetap scroll
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const touchAction = await page.evaluate(() => getComputedStyle(document.querySelector("section[aria-label='Karya pilihan'] [role='region']")).touchAction);
  check("marquee mobile: touch-action pan-y", touchAction === "pan-y", touchAction);
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
