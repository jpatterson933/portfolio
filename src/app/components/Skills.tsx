import { portfolioData } from "@/app/data/portfolio";
import { getTechnologyCounts } from "@/app/lib/projects";
import { SectionLabel } from "./SectionLabel";

const technologyGroups = [
  {
    name: "Languages",
    tags: ["TypeScript", "JavaScript", "Python", "C#", "HTML", "CSS"],
  },
  {
    name: "Interfaces & experiences",
    tags: [
      "React",
      "Next.js",
      "Astro",
      "Vite",
      "Electron",
      "Capacitor",
      "CodeMirror",
      "Nextra",
      "Nullstack",
      "Three.js",
      "Framer Motion",
      "Phaser",
      "PixiJS",
      "HTML5 Canvas",
      "Recharts",
      "Chart.js",
    ],
  },
  {
    name: "Backend & data",
    tags: [
      "Node.js",
      "Express",
      "Fastify",
      "FastAPI",
      "ASP.NET Core",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Drizzle ORM",
      "Prisma",
      "SQLAlchemy",
      "Redis",
      "BullMQ",
      "pgvector",
      "SignalR",
    ],
  },
  {
    name: "AI & automation",
    tags: [
      "OpenAI",
      "Anthropic",
      "Google Gemini",
      "Perplexity",
      "LangChain",
      "Claude Agent SDK",
      "Claude Plugins",
      "MCP",
      "Composio",
      "PyTorch",
      "Transformers",
      "NLP",
      "scikit-learn",
      "NumPy",
      "Pandas",
    ],
  },
  {
    name: "Services & integrations",
    tags: [
      "OAuth",
      "Clerk",
      "Stripe",
      "AWS",
      "Azure",
      "GCP",
      "HubSpot",
      "Apollo",
      "Jira",
      "Figma",
      "Svix",
      "Google Docs API",
      "Google Drive API",
      "Google Sheets API",
      "Google Workspace API",
      "Gmail API",
      "Google Trends",
      "Google Search Console API",
      "Cloudflare API",
      "Slack API",
      "Linear API",
      "Kayako API",
      "Airtable API",
      "GitHub API",
    ],
  },
];

export function Skills() {
  const counts = getTechnologyCounts(portfolioData.projects);
  const assigned = new Set(technologyGroups.flatMap((group) => group.tags));
  const groups = [
    ...technologyGroups,
    {
      name: "Tooling & standards",
      tags: counts.map(([tag]) => tag).filter((tag) => !assigned.has(tag)),
    },
  ];
  return (
    <section
      id="skills"
      className="page-width section"
      aria-labelledby="skills-heading"
    >
      <SectionLabel number="03">Technologies</SectionLabel>
      <div className="section-heading">
        <h2 id="skills-heading">Across the stack.</h2>
        <p>
          Technologies used in the projects above.
          <br />
          Numbers show how many projects use each.
        </p>
      </div>
      <div className="skills-grid">
        {groups.map((group, index) => (
          <div className="skill-group" key={group.name}>
            <div className="skill-heading">
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{group.name}</h3>
            </div>
            <ul className="skill-tags">
              {counts
                .filter(([tag]) => group.tags.includes(tag))
                .map(([tag, count]) => (
                  <li key={tag}>
                    {tag}
                    <span aria-label={`${count} projects`}>{count}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
