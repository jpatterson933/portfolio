import { portfolioData } from "@/app/data/portfolio";
import { SectionLabel } from "./SectionLabel";

const tagCategories: Record<string, string> = {
  TypeScript: "Languages",
  JavaScript: "Languages",
  Python: "Languages",
  "C#": "Languages",

  React: "Frontend",
  "Next.js": "Frontend",
  "Tailwind CSS": "Frontend",
  "HTML5 Canvas": "Frontend",
  "Radix UI": "Frontend",
  "TanStack Router": "Frontend",
  "TanStack Query": "Frontend",
  Electron: "Frontend",
  Capacitor: "Frontend",

  "Node.js": "Backend & Data",
  Express: "Backend & Data",
  "Express.js": "Backend & Data",
  "ASP.NET Core": "Backend & Data",
  ".NET 9": "Backend & Data",
  Starlette: "Backend & Data",
  Uvicorn: "Backend & Data",
  PostgreSQL: "Backend & Data",
  MongoDB: "Backend & Data",
  Redis: "Backend & Data",
  pgvector: "Backend & Data",
  "Drizzle ORM": "Backend & Data",
  Prisma: "Backend & Data",
  "Entity Framework Core": "Backend & Data",
  BullMQ: "Backend & Data",
  SignalR: "Backend & Data",
  MinIO: "Backend & Data",
  "AWS S3": "Backend & Data",
  "REST API": "Backend & Data",
  GraphQL: "Backend & Data",

  OpenAI: "AI & ML",
  "OpenAI API": "AI & ML",
  Anthropic: "AI & ML",
  "Anthropic API": "AI & ML",
  "Google Gemini": "AI & ML",
  LangChain: "AI & ML",
  Perplexity: "AI & ML",
  "Perplexity AI": "AI & ML",
  NLP: "AI & ML",
  compromise: "AI & ML",
  "scikit-learn": "AI & ML",
  NumPy: "AI & ML",
  Pandas: "AI & ML",
  Pydantic: "AI & ML",

  Docker: "Cloud & DevOps",
  AWS: "Cloud & DevOps",
  Azure: "Cloud & DevOps",
  GCP: "Cloud & DevOps",
  Railway: "Cloud & DevOps",
  Heroku: "Cloud & DevOps",
  "GitHub Actions": "Cloud & DevOps",
  Turborepo: "Cloud & DevOps",
  Sentry: "Cloud & DevOps",
  k6: "Cloud & DevOps",
  Grafana: "Cloud & DevOps",
  Pino: "Cloud & DevOps",
  Serilog: "Cloud & DevOps",

  MCP: "APIs & Services",
  "MCP SDK": "APIs & Services",
  OAuth: "APIs & Services",
  "OAuth 2.0": "APIs & Services",
  "JWT/OAuth2": "APIs & Services",
  "Twitter API": "APIs & Services",
  "Bluesky / AT Protocol": "APIs & Services",
  "Google Drive API": "APIs & Services",
  "Google Docs API": "APIs & Services",
  "Google Search Console API": "APIs & Services",
  "Cloudflare Analytics API": "APIs & Services",
  "Google OAuth": "APIs & Services",
  "Google Trends": "APIs & Services",
  "Linear API": "APIs & Services",
  Svix: "APIs & Services",
  "Apollo.io": "APIs & Services",
  Apollo: "APIs & Services",
  HubSpot: "APIs & Services",
  Stripe: "APIs & Services",
  Clerk: "APIs & Services",
  Resend: "APIs & Services",
  "Lighthouse CI": "APIs & Services",
  "PageSpeed Insights": "APIs & Services",
};

const FALLBACK_CATEGORY = "Tooling & Standards";

const categoryOrder = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "AI & ML",
  "Cloud & DevOps",
  "APIs & Services",
  FALLBACK_CATEGORY,
];

const categoryAccents: Record<string, string> = {
  Languages: "border-l-blue-400",
  Frontend: "border-l-violet-400",
  "Backend & Data": "border-l-emerald-400",
  "AI & ML": "border-l-rose-400",
  "Cloud & DevOps": "border-l-amber-400",
  "APIs & Services": "border-l-sky-400",
  [FALLBACK_CATEGORY]: "border-l-zinc-400",
};

export function Skills() {
  const tagCounts = new Map<string, number>();
  for (const project of portfolioData.projects) {
    for (const tag of project.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const grouped = new Map<string, string[]>();
  for (const name of categoryOrder) {
    grouped.set(name, []);
  }

  for (const tag of tagCounts.keys()) {
    const category = tagCategories[tag] ?? FALLBACK_CATEGORY;
    grouped.get(category)!.push(tag);
  }

  for (const tags of grouped.values()) {
    tags.sort((a, b) => (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0));
  }

  const categories = categoryOrder
    .map((name) => ({
      name,
      accent: categoryAccents[name],
      tags: grouped.get(name) ?? [],
    }))
    .filter((c) => c.tags.length > 0);

  return (
    <section
      id="skills"
      className="px-6 py-16 max-w-5xl mx-auto border-t border-zinc-800/50"
    >
      <SectionLabel>Technologies</SectionLabel>
      <p className="text-sm text-zinc-500 mt-2 font-mono">
        {tagCounts.size} technologies across {portfolioData.projects.length}{" "}
        projects
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`border-l-2 ${category.accent} bg-zinc-900/20 rounded-r-lg pl-4 pr-3 py-4`}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
              {category.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className="group px-2.5 py-1 text-xs font-mono rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-all duration-200"
                >
                  {tag}
                  <span className="ml-1.5 text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {tagCounts.get(tag)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
