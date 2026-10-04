"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppPill } from "@/components/ui/WhatsAppPill";
import { springSoft } from "@/lib/motion";

/**
 * Tombol WhatsApp sticky di semua halaman. Bergaya situs (monokrom --fg/--bg), bukan hijau WhatsApp.
 * Muncul setelah scroll 200px atau 1,5 detik; sembunyi saat elemen [data-hide-fab] (Footer CTA) terlihat. Di /contact tetap tampil (CTA footer disembunyikan di sana).
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  // Terikat ke pathname: otomatis tidak terblokir saat pindah halaman sampai observer melapor.
  const [blockedOn, setBlockedOn] = useState<string | null>(null);
  const blocked = blockedOn === pathname;

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    const onScroll = () => window.scrollY > 200 && setReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-hide-fab]");
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setBlockedOn(visible.size > 0 ? pathname : null);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <AnimatePresence>
      {ready && !blocked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={springSoft}
          className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-20 md:bottom-6 md:right-6"
        >
          <WhatsAppPill compact />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
