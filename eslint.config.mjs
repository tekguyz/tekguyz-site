import next from 'eslint-config-next';

/**
 * `bun run lint` was broken repo-wide for a simple reason: there was no config
 * file of any kind. ESLint 9 defaults to flat config and looks for
 * `eslint.config.*`; with no `.eslintrc.*` either, it exited before linting a
 * single file. `eslint-config-next` was installed the whole time and had never
 * run.
 *
 * `eslint-config-next` 16 ships a native flat config as its default export, so
 * it is imported directly. It is NOT loadable through FlatCompat — that path
 * throws "Converting circular structure to JSON" inside the eslintrc validator,
 * because the flat array it exports isn't eslintrc-shaped in the first place.
 *
 * What this does and does not catch — worth stating, because the defects that
 * motivated turning it on were CSS-semantic, and it catches only one of them:
 *   - Missing React `key`s: caught (`react/jsx-key`, via core-web-vitals).
 *   - A `transition` shorthand resetting the properties a longhand set, and an
 *     unqualified Tailwind `border-b` resolving to `currentColor`: NOT caught,
 *     and not catchable by any ESLint rule — both are CSS cascade semantics,
 *     invisible to a JS/JSX linter. They are guarded by the standing rules in
 *     CLAUDE.md, which is the only mechanism that actually applies to them.
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**'],
  },
  ...next,
  {
    rules: {
      // The site renders its JSON-LD through one audited helper (lib/seo.ts)
      // that JSON.stringify-escapes every value, and the concierge renders
      // markdown through its own sanitizer. Both are deliberate, both are
      // documented at the call site, and the rule has no way to see that.
      'react/no-danger': 'off',
    },
  },
];

export default config;
