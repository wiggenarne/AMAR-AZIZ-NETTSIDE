import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artworks" }),
  schema: z.object({
    title: z.object({ no: z.string(), en: z.string() }),
    image: z.string(),
    width_cm: z.number(),
    height_cm: z.number(),
    depth_cm: z.number().optional(),
    medium: z.object({ no: z.string(), en: z.string() }),
    year: z.number(),
    series: reference("series").optional(),
    description: z.object({ no: z.string(), en: z.string() }),
    available: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/series" }),
  schema: z.object({
    title: z.object({ no: z.string(), en: z.string() }),
    statement: z.object({ no: z.string(), en: z.string() }),
    cover: z.string().optional(),
    order: z.number().default(0),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/exhibitions" }),
  schema: z.object({
    title: z.object({ no: z.string(), en: z.string() }),
    venue: z.string(),
    city: z.string(),
    country: z.string().default("Norway"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    type: z.enum(["solo", "group"]).default("group"),
    link: z.string().url().optional(),
  }),
});

export const collections = { artworks, series, exhibitions };
