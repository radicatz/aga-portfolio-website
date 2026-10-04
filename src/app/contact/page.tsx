import type { Metadata } from "next";
import { CopyButton } from "@/components/contact/CopyButton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { HoverLine } from "@/components/ui/HoverLine";
import { WhatsAppPill } from "@/components/ui/WhatsAppPill";
import { contact } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.text,
};

export default function ContactPage() {
  const { contact: c } = site;

  return (
    <div className="container-site pb-section pt-12 md:pt-20">
      <SplitTextReveal text={contact.title} className="text-display max-w-[14ch]" />
      <Reveal>
        <p className="text-body mt-8 max-w-xl text-muted">{contact.text}</p>
      </Reveal>

      {/* data-hide-fab: tombol WhatsApp sticky disembunyikan saat blok ini terlihat */}
      <div data-hide-fab className="mt-14 border-t border-line/15 md:mt-20">
        <Reveal>
          <dl className="grid md:grid-cols-12">
            <div className="grid gap-2 border-b border-line/15 py-8 md:col-span-12 md:grid-cols-12 md:gap-6">
              <dt className="text-label text-muted md:col-span-3">{contact.emailLabel}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-6 gap-y-2 md:col-span-9">
                <HoverLine href={`mailto:${c.email}`} className="text-title">
                  {c.email}
                </HoverLine>
                <CopyButton value={c.email} label={contact.copy} copiedLabel={contact.copied} />
              </dd>
            </div>

            <div className="grid gap-4 border-b border-line/15 py-8 md:col-span-12 md:grid-cols-12 md:gap-6">
              <dt className="text-label text-muted md:col-span-3">{contact.whatsappLabel}</dt>
              <dd className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-9">
                <HoverLine href={c.whatsappUrl} className="text-title">
                  {c.phoneDisplay}
                </HoverLine>
                <WhatsAppPill label={contact.whatsappCta} />
              </dd>
            </div>

            <div className="grid gap-2 border-b border-line/15 py-8 md:col-span-12 md:grid-cols-12 md:gap-6">
              <dt className="text-label text-muted md:col-span-3">{contact.instagramLabel}</dt>
              <dd className="md:col-span-9">
                <HoverLine href={c.instagramUrl} className="text-title">
                  {c.instagramHandle}
                </HoverLine>
              </dd>
            </div>

            <div className="grid gap-2 border-b border-line/15 py-8 md:col-span-12 md:grid-cols-12 md:gap-6">
              <dt className="text-label text-muted md:col-span-3">{contact.locationLabel}</dt>
              <dd className="md:col-span-9">
                <p className="text-title">{contact.locationCities}</p>
                <p className="text-body mt-2 text-muted">{contact.locationNote}</p>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </div>
  );
}
