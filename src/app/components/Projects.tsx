import { portfolioData } from "@/app/data/portfolio";
import { type Project } from "@/app/data/schemas";
import { SectionLabel } from "./SectionLabel";

export function Projects() {
  return (
    <section id="projects" className="px-6 py-16 max-w-5xl mx-auto">
      <SectionLabel>Projects</SectionLabel>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioData.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const accentClasses = project.accent
    ? `bg-gradient-to-b ${project.accent}`
    : "bg-zinc-900/40 border-zinc-800";

  return (
    <div
      className={`flex flex-col gap-4 p-5 rounded-xl border ${accentClasses} hover:brightness-110 transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project.accentDot && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${project.accentDot}`}
            />
          )}
          {project.note && (
            <span className="text-xs font-mono text-zinc-500">
              {project.note}
            </span>
          )}
        </div>
        {project.version && (
          <span className="text-xs font-mono text-zinc-600">
            v{project.version}
          </span>
        )}
      </div>

      <h4 className="text-base font-bold font-mono text-zinc-50 leading-snug tracking-tight">
        {project.name}
      </h4>

      <p className="text-xs text-zinc-400 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 pt-1 border-t border-white/5">
        {project.caseStudyUrl && (
          <ProjectLink href={project.caseStudyUrl} label="Case Study" />
        )}
        {project.githubUrl && (
          <ProjectLink href={project.githubUrl} label="GitHub" />
        )}
        {project.websiteUrl && (
          <ProjectLink href={project.websiteUrl} label="Website" />
        )}
        {project.docsUrl && <ProjectLink href={project.docsUrl} label="Docs" />}
        {project.npmUrl && <ProjectLink href={project.npmUrl} label="npm" />}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 text-xs font-mono rounded-sm bg-black/30 text-zinc-400 border border-white/5">
      {children}
    </span>
  );
}

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      {label} →
    </a>
  );
}
