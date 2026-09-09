import type { Portfolio } from "@/app/data/schemas";
import { getTechnologyCounts } from "@/app/lib/projects";
import { CharacterStatsSchema } from "./schema";

const attributes = [
  { name: "Systems", category: "Platforms" },
  { name: "Intelligence", category: "AI & Agents" },
  { name: "Craft", category: "Developer Tools" },
  { name: "Automation", category: "Operations" },
  { name: "Analysis", category: "Data & Analytics" },
  { name: "Interface", category: "Websites" },
  { name: "Exploration", category: "Experiments" },
];

export function buildCharacterStats(portfolio: Portfolio) {
  const technologies = getTechnologyCounts(portfolio.projects);
  const counts = attributes.map((attribute) => ({
    ...attribute,
    count: portfolio.projects.filter(
      (project) => project.category === attribute.category,
    ).length,
  }));
  const maxCount = Math.max(1, ...counts.map((attribute) => attribute.count));
  return CharacterStatsSchema.parse({
    name: portfolio.name,
    title: portfolio.title,
    location: portfolio.location,
    projectCount: portfolio.projects.length,
    technologyCount: technologies.length,
    openSourceCount: portfolio.projects.filter(
      (project) => project.kind === "Open Source",
    ).length,
    attributes: counts.map((attribute) => ({
      ...attribute,
      progress: attribute.count / maxCount,
    })),
    equipment: technologies
      .slice(0, 6)
      .map(([name, count]) => ({ name, count })),
  });
}
