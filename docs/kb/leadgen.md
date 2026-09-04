# KB · TEKGUYZ Lead Gen *(repo: `tekguyz-leadgen`)*

> **It is not on the site, and that is a decision, not an omission.** This is a
> command-line tool with no UI, no deploy, and no demo. Every `/work` entry on
> tekguyz.com is "open it and use it yourself" — this one cannot be opened. It
> appears on the site **only** as the outbound half of the story on
> `/work/tekguyz-crm`, which is where its output actually lands.

---

## 1. At a glance

| | |
| --- | --- |
| Repo | `C:\Projects\tekguyz-leadgen` |
| Source doc date | `docs/STATUS.md` last updated 2026-08-25 |
| Compiled here | 2026-09-04 |
| Deploy | **None.** Local CLI. |
| Dependencies | **Zero npm packages.** Node 24 ESM. |
| Site entry | none — feeds `/work/tekguyz-crm` |
| Secrets held | **None.** `apify login` keeps the credential in apify-cli's own store, outside this repo. |

> **This repo spends real money.** Every run bills the Apify Google Maps Actor
> at roughly **$0.006 per place returned**. That changes the rules: **never run
> the pipeline to "check" something**, not even with `--max 1`. If a figure
> needs a scrape to verify, it is unverified — say so.

---

## 2. The problem it solves

Finds local businesses that are **well rated but have a bad website or no
website at all.** Those are the people who buy a website build.

Give it one niche and one city. It gives back a CSV you can start calling from.

It replaces a manual "30 seconds per lead" check. **Judging website *quality* is
still done by hand** — this only finds businesses that have no site, or one that
is provably dead.

---

## 3. How it works

```
node src/cli.js --niche "hvac contractor" --city "Miami, FL"   # one niche
node src/cli.js --city "Miami, FL" --all-niches                # whole city, 15 niches
```

`--all-niches` runs every niche in `src/niches.js` against one city and writes
**one combined CSV**, with `niche_searched` on every row. The same business
found under two niches is handed over **once**. A ranked table at the end shows
which niches paid off and which are thin in that city. A niche whose Actor run
fails is logged and the sweep carries on.

### What counts as a lead

The Actor is asked for **no-website, 4-star** places only — those filters are
applied **before billing**, which is what makes it cheap. A business is then
kept locally only if **all** of these are true:

- rating **4.0 or better**
- **3 or more reviews**, no upper limit
- not permanently closed
- **never handed over before** (the ledger, below)
- no website, or a website we can **prove** is dead

**Why 3 reviews and not 10.** Measured on 23 open, 4-star, no-website
businesses across two cities:

| Review floor | Leads kept | Yield |
| --- | --- | --- |
| 10+ | 5 | 22% |
| 5+ | 12 | 52% |
| **3+** | **17** | **74%** |

A floor of 10 threw away three quarters of the places already paid for.
Lowering it **costs nothing** — it is applied locally, after the scrape, so no
extra place is ever billed. The trade is reputation depth, not money.

### Website status — exactly four values, no fifth

Status code only. **The pipeline never reads, renders or judges page content.**

| Value | Meaning | Kept? |
| --- | --- | --- |
| `NO_WEBSITE` | Google has no website for them | yes |
| `BROKEN_LINK` | cleanly dead — 404, gone, dead domain | yes |
| `UNKNOWN_CHECK_MANUALLY` | timed out or blocked us | **no** |
| `LIVE` | the site works, nothing to sell | no |

**Why `UNKNOWN` is excluded, and it is the sharpest lesson in this repo.** 14
delivered leads that had a URL were re-checked. **11 returned 403 while being
perfectly alive** — two unrelated businesses served byte-identical 75KB block
pages. Only 1 was a real 404. "We were blocked" is not "this business needs a
website".

### The ledger

`data/ledger.jsonl` remembers every business already handed over, keyed on its
Google place id. It is **global** — once a business appears in a CSV it never
appears again, whatever niche or city is searched next.

**Rejected businesses are deliberately not recorded.** A business with a working
site today may have a broken one next month, so it gets looked at again.

---

## 4. Where the output goes — the link to the CRM

**This is the half of the story that reaches tekguyz.com.**

Lead Gen writes a CSV. `tekguyz-crm` reads that CSV at `/prospects/import`,
keyed on `place_id`, into its `prospects` table.

**A scraped business is a `prospects` row, never a `leads` row.** `prospects` is
cold-outreach staging. It becomes a `leads` row only when a human presses
**Promote** in the CRM, after a real conversation, and that promotion is
**one-way and one-time** (`promoted_lead_id IS NOT NULL`, never the `CONVERTED`
status string). Writing scrape output straight into `leads` would put
uncontacted businesses into the pipeline the business actually runs on.

**It is not automated, and the site copy must not imply it is.**
`docs/STATUS.md` in that repo says so plainly: *nothing gets automated,
scheduled, or written to `tekguyz-crm` until a conversion signal exists.* Today
a human runs the tool and imports the file. `/work/tekguyz-crm`'s copy says
prospects "land in their own staging lane… until a real conversation promotes
one across" precisely because that is what happens.

### The CSV header row is a published contract

Both repos say so. `tekguyz-crm` copies the header row verbatim into
`src/lib/validation/csv-prospect-schema.ts`.

- **Appending a column at the end is safe** — the CRM ignores unknown columns.
- **Renaming, removing or reordering one is a two-repo change.**
- **`place_id` is compared case-sensitively on both sides.** It is never
  lowercased and never re-issued.
- `src/writer.js` is the **only** module that writes lead output, so moving the
  destination to the CRM's `import_prospects_chunk` RPC stays a one-file change.

---

## 5. Tech stack

Node.js 24 + plain JavaScript (ESM), **zero npm dependencies.**

Node 24 already ships `fetch`, `node:test` and `util.parseArgs`, so there is no
install step and nothing to keep up to date.

**Setup is one command:** `apify login`. No API token is read, stored or written
by this project. Note: apify-cli 1.8.0 does **not** authenticate from an
`APIFY_TOKEN` environment variable — verified in Git Bash, PowerShell, and with
`APIFY_DISABLE_KEYRING=1`. `apify login` is the only path that works.

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | leads written |
| 1 | Actor failure — no CSV |
| 2 | clean run, zero qualified — a headers-only CSV is written as proof |
| 3 | Actor died mid-run — partial leads written, run marked incomplete |
| 64 | bad command line |

---

## 6. Measured economics

**All figures from real Apify runs on 2026-08-25.** They are as-last-measured,
not as-of-today.

| | |
| --- | --- |
| Cost per place returned | ~$0.006 (0.004 scrape + two filters at 0.001) |
| Fort Lauderdale, full sweep | 15 niches, **91 leads, $1.1190, $0.0123/lead** |
| Fort Worth, plumber only | 46 places, **31 leads, $0.2762, $0.0089/lead** |
| Before Actor-side filtering | **$0.080/lead**, and most were not real targets |

Billing is per place **returned**, not requested. A thin niche returns few
places and bills accordingly — `screen enclosure contractor` in Fort Lauderdale
returned 0 places for **$0.0002**. Discovering a dead niche is nearly free,
which is why there is no separate scouting step.

> **None of these figures may appear on tekguyz.com.** The site publishes no
> prices and no invented metrics, and these are internal unit economics for a
> tool we run on ourselves — not a client result.

---

## 7. Build status

**Build phase: proving the leads are real.** The first batch is being contacted
by email and message, then phone. Nothing is automated or scheduled until that
conversion signal exists.

As of 2026-08-25: **120 tests pass**, config drift clean, the ledger holds
**145 suppressed businesses**.

| Shipped | Detail |
| --- | --- |
| Core pipeline | `(niche, city)` → qualified CSV |
| Zero-dependency stack | Node 24 ESM, no npm packages |
| Partial-run recovery | Actor started async, so a run that dies mid-flight still yields its batch. Proven by aborting a live run at 17 places: 33 candidates recovered, 3 leads written, exit 3 |
| Actor-side targeting | `website: withoutWebsite` + `placeMinimumStars: four`, applied before billing. 4x cheaper per lead, measured |
| `UNKNOWN` excluded | Measured: 11 of 14 returned 403 while alive, 1 was a real 404 |
| Whole-city sweep | `--all-niches`, one combined CSV, cross-niche dedupe, thin-market flagging |
| Global dedupe ledger | Keyed on Apify place id alone. Proven: two consecutive identical runs shared 0 place ids |
| Review floor 3 | `MIN_REVIEWS` 5 → 3, mirrored into three docs, drift-checked clean |
| Handoff skill | Audits the status file against the repo, the gitignored ledger and `src/config.js`, **spending nothing** |

---

## 8. Hard rules

1. **Never run the pipeline to "check" something.** Not with `--max 1`. If a
   figure needs a scrape to verify, it is unverified — say so.
2. **Never run against a market TEKGUYZ would not sell into.** Florida first,
   then large US metros only. Roughly **$0.75 has already been wasted** on
   Boise, Tulsa, Wichita, Omaha and Austin.
3. **A scraped business is a `prospects` row, never a `leads` row.**
4. **The CSV header row is a two-repo contract.** Append only.
5. **`src/writer.js` is the only module that writes lead output.**
6. **The ledger is global and append-only**, keyed on place id alone — never
   scoped by niche or city. Only *delivered* leads are recorded.
7. **Write-then-ledger ordering**, so the ledger can never claim a lead that was
   not delivered.
8. **Exactly four website states, no fifth**, from the HTTP status code only.
   Page content is never read, rendered, or judged.
9. **One Actor start attempt, one HTTP check per candidate.** No retries, no
   backoff, no fallback scraper. Partial rows are acceptable output, not a
   defect to engineer away.
10. **Say "measured" or say "projected", never blur the two.** Two lead-volume
    projections have already come in high.

---

## 9. Accuracy notes

- **`data/` and `output/` are gitignored**, so the record of which markets are
  already worked exists in **no commit and no diff**. It is recovered with
  `node .claude/skills/handoff/check-market-coverage.mjs`. Any claim about
  coverage or spend made without running that is a guess.
- **Every figure here is as-last-measured on 2026-08-25** and moves without a
  commit — the ledger count especially.
- **The CRM link is a CSV handoff run by a human today**, not a live
  integration. The RPC path (`import_prospects_chunk`) exists in the CRM and is
  named as the future destination in this repo's own rules, but nothing writes
  to it yet.
- **`tekguyz-crm.md` in this folder records 122 prospects in the real TEKGUYZ
  org as of 2026-08-26.** That is the receiving end of this pipeline. The two
  numbers are from different dates and should not be reconciled with each other.
