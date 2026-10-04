// Uji interaksi end-to-end terhadap server yang berjalan (default http://localhost:3100).
// Pakai: node scripts/verify-interactions.mjs
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

// Konstanta drag marquee dibaca dari sumbernya agar tes tetap benar saat nilai di-tuning.
const marqueeSrc = readFileSync("src/components/works/ProjectMarquee.tsx", "utf8");
const marqueeConst = (name) => Number(marqueeSrc.match(new RegExp(`const ${name} = ([0-9.]+);`))[1]);
const DRAG_GAIN = marqueeConst("DRAG_GAIN");
const FOLLOW_TAU = marqueeConst("FOLLOW_TAU");

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
  // 404 yang disengaja (halaman /tidak-ada untuk menguji judul 404) tidak dihitung sebagai error.
  page.on("console", (m) => m.type() === "error" && !(m.location().url ?? "").endsWith("/tidak-ada") && errors.push(m.text()));

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

  // Jarak marquee -> label "Jelajahi per kategori"
  const gap = await page.evaluate(() => {
    const track = document.querySelector("section[aria-label='Karya pilihan'] ul");
    const label = [...document.querySelectorAll("p")].find((p) => p.textContent.trim().toLowerCase() === "jelajahi per kategori");
    return label.getBoundingClientRect().top - track.getBoundingClientRect().bottom;
  });
  check("jarak marquee -> 'Jelajahi per kategori' >= 100px", gap >= 100, `${gap.toFixed(0)}px`);

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
  await sleep(1800); // strip mengejar tujuan dengan halus (FOLLOW_TAU); tunggu menetap
  const afterDrag = await translateX(page, trackSel);
  // Drag 400px; ambang 150px menyisakan toleransi untuk timing event pointer di mesin yang sedang sibuk.
  check("drag marquee menggeser track", Math.abs(afterDrag - before) > 400 * DRAG_GAIN * 0.5, `${(afterDrag - before).toFixed(0)} px`);
  check("drag tidak memicu navigasi kartu", new URL(page.url()).pathname === "/");

  // Drag nyata di atas FOTO kartu (tautan): jarak strip = 2,5x jarak kursor, tanpa drag-and-drop bawaan browser
  await page.mouse.move(700, 120);
  await sleep(600);
  await page.evaluate(() => {
    window.__ev = { dragstart: 0, pointercancel: 0 };
    window.addEventListener("dragstart", () => window.__ev.dragstart++, true);
    window.addEventListener("pointercancel", () => window.__ev.pointercancel++, true);
  });
  const pickCard = () =>
    page.evaluate(() => {
      const r = [...document.querySelectorAll("section[aria-label='Karya pilihan'] a")].map((el) => el.getBoundingClientRect()).find((b) => b.left > 700 && b.right < 1400 && b.top < 700);
      return { x: r.left + r.width / 2, y: Math.min(r.top + 150, 800) };
    });
  const cardPos = await pickCard();
  await page.mouse.move(cardPos.x, cardPos.y);
  await sleep(300);
  const t0 = await translateX(page, trackSel);
  await page.mouse.down();
  for (let i = 1; i <= 15; i++) {
    await page.mouse.move(cardPos.x - i * 20, cardPos.y); // total 300px
    await sleep(14);
  }
  await sleep(160); // berhenti sebentar sebelum dilepas agar tanpa inertia
  await page.mouse.up();
  await sleep(1400); // strip mengejar tujuan dengan halus; tunggu menetap
  const t1 = await translateX(page, trackSel);
  const dragEv = await page.evaluate(() => window.__ev);
  const dragTravel = Math.abs(t1 - t0);
  check(`drag di atas foto kartu: strip menempuh ${DRAG_GAIN}x jarak kursor (300px -> ~${300 * DRAG_GAIN}px)`, // Toleransi 15% + 40px: marquee tetap berjalan pelan (hover 25% ~ 12px/dtk) selama ~1,8 dtk pengujian.
  Math.abs(dragTravel - 300 * DRAG_GAIN) < 300 * DRAG_GAIN * 0.15 + 40, `strip bergeser ${(t1 - t0).toFixed(0)}px`);
  check("drag di atas foto kartu: tanpa dragstart/pointercancel bawaan browser", dragEv.dragstart === 0 && dragEv.pointercancel === 0, JSON.stringify(dragEv));
  await sleep(800);

  // Gerakan halus: satu lompatan kursor 200px tidak membuat strip melompat seketika, melainkan mengejar bertahap
  const cardPos2 = await pickCard();
  await page.mouse.move(cardPos2.x, cardPos2.y);
  await sleep(300);
  const sm0 = await translateX(page, trackSel);
  await page.mouse.down();
  await page.mouse.move(cardPos2.x - 200, cardPos2.y);
  await sleep(40);
  const sEarly = await translateX(page, trackSel);
  await sleep(100);
  const sMid = await translateX(page, trackSel);
  await sleep(Math.max(1300, FOLLOW_TAU * 5));
  const sFinal = await translateX(page, trackSel);
  await page.mouse.up();
  const early = Math.abs(sEarly - sm0);
  const mid = Math.abs(sMid - sm0);
  const final = Math.abs(sFinal - sm0);
  check("gerakan halus: strip tidak melompat seketika (40ms < 50% tujuan)", early > 0 && early < final * 0.5, `40ms ${early.toFixed(0)}px, 140ms ${mid.toFixed(0)}px, akhir ${final.toFixed(0)}px`);
  check(`gerakan halus: bertahap menuju tujuan ${200 * DRAG_GAIN}px (200px x ${DRAG_GAIN})`, mid > early && mid < final && Math.abs(final - 200 * DRAG_GAIN) < 200 * DRAG_GAIN * 0.15, `akhir ${final.toFixed(0)}px`);
  await sleep(2500);

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
  // Setelah dilepas, strip terus meluncur lalu melambat bertahap (tidak berhenti mendadak)
  const g0 = await translateX(page, trackSel);
  await sleep(300);
  const g1 = await translateX(page, trackSel);
  await sleep(1000);
  const g2 = await translateX(page, trackSel);
  await sleep(300);
  const g3 = await translateX(page, trackSel);
  const v1 = Math.abs(g1 - g0) / 0.3;
  const v2 = Math.abs(g3 - g2) / 0.3;
  check("inertia meluruh halus (kecepatan 0,3-0,6 dtk > kecepatan 1,6-1,9 dtk)", v1 > v2 * 1.5 && v1 > 100, `${v1.toFixed(0)} px/s -> ${v2.toFixed(0)} px/s`);

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

  // Semua judul (h1) harus tampil dengan spasi antarkata (regresi: "TentangAga")
  const headingRoutes = ["/", "/works", "/works/documentation", "/works/food", "/works/portrait", "/works/product", "/works/street", "/works/food/omakase-sake", "/works/street/ritme-malam-kota", "/about", "/experience", "/services", "/contact", "/tidak-ada"];
  const brokenHeadings = [];
  for (const route of headingRoutes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await sleep(1600);
    const h = await page.evaluate(() => {
      const el = document.querySelector("h1");
      const rendered = el.innerText.replace(/[\s ]+/g, " ").trim();
      return { rendered, expected: el.getAttribute("aria-label") };
    });
    if (h.rendered !== h.expected) brokenHeadings.push(`${route}: "${h.rendered}" != "${h.expected}"`);
  }
  check(`judul: spasi antarkata utuh di ${headingRoutes.length} halaman`, brokenHeadings.length === 0, brokenHeadings.slice(0, 2).join(" | "));

  // About: paragraf isi berwarna abu-abu (muted) seperti halaman lain
  await page.goto(base + "/about", { waitUntil: "networkidle" });
  await sleep(1600);
  const aboutColors = await page.evaluate(() => {
    const body = getComputedStyle(document.querySelector("p.text-body")).color;
    const muted = getComputedStyle(document.querySelector("p.text-label.text-muted")).color;
    return { body, muted };
  });
  check("About: paragraf isi abu-abu (muted)", aboutColors.body === aboutColors.muted, `${aboutColors.body}`);

  // Works: judul 2 baris + tab sejajar separator
  await page.goto(base + "/works", { waitUntil: "networkidle" });
  await sleep(1800);
  const h1 = await page.evaluate(() => {
    const h = document.querySelector("h1");
    const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize);
    return { lines: Math.round(h.getBoundingClientRect().height / lh), text: h.getAttribute("aria-label") };
  });
  check("judul /works = 2 baris", h1.lines === 2 && h1.text === "Dari dapur sampai jalanan.", `${h1.lines} baris`);
  for (const slug of ["documentation", "food", "portrait", "product", "street"]) {
    await page.goto(base + `/works/${slug}`, { waitUntil: "networkidle" });
    await sleep(1500);
    const lines = await page.evaluate(() => {
      const h = document.querySelector("h1");
      const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize);
      return Math.round(h.getBoundingClientRect().height / lh);
    });
    check(`judul /works/${slug} = 2 baris`, lines === 2, `${lines} baris`);
  }
  await page.goto(base + "/works", { waitUntil: "networkidle" });
  await sleep(1500);
  const tabNav = await page.evaluate(() => {
    const n = document.querySelector("nav[aria-label='Kategori karya']");
    return { scrollbarWidth: n.offsetWidth - n.clientWidth, scrollbarHeight: n.offsetHeight - n.clientHeight, overflowY: n.scrollHeight - n.clientHeight };
  });
  check("tab kategori: tanpa scrollbar", tabNav.scrollbarWidth === 0 && tabNav.scrollbarHeight === 0 && tabNav.overflowY <= 0, `scrollbar ${tabNav.scrollbarWidth}x${tabNav.scrollbarHeight}, overflow-y ${tabNav.overflowY}`);
  const tab = page.getByRole("link", { name: "Food", exact: true });
  await tab.hover();
  await sleep(700);
  const tabGeo = await tab.evaluate((el) => ({
    afterWidth: parseFloat(getComputedStyle(el, "::after").width),
    linkBottom: el.getBoundingClientRect().bottom,
    ulBottom: el.closest("ul").getBoundingClientRect().bottom,
  }));
  check("tab Works: garis hover sejajar separator", tabGeo.afterWidth > 20 && Math.abs(tabGeo.ulBottom - tabGeo.linkBottom - 1) < 0.6, `selisih ${(tabGeo.ulBottom - tabGeo.linkBottom).toFixed(2)}px`);

  // Pemisah abu-abu di atas CTA footer "Mari Abadikan Cerita Anda" harus ada di semua halaman
  const sepRoutes = ["/", "/works", "/works/food", "/about", "/experience", "/services", "/tidak-ada"];
  const noSeparator = [];
  for (const r of sepRoutes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    const w = await page.evaluate(() => getComputedStyle(document.querySelector("footer [data-footer-rule]")).borderTopWidth);
    if (w !== "1px") noSeparator.push(`${r}:${w}`);
  }
  check(`pemisah abu-abu di atas CTA footer di ${sepRoutes.length} halaman`, noSeparator.length === 0, noSeparator.join(", "));

  // /contact: tanpa CTA "Mari Abadikan Cerita Anda" dan tanpa pemisah CTA
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await sleep(1200);
  const contactCta = await page.evaluate(() => ({
    cta: document.querySelectorAll("footer a[data-hide-fab]").length,
    rule: document.querySelectorAll("footer [data-footer-rule]").length,
    text: document.body.innerText.includes("Mari Abadikan"),
    links: document.querySelectorAll("footer .grid a").length,
  }));
  check("contact: tanpa CTA 'Mari Abadikan Cerita Anda'", contactCta.cta === 0 && contactCta.rule === 0 && !contactCta.text && contactCta.links > 0, `cta ${contactCta.cta}, teks ${contactCta.text}, tautan footer ${contactCta.links}`);

  // Konten terakhir tidak boleh menempel ke pemisah footer: jarak >= 100px di halaman yang berakhir dengan grid/daftar
  const gapRoutes = ["/", "/works", "/works/food", "/works/street", "/services", "/contact", "/about", "/experience"];
  const tight = [];
  for (const r of gapRoutes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await sleep(1300);
    // gulir sampai bawah agar elemen whileInView muncul dan terukur
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 70));
      }
    });
    await sleep(900);
    const gap = await page.evaluate(() => {
      const main = document.querySelector("main");
      const leaves = [...main.querySelectorAll("*")].filter((el) => el.children.length === 0 && el.getBoundingClientRect().height > 0 && !el.closest(".fixed"));
      const lastBottom = Math.max(...leaves.map((el) => el.getBoundingClientRect().bottom));
      return document.querySelector("footer").getBoundingClientRect().top - lastBottom;
    });
    if (gap < 100) tight.push(`${r}:${gap.toFixed(0)}px`);
  }
  check(`jarak konten terakhir ke pemisah footer >= 100px di ${gapRoutes.length} halaman`, tight.length === 0, tight.join(", "));


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

  // Tata letak slideshow: foto menempati seluruh kolom kiri; semua kontrol ada di panel kanan
  const lay = await page.evaluate(() => {
    const d = document.querySelector("[role=dialog]");
    const stage = d.querySelector("[data-zoom-stage]").getBoundingClientRect();
    const rect = (el) => el.getBoundingClientRect();
    const counter = [...d.querySelectorAll("span")].find((el) => /\d\d \/ \d\d/.test(el.textContent));
    const byName = (n) => [...d.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === n || b.textContent.trim() === n);
    return {
      stage: { left: stage.left, right: stage.right, top: stage.top, bottom: stage.bottom, width: stage.width },
      counterLeft: rect(counter).left,
      closeLeft: rect(byName("TUTUP")).left,
      prevLeft: rect(byName("SEBELUMNYA")).left,
      nextLeft: rect(byName("SELANJUTNYA")).left,
      vw: window.innerWidth,
      vh: window.innerHeight,
    };
  });
  check("slideshow: foto mengisi seluruh tinggi layar", Math.abs(lay.stage.top) < 1 && Math.abs(lay.stage.bottom - lay.vh) < 1, `top ${lay.stage.top}, bottom ${lay.stage.bottom} / ${lay.vh}`);
  const closeText = await page.evaluate(() => [...document.querySelectorAll("[role=dialog] button")].find((b) => b.textContent.trim() === "TUTUP")?.textContent.trim() ?? null);
  check("slideshow: tombol tutup berupa teks TUTUP", closeText === "TUTUP", String(closeText));
  check("slideshow: foto menempati >= 65% lebar layar", lay.stage.width / lay.vw >= 0.65, `${((lay.stage.width / lay.vw) * 100).toFixed(0)}%`);
  check(
    "slideshow: counter, tutup, sebelumnya, selanjutnya ada di panel kanan",
    [lay.counterLeft, lay.closeLeft, lay.prevLeft, lay.nextLeft].every((x) => x >= lay.stage.right - 1),
    `kolom foto berakhir di ${lay.stage.right.toFixed(0)}px; kontrol mulai di ${[lay.counterLeft, lay.closeLeft, lay.prevLeft, lay.nextLeft].map((x) => x.toFixed(0)).join("/")}`,
  );

  // Zoom detail di slideshow: hover mouse memperbesar foto, titik zoom mengikuti kursor
  const stage = dialog.locator("[data-zoom-stage]");
  const sb = await stage.boundingBox();
  const zoomLayer = () => dialog.locator("[data-zoom-layer]").last();
  const zoomScale = () =>
    zoomLayer().evaluate((el) => {
      const m = getComputedStyle(el).transform;
      return m === "none" ? 1 : new DOMMatrix(m).a;
    });
  await page.mouse.move(1400, 450); // di panel kanan, di luar panggung foto
  await sleep(2600); // kursor sempat berada di atas panggung saat lightbox terbuka; beri waktu spring kembali ke 1x
  check("slideshow zoom: normal 1x sebelum hover", Math.abs((await zoomScale()) - 1) < 0.02);
  await page.mouse.move(sb.x + sb.width * 0.4, sb.y + sb.height * 0.4);
  await sleep(2400); // zoom sengaja lambat (1,4 dtk), beri waktu menetap
  const zIn = await zoomScale();
  check("slideshow zoom: hover memperbesar foto 4x", Math.abs(zIn - 4) < 0.15, `${zIn.toFixed(2)}x`);
  const o1 = await zoomLayer().evaluate((el) => getComputedStyle(el).transformOrigin);
  await page.mouse.move(sb.x + sb.width * 0.6, sb.y + sb.height * 0.6);
  await sleep(120);
  const oMid = await zoomLayer().evaluate((el) => getComputedStyle(el).transformOrigin);
  await sleep(1500);
  const o2 = await zoomLayer().evaluate((el) => getComputedStyle(el).transformOrigin);
  check("slideshow zoom: titik zoom mengikuti kursor", o1 !== o2, `${o1} -> ${o2}`);
  check("slideshow zoom: titik zoom meluncur halus (tidak melompat)", oMid !== o1 && oMid !== o2, `tengah ${oMid}`);
  check("slideshow zoom: memuat resolusi tinggi saat hover", (await dialog.locator("img").last().getAttribute("sizes")) === "2400px");
  await page.mouse.move(1400, 450); // di panel kanan, di luar panggung foto
  await sleep(2400);
  check("slideshow zoom: kembali 1x saat kursor keluar", Math.abs((await zoomScale()) - 1) < 0.05, `${(await zoomScale()).toFixed(2)}x`);

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

  // Navigasi antarproyek (prev/next)
  const pnav = page.locator("nav[aria-label='Navigasi proyek']");
  await pnav.scrollIntoViewIfNeeded();
  const pn = await pnav.evaluate((n) => {
    const [prev, next] = n.querySelectorAll("a");
    const cs = getComputedStyle(n);
    return {
      prevText: prev.textContent, nextText: next.textContent, prevHref: prev.getAttribute("href"), nextHref: next.getAttribute("href"),
      borders: [cs.borderTopWidth, cs.borderBottomWidth], wrapBorder: getComputedStyle(n.parentElement).borderTopWidth, footerBorder: getComputedStyle(document.querySelector("footer [data-footer-rule]")).borderTopWidth, ruleWidths: [n.parentElement.getBoundingClientRect().width, document.querySelector("footer [data-footer-rule]").getBoundingClientRect().width, document.querySelector("footer .grid").getBoundingClientRect().width],
      wrapGap: document.querySelector("footer").getBoundingClientRect().top - n.parentElement.getBoundingClientRect().bottom, prevAlign: getComputedStyle(prev).textAlign, nextAlign: getComputedStyle(next).textAlign,
    };
  });
  check("project nav: PREVIOUS PROJECT kiri + judul", /Previous project/i.test(pn.prevText) && pn.prevText.includes("Cellar Notes") === false && pn.prevAlign === "left", pn.prevText.slice(0, 40));
  check("project nav: NEXT PROJECT kanan + judul", /Next project/i.test(pn.nextText) && pn.nextText.includes("Cellar Notes") && pn.nextAlign === "right", pn.nextText.slice(0, 40));
  const navTitleSize = await pnav.evaluate((n) => [...n.querySelectorAll("span.mt-2")].map((el) => parseFloat(getComputedStyle(el).fontSize)));
  check("project nav: judul memakai ukuran text-title (<= 40px)", navTitleSize.length >= 1 && navTitleSize.every((px) => px <= 40.5), navTitleSize.map((px) => px.toFixed(0) + "px").join(" / "));
  check("project nav: strip tanpa garis sendiri", pn.borders[0] === "0px" && pn.borders[1] === "0px", pn.borders.join(" / "));
  check("pemisah: atas navigasi = atas CTA = bawah CTA (lebar sama)", pn.ruleWidths.every((w) => Math.abs(w - pn.ruleWidths[0]) < 1.5), pn.ruleWidths.map((w) => w.toFixed(0)).join(" / "));
  check("project nav: garis di atas navigasi + garis di atas CTA footer", pn.wrapBorder === "1px" && pn.footerBorder === "1px" && Math.abs(pn.wrapGap) < 2, `atas ${pn.wrapBorder}, footer ${pn.footerBorder}, jarak ke footer ${pn.wrapGap.toFixed(1)}px`);
  check("project nav: tanpa link 'Kembali ke'", (await page.getByRole("link", { name: /Kembali ke/i }).count()) === 0);
  // Hover: panah previous -> ↖ (+45°), panah next -> ↗ (-45°)
  const prevLink = pnav.getByRole("link", { name: /Previous project/i });
  await prevLink.hover();
  await sleep(900);
  const prevRot = await rotationDeg(prevLink.locator("svg").first().locator(".."));
  check("project nav: panah previous berputar ke ↖ (+45°)", Math.abs(prevRot - 45) < 2, `${prevRot}°`);
  const nextLink = pnav.getByRole("link", { name: /Next project/i });
  await nextLink.hover();
  await sleep(900);
  const nextRot = await rotationDeg(nextLink.locator("svg").first().locator(".."));
  check("project nav: panah next berputar ke ↗ (-45°)", Math.abs(nextRot + 45) < 2, `${nextRot}°`);
  await pnav.getByRole("link", { name: /Next project/i }).click();
  await page.waitForURL("**/works/food/cellar-notes");
  check("project nav: klik Next -> proyek berikutnya", page.url().endsWith("/works/food/cellar-notes"));

  // Kategori dengan dua proyek (documentation): previous = next, jadi hanya "Next project" yang tampil
  await page.goto(base + "/works/documentation/pelatihan-fotografi", { waitUntil: "networkidle" });
  await sleep(1200);
  const solo = page.locator("nav[aria-label='Navigasi proyek']");
  check("project nav (2 proyek): hanya tombol Next project", (await solo.getByRole("link", { name: /Next project/i }).count()) === 1 && (await solo.getByRole("link", { name: /Previous project/i }).count()) === 0);
  const soloRight = await solo.getByRole("link", { name: /Next project/i }).evaluate((a) => Math.abs(a.getBoundingClientRect().right - a.closest("nav").getBoundingClientRect().right) < 2);
  check("project nav (2 proyek): tombol Next tetap di kanan", soloRight);

  // Experience: foto berganti saat kursor bergerak, tiap foto beda sudut
  await page.goto(base + "/experience", { waitUntil: "networkidle" });
  await sleep(1500);
  const companyLines = await page.evaluate(() =>
    [...document.querySelectorAll("li p.text-display")].map((p) => {
      const lh = parseFloat(getComputedStyle(p).lineHeight);
      return { name: p.textContent.replace(/\s+/g, " "), lines: Math.round(p.getBoundingClientRect().height / lh) };
    }),
  );
  check("experience: nama perusahaan selalu dua baris", companyLines.length === 3 && companyLines.every((c) => c.lines === 2), companyLines.map((c) => `${c.name}=${c.lines}`).join(", "));
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
  const contactFab = page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" });
  check("contact: tombol WhatsApp sticky tetap tampil", (await contactFab.count()) === 1 && (await contactFab.isVisible()));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1200);
  check("contact: tombol WhatsApp sticky tetap tampil di dasar halaman", (await contactFab.count()) === 1 && (await contactFab.isVisible()));
  // Di dasar halaman, tombol sticky tidak boleh menutupi teks footer (hak cipta + atribusi ikon)
  const overlap = await page.evaluate(() => {
    const fab = document.querySelector("a[aria-label='Chat dengan Aga via WhatsApp']").getBoundingClientRect();
    const hit = [...document.querySelectorAll("footer p, footer a, footer span")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.left < fab.right && r.right > fab.left && r.top < fab.bottom && r.bottom > fab.top;
    });
    return hit.map((el) => el.textContent.trim().slice(0, 30));
  });
  check("dasar halaman: tombol WhatsApp tidak menutupi teks footer", overlap.length === 0, overlap.join(" | "));
  // Ruang di bawah baris hak cipta tidak berlebihan (desktop)
  const below = await page.evaluate(() => {
    const row = [...document.querySelectorAll("footer p")].find((el) => el.textContent.includes("©"));
    return document.documentElement.scrollHeight - (row.getBoundingClientRect().bottom + window.scrollY);
  });
  check("footer: ruang di bawah baris hak cipta <= 40px (desktop)", below <= 40, `${below.toFixed(0)}px`);
  // Di halaman lain, FAB tetap tersembunyi saat CTA footer terlihat
  await page.goto(base + "/about", { waitUntil: "networkidle" });
  await sleep(1800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1500);
  check("halaman lain: FAB tersembunyi saat CTA footer terlihat", (await page.getByRole("link", { name: "Chat dengan Aga via WhatsApp" }).count()) === 0);

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

  // Mobile: di dasar halaman, tombol WhatsApp tidak menutupi teks footer
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await sleep(2200);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1200);
  const mobileOverlap = await page.evaluate(() => {
    const fab = document.querySelector("a[aria-label='Chat dengan Aga via WhatsApp']")?.getBoundingClientRect();
    if (!fab) return ["FAB tidak ada"];
    return [...document.querySelectorAll("footer p, footer a, footer span")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.left < fab.right && r.right > fab.left && r.top < fab.bottom && r.bottom > fab.top;
      })
      .map((el) => el.textContent.trim().slice(0, 30));
  });
  check("mobile: tombol WhatsApp tidak menutupi teks footer di dasar halaman", mobileOverlap.length === 0, mobileOverlap.join(" | "));

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
