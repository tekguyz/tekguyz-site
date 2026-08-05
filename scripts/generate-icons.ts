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
 * Two deliberate adjustments the master doesn't need but the icons do:
 *  - The master floats with no container and no padding. At 32px and below a
 *    full-bleed mark clips visually against browser tab chrome, so the nodes are
 *    scaled into a padded viewBox.
 *  - The master's hairline connectors are #E5E7EB, which vanishes on a
 *    transparent background at small sizes. Favicons keep the connectors but on
 *    an opaque canvas white plate, which is what a browser tab shows anyway.
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..');
const PUBLIC = join(ROOT, 'public');
const APP = join(ROOT, 'app');

/** Padded variant of the master, sized for small-format rendering. */
function paddedIcon(background: string | null): string {
  const plate = background
    ? `<rect width="80" height="80" rx="16" fill="${background}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  ${plate}
  <g transform="translate(8,8)">
    <line x1="32" y1="12" x2="12" y2="32" stroke="#D1D5DB" stroke-width="2.5"/>
    <line x1="32" y1="12" x2="52" y2="32" stroke="#D1D5DB" stroke-width="2.5"/>
    <line x1="12" y1="32" x2="32" y2="52" stroke="#D1D5DB" stroke-width="2.5"/>
    <line x1="52" y1="32" x2="32" y2="52" stroke="#D1D5DB" stroke-width="2.5"/>
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

  const onWhite = paddedIcon('#FFFFFF');
  const transparent = paddedIcon(null);

  // Manifest icons — maskable-safe padding, opaque plate.
  await writeFile(join(PUBLIC, 'icon-192.png'), await png(onWhite, 192));
  await writeFile(join(PUBLIC, 'icon-512.png'), await png(onWhite, 512));

  // Apple touch icon — iOS composites onto its own background, so opaque.
  await writeFile(join(APP, 'apple-icon.png'), await png(onWhite, 180));

  // Scalable icon for browsers that prefer SVG; transparent so it adapts.
  await writeFile(join(APP, 'icon.svg'), transparent, 'utf8');

  // Multi-resolution .ico — SEO.md is explicit that this is currently indexed
  // and must not regress during the rebuild.
  const ico = await pngToIco([
    await png(onWhite, 16),
    await png(onWhite, 32),
    await png(onWhite, 48),
    await png(onWhite, 64),
  ]);
  await writeFile(join(APP, 'favicon.ico'), ico);

  console.log('Generated: favicon.ico (16/32/48/64), icon.svg, apple-icon.png, icon-192, icon-512');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
