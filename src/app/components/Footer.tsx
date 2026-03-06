import { portfolioData } from "@/app/data/portfolio";

export function Footer() {
  const { name, email, links } = portfolioData;

  return (
    <footer className="px-6 py-16 border-t border-zinc-800 mt-12">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm font-mono text-zinc-600">{name}</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-mono text-zinc-500">
          <FooterLink href={links.github} label="GitHub" />
          <FooterLink href={links.linkedin} label="LinkedIn" />
          <FooterLink href={links.npm} label="npm" />
          <FooterLink href={`mailto:${email}`} label="Email" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="hover:text-zinc-300 transition-colors"
    >
      {label}
    </a>
  );
}
