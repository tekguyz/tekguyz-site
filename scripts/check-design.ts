/**
 * `docs/TOKENS.md` ↔ `app/globals.css` drift guard.
 *
 * WHY THIS EXISTS. `docs/DESIGN.md` was wrong in public more than once — it
 * claimed the nav border faded over 200ms when no surface ever implemented
 * that, and called `flourish-mark` home-only while it rendered on every route.
 * Both were quoted back to the user as current state.
 *
 * The cause was structural: one 89KB document was doing two jobs — describing
 * what the code does, and recording what was decided and why — and the two were
 * indistinguishable on the page, so the descriptive half drifted silently.
 *
 * `TOKENS.md` is that descriptive half, extracted so a machine can hold it to
 * account. Every `--token: value;` it prints in a fenced css block is asserted
 * against the stylesheet here, on `prebuild`, and a mismatch fails the build
 * naming the token and both values. A doc that is *asserted* to match the code
 * drifts; a doc that is *tested* against it cannot.
 *
 * SCOPE, deliberately narrow. Token blocks only. Prose claims ("the status
 * block sits beneath the frame") have no token to compare and are not
 * attempted — pretending otherwise would make the guard look more complete
 * than it is, which is the failure mode it exists to end.
 *
 * TO ADD A SECTION: give it a fenced css block in TOKENS.md, add its heading to
 * `TOKEN_SECTIONS` below. Two lines.
 *
 * Run: bun run check:design
 */
import { readFile } from 'node:fs/promises';

const DESIGN = 'docs/TOKENS.md';
const CSS = 'app/globals.css';

type Failure = { where: string; detail: string };
const failures: Failure[] = [];
const checked: string[] = [];

/** Strip /* … *\/ comments so a value is never read out of prose. */
function decomment(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Compare two CSS values. Hex is case-insensitive per spec — the stylesheet
 * writes `#111111` and a human writing documentation writes `#111111`, and a
 * guard that fails on that teaches people to distrust it, which is worse than
 * not having it. Everything else compares exactly.
 */
function sameValue(a: string, b: string): boolean {
  const norm = (v: string) => (/^#[0-9a-f]{3,8}$/i.test(v) ? v.toLowerCase() : v);
  return norm(a) === norm(b);
}

/**
 * Return the body of the first `{ … }` block that opens at or after `from`,
 * matched by brace depth rather than by regex. A regex cannot see the nested
 * `:root` inside `@media`, and that nesting is exactly what the density scale
 * is made of.
 */
function blockAt(src: string, from: number): string | null {
  const open = src.indexOf('{', from);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

/** The `:root` block nested inside the `@media (min-width: Npx)` block. */
function rootInMedia(css: string, minWidth: number): string | null {
  const re = new RegExp(`@media\\s*\\(\\s*min-width:\\s*${minWidth}px\\s*\\)`);
  const m = re.exec(css);
  if (!m) return null;
  const media = blockAt(css, m.index);
  if (media === null) return null;
  const rootIdx = media.search(/(^|\s):root\b/);
  if (rootIdx === -1) return null;
  return blockAt(media, rootIdx);
}

/**
 * Read one custom property out of a declaration block, taking the LAST
 * declaration rather than the first — CSS cascades, and a token redeclared
 * further down the block is the one that wins.
 */
function prop(block: string, name: string): string | null {
  const re = new RegExp(`(?:^|;|\\s)${name}\\s*:\\s*([^;]+);`, 'g');
  const all = [...decomment(block).matchAll(re)];
  return all.length === 0 ? null : all[all.length - 1][1].trim().replace(/\s+/g, ' ');
}

/**
 * Every top-level `@theme` and `:root` block, concatenated in source order.
 *
 * BOTH are needed, and finding that out cost this guard two false runs:
 *   - There is more than one `:root`. globals.css opens with one at line 10
 *     for the palette and declares motion + density tokens in a second one
 *     after `@theme`. Reading only the first reported nine "missing" tokens
 *     that were in the file the whole time.
 *   - The type scale and the radius scale are not in `:root` at all — they are
 *     in Tailwind's `@theme inline` block, because they also need to generate
 *     utilities. Tailwind emits `@theme` variables into `:root` at build time,
 *     so for the purpose of "what does this token resolve to" the two are one
 *     namespace and merging them is correct rather than convenient.
 *
 * Order matters: later declarations win, and `prop()` takes the last match.
 * Top-level is detected by column — a `:root` nested inside `@media` is
 * indented, so anchoring to a line start excludes it. Those are read
 * separately by `rootInMedia`.
 */
function topLevelRoots(css: string): string {
  const out: string[] = [];
  const re = /(^|\n)(?::root|@theme[^{\n]*?)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const body = blockAt(css, m.index);
    if (body !== null) out.push(body);
  }
  return out.join('\n;\n');
}

const design = await readFile(DESIGN, 'utf8');
const css = await readFile(CSS, 'utf8');

/* All top-level `:root` blocks, not the Tailwind `@theme` block — `@theme`
   also declares `--ease-entrance`, and the two are allowed to differ because
   `@theme` generates utilities while `:root` is what the hand-written rules
   read. This guard checks the `:root` values, which are the ones DESIGN.md
   §6.1 prints. */
const rootBlock = topLevelRoots(css);
if (rootBlock.trim() === '') {
  failures.push({ where: CSS, detail: 'no top-level :root block found' });
}

/* ---------------------------------------------------------------------------
   Every section that prints a `--token: value;` fence is checked the same way.
   Adding a section to this list is how you put more of DESIGN.md under test —
   which is the point of the v2.6 provenance convention: a **[measured]** claim
   that nothing measures is just the old document with new punctuation.
--------------------------------------------------------------------------- */
const TOKEN_SECTIONS: { heading: string; label: string }[] = [
  { heading: '## Colour', label: 'Colour' },
  { heading: '## Type', label: 'Type' },
  { heading: '## Radius, container, spacing', label: 'Radius' },
  { heading: '## Motion', label: 'Motion' },
  { heading: '## Density', label: 'Density' },
];

for (const { heading, label } of TOKEN_SECTIONS) {
  const at = design.indexOf(heading);
  if (at === -1) {
    failures.push({ where: DESIGN, detail: `section "${heading}" not found` });
    continue;
  }
  const fence = /```css\n([\s\S]*?)```/.exec(design.slice(at));
  if (!fence) {
    failures.push({ where: DESIGN, detail: `${label} has no \`\`\`css block` });
    continue;
  }
  const declared = [...decomment(fence[1]).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)];
  if (declared.length === 0) {
    failures.push({ where: DESIGN, detail: `${label} css block declares no tokens` });
    continue;
  }
  for (const [, name, rawValue] of declared) {
    const want = rawValue.trim().replace(/\s+/g, ' ');
    const got = prop(rootBlock, name);
    checked.push(name);
    if (got === null) {
      failures.push({ where: `${CSS} :root`, detail: `${name} is missing — ${DESIGN} ${label} says ${want}` });
    } else if (!sameValue(got, want)) {
      failures.push({ where: name, detail: `${DESIGN} ${label} says "${want}", ${CSS} has "${got}"` });
    }
  }
}

/* ---------------------------------------------------------------------------
   §8.0 — the density scale. Written as `--token  /* … 24 → 32 → 64px *\/`,
   i.e. the ≤767 / 768 / 1024 values, so all three have to be found in three
   different places in the stylesheet.
--------------------------------------------------------------------------- */
const s80 = design.indexOf('## Density');
if (s80 === -1) {
  failures.push({ where: DESIGN, detail: 'section "## Density" not found' });
} else {
  const slice = design.slice(s80, s80 + 4000);
  const rows = [...slice.matchAll(/(--[a-z0-9-]+)[^\n]*?\/\*[^*]*?(\d+)\s*→\s*(\d+)\s*→\s*(\d+)px/g)];
  if (rows.length === 0) {
    failures.push({ where: DESIGN, detail: 'Density declares no tokens in `a → b → c px` form' });
  }
  const md768 = rootInMedia(css, 768);
  const md1024 = rootInMedia(css, 1024);
  if (md768 === null) failures.push({ where: CSS, detail: 'no `:root` inside @media (min-width: 768px)' });
  if (md1024 === null) failures.push({ where: CSS, detail: 'no `:root` inside @media (min-width: 1024px)' });

  for (const [, name, base, mid, wide] of rows) {
    checked.push(name);
    const want: [string, string, string | null][] = [
      [`${base}px`, `${CSS} :root (≤767)`, rootBlock],
      [`${mid}px`, `${CSS} @media 768 :root`, md768],
      [`${wide}px`, `${CSS} @media 1024 :root`, md1024],
    ];
    for (const [expected, where, block] of want) {
      if (block === null) continue;
      const got = prop(block, name);
      if (got === null) {
        failures.push({ where, detail: `${name} is missing — docs/TOKENS.md Density says ${expected}` });
      } else if (got !== expected) {
        failures.push({ where: `${name} @ ${where}`, detail: `docs/TOKENS.md Density says "${expected}", got "${got}"` });
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`\ncheck:design FAILED — ${failures.length} mismatch(es).\n`);
  console.error('DESIGN.md and globals.css disagree. Fix whichever is wrong:');
  console.error('  a value marked [measured] in DESIGN.md is a claim about the code,');
  console.error('  so if the code changed deliberately, the document is what is stale.\n');
  for (const f of failures) console.error(`  ${f.where}\n    ${f.detail}`);
  console.error('');
  process.exit(1);
}

const unique = [...new Set(checked)];
console.log(`check:design OK — ${unique.length} tokens match ${DESIGN} (${unique.join(', ')})`);
