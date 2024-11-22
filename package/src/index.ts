import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import { name } from "../package.json";
import { MutableDataStore } from "../node_modules/astro/dist/content/mutable-data-store.js";
import { writeFileSync } from "node:fs";

interface Options {
  collections: Array<import("astro:content").DataCollectionKey>;
}

const createUtils = ({
  logger,
  isDev,
  collections,
}: {
  logger: AstroIntegrationLogger;
  isDev: boolean;
  collections: Array<string>;
}) => {
  let dataStoreURL: URL;
  let store: MutableDataStore;
  let dtsURL: URL;

  return {
    init: async ({ config, dts }: { config: AstroConfig; dts: URL }) => {
      dataStoreURL = isDev
        ? new URL("./.astro/data-store.json", config.root)
        : new URL("./data-store.json", config.cacheDir);
      dtsURL = dts;
    },
    updateStore: async () => {
      store = await MutableDataStore.fromFile(dataStoreURL);
    },
    shouldSync: (path: string) => {
      return path === dataStoreURL.pathname;
    },
    sync: () => {
      const obj: Record<string, Array<string>> = {};

      for (const id of collections) {
        const collection = store.collections().get(id);
        if (collection) {
          const keys = Array.from(collection.keys());
          obj[id] = keys;
          if (keys.length > 200) {
            logger.warn(
              `Collection "${id}" has more than 200 entries. The integration is supposed to be used for manual usages, it could affect performance`
            );
          }
        } else {
          logger.warn(`Collection "${id}" does not exist`);
        }
      }

      const content = `declare module 'astro:content' {
  type _Collections = ${JSON.stringify(obj)};
  export type CollectionId<T extends keyof _Collections> = _Collections[T][number];
}`;

      writeFileSync(dtsURL, content, "utf-8");
    },
  };
};

type Utils = ReturnType<typeof createUtils>;

export default function integration({
  collections,
}: Options): AstroIntegration {
  let utils: Utils;

  return {
    name,
    hooks: {
      "astro:config:setup": ({ command, logger }) => {
        utils = createUtils({
          isDev: command === "dev",
          logger,
          collections,
        });
      },
      "astro:config:done": async (params) => {
        await utils.init({
          config: params.config,
          // In sync, it will always have an outdated type because the data store is updated
          // later than this hook
          dts: params.injectTypes({
            filename: "types.d.ts",
            content: "",
          }),
        });
        await utils.updateStore();
      },
      "astro:server:setup": ({ server }) => {
        utils.sync();
        server.watcher.on("change", async (path) => {
          if (utils.shouldSync(path)) {
            await utils.updateStore();
            utils.sync();
          }
        });
      },
      // We don't need to do anything in build
    },
  };
}
