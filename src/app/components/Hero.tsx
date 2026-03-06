import { portfolioData } from "@/app/data/portfolio";
import Image from "next/image";

export function Hero() {
  const { name, title, location, bio, email, links } = portfolioData;

  return (
    <header className="px-6 py-12 border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-700 shrink-0">
          <Image
            src="/profile_pic.jpg"
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-3 text-center sm:text-left flex-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              {name}
            </h1>
            <p className="text-sm text-zinc-400 font-mono">
              {title} · {location}
            </p>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            {bio}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
            <HeroLink href={links.github} label="GitHub" />
            <HeroLink href={links.linkedin} label="LinkedIn" />
            <HeroLink href={links.npm} label="npm" />
            <HeroLink href={`mailto:${email}`} label="Email" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="px-3 py-1 text-xs font-mono border border-zinc-700 rounded text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
    >
      {label}
    </a>
  );
}
