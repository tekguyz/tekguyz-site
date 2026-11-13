# Seam reskin of tekguyz.com (the current site)

Status: draft for the founder, 2026-11-12. Branch `seam-reskin`. Model label: `opus-high` (many files, judgment on a live site). No plan: the design is already chosen, so this spec is enough.

## Goal

Put the "Seam" look from `tekguyz-one/brand/design/` on the current site, `tekguyz-site`. Same pages, same addresses, same copy. Only the look changes, plus one trim of the work list. The new site (`tekguyz-web`) does not use Seam; the founder will bring his own references for that rebuild later.

## Source of the look

- `tekguyz-one/brand/design/DESIGN.md`: the rules.
- `tekguyz-one/brand/design/tokens.css`: the values.
- `tekguyz-one/brand/design/mockups/home.html`: the home page as a picture.

Seam is still a draft in `tekguyz-one`. The founder said on 2026-11-12 that "this design is okay" for the current site. Nothing is written back to `tekguyz-one` by this job.

## What must not change

1. Every route and page address. Same sitemap.
2. Page copy. It stays as it is in the code and `docs/COPY.md`, word for word.
3. The contact form, its CRM signing, the AI concierge, the live status checks, SEO and JSON-LD.
4. Nothing merges to `master` without the founder saying yes in chat. A merge deploys tekguyz.com live.

## What changes

### 1. Tokens

- `app/globals.css` gets the Seam values: ink `#0b0b0c`, paper `#ffffff`, the four brighter lamps, the on-ink and on-paper text and line colors, square corners (radius 0), the Seam spacing scale.
- `docs/TOKENS.md` is changed in the same commit, because `bun run check:design` fails the build if the two disagree. `scripts/check-design.ts` is updated for the new token names.
- `docs/DESIGN.md` is 161 KB of reasons. It is not rewritten. A short banner at the top says Seam replaces its sections 1 (colors), 2 (type), 3 (shape) and 7 (dark mode), and names this spec.

### 2. Fonts

Geist and Geist Mono go. Archivo (variable width, for headlines), Atkinson Hyperlegible Next (body and buttons) and Red Hat Mono (times, status, "sample data" and nothing else) load through `next/font` so they are self-hosted.

### 3. One look, no theme switch

Seam uses both black and white on every page, joined by a straight seam. So:

- Remove the light/dark toggle, `ThemeProvider`, `ThemeColorMeta` and the `.dark` blocks.
- `viewport.themeColor` becomes ink.
- Anything that was drawn per theme (logo lockup, posters, OG images, icons) is checked on both grounds.

### 4. Layout per page

Each page keeps its content and order. It gets a black ground where the problem and the promise sit, a white ground where the work and proof sit, and a straight horizontal seam between them.

| Piece | Change |
| --- | --- |
| Home hero | On ink, lettering headline, same copy and same media |
| Four Solutions | Four big flat lamp fields on the seam (replaces the Solution rows and tag dots on Home) |
| Fold board and builds | "Build row": lamp dot, name, mono "Live · checked <time>" from the real status check, Open |
| Process | Four-step list ruled by a 2px line |
| Closing CTA | Black close band, one sentence, one button |
| Footer | Ink, with the four-lamp stripe along the bottom |
| Buttons | The opposite ground from where they sit. Never a lamp |
| Cards and frames | Square, 2px ink border, no shadows |
| Inner pages | Same grounds, type and components: `/solutions/*`, `/work/*`, `/process`, `/examples/*`, `/contact`, `/privacy`, 404 and error |

### 5. Work list: 9, not 10

Decided 2026-11-12 (option a). Team Performance (`Advantage-Teams`, archived) leaves `content/work.ts`, `content/examples.ts` links, the footer and the sitemap. Its old address redirects to `/work` so no link or Google result 404s. `content/work.test.ts` is updated for 9. Tracks issue #76; the PR says `refs #76`, and the issue is closed or retitled only after the rebuild-or-retire call is final.

### 6. Motion

Seam allows one moment per page: the lamp fields rise in on load, 60 ms apart, and lift 8 px on hover. Everything else is still. `prefers-reduced-motion` turns it all off. The existing reveal, view-transition and draw-rule effects are removed or reduced to match.

## Conflicts with the "keep the copy" rule

Seam's "Don't" list says no client name and no face of a person. The current site has a pull quote and a testimonial from a client. Decision for now: the copy stays, and those components are restyled, not removed. Flagged so the founder can overrule it.

## Done means

1. `bun run check:design`, `check:hex`, `check:media`, lint, types and `bun run test:unit` pass.
2. Every route renders with no console error on the Vercel preview.
3. Screen check (`skills/screen-check`) at phone, tablet and laptop for Home, one Solution, `/work`, one build page, `/process`, `/contact`.
4. Text contrast on every ground and lamp meets the Seam numbers; no lamp is used as text on white.
5. The founder looks at the preview and says yes. Only then does the PR merge.

## Not done by this job

- No Seam in `tekguyz-web`.
- No change to `tekguyz-one` (`brand/playbook.md` § 9 still lists "Monochrome & Ink" until the founder accepts Seam there).
- No change to brand media files (`brand/media/`); the logo on the site takes the new lamp values in code only. Whether the master logo files follow is a separate call.
- No new copy.
