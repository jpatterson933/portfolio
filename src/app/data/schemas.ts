import { z } from "zod";

export const projectCategories = [
  "Platforms",
  "AI & Agents",
  "Developer Tools",
  "Operations",
  "Data & Analytics",
  "Websites",
  "Experiments",
] as const;

export const projectKinds = [
  "Product",
  "Open Source",
  "Internal Tool",
  "Personal Tool",
  "Prototype",
  "Website",
  "Experiment",
  "Writing",
] as const;

const publicUrl = z.url().refine((value) => value.startsWith("https://"), {
  message: "Project links must use HTTPS",
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(projectCategories),
  kind: z.enum(projectKinds),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  featured: z.boolean(),
  caseStudyUrl: publicUrl.optional(),
  githubUrl: publicUrl.optional(),
  websiteUrl: publicUrl.optional(),
  docsUrl: publicUrl.optional(),
  npmUrl: publicUrl.optional(),
  version: z.string().optional(),
});

export const PortfolioSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  email: z.email(),
  bio: z.string().min(1),
  headline: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  links: z.object({ github: publicUrl, linkedin: publicUrl, npm: publicUrl }),
  projects: z
    .array(ProjectSchema)
    .min(1)
    .superRefine((projects, context) => {
      const slugs = new Set<string>();
      projects.forEach((project, index) => {
        if (slugs.has(project.slug)) {
          context.addIssue({
            code: "custom",
            message: "Project slugs must be unique",
            path: [index, "slug"],
          });
        }
        slugs.add(project.slug);
        if (new Set(project.tags).size !== project.tags.length) {
          context.addIssue({
            code: "custom",
            message: "Project technologies must be unique",
            path: [index, "tags"],
          });
        }
      });
    }),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type ProjectCategory = Project["category"];
export type ProjectKind = Project["kind"];
