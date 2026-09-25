---
paths:
  - "app/actions/contact.ts"
  - "lib/validation.ts"
  - "lib/validation.test.ts"
  - "components/contact-form.tsx"
  - "components/concierge/**"
  - "app/api/**"
---

# Lead capture

Moved out of `CLAUDE.md` on 2026-09-21 (Job 4). Text is unchanged. The
never-do and secrets bullets in this section are ALSO stated in `CLAUDE.md`,
on purpose — a path-scoped file does not load when it matters.

- **The honeypot is `hp_confirm`, never `website`** (a real CRM column — the collision silently dropped leads), and never `.max(0)` (that makes the silent-accept path unreachable and tells bots they were caught).
- **Optional fields are not unvalidated.** Blank is fine; a filled value is checked. Rules live in `lib/validation.ts`, shared by the client and server schemas so they cannot drift. **Test-covered** — `lib/validation.test.ts`, `bun run test:unit` (107 cases across 5 files, ~2s), and **wired into `prebuild` on 2026-08-12, so a broken rule fails the build.**
- **The phone typing cap counts digits, never characters.** `capPhoneDigits` caps at 15 **digits** because that is what `isPlausiblePhone` measures; formatting is unlimited. `maxLength={15}` is the same bug as a 10-digit cap — `+44 20 7123 4567` is a valid 13-digit number and 16 characters.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the form and the concierge with a different `source`. Never a second implementation.
- **Submitting the form moves focus to the success element, and that is the announcement mechanism.** A submit unmounts the form, so the focused button goes with it and focus falls to `<body>` — from which the next stop is the first FAQ trigger, far below a message the visitor never sees. `role="status"` is not enough on its own: the region and its content mount in the same commit, and a live region announces *changes* to a region that already existed. So the success block is `tabIndex={-1}` and gets `.focus()`; the scroll into view is a side effect, not the fix.
- **Every CRM triage POST is signed, and the payload is serialized exactly once** (2026-08-18). `sendToCrm` builds `const body = JSON.stringify(payload)`, signs *that string* with HMAC-SHA256 keyed by `CRM_SIGNING_SECRET`, and sends the same string as the request body with an `X-TekGuyz-Signature` header. **Since 2026-09-14 the HMAC covers `${timestamp}.${body}`**, with the timestamp — Unix **seconds**, plain digits — sent as `X-TekGuyz-Timestamp`. Hard cutover: the CRM refuses a body-only signature, a timestamp more than 5 minutes from its clock, and any signature it has already seen, so the timestamp is made per request and a retry must re-sign, never resend. The spec is src/lib/webhooks/signature.ts in the tekguyz-crm repo — **written without backticks on purpose**, same reason as the tekguyz-one path above; a change there ships in the same window as `sendToCrm`, or every lead 401s. **Never inline the `JSON.stringify` back into the `fetch` call** — building the object, signing one serialization and sending another is the standard way this breaks, and it fails 100% of the time with a 401, not intermittently. `CRM_TRIAGE_ENDPOINT` now ends in the plain organization id and is **not** a credential; the secret is. Rotation in the CRM is immediate with no grace period, so update Vercel first, then rotate.
- **CORS never applied to the CRM call, and believing it did cost a real capability.** The old rule here said CRM CORS was hard-locked to `https://tekguyz.com` and that a custom header would fail preflight. CORS and preflight are **browser** mechanisms; `sendToCrm` is a server-side fetch from a Server Action — no origin, no preflight. That misreading was written into the code as a comment and is why a signed header looked impossible from this side for months. A domain or hosting change does not break this call. (The CRM does still serve an allowed-origin list, but only for browser-side callers, which this is not.)
- Never add `physical_address` or the `social_*` fields to the contact form — those serve outbound prospecting, not inbound intake.
- The concierge never states or estimates a price, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- Secrets from env vars only, never inlined, never logged. **Never construct a client with a secret at module scope** — `new Resend(undefined)` throws on construction and broke the build. Build must pass with zero secrets present.
