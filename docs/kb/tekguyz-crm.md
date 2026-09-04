# KB · Lead & Pipeline CRM *(repo: `tekguyz-crm`)*

> **Naming.** The repository is `tekguyz-crm` and the live database holds a real
> `TEKGUYZ` organization. **The site entry is called "Lead & Pipeline CRM", not
> "TEKGUYZ CRM"** — a prospect reading `/work` should see a system they could
> have, not an internal tool of ours. The slug keeps the repo name for wiring.

---

## 1. At a glance

| | |
| --- | --- |
| Repo | `C:\Projects\tekguyz-crm` |
| Branch / commit | `main` @ `e1828d0` |
| Version | 0.1.0 |
| Last shipped work | 2026-08-28 |
| Compiled | 2026-09-03 |
| Deployed | `tekguyz-crm.vercel.app` |
| Site entry | `/work/tekguyz-crm` (case study) |
| Public access | **`/demo` only, shipped 2026-09-04.** One GET signs a visitor into a live seeded instance and redirects to `/` — no signup, no password, no email. The identity behind it is a **`demo_readonly` Postgres role holding SELECT and nothing else**, so a write is refused by the database, not the UI. `/demo` is **explicitly allowlisted** in `src/lib/supabase/middleware.ts` rather than inheriting the `/api/` exemption, because an accidental exemption is not a decision. **Everything else is unchanged:** the bare origin still 307s to `/login`, `robots: { index: false, follow: false }` still stands, and `/api/dev-login` keeps its `NODE_ENV === "development"` guard — that identity is an OWNER and stays development-only. |

> **Screenshot caveat — carry this into any copy.**
> `public/media/tekguyz-crm.webp` on the site is the real product's real Reports
> view, but the tenant shown is **`TEKGUYZ Demo`** and every figure on it —
> open pipeline, realized revenue, win rate — is **seeded verification data,
> not a client result.** It satisfies the "real production UI" rule and it
> licenses **no number** on the page.

---

## 2. The problem it solves

TEKGUYZ CRM tracks a business enquiry from the moment it arrives to the moment
it closes, and records what it was worth.

The product's own outward description, held as the single copy in
`src/lib/brand/copy.ts`:

> **"Track every lead from first enquiry to closed deal. Pipeline, follow-ups,
> and revenue in one place."**
>
> Tagline: **"Every lead, one pipeline."** Approved 2026-08-15. An earlier
> description — "Multi-tenant sales & operations CRM" — was replaced on
> purpose, because it described the architecture rather than the job.

Three concrete problems it exists to solve:

- **Enquiries arrive and get lost.** A website contact form posts straight into
  the CRM over a signed webhook, creating or updating a contact with nobody
  re-typing anything.
- **Follow-up slips.** Every lead carries a `next_action_at` date. When it goes
  overdue the lead visibly changes state — a dashed border and a desaturated
  badge, the *Going Cold* SLA signal — and it surfaces on the Today agenda.
- **Nobody knows what the pipeline was worth.** Leads carry `outcome` (WON /
  LOST / ABANDONED), `closed_at` and `actual_revenue`, so realised revenue is a
  **recorded fact** rather than something inferred from a lead being archived.

---

## 3. Why it was built

What the repository actually records about origin, and nothing more:

- It was built for **TEKGUYZ** and named for it.
- It has **one real external caller** over the webhook: the contact form on
  tekguyz.com, whose code lives in this repository. That form was updated here
  when webhook signing changed on 2026-08-18, and a real submission confirmed
  the deploy on 2026-08-19.
- **A second inbound path exists and is not a caller.** `tekguyz-leadgen`
  produces CSVs that a human imports at `/prospects/import`. It is a **file
  handoff, not an integration** — nothing writes to `import_prospects_chunk`
  automatically, by decision, and that repo's own status file says nothing will
  until a conversion signal exists. See [`leadgen.md`](leadgen.md). **Site copy
  must never describe this as automatic.**
- It was **multi-tenant from the schema up**, not retrofitted — tenancy was
  Prompt 2 of the original build, and a Principal Architect audit of that first
  schema produced the security rules in §6 before feature work continued.
- It was built as a **closed 15-prompt roadmap**, complete. Everything since is
  tracked as separate named post-launch initiatives, deliberately not as a
  continuation of that list.

**Not documented, and treat any such claim as unsourced.** No file in that repo
states the commercial reason the project was started, whether it replaced
another CRM, or whether it is intended to serve tenants beyond TEKGUYZ. The
multi-tenant architecture makes more than one organization possible; **no
document commits to that as a goal.**

---

## 4. What it actually does

### Application routes

| Route | What it is |
| --- | --- |
| `/` | **Today's Agenda** — the focal view. An SLA-critical queue, a high-value priority track, a starred-account workspace, and Tasks Due. |
| `/pipeline` | **Kanban board** by `status`, with a mobile-first prioritised Focus List sharing the same data adapter. |
| `/contacts` | **Contacts directory** — every non-archived lead as a card grid, with tap-to-act links on every phone, email and address. |
| `/prospects` | **Cold-outreach call list.** Sortable table, inline status / notes / archive editing, and Promote-to-lead. |
| `/prospects/import` | CSV import for prospects, keyed on `place_id`. |
| `/import` | CSV import wizard for leads — upload, column mapping, Zod validation, chunked batch insert. |
| `/reports` | **Reporting.** Read-only, all-time, whole-tenant: pipeline value by status, closed leads by outcome, win rate = WON / (WON + LOST) with ABANDONED excluded **and the formula printed on the page.** |
| `/settings` | Organization details, Team (invites, role change, member removal), API keys, webhook secret, and the per-user Account panel. |
| `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding` | Auth surfaces. `/onboarding` exists but was never designed. |
| `/invite/[token]` | Invite acceptance. Renders **before** sign-in, which is why its preview RPC is deliberately reachable by `anon`. |
| `/design` | Dev-only. Renders every UI primitive in every state, in both themes, side by side. |

### Non-page endpoints

| Endpoint | Behaviour |
| --- | --- |
| `POST /api/v1/triage/[organization_id]` | Inbound lead capture. **The org id in the URL resolves the tenant and grants nothing** — the request is authenticated by an `X-TekGuyz-Signature` HMAC-SHA256 over the *raw* body. |
| `GET /api/cron/weekly-report` | Vercel cron, Mondays 13:00 UTC. Aggregates projected against realised revenue, writes an AI markdown executive narrative, sends via Resend. Gated by `CRON_SECRET`. |
| `GET /api/dev-login` | Real password sign-in as the seeded demo owner, so an agent can screenshot an authenticated view. 404s unless `NODE_ENV=development`. **Not a bypass** — RLS, membership and role checks all still apply. |
| `GET /auth/confirm` | Supabase PKCE email-confirmation exchange. |

### Key features

- **Signed webhook ingestion**, with Zod schema validation and rate limiting.
- **Resurrection Engine.** No hard deletes anywhere in the product; deletion
  toggles an `archived` flag. If an archived contact submits the form again, the
  profile is resurrected, moved to NEW, and flagged `[Returned Prospect]`.
- **Immutable enquiry log.** Every inbound enquiry writes its own
  `lead_submissions` row. `leads` stays **exactly one row per contact**, and
  ingestion never rewrites an identity column.
- **AI Spam Shield** (Gemini). Classifies inbound text and routes suspicious
  leads to a review surface — **it never archives one and never gates the
  notification.**
- **Email notification** on every verified new lead, via Resend, deep-linked
  into the app.
- **Weekly executive revenue report** — AI-narrated, emailed, sends tracked in
  `report_sends`.
- **Tasks.** Per-lead, with due dates, surfaced on the agenda; editable title /
  description / due date; non-destructive dismiss; auto-closed when their lead
  is archived.
- **Activity timeline** per lead, plus a markdown executive brief, in a
  slide-over profile sheet.
- **Voice memo capture** — browser recording, uploaded to Storage, transcribed
  by Gemini into the timeline.
- **Command palette** (Cmd+K), fuzzy search over contacts and tasks; picking a
  task opens its parent lead's profile sheet on the right tab.
- **Prospect promotion** — a cold prospect becomes a real lead, with a
  duplicate-phone check at import time.
- **Team management** — invites, role change, member removal, all through
  role-checked RPCs.
- **Bring-your-own API keys** per organization, encrypted in Supabase Vault.
- **Help drawer** with inline contextual tooltips; light and dark themes
  throughout.

---

## 5. Data model

Postgres on Supabase. Ten tables, all tenant-scoped, all under RLS.
Authoritative detail — every column, policy and index — is that repo's
`docs/SCHEMA_REFERENCE.md`; **read it before any migration.**

| Table | Role |
| --- | --- |
| `organizations` | The tenant. Holds `webhook_secret`, now an HMAC signing key rather than a bearer token. |
| `organization_members` | user ↔ org ↔ role (OWNER / ADMIN / MEMBER). The only source of tenant access. **Deliberately has no UPDATE and no DELETE policy.** |
| `organization_invites` | Pending invitations. Create and revoke are OWNER/ADMIN only, at RLS. |
| `organization_credentials` | BYO keys. Stores only `*_secret_id` UUIDs pointing into `vault.secrets` — **never a value.** No RLS policies and no anon/authenticated grants at all, which is the safest possible state. |
| `leads` | The core record: one row per `(organization_id, lower(email))` contact. Carries status, outcome, `closed_at`, `actual_revenue`, `next_action_at`, `assigned_to`, `archived`. |
| `lead_submissions` | Immutable, append-only. One row per inbound enquiry — what that enquiry actually said. |
| `tasks` | Per-lead follow-ups. Carries `dismissed`; no DELETE grant and no DELETE policy exist. |
| `activity_logs` | Timeline events per lead, including the SYSTEM_ALERT rows the spam shield writes. |
| `prospects` | Cold-outreach staging, keyed on `place_id`. `promoted_lead_id` is the **only** truth about whether a prospect became a lead. **Fed by `tekguyz-leadgen`** — see [`leadgen.md`](leadgen.md); its CSV header row is a two-repo contract copied verbatim into `src/lib/validation/csv-prospect-schema.ts`, and `place_id` is compared case-sensitively on both sides. |
| `report_sends` | Weekly-report send tracking. Service-role only. |

### SECURITY DEFINER RPCs

The multi-tenant *write* model is deliberately built from role-checked RPCs
rather than broad policies. Each re-resolves the caller's own role for the org
id it was handed, and **never trusts a client-supplied id on its own.**

```
create_organization_with_owner · accept_organization_invite · get_invite_preview
get_organization_members · change_member_role · remove_organization_member
get_org_webhook_secret · vault_set_org_credential · vault_get_org_credential
vault_clear_org_credential · import_leads_chunk · import_prospects_chunk
private.current_org_ids
```

Plus four triggers: `enforce_lead_role_restrictions`,
`enforce_lead_assignee_membership`, `close_invite_on_member_insert`,
`sync_modified_timestamp`. Twenty migrations are on file.

---

## 6. The multi-tenant security model

Six rules, treated as architectural law rather than hardening. Five came out of
the original schema audit; the sixth was added 2026-08-28.

**1 · Membership-based tenant resolution.** Access is never assumed or
hardcoded. RLS policies call `private.current_org_ids()`, a SECURITY DEFINER
helper living in a dedicated `private` schema that is never added to the
API-exposed schema list — **not in `auth`**, because hosted Supabase forbids
creating objects there.

**2 · Every write policy pairs USING with WITH CHECK.** The row being touched
and the row being written are both validated, so a request cannot reassign a row
into another tenant's scope.

**3 · Credentials are encrypted, not merely access-controlled.** Secrets live in
Supabase Vault; `organization_credentials` holds only pointer UUIDs. Writing
goes through an `authenticated`-gated RPC with an internal OWNER/ADMIN check;
reading is `service_role`-only. **Verified live:** an authenticated user's own
call to the read RPC fails with "permission denied", and the stored column value
is a UUID, never a raw key.

**4 · Tenant resolution and authentication are two separate concerns.** The
webhook URL carries the plain organization id, which **resolves the tenant and
authorises nothing.** The `X-TekGuyz-Signature` header carries a hex HMAC-SHA256
of the **raw, unparsed** body, keyed by `webhook_secret`, compared with
`crypto.timingSafeEqual` — never `===`, never against a re-serialized body. A
valid org id with a bad signature returns the same opaque 401 as an org id that
does not exist, so nothing is learned either way. **The secret is never
transmitted**, so it can never land in a request log; that was the point of the
change.

**5 · Outcome is recorded, never inferred.** `outcome`, `closed_at` and
`actual_revenue` exist so the analytics cron can tell realised revenue from
abandoned or lost pipeline, instead of guessing it from the `archived` flag.

**6 · Session verification on a render path is `getClaims()`.** It verifies the
JWT signature locally, with Web Crypto, against the project's asymmetric ES256
key — the same guarantee as `getUser()` for a fraction of the cost. `getUser()`
stays only where the canonical server-side user record is genuinely needed.
**`getSession()` trusts the cookie unverified and must never gate anything.**
The trade-off is paid deliberately: claims are only as fresh as the hour-long
token, so any write to `user_metadata` calls `refreshSession()` before
revalidating.

### Role enforcement — partial, on purpose

| Surface | Enforcement |
| --- | --- |
| `organization_invites` | OWNER/ADMIN create and revoke, at RLS. |
| `organizations` UPDATE | OWNER/ADMIN only. |
| `organization_members` | RPC-only, enforced **below** RLS, because `authenticated` holds no UPDATE or DELETE grant. Three rules the type system cannot hold: the last OWNER may not be demoted or removed *even by themselves*; an ADMIN may not manage an OWNER; an ADMIN may not grant OWNER. Self-removal is the one MEMBER-permitted write, and it releases that person's assigned leads in the same transaction. |
| `leads` | **Column-level, not table-wide.** `archived`, `outcome`, `actual_revenue` and `closed_at` are OWNER/ADMIN-only on UPDATE, enforced by a BEFORE UPDATE trigger — **RLS WITH CHECK evaluates the resulting row and cannot express a column diff.** Everything else on `leads` keeps full MEMBER parity by design. |
| `tasks` | No role enforcement at all, deliberately. |

**RLS bypass is not trigger bypass.** The lead trigger exempts
`auth.uid() IS NULL` so service-role paths — webhook resurrection, seed scripts
— still work. **That exemption had to be written, not assumed.**

Sensitive per-row values (`webhook_secret`, invite tokens) are gated at the
*fetch* level, not conditionally rendered: **anything passed as a prop to a
client component ships in the RSC payload whether or not it is displayed.**

RLS is proven by its own suite — **76 assertions** on `npm run test:rls`, run
against the real project, including a service-role cross-tenant rejection.

---

## 7. Tech stack

### Application

- **Next.js 15.5.20**, App Router, Turbopack for dev and build
- **React 19.1** with Server Actions
- **TypeScript 5**, ESLint 9
- **Tailwind CSS v4** with `@theme inline` — load-bearing; a plain `@theme`
  breaks nested theme panes
- **Radix UI** primitives, re-skinned by hand onto this project's OKLCH tokens
- **@tabler/icons-react**, outline only — `lucide-react` was fully removed
  2026-08-14, and a new import from it is a bug
- **motion**, **next-themes**, **sonner**, **fuse.js**, **papaparse**,
  **react-markdown**, **zod**, **tailwind-merge**
- **Inter** via `next/font` — **the font variable belongs on `<html>`, not
  `<body>`**, or the whole app silently falls back to the system stack

### Platform

- **Supabase** — Postgres, Auth, Storage, Vault, via `@supabase/ssr` and
  `supabase-js`. Free tier, indefinitely.
- **Vercel** — hosting and cron
- **Google Gemini** (`@google/genai`) — spam shield, voice transcription, weekly
  narrative
- **Resend** — new-lead notifications and the weekly report

### Testing

- **Vitest 4** + Testing Library + jsdom — `npm test`
- A second Vitest config for RLS — `npm run test:rls`, against the real database
- **No browser-based runner is installed**, so nothing can assert that a focus
  ring actually *paints*

### Required environment variables

All seven are asserted present and non-empty at boot from
`src/instrumentation.ts`. A missing one throws `MissingEnvVarError` **naming
it**, rather than surfacing days later as a broken link in a live email.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
PLATFORM_GEMINI_API_KEY
PLATFORM_RESEND_API_KEY
CRON_SECRET
NEXT_PUBLIC_APP_URL
```

### Design system — "Structural Neutral v2"

A dense, neutral, monochrome-first data tool. Structure comes from hairline
borders and spacing, not shadow; colour is signal, not decoration.
`src/app/globals.css` is the single source of truth for every token value — **a
doc copy can only drift.**

Constraints worth knowing before touching UI: the radius scale *overrides*
Tailwind's stock values under the same utility names, while the type scale does
*not*; any new `text-*` role must be registered in `src/lib/utils/cn.ts` or
tailwind-merge silently deletes the colour class beside it; `--accent` is sampled
and closed; and the raw logo blue `#3B6FE0` **fails AA as text at 4.44:1**.
Brand assets are generated by `scripts/brand/build_brand.py`, so hand-editing one
is a bug — the next pipeline run silently reverts it.

---

## 8. Build status and known gaps

### Shipped initiatives — all live-verified

| Initiative | Shipped |
| --- | --- |
| Initial build, Prompts 1–15b | — |
| Task / Calendar (4 prompts + hardening) | 2026-07-28 |
| Help system (2 prompts) | 2026-07-30 |
| Brand identity "Converging Funnel" | 2026-08-14 |
| Leads MEMBER-role enforcement | 2026-08-14 |
| Brand application pass | 2026-08-15 |
| Design System v2 "Structural Neutral" | 2026-08-16 |
| Application shell redesign | 2026-08-16 |
| `lead_submissions` immutable enquiry log | 2026-08-17 |
| Per-lead ownership — `leads.assigned_to` | 2026-08-18 |
| Team management — role change and removal | 2026-08-18 |
| Webhook HMAC request signing | 2026-08-19 |
| Reporting view — `/reports` | 2026-08-19 |
| Task editing + non-destructive dismiss | 2026-08-19 |
| Prospects — staging and promotion | 2026-08-26 |
| Global search — palette covers tasks | 2026-08-28 |

### Verification figures, as last measured

| Measure | Value | As of |
| --- | --- | --- |
| Unit tests | 231 tests / 36 suites | 2026-08-28 |
| RLS assertions | 76 / 76 | 2026-08-26 |
| Migrations on file | 20 | 2026-08-26 |
| Leads in the real TEKGUYZ org | 1 | 2026-08-18 |
| Prospects in the real TEKGUYZ org | 122 | 2026-08-26 |
| Navigation skeleton, production build | ~345 ms (from ~759 ms) | 2026-08-28 |

The test count is refreshed on every handoff audit, for a reason: **a stale
92/15 figure survived two sessions after a commit made it wrong**, because the
audit checked only the gaps that session had touched and never re-checked a
figure it had just measured.

### Open gaps — deferred work, not oversights

| Gap | Since |
| --- | --- |
| CSV **export** — import is done and live-verified; export shares no machinery with it | 2026-07-26 |
| No calendar view; unarchiving a lead does not reopen auto-closed tasks; no task `assigned_to` | 2026-07-28 |
| `/reports` is all-time only and cannot be exported. A period filter needs its own decisions — tenant timezone, partial months, which timestamp buckets a closed lead | 2026-08-19 |
| The webhook signature carries **no timestamp or nonce**, so a captured request can be replayed. Blast radius is one extra submission row; the fix is a breaking protocol change for every caller | 2026-08-18 |
| A MEMBER still sees every lead in the tenant — `assigned_to` is ownership, not visibility, and no RLS policy reads it | 2026-08-18 |
| Prospect promotion is not one cross-table transaction, so a lost race can orphan a lead. Handled explicitly rather than silently | 2026-08-26 |
| Spam Shield over-triggers on tekguyz.com's own placeholder copy — a precision problem now, no longer a data-loss one | 2026-08-11 |
| No org switcher. The sidebar slot is reserved, but a persisted "active org" concept does not exist — **that is a migration, not a menu** | 2026-08-16 |
| Account settings still missing email change, account deletion, org switching | 2026-07-27 |
| Shell / IA needs one dedicated redesign pass. Scope widened 2026-08-28 to include mobile navigation and an explicit "it looks plain" aesthetic brief | 2026-08-27 |
| `/prospects` has no column resize or reorder. Sorting *is* shipped, on four columns | 2026-08-27 |
| Routes without their own `loading.tsx` fall back to the Today agenda's three-column skeleton, which matches nothing on those pages | 2026-08-28 |
| Command palette has no pagination or debounce. Revisit around low hundreds of contacts | 2026-08-11 |
| Command palette does not search `prospects` — one whole record type is invisible to it | 2026-08-27 |
| Per-org BYO Resend key has no UI; the OpenAI and Twilio credential columns have no caller at all | 2026-08-11 |
| No browser test runner, so a focus ring's actual paint cannot be asserted | 2026-08-17 |
| `lead_source` / `service_category` are free text with no managed vocabulary | 2026-07-30 |
| `input:focus-visible`'s border-colour rule is dead CSS. Harmless — the paired accent box-shadow ring still paints | 2026-08-14 |
| Signup-confirmation path not live-email-verified after the PKCE fix, due to a Supabase auth rate limit | 2026-07-25 |
| `getCurrentOrg()`'s multi-membership branch is code-inspected only — no live user holds two memberships | 2026-08-17 |
| A lead can still name a former member if a membership row is deleted outside the supported RPC. Not reachable through the app; surfaced as "Former member" rather than hidden | 2026-08-18 |

### Permanently rejected — never re-list

| Item | Since |
| --- | --- |
| Leaked Password Protection — paid Supabase tier only | 2026-07-22 |
| All 14 Supabase Security Advisor lints — audited against the live schema, **expected output, not findings** | 2026-08-18 |
| A `robots.txt` carrying `Disallow: /` — it would stop crawlers ever reading the `noindex` | 2026-08-15 |
| `KanbanColumn` not being a `Card` — ruled not a defect; it is a deliberate `<section>` landmark | 2026-08-15 |

The rejected items keep firing as advisor warnings forever, and that is expected.
**Quieting the two `rls_enabled_no_policy` INFO lints by adding a policy would
make those tables *less* safe** — RLS on with zero policies denies everything.

### Roadmap — never-started work

| Phase | Work |
| --- | --- |
| P1 | Login / landing redesign — a genuinely public landing route (none exists; `/` is auth-gated), a redesigned `/login`, and real onboarding. No schema changes, highest visibility. |
| P2 | Observability, error tracking, webhook rate limiting |
| P3 | Webhook replay protection — depends on P2, breaking protocol change |
| P4 | Cheap registered gaps in one wave: CSV export, `/reports` period filter, dead CSS |
| P5 | Lead enrichment, via an append-only `lead_enrichments` table with a mandatory human-apply step |
| P6 | PWA, push notifications only — offline explicitly declined |
| P7 | Skills / hooks / onboarding documentation |

Not yet in a phase: two-factor auth (idea); session timeout (**decision
pending** — forks into Supabase JWT expiry versus an app-side idle timer, and
those are different builds); notification centre (idea); avatar images
(recommendation on file is initials-first, hash-based colour, zero storage);
unstructured-input lead creation (needs discovery, must keep a human confirming
before insert); data history / audit trail (needs discovery — verify against
`activity_logs`' real schema first); Help system v2 (idea); RESTful API
(**rejected** — no second external consumer exists).

---

## 9. Hard rules — each traced to a specific incident

**Form / action field parity.** Every column a Server Action writes from
`formData.get("x")` must have a rendered `<input name="x">` in the form posting
to it. An absent field yields `null`, so a written-but-unrendered column is
**silently NULLed on every save** — no error, invisible until the data is gone.
It hit five `leads` columns across two incidents. **Defaults are worse than
`|| null`, not better:** `?? "UTC"` silently resets a column *and passes
validation*, because the default is itself valid.

**Controlled fields, because React 19 resets forms.** React 19 calls
`form.reset()` after a `<form action>` returns — **failure included** — so an
uncontrolled form wipes what the user typed at the exact moment the error asks
them to fix it. React restores a controlled `<input>` by itself; it does **not**
restore a controlled `<select>`, and Radix's Checkbox actively drags itself back
to its mount value. Any group owning either must re-assert through
`src/lib/forms/use-form-reset-restore.ts`. **Test it with a real `form.reset()`,
never RTL's `rerender()`** — that masked the whole failure while nine tests
stayed green.

**A migration lands before the code that names its column.** `LEAD_COLUMNS` in
`src/lib/leads/queries.ts` backs six query functions, is re-exported as
`CONTACT_COLUMNS`, and is imported by the webhook ingest — **eight read sites
from one string.** PostgREST *errors* (42703) on a column the database lacks, so
code naming an unapplied column takes down every lead surface at once and
silently breaks unattended inbound lead capture. **It fails total, not partial;
there is no degraded mode to ship.** A lead-column commit and its migration are
one unit.

**A classifier verdict routes a lead; it never hides one.** No automated
judgement may set `archived`, and none may gate the new-lead notification.
Overloading `archived` with "a model doubted this" cost **12 real leads five
days of silent invisibility** — every list query filters `archived = false`
*and* the same verdict suppressed the notification, so nobody could review a
queue they were never told existed.

**An inbound resubmission never rewrites an identity column.** `client_name`,
`phone`, `company`, `website`, `physical_address`, `service_category` and
`lead_source` are **first-known values, written once.** Ingestion may touch only
`updated_at` plus the Resurrection Engine's `archived` / `status`. Overwriting
in place destroyed one lead's real identity with no error and no audit trail. A
human editing through `updateLead` is a different thing and still writes them
all.

**"Already promoted" means `promoted_lead_id IS NOT NULL`.** Never the
`'CONVERTED'` status string — status is a label an operator picks from a
dropdown and **cannot carry a lead's identity.** Every write setting CONVERTED
sets `promoted_lead_id` in the same statement, carrying
`where … and promoted_lead_id is null`, which is what makes a second promotion
affect zero rows instead of overwriting the first lead id. CONVERTED is
deliberately absent from the operator dropdown.

**Split files by responsibility, not by line count.** Around 200 lines is a
smell worth a second look, not a wall. **A form split across siblings hides its
own field set**, so no single file shows it — which is precisely how the
NULL-on-save bug class was produced. A 240-line file with one clear job beats
two 120-line files that must be read together.

**Test residue is part of the unit of work.** Anything created to verify
something is removed before the unit is reported done. **Archiving is not
removal** — an archived row still counts, still appears in Contacts, still lands
in any query that forgets the flag. Sixteen test leads accumulated in the real
org over three weeks precisely because archiving felt like cleanup.
`npm run check:residue` reads the database SELECT-only and prints the removal
SQL for a human.

**A fixed per-request cost reads as a "skeleton flash", not a performance bug.**
Next paints a segment's `loading.tsx` the instant a link is clicked, so a
route-independent cost appears as a skeleton whose duration has nothing to do
with the page's own data. Two `getUser()` round-trips plus a serial org query
held it flat at ~759 ms across four unrelated routes; removing them took it to
~345 ms. **Measure navigation against `next build` + `next start`** — dev
disables prefetching and inverts the result.

**A `"use server"` file may only export async functions.** Exporting a constant
or object from one fails `next build` at page-data collection. `tsc` and ESLint
both pass, so nothing catches it earlier. Shared constants belong in a plain
sibling module the action imports.

---

## 10. Operating it

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack). **Prefetching is disabled in dev, so never measure navigation here.** |
| `npm run build` / `npm start` | Production build and serve — the only valid target for navigation timing. |
| `npm test` | Vitest unit suite. |
| `npm run test:rls` | RLS suite, against the real database. |
| `npm run check:docs` | Three repo-only checks: design tokens against `globals.css`, asserted figures against measured ones, and that every `§` pointer resolves and every addendum is indexed. |
| `npm run check:residue` | SELECT-only. Finds live rows left behind by verification work and prints the removal SQL for a human. |
| `npm run seed:demo` | Creates or refreshes the TEKGUYZ Demo org; `seed:demo:reset` resets it. |

### Rules for changing the database

- **DDL is applied by a human.** An agent writes the migration file and hands it
  over; **it never applies schema itself.**
- Every migration is **dry-run against a temp-table replica** first, because
  `tsc`, ESLint and `next build` cannot see SQL at all. That practice caught a
  complete, reviewed, **wrong** migration on 2026-08-15.
- Never write to a `public`-schema table by ad-hoc SQL. Either hand over the
  exact `DELETE` preceded by its matching `SELECT`, or use a disposable
  service-role script.
- Scope every such statement by `organization_id` **and** an explicit id
  exclusion — **a WHERE clause naming what to keep survives a mistake better
  than one naming what to drop.** `activity_logs` and `tasks` cascade from
  `leads`.

**Deployment.** Vercel, at `tekguyz-crm.vercel.app`. This project has had a real
incident of one variable name holding **different values across Production and
Preview scopes** — drift that is structurally invisible to any check running
inside a single build — so environment variables are confirmed per scope by hand
before a deploy.

---

## 11. How that repo's documentation is split

By responsibility, not by topic. The split is deliberate and load-bearing:
consolidating it into one status file is what forced two emergency compressions
of `CLAUDE.md`, so **there is deliberately no `STATUS.md` in that repo.**

| File | Holds |
| --- | --- |
| `CLAUDE.md` | Permanent rules only — design system, operational rules, security model, initiative status, standing disciplines. |
| `docs/DESIGN.md` | The full design spec: token tables, elevation ramp, iconography, brand asset rules, the Application Shell. |
| `docs/SCHEMA_REFERENCE.md` | The live schema — every table, every policy with its paired WITH CHECK, every RPC and index. |
| `docs/ADDENDA_LOG.md` | An *index* of dated build history; entries live in `docs/addenda/`. **A section missing from the index is unreachable** by every cross-reference in the repo. |
| `docs/ROADMAP.md` | Never-started future initiatives and open product decisions. |
| `docs/KNOWN_GAPS.md` | Deferred edges of shipped work, plus the only copy of its own maintenance rules. |

A `handoff` skill is the supported way to answer "where are we". It audits all
four registers plus the schema, repairs whichever has gone stale, runs the four
scripted checks, then prints a paste-ready status block.

**One caveat: `README.md` is still the unmodified `create-next-app` template.**
It describes nothing about this project and should not be cited.

---

## 12. Accuracy notes

- **One Known Gaps bullet was stale and was corrected on 2026-09-03** while the
  source document was compiled. "The command palette searches Contacts only"
  (registered 2026-08-27) had been half-closed on 2026-08-28 — tasks are
  searched alongside contacts — but the bullet was never updated. It now reads
  as half-closed, with the genuinely open half named: `prospects` is still not
  searched.
- **Figures are as-last-measured, not as-of-today.** Every count in §8 carries
  the date it was taken. Row counts in particular move without a commit.
- **The credential-encryption documentation has been wrong before.** That repo's
  `CLAUDE.md` says so itself: the Prompt 12 and Prompt 13 accounts were
  superseded by 13a, and the file instructs a reader to re-verify against the
  live schema before describing it any other way. This document reports the 13a
  state.
