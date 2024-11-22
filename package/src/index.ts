import type { AstroIntegration } from "astro";
import { name } from "../package.json";
import { MutableDataStore } from "../node_modules/astro/dist/content/mutable-data-store.js";
import { writeFileSync } from "node:fs";

// TODO: handle non existing collections
// TODO: handle collections param type when astro:content is not generated (see Erika tweet)
// TODO: handle types during build and sync (different location)

interface Options {
  collections: Array<import("astro:content").DataCollectionKey>;
}

export default function integration({
  collections,
}: Options): AstroIntegration {
  let dataStoreURL: URL;
  let isDev: boolean;
  let store: MutableDataStore;
  let dtsURL: URL;

  const loadStore = async () => {
    store = await MutableDataStore.fromFile(dataStoreURL);
  };

  const getDtsContent = (): string => {
    const obj: Record<string, Array<string>> = {};

    for (const id of collections) {
      obj[id] = [...(store.collections().get(id)?.keys() ?? [])];
    }

    return `declare module 'astro:content' {
  type _Collections = ${JSON.stringify(obj)};
  export type CollectionId<T extends keyof _Collections> = _Collections[T][number];
}`;
  };

  const syncTypes = () => {
    writeFileSync(dtsURL, getDtsContent(), "utf-8");
  };

  return {
    name,
    hooks: {
      "astro:config:setup": (params) => {
        isDev = params.command === "dev";
      },
      "astro:config:done": async (params) => {
        dataStoreURL = isDev
          ? new URL("./.astro/data-store.json", params.config.root)
          : new URL("./data-store.json", params.config.cacheDir);
        await loadStore();
        // In sync, it will always have an outdated type because the data store is updated
        // later than this hook
        dtsURL = params.injectTypes({
          filename: "types.d.ts",
          content: getDtsContent(),
        });
      },
      "astro:server:setup": ({ server }) => {
        syncTypes();
        server.watcher.on("all", async (eventName, path) => {
          if (!["change"].includes(eventName)) return;
          if (path === dataStoreURL.pathname) {
            await loadStore();
            syncTypes();
          }
        });
      },
      // We don't need to do anything in build
    },
  };
}
