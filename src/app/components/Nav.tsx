const sections = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
] as const;

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-bold font-mono text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          JP
        </a>
        <div className="flex gap-6">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
