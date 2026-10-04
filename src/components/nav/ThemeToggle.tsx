"use client";

import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { useMounted } from "@/lib/useMounted";

const options = [
  { value: "light", label: "LIGHT" },
  { value: "dark", label: "DARK" },
] as const;

/** Toggle LIGHT / DARK. Pilihan disimpan oleh next-themes; perpindahan dianimasikan dengan View Transitions bila tersedia. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const change = (next: string) => {
    if (next === resolvedTheme) return;
    const apply = () => flushSync(() => setTheme(next));
    const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (start && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      start.call(document, apply);
    } else {
      apply();
    }
  };

  return (
    <div className={`flex items-center gap-3 text-label ${className}`} role="group" aria-label="Tema tampilan">
      {options.map((o, i) => (
        <span key={o.value} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-muted">/</span>}
          <button
            type="button"
            onClick={() => change(o.value)}
            aria-pressed={mounted ? resolvedTheme === o.value : undefined}
            data-active={mounted && resolvedTheme === o.value ? "true" : undefined}
            className="hover-line"
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  );
}
