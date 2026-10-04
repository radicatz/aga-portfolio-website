import type { ReactNode } from "react";
import { HoverLine } from "./HoverLine";
import { Icon } from "./Icon";

type Props = {
  href: string;
  children: ReactNode;
  /** "right" = panah aksi (berputar ke ↗ saat hover). "left" = panah navigasi kembali (tidak berputar). */
  direction?: "right" | "left";
  className?: string;
};

/** Link teks dengan ikon panah Guidance dan garis bawah tumbuh. */
export function ArrowLink({ href, children, direction = "right", className = "" }: Props) {
  return (
    <HoverLine href={href} className={`group inline-flex items-center gap-3 ${className}`}>
      {direction === "left" && <Icon name="arrow-left" className="size-5" />}
      <span>{children}</span>
      {direction === "right" && <Icon name="arrow-right" className="arrow-ne size-5" />}
    </HoverLine>
  );
}
