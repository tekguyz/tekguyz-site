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
  test: {
    /**
     * `.claude/worktrees/` holds full checkouts of this same repo, so every
     * test file in it is a duplicate of one in the tree. Vitest's default
     * exclude does not cover it, and `check:claude` measured 214 cases across
     * 10 files against `CLAUDE.md`'s correct 107 across 5 — a guard failing on
     * a figure that was never wrong. Vitest replaces `exclude` rather than
     * merging it, so the defaults are restated here.
     */
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/.next/**',
      '**/.claude/worktrees/**',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
