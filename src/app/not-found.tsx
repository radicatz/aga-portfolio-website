import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { HoverLine } from "@/components/ui/HoverLine";
import { notFound } from "@/content/pages";

export default function NotFound() {
  return (
    <div className="container-site py-section">
      <SplitTextReveal text={notFound.title} className="text-display max-w-[14ch]" />
      <p className="text-body mt-8 max-w-md text-muted">{notFound.text}</p>
      <p className="text-label mt-10">
        <HoverLine href="/works">{notFound.cta.toUpperCase()} →</HoverLine>
      </p>
    </div>
  );
}
