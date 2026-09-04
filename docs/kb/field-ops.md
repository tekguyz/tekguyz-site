# KB · TEKGUYZ Field Ops *(StoneApp Operations Hub)*

> **Source caveat — read before citing this anywhere.**
> This document is compiled from a **Google AI Studio applet reference**
> (`ai-studio-applet` / "StoneApp Operations Hub"). Unlike the other documents
> in this folder, it names **no repository, no commit, and no deploy URL**, and
> the status table in §7 is the source's own wording rather than a measured
> result.
>
> **It is therefore NOT confirmed to be the same build as `/work/field-photo-reports`
> on tekguyz.com**, which points at `rs-field-ops.netlify.app`. The two describe
> the same product idea — field photo evidence with an admin view — at
> different levels of ambition. **Do not update the site entry from this
> document without confirming which build the live demo actually serves.**

---

## 1. At a glance

| | |
| --- | --- |
| Product name | TEKGUYZ Field Ops |
| Source | Google AI Studio applet reference, September 2026 |
| Repo / commit | **Not recorded** |
| Deploy URL | **Not recorded** |
| Related site entry | `/work/field-photo-reports` — **relationship unconfirmed, see caveat above** |
| Audience | TEKGUYZ core team, field operations leads, engineering maintainers |

---

## 2. The problem it solves

Countertop fabrication and field installation crews work on job sites where
cellular and data connectivity is frequently degraded, intermittent, or absent —
basements, remote residential lots, concrete commercial buildings.

Before this system:

- Technicians relied on paper job sheets, or on generic field tools that cannot
  function offline.
- Photos taken on site had no standardized verification: missing dimensional and
  seam documentation, uncalibrated timestamps, and no geographic proof.
- Sign-offs and punch-list defect reporting waited until the end of the day or
  week, delaying invoicing and customer dispute resolution.
- Dispatchers and administrative staff had **zero real-time visibility** into
  whether installers were en route, on site, or blocked.
- **StoneApp** ERP/scheduling exports could not be ingested into a technician's
  mobile workflow without manual transcription.

---

## 3. Why it was built

Purpose-built as an **offline-first mobile Progressive Web App** coupled with an
administrative Command Center. It bridges StoneApp job exports directly into
technicians' hands with zero friction, capturing immutable sign-offs,
watermarked photographic proof, issue flags, and inventory usage, while keeping
both local browser storage and a cloud Supabase backend in sync.

---

## 4. What it actually does

Two discrete environments, unified under role-based routing.

```
                  ┌──────────────────────────────────────┐
                  │    StoneApp CSV Export (ERP Data)    │
                  └──────────────────┬───────────────────┘
                                     ▼
             ┌────────────────────────────────────────────────┐
             │       Admin Portal / Ingestion Engine          │
             │   - CSV normalization & auto-deduplication     │
             │   - Dispatching & tech assignment              │
             │   - Live Command Center & SLA watchdogs        │
             └──────────────┬──────────────────┬──────────────┘
                            │                  │
                    Online  │                  │  Offline fallback
                 PostgreSQL │                  │  (IndexedDB / LocalStorage)
                            ▼                  ▼
 ┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
 │     Admin desktop experience         │  │       Field tech mobile PWA          │
 │  - /command-center (live HUD & SLA)  │  │  - /field (daily manifest & route)   │
 │  - /jobs (table, filters, details)   │  │  - /field/job/[id] (execution flow)  │
 │  - /inventory (truck & shop stock)   │  │  - Watermarked photo verification    │
 │  - /team (crews, status, skills)     │  │  - Touch signature capture           │
 │  - /admin/reports/[id] (PDF/signoff) │  │  - Issue reporting / sync queue      │
 └──────────────────────────────────────┘  └──────────────────────────────────────┘
```

### 4.1 Field technician PWA — `/field`, `/field/job/[id]`, `/field/profile`

- **Daily route manifest.** Chronological, prioritised jobs for the assigned
  technician, with quick-tap status badges: `SCHEDULED`, `EN_ROUTE`,
  `IN_PROGRESS`, `ACTION_REQUIRED`, `COMPLETED`, `CANCELLED`.
- **Turn-by-turn and contact launchers.** Native URI linking for navigation
  (`waze://`, `google.navigation:`, `https://maps.google.com`) and phone calls,
  straight from the manifest.
- **Stage progression flow**, in an enforced sequence: En Route → Clock In /
  Arrived → Execute Scope → Capture Evidence → Sign-off → Complete.
- **Standardized photographic evidence pipeline.**
  - Mandatory capture categories: *before / pre-existing conditions*, *sink and
    cooktop cutouts and clip brackets*, *seam joints*, *faucet hole placements*,
    *final completed overviews*, *backsplash and caulking*.
  - **Enforced client-side canvas watermarking** — Job ID, ISO timestamp, GPS
    coordinates, technician name and step metadata are burned **into the image
    pixels** before upload.
  - Client-side compression to a 1600px bounding box, WebP/JPEG at quality 0.82,
    so payloads survive weak 3G/LTE.
- **Punch-list and issue flagging** (`ReportIssueForm`). Technicians flag
  on-site blockers — cabinet unlevel, plumbing not disconnected, access denied,
  fragile stone fractured — triggering immediate notifications and the
  `ACTION_REQUIRED` badge.
- **Touch-optimized signature capture.** Canvas-based customer acceptance with
  vector line smoothing and inline timestamping.
- **Haptic feedback** via `shared/lib/haptics.ts` on critical actions — state
  completion, camera trigger, error.

### 4.2 Administrative hub — `/command-center`, `/jobs`, `/inventory`, `/team`, `/settings`

- **Real-time operations Command Center.** High-density dashboard: active
  technician counts, jobs running past SLA thresholds, unassigned critical jobs,
  flagged blockers.
- **StoneApp CSV ingestion engine.** Drag-and-drop, supporting the standard
  20-job and 50-job StoneApp exports. Maps their headers — `Job #`, `Customer`,
  `Job Name`, `Address`, `City`, `State`, `Zip`, `Phone`, `Scheduled Date`,
  `Installers/Crew`, `SqFt`, `Edge Profile`, `Color/Material`, `Scope Notes` —
  into the relational database.
- **Customer sign-off report generator** (`/admin/reports/[id]`). Printer- and
  PDF-friendly completion certificates showing technician information, client
  signature, watermarked evidence photos and the scope checklist.
- **Inventory tracking.** Truck stock and central warehouse consumables —
  silicone tubes, shims, seam epoxy, anchors, sink clips, diamond polishing pads.
- **Crew management.** Technician roster, assigned trucks, availability,
  certifications, active loadout.

---

## 5. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15+, App Router with nested route groups `(admin)` and `(field)` |
| Language | TypeScript 5.x, strict |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), Radix UI primitives, `lucide-react` |
| Animation | Motion (`motion/react`) |
| Server state | `@tanstack/react-query` v5 |
| Client state | Zustand (`entities/user/store.ts`) for auth/session |
| Local persistence | Custom IndexedDB wrappers |
| Cloud database | Supabase (PostgreSQL 15+) with RLS enabled |

### Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service / notification
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NOTIFICATION_WEBHOOK_URL=your_notification_webhook_url
```

**If `NEXT_PUBLIC_SUPABASE_URL` is omitted, the application runs in local
zero-latency fallback mode with full operational functionality preserved** via
IndexedDB and mock data seeds. That is a design property, not a degraded mode.

---

## 6. Architecture worth knowing

**Dual-tier resilient persistence.** `entities/job/api.ts` implements an
automated fallback:

1. If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present
   and reachable, queries hit PostgreSQL directly.
2. If offline, unconfigured, or a network request fails, the application
   **transparently falls back** to `shared/lib/storage.ts` (IndexedDB /
   LocalStorage) and seeds initial state from `shared/api/mock-data.ts`.

**Sync queue engine** (`shared/api/sync-queue.ts`, `shared/lib/useSyncManager.ts`).
An offline mutation queue in persistent browser storage, listening to the
browser's `online` and `offline` events, with automatic retry on exponential
backoff and last-write-wins conflict resolution keyed on client mutation
timestamps. Background replay commits queued job updates, photo uploads and
issue reports when the network returns.

**Client-side image processing** (`shared/lib/image-processor.ts`). HTML5 Canvas
or OffscreenCanvas, entirely in the browser. Resizes raw camera input —
typically 12MP to 48MP on a modern phone — to a 1600px bounding box, then renders
an opaque bottom telemetry bar:

```
TEKGUYZ VERIFIED EVIDENCE
JOB: <job_number> | TECH: <tech_id>
GPS: <latitude>, <longitude> (±<accuracy>m)
TIMESTAMP: <ISO UTC / local timestamp>
CATEGORY: <before|cutout|seam|faucet|final|defect>
```

**In-browser watermarking without a server round-trip** is the point: proof of
work is tamper-resistant **even if the device loses connection before syncing.**

**PWA configuration.** `/public/manifest.json` — standalone display, portrait
orientation, theme colour `#0f172a`, install prompts via
`/components/IOSInstallBanner.tsx`. Service worker at `/public/sw.js` precaches
the static shell and handles runtime caching of critical operational views.

**Optimistic UI with haptic confirmation.** State transitions update the UI
instantly and fire a short physical pulse on compatible devices — so crews
working in gloves or on noisy sites get tactile confirmation.

**Direct StoneApp CSV schema compatibility.** The ingestion parser maps
StoneApp's idiosyncratic field names directly, with no manual data scrubbing by
administrative staff.

---

## 7. Data model

### Job record — `entities/job/types.ts` and `database.sql`

```typescript
interface Job {
  id: string;                    // UUID or alphanumeric job key, e.g. "JOB-2024-001"
  job_number: string;            // StoneApp work order reference
  customer_name: string;
  customer_phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'SCHEDULED' | 'EN_ROUTE' | 'IN_PROGRESS'
        | 'ACTION_REQUIRED' | 'COMPLETED' | 'CANCELLED';
  scheduled_date: string;
  scheduled_time_window?: string;
  lead_tech_id?: string;
  lead_tech_name?: string;
  crew_members?: string[];
  square_footage?: number;
  material_type?: string;        // e.g. "Quartz 3cm", "Granite Premium"
  color_pattern?: string;
  edge_profile?: string;         // e.g. "Eased", "Mitered 2in", "Ogee"
  scope_notes?: string;
  special_instructions?: string;
  checklists?: {
    pre_inspection: boolean;
    cabinets_verified: boolean;
    cutouts_tested: boolean;
    seams_polished: boolean;
    caulking_sealed: boolean;
    customer_walkthrough: boolean;
  };
  signature_url?: string;
  signed_by?: string;
  signed_at?: string;
  issues_count?: number;
  photos_count?: number;
  created_at: string;
  updated_at: string;
}
```

### Enums and tables

- `job_status_enum` — `SCHEDULED`, `EN_ROUTE`, `IN_PROGRESS`,
  `ACTION_REQUIRED`, `COMPLETED`, `CANCELLED`
- `photo_category_enum` — `BEFORE`, `CUTOUT`, `SEAM`, `FAUCET`, `FINAL`,
  `DEFECT`
- `issue_severity_enum` — `LOW`, `MEDIUM`, `HIGH`, `BLOCKER`

Tables under RLS: `jobs`, `job_photos` (public and thumbnail URLs, geo-tags,
verification flags), `job_issues` (resolved and unresolved site impediments with
photo attachments), `inventory_items` (quantities on hand, minimum thresholds,
bin locations), `team_members`, `audit_log` (compliance and stage-transition
tracking).

---

## 8. Security and authentication

- **Auth layer:** `@supabase/supabase-js`, with a dual fallback to local mock
  user state (`entities/user/store.ts`).
- **Roles:** `admin`, `dispatcher`, `technician`, `lead_installer`.
- Field technicians are scoped strictly to their assigned routes (`/field`).
- Administrative routes require elevated privileges (`admin` / `dispatcher`).
- **RLS policies in `database.sql` enforce that non-admin authenticated users
  can only update jobs where `auth.uid() = lead_tech_id`.**

---

## 9. Build status

**These are the source document's own status words, not a measurement taken for
this KB.** No test count, commit or deploy check backs them.

| Component | Status | Notes |
| --- | --- | --- |
| PWA field manifest (`/field`) | Operational | Fast loading, cached route manifest, dynamic filtering by status |
| Field execution detail (`/field/job/[id]`) | Operational | Stage timeline, watermarked photo capture, customer signature |
| Admin Command Center (`/command-center`) | Operational | Real-time SLA monitors, metric cards, active alerts widget |
| StoneApp CSV ingestion | Operational | Standard 20-job and 50-job export formats |
| Printable report engine (`/admin/reports/[id]`) | Operational | Clean layout for PDF rendering / sign-off certificate export |
| Offline resilience engine | Operational | Seamless fallback when Supabase variables are unlinked |
| Push notification relay (`/app/api/notify`) | **Ready**, not operational | Endpoint prepared to dispatch SMS/push alerts on critical blockers |

---

## 10. Accuracy notes

- **No repository, commit, or deploy URL is recorded.** Everything above comes
  from one reference document. Nothing here has been read back off a running
  system.
- **The status table in §9 is claimed, not measured.** "Operational" is the
  source's word. There is no test count, no build log and no live check behind
  any row.
- **The relationship to `/work/field-photo-reports` is unresolved.** That site
  entry points at `rs-field-ops.netlify.app` and describes a simpler product —
  photo capture, structured reports, an admin view, an account switcher in the
  demo. This document describes offline sync, GPS watermarking, StoneApp CSV
  ingestion, inventory and crew management. **They may be the same build at two
  stages, or two different builds.** Confirm against the live demo before
  changing site copy.
- **No client name, price, timeline or metric appears in the source**, and none
  has been added.
