import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/blog" }),
    schema: z.object({
      title: z.string(),
    }),
  }),
};
