import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Navbar } from "@/components/nav/Navbar";
import { categories } from "@/content/categories";
import { projectsByCategory } from "@/content/projects";
import { site } from "@/content/site";
import "./globals.css";

// Display: Le Murmure (Jérémy Landes / Velvetyne, SIL OFL 1.1). Lisensi: assets/fonts/le-murmure/LICENSE.txt
const display = localFont({
  src: "../../assets/fonts/le-murmure/LeMurmure-Regular.woff2",
  variable: "--font-display-face",
  weight: "400",
  display: "swap",
});

const body = Space_Grotesk({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Fotografer`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "id_ID", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  email: site.contact.email,
  telephone: site.contact.phoneDisplay,
  address: { "@type": "PostalAddress", addressLocality: "Tangerang", addressCountry: "ID" },
  sameAs: [site.contact.instagramUrl],
  founder: { "@type": "Person", name: site.name, jobTitle: "Fotografer" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const navCategories = categories.map((c) => ({
    slug: c.slug,
    label: c.label,
    count: projectsByCategory(c.slug).length,
  }));

  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <a
            href="#main"
            className="text-label fixed left-4 top-4 z-50 -translate-y-20 bg-fg px-4 py-3 text-bg focus:translate-y-0"
          >
            Lewati ke konten
          </a>
          <Navbar categories={navCategories} />
          <main id="main" className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
