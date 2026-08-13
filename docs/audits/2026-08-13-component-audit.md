# Component-layer structural debt audit — 2026-08-13

**Status:** input to a later planning pass. Not a live doc. Nothing here has been
actioned, and no code was modified in this pass.

**Question this was commissioned to answer:** Build Phase 5 scopes
`contact-form.tsx` and `concierge.tsx` for refactor. That scope was set before
anyone measured the rest of `components/`. Are those two files the whole problem
or the visible part of a wider one?

**Answer, up front:** they are *not* the whole problem, but the wider problem is
**not more oversized files** — it is a small set of cross-file duplications, two
of which sit in exactly those two files and one of which is an accessibility
primitive copied verbatim between two components neither of them touches. Phase 5
should be widened by roughly three items, not rescoped.

---

## 1. What was audited

| Area | Files | Lines | Coverage |
| --- | --- | --- | --- |
| `components/` | 30 | 3,530 | **All 30 read in full** |
| `lib/` | 15 | 1,442 | Read in full: `validation.ts`, `utils.ts`, `status.ts`. Skimmed for component-facing duplication: the rest. |
| `app/actions/` | 1 | 393 | Read in full |
| `hooks/` | — | — | **Does not exist.** See §6. |

Cross-referenced: `app/api/concierge/route.ts`, `content/`, `config/solutions.ts`.

Churn is measured from `git log --name-only` over the full history of each path,
and is used as the tie-break for ranking — a duplication in a file edited ten
times costs more than the same duplication in a file edited twice.

---

## 2. Every file over 300 lines

Only **two files in `components/` exceed 300 lines.** That is the single most
useful measurement in this audit: the "oversized files" hypothesis is largely
false, and the fact that the two known files are also the two most-churned files
(10 commits each, the top of the table) means Phase 5 already picked the right
two targets — it just picked them for the wrong reason.

| File | Lines | KB | Commits | Verdict |
| --- | --- | --- | --- | --- |
| `components/concierge/concierge.tsx` | 709 | 36.1 | 10 | **Leave as-is, extract one seam.** Size is not the defect. |
| `components/contact-form.tsx` | 428 | 19.4 | 10 | **Extract to a local component** — repetition, not size. |
| `app/actions/contact.ts` | 393 | 17.5 | 5 | **Leave as-is.** Already decomposed correctly. |

### `concierge.tsx` — 709 lines, and size is not the defect

Stated explicitly because the obvious recommendation is wrong here. The file
holds eleven `useEffect` blocks, and they are **mutually coupled by design**, not
by neglect:

- `sheetRef` (`concierge.tsx:198`) exists specifically so the focus effect at
  `:282` can read sheet mode *without* taking it as a dependency — the comment at
  `:193-197` documents a live Android soft-keyboard loop that a dependency would
  reintroduce.
- The auto-close dwell (`:318-322`) is guarded on `open`, `captured`, `stayOpen`
  and `busy` together; each guard is a separate reversal of a documented decision.
- The launcher's visibility (`:480`) ANDs four inputs, two of which come from
  different subsystems (an IntersectionObserver and the counted suppressor bus).

Splitting these into separate hook files would move the coupling across a module
boundary without removing it, and would put the `sheetRef` comment further from
the effect it protects. **The line count is mostly prose** — 36.1KB over 709
lines is ~51 bytes/line, roughly double the repo's average, because the file
carries its own incident history inline. That documentation is load-bearing under
this project's conventions and should not be treated as bulk.

**The one real seam is transport, not size.** See finding **C3** below.

### `contact-form.tsx` — 428 lines, repetition rather than size

The Zod schema at `:48-78` looks like it duplicates `app/actions/contact.ts:92-141`
but **does not** — the asymmetry on `message` is deliberate and documented at
`:59-66` and `contact.ts:111-122`, and the shared half already lives in
`lib/validation.ts`. That is correct and should not be touched.

The actual weight is eight near-identical label/input/error triples across
`:256-303` (step 1) and `:322-418` (step 2). See finding **C4**.

### `app/actions/contact.ts` — 393 lines, already correct

Decomposed into `crmPayload` (`:235`), `recordFailure` (`:261`), `deliver`
(`:280`), `sendToCrm` (`:289`), `sendEmails` (`:347`). Each has one job and the
failure-recording path is centralised so neither channel can be forgotten. **No
action.** Listed only because it crosses 300 lines.

---

## 3. Duplicate logic — concrete pairs

### C1. `prefers-reduced-motion` has four independent implementations

The highest-value finding in this audit, and it is in neither Phase 5 file.

| Site | Form |
| --- | --- |
| `components/load-sequence.tsx:45-55` | `useReducedAfterMount()` — state + `matchMedia` + `change` listener |
| `components/process-steps.tsx:43-49` | **Character-identical body**, inlined, not named |
| `components/reveal.tsx:38` | One-shot `.matches` read inside the effect, no listener |
| `components/concierge/concierge.tsx:164` | Motion's `useReducedMotion()` |

`load-sequence.tsx:47-53` and `process-steps.tsx:44-48` are the same five
statements in the same order:

```
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
const apply = () => setReduced(mq.matches);
apply();
mq.addEventListener('change', apply);
return () => mq.removeEventListener('change', apply);
```

One of them is already extracted into a named hook (`useReducedAfterMount`) and
lives in a component file, so `process-steps.tsx` cannot import it without
importing the load sequence. That is the whole reason it was copied.

**Why this ranks first:** it is an accessibility floor, the project has an active
motion workstream (Phase 1), and `prefers-reduced-motion` behaviour is
structurally hard to verify on this machine — CLAUDE.md records that animations
are off machine-wide, so a divergence between these two copies would not surface
in local verification. Two copies of an invariant that cannot be observed locally
is the worst combination available.

**Note on `reveal.tsx:38`:** its read is genuinely one-shot — no `change`
listener — so a visitor toggling the OS preference mid-route does not re-arm
reveals until the next navigation (the effect is keyed on `pathname`). Whether it
should adopt the shared hook is a **judgment call**, not a settled
recommendation: subscribing would mean deciding what happens to already-revealed
elements when the preference flips. Flagged, not prescribed.

### C2. The outcome block is written three times

An identical dot + bold label + muted body, at three sites in the two
highest-churn files:

| Site | Tone |
| --- | --- |
| `components/contact-form.tsx:179-192` | success — "Message sent" |
| `components/concierge/concierge.tsx:659-673` | success — "Details received" |
| `components/concierge/concierge.tsx:675-689` | error — "Didn't send" |

All three share the byte-identical wrapper
`flex items-center gap-2 text-[0.875rem] leading-[1.55] tracking-[0.04em]`
(`contact-form.tsx:180`, `concierge.tsx:661`, `concierge.tsx:677`), the
byte-identical dot `h-[6px] w-[6px] flex-none rounded-full` (`:183`, `:664`,
`:680`), and the same `mt-[14px] … text-secondary` body paragraph. They differ
only in the token (`--tg-success` / `--tg-error`) and the strings.

**Proposed:** a local `OutcomeBlock({ tone, label, children })`. **Call sites:
exactly the three above** — no more.

**Two near-misses that are NOT call sites**, and should not be folded in:

- `components/status-line.tsx:66-70` — same 6px dot, but the signature component
  has a two-state structure (`live` splits into ink label + muted stamp;
  unreachable is a single muted string), `font-mono`, `tabular-nums`, and an
  `onInk` branch. Documented at `:23-37` as deliberately structured that way.
- `components/footer-dark.tsx:164` — same 6px dot markup, but it is a solution
  accent dot painted from `accentForSolution(...).hex`, not a status. Folding it
  in would put an accent colour into a status primitive, which the four-accent
  rule forbids.

Whether the contact form and the concierge *should* share this at all is a
**judgment call**: they are two surfaces of one design language, and a human may
prefer they retain the freedom to diverge.

### C3. Two mechanisms for one scroll lock, with incompatible restore strategies

| Site | Restore |
| --- | --- |
| `components/nav.tsx:74-79` | `document.body.style.overflow = ''` — **unconditional clobber** |
| `components/concierge/concierge.tsx:326-333` | saves `previous`, restores it |

The concierge's version is correct; the nav's discards whatever was there. These
two can overlap in principle — the drawer suppresses the launcher
(`nav.tsx:72`), but nothing prevents the panel being open when the drawer opens,
and in sheet mode both would write the same property. The nav closing would then
release a lock the concierge still wants.

Not observed in the wild, and the drawer/panel interaction may make it
unreachable in practice — but it is two implementations of one global mutation
with different contracts, which is worth one shared helper regardless of whether
the race is currently live.

### C4. The scroll-position flag, twice

`components/nav.tsx:43-48` (`scrollY > 24`) and
`components/concierge/concierge.tsx:205-210` (`scrollY > innerHeight * 0.85`) are
the same shape: state, passive listener, immediate call, cleanup.

`components/process-steps.tsx:51-79` looks like a third but **is not** — it reads
element rects and also listens to `resize`. Do not fold it in.

Two call sites is thin for an extraction. Reported for completeness and ranked
accordingly, **not** recommended on its own.

### C5. The `mailto:` fallback link, five times, three treatments

`components/nav.tsx:234`, `components/footer-dark.tsx:201`,
`components/contact-form.tsx:423`, `components/concierge/concierge.tsx:700`,
`app/error.tsx:26`.

Two different tap classes (`tap-44` at nav/footer, `tap-24` at contact-form and
error) and three different colour treatments. The tap-class split is defensible —
tier depends on neighbour spacing, and CLAUDE.md is explicit that adjacency must
be checked per site — so this is **inconsistency worth documenting, not
necessarily worth unifying.** A shared component that has to take the tap tier as
a prop buys very little.

### C6. The eyebrow type treatment, 24 occurrences

`text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] uppercase` appears at 24
sites across 9 files — `components/page-hero.tsx:36` and `:89`,
`components/footer-dark.tsx:150`/`:174`/`:196`, `components/contact-form.tsx:87`,
`components/concierge/concierge.tsx:141`, `components/live-frame.tsx:177`,
`components/solution-tag.tsx:36`, and eleven more in `app/`.

**Deliberately not proposed as a component.** Under this project's cascade rules
a shared utility class would have to be positioned against unlayered rules in
`globals.css`, and the colour varies per site (`text-secondary`, `#747C8B`,
`onInk` ternaries, accent text). The safe form is a token or a `@layer`
utility, which is a **DESIGN.md/TOKENS.md decision and out of scope for this
audit.** Recorded so the count is on the table.

---

## 4. UI/logic coupling worth separating

### S1. The concierge's transport is inline in the view — and its error copy has already drifted

`components/concierge/concierge.tsx:401-436` embeds the whole client/server
contract in the component body:

- the endpoint literal `'/api/concierge'` (`:413`)
- the request shape (`:416`)
- three response-field assumptions — `data.reply`, `data.leadCaptured`,
  `data.capReached` (`:424-426`)
- two hardcoded error strings (`:421`, `:428-430`)

**The drift is already measurable.** `concierge.tsx:429` renders:

> `Something broke on our end — not yours. Try again in a moment, or email ${site.publicEmail}.`

while `app/api/concierge/route.ts:80` defines `ERROR_REPLY` as:

> `Something broke on our end — not yours. Try again in a moment, or email ${site.publicEmail} and we'll pick it up from there.`

Same failure, two different sentences, depending on whether the request reached
the route or died in transit. Neither file references the other. This is exactly
the drift `lib/validation.ts` was written to prevent on the form path — and the
concierge path never got the equivalent.

**Proposed:** a `lib/concierge/client.ts` holding the endpoint, the response type,
and the shared fallback copy, imported by both the component and the route.
**Call sites: `concierge.tsx:413` and `route.ts:80`.** This is the one extraction
`concierge.tsx` genuinely wants, and it is ~35 lines, not a split.

### S2. `contact-form.tsx` — eight hand-wired field triples

`:256-303` and `:322-418` repeat label + control + conditional `FieldError` eight
times (projectType, name, email, company, phone, website, message, budget). The
`field` and `label` class constants at `:82-87` already acknowledge the pattern;
only the markup was never lifted.

This is **local extraction, not a shared component** — the distinction matters
under the "don't propose a shared component without naming every call site" rule.
The consumer is one file with eight internal uses; it should stay in
`contact-form.tsx` unless and until a second form exists.

**The a11y wiring is the hard part and must survive verbatim**, which is why this
ranks below its raw line count:

- `aria-describedby` is **conditional** at `:352` because the hint element is
  *replaced* by the error rather than stacked (documented `:340-345`).
- `aria-invalid` is `true | undefined`, never `false` (`:353`, `:380`).
- The phone field takes a wrapped `onChange` (`:355`) that must not be
  generalised — `capPhoneDigits` counts **digits**, and CLAUDE.md records a prior
  bug where this was made a character cap.
- The `key="step-1"` / `key="step-2"` discipline at `:255`/`:322` is load-bearing
  and sits *outside* any field abstraction. An extraction must not move it.

### S3. `process-steps.tsx` — scroll measurement embedded in the view

`:51-79` computes progress and the active index from element rects inside the
component. The measurement logic (reference line at 45% viewport, span from first
top to last bottom, active = last step whose top has crossed the line) is real
domain logic sitting in a render file, and it is the exact code a prior incident
corrected — the file's own header at `:26-35` documents the readout running a
step and a half ahead.

**Low priority despite being genuine coupling:** 5 commits, one consumer, and the
logic is inseparable from the four step refs it reads. Extracting it to a hook
would need the refs passed in, which is most of the coupling preserved. Recorded;
not recommended for Phase 5.

---

## 5. What is not debt (do not "fix" these)

Called out because each looks like a finding at a glance:

- **`lib/validation.ts`** — the model the rest should follow. One module, shared
  by the client schema (`contact-form.tsx:24-30`) and the server schema
  (`contact.ts:9`), test-covered, wired into `prebuild`. The client/server
  asymmetry on `message` is deliberate and documented on both sides.
- **`app/actions/contact.ts`** — 393 lines, already decomposed (§2).
- **`components/button.tsx:44-48`** — the `text-[14.5px]/[1]` slash modifier looks
  like a style quirk; it is a tailwind-merge fix documented at `:28-43`. Do not
  "clean up" into a separate `leading-*`.
- **`components/concierge/panel-motion.ts`** — duplicates the motion token values
  from `globals.css`, which looks like drift. It is pinned by
  `panel-motion.test.ts` and the duplication is forced (Motion's JS API cannot
  read a CSS custom property).
- **`SolutionTag` / `AccentDot` / `PullQuote` / `FlourishMark` / `SignatureStripe`**
  — all already single-source through `config/solutions.ts`. No accent value is
  re-derived anywhere.
- **`components/concierge/markdown.tsx`** — 149 lines of parser. Cohesive, one
  job, no consumer outside the concierge.

**One systemic issue identified but deliberately not actioned:** the `onInk`
pattern — 50 occurrences across 9 files re-deriving `#F5F5F5` / `#9CA3AF` /
`#2A2A2C` by ternary (`live-frame.tsx:87`,`:151`,`:174`,`:178`,`:184`;
`status-line.tsx:56-57`; `page-hero.tsx:84`,`:96`; `pull-quote.tsx:41`;
`solution-tag.tsx:41`; and hardcoded without the prop in `footer-dark.tsx:61` and
`testimonial.tsx`). The correct fix is dark-context tokens, which lands in
`TOKENS.md` and the `check:design` prebuild guard — **explicitly out of this
audit's scope.** Flagged for a human.

---

## 6. There is no `hooks/` directory

The scope fence anticipated one; it does not exist. Client-side logic currently
lives in three places with no stated rule:

- exported from a component file — `useSuppressLauncher` /
  `useLauncherSuppressed` in `components/concierge/concierge-bus.ts`,
  `useReducedAfterMount` in `components/load-sequence.tsx`
- inlined in the consuming component — `process-steps.tsx:43`, `nav.tsx:43`
- in `lib/` — nothing hook-shaped currently

`concierge-bus.ts` is the good precedent: a `.ts` file beside its consumers
holding a real cross-tree mechanism with its rationale. **Findings A1 and C3
below both need a home, and picking it is a decision, not a mechanical move.**
Recommend deciding `hooks/` vs `lib/hooks/` vs "beside the consumer" *before*
executing Phase 5, so three items don't each land somewhere different.

---

## 7. Prioritised list

Single ranked list, highest pain first.
Score = (Impact + Risk) × (6 − Effort), each 1–5. Churn breaks ties.

| # | Finding | Sites | I | R | E | Score | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **`prefers-reduced-motion` duplicated verbatim** (C1) | `load-sequence.tsx:45-55`, `process-steps.tsx:43-49` | 3 | 4 | 1 | **35** | Extract one hook. A11y floor, unverifiable locally, active motion workstream. |
| 2 | **Outcome block ×3** (C2) | `contact-form.tsx:179-192`, `concierge.tsx:659-673`, `concierge.tsx:675-689` | 4 | 2 | 1 | **30** | Local `OutcomeBlock`. Both files are top-of-table churn (10 commits each). |
| 3 | **Concierge transport inline + error copy already drifted** (S1) | `concierge.tsx:401-436`, `route.ts:80` | 3 | 4 | 2 | **28** | `lib/concierge/client.ts`. The one seam `concierge.tsx` actually wants. |
| 4 | **Contact form: 8 hand-wired field triples** (S2) | `contact-form.tsx:256-303`, `:322-418` | 4 | 2 | 2 | **24** | Local `<Field>`. Ranked above #5 on churn. a11y wiring must survive verbatim. |
| 5 | **Scroll lock, two incompatible restores** (C3) | `nav.tsx:74-79`, `concierge.tsx:326-333` | 2 | 3 | 1 | **25** | Shared helper; adopt the concierge's save/restore contract. Ranked below #4 — the lines are rarely edited. |
| 6 | **`onInk` hardcoded ×50** (§5) | 9 files | 3 | 3 | 4 | **12** | **Human decision.** Fix is dark-context tokens → `TOKENS.md` + `check:design`. Out of scope here. |
| 7 | **Eyebrow treatment ×24** (C6) | 9 files | 2 | 1 | 2 | **12** | **Human decision.** Token or layered utility, not a component. |
| 8 | **Scroll-position flag ×2** (C4) | `nav.tsx:43-48`, `concierge.tsx:205-210` | 1 | 1 | 1 | **10** | Only worth doing if #5 lands — same two files, same visit. |
| 9 | **`mailto:` fallback ×5** (C5) | 5 files | 1 | 1 | 1 | **10** | Probably leave. Tap-tier variance is legitimate. |
| 10 | **`process-steps.tsx` scroll measurement in view** (S3) | `process-steps.tsx:51-79` | 2 | 1 | 3 | **9** | Leave. Extraction preserves most of the coupling. |

### What this means for Phase 5

Phase 5 picked the right two files but scoped them by size. The measured picture:

- **`concierge.tsx` should not be split** — one ~35-line transport extraction
  (#3), and the remaining 670 lines stay.
- **`contact-form.tsx` gets a local `<Field>`** (#4) — the schema is already
  correct and must not be touched.
- **Add items #1, #2 and #5**, none of which Phase 5 currently covers and one of
  which (#1) does not touch either Phase 5 file.
- **Decide where hooks live (§6) before starting**, or #1 and #5 land in
  different places.

Items #6 and #7 are real but belong to a token pass, not a component refactor.
