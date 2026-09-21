# design-system/

The source for the **TEKGUYZ design system artifact** — the thing Claude reads
when it builds a deck, a mockup or a styled page, so that output uses this
brand's real colours, type and spacing instead of generic defaults.

Published at https://claude.ai/artifact/TFNsynvfzkpnHW5WtLuKaz

**This folder is not part of the site build.** Nothing in `app/`, `components/`
or `prebuild` reads it. It is here so the design system lives in git rather than
in one Claude account, and so either laptop — and either Claude account — can
publish its own copy from the same files.

## Layout

`project/` mirrors the artifact's own file tree exactly. That is deliberate:
publishing is one call with `root` set to this folder.

| Path | What |
| --- | --- |
| `project/design-system.json` | the index — title, asset records, last change |
| `project/README.md` | the brand book, the first thing any agent reads |
| `project/tokens.json` | every colour, type style, space, radius and shadow |
| `project/cascade.md` | the cascade traps no linter catches |
| `project/components/<Name>/` | a rules page and a live preview per component |
| `project/assets/Logos/` | both logo masters |
| `project/fonts/` | the four Geist files the type scale is wired to |

## Source of truth for the numbers

**`app/globals.css` is the source of truth. `project/tokens.json` is a copy.**

`docs/TOKENS.md` is held to `app/globals.css` by `bun run check:design` on every
`prebuild`. **`project/tokens.json` is not held to anything.** It was extracted
by hand on 2026-09-21 and nothing will tell you when it drifts.

So: change a token in `app/globals.css`, and update `project/tokens.json` in the
same commit. If that proves annoying more than once, generate it instead — the
mechanical half (colour, radius, density, motion) can be read straight out of
`app/globals.css`; only the `usage` prose has to be written by a person.

## Publishing an update

Read the artifact's own instructions before publishing — the shapes and caps
live on the artifact, not here:

1. Read `SKILL.md` and `artifact-type/reference/format.md` on the artifact url.
2. Edit the files under `project/`.
3. Publish in one call: `root` = this folder, `file_path` = the absolute path of
   `project/design-system.json`, `files` = every other `project/…` path.

The logos are **uploaded assets**, not published files. Their ids are recorded
in `project/design-system.json` under `assetGroups.Logos.files`. The copies under
`project/assets/Logos/` are the masters kept in git — re-upload them only if a
mark actually changes.

## Starting a second copy from another account

A second Claude account cannot see the artifact above. It publishes its own:
create one from the Design System artifact type with a title and no files, then
publish this folder to the url that comes back. Same source, same result.

## What is deliberately not here

**There is no React bundle.** Each component preview is a static rendition —
plain markup styled by this system's own tokens, faithful to the shipped values,
but not the shipped component. A bundle would only be needed to make the
previews run the real `Button` and `ProjectCard`, which nothing currently needs.
