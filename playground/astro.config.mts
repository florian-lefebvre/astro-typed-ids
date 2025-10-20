import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";

const { default: typedIds } = await import("astro-typed-ids");

// https://astro.build/config
export default defineConfig({
  integrations: [
    typedIds({ collections: ["blog"] }),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve(
        "../packages/astro-typed-ids/dist"
      ),
    }),
  ],
  vite: {
    plugins: [
      // @ts-ignore
      tailwindcss(),
    ],
  },
});
