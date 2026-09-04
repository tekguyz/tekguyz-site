# TEKGUYZ Knowledge Base — index

**What this folder is.** One reference document per TEKGUYZ product, in a single
house format, compiled from each product's own repository documentation.

**What it is NOT — read this before citing anything here.**

- **It is not an authority over this site.** The authority order in `CLAUDE.md`
  is `CANONICAL > DESIGN > COPY > SEO`, and this folder sits outside it
  entirely. Nothing here governs a decision about tekguyz.com.
- **It is not a measurement.** Every document is a snapshot of another
  repository on the date in its header. Those repositories move without
  touching this one, so a figure here ages the moment it is written. Treat
  every number as *as-last-measured*, never as current.
- **It is not site copy.** Copy lives in `docs/COPY.md` and nowhere else. These
  documents are the **source material** the copy was written from — which is
  exactly why they carry the caveats a marketing page cannot.

**What it is good for.** Writing or checking a `/work` entry, answering "what
does that product actually do", grounding the concierge on request, and giving
a new person the shape of the portfolio without opening five repositories.

---

## Documents

| Doc | Product | Site entry | Public? |
| --- | --- | --- | --- |
| [`squid-ink.md`](squid-ink.md) | AI meeting notepad (working name "Squid Ink") | `/work/ai-meeting-notes` | Sign-in required |
| [`tekguyz-crm.md`](tekguyz-crm.md) | Lead & pipeline CRM | `/work/tekguyz-crm` | **No** — login-gated, no public route |
| [`field-ops.md`](field-ops.md) | Field Ops / StoneApp Operations Hub | *(see caveat in that doc)* | — |
| [`reporter-resource.md`](reporter-resource.md) | Reporter Resource storefront | `/work/bundle-builder` | Yes, sandboxed |

---

## House format

Every document uses the same eight headings, in the same order, so two products
can be compared by scrolling to the same place in each:

1. **At a glance** — a fact table: repo, version, hosting, last measured.
2. **The problem it solves** — in plain language, no architecture.
3. **Why it was built** — origin, and what is *not* recorded about origin.
4. **What it actually does** — shipped behaviour only.
5. **Tech stack**
6. **Architecture worth knowing** — the decisions that are not obvious.
7. **Build status and known gaps** — including what is deliberately not built.
8. **Hard rules** — things that cost a real bug to learn.

A ninth section, **Accuracy notes**, appears where the source repository's own
documents contradict each other or the code. It is not omitted to make a
product look tidier; an empty one says so.

---

## Rules for maintaining these

- **Compile from the repository, never from memory or from an older copy of
  this file.** Each document names its source commit; if you cannot name one,
  you are not compiling, you are guessing.
- **Carry the date on every figure.** Test counts, row counts and deploy states
  move without a commit. A number with no date is a number nobody can check.
- **A contradiction gets recorded, not resolved.** If a product's docs disagree
  with its code, the disagreement goes in *Accuracy notes* with both sides.
  Silently picking the one that reads better is how a wrong claim gets
  laundered into a fact.
- **Never invent.** No metric, client name, price, or timeline appears here
  unless the source repository states it. This is the same hard rule that
  governs site copy, and it matters more here, because this folder is what the
  copy gets written *from*.
- **A working name is flagged as a working name.** See `squid-ink.md` — its
  product name is unconfirmed upstream, and the site deliberately does not use
  it.
