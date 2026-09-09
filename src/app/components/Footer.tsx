import { portfolioData } from "@/app/data/portfolio";
import { ExternalLink } from "./ExternalLink";

export function Footer() {
  const { name, email, links } = portfolioData;
  return (
    <footer id="contact" className="site-footer">
      <div className="page-width">
        <div className="contact-row">
          <div>
            <p className="section-label">Have something in mind?</p>
            <h2>Let’s build something useful.</h2>
          </div>
          <ExternalLink
            href={`mailto:${email}`}
            className="button button-primary"
          >
            Get in touch <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {name}
          </p>
          <div className="footer-links">
            <ExternalLink href={links.github}>GitHub</ExternalLink>
            <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={links.npm}>npm</ExternalLink>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
