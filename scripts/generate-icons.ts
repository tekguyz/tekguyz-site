/**
 * Generates the full favicon / manifest icon set from public/brand/icon-master.svg.
 *
 * Run with:  bun run icons
 *
 * Generated from the master so the icons track the current mark automatically
 * rather than drifting from whatever an external favicon generator produced
 * once. Outputs are committed — this is a build-time asset step, not a runtime
 * dependency.
 *
 * Three deliberate adjustments the master doesn't need but the icons do:
 *  - The master floats with no container and no padding. At 32px and below a
 *    full-bleed mark clips visually against browser tab chrome, so the nodes are
 *    scaled into a padded viewBox.
 *  - The master's hairline connectors are #E5E7EB, which vanishes on a
 *    transparent background at small sizes. Favicons keep the connectors but on
 *    an opaque plate.
 *  - That plate is now DARK (--tg-bg-dark, #101010), not white and not
 *    transparent. This is an icon-set-only change: `icon-master.svg` is
 *    untouched, and nothing else reads it — the nav lockup and footer render
 *    the mark as JSX (components/logo-lockup.tsx) and the OG images build their
 *    own, so no other surface moves. The connectors lift to #4B5563 so they
 *    stay a hairline against the dark plate instead of glowing off it.
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..');
const PUBLIC = join(ROOT, 'public');
const APP = join(ROOT, 'app');

/** --tg-bg-dark. The one plate colour for every generated icon. */
const PLATE = '#101010';
/** Hairline connectors, lifted off the dark plate but never a highlight. */
const CONNECTOR = '#4B5563';

/** Padded variant of the master, sized for small-format rendering. */
function paddedIcon(background: string | null): string {
  const plate = background ? `<rect width="80" height="80" rx="16" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  ${plate}
  <g transform="translate(8,8)">
    <line x1="32" y1="12" x2="12" y2="32" stroke="${CONNECTOR}" stroke-width="2.5"/>
    <line x1="32" y1="12" x2="52" y2="32" stroke="${CONNECTOR}" stroke-width="2.5"/>
    <line x1="12" y1="32" x2="32" y2="52" stroke="${CONNECTOR}" stroke-width="2.5"/>
    <line x1="52" y1="32" x2="32" y2="52" stroke="${CONNECTOR}" stroke-width="2.5"/>
    <circle cx="32" cy="12" r="7.5" fill="#3B6FE0"/>
    <circle cx="52" cy="32" r="7.5" fill="#7C6FE0"/>
    <circle cx="32" cy="52" r="7.5" fill="#F2A93C"/>
    <circle cx="12" cy="32" r="7.5" fill="#2FA679"/>
  </g>
</svg>`;
}

async function png(svg: string, size: number): Promise<Buffer> {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  // Sanity-check that the master is still where everything else expects it.
  const master = await readFile(join(PUBLIC, 'brand', 'icon-master.svg'), 'utf8');
  if (!master.includes('circle')) {
    throw new Error('icon-master.svg does not look like the Connected Nodes mark');
  }

  // One plate for the whole set. icon.svg used to ship transparent "so it
  // adapts", which is why a tab could show a dark .ico in one browser and a
  // bare mark in another — the set has to agree with itself to read as one
  // icon, so the SVG takes the same plate.
  const onDark = paddedIcon(PLATE);

  // Manifest icons — maskable-safe padding, opaque plate.
  await writeFile(join(PUBLIC, 'icon-192.png'), await png(onDark, 192));
  await writeFile(join(PUBLIC, 'icon-512.png'), await png(onDark, 512));

  // Apple touch icon — iOS composites onto its own background, so opaque.
  await writeFile(join(APP, 'apple-icon.png'), await png(onDark, 180));

  // Scalable icon for browsers that prefer SVG.
  await writeFile(join(APP, 'icon.svg'), onDark, 'utf8');

  // Multi-resolution .ico — SEO.md is explicit that this is currently indexed
  // and must not regress during the rebuild.
  const ico = await pngToIco([
    await png(onDark, 16),
    await png(onDark, 32),
    await png(onDark, 48),
    await png(onDark, 64),
  ]);
  await writeFile(join(APP, 'favicon.ico'), ico);

  console.log('Generated: favicon.ico (16/32/48/64), icon.svg, apple-icon.png, icon-192, icon-512');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
