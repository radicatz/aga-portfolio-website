import { HoverLine } from "@/components/ui/HoverLine";
import { site } from "@/content/site";
import { FooterCTASection } from "./FooterCTASection";

export function Footer() {
  const { contact } = site;

  // pb-20 pada <footer>: ruang di bawah agar baris hak cipta/atribusi bisa digulir melewati tombol WhatsApp sticky
  return (
    <footer className="pb-20">
      <div className="container-site">
        <FooterCTASection />

        <div className="grid gap-10 border-t border-line/15 py-10 text-label md:grid-cols-3">
          <ul className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <HoverLine href={item.href}>{item.label}</HoverLine>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-3">
            <li>
              <HoverLine href={contact.instagramUrl}>INSTAGRAM</HoverLine>
            </li>
            <li>
              <HoverLine href={contact.whatsappUrl}>WHATSAPP</HoverLine>
            </li>
            <li>
              <HoverLine href={`mailto:${contact.email}`}>EMAIL</HoverLine>
            </li>
          </ul>

          <div className="flex flex-col gap-3 text-muted md:items-end">
            <span>{contact.phoneDisplay}</span>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line/15 py-6 text-label text-muted md:flex-row md:justify-between">
          <p>{site.footer.copyright}</p>
          <p>
            {site.footer.iconCredit.prefix}{" "}
            <a href={site.footer.iconCredit.url} target="_blank" rel="noopener noreferrer" className="hover-line">
              {site.footer.iconCredit.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
