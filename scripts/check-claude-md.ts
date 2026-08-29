/**
 * `CLAUDE.md` ↔ repo drift guard.
 *
 * WHY THIS EXISTS. The user attaches `CLAUDE.md` to a separate Claude.ai
 * planning Project, which cannot see this repo and knows only what is pasted
 * into it. Nothing updates `CLAUDE.md` — `/init` writes it once and it drifts
 * from then on — so a stale copy gets handed to the planning tool and read as
 * current. Two claims were already wrong when this was written: the test count
 * ("90 cases across 2 files" against a real 97/3) and `.vercelignore`'s
 * contents, which had stopped excluding `docs/` without the line being updated.
 *
 * SCOPE, deliberately narrow — the same discipline as `check-design.ts`.
 * MEASURABLE claims only: counts, paths, script names, file contents. CLAUDE.md
 * is mostly *decisions* — rules, bans, and the incident behind each one. Those
 * are not stale for being old and this script never touches them.
 *
 * A MISSING CLAIM IS A FAILURE, NOT A PASS. If a pattern below stops matching,
 * the claim was reworded or deleted and this check is silently dead. That is
 * the exact failure mode `check-design.ts` exists to end, so it is reported
 * loudly here rather than skipped.
 *
 * NOT WIRED INTO `prebuild`, ON PURPOSE. `check:design` gates the build because
 * a wrong token value ships a visual defect. A stale sentence in a doc must not
 * be able to block a production deploy. This runs on demand, and from the
 * `handoff` skill.
 *
 * Run: bun run check:claude
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const FILE = 'CLAUDE.md';

type Problem = { claim: string; detail: string };
const problems: Problem[] = [];
const checked: string[] = [];

const md = await readFile(FILE, 'utf8');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));

/** Run a command and return stdout, or null if it fails. */
function run(cmd: string): string | null {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string };
    return err.stdout || err.stderr || null;
  }
}

/**
 * Assert a regex matches CLAUDE.md, then hand the captures to a checker.
 * A pattern that does not match is reported — see the header note.
 */
function claim(
  label: string,
  re: RegExp,
  check: (m: RegExpMatchArray) => string | null,
): void {
  checked.push(label);
  const m = md.match(re);
  if (!m) {
    problems.push({
      claim: label,
      detail:
        'the sentence this check reads is no longer in CLAUDE.md — it was reworded or removed, ' +
        'so this check is dead. Re-point the regex in scripts/check-claude-md.ts or drop the check.',
    });
    return;
  }
  const bad = check(m);
  if (bad) problems.push({ claim: label, detail: bad });
}

/* -------------------------------------------------------------------------
   1. Test count — "N cases across M files"
------------------------------------------------------------------------- */
claim('test count', /\(\s*(\d+)\s+cases\s+across\s+(\d+)\s+files/, (m) => {
  const out = run('bun run test 2>&1') ?? '';
  const tests = out.match(/Tests\s+(\d+)\s+passed/);
  const files = out.match(/Test Files\s+(\d+)\s+passed/);
  if (!tests || !files) return 'could not read a count out of `bun run test` — did the runner change?';
  const realCases = tests[1];
  const realFiles = files[1];
  if (m[1] === realCases && m[2] === realFiles) return null;
  return `CLAUDE.md says ${m[1]} cases across ${m[2]} files; measured ${realCases} across ${realFiles}`;
});

/* -------------------------------------------------------------------------
   2. Token count — check:design prints its own number, in two places
------------------------------------------------------------------------- */
{
  const out = run('bun run check:design 2>&1') ?? '';
  const real = out.match(/OK\s+—\s+(\d+)\s+tokens/);
  const realCount = real ? real[1] : null;

  claim('token count (TOKENS.md row)', /(\d+)\s+tokens are asserted against/, (m) => {
    if (!realCount) return 'check:design did not report a count — it may be failing; run it directly';
    return m[1] === realCount ? null : `CLAUDE.md says ${m[1]}; check:design reports ${realCount}`;
  });

  claim('token count (check:design bullet)', /\*\*(\d+) of them\*\* across TOKENS\.md/, (m) => {
    if (!realCount) return 'check:design did not report a count — it may be failing; run it directly';
    return m[1] === realCount ? null : `CLAUDE.md says ${m[1]}; check:design reports ${realCount}`;
  });
}

/* -------------------------------------------------------------------------
   3. `.vercelignore` excludes `docs/` — this one already went stale once
------------------------------------------------------------------------- */
/* This claim flips. It was TRUE, went false, and the bullet now records it as
   retired with `~~strikethrough~~` — the convention this repo uses for a fact
   that was real and stopped being real. So the check reads WHICH form the
   sentence is in and asserts that form against the file, rather than assuming
   the claim is always positive. A checker that only understood the positive
   form would fire forever after the doc was correctly fixed, and a check that
   cries wolf gets deleted. */
claim('.vercelignore vs docs/', /(~~)?`\.vercelignore` excludes `docs\/`/, (m) => {
  if (!existsSync('.vercelignore')) return 'CLAUDE.md describes .vercelignore, but the file does not exist';
  const vi = execSync('cat .vercelignore', { encoding: 'utf8' });
  const ignoresDocs = vi
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .some((l) => l === 'docs' || l === 'docs/' || l.startsWith('docs/'));
  const docSaysRetired = m[1] === '~~';

  if (docSaysRetired && ignoresDocs) {
    return (
      'CLAUDE.md strikes this claim out as retired, but .vercelignore DOES exclude `docs/` again. ' +
      'The prebuild hazard is live: prebuild reads docs/TOKENS.md and the deploy container will not have it.'
    );
  }
  if (!docSaysRetired && !ignoresDocs) {
    return (
      'CLAUDE.md says .vercelignore excludes `docs/`, but it does not. The prebuild hazard ' +
      'described in that bullet no longer applies and the bullet should say so.'
    );
  }
  return null;
});

/* -------------------------------------------------------------------------
   4. The honeypot field name
------------------------------------------------------------------------- */
claim('honeypot field name', /The honeypot is `([a-z_]+)`/, (m) => {
  const src = run(`grep -rl "${m[1]}" lib/ app/ components/ 2>/dev/null`) ?? '';
  return src.trim() ? null : `CLAUDE.md says the honeypot is \`${m[1]}\`, but no source file mentions it`;
});

/* -------------------------------------------------------------------------
   5. Every `bun run <script>` CLAUDE.md names actually exists
------------------------------------------------------------------------- */
{
  const named = [...new Set([...md.matchAll(/`bun run ([a-z:._-]+)`/g)].map((m) => m[1]))];
  checked.push(`bun run scripts (${named.length})`);
  for (const s of named) {
    if (s === 'dev' || s === 'build' || s === 'start') continue; // real, and also plain words
    if (!pkg.scripts[s]) {
      problems.push({
        claim: `bun run ${s}`,
        detail: `CLAUDE.md names this script; package.json has no "${s}" entry`,
      });
    }
  }
}

/* -------------------------------------------------------------------------
   6. Every repo path CLAUDE.md names in backticks still exists
------------------------------------------------------------------------- */
{
  const PATH_RE = /`([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./[\]-]+\.(?:ts|tsx|css|md|json|svg))`/g;
  const paths = [...new Set([...md.matchAll(PATH_RE)].map((m) => m[1]))];
  checked.push(`file paths (${paths.length})`);
  for (const p of paths) {
    if (p.includes('[') || p.includes('*')) continue; // route patterns and globs, not real paths
    if (p.startsWith('node_modules/')) continue; // present only after install
    if (!existsSync(p)) {
      problems.push({ claim: p, detail: 'CLAUDE.md names this file; it does not exist' });
    }
  }
}

/* ---------------------------------------------------------------------- */
if (problems.length > 0) {
  console.error(`\ncheck:claude FAILED — ${problems.length} stale claim(s) in ${FILE}.\n`);
  console.error('These are MEASURED mismatches. Fix CLAUDE.md, keeping its voice —');
  console.error('each of those rules cost a real bug, so correct the figure, not the reason.\n');
  for (const p of problems) console.error(`  ${p.claim}\n    ${p.detail}`);
  console.error('');
  process.exit(1);
}

console.log(`check:claude OK — ${checked.length} claim groups match the repo (${checked.join(', ')})`);
