import Image from "next/image";
import { portfolioData } from "@/app/data/portfolio";
import { projectCategories } from "@/app/data/schemas";
import { ExternalLink } from "./ExternalLink";

export function Hero() {
  const { name, title, location, bio, headline, links, projects } =
    portfolioData;
  return (
    <header className="hero page-width" id="top">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" />
          {title} / {location}
        </p>
        <h1>
          {name}
          <span>{headline}</span>
        </h1>
        <p className="hero-bio">{bio}</p>
        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            Explore the work <span aria-hidden="true">↓</span>
          </a>
          <ExternalLink href={links.github} className="button button-secondary">
            GitHub
          </ExternalLink>
        </div>
      </div>
      <div className="profile-panel">
        <div className="profile-top">
          <span className="eyebrow">The person behind the projects</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div className="profile-person">
          <Image
            src="/profile_pic.jpg"
            alt="Jeffery Patterson"
            width={88}
            height={88}
            priority
            className="profile-image"
          />
          <div>
            <p className="profile-name">Jeffery Patterson</p>
            <p className="muted">Software Engineer at AE Studio</p>
          </div>
        </div>
        <div className="profile-line">
          <span>Based in</span>
          <span>Los Angeles, CA</span>
        </div>
        <div className="profile-line">
          <span>Across the stack</span>
          <span>Systems → interfaces</span>
        </div>
        <div className="profile-stats">
          <div>
            <strong>{projects.length}</strong>
            <span>projects & tools</span>
          </div>
          <div>
            <strong>{projectCategories.length}</strong>
            <span>areas of work</span>
          </div>
          <div>
            <strong>
              {projects.filter((p) => p.kind === "Open Source").length}
            </strong>
            <span>open source projects</span>
          </div>
        </div>
        <p className="profile-note">
          Data platforms. Useful integrations.
          <br />
          Small tools with a reason to exist.
        </p>
      </div>
    </header>
  );
}
