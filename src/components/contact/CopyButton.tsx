"use client";

import { useState } from "react";

type Props = { value: string; label: string; copiedLabel: string };

/** Tombol salin teks ke clipboard; label berubah sebentar menjadi konfirmasi. */
export function CopyButton({ value, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard tidak tersedia: abaikan, pengguna masih bisa memakai tautan mailto.
    }
  };

  return (
    <button type="button" onClick={copy} className="hover-line text-label text-muted hover:text-fg" aria-live="polite">
      {copied ? copiedLabel : label}
    </button>
  );
}
