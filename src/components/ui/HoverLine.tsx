import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Menampilkan garis penuh secara permanen (tab/halaman aktif). */
  active?: boolean;
  children: ReactNode;
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Link teks dengan garis bawah yang tumbuh dari kiri saat hover/fokus. Dipakai di nav, footer, tab, dan tombol teks. */
export function HoverLine({ href, active, className = "", children, ...rest }: Props) {
  const classes = `hover-line ${className}`.trim();

  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        data-active={active ? "true" : undefined}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} data-active={active ? "true" : undefined} {...rest}>
      {children}
    </Link>
  );
}
