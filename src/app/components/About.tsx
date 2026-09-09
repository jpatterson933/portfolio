import { portfolioData } from "@/app/data/portfolio";
import { SectionLabel } from "./SectionLabel";
import { ExternalLink } from "./ExternalLink";

export function About() {
  return (
    <section
      id="about"
      className="page-width section about-section"
      aria-labelledby="about-heading"
    >
      <div>
        <SectionLabel number="04">About</SectionLabel>
        <h2 id="about-heading">
          I like making
          <br />
          things work.
        </h2>
        <ExternalLink href={portfolioData.links.linkedin} className="text-link">
          More about my background
        </ExternalLink>
      </div>
      <div className="about-copy">
        {portfolioData.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="about-signoff">
          There’s usually another useful thing to build.
        </p>
      </div>
    </section>
  );
}
