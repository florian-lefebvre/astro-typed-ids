import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
	blog: defineCollection({
		loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/blog" }),
		schema: z.object({
			title: z.string(),
		}),
	}),
};
