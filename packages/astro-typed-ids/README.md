# `astro-typed-ids`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) to get typed ids for Content Layer entries, matching Astro 4 behavior.

## Background

In Astro 4, ids/slugs of content entries where stricter by default. While it's convenient for manual usages, it impacted performance on bigger collections. So the team decided to make the types a bit more loose, ids now are typed as `string`.

To make transitioning to the Content Layer easier, or if you want this behavior for some more manual usage (please use it on small datasets only!), this integration is for you.

## Migrating from legacy Content Collections

```diff
// astro.config.mjs
+import typedIds from "astro-typed-ids"

export default defineConfig({
  integrations: [
+    typedIds({ collections: ["blog"] }),
  ],
})

// some file
import {
-  CollectionEntry
+  CollectionId
} from "astro:content"

interface Props {
-  id: CollectionEntry<"blog">["slug"] // string
+  id: CollectionId<"blog"> // "foo" | "bar" | "..."
}
```

## Usage

### Prerequisites

- Astro `>= 5.0.0-beta.10`
- You must be using the Content Layer (ie. not having the `legacy.collections` flag enabled, nor having collections defined without a `loader`)

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-typed-ids
```

```bash
npx astro add astro-typed-ids
```

```bash
yarn astro add astro-typed-ids
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-typed-ids
```

```bash
npm install astro-typed-ids
```

```bash
yarn add astro-typed-ids
```

2. Add the integration to your astro config

```diff
+import typedIds from "astro-typed-ids";

export default defineConfig({
  integrations: [
+    typedIds(),
  ],
});
```

### Configuration

The integration has one required `collections` options. It accepts an array of collections names.

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-typed-ids/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/florian-lefebvre).
