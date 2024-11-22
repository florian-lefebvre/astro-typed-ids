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
  let root: URL;
  let store: MutableDataStore;
  let dtsURL: URL;

  const getDataStoreURL = () => new URL("./.astro/data-store.json", root);

  const loadStore = async () => {
    store = await MutableDataStore.fromFile(getDataStoreURL());
  };

  const syncTypes = () => {
    const obj: Record<string, Array<string>> = {};

    for (const id of collections) {
      obj[id] = [...(store.collections().get(id)?.keys() ?? [])];
    }

    writeFileSync(
      dtsURL,
      `declare module 'astro:content' {
  type _Collections = ${JSON.stringify(obj)};
  export type CollectionId<T extends keyof _Collections> = _Collections[T][number];
}`,
      "utf-8"
    );
  };

  return {
    name,
    hooks: {
      "astro:config:setup": async (params) => {
        root = params.config.root;
        await loadStore();
      },
      "astro:config:done": (params) => {
        dtsURL = params.injectTypes({ filename: "types.d.ts", content: "" });
      },
      "astro:server:setup": ({ server }) => {
        syncTypes();
        server.watcher.on("all", async (eventName, path) => {
          if (!["change"].includes(eventName)) return;
          if (path === getDataStoreURL().pathname) {
            await loadStore();
            syncTypes();
          }
        });
      },
    },
  };
}
