import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  accent: z.string().optional(),
  accentDot: z.string().optional(),
  note: z.string().optional(),
  caseStudyUrl: z.url().nullable().optional(),
  githubUrl: z.url().nullable().optional(),
  websiteUrl: z.url().nullable().optional(),
  docsUrl: z.url().nullable().optional(),
  npmUrl: z.url().nullable().optional(),
  version: z.string().nullable().optional(),
});

export const PortfolioSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.email(),
  bio: z.string(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    npm: z.url(),
  }),
  projects: z.array(ProjectSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
