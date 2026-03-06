import { portfolioData } from "@/app/data/portfolio";
import { SectionLabel } from "./SectionLabel";

export function About() {
  return (
    <section id="about" className="px-6 py-16 max-w-5xl mx-auto border-t border-zinc-800/50">
      <SectionLabel>About</SectionLabel>
      <p className="text-xl text-zinc-300 leading-relaxed mt-4">
        {portfolioData.bio}
      </p>
    </section>
  );
}
