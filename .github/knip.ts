import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/main.ts", "src/worker.ts"],
  project: ["src/**/*.ts"],
  ignore: ["**/__mocks__/**", "**/__fixtures__/**", "src/types/database.ts"],
  ignoreExportsUsedInFile: true,
  // eslint can also be safely ignored as per the docs: https://knip.dev/guides/handling-issues#eslint--jest
  ignoreDependencies: ["eslint-config-prettier", "eslint-plugin-prettier", "@mswjs/data", "ts-node", "hono"],
  eslint: true,
};

export default config;
