# KB · AI Meeting Notepad *(working name "Squid Ink")*

> **Name warning — this is the first thing to know about this product.**
> "Squid Ink" is a **working name only.** The public app name is unconfirmed
> and was reopened by the owner on 2026-08-30; an earlier note locking it to
> "Crispy Bacon" was reversed. The code carries no name string anywhere except
> `package.json`'s `name` field, and user-facing copy stays generic.
>
> **This is why tekguyz.com calls the entry "AI Meeting Notes & Transcription"
> and never "Squid Ink".** The poster file is `squid-ink.webp` because a
> filename is wiring, not copy.

---

## 1. At a glance

| | |
| --- | --- |
| Repo | `tekguyz/squid-ink` (local folder `tekguyz-squid-ink`) |
| Source commit | `dc7ea1e` |
| Compiled | 2026-09-03 |
| Deployed | `https://squid-ink.vercel.app`, auto-deploys from `main`, Vercel **Hobby** |
| Site entry | `/work/ai-meeting-notes` (case study) |
| Public access | Email magic-link sign-in. No demo account. |
| Payments | **Explicitly out of scope, everywhere** |

**Scale assumption, and it is load-bearing:** single-owner, indefinitely. No
organizations, no workspaces, no admin roles, no seats. Team-switcher UI in the
early design mockups was cosmetic scaffolding, not scope. A retrofit path is
recorded (additive `organizations` + `organization_members` tables, a nullable
`notes.organization_id`, widened RLS) but is not being built.

---

## 2. The problem it solves

A **bot-free AI meeting notepad.** It captures system and microphone audio
directly in the browser — **no bot joins the call** — transcribes it with the
speakers separated, and turns the transcript into structured output (summary,
takeaways, action items) that stays traceable back to the exact spot in the
transcript that supports it.

The target comparison is Granola: the same core loop, with a better persona
system, a denser reading surface, and real documentation.

---

## 3. Why it was built

It is a **full rewrite** of a prior build, `tekguyz/crispy-bacon` — React 18 /
Vite / Netlify / Supabase / Gemini, vibe-coded in Google AI Studio.

Reasons recorded in the repo's `docs/DECISIONS.md`:

- The prior build processed synchronously and died on **Netlify Functions' 10
  second timeout**, with no WebSocket support. **That was the root cause — not
  the framework.** Vercel Fluid Compute's 300 seconds removes it.
- Its visual language, copy, brand and docs were discarded wholesale. Nothing
  carried over except the **feature inventory** and the product philosophy:
  dense over noisy, truth-first, no AI fluff.
- No data, user or auth migration. Its only users were the owner's second
  account and one friend; Stripe was sandbox-only.
- **No code audit of the prior build** — auditing code that is being deleted is
  wasted effort.

> **Site consequence, recorded here so it does not get re-litigated.**
> `crispy-bacon.netlify.app` shipped on tekguyz.com as its own project entry,
> "Automated Meeting & Research Organizer", until 2026-09-04. It was **the same
> product one rewrite earlier**, so the site was showing one thing twice with
> the worse version presented as separate work. It was retired in the same
> change that added this one.

---

## 4. What it actually does

### 4.1 Capture — shipped

A persistent **record HUD** is mounted once in `app/layout.tsx` — ambient, not
calendar-gated. Start, stop, pause, timer, mic level. Its Zustand store lives at
**module scope**, so navigation never resets it.

Mechanics worth knowing:

- `getDisplayMedia` is called with `video: true` even though no video is
  recorded. **Chromium will not offer tab or system audio for an audio-only
  display request.** The video track is stopped the moment it arrives.
- `MediaRecorder` records the **Web Audio destination node's** stream, never the
  mic stream directly. That indirection is what lets `replaceMic()` swap a
  microphone mid-recording without ending the recording.
- The mic constraint is exactly `{ echoCancellation: true }`.
  `noiseSuppression` and `autoGainControl` are off, deliberately.
- Codec strings are **feature-detected** (`lib/recorder/codec.ts`), WebM ahead
  of MP4. Never hardcoded.
- Audio uploads straight to Supabase Storage at `{user_id}/{note_id}` — two
  segments, that order, no extension. **That shape is what the three Storage RLS
  policies check.** It is not a naming preference.
- The `notes` row is written when the upload **starts**, at
  `processing_status = 'uploading'`, because the path is deterministic.
- A local IndexedDB backup blob is kept.

### 4.2 Transcription — shipped

**`processing_status` *is* the queue.** There is no job table. States:
`local → uploading → analyzing → completed`, plus a terminal `failed`.

- The claim is one statement:
  `UPDATE notes SET processing_status = <next> WHERE id = <id> AND processing_status = <expected> RETURNING id`.
  Postgres row-locks the match, so a concurrent invocation matches nothing. **A
  zero-row claim must not spend a Gemini call.**
- **Two triggers, one claim:** a daily Vercel cron sweep
  (`/api/cron/transcribe`, `0 7 * * *`) and a user-pressed **Transcribe** button
  on Note Detail (`triggerTranscription` Server Action, shipped 2026-09-01).
  Both call `claimNoteForTranscription`.
- **Stopping a recording does not auto-transcribe.** Deliberate: on an ambient
  recorder a mis-started recording is a real failure mode, and burning a
  transcription on one is worse than one extra click.
- Object existence via `list()` is the safety check, **not age**. `download()`
  is used exactly once, to move bytes to Gemini — Storage reads are CDN-cached
  and prove nothing about a write.
- Staleness is measured on `updated_at`, never `created_at`.
- Model: **`gemini-3.5-transcribe`**. Diarization is a pure function of duration
  (`diarization-policy.ts`): on by default, off past **28 minutes** — a
  deliberate 2-minute margin under Gemini's 30-minute diarized cap — and past
  **60 minutes** no call is made at all, just a log line. No segmentation, no
  stitching.
- The speaker label Gemini returns is an **opaque cluster id** (a real
  single-voice recording came back as `"spk:7"`). Speakers are numbered by first
  appearance, **never by digits parsed out of the label.**

### 4.3 Structured note generation — shipped 2026-09-02

`notegen_status` is its own queue on the same row — nullable, no default, and
**null means "not eligible yet"**. There is no `'pending'` string. Values:
`generating | completed | failed`.

- The claim is one statement with **two** conditions:
  `... WHERE id = <id> AND processing_status = 'completed' AND notegen_status IS NULL RETURNING id, persona_id`.
  The `processing_status` clause makes "cannot generate notes before a
  transcript exists" true **by construction**.
- `persona_id` rides out on that `RETURNING` on purpose. A second `select` could
  read a write that landed between the two, generating under a lens the owner
  had already moved away from.
- Model: **`gemini-3.7-flash`**, one call per note, **text transcript only** —
  the pipeline never sees the audio. `inputTokenLimit` is 1,048,576 and a
  60-minute transcript is near 12,000 tokens, so context is not a constraint.
- Depth maps to Gemini's `thinking_level` **plus a prompt scope**
  (`depth-policy.ts`): brief → `low`, decisions and actions, no summary; dense →
  `medium`, balanced; exhaustive → `high`, cross-referenced.
- Generated chunks always write `persona_id: null` and `embedding: null`.
- **The first run replaces the seed note's hand-written takeaways.** Designed
  behaviour — those rows were a fixture standing in for this pipeline.

### 4.4 Personas / lenses — shipped

A Persona bundles three things Granola splits into two confusing systems:
**Lens** (whose expertise frames the analysis), **Depth** (brief / dense /
exhaustive), and **Quick actions** (lens-specific recipes).

Four built-in personas, all rows in `public.personas`, provisioned per account
by a `security definer` trigger on `auth.users`:

| slug | name | framing | depth |
| --- | --- | --- | --- |
| `neutral-analyst` | Neutral Analyst | dense · no framing | dense |
| `sales-coach` | Sales Coach | coaching · direct | dense |
| `investor` | Investor | economics · risk | dense |
| `engineering-lead` | Engineering Lead | scope · sequencing | dense |

Rules:

- **Persona identity is the slug** — never the display name, never the uuid.
  `unique (user_id, slug)` is the declared constraint; `name` carries none. The
  client never sees a uuid.
- Lens framings are a static lookup keyed by slug in
  `lib/notegen/lens-prompts.ts`. An unrecognised slug **falls back to neutral
  rather than throwing.**
- **Per-note lens selection shipped 2026-09-02.** The rail on Note Detail writes
  `notes.persona_id` behind a guard:
  `processing_status IN ('local','uploading') AND notegen_status IS NULL`. The
  `processing_status` clause is the load-bearing one — pressing Transcribe
  leaves `notegen_status` null for the whole transcription, so guarding on
  `notegen_status` alone would leave a minutes-long window where the rail shows
  one lens and generation uses another.
- The rail's `disabled` attribute is UX; **the SQL guard is the enforcement**,
  because a Server Action is a public HTTP endpoint.
- Seeding on mount is a **real write**, never a visual default, and never
  happens on a frozen note.
- The user's last choice is remembered as a slug in **Auth user metadata**, not
  a table.
- **Regeneration is rejected** (2026-08-30). Persona edits apply to new notes
  only. Ask-your-notes chat is the answer to "how would a Sales Coach read
  this?", not a paid re-run.
- Resolution order for which persona row drives generation:
  1. `notes.persona_id`, scoped by **both** id and `user_id` → `source: "note"`
  2. slug `neutral-analyst` for that user → `source: "row"`
  3. `DEFAULT_PERSONA_FALLBACK` → `source: "fallback"`, for accounts predating
     the 2026-08-31 trigger, deliberately not backfilled

  A set `persona_id` that resolves to nothing **falls through to step 2 rather
  than throwing** — a lens deleted between selection and generation is real, and
  refusing to generate is worse.

### 4.5 Note Detail UI — shipped

`/notes/[id]` is a server component that fetches through
`lib/notes/get-note.ts` and shapes with `note-view-model.ts`. It renders a
client shell containing: note header, audio player (play/pause, mm:ss clock,
seek bar), persona rail, summary, takeaways, action-items table, speaker
insights, waveform, transcript pane with citation chips, the Transcribe button,
and a chat composer.

A bounded **poll** (`use-transcription-poll.ts`, 5 second interval, 10 minute
cap) refreshes the page when a watched note goes terminal. It is explicitly
*not* a Realtime subscription.

### 4.6 Auth

Supabase email / magic-link. **Google OAuth is deliberately not tied to login** —
it stays a separate "Connect Calendar/Drive" action, which removes the
"unverified app" warning from the sign-in flow. `/login` and `/auth/confirm`
handle both the PKCE `?code=` and `token_hash` shapes.

---

## 5. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.3.3, App Router, React Server Components |
| UI | React 19.2.8, TypeScript 7.0.2 |
| Styling | Tailwind CSS v4.3.3, CSS-first `@theme` tokens |
| Client state | Zustand 5.0.15 — ephemeral UI only |
| DB / Auth / Storage | Supabase (`@supabase/ssr` 0.12.5, `supabase-js` 2.112.4) |
| Vector store | Supabase pgvector — schema and index only, **unused** |
| AI SDK | `@google/genai` 2.19.0 |
| Tests | Vitest 4.1.11, Testing Library, jsdom, fake-indexeddb |
| Hosting | Vercel, **Hobby plan** |
| Payments | None |

Versions are **pinned exact** — no `^`, no `~` — and verified against the live
npm registry, never from model memory. Built on Node v24.18.0 / npm 11.16.0.

### Model and vendor split — by task, not ideology

| Surface | Vendor |
| --- | --- |
| Batch transcription + diarization | Gemini 3.5 Transcribe |
| Structured note generation | Gemini 3.7 Flash — **no Gemini Pro anywhere** |
| Multimodal ingestion *(planned)* | Gemini 3.7 Flash |
| Ask-your-notes chat *(planned)* | Claude (Sonnet / Opus) |
| Live voice reasoning *(planned)* | Claude via Vapi |
| RAG embeddings *(planned)* | Voyage AI `voyage-3-large` |

Claude Code is the **build tool only** — it has no runtime role in the shipped
app.

> **Open action item, carried forward:** confirm the Gemini key in use is a
> **billed** key, not the original free AI Studio key, before real meeting
> content flows through the app. The free tier is used for training; the paid
> tier is not.

---

## 6. Architecture worth knowing

**Status columns as queues.** Both pipelines use a status column on `notes` as
the queue, with a single guarded `UPDATE ... RETURNING` as the claim. No job
table, because a queue table is a second source of truth that can disagree with
the first. Both return tagged unions rather than nullable booleans, so "claimed
with no persona" and "lost the race" stay distinguishable.

**One clock, two phases.** The cron route reads **one** `startedAt` and hands
phase two `startedAt + RUN_BUDGET_MS` (240 s) as a deadline. Two independent
240-second budgets under Hobby's 300-second ceiling would be a run killed
mid-write. `MAX_TRANSCRIPTIONS_PER_RUN = 3`; `MAX_NOTEGEN_PER_RUN = 5`, because
a text call returns in seconds where audio transcription takes minutes. Caps
count **model attempts**, so a contended claim or a blank transcript spends no
slot.

**Rollback by staleness, not by transaction.** Chunk writes precede the
`'completed'` flip. A partial insert leaves the row at `'analyzing'` or
`'generating'`, and the staleness sweep fails it later — **that existing net is
the rollback.** No transaction, no compensating write; a second mechanism for
one failure is a second thing to get wrong.

**Colour tokens.** `app/globals.css` is the **only** file that names a colour.
Every token is defined twice (light on `:root`, dark on `.dark` and under
`prefers-color-scheme`) and exposed through `@theme inline`. Components use
generated utilities and never branch on theme. **A convention test fails the
build if a colour literal appears anywhere in `components/` or `lib/`.**
Typography is three faces only: Bitter (headers and numerals), Archivo (body
and UI), IBM Plex Mono (time, counts, metadata), loaded via `next/font/google`.

**File layout.** Grouped by feature, **at most one folder deep.** No FSD, no
atomic design, no generic `utils/` or `common/`. Soft ceiling 250 lines, hard
400, enforced by a convention test on **shipped files only** — test files are
excluded on purpose, because a long test file is quantity, not coupling.

**Security posture.**

- Four **per-operation** RLS policies per table (select / insert / update /
  delete), never one blanket `for all`. The predicate is always
  `(select auth.uid()) = user_id`, **wrapped**, so it is not re-evaluated per
  row. UPDATE carries both `using` and `with check`.
- Application queries **never filter on `user_id`** — RLS supplies it, and a
  redundant filter would mask an RLS failure. The one deliberate exception is
  the cron path, which runs as `service_role` and bypasses RLS entirely.
- Foreign keys between two user-owned tables are **composite**, carrying
  `user_id`. A foreign key is validated as the referenced table's owner and is
  **not subject to RLS**, so a single-column reference would let one user point
  at another user's row. Proved refused with a real cross-tenant insert
  (`23503`).
- `service_role` holds `select, insert, update, delete` on `public.notes` and
  `public.note_chunks`, and nothing else. Before 2026-08-31 it held only
  `REFERENCES, TRIGGER, TRUNCATE`, and every cron read failed with `permission
  denied`. **A grant is not a policy** — it already bypassed RLS, it simply
  could not reach the tables.
- The secret key is **never** `NEXT_PUBLIC_`-prefixed. Exactly one shipped file
  reads it, enforced by a convention test.
- `/api/cron` is in `PUBLIC_PREFIXES` and **must stay there.** A cron request
  carries no cookies, the session middleware would redirect it to `/login`, and
  **Vercel cron does not follow redirects** — so the sweep would silently never
  run while the job reported success. Its `CRON_SECRET` bearer check is the
  authorization; an unset secret refuses everything rather than failing open.

**Schema workflow.** `supabase/schemas/*.sql` is the source of truth, applied in
**explicit dependency order** from `config.toml` — never a glob, which would
sort `note_chunks.sql` before `notes.sql`. Order: `notes`, `personas`,
`note_chunks`, `persona_provisioning`, `storage_audio`. `notes.persona_id`'s
foreign key is declared in **`personas.sql`**, not `notes.sql`, because
`notes.sql` is applied first and a reference to `public.personas` there would
not resolve on a fresh apply. The column stays with its table; only the
constraint waits.

**There is no local Supabase stack — Docker is not installed on that machine.**
`db pull` and `db dump` both fail without it. Everything runs against the linked
hosted project through the management API. `db diff` is unavailable, so changes
are verified by reading the live catalog back.

**Deferred client.** The manual note-gen path builds `createDeferredClient(...)`
**once** inside `after()` and passes the same instance to both port factories. A
second client can refresh, and a refresh after the response has been sent
rotates the refresh token into a cookie write that is silently dropped. Fixed
2026-09-01.

**Deployment specifics.**

- Vercel **Hobby**: cron may fire **once per day** — more frequent fails
  deployment outright — and `maxDuration` is **300 s**, both the default and the
  hard maximum. Consequence, stated honestly: **a recording can sit at
  `'uploading'` for up to 24 hours.** The route is callable on demand with the
  same bearer token, which is the current workaround.
- Per-deployment URLs are named from the **npm package** name, truncated:
  `squid-<hash>-tekguyz.vercel.app`, prefix `squid-`, **not** `squid-ink-`.
  Getting this wrong broke sign-in on 2026-08-30 with
  `400 pkce_code_verifier_not_found` and no useful signal. **Renaming the
  package or the Vercel project breaks it again, silently.**
- A non-allowlisted `redirect_to` does **not** error — it is silently replaced
  with the Site URL. That is why the allowlist table in the repo's
  `docs/DEPLOYMENT.md` is measured with `curl`, not read off a dashboard.
- Supabase's built-in mailer is rate-limited and not production-grade. Custom
  SMTP (Resend) is **not** configured. Fine at owner-plus-one scale.

---

## 7. Build status and known gaps

### Feature status

| Feature | Status |
| --- | --- |
| Record HUD — system + mic, no bots | **Shipped** |
| Direct-to-Storage audio upload, owner-scoped policies | **Shipped** |
| Audio playback on Note Detail | **Shipped** 2026-08-31 |
| Batch transcription + diarization | **Shipped** |
| Daily cron sweep + manual Transcribe trigger | **Shipped** |
| Structured note generation | **Shipped** 2026-09-02 |
| Four built-in personas + per-account provisioning | **Shipped** |
| Per-note lens selection with a freeze guard | **Shipped** 2026-09-02 |
| Note Detail screen | **Shipped** |
| Magic-link auth | **Shipped** |
| Dashboard / feed | **Throwaway scaffold only** — `app/page.tsx` says so in its own header |
| Ask-your-notes chat | **Not built.** The composer renders a hardcoded sample exchange and clears its input on submit |
| Embeddings / RAG retrieval | **Not built.** `note_chunks.embedding` is written `null`; the HNSW index exists and is empty |
| Realtime status push | **Not built** — a bounded poll instead |
| Transcript search control | **Drawn but inert** — a real focusable button with no handler |
| Google OAuth / Calendar connect | **Not built** |
| Import, collections/tags, share links, settings, onboarding | **Not built** |
| Live voice assistant (Vapi + Claude) | **Not built** — Advanced phase |
| PWA, brand assets, export, webhooks, MCP bridge, PII redaction | **Not built** |
| Persona delete | **Not built**, and blocked on an undecided re-attribution behaviour |
| Payments / Stripe | **Explicitly out of scope, anywhere** |

### Verified 2026-09-03, in that repo

- `npm run typecheck` — clean.
- `npm test` — **345 tests passed across 35 files.** The run also emitted 11
  unhandled `vitest-pool-runner` worker-start timeouts on that machine; **no
  test failed.** Treat the worker timeouts as environment flakiness, not as a
  known-good result, until reproduced on another machine.
- Working tree clean at `dc7ea1e`.

### Live verification scripts

None ship. All need `.env.local`.

```
node scripts/verify-rls.mjs                      # two-user RLS proof
node scripts/verify-storage-rls.mjs
node scripts/verify-persona-provisioning.mjs     # signup-trigger proof
node scripts/verify-recorder-upload.mjs          # live upload + note row
node scripts/verify-transcription-pipeline.mjs   # needs `npm run dev`
node scripts/verify-manual-transcribe.mjs        # double-spend proof
node scripts/verify-notegen-pipeline.mjs         # five proofs, calls counted
node scripts/verify-persona-selection.mjs        # six proofs
node scripts/print-signin-link.mjs               # local sign-in link
```

`verify-transcription-pipeline.mjs` synthesises its own speech with **Windows
SAPI**, so the transcript assertion is against known words. It is **not** wired
into `npm test` and should not be — it spends real Gemini quota.

### Gaps carried deliberately

The repo's `docs/KNOWN_GAPS.md` is 1,696 lines and is the detailed register.
Highlights:

- **A failed upload strands two things.** The row is reconciled in-session by
  `markUploadFailed()` (shipped 2026-09-01), but the audio blob stays in
  IndexedDB and **nothing reconciles that.**
- A narrow window can leave transcript chunks under a `'failed'` note. Left
  as-is; fixing it means the second mechanism the ordering exists to avoid.
- `MAX_TRANSCRIPTIONS_PER_RUN` bounds attempts, **not wall-clock.** An attempt
  starting at 239 s can run past the 300 s ceiling and be killed mid-flight. A
  per-call Gemini timeout would close it properly.
- Framed controls sit at **~1.4:1** against the sheet. Recorded, argued, left
  open — raising it is an app-wide token decision, not a one-component fix.
- Cancelling the screen-share picker kills the recording; there is no mic-only
  path.
- Nothing renders a live transcript while recording.
- Selected persona and active transcript segment are `useState` only, not
  deep-linked into the URL.
- Three HUD states are invented rather than taken from the design.
- Device handoff, real-world echo and Safari cannot be tested on that machine.
  They have a runnable manual checklist at
  `docs/qa/recorder-manual-test-protocol.md`. **Check the bitrate of every
  manual recording:** a muted mic yields ~2 kbit/s and otherwise looks like a
  complete success.

---

## 8. Hard rules

1. **No app name in code.** Only `package.json`'s `name`. User-facing copy stays
   generic.
2. **Every colour is a `var()` into `app/globals.css`.** A convention test fails
   the build otherwise.
3. **Never paste DDL inline into `db query`.** Edit the schema file, apply that
   exact file. Inline `db query` is for `select` verification only.
4. **Never call `apply_migration` while iterating** — it writes a migration
   history entry on every call and blocks further diffing.
5. **Never confirm a Storage upload with `download()`** — CDN-cached, returns
   the pre-overwrite body. Use the upload response or `list()`.
6. **Never hardcode a codec string.** Feature-detect.
7. **Never remove `/api/cron` from `PUBLIC_PREFIXES`.**
8. **Never send `custom_vocabulary` to Gemini** — HTTP 400 alongside diarization
   or timestamps.
9. **The two Gemini SDK surfaces disagree on casing** — `interactions.create` is
   snake_case, `files.upload` is camelCase. **Do not "make these consistent".**
10. **Do not edit `lib/transcription/sweep.ts` to handle `notegen_status`.**
    `lib/notegen/sweep.ts` owns that column, deliberately reimplemented.
11. **`deleteGeneratedChunks` must keep its `persona_id IS NULL` clause.** Its
    absence was a data-loss bug on 2026-09-02: the delete was wider than the
    insert and took out every lens-attributed takeaway on the note. Two tests
    pin it.
12. **Do not "fix" `border-rule-2` on one component.** App-wide token decision.
13. **Re-verify pinned versions against the live registry** before bumping.
    Never take a version from memory; never loosen a pin to a range.

---

## 9. Accuracy notes

Verified against the tree at `dc7ea1e` on 2026-09-03. Each item is a real
mismatch between that repo's docs and its code, not a style difference. **They
are recorded rather than resolved.**

1. **`KNOWN_GAPS.md:1632` — "No structured note generation and no embeddings."**
   The note-gen half is **wrong now**; the pipeline shipped 2026-09-02 and the
   stated consequence no longer holds. The embeddings half is still accurate.
   Fix: split the section, close the note-gen half.
2. **`KNOWN_GAPS.md:1290` — "No Realtime push."** Stale. A bounded poll refreshes
   the page. Realtime is still absent, but the stated user-visible symptom is
   fixed.
3. **`supabase/schemas/notes.sql:29`** comments `audio_storage_path` as a
   placeholder with "no bucket, no policies and no upload code". **All three
   shipped.**
4. **`DECISIONS.md` § Personas** — "no `auth.users` trigger provisions personas"
   is contradicted **inside the same file**, which records it RESOLVED
   2026-08-31. Delete the stale bullet.
5. **`DECISIONS.md` § Personas** — the "no persona-selection surface" paragraph
   is stale as of 2026-09-02, and `resolvePersonaFor` now checks
   `notes.persona_id` **first**.
6. **`DECISIONS.md` § Deployment** — says `docs/DEPLOYMENT.md` "needs a home".
   It exists, and the same file marks it RESOLVED. That section also repeats the
   SMTP paragraph verbatim, twice.
7. **`DECISIONS.md` / `ROADMAP.md` § State management** — both still read as
   though Realtime is what is built. The shipped code polls. The deviation is
   deliberate and reasoned in `KNOWN_GAPS.md`; the decision line was never
   updated.
8. **`CLAUDE.md` § Keys — "Six local-only scripts also read it."** There are
   **nine.** The file anticipates this and supplies the grep, but the printed
   list is out of date.
9. **`README.md` — "Note detail UI."** Materially understates the app: it now
   contains a recorder, two AI pipelines, auth, Storage, and a cron route.
10. **`ROADMAP.md` header — "Last updated 2026-08-30."** The file carries
    amendments dated 2026-09-01.
11. **`ROADMAP.md` §5 — "`thinking_level` (low/medium/high)."** The SDK union is
    `"minimal" | "low" | "medium" | "high"`. Not a bug — only three are used —
    but the casing distinction (lowercase union versus the SCREAMING_CASE
    `ThinkingLevel` enum on a *different* SDK surface) is a live 400-error trap
    that only `CLAUDE.md` records.
12. **`ROADMAP.md` §4 schema snippet** shows `note_chunks.persona_id` absent and
    a single-column FK. The shipped table has the column with a **composite**
    FK. Acknowledged drift, but the snippet is not current.

**Already self-corrected upstream — do not re-flag:** the `noiseSuppression`
paragraph in `CLAUDE.md` (corrected 2026-08-31), the failed-upload reconciliation
paragraph (2026-09-01), and the `SUPABASE_SECRET_KEY` line in
`docs/DEPLOYMENT.md`.
