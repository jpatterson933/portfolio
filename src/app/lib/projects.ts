import type { Project, ProjectCategory, ProjectKind } from "@/app/data/schemas";

export type ProjectFilters = {
  query: string;
  category: ProjectCategory | "All";
  kind: ProjectKind | "All";
  technology: string;
};

export const defaultFilters: ProjectFilters = {
  query: "",
  category: "All",
  kind: "All",
  technology: "All",
};

export function filterProjects(projects: Project[], filters: ProjectFilters) {
  const terms = filters.query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return projects.filter((project) => {
    const searchable = [
      project.name,
      project.description,
      project.category,
      project.kind,
      ...project.tags,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      terms.every((term) => searchable.includes(term)) &&
      (filters.category === "All" || project.category === filters.category) &&
      (filters.kind === "All" || project.kind === filters.kind) &&
      (filters.technology === "All" ||
        project.tags.includes(filters.technology))
    );
  });
}

export function getTechnologyCounts(projects: Project[]) {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getProjectLinks(project: Project) {
  return [
    { href: project.websiteUrl, label: "Website" },
    { href: project.caseStudyUrl, label: "Case study" },
    { href: project.githubUrl, label: "GitHub" },
    { href: project.docsUrl, label: "Docs" },
    { href: project.npmUrl, label: "npm" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );
}
