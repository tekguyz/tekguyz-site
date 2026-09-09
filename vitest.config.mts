import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * The only reason this file exists: `@/*` is a tsconfig path, and tsconfig
 * paths are a type-checker feature — Vitest resolves modules itself and knows
 * nothing about them. Every test before 2026-09-08 imported relatively, so the
 * gap stayed invisible until `lib/status.test.ts` needed a module that reaches
 * for `@/content/work` internally. Keep this mapping in step with
 * `tsconfig.json`'s `paths`.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
