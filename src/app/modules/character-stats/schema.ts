import { z } from "zod";

export const CharacterStatsSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  projectCount: z.number().int().nonnegative(),
  technologyCount: z.number().int().nonnegative(),
  openSourceCount: z.number().int().nonnegative(),
  attributes: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      count: z.number().int().nonnegative(),
      progress: z.number().min(0).max(1),
    }),
  ),
  equipment: z.array(
    z.object({ name: z.string(), count: z.number().int().nonnegative() }),
  ),
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;
