/**
 * Dark-context literal-hex guard.
 *
 * WHY THIS EXISTS. `check:design` asserts that `docs/TOKENS.md` matches
 * `app/globals.css`, and it is good at exactly that. It cannot see a hex typed
 * into a `.tsx` file, because there is no token there to compare against — the
 * component simply names a colour and the stylesheet never hears about it.
 *
 * That blind spot is what let ~35 literal colours accumulate across 8 component
 * files. `.ink-band` and `.footer-dark` in globals.css already redeclare
 * `--tg-fg` / `--tg-secondary` / `--tg-border` at their own scope root, so a
 * component inside one of them can just read the token. Instead the components
 * re-derived the values behind an `onInk` ternary — and the two drifted: the
 * footer's scope said `--tg-secondary: #747c8b` while the footer's own markup
 * said `#9CA3AF`, so the file shipped two different secondary greys and the
 * literal won every time.
 *
 * WHAT IT BANS. Only neutrals that a dark scope root already defines. Each one
 * has an exact token to use instead, so a hit is always a real substitution
 * rather than a judgement call:
 *
 *     #f5f5f5  -> var(--tg-fg)        / text-fg
 *     #9ca3af  -> var(--tg-secondary) / text-secondary   (retired as a text colour)
 *     #747c8b  -> var(--tg-secondary) / text-secondary
 *     #2a2a2c  -> var(--tg-border)    / border-border
 *     #111111  -> var(--tg-bg) on a dark surface, var(--tg-fg) on a light one
 *                 (it is both `.ink-band`'s background and light mode's --tg-ink)
 *
 * WHAT IT DOES NOT BAN, deliberately:
 *   - Accent hexes. `.ink-band`'s violet tag is a documented exception with a
 *     mechanical reason (token resolution would be wrong there), and the brand
 *     mark's four circles are the mark, not a theme colour.
 *   - `#101010` / `#ffffff`. `theme-color.tsx` and `layout.tsx` feed these to
 *     the browser's own chrome via <meta>, which cannot read a custom property.
 *
 * COMMENTS ARE EXEMPT and that is load-bearing — half this repo's design
 * reasoning is prose explaining which value went where and why. Comments are
 * blanked (newlines preserved, so reported line numbers stay true) before the
 * scan, not stripped, and a hex in prose is documentation rather than drift.
 *
 * NEXT METADATA CONVENTIONS ARE EXEMPT — one rule, not a list of excuses:
 * these files emit colour to something that is not the page. `opengraph-image`
 * and friends render through Satori, outside the browser's CSS engine;
 * `manifest` and `theme-color` hand a value to the OS and browser chrome. None
 * of them has a cascade to read, so a custom property there resolves to
 * nothing and a literal is the only correct answer.
 *
 * TO FIX A FAILURE: use the token. If the element genuinely sits on a
 * permanently-dark surface that has no scope root, give it one (that is what
 * `components/testimonial.tsx` carrying `.ink-band` is), rather than reaching
 * for the hex again. New literals belong in `app/globals.css` and nowhere else.
 *
 * Run: bun run check:hex
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, posix, sep } from 'node:path';

const ROOTS = ['app', 'components'];
const EXTS = ['.tsx', '.ts'];

/** Next metadata conventions — they emit colour outside the cascade. See above. */
const EXEMPT_BASENAMES = /^(opengraph-image|twitter-image|icon|apple-icon|manifest)\.tsx?$/;

/** Banned value -> what to use instead. */
const BANNED: Record<string, string> = {
  '#f5f5f5': 'var(--tg-fg) / text-fg',
  '#9ca3af': 'var(--tg-secondary) / text-secondary  (retired as a text colour)',
  '#747c8b': 'var(--tg-secondary) / text-secondary',
  '#2a2a2c': 'var(--tg-border) / border-border',
  '#111111': 'var(--tg-bg) / bg-bg on a dark surface — var(--tg-fg) / text-fg on a light one',
};

type Hit = { file: string; line: number; hex: string; source: string };

/**
 * Blank out comments, preserving every newline so line numbers survive.
 *
 * Block comments first — that also covers JSX `{/* … *\/}`, whose body is an
 * ordinary block comment. Line comments second, and the `[^:]` guard is why
 * this is not a one-liner: a bare `\/\/` regex eats the rest of any line
 * containing `https://`, which would silently exempt real code sitting after a
 * URL. Requiring the slashes not to follow a colon leaves URLs intact.
 */
function blankComments(src: string): string {
  const keepNewlines = (m: string) => m.replace(/[^\n]/g, ' ');
  return src
    .replace(/\/\*[\s\S]*?\*\//g, keepNewlines)
    .replace(/(^|[^:])\/\/[^\n]*/g, (_m, lead: string) => lead + ' ');
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...(await walk(full)));
    } else if (EXTS.some((e) => entry.name.endsWith(e)) && !EXEMPT_BASENAMES.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const pattern = new RegExp(Object.keys(BANNED).join('|'), 'gi');
const hits: Hit[] = [];
let scanned = 0;

for (const root of ROOTS) {
  for (const file of await walk(root)) {
    scanned++;
    const lines = blankComments(await readFile(file, 'utf8')).split('\n');
    lines.forEach((text, i) => {
      for (const m of text.matchAll(pattern)) {
        hits.push({
          file: file.split(sep).join(posix.sep),
          line: i + 1,
          hex: m[0].toLowerCase(),
          source: text.trim(),
        });
      }
    });
  }
}

if (hits.length > 0) {
  console.error(`\ncheck:hex FAILED — ${hits.length} literal hex in ${ROOTS.join('/')}.\n`);
  console.error('A dark scope root already defines these. Read the token, do not restate it:');
  console.error('  a literal cannot be checked against globals.css, which is exactly how the');
  console.error('  footer came to ship two different secondary greys.\n');
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  ${h.hex}  ->  ${BANNED[h.hex]}`);
    console.error(`    ${h.source.length > 100 ? h.source.slice(0, 100) + '…' : h.source}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `check:hex OK — ${scanned} files, no banned literals (${Object.keys(BANNED).join(', ')})`,
);
