---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
  - "config/solutions.ts"
  - "content/*.ts"
  - "app/icon.svg"
---

# Components, wayfinding and motion

Moved out of `CLAUDE.md` on 2026-09-21 (Job 4). Text is unchanged.

## Wayfinding, marks and frames

- **The four wayfinding accents mean *solution line*.** Mapping lives only in `config/solutions.ts` (the home ink band is the one documented exception, via `.ink-band`). No accent ever fills a button — primary CTAs are always ink. No 5th accent. Never decorative bullets: `/contact`'s trust facts and `closing-cta` render the same three facts the same way — one muted line, 3px `muted-soft` mid-dots, no colour.
- **`flourish-mark`: every route, once per page.** Not home-only. The closing-CTA echo replays the load-sequence timing and gets no second set of dots — the *once per page* half is absolute.
- **The favicon set is dark** (`#101010` plate, `#4B5563` connectors), generated on `prebuild` from `icon-master.svg` — which is itself **unchanged**, and nothing else reads it (nav lockup and footer render the mark as JSX, OG images build their own). `app/icon.svg` carries the plate too, or the tab icon differs by browser.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
- **`LiveFrame`'s padding is 0 and stays 0**, its fill is `--tg-surface` (never a literal white), and its status block sits **beneath** the frame, never inside it. `aspect-ratio` governs the *outer* box, so padding is subtracted from the media: the frame keeps its 16:10 while the screenshot inside it silently stops being 16:10. The fill is a loading state, not a design surface — invisible once the poster paints under `cover` — so it must be a token that resolves in dark mode and inside `.ink-band`. Status *inside* means overlaying the real product's own header, the same lie as fake browser chrome. **If a frame looks like it has space around its media, that space is the container's** — `cover` crops and can never letterbox. The hero's `tg-hero-frame` panel is a different, deliberate thing; don't port it to card scale.
- **The proof line's two halves are both ink.** It shipped with the invitation in `muted`, and **`link-underline` draws nothing at rest** — it grows from 0% on hover and focus — so the only actionable element on the site's proof band had no rest-state affordance *and* was the lighter half of its own sentence. Hierarchy comes from the size step (`--text-title` claim, `--text-body` link), never from de-emphasising the thing you want clicked.
- **`LiveFrame` posters: 16:10 in every compact context, 16:9 for the hero, real production UI only** — never a simulator, emulator, or demo-mode capture (PLAYBOOK §12). `bun run check:media` guards this on `prebuild`: missing fails, off-ratio warns. Off-ratio isn't cosmetic — `cover` crops it to a fragment that reads as invented content.

## Layout and motion

- **The detail-page meta rail carries Solution line / Status / Live demo, and no button.** `MetaRail` in `app/work/[slug]/page.tsx` is the one implementation, for both tiers. A second ask directly above the `closing-cta` band undercuts it — that band is the documented size exception *because* it's the page's single strongest ask. Separately: `project-card` never carries an image, but a project's own **detail page** does. The rule protects the weight gap between the two card treatments on the index, not a ban on ever showing the screenshot.
- **The `/process` progress rail reads the step elements' own positions**, never a fraction of the section's scrollable range — the two are unrelated, and the readout hit "Step 04 of 04" 457px early. A progress indicator that disagrees with the page is worse than none.
- **Banned motion — and read what this list is actually rejecting.** Parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries. **It rejects one aesthetic: the cyberpunk / hacker-terminal / "dev portfolio" look.** It is *not* a statement that motion is suspect, and it has been misread that way for the life of the project — the site shipped with exactly **one** motion idea (fade in + rise 8px) applied everywhere, `motion` imported in 2 files, and no transitions on hover states, the accordion, the form steps or the status line. The user's words: *"not far away from looking like a regular text file with hyperlinks with 4 colors."* **Adding motion outside this banned list is wanted, not risky.** A real motion system is Phase 1 (`docs/STATUS.md`) — until it lands, this bullet is the only guidance there is, so read it as permission with a boundary rather than a prohibition.

## Content model

`content/work.ts` drives the `/work` index, all 6 detail pages, `generateStaticParams`, JSON-LD, OG images, and live status checks. `content/solutions.ts` does the same for `/solutions`. Adding an entry must produce a page with no template work.
