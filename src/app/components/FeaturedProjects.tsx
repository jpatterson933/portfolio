import { portfolioData } from "@/app/data/portfolio";
import { ProjectCard } from "./ProjectCard";
import { SectionLabel } from "./SectionLabel";

export function FeaturedProjects() {
  return (
    <section className="page-width section" aria-labelledby="featured-heading">
      <SectionLabel number="01">Selected work</SectionLabel>
      <div className="section-heading">
        <h2 id="featured-heading">A few places to start.</h2>
        <p>
          Products, platforms, and tools
          <br className="desktop-break" /> from across my work.
        </p>
      </div>
      <div className="featured-grid">
        {portfolioData.projects
          .filter((project) => project.featured)
          .map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured
              index={index}
            />
          ))}
      </div>
    </section>
  );
}
