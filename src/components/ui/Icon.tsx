import { guidanceIcons, type IconName } from "./icons";

type Props = {
  name: IconName;
  className?: string;
};

/** Ikon Guidance (stroke tipis, mengikuti currentColor). Dekoratif: label teks ada di elemen induk. */
export function Icon({ name, className = "size-5" }: Props) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`shrink-0 overflow-visible ${className}`} fill="none" stroke="currentColor">
      <path d={guidanceIcons[name]} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * WhatsApp digambar ulang bergaya Guidance (Guidance tidak punya ikon WhatsApp):
 * gelembung bulat dengan ekor kiri bawah, dan gagang telepon Guidance yang dipusatkan di dalamnya.
 */
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`shrink-0 overflow-visible ${className}`} fill="none" stroke="currentColor" strokeLinejoin="round">
      <path d="M12 1.5a10.5 10.5 0 1 1-5.27 19.59L1.5 22.5l1.41-5.23A10.5 10.5 0 0 1 12 1.5z" vectorEffect="non-scaling-stroke" />
      {/* Telepon Guidance (kotak 1–23) diskalakan 0.46 dan dipusatkan di (12, 12). */}
      <path d={guidanceIcons.phone} transform="translate(6.25 6.71) scale(0.46)" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
