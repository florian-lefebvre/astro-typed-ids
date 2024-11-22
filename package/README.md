# `astro-typed-ids`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) to get typeds ids for Content Layer entries, matching Astro 4 behavior.

## Usage

### Prerequisites

TODO:

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
+import integration from "astro-typed-ids";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

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
