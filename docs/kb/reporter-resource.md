# KB · Reporter Resource *(headless Shopify storefront)*

> **Relationship to the site.** This is the build behind
> `/work/bundle-builder` — "Shopify Bundle Builder & Storefront". That entry
> **moved from case study to project on 2026-09-04**, at the owner's direction.
>
> **The site entry points at `reporter-resource-temp.vercel.app`**, while this
> document's source names the production domain `reporterresource.com` and the
> Shopify backend `r3prbh-ae.myshopify.com`. **Those are not confirmed to be the
> same deployment.** Do not change the site's demo URL from this document
> alone — the `-temp` host is what the live status check measures hourly, and it
> is sandboxed for a reason.

---

## 1. At a glance

| | |
| --- | --- |
| Product | Reporter Resource |
| Domain (per source) | `reporterresource.com` |
| Shopify backend | `r3prbh-ae.myshopify.com` |
| Built by | TEKGUYZ |
| Site entry | `/work/bundle-builder` (project) |
| Demo URL used by the site | `reporter-resource-temp.vercel.app`, **fully sandboxed** |
| Repo / commit | **Not recorded in the source** |
| Source | TEKGUYZ KB documentation export, doc ID `KB-RR-2026-09`, verified September 2026 |
| Market | Court reporting, captioning, CART, realtime transcription |

**Demo behaviour worth keeping straight:** the site's Try It line says the demo
is sandboxed and you can check out for real using `1` as the card number. That
is a Shopify test-mode property of the demo deployment, **not** a claim about
the production store.

---

## 2. The problem it solves

Professional court reporters, broadcast captioners, CART providers and reporting
students work where transcription latency must be zero and a system failure
during a live deposition or broadcast is unacceptable. Acquiring the right
equipment for that is fragmented and error-prone:

- **Generic electronics retailers do not understand CAT hardware.** Computer-Aided
  Transcription has real compatibility requirements — RAM bus speeds,
  dual-channel caching, NPU acceleration, OLED and anti-glare panels, legacy USB
  and serial interface support — and a consumer storefront cannot express any of
  them.
- **Software licensing is sold separately from certified hardware.** Eclipse
  Steno, AccuCap Broadcast, Eclipse Edit and the student editions arrive
  detached from the machine they must run on, which produces installation
  hurdles, driver conflicts, and delayed operational readiness.
- **Accessories are a guessing game.** Students and travelling reporters
  struggle to find verified compact surge suppressors, high-wattage GaN travel
  chargers, ergonomic split mechanical keyboards, and 135W docks guaranteed to
  interface cleanly with **both** a steno machine and a laptop.

---

## 3. Why it was built

Engineered by TEKGUYZ as a high-density, institutional-grade **headless
e-commerce storefront** that unifies four things a buyer in this trade otherwise
assembles by hand:

1. Enterprise mobile workstations (Lenovo ThinkPad X1 Carbon, P16s AMD, P14s
   AMD, P16s Intel).
2. Certified CAT and captioning software licences, with immediate activation and
   support provisions.
3. Tested peripherals and adapters certified for stenographic workflows.
4. **An interactive system bundle configurator** — pick a base workstation, then
   attach the software licences and hardware add-ons in a single transaction.

Point 4 is the reason the build exists, and it is what the site entry is about.

---

## 4. What it actually does

1. **Catalog presentation and discovery.**
   A 20-product single-source-of-truth catalog in `config/catalog.ts`, organised
   across three categories — **Laptops** (workstations), **Software** (CAT
   licences), **Accessories** (certified peripherals) — with categorical pages
   (`/laptops`, `/software`, `/accessories`) and a `/bundles` matrix page.

2. **Workstation configurator drawer** (`components/configurator-drawer.tsx`).
   "Configure System" on any workstation card opens a slide-over showing the
   chosen base system and a selectable list of compatible upgrades. It tallies
   base price and add-ons **in real time**, and its one-click checkout packages
   every selected Shopify variant ID into a unified payload.

3. **Software comparison sheet and dual view modes** (`app/software/page.tsx`).
   A toggle between an enterprise **Comparison Sheet** — input method, core
   application, delivery method, support tier, price — and a **Catalog Grid**,
   with instant "Add License" state transitions.

4. **Bento bundles matrix** (`app/bundles/page.tsx`). Pre-configured bundles with
   spec matrices (processor, memory, display, chassis/storage) and feature
   checklists, under the signature dark editorial hero.

5. **Client-side reactive cart** (`app/cart/page.tsx`,
   `components/cart-context.tsx`). Persistent cart in `localStorage` under
   `reporter_resource_cart`. Quantity increment and decrement, line-item
   removal, SKU inspection, clear cart, live totals, and a reactive count pill in
   the header.

6. **Server-side checkout pipeline** (`app/actions/checkout.ts`,
   `lib/shopify.ts`). Next.js Server Actions process the variant payload with no
   client-side credential exposure, dispatch Shopify's Storefront GraphQL
   `cartCreate` mutation, apply a variant mapping layer to prevent legacy variant
   rejection, and fall back to a direct Shopify checkout permalink if the GraphQL
   API is unavailable.

---

## 5. Tech stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) | `15.4.9` | SSR, Server Actions, static generation |
| Runtime | React | `19.2.1` | UI rendering |
| Language | TypeScript | `5.9.3` | Type safety and interface contracts |
| Styling | Tailwind CSS v4 | `4.1.11` | `@tailwindcss/postcss`, `@import "tailwindcss"` |
| Animation | Motion (`motion/react`) | `12.23.24` | Drawer spring transitions, backdrops, modal entry |
| Icons | Lucide React | `0.553.0` | Vector icon library |
| Commerce API | Shopify Storefront GraphQL | `2024-07` | Cart creation, checkout URL generation |
| AI | `@google/genai` | `2.4.0` | Server-side Gemini capability baseline |
| Class utilities | `clsx`, `tailwind-merge`, `class-variance-authority` | latest | The `cn` helper in `lib/utils.ts` |

---

## 6. Architecture worth knowing

### 6.1 Shopify variant mapping and fallback engine — `lib/shopify.ts`

**This is the interesting part of the build.** During testing against the live
Shopify store, several products from the initial catalog feed — standalone
software items, the Boost Box, some accessories — turned out to be archived,
draft, or unlisted in Shopify's active sales channel. Creating a headless cart
with an unlisted variant ID makes Storefront GraphQL return errors: `410 Gone`,
or `"The merchandise with ID ... does not exist"`.

Four mechanisms guarantee a checkout flow never crashes or produces a blank
error page:

1. **`VARIANT_MAPPING`** — maps unlisted variant IDs directly onto active,
   purchasable variants in the store.
2. **Quantity aggregation** — duplicate variant IDs in the `lines` array
   **violate Shopify's Cart GraphQL constraints**, so they are collapsed into
   `{ merchandiseId, quantity }` before submission.
3. **Storefront password header** — sends
   `X-Shopify-Storefront-Password` alongside `X-Shopify-Access-Token`, so
   headless checkout generation works while the store still has a storefront
   password enabled.
4. **Resilient dual-path fallback** — if the GraphQL mutation hits any API or
   network issue, the exception is caught and a standard Shopify checkout
   permalink is generated instead:
   ```
   https://r3prbh-ae.myshopify.com/cart/{variant_id}:{quantity},{variant_id}:{quantity}
   ```
   **The stated design goal is 100% checkout uptime regardless of API state.**

### 6.2 Security — zero token exposure

Shopify access tokens (`SHOPIFY_CLIENT_SECRET`) and configuration parameters are
kept **strictly server-side.** Checkout is mediated through a Next.js Server
Action (`app/actions/checkout.ts`, `'use server'`) which receives an array of
variant IDs, creates the cart on the server, and returns **only the generated
checkout URL** to the client. The browser never receives a raw API token.

### 6.3 Design system

An institutional, high-contrast language, cited in the source as inspired by
Coinbase's digital design system.

- **Colour tokens** — primary action Brand Blue `#0052ff`, pressed `#003ecc`;
  canvas `#ffffff`; elevated surfaces `#f7f7f7` and `#eef0f3`; editorial dark
  hero `#0a0b0d` with cards `#16181c`; hairline dividers `#dee1e6`; semantic up
  `#05b169`, semantic down `#cf202f`.
- **Typography** — display headlines at weight 400 with negative tracking
  (`-0.015em` to `-2px`), for an editorial, calm feel **rather than aggressive
  e-commerce hype**. A monospace face (JetBrains Mono / system mono) is applied
  **strictly** to numerical values, pricing, SKUs and category badges. Body text
  is Inter at 14–16px, line height 1.5–1.7.
- **Pill geometry** — every primary and secondary CTA, search bar, category tag
  and status chip uses full pill geometry (`rounded-full` / 100px). Cards use
  24px corner radii.
- **Signature editorial hero** — full-bleed `#0a0b0d` heroes paired with layered
  product-UI mockup cards floating at slight angles (`-rotate-3`, `rotate-6`),
  carrying live status indicators (`● IN STOCK`, `● PRE-CONFIGURED READY`).

### 6.4 Image handling — `components/optimized-image.tsx`

Handles three source shapes: local static assets (`/images/products/*`), Shopify
CDN paths (`/cdn/shop/*`), and protocol-relative URLs (`//cdn.shopify.com/*`).
It renders an automatic fallback state for products whose media is pending or
offline, **preventing broken-image layout shift**, and sets
`referrerPolicy="no-referrer"` so images are not blocked in proxied
environments.

---

## 7. Catalog structure — `config/catalog.ts`

Twenty items. **Prices are as recorded in the source document, September 2026.**
They are catalog data, not TEKGUYZ pricing, and they move without a commit — do
not quote them anywhere on tekguyz.com.

### Workstations

| Item | Price | Note |
| --- | --- | --- |
| ThinkPad X1 Carbon, Intel Ultra 7 | $2,499.00 | Flagship lightweight carbon fibre |
| ThinkPad P16s, 4K OLED, AMD R7 Pro | $2,599.00 | 4K OLED, 64GB RAM |
| ThinkPad P16s, Intel Ultra 7 | $2,629.00 | Maximum 16" workspace |
| ThinkPad P14s, AMD R7 Pro | $2,399.00 | Compact 14" high-mobility |
| Boost Box | $569.00 | External processing and storage expansion |

### Software licences

| Item | Price |
| --- | --- |
| AccuCapVox Captioning — Steno/Voice | $9,999.00 |
| AccuCap Captioning — Steno | $7,999.00 |
| Eclipse RSR — Realtime Speech Reporting | $6,499.00 |
| EclipseVox — Steno/Voice | $5,999.00 |
| Eclipse Steno | $4,499.00 |
| Eclipse Edit | $1,849.00 |
| Student Software — Steno/Voice | $399.00 |
| Eclipse and AccuCap Install, USB drive | $25.00 |

### Certified accessories

| Item | Price |
| --- | --- |
| Advantage2 Keyboard (PC & Mac) | $349.00 |
| ThinkPad Universal USB-C Dock, 135W | $159.99 |
| ThinkPad 135W AC Adapter (USB-C) | $79.99 |
| Lenovo 100W USB-C AC Adapter | $79.99 |
| Lenovo 65W USB-C Power Supply | $65.00 |
| 3-Port USB-C Travel Charger, 65W | $55.00 |
| MiniSurge | $49.00 |
| External DVD Drive, USB 3.0 & Type-C | $39.99 |

---

## 8. File structure

```
config/catalog.ts                    # Static catalog (20 items: GIDs, prices, categories, assets)
lib/shopify.ts                       # Storefront GraphQL client, variant mapping, permalink generator
lib/utils.ts                         # cn() class merge helper
app/actions/checkout.ts              # Server Action: processCheckoutPayload()
app/api/shopify-debug/route.ts       # Diagnostics endpoint querying live Shopify products
app/layout.tsx                       # Root layout, Inter font, CartProvider, Header, Footer
app/page.tsx                         # Home (hero, featured laptop, bento rows, category sections)
app/laptops/page.tsx                 # Workstations catalog with Configurator Drawer hooks
app/software/page.tsx                # Comparison Sheet and Catalog Grid views
app/accessories/page.tsx             # Peripherals with technical spec badges
app/bundles/page.tsx                 # Pre-configured bundles with 2x2 spec matrices
app/cart/page.tsx                    # Cart page: quantity management, order summary
app/globals.css                      # Tailwind v4 import, theme tokens, surface variables
components/site-header.tsx           # Sticky header, nav, reactive cart pill, mobile drawer
components/site-footer.tsx           # 4-column directory, legal, TEKGUYZ attribution
components/configurator-drawer.tsx   # Slide-over configurator, real-time tallying, checkout
components/featured-hero.tsx         # Dark editorial hero with floating mockup cards
components/checkout-trigger.tsx      # Client button executing the Server Action, pending state
components/cart-context.tsx          # Cart CRUD context with localStorage sync
components/optimized-image.tsx       # Resilient loader for Shopify CDN and offline fallbacks
```

---

## 9. Build status

**Source's own words, September 2026. Not re-measured for this KB.**

- `next build` passes cleanly, exit code 0.
- All routes compile to static or prerendered pages: `/`, `/accessories`,
  `/bundles`, `/cart`, `/laptops`, `/software`, plus `λ /api/shopify-debug`.
- `eslint .` clean, zero findings.
- Strict TypeScript typecheck passes.
- Cart and storage state hydration verified, with fallback indicators.
- Shopify Storefront endpoint operational, variant mapping fallback active.

---

## 10. Accuracy notes

- **No repository or commit is recorded**, so nothing here has been read back off
  a tree. Every claim is the source document's.
- **The build status in §9 is claimed, not measured** for this KB.
- **Two hostnames are in play** and their relationship is unconfirmed: the source
  names `reporterresource.com` / `r3prbh-ae.myshopify.com`; the site entry uses
  `reporter-resource-temp.vercel.app`. **The site's hourly status check measures
  the `-temp` host** — that is the one whose uptime the `/work` page asserts.
- **Prices in §7 are catalog data with a date on them.** They are not TEKGUYZ
  prices and must never appear on tekguyz.com, which does not publish prices at
  all.
- **The source document lists a storefront password value in plain text.** It has
  been omitted here deliberately. If that mechanism is still in use, treat the
  value as a credential and rotate it rather than copying it forward.
