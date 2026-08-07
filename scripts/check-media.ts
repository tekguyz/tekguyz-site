/**
 * Media wiring guard.
 *
 * Every `poster` and `heroPoster` in content/work.ts is a path into `public/`.
 * Nothing else checks that the file on the other end of that path exists — a
 * typo, or a recapture saved under a slightly different name, produces a
 * hairline frame with a broken image inside it and no build error at all.
 *
 * This exists because the compact-context assets are being recaptured and
 * dropped in by hand under the filenames documented in PLAYBOOK §12. The whole
 * point of that workflow is that a new .webp lands and renders with no code
 * change, which only holds if the wiring is right — so a wrong filename should
 * fail the build loudly rather than ship a blank frame.
 *
 * It also warns on ratio, which is advisory rather than fatal: DESIGN.md locks
 * 16:10 for every compact context and 16:9 for the hero, and a near-square
 * source gets hard-cropped by `object-fit: cover` to whatever happens to be in
 * the top strip. That is exactly how a capture of one sub-view ended up reading
 * as invented placeholder content.
 *
 * Runs automatically before `bun run build` via the `prebuild` script.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { work } from '../content/work';

const PUBLIC = join(import.meta.dir, '..', 'public');

/** Minimal WebP header read — enough for the dimensions, no image library. */
function webpSize(file: string): [number, number] | null {
  const buf = readFileSync(file);
  if (buf.toString('ascii', 0, 4) !== 'RIFF') return null;
  const fmt = buf.toString('ascii', 12, 16);
  if (fmt === 'VP8X') return [(buf.readUIntLE(24, 3) & 0xffffff) + 1, (buf.readUIntLE(27, 3) & 0xffffff) + 1];
  if (fmt === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
  }
  return null;
}

const missing: string[] = [];
const offRatio: string[] = [];

for (const entry of work) {
  // `poster` is the compact context (case-study rows, detail pages) at 16:10.
  // `heroPoster` is the home hero's own 16:9 asset, and is optional — the hero
  // falls back to `poster` when it is absent.
  const checks: Array<[string, string, number]> = [[entry.poster, '16:10', 1.6]];
  if (entry.heroPoster) checks.push([entry.heroPoster, '16:9', 16 / 9]);

  for (const [path, label, target] of checks) {
    const file = join(PUBLIC, path);
    if (!existsSync(file)) {
      missing.push(`${entry.slug}: ${path} — no such file under public/`);
      continue;
    }
    const size = webpSize(file);
    if (!size) continue;
    const [w, h] = size;
    const ratio = w / h;
    // 4% either side: enough to accept a real capture that is a pixel or two
    // off, tight enough to catch a 4:3 or near-square source.
    if (Math.abs(ratio - target) / target > 0.04) {
      offRatio.push(
        `${entry.slug}: ${path} is ${w}x${h} (${ratio.toFixed(2)}), not ${label} (${target.toFixed(2)}) — cover-crops to a fragment`,
      );
    }
  }
}

if (offRatio.length > 0) {
  console.warn(`\n  ${offRatio.length} asset(s) off their locked ratio (DESIGN.md LiveFrame):`);
  for (const line of offRatio) console.warn(`    ! ${line}`);
  console.warn('');
}

if (missing.length > 0) {
  console.error(`\n  ${missing.length} media asset(s) wired but missing:`);
  for (const line of missing) console.error(`    x ${line}`);
  console.error('');
  process.exit(1);
}

console.log(`  media wiring ok — ${work.length} entries, all posters present`);
