"use client";

import { usePathname } from "next/navigation";
import { FooterCTA } from "./FooterCTA";

/**
 * CTA "Mari Abadikan Cerita Anda" beserta pemisah abu-abu di atasnya, ditampilkan di semua halaman
 * kecuali /contact (halaman itu sendiri sudah berisi kontak, jadi CTA menuju /contact tidak relevan).
 * Pemisah berada di dalam container agar selebar garis di bawahnya.
 */
export function FooterCTASection() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div data-footer-rule className="border-t border-line/15">
      <FooterCTA />
    </div>
  );
}
