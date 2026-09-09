"use client";

import { useState } from "react";
import type { Project } from "@/app/data/schemas";
import { projectCategories, projectKinds } from "@/app/data/schemas";
import {
  defaultFilters,
  filterProjects,
  getTechnologyCounts,
  type ProjectFilters,
} from "@/app/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionLabel } from "./SectionLabel";

const PAGE_SIZE = 12;

export function Projects({ projects }: { projects: Project[] }) {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const results = filterProjects(projects, filters);
  const technologies = getTechnologyCounts(projects)
    .map(([tag]) => tag)
    .sort((a, b) => a.localeCompare(b));
  const activeFilters =
    filters.query !== "" ||
    filters.category !== "All" ||
    filters.kind !== "All" ||
    filters.technology !== "All";

  function updateFilters(next: Partial<ProjectFilters>) {
    setFilters((current) => ({ ...current, ...next }));
    setVisibleCount(PAGE_SIZE);
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section
      id="projects"
      className="page-width section"
      aria-labelledby="projects-heading"
    >
      <SectionLabel number="02">Project directory</SectionLabel>
      <div className="section-heading">
        <h2 id="projects-heading">The broader picture.</h2>
        <p>
          Explore {projects.length} projects, from shared platforms
          <br className="desktop-break" /> to personal experiments.
        </p>
      </div>
      <div className="project-controls">
        <div className="search-field">
          <label htmlFor="project-search">Search projects</label>
          <div className="input-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              id="project-search"
              type="search"
              placeholder="Try MCP, education, Python…"
              value={filters.query}
              onChange={(event) => updateFilters({ query: event.target.value })}
            />
          </div>
        </div>
        <div className="select-field">
          <label htmlFor="project-kind">Project type</label>
          <select
            id="project-kind"
            value={filters.kind}
            onChange={(event) =>
              updateFilters({
                kind: event.target.value as ProjectFilters["kind"],
              })
            }
          >
            <option value="All">All types</option>
            {projectKinds.map((kind) => (
              <option key={kind}>{kind}</option>
            ))}
          </select>
        </div>
        <div className="select-field">
          <label htmlFor="project-technology">Technology</label>
          <select
            id="project-technology"
            value={filters.technology}
            onChange={(event) =>
              updateFilters({ technology: event.target.value })
            }
          >
            <option value="All">All technologies</option>
            {technologies.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="category-filters"
        role="group"
        aria-label="Project category"
      >
        {(["All", ...projectCategories] as const).map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filters.category === category}
            onClick={() => updateFilters({ category })}
          >
            {category}
            <span>
              {category === "All"
                ? projects.length
                : projects.filter((project) => project.category === category)
                    .length}
            </span>
          </button>
        ))}
      </div>
      <div className="results-summary">
        <p role="status" aria-live="polite">
          {results.length === 0
            ? "No matching projects"
            : `Showing ${Math.min(visibleCount, results.length)} of ${results.length} projects`}
        </p>
        {activeFilters && (
          <button type="button" className="text-button" onClick={resetFilters}>
            Clear filters <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      {results.length > 0 ? (
        <div className="project-grid">
          {results.slice(0, visibleCount).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No projects found.</h3>
          <p>Try a broader search or clear a filter to explore more work.</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={resetFilters}
          >
            Show all projects
          </button>
        </div>
      )}
      {visibleCount < results.length && (
        <div className="load-more">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Show more projects <span aria-hidden="true">↓</span>
          </button>
          <span>{results.length - visibleCount} more to explore</span>
        </div>
      )}
    </section>
  );
}
