import type { Project } from "@/app/data/schemas";
import { getProjectLinks } from "@/app/lib/projects";
import { ExternalLink } from "./ExternalLink";

export function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: Project;
  featured?: boolean;
  index?: number;
}) {
  const links = getProjectLinks(project);
  return (
    <article
      className={`project-card${featured ? " featured-card" : ""}`}
      data-category={project.category}
      data-project={project.slug}
    >
      <div className="card-meta">
        <span className="project-kind">
          <span className="category-dot" />
          {project.kind}
        </span>
        {featured && (
          <span className="card-index">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3>{project.name}</h3>
      <p className="project-description">{project.description}</p>
      <ul className="project-tags" aria-label={`${project.name} technologies`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="card-footer">
        {links.length > 0 ? (
          <div className="project-links">
            {links.map(({ href, label }) => (
              <ExternalLink key={label} href={href}>
                {label}
              </ExternalLink>
            ))}
          </div>
        ) : (
          <span className="muted">{project.category}</span>
        )}
        {project.version && (
          <span
            className="project-version"
            title="Version in the reviewed repository"
          >
            v{project.version}
          </span>
        )}
      </div>
    </article>
  );
}
