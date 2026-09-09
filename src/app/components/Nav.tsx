const sections = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
] as const;

export function Nav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="page-width nav-inner">
        <a
          href="#top"
          className="wordmark"
          aria-label="Jeffery Patterson, back to top"
        >
          jp<span>.</span>
        </a>
        <div className="nav-links">
          {sections.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#contact" className="nav-contact">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
