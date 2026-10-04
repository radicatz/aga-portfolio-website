import type { Metadata } from "next";
import { WorksView } from "@/components/works/WorksView";
import { works } from "@/content/pages";

export const metadata: Metadata = {
  title: works.title,
  description: works.intro,
};

export default function WorksPage() {
  return <WorksView />;
}
