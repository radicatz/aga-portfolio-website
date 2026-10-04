// Audit aksesibilitas otomatis (axe-core) untuk setiap jenis rute, di tema terang dan gelap.
// Pakai: node scripts/audit-a11y.mjs  (server berjalan di BASE, default http://localhost:3100)
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3100";
const routes = ["/", "/works", "/works/food", "/works/food/omakase-sake", "/about", "/experience", "/services", "/contact", "/tidak-ada"];
const browser = await chromium.launch();
let total = 0;

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    total += violations.length;
    console.log(`${violations.length ? "FAIL" : "PASS"}  ${theme.padEnd(5)} ${route}`);
    for (const v of violations) {
      console.log(`      [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elemen)`);
      for (const n of v.nodes.slice(0, 2)) console.log(`         ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1] ?? ""}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\nTotal pelanggaran: ${total}`);
process.exit(total ? 1 : 0);
