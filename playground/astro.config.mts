import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: typedIds } = await import("astro-typed-ids");

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		typedIds({ collections: ["blog"] }),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
