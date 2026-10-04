// Optimasi foto sumber (.context/) menjadi file siap web di assets/images/
// dan hasilkan src/content/images.generated.ts (impor statis; Next membuat width/height/blur).
// Pakai: node scripts/optimize-images.mjs
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOTS = {
  foto: path.resolve(".context/Portofolio/Foto"),
  ig: path.resolve(".context/instagram"),
};
const OUT_DIR = path.resolve("assets/images");
const GENERATED = path.resolve("src/content/images.generated.ts");
const MAX_SIDE = 2400;
const LOW_RES_SIDE = 1200;

const { projects } = JSON.parse(await readFile("scripts/image-sources.json", "utf8"));
const pad = (n) => String(n + 1).padStart(2, "0");
const exists = (p) => stat(p).then(() => true, () => false);

const imports = [];
const entries = [];
const warnings = [];
let done = 0;

for (const project of projects) {
  const keys = [];
  for (const [i, ref] of project.files.entries()) {
    const [root, ...rest] = ref.split(":");
    const src = path.join(ROOTS[root], rest.join(":"));
    const rel = `${project.category}/${project.slug}/${pad(i)}.jpg`;
    const out = path.join(OUT_DIR, rel);

    if (!(await exists(src))) {
      console.error(`Sumber tidak ada: ${src}`);
      process.exit(1);
    }
    await mkdir(path.dirname(out), { recursive: true });

    const upToDate = (await exists(out)) && (await stat(out)).mtimeMs > (await stat(src)).mtimeMs;
    if (!upToDate) {
      // Metadata (EXIF/GPS) dibuang secara default oleh sharp; rotate() menerapkan orientasi EXIF dulu.
      try {
        await sharp(src, { failOn: "none" })
          .rotate()
          .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toFile(out);
      } catch (err) {
        console.error(`Gagal memproses ${ref}: ${err.message}`);
        process.exit(1);
      }
      done++;
    }

    const { width, height } = await sharp(out).metadata();
    if (Math.max(width, height) < LOW_RES_SIDE) {
      warnings.push(`${rel}  ${width}x${height}  (resolusi rendah: ${ref})`);
    }
    const id = `img${imports.length}`;
    imports.push(`import ${id} from "../../assets/images/${rel}";`);
    keys.push(id);
  }
  entries.push(`  "${project.slug}": [${keys.join(", ")}],`);
}

const header = "// DIHASILKAN oleh scripts/optimize-images.mjs. Jangan diedit manual.\n";
const body = [
  header,
  'import type { StaticImageData } from "next/image";',
  ...imports,
  "",
  "export const projectImages: Record<string, StaticImageData[]> = {",
  ...entries,
  "};",
  "",
].join("\n");
await mkdir(path.dirname(GENERATED), { recursive: true });
await writeFile(GENERATED, body);

console.log(`Selesai: ${done} foto diproses, ${imports.length} foto total, ${projects.length} proyek.`);
if (warnings.length) {
  console.warn(`\nPeringatan resolusi rendah (minta file asli ke Aga):\n${warnings.join("\n")}`);
}
