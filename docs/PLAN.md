# Rencana Website Portofolio — Aga Kharta Dinata

> Dokumen perencanaan lengkap. Saat implementasi dimulai, salin dokumen ini ke `docs/PLAN.md` di repo.
> Referensi: https://lundanistudio.framer.website/ · Instagram: @agadinata_ · Sumber: `.context/Portofolio/Aga Kharta Dinata Porto.pdf`, `.context/Portofolio/Foto/*`

> **Revisi 1 (2026-10-05):** dokumen ini adalah rencana awal. Perubahan setelahnya (font Le Murmure + Space Grotesk, ikon Guidance, dropdown Works dihapus, panah hover ↗, marquee hover 25% + drag, lightbox baru, Experience multi-foto, dll.) dicatat di `docs/PROGRESS.md` (Log keputusan) dan `docs/DESIGN-SYSTEM.md`. Di mana keduanya berbeda dengan dokumen ini, ikuti DESIGN-SYSTEM dan PROGRESS.

> **Mode kerja:** user memilih **auto mode** untuk implementasi. Urutan eksekusi: F0 (scaffold + `CLAUDE.md`, `docs/DESIGN-SYSTEM.md`, `docs/PROGRESS.md`, 4 skill proyek, lihat §8b) → F1 → … → F7. `docs/PROGRESS.md` diperbarui di akhir tiap fase.

---

## 0. Konteks

Aga Kharta Dinata adalah fotografer berbasis Tangerang (dan Bandung, sesuai bio IG). Ia berpengalaman sejak 2018 di fotografi makanan, produk, dan potret, dan juga memotret street photography di Jakarta. Portofolionya sekarang berupa PDF 15 halaman dengan copy generik. Tujuannya adalah membuat website portofolio yang:

- meniru kualitas layout, motion, dan nada copy dari template Lundani Studio (minimalis, editorial, tenang);
- memamerkan karya per **proyek**, bukan sekadar galeri, dengan 5 kategori: Documentation, Food, Portrait, Product, Street Photography;
- memakai copy Bahasa Indonesia yang profesional dan tidak berlebihan, sesuai suara Aga sendiri di IG ("Pelan-pelan, tanpa dikejar hasil", "Hening di Balik Kaca").

Video **tidak** dimasukkan ke website.

### Keputusan yang sudah dikunci (hasil tanya-jawab)

| Topik | Keputusan |
|---|---|
| Stack | **Next.js (App Router) + TypeScript + Tailwind + Motion** (library yang sama dengan Framer, jadi animasinya bisa hampir 1:1), Lenis untuk smooth scroll, deploy ke Vercel |
| Navigasi Works | **Halaman `/works` dengan tab filter kategori** (tiap kategori punya URL sendiri + intro storytelling) **+ dropdown saat hover** di desktop |
| Tema | **Default terang** (seperti referensi) + **tombol toggle ke mode gelap** (disimpan per pengunjung) |
| Bahasa | **Copy Bahasa Indonesia**, label nav dan meta tetap pendek dalam bahasa Inggris (WORKS, ABOUT, Client/Year/Location) |
| Wordmark | **AGA KHARTA DINATA** (ejaan "Kharta", sesuai PDF dan IG) |
| Nama klien | **Hanya nama pemberi kerja** (Yawara Boga, MyMeal, Jayatama). Brand produk dideskripsikan generik ("Brand Skincare Lokal") |
| Street | **7 foto street Jakarta + 3 foto landscape 2023** dari IG. 2 foto studio low-key (gelas martini, siluet) **tidak** masuk |
| Kontak | **Email + WhatsApp (nomor +62 821-3061-8881 ditampilkan) + Instagram**, tanpa form. Ada juga **tombol WhatsApp sticky di semua halaman** dengan gaya visual situs (monokrom, bukan hijau generik WhatsApp) |
| Hero | Arah **"Cahaya, Detail, Cerita."** |
| Services | **Tampil di nav**, layout kartu seperti referensi, berstatus "segera hadir", tanpa harga |

---

## 1. Analisis Referensi (Lundani Studio)

Diambil dari HTML yang di-render server di setiap halaman (home, works/in-the-garden, about, services, contact).

### 1.1 Struktur halaman
| Halaman | Isi |
|---|---|
| Home `/` | Navbar → Hero (judul serif besar + 1 paragraf) → **Ticker/marquee proyek** (6 proyek, tiap kartu = thumbnail + judul, ditautkan ke `/works/<slug>`) → Footer |
| Project `/works/<slug>` | Judul besar (animasi per huruf) → meta **Client / Year / Location** → 1 paragraf cerita → gambar ditumpuk → link **"Next >"** ke proyek berikutnya → Footer |
| About | Gambar besar → 2 paragraf studio → gambar → 1 kalimat tentang tim → grid anggota tim (foto, nama, peran) |
| Services | 1 kalimat intro → gambar → kartu layanan (gambar, judul, deskripsi 1 kalimat, "Starting from $X", tombol **Book Now** → contact) |
| Contact | Judul "Your Story Starts Here" (per huruf) → paragraf → Email / Phone / Address |
| Footer (global) | Link Works/About/Services/Contact · Instagram/Tiktok/Pinterest · CTA raksasa **"Let's Capture your Story"** + ikon panah → contact |

Di referensi, **"WORKS" mengarah ke home**. Referensi tidak punya halaman indeks kategori, jadi halaman itu adalah tambahan kita.

### 1.2 Copy referensi (pola yang ditiru, bukan diterjemahkan mentah)
- Hero: *"Photography for Modern Stories"* + *"We deliver clean, high-quality studio photography with professional lighting, sharp detail, and a refined look…"*
- Proyek: *"A quiet portrait series captured in natural garden light, focusing on texture, color, and candid moments…"*
- Pola: **judul pendek → 1 paragraf faktual dan sensorik (cahaya, tekstur, momen) → tanpa superlatif**. Kalimatnya deskriptif, tidak menjual dengan keras.

### 1.3 Tipografi & warna
- **Instrument Serif** untuk display/heading (hero ~70px desktop, berturut-turut 56/45/36/29px di breakpoint lebih kecil).
- **Manrope** untuk body/nav (15–18px). Nav pakai huruf kapital kecil.
- Warna: latar `#FFFFFF`, teks `#000000`, garis `rgb(38,37,37)`, teks redup `rgb(125,124,124)`. Monokrom penuh, fotonya yang memberi warna.
- Breakpoint Framer: Desktop 1200, Tablet 810, Phone 430.

### 1.4 Motion saat load & scroll (nilai diambil langsung dari bundle JS Framer)
| Elemen | Perilaku persis |
|---|---|
| **Judul (hero, judul proyek, judul Contact)**: efek *blurry* saat halaman load | Framer **Text Effect** `type: appear`, `trigger: onMount` (jalan **saat halaman dimuat**, bukan saat di-scroll), `tokenization: character` (per huruf). Tiap huruf dari `{opacity: 0.001, filter: blur(10px), y: 10}` → normal. Transisi `spring, duration 1, bounce 0`, **jeda 0.05s antar huruf**. Teks tampak kabur, lalu menjadi tajam huruf demi huruf dari kiri ke kanan |
| Section/gambar lain | Muncul dengan pola yang sama (opacity + blur + sedikit translate) |
| Marquee proyek | **Framer Ticker** dari CMS: `tickerEffectVelocity: 50` (desktop) / `30` (breakpoint kecil), `align: start`, berjalan tanpa henti dan **tidak melambat saat hover**. Lebar kartu **22.14% viewport (desktop) / 30% (tablet)**, gambar 960×1200 (rasio **4:5**) |
| Menu mobile (Navigation) | Hamburger 2 garis ("Line") → X. Transisi buka/tutup `tween 0.4s, ease [0.27, 0, 0.51, 1]` |
| Form kontak | Referensi punya form (Name, Email, Phone, Budget, Service, Message, "Send Message"). **Kita tidak memakainya** (keputusan: tanpa form) |

> Catatan koreksi: setiap kartu marquee memang punya 2 elemen gambar di HTML, tetapi itu adalah **varian SSR per breakpoint** (desktop/tablet), **bukan** gambar kedua untuk hover.

### 1.5 Hover state semua elemen (nilai persis)
Ease standar Framer di template ini: `tween 0.5s, ease [0.44, 0, 0.56, 1]`.

| Elemen | Hover | Transisi |
|---|---|---|
| **Nav link** (WORKS, ABOUT, …) | Garis 1px di bawah teks, awalnya `width: 1px; opacity: 0` di kiri, **memanjang ke lebar penuh teks** dan `opacity: 1`. Warna teks tidak berubah | tween 0.5s, ease [.44,0,.56,1] |
| **Footer links** (Works/About/Services/Contact) | Sama dengan nav link: garis bawah tumbuh dari kiri | tween 0.5s |
| **Kartu proyek (marquee)** | **Seluruh kartu (foto + judul) mengecil ke `scale: 0.9`**. Tidak ada pergantian gambar | **spring, duration 1, bounce 0.25**, jadi ada sedikit pantulan |
| **Footer CTA "Let's Capture your Story"** | Kedua baris teks **mengecil ke `scale: 0.9`**, ikon panah **berputar 180°** | tween 0.5s |
| **"Next>"** (halaman proyek) | `opacity: 0.5` | spring 0.4s, bounce 0.2 |
| **Team profile** (About) | Foto **`scale: 0.8` + `skewX: -5°` + `skewY: -8°`**, nama + jabatan muncul (`opacity 0 → 1`). Di tablet/phone, nama selalu tampil | spring 1s, bounce 0.2 |
| **Tombol "Book Now"** (Services) | Garis bawah tumbuh dari kiri (pola yang sama dengan nav link) | tween 0.5s; ikon spring 1s, bounce 0.2 |
| **Link teks dalam paragraf** | Warna `#7D7C7C` → `#000000` | transition CSS |
| **Tombol submit form** (Contact) | Latar `rgb(51,51,51)` → `rgba(51,51,51,0.85)`, radius 10px | tween |

Kesimpulan gaya: **hover di referensi selalu "menahan diri"**. Elemen mengecil (bukan membesar), garis tumbuh, atau opacity turun. Tidak ada perubahan warna mencolok, bayangan, atau zoom-in. Website Aga mengikuti prinsip yang sama.

---

## 2. Sitemap & Routing

```
/                                  Home: hero + marquee karya pilihan
/works                             Semua proyek + tab filter (Semua · Documentation · Food · Portrait · Product · Street)
/works/[category]                  Tab aktif = kategori, intro storytelling kategori di atas grid
/works/[category]/[slug]           Detail proyek: cerita, meta, semua foto, Next >
/about                             Tentang Aga
/experience                        Pengalaman, sertifikasi, komunitas
/services                          Placeholder "segera hadir"
/contact                           Kontak
/not-found                         404 dengan copy singkat + link kembali
```

**Navbar:** `AGA KHARTA DINATA` (kiri) · `WORKS ▾  ABOUT  EXPERIENCE  SERVICES  CONTACT` · toggle `LIGHT/DARK` (kanan).

**Kenapa halaman + dropdown (bukan dropdown saja):**
1. Tiap kategori butuh tempat untuk **copy storytelling**, dan dropdown tidak punya ruang untuk itu.
2. URL `/works/food` bisa dibagikan ke klien restoran secara langsung.
3. Di mobile, dropdown hover tidak berfungsi. Halaman dengan tab jauh lebih nyaman.
4. Lebih baik untuk SEO (tiap kategori = halaman yang terindeks).

Dropdown hanya jalan pintas di desktop: hover/fokus pada "WORKS" membuka panel kecil berisi 5 kategori dan jumlah proyeknya (mis. `Food — 04`). Klik "WORKS" langsung membuka `/works`.

---

## 3. Arsitektur Teknis

### 3.1 Stack
- **Next.js (versi stabil terbaru, App Router) + TypeScript**, semua halaman di-generate statis (`generateStaticParams`).
- **Tailwind CSS** dengan design token sebagai CSS variables (untuk light/dark).
- **Motion** (`motion/react`) untuk reveal, marquee, layout animation, dan transisi halaman.
- **Lenis** untuk smooth scroll (dimatikan saat `prefers-reduced-motion`).
- **next-themes** dengan `defaultTheme="light"`, `enableSystem={false}`, `attribute="data-theme"`.
- **next/font/google**: Instrument Serif + Manrope (self-hosted otomatis).
- **next/image** + **sharp** (script pre-processing). Hosting di **Vercel**.
- Konten disimpan sebagai **file TypeScript lokal** (tanpa CMS). Kalau nanti Aga ingin mengedit sendiri, bisa dimigrasi ke CMS (Sanity, misalnya).

### 3.2 Struktur folder
```
aga-portfolio-website/
├─ .context/                    # sumber asli: PDF, foto mentah, video, zip (TIDAK di-commit)
├─ assets/                      # HANYA file siap pakai untuk website (foto hasil optimasi)
├─ docs/PLAN.md                 # dokumen ini
├─ scripts/
│  ├─ fetch-instagram.mjs       # unduh 10 foto street/landscape via ScrapeCreators
│  └─ optimize-images.mjs       # resize + strip EXIF + blur placeholder + manifest
├─ assets/images/<category>/<slug>/NN.jpg   # hasil optimasi (maks 2400px, q≈82), diimpor statis
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx             # fonts, ThemeProvider, Lenis, Navbar, Footer
│  │  ├─ template.tsx           # transisi antar halaman
│  │  ├─ page.tsx               # Home
│  │  ├─ works/page.tsx
│  │  ├─ works/[category]/page.tsx
│  │  ├─ works/[category]/[slug]/page.tsx
│  │  ├─ about/ experience/ services/ contact/ (page.tsx)
│  │  ├─ not-found.tsx · sitemap.ts · robots.ts · opengraph-image.tsx
│  ├─ components/
│  │  ├─ nav/Navbar.tsx · WorksDropdown.tsx · MobileMenu.tsx · ThemeToggle.tsx
│  │  ├─ motion/SplitTextReveal.tsx · Reveal.tsx · PageTransition.tsx
│  │  ├─ works/ProjectMarquee.tsx · ProjectCard.tsx · CategoryTabs.tsx · ProjectGrid.tsx · Gallery.tsx · Lightbox.tsx · NextProject.tsx
│  │  ├─ experience/ExperienceRow.tsx · HoverPreview.tsx
│  │  ├─ layout/Footer.tsx · FooterCTA.tsx · WhatsAppFab.tsx
│  │  └─ ui/HoverLine.tsx       # garis bawah tumbuh (nav, footer, tab, tombol)
│  ├─ lib/motion.ts             # token transisi (ease & spring dari referensi)
│  ├─ content/
│  │  ├─ site.ts                # nama, kontak, sosial, copy global
│  │  ├─ categories.ts          # 5 kategori + intro storytelling
│  │  ├─ projects.ts            # semua proyek (lihat §6)
│  │  ├─ experience.ts
│  │  └─ images.generated.ts    # dihasilkan script: impor statis tiap foto di assets/images (Next otomatis membuat width/height/blur)
│  └─ styles/globals.css        # token warna light/dark
```

### 3.3 Model data
```ts
type CategorySlug = 'documentation' | 'food' | 'portrait' | 'product' | 'street';

interface Category { slug: CategorySlug; label: string; /* "Food" */ title: string; intro: string[]; }

interface Project {
  slug: string; title: string; category: CategorySlug;
  client: string; year: string; location: string;
  excerpt: string;          // 1 kalimat untuk kartu/SEO
  story: string[];          // 1–2 paragraf
  cover: string;            // gambar utama kartu
  hover?: string;           // opsional: gambar ke-2 untuk crossfade (default mati, referensi hanya scale 0.9)
  images: { src: string; alt: string }[];  // width/height/blur dari manifest
  featured?: number;        // urutan di marquee Home (undefined = tidak tampil)
  todo?: string;            // catatan yang perlu dikonfirmasi ke Aga (tidak di-render)
}
```

### 3.4 Pipeline gambar
- File asli berukuran 5–12 MB per foto, jadi **tidak boleh** langsung dipakai.
- `scripts/optimize-images.mjs` (sharp) membaca daftar file dari `projects.ts`, lalu: auto-rotate EXIF → resize ke sisi panjang 2400px → JPEG progresif q82 (dan AVIF/WebP disajikan otomatis oleh next/image di Vercel) → **hapus metadata EXIF/GPS** → menulis ke `assets/images/` dan menghasilkan `src/content/images.generated.ts` (impor statis; Next menghitung dimensi dan `blurDataURL` sendiri).
- Nama file dinormalisasi: `assets/images/food/omakase-sake/01.jpg`.
- **Aturan folder**: `assets/` hanya berisi file yang benar-benar dipakai website. Sumber mentah (PDF, foto asli, video, zip) ada di `.context/` dan di-ignore oleh git.
- ⚠️ **File produk beresolusi sangat rendah** (10–80 KB): `bottle.jpg`, `parfum.jpg`, `parfum 2.jpg`, `cincin.jpg`, `jam.jpg`, `single jam.jpg`. Ini kemungkinan hasil ekspor WhatsApp, dan akan pecah di layar desktop. **Minta file aslinya ke Aga.** Sampai file itu ada, jangan jadikan cover dan tampilkan dalam ukuran kecil saja.

### 3.5 Foto Street dari Instagram
`scripts/fetch-instagram.mjs` membaca `SCRAPECREATORS_API_KEY` dari env (key yang sudah ada di `~/.config/last30days/.env`; **jangan di-commit**). Script memanggil `GET https://api.scrapecreators.com/v2/instagram/user/posts?handle=agadinata_`, lalu mengunduh kandidat resolusi tertinggi (1440px) untuk shortcode berikut:

| Shortcode | Tanggal | Isi | Proyek |
|---|---|---|---|
| `Dcno0DRCWJj` (carousel ×3) | 2026-08-29 | Rel KRL, pejalan menyeberang | Kembali Hunting |
| `DTKe_teiXMy` | 2026-01-06 | B&W, dua teman memeriksa kamera | Kembali Hunting |
| `DSXbEXaiTcT` | 2025-12-17 | Senja terbakar di atas kemacetan | Ritme Malam Kota |
| `DR5LUkUE4EQ` | 2025-12-06 | Pengendara ojek, pantulan genangan | Ritme Malam Kota |
| `DRcGOmNiaD9` | 2025-11-24 | Siluet di lorong saat senja | Ritme Malam Kota |
| `DRZr-G_iWHr` | 2025-11-23 | Penjual kaki lima, api wajan | Ritme Malam Kota |
| `DRPmBzkCe3G` | 2025-11-19 | Sosok di balik kaca, malam | Ritme Malam Kota |
| `CoOhGcyr_VU` | 2023-02-04 | Sunrise Point Cukul | Sebelum Kota |
| `CoJU-BjL-oo` | 2023-02-02 | Curug Tilu Leuwi Opat | Sebelum Kota |
| `CoL6C-NL-93` | 2023-02-03 | Labuan Bajo, matahari terbenam | Sebelum Kota |

Resolusi IG (1440px) cukup untuk web. **File asli dari Aga tetap lebih baik.** Karena URL CDN Instagram kedaluwarsa, file **harus diunduh dan disimpan lokal**, bukan di-hotlink.

---

## 4. Design System

### 4.1 Token warna
| Token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0E0E0D` |
| `--fg` | `#0A0A0A` | `#F1F0EC` |
| `--muted` | `#7D7C7C` | `#8C8B87` |
| `--line` | `#262525` (opacity 15–100% sesuai konteks) | `#F1F0EC` @ 15% |
| `--surface` (dropdown, lightbox) | `#F6F5F2` | `#171716` |

Toggle: teks kecil `LIGHT / DARK` di kanan navbar (yang aktif bergaris bawah) atau ikon matahari/bulan dengan `aria-label`. Saat diklik, perpindahan warna dianimasikan dengan View Transitions API (fade 300ms; fallback tanpa animasi). Pilihan disimpan di localStorage melalui next-themes. Tidak ada flash saat load (script inline dari next-themes).

### 4.2 Tipografi
| Peran | Font | Ukuran (desktop → mobile) |
|---|---|---|
| Display (hero, judul halaman/proyek) | Instrument Serif | `clamp(44px, 7vw, 96px)`, line-height 0.95, tracking -0.01em |
| Footer CTA | Instrument Serif | `clamp(56px, 11vw, 160px)` |
| H2 / judul kartu | Instrument Serif | 29–36px |
| Body | Manrope 400 | 16–18px, line-height 1.6, max 60ch |
| Nav / label / meta | Manrope 500, UPPERCASE | 12–13px, tracking 0.08em |

### 4.3 Grid & spacing
- Container maksimal 1440px, gutter 24px (desktop) / 16px (mobile).
- 12 kolom di desktop, 6 di tablet, 4 di mobile. Ritme vertikal antar section 120 / 96 / 64px.
- Garis tipis 1px (`--line`) sebagai pemisah, seperti di referensi.

---

## 5. Spesifikasi Halaman, Interaksi & Copy

> Prinsip copy: kalimat pendek, sensorik (cahaya, tekstur, suasana), tanpa superlatif ("terbaik", "memukau", "luar biasa"), tanpa emoji. Gunakan "Anda" saat menyapa klien. Istilah industri boleh dalam bahasa Inggris (low-key, food styling, katalog).

### 5.1 Global: Navbar
- Sticky, latar `--bg` dengan blur tipis. **Tersembunyi saat scroll ke bawah, muncul saat scroll ke atas** (translateY, 300ms).
- **Hover nav link (persis referensi)**: garis 1px warna `--fg` di bawah teks, awalnya `width: 1px; opacity: 0` di sisi kiri, lalu memanjang ke lebar penuh teks dengan `opacity 1` (tween 0.5s, ease [.44,0,.56,1]). Saat mouse keluar, garis menyusut kembali. Link **halaman aktif** menampilkan garis penuh secara permanen. Hover yang sama juga berlaku untuk `:focus-visible` (keyboard).
- **WorksDropdown** (desktop, ≥1024px): terbuka saat hover/fokus dengan delay tutup 150ms. Panel memuat 5 baris `Documentation 02`, dst. Hover tiap baris memakai **garis bawah tumbuh yang sama** (bukan geser teks), agar konsisten. Bisa diakses keyboard (Enter/Space membuka, Esc menutup, panah atas/bawah).
- **MobileMenu** (<1024px): hamburger 2 garis → X (tween 0.4s, ease [.27,0,.51,1], sama dengan referensi). Overlay layar penuh, link besar serif muncul berurutan (stagger 60ms). Kategori Works tampil sebagai sub-list kecil. Toggle tema dan sosial ada di bagian bawah.

### 5.1b Global: Tombol WhatsApp sticky (`WhatsAppFab.tsx`)
Tampil di **semua halaman**, kanan bawah (inset 24px desktop / 16px mobile, ditambah `env(safe-area-inset-bottom)`).
- **Gaya mengikuti situs, bukan hijau WhatsApp**: pil dengan latar `--fg` dan teks/ikon `--bg` (hitam di mode terang, terang di mode gelap), tinggi 48px, padding 20px, radius penuh. Label Manrope uppercase 12px tracking 0.08em: **`WHATSAPP`** didahului ikon garis WhatsApp monokrom 18px (SVG outline, `currentColor`). Di mobile hanya ikon, bentuk lingkaran 52px.
- **Hover** (mengikuti bahasa hover referensi): isi pil mengecil ke `scale 0.9` (spring 1s, bounce 0.25), lalu ikon panah kecil ↗ muncul dan berputar seperti panah Footer CTA. Fokus keyboard memakai outline 2px offset 3px.
- **Perilaku**:
  - Muncul setelah scroll 200px atau 1.5s setelah load (fade + y 12 → 0), agar tidak bersaing dengan animasi judul saat load.
  - **Disembunyikan** saat Footer CTA atau blok kontak di `/contact` terlihat di layar (IntersectionObserver), supaya tidak dobel.
  - Disembunyikan saat menu mobile atau lightbox terbuka.
- Link: `https://wa.me/6282130618881?text=Halo%20Aga%2C%20saya%20ingin%20diskusi%20proyek%20foto.` (`target="_blank" rel="noopener"`), `aria-label="Chat dengan Aga via WhatsApp"`.
- Nomor dan template pesan disimpan di `content/site.ts` (satu sumber untuk FAB, footer, dan Contact).

### 5.2 Global: Footer
- Baris link: Works · About · Experience · Services · Contact | Instagram · WhatsApp · Email. Hover memakai garis bawah tumbuh (sama dengan nav).
- **CTA raksasa** (ke /contact): **"Mari Abadikan Cerita Anda"** + ikon panah. **Hover persis referensi**: teks mengecil ke `scale 0.9` dan panah berputar 180° (tween 0.5s, ease [.44,0,.56,1]).
  - Alternatif: "Punya Cerita untuk Dipotret?"
- Baris bawah: `© 2026 Aga Kharta Dinata · Tangerang, Indonesia`.

### 5.3 Home `/`
**Layout:** Hero (rata kiri atau tengah, mengikuti referensi) → Marquee karya pilihan → baris indeks kategori → Footer.

**Hero copy**
- Judul (per huruf, blur-in): **Cahaya, Detail, Cerita.**
- Subjudul: *Fotografi makanan, produk, dan potret yang dikerjakan dengan tenang: cahaya yang terukur, detail yang dijaga, dan cerita yang tidak dipaksakan.*
- Label kecil di atas judul: `FOTOGRAFER · TANGERANG — JAKARTA`

**Marquee karya pilihan (8 proyek, urutan `featured`)**
1. Omakase & Sake (Food) 2. Ritual Kulit (Product) 3. Ritme Malam Kota (Street) 4. Studio: Denim & Cahaya Lembut (Portrait) 5. Cellar Notes (Food) 6. Batu & Kilau (Product) 7. Meja Ramadan (Food) 8. Hunting di Pulau (Documentation)

**Perilaku marquee**
- Bergerak terus ke kiri dengan `useAnimationFrame` pada **50 px/detik (desktop) / 30 px/detik (mobile)**, seperti referensi. Daftar diduplikasi 2× agar loop mulus. **Kecepatan tidak berubah saat hover**, sama dengan referensi.
- *Tambahan (tidak ada di referensi, aktifkan jika diinginkan)*: drag/swipe dengan inertia di mobile, ambang 5px untuk membedakan drag dari klik.
- Lebar kartu: 22.14vw (≥1200), 30vw (≥810), 68vw (mobile). Aspek 4:5, gap 16px.
- **Kartu hover (persis referensi)**: **seluruh kartu (foto + judul) mengecil ke `scale 0.9`** dengan spring (duration 1s, bounce 0.25), lalu kembali saat mouse keluar. Tidak ada pergantian gambar atau zoom-in. Judul serif di bawah foto dan kategori kecil di bawahnya.
  - *Opsional (bukan referensi)*: field `hover` di data proyek memungkinkan crossfade ke foto kedua. **Default mati.**
- Klik → `/works/[category]/[slug]`.
- `prefers-reduced-motion`: marquee berhenti dan berubah jadi carousel scroll horizontal biasa.

**Baris indeks kategori** (di bawah marquee): `Documentation · Food · Portrait · Product · Street`, masing-masing dengan jumlah proyek dan link ke `/works/<cat>`.

### 5.4 Works `/works` & `/works/[category]`
**Layout**
- Judul halaman (per huruf): **Karya** — atau judul kategori saat filter aktif.
- **Tab filter** (sticky di bawah navbar): `Semua · Documentation · Food · Portrait · Product · Street`. Tab aktif punya garis bawah yang bergeser (`layoutId`). Mengklik tab = navigasi ke `/works/<cat>` (`scroll: false`), sehingga URL berubah tapi animasinya terasa seperti filter di tempat.
- **Intro kategori** (2 paragraf, §5.4.1) muncul dengan fade/blur saat tab berubah. Di tab "Semua", intro diganti 1 kalimat umum.
- **Grid proyek**: 2 kolom desktop (kartu besar 4:5) atau layout zig-zag editorial (kolom kiri lebih tinggi), 1 kolom mobile. Kartu: cover, judul, `Kategori — Tahun`. Hover sama dengan kartu marquee (**scale 0.9, spring bounce 0.25**). Tab filter memakai hover garis bawah tumbuh.
- Pergantian filter: `AnimatePresence` + `layout`. Kartu keluar fade/blur, yang tersisa bergeser dengan animasi layout.

**Copy halaman /works (tab Semua)**
> Lima ruang kerja, satu cara melihat. Dari dapur restoran sampai rel kereta di sore hari, setiap proyek dimulai dari hal yang sama: memperhatikan cahaya sebelum menekan rana.

#### 5.4.1 Copy storytelling per kategori

**Documentation**
> **Yang terjadi, apa adanya.**
> Dokumentasi bukan soal mengatur adegan, melainkan berada di tempat yang tepat tanpa mengganggu jalannya acara. Dari pelatihan fotografi hingga perjalanan hunting ke pulau, foto-foto ini merekam orang-orang yang sedang belajar, berjalan, dan bekerja bersama.
> Fokusnya sederhana: momen yang jujur, komposisi yang rapi, dan cerita yang tetap utuh ketika dilihat kembali bertahun-tahun kemudian.

**Food**
> **Rasa yang bisa dilihat.**
> Lebih dari tujuh tahun memotret dapur dan meja makan, dari omakase dan sake untuk restoran Jepang, katalog wine, sampai menu harian katering, mengajarkan satu hal: makanan hanya punya beberapa menit sebelum kehilangan tampilan terbaiknya.
> Karena itu setiap sesi disiapkan dengan cermat. Arah cahaya, tekstur, uap, dan kilau ditata agar foto tidak hanya menunjukkan bentuk hidangan, tetapi juga mengundang orang untuk mencicipinya.

**Portrait**
> **Wajah, dan cerita di baliknya.**
> Potret yang baik dimulai dari rasa nyaman. Sebelum kamera diangkat, ada percakapan, jeda, dan waktu bagi subjek untuk menjadi dirinya sendiri.
> Dari sesi studio personal hingga potret bersama sebuah tim, tujuannya tetap sama: menangkap karakter, bukan sekadar rupa. Cahaya dibentuk untuk mendukung ekspresi, bukan menutupinya.

**Product**
> **Produk sebagai pusat cerita.**
> Saat ini, foto produk adalah pengganti sentuhan: menjelaskan bentuk, material, dan rasa sebuah barang tanpa satu kata pun.
> Eksplorasi pendekatan low-key: latar gelap, cahaya terarah, dan properti alami seperti batu, kayu, dan bunga. Hasilnya visual yang bersih, fokus, dan siap dipakai untuk katalog, e-commerce, maupun kampanye.
>
> *(Revisi dari user. "Di sekarang" disesuaikan menjadi "Saat ini" agar tata bahasanya baku.)*

**Street Photography**
> **Kota, pelan-pelan.**
> Di luar pekerjaan komersial, kamera tetap ikut berjalan. Jalanan Jakarta menjadi tempat untuk berlatih melihat: rel kereta di siang terik, lampu kendaraan di malam hari, dan penjual kaki lima di balik nyala api.
> Tidak ada brief dan tidak ada target. Hanya kebiasaan untuk berhenti sejenak dan memperhatikan. *Pelan-pelan, tanpa dikejar hasil.* Seri ini juga memuat beberapa perjalanan alam dari tahun-tahun sebelumnya, ketika kamera pertama kali dibawa keluar kota.

### 5.5 Detail Proyek `/works/[category]/[slug]`
**Layout (mengikuti referensi, ditambah sedikit)**
1. Breadcrumb kecil: `WORKS / FOOD`
2. Judul proyek besar (per huruf, blur-in)
3. Meta 3 kolom dengan garis tipis di atasnya: **Client** · **Year** · **Location** (+ **Category**)
4. Cerita 1–2 paragraf (kolom kanan, max 60ch)
5. **Galeri**: ritme editorial yang mengikuti orientasi foto. Foto landscape lebar penuh, dua foto portrait berdampingan. Gambar pertama dibuat paling besar (hero image).
   - Reveal: `clip-path: inset(8% 0 8% 0)` → `inset(0)` + scale 1.06→1 saat masuk viewport (sekali).
   - **Klik → Lightbox**: latar `--surface`, panah/Esc/swipe, counter `03 / 12`, fokus terkunci di dalam lightbox, dan fokus dikembalikan saat ditutup.
6. **Next >**: blok penuh lebar dengan judul proyek berikutnya (dalam kategori yang sama, berputar). **Hover persis referensi: `opacity 0.5`** (spring 0.4s, bounce 0.2). Ada juga link kecil "← Kembali ke Food" dengan hover yang sama.
   - Gambar galeri: hover **tidak** mengubah skala (agar tidak mengganggu saat melihat foto). Kursor `zoom-in` menandakan foto bisa dibuka di lightbox.

### 5.6 About `/about`
**Layout:** potret Aga (⚠️ belum ada foto Aga, lihat §8) → judul → 2–3 paragraf → foto karya → angka ringkas → baris "Pendekatan" 3 kolom → **strip "Klien & Tempat Bekerja"** (menggantikan grid tim di referensi): 3 kartu Yawara Boga / MyMeal / Jayatama, masing-masing dengan 1 foto karya dari periode itu.
- **Hover kartu** (mengadopsi hover Team Profile referensi): foto `scale 0.8, skewX -5°, skewY -8°` dan nama + periode muncul (`opacity 0 → 1`), spring 1s, bounce 0.2. Di tablet/phone, nama selalu tampil.

**Copy**
- Judul (per huruf): **Tentang Aga**
- Paragraf 1:
  > Aga Kharta Dinata adalah fotografer yang berbasis di Tangerang, dengan pengalaman sejak 2018 memotret makanan, produk, dan potret untuk restoran, katering, dan brand. Seorang *visual storyteller*, memakai cahaya untuk menjelaskan apa yang penting dari sebuah subjek.
- Paragraf 2:
  > Lima tahun di dapur grup restoran Jepang membentuk cara kerja yang teliti pada detail, cepat membaca cahaya, dan sabar menunggu momen yang tepat. Kebiasaan yang sama terbawa ke studio produk, sesi potret, hingga jalanan Jakarta, tempat latihan melihat terus berjalan di luar pekerjaan komersial.
- Paragraf 3:
  > Pemegang sertifikasi profesi fotografi (2024) dan anggota komunitas fotografi Instanusantara.
- *Aturan copy About: tanpa kata ganti orang ketiga ("ia", "dia", "-nya" yang merujuk ke Aga). Nama "Aga" hanya dipakai di kalimat pembuka.*
- **Angka ringkas** (count-up saat terlihat): `2018` mulai berkarya · `3` pemberi kerja · `5` kategori karya · `2` sertifikasi/pelatihan
- **Pendekatan** (3 kolom):
  - **Cahaya dulu.** Setiap sesi dimulai dari membaca cahaya: dari mana datangnya, apa yang ingin ditonjolkan, dan apa yang perlu dibiarkan gelap.
  - **Detail yang dijaga.** Remah di piring, sidik jari di botol, lipatan kain. Hal kecil seperti ini yang membedakan foto yang rapi dari yang asal jadi.
  - **Cerita, bukan sekadar gambar.** Foto yang baik menjawab satu pertanyaan sederhana: apa yang ingin dirasakan orang saat melihatnya?

### 5.7 Experience `/experience`
**Layout:** judul → intro 1 kalimat → **daftar baris (timeline tabel)** → Sertifikasi & Pelatihan → Komunitas → CTA kecil ke Works.
- Tiap baris: `Tahun` | `Perusahaan` (serif besar) | `Peran` | deskripsi 1–2 kalimat. Garis tipis antar baris.
- **Interaksi**: hover baris (desktop) → **thumbnail karya dari periode itu muncul dan mengikuti kursor** (spring, rotasi ±3°), teks baris lain meredup ke 40%. Di mobile, thumbnail tampil statis di dalam baris.
- Baris muncul berurutan saat scroll.

**Copy**
- Judul: **Pengalaman**
- Intro: *Delapan tahun di balik kamera, sebagian besar di dapur, studio, dan ruang produksi konten.*

| Tahun | Perusahaan | Peran | Deskripsi |
|---|---|---|---|
| 2025 — Sekarang | **Jayatama Motorindo** | Photographer | Memproduksi foto produk dan materi visual untuk kanal digital perusahaan, termasuk konten untuk program kemitraan. *(verifikasi)* |
| 2023 — 2025 | **MyMeal Catering** | Photographer | Memotret menu harian dan musiman untuk layanan katering sehat, serta aset visual untuk konten edukasi gizi di media sosial. |
| 2018 — 2023 | **Yawara Boga Indonesia** | Photographer | Lima tahun bersama grup restoran Jepang: memotret omakase, sushi, sake, dan hidangan musiman untuk menu, katalog, dan media sosial beberapa outlet. |

**Sertifikasi & Pelatihan**
- 2024 — Sertifikasi Profesi Fotografi *(konfirmasi lembaga penerbit, mis. BNSP/LSP)*
- 2023 — Pelatihan Fotografi, Dinas Pariwisata dan Ekonomi Kreatif Provinsi DKI Jakarta

**Komunitas**
- Anggota Instanusantara (Jakarta)

> Pendidikan SMA (SMA N 2 Dumai, 2003–2006) **tidak dicantumkan**. Tidak relevan untuk calon klien. Bisa ditambahkan jika Aga menginginkan.

### 5.8 Services `/services` (placeholder)
- Judul: **Layanan**
- Intro: *Halaman ini sedang disiapkan. Sementara itu, berikut jenis pekerjaan yang biasa Aga tangani.*
- 4 kartu (layout seperti referensi: gambar, judul, 1 kalimat, tombol **Diskusikan** → /contact). Hover tombol mengikuti "Book Now" referensi: garis bawah tumbuh dari kiri (tween 0.5s), ikon panah spring 1s. Label harga diganti badge `SEGERA HADIR`:
  - **Food Photography**: Menu, katalog, dan konten media sosial untuk restoran, kafe, dan katering.
  - **Product Photography**: Foto katalog dan kampanye dengan pencahayaan terarah untuk e-commerce dan brand.
  - **Portrait Photography**: Potret personal, profesional, dan tim, di studio maupun di lokasi.
  - **Event Documentation**: Dokumentasi pelatihan, acara perusahaan, dan perjalanan komunitas.
- Data di `content/services.ts`, sehingga mudah diisi harga/paket nanti tanpa mengubah layout.

### 5.9 Contact `/contact`
**Layout:** judul besar (per huruf) → paragraf → 3 blok kontak bergaris → baris lokasi → foto karya kecil.
- Judul: **Cerita Anda Dimulai di Sini**
- Paragraf: *Punya proyek atau sekadar ingin bertanya? Ceritakan kebutuhan Anda, mulai dari jenis foto, jadwal, sampai lokasi. Aga akan membalas secepatnya.*
- Blok:
  - **Email**: `agakhartadinata@gmail.com` (mailto, dengan tombol salin kecil)
  - **WhatsApp**: **+62 821-3061-8881** (ditampilkan sebagai teks dan ditautkan ke `https://wa.me/6282130618881?text=Halo%20Aga%2C%20saya%20ingin%20diskusi%20proyek%20foto.`), ditambah tombol kecil **"Chat via WhatsApp"** bergaya sama dengan FAB
  - **Instagram**: `@agadinata_`
  - **Lokasi**: Tangerang · Jakarta, dan tersedia untuk proyek di luar kota
- Hover pada tiap blok: link berubah dari `--muted` ke `--fg` (pola link teks referensi), dan garis bawah tumbuh dari kiri. Panah ↗ berputar seperti panah Footer CTA.
- Footer juga mencantumkan nomor WhatsApp yang sama.

### 5.10 404
- Judul: **Halaman tidak ditemukan.**
- Teks: *Mungkin tautannya sudah berubah. Silakan kembali ke karya.* → tombol ke /works.

---

## 6. Kurasi Proyek (konten `projects.ts`)

Nomor foto mengacu ke urutan file di folder. Tahun diambil dari tanggal file di `assets/f.zip`.

### Food
| Slug / Judul | Foto | Client | Year | Location |
|---|---|---|---|---|
| `omakase-sake` **Omakase & Sake** | `DSC_0054, 0063, 0076, 0085` (botol sake & kotak), `DSC02517, 02519, 02533` (sake & hidangan), `DSC08132-Enhanced-NR` (canapé kaviar), `DSC09127` (dessert), `DSC_0128-Enhanced-NR`, `FILE095, 102, 110, 137, 188` (nigiri & sashimi), `DSC00386` | Restoran Jepang, Jakarta *(TODO: apakah Yawara Boga? Tanggal file 2024, sedangkan masa kerja berakhir 2023)* | 2024 | Jakarta |
| `cellar-notes` **Cellar Notes** | `DSC00293, 00312, 00317, 00322, 00337, 00342` | Katalog Wine | 2024 | Jakarta |
| `meja-ramadan` **Meja Ramadan** | `MMC01859, 01869, 01979, 01982, 02301, 02307, 02329, 02331, 02403, 02407, 02421` | *(TODO: MyMeal?)* | 2025 | Tangerang |
| `hidangan-rumahan` **Hidangan Rumahan** | `MMC00089, 00156` (pangsit), `MMC01624, 01636` (sup jagung), `MMC09914, 09925` (tumisan daging) | *(TODO)* | 2025 | Tangerang |

- **Omakase & Sake**: *Seri untuk sebuah restoran Jepang: sake dalam kemasan kayu, nigiri yang baru dibentuk, dan hidangan penutup yang disajikan dalam porsi kecil. Latar gelap dan cahaya samping yang sempit dipakai untuk menonjolkan kilau ikan dan tekstur nasi, mengikuti suasana ruang makan yang tenang dan intim.*
- **Cellar Notes**: *Katalog wine dengan pendekatan yang konsisten: satu botol, satu sumber cahaya, latar batu gelap. Label dibiarkan terbaca jelas, sementara pantulan kaca dijaga tetap halus agar setiap botol tampil setara di halaman katalog.*
- **Meja Ramadan**: *Menu berbuka dengan nuansa Timur Tengah: nasi rempah, ayam panggang, dan sup kacang, ditata di antara ornamen kuningan dan panel kisi emas. Setiap hidangan dipotret dalam dua komposisi, tegak dan mendatar, agar siap untuk katalog maupun media sosial.*
- **Hidangan Rumahan**: *Sesi singkat untuk menu harian: pangsit goreng, sup jagung, dan tumisan daging di atas papan kayu. Cahaya hangat dan properti sederhana menjaga kesan akrab, seperti makanan yang baru saja diangkat dari dapur.*

### Product
| Slug / Judul | Foto | Client | Year | Location |
|---|---|---|---|---|
| `ritual-kulit` **Ritual Kulit** | `DSC_0267, 0276, 0298, 0414-2, 0427, 0454-4, Serum, Studio Session-060-2` | Brand Skincare Lokal | 2026 | Studio, Tangerang |
| `penanda-waktu` **Penanda Waktu** | `DSC_0302, 0305, 0410` (+ `jam`, `single jam` ⚠️ resolusi rendah) | Brand Jam Tangan | 2026 | Studio, Tangerang |
| `batu-kilau` **Batu & Kilau** | `DSC_1430, DSC_2340` (+ `cincin` ⚠️) | Brand Perhiasan | 2025 | Studio, Tangerang |
| `aroma-dalam-gelap` **Aroma dalam Gelap** | `bottle, parfum, parfum 2` ⚠️ semuanya resolusi rendah | Brand Parfum | 2025 | Studio, Tangerang |

- **Ritual Kulit**: *Rangkaian foto untuk beberapa lini perawatan kulit. Setiap produk ditempatkan dalam lingkungan yang mencerminkan kandungannya: lumut untuk gel berbahan alami, kayu dan tanah untuk toner, gradasi lembut untuk tabir surya. Cahaya dibuat bersih supaya warna kemasan tetap akurat.*
- **Penanda Waktu**: *Jam tangan dipotret di antara kain satin hitam dan bebatuan vulkanik. Pencahayaan sempit menyorot hanya bagian yang penting, yaitu angka, jarum, dan tekstur strap, sementara sisanya dibiarkan tenggelam dalam gelap.*
- **Batu & Kilau**: *Cincin berbatu biru dan putih dengan bunga segar dan batu kasar sebagai pasangan. Kontras antara permukaan yang kasar dan potongan permata yang tajam memberi ruang bagi kilau untuk terlihat lebih hidup.*
- **Aroma dalam Gelap**: *Botol parfum sebagai objek tunggal di atas latar hitam. Cahaya dari belakang menembus cairan berwarna dan membentuk siluet botol, menghadirkan karakter setiap aroma tanpa perlu banyak properti.*
- Jika file asli parfum belum tersedia saat launch, **sembunyikan proyek ini** (`hidden: true`).

### Portrait
| Slug / Judul | Foto | Client | Year | Location |
|---|---|---|---|---|
| `denim-cahaya-lembut` **Denim & Cahaya Lembut** | `DSC00806, 00895, 00912, 00918, 01031, 01034` | Sesi Personal | 2024 | Studio, Tangerang |
| `hitam-putih-kursi` **Hitam, Putih, dan Sebuah Kursi** | `DSC00975, 00978, 00990` | Sesi Personal | 2024 | Studio, Tangerang |
| `tujuh-belas` **Tujuh Belas** | `DSC_0010, 0017, 0020-2, 0024` | *(TODO: perusahaan apa? Hari jadi ke-17)* | 2025 | Tangerang |

- **Denim & Cahaya Lembut**: *Sesi potret studio dengan satu konsep sederhana: jaket denim, kerudung netral, dan cahaya lembut dari satu arah. Variasi latar abu-abu gelap hingga putih menghadirkan dua suasana yang berbeda dari satu sesi yang sama.*
- **Hitam, Putih, dan Sebuah Kursi**: *Latar putih bersih, busana hitam, dan sebuah kursi sebagai satu-satunya properti. Pose dibuat santai dan diulang dengan sedikit perubahan, misalnya kacamata hitam yang dilepas, sehingga karakter subjek muncul dari detail kecil.*
- **Tujuh Belas**: *Potret tim untuk perayaan hari jadi ke-17 sebuah perusahaan. Dari foto bersama yang riuh dengan balon angka emas hingga potret close-up dengan kue ulang tahun dalam cahaya low-key, sesi ini merekam kebersamaan dan rasa bangga di hari yang sama.*

### Documentation
| Slug / Judul | Foto | Client | Year | Location |
|---|---|---|---|---|
| `hunting-di-pulau` **Hunting di Pulau** | `1728956333381, 431, 439, 459, 484` (benteng bata), `_MG_3702, 3730, 3737, 3738, 3740, 3746` (dermaga, kapal) | Komunitas Fotografi | 2024 | Kepulauan Seribu *(TODO: Pulau Kelor/Onrust?)* |
| `pelatihan-fotografi` **Pelatihan Fotografi** | `20230822160246_IMG_5540, 20230822160307_IMG_5542` (+ `DSC_0296`?) | Disparekraf DKI Jakarta | 2023 | Jakarta |

- **Hunting di Pulau**: *Perjalanan hunting bersama komunitas ke pulau di utara Jakarta. Dari dermaga kayu dan kapal penyeberangan sampai reruntuhan benteng bata merah, seri ini merekam orang-orang yang sibuk mencari sudut terbaik, sementara sejarah berdiri diam di sekeliling mereka.*
- **Pelatihan Fotografi**: *Dokumentasi program pelatihan fotografi Dinas Pariwisata dan Ekonomi Kreatif Provinsi DKI Jakarta, program yang juga diikuti Aga sebagai peserta. Foto bersama peserta dan panitia menjadi penutup rangkaian kegiatan.*
- `DSC_0296` (acara di karpet ungu): TODO, tanyakan konteksnya. Kalau tidak jelas, jangan dipakai.

### Street Photography
| Slug / Judul | Foto | Client | Year | Location |
|---|---|---|---|---|
| `ritme-malam-kota` **Ritme Malam Kota** | IG `DSXbEXaiTcT, DR5LUkUE4EQ, DRcGOmNiaD9, DRZr-G_iWHr, DRPmBzkCe3G` | Personal | 2025 | Jakarta |
| `kembali-hunting` **Kembali Hunting** | IG `Dcno0DRCWJj` (×3), `DTKe_teiXMy` | Personal | 2026 | Jakarta |
| `sebelum-kota` **Sebelum Kota** | IG `CoOhGcyr_VU, CoJU-BjL-oo, CoL6C-NL-93` | Personal | 2023 | Bandung · Labuan Bajo |

- **Ritme Malam Kota** (dari caption-captionnya sendiri): *Jakarta setelah matahari turun: langit yang terbakar di atas kemacetan, pengendara yang memantul di genangan, penjual kaki lima di balik nyala api, dan seseorang yang menemukan jeda di balik kaca. Lima foto tentang kota yang tidak pernah benar-benar berhenti, dan orang-orang yang terus bergerak di dalamnya.*
- **Kembali Hunting**: *Siang hari di sepanjang rel kereta: kereta yang melintas, pejalan kaki yang menyeberang, dan teman seperjalanan yang sibuk memeriksa hasil jepretan. Seri ini dibuat tanpa target, hanya kembali membiasakan mata untuk melihat.*
- **Sebelum Kota**: *Beberapa perjalanan dari 2023: matahari pagi di Cukul, curug di selatan Bandung, dan senja di Labuan Bajo. Foto-foto awal yang membentuk kebiasaan Aga untuk menunggu cahaya yang tepat.*

---

## 7. Spesifikasi Motion (ringkasan implementasi)

| Komponen | Spesifikasi |
|---|---|
| Token transisi (`lib/motion.ts`) | `easeFramer = [0.44, 0, 0.56, 1]`; `tween = {duration: 0.5, ease: easeFramer}`; `springCard = {type:'spring', duration: 1, bounce: 0.25}`; `springSoft = {type:'spring', duration: 1, bounce: 0.2}`; `springQuick = {type:'spring', duration: 0.4, bounce: 0.2}`; `springText = {type:'spring', duration: 1, bounce: 0}` |
| `SplitTextReveal` (**blur saat load**) | Persis referensi: berjalan **saat mount/halaman dimuat** (`initial` → `animate`, bukan `whileInView`), per huruf (kata dibungkus `inline-block` agar tidak terpotong di tengah). `{opacity: 0.001, filter: 'blur(10px)', y: 10}` → `{1, blur(0), 0}`, `springText`, **stagger 0.05s per huruf**. Dipakai di judul hero, judul halaman, judul proyek, dan judul Contact. Saat navigasi antar halaman, animasi diulang setelah transisi halaman selesai. `aria-label` berisi teks penuh, huruf-huruf `aria-hidden` |
| `Reveal` (generik) | `whileInView`, `once`, `amount 0.3`: opacity 0→1, blur 8→0, y 24→0, `springText` |
| Gambar galeri | `clip-path inset(8% 0 8% 0)` → `inset(0)`, scale 1.06→1, 0.9s (saat masuk viewport; bukan hover) |
| Marquee | `useAnimationFrame`, **50px/s desktop, 30px/s mobile, konstan** (tidak melambat saat hover). Loop lewat duplikasi + modulo lebar track. Drag opsional |
| Hover kartu proyek | **`whileHover={{ scale: 0.9 }}` pada wrapper kartu (foto + judul)**, `springCard` |
| Hover nav/footer/tab/tombol teks | Garis `<span>` 1px: `{width: 1px → 100%, opacity: 0 → 1}` dari kiri, `tween` 0.5s. Juga aktif di `:focus-visible` |
| Hover Footer CTA | Teks `scale 0.9` + panah `rotate 180`, `tween` 0.5s |
| Hover "Next >" / link kembali | `opacity 0.5`, `springQuick` |
| Hover kartu tempat kerja (About) | Foto `{scale: 0.8, skewX: -5, skewY: -8}`, label opacity 0→1, `springSoft` |
| Hover link teks | `color: --muted → --fg`, CSS transition 0.3s |
| `WhatsAppFab` | Muncul: fade + y 12→0 (springSoft). Hover: `scale 0.9` (springCard) + panah ↗ rotate. Hilang saat Footer CTA/blok kontak terlihat |
| Transisi halaman | `template.tsx`: konten keluar opacity 1→0 + blur 0→6px (250ms), konten masuk sebaliknya (400ms). Scroll ke atas melalui Lenis |
| Navbar | Hide on scroll down / show on scroll up, `layoutId` untuk garis bawah aktif |
| Dropdown Works | Opacity + y −8→0, 200ms, item stagger 30ms |
| Mobile menu | Overlay `clip-path circle()` dari posisi hamburger, link stagger 60ms |
| Experience | Thumbnail ikut kursor dengan `useSpring` (stiffness 150, damping 20) |
| Toggle tema | `document.startViewTransition` fade 300ms (fallback langsung) |
| Reduced motion | Semua animasi di atas → fade saja atau tanpa animasi. Marquee → scroll manual. Lenis mati |

---

## 8. Kebutuhan dari Aga (TODO sebelum/sesudah launch)

1. **Foto profil Aga** untuk About (dan OG image). Saat ini belum ada sama sekali.
2. **File asli resolusi tinggi**: `bottle, parfum, parfum 2, cincin, jam, single jam` (Product), dan idealnya juga file asli 10 foto IG.
3. Konfirmasi **klien**: Omakase & Sake (2024, apakah Yawara Boga?), Meja Ramadan & Hidangan Rumahan (MyMeal?), Tujuh Belas (perusahaan apa?).
4. Lokasi **Hunting di Pulau** (Pulau Kelor/Onrust?) dan konteks `DSC_0296`.
5. **Lembaga penerbit sertifikasi** 2024 (BNSP/LSP?).
6. Deskripsi pekerjaan di **Jayatama Motorindo** (copy saat ini masih asumsi dari judul video).
7. Pekerjaan **freelance** lain yang boleh dicantumkan (folder video menyebut Eco8 dan Gojek Kemang).
8. **Domain** (mis. `agakhartadinata.com`) dan akun Vercel.
9. Persetujuan publikasi dari subjek potret (terutama sesi personal).

---

## 8b. Tata Kelola Proyek: Konsistensi untuk Sesi Claude Berikutnya

Tujuannya agar setiap sesi kerja (manusia maupun Claude) memakai ulang komponen dan token yang sama, mengikuti aturan copy, dan selalu tahu posisi progres. Semua file ini dibuat di **F0** dan diperbarui sepanjang proyek.

### `CLAUDE.md` (root, dimuat otomatis tiap sesi). Isi ringkas (≤150 baris):
1. **Ringkasan proyek**: siapa Aga, tujuan situs, link ke `docs/PLAN.md`, `docs/DESIGN-SYSTEM.md`, `docs/PROGRESS.md`.
2. **Stack & perintah**: `npm run dev | build | lint`, `node scripts/optimize-images.mjs`, `node scripts/fetch-instagram.mjs` (butuh `SCRAPECREATORS_API_KEY`).
3. **Aturan wajib**:
   - **Cek inventaris komponen di `docs/DESIGN-SYSTEM.md` sebelum membuat komponen baru.** Pakai/extend yang sudah ada (`HoverLine`, `SplitTextReveal`, `Reveal`, `ProjectCard`, …). Komponen baru harus didaftarkan ke inventaris.
   - **Tidak ada nilai hardcode**: warna via CSS variable token (`--bg`, `--fg`, `--muted`, `--line`, `--surface`), tipografi via kelas utilitas yang ditetapkan, transisi via `lib/motion.ts`. Dilarang membuat ease/spring baru tanpa menambahkannya ke `lib/motion.ts` dan DESIGN-SYSTEM.
   - **Hover selalu "menahan diri"** (scale ≤1, garis tumbuh, opacity turun), sesuai tabel §1.5.
   - **Konten hanya di `src/content/*`**. Komponen tidak boleh berisi copy hardcode, kecuali label UI pendek berbahasa Inggris.
   - Setiap fitur harus jalan di light **dan** dark, di 390/810/1440px, dan dengan `prefers-reduced-motion`.
   - **Di akhir setiap tugas, perbarui `docs/PROGRESS.md`.**
4. **Aturan copy**: Bahasa Indonesia baku, ringkas, tanpa superlatif/emoji/penutup retoris. Halaman About tanpa kata ganti orang ketiga. Sapaan "Anda". Label nav/meta dalam bahasa Inggris.
5. **Data**: nama "Aga Kharta Dinata" (ejaan Kharta), kontak di `content/site.ts`, klien hanya nama pemberi kerja.
6. **Jangan**: commit `.env`, file video/zip, atau foto asli besar; hotlink CDN Instagram; memakai hijau WhatsApp.

### `docs/DESIGN-SYSTEM.md`
- Token warna light/dark (§4.1), skala tipografi (§4.2), grid/spacing (§4.3).
- **Token motion** (`lib/motion.ts`) + **tabel pola hover** (§1.5/§7) sebagai sumber kebenaran.
- **Inventaris komponen**: nama, path, props, kapan dipakai, contoh. Contoh entri: `HoverLine` (garis bawah tumbuh, untuk semua link teks), `SplitTextReveal` (semua judul H1), `ProjectCard` (marquee + grid), `WhatsAppFab`, `Lightbox`, dan seterusnya. Status: ✅ siap / 🚧 dalam proses.

### `docs/PROGRESS.md` (progress tracker)
- Checklist per fase F0–F7 (§9), dengan sub-tugas dan status `[ ]` / `[~]` / `[x]`.
- **Log keputusan** (tanggal, keputusan, alasan), diawali dengan semua keputusan di §0.
- **Menunggu dari Aga**: daftar §8, dicentang saat jawaban/aset diterima.
- **Catatan sesi terakhir**: 3–5 baris tentang apa yang dikerjakan dan langkah berikutnya, supaya sesi baru bisa langsung melanjutkan.

### Skill proyek (`.claude/skills/`)
| Skill | Kapan dipakai | Isi |
|---|---|---|
| `add-project` | Menambah atau mengubah proyek/foto | Taruh foto di `assets/…` → tambah entri di `content/projects.ts` (template field + aturan slug) → jalankan `optimize-images.mjs` → tulis copy mengikuti pola referensi (judul pendek, 1–2 paragraf sensorik, tanpa superlatif) → cek halaman kategori + detail → update PROGRESS |
| `ui-component` | Membuat atau mengubah komponen UI | Cek inventaris DESIGN-SYSTEM → reuse/extend → hanya pakai token + `lib/motion.ts` → cek light/dark, 3 breakpoint, reduced-motion, keyboard → daftarkan di inventaris → update PROGRESS |
| `progress-update` | Akhir setiap sesi/tugas | Centang checklist, tambah log keputusan, tulis "Catatan sesi terakhir", perbarui daftar "Menunggu dari Aga" |
| `copy-id` | Menulis atau merevisi copy | Pedoman suara (ringkas, baku, tenang), daftar kata yang dihindari, aturan About tanpa "ia", contoh sebelum/sesudah dari revisi user |

---

## 9. Fase Implementasi

| Fase | Pekerjaan | Hasil |
|---|---|---|
| F0 Setup | `git init`, scaffold Next.js + TS + Tailwind, install `motion lenis next-themes sharp`, `.gitignore` (video, zip, `.env*`), salin dokumen ini ke `docs/PLAN.md`, buat **`CLAUDE.md`, `docs/DESIGN-SYSTEM.md`, `docs/PROGRESS.md`, dan 4 skill proyek** (§8b) | Repo berjalan `npm run dev` + tata kelola siap |
| F1 Aset | `fetch-instagram.mjs` (10 foto), `optimize-images.mjs`, `images.generated.ts`, isi `projects.ts` / `categories.ts` / `experience.ts` / `site.ts` sesuai §5–6 | Semua gambar teroptimasi + konten terstruktur |
| F2 Fondasi | Token light/dark, font, layout, Navbar + WorksDropdown + MobileMenu + ThemeToggle, Footer + CTA, Lenis, transisi halaman, `SplitTextReveal`, `Reveal` | Kerangka situs lengkap |
| F3 Home | Hero + `ProjectMarquee` + `ProjectCard` + indeks kategori | Home sesuai referensi |
| F4 Works | `/works`, `/works/[category]` (tab, intro, grid animasi), `/works/[category]/[slug]` (meta, galeri, lightbox, Next) | Semua proyek bisa dijelajahi |
| F5 Halaman lain | About, Experience (hover preview), Services (placeholder), Contact, 404 | Semua rute lengkap |
| F6 Polish | Metadata per halaman, OG image dinamis, `sitemap.ts`, `robots.ts`, JSON-LD `Person` + `ProfessionalService`, alt text Indonesia untuk tiap foto, audit a11y & performa | Siap launch |
| F7 Deploy | Vercel, domain, cek produksi | Live |

---

## 10. Verifikasi

- `npm run lint` dan `npm run build` lolos tanpa error. Semua rute statis ter-generate (5 kategori + 16 proyek).
- Jalankan `npm run dev`, lalu ambil **screenshot Playwright** di 1440 / 810 / 390px untuk setiap rute, dalam **mode terang dan gelap**. Bandingkan dengan referensi untuk ritme layout, ukuran tipografi, dan marquee.
- **Bandingkan motion berdampingan dengan referensi** (rekam layar keduanya): blur per huruf saat load, kecepatan marquee, kartu mengecil ke 0.9 dengan pantulan, garis bawah nav tumbuh dari kiri, Footer CTA mengecil dan panah berputar 180°, Next> memudar.
- Uji interaksi: hover nav/footer/tab, dropdown Works (mouse + keyboard), tab filter mengubah URL dan tombol back browser berfungsi, lightbox (panah/Esc/swipe), toggle tema bertahan setelah reload tanpa flash.
- **Tombol WhatsApp sticky**: tampil di semua rute, warnanya mengikuti tema terang/gelap (tidak hijau), tersembunyi saat Footer CTA/blok kontak terlihat dan saat menu mobile/lightbox terbuka, tidak menutupi konten di 390px, dan link membuka chat dengan pesan template.
- Emulasikan `prefers-reduced-motion: reduce`: semua animasi tergantikan dan marquee bisa di-scroll manual.
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. LCP hero < 2.5s. Tidak ada gambar > 500 KB terkirim.
- Cek metadata: tidak ada EXIF/GPS di file `assets/images` (`exiftool` atau sharp metadata kosong).
- Link WhatsApp, mailto, dan Instagram terbuka dengan benar di desktop dan ponsel.
