import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

export const collections = {
  projects,
};
