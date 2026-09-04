# TEKGUYZ SEO — Structured Data Reference

*Becomes `/docs/SEO.md` in the repo.*

**Division of labor, deliberate:** titles and descriptions live in `docs/COPY.md`, one place, alongside the copy they belong to. **This file holds structured data (JSON-LD) only.** An earlier version duplicated titles across both files and they immediately drifted out of sync — all 11 routes ended up with a title pattern (`[Page] | TEKGUYZ`) that contradicted the one Home actually ships (`TEKGUYZ | [Page]`). Don't reintroduce that duplication: if a title needs changing, change it in COPY.md.

---

## Shared rules

- `BreadcrumbList` on **every** non-home route, emitted through one shared helper in `lib/seo.ts` — never hand-repeated per page. Home → [Page] for top-level routes; Home → Work → [Build] for detail pages.
- `alternates.canonical` set explicitly per route — don't rely on default resolution.
- `sitemap.ts` `lastModified` sources from each content entry's real `updatedAt` field in `content/work.ts`, not request-time `new Date()`. Static routes without a natural date (e.g. `/process`) may keep request-time as a lesser fallback — the content-driven routes are the priority fix.
- `robots.ts` / `sitemap.ts` must enumerate all new routes. The `/work/[slug]` entries — **6 as of 2026-09-04, was 8** — should be driven by `generateStaticParams` output, not hand-listed a second time.

---

## Home `/`

Existing `ProfessionalService` node stays. Two additions:

**1. Expand `makesOffer`** from bare `{name}` entries into full `Service` nodes (see `/solutions` below).

**2. New `Review` node** for the testimonial:

```json
{
  "@type": "Review",
  "reviewBody": "TEKGUYZ integrated our 3CX phones with Twilio and Zoho CRM to fully automate our text surveys and protect our customer experience. They also built a custom internal tool that tracks our team's offline project work perfectly without micro-management. Exceptional execution.",
  "author": { "@type": "Person", "name": "Joe M." },
  "itemReviewed": { "@type": "Organization", "name": "TEKGUYZ" }
}
```

**No `reviewRating`** — there's no numeric score attached to this review. Do not invent one.

---

## Solutions index `/solutions`

`BreadcrumbList` only. Optionally an `ItemList` referencing the four `/solutions/[slug]` pages, same reasoning as the Work index's `ItemList`.

## Solutions detail `/solutions/[slug]` (×4, reversed from a single anchored page — see CANONICAL.md)

`BreadcrumbList` (Home → Solutions → [Name]) plus one `Service` node per page:

```json
{
  "@type": "Service",
  "serviceType": "AI Voice Agents",
  "description": "Real-time conversational AI agents that answer calls, capture leads, and schedule work around the clock.",
  "provider": { "@type": "Organization", "name": "TEKGUYZ" },
  "areaServed": ["South Florida", "United States"]
}
```

One per page, description drawn from that page's own COPY.md content. This is actually cleaner schema practice than the original single-page version — each `Service` node now sits on the page it describes, rather than four nodes crammed onto one URL. Home's `ProfessionalService.makesOffer` array can reference these same four services rather than duplicating the descriptions a third time.

---

## Work index `/work`

`BreadcrumbList`, plus an `ItemList` referencing all 6 `/work/[slug]` pages so crawlers get the complete set from one node. Cheap to add, don't skip it.

---

## Work detail `/work/[slug]` (×6 — was ×8 until the 2026-09-04 lineup change)

`BreadcrumbList` (Home → Work → [Name]) plus a `SoftwareApplication` node per build:

```json
{
  "@type": "SoftwareApplication",
  "name": "AI Voice Receptionist & Call Booking",
  "applicationCategory": "BusinessApplication",
  "url": "https://tekguyz-sarah.vercel.app",
  "creator": { "@type": "Organization", "name": "TEKGUYZ" }
}
```

`url` is that build's real live demo URL, sourced from `content/work.ts` — the same field driving the `LiveFrame` link and status check, not a second hardcoded copy.

**These 8 pages are the site's strongest long-tail SEO surface** — they target problem-language queries ("missing after hours calls contractor," "field photo verification software") that the homepage structurally cannot rank for. Don't compress their content back to homepage-card length when building.

---

## Process `/process`

`BreadcrumbList` only. No additional schema type warranted.

---

## Contact `/contact`

`BreadcrumbList` plus `FAQPage` — one `Question` entry per FAQ item in COPY.md (six total):

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a project cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

Answer text comes verbatim from COPY.md's FAQ section — don't paraphrase it into a second, slightly-different version.

---

## Privacy `/privacy`

Ships as-is. `BreadcrumbList` addition only.

---

## Outstanding technical items

- Multi-resolution `favicon.ico` in `app/` is currently indexed — don't regress it during the rebuild. (Generated from `icon-master.svg` per the master build prompt.)
- Delete the root layout's fallback description string — dead code, never served, since every route defines its own.
- ~~**GBP Services section** (playbook §14 item 2) remains the single highest-leverage open SEO item.~~ **Resolved** — see PLAYBOOK.md §14 item 2 and STATUS.md.
