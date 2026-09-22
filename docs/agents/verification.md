# Verifying — production, hosting and visual checks

Moved out of `CLAUDE.md` on 2026-09-21 (Job 4). Text is unchanged. The short
imperatives stay in `CLAUDE.md`; this file holds the mechanism and the history.

## Pushing, previews and hosting topology

Branch and PR only when asked:

```
git checkout -b <type>/<slug>   # fix/ feat/ docs/
git push -u origin <branch>     # Vercel builds a PREVIEW; tekguyz.com untouched
gh pr create --fill             # gh 2.96, authenticated as tekguyz
```

**After any push, confirm it** — `git log origin/master`, or the Vercel connector's `list_deployments`. **A denied push is not a push that didn't happen:** on 2026-08-10 one reached production while the session was still describing it as pending. Measure it, never infer it from the command's output.

One thing about previews, not a bug: Vercel SSO gates `*.vercel.app` links. **This line used to add that CRM CORS was locked to `https://tekguyz.com` so lead capture failed closed on every preview. That is false** — see the CRM bullet under Lead capture: `sendToCrm` is a server-side fetch from a Server Action, so no origin and no preflight are involved and the CRM's allowed-origin list has never applied to it. Whether lead capture works on a given preview is a question about which env vars that environment has, and it is measurable — do not answer it from this file.

**Hosting topology is external state that drifts without touching the repo, so re-measure it and never cite a doc for it.** It was wrong in two docs for four prompts and got quoted back to the user as a safety claim.

## Checking production — the Vercel connector is available, use it

**Hosting and runtime state are measurable, so measure them instead of citing a doc.** `list_projects` / `get_project` give the real project, domains and latest deployment target; `list_deployments` gives what each push actually did.

**Environment variables are deliberately unreadable, and that does not make them unverifiable.** The connector exposes no env-var tool by design — one that could read them is a hop from a key landing in a transcript. But a *missing* secret throws at runtime and **`get_runtime_errors` reads that**, which is how "are the 5 env vars set?" got answered in one read-only call after being written off as human-only work. `get_runtime_logs` with `group_by: statusCode` is the cheap health check. **Ask what observable a thing produces before declaring it unknowable.**

## Verifying visually — read this before claiming you did

- **Windows animations are off** on this machine (`MinAnimate = 0`), so `prefers-reduced-motion: reduce` matches machine-wide. A deliberate standing preference, not a misconfiguration — **don't change it, and don't burn turns emulating around it.** An inert entrance, a static concierge stripe, an IntersectionObserver that never fires: all expected here. **The motion layer is confirmed working** (user, Pixel 9A, 2026-08-07). Verify wiring by computed style and class count, **say which half you proved**, and leave the motion-enabled check to the user.
- **Set the viewport explicitly** — `resize_window` with width/height. The `desktop` preset resets to the pane's own size, which may be under the 1024px `lg` breakpoint and will silently show you the stacked mobile layout.
- **Screenshots fail when the Browser pane is hidden** (`document.hidden === true` → no compositing → 5s timeout). Only pictures fail; computed styles, geometry, class mechanics, `fetch`, console and network reads all keep working. When the pane is displayed they work normally.
- **A stale server can hold a port and serve a previous build** — HTML referencing chunk filenames that no longer exist, returning 500, which mimics catastrophic breakage (no CSS, no hydration, static pin, no reveals). Kill by port, not by process name, and confirm the referenced stylesheet returns 200 before trusting any measurement. Recipe in `docs/archive/HISTORY.md`.
