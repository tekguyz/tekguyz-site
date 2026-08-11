'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ConnectedNodes } from '@/components/logo-lockup';
import { ThinkingStripe } from '@/components/concierge/thinking-stripe';
import { Markdown } from '@/components/concierge/markdown';
import {
  CONCIERGE_OPEN_EVENT,
  useLauncherSuppressed,
} from '@/components/concierge/concierge-bus';
import { getWork } from '@/content/work';
import { site } from '@/lib/site';

/**
 * A persistent launcher, never a modal — nothing dims, nothing traps focus, the
 * page stays usable behind it. DESIGN.md §8 "Concierge geometry" is the spec.
 *
 * Export values:
 *   launcher  fixed right/bottom 24px · padding 16px 24px · radius 8px (the
 *             same radius as every other button on the site, NOT a pill) ·
 *             18px mark with currentColor connectors at 40%
 *   panel     380px · radius 16px · one hairline · no shadow ·
 *             header 56px · body padding 20px 16px, gap 20px, min-height 300px
 *             footer padding 16px, disclaimer above a 44px input + Send button
 *
 * Replies are plain text on the canvas; only the visitor's own words get a
 * surface fill, so the panel reads as a document rather than a chat toy. The
 * disclaimer never scrolls away.
 *
 * Three things here are bounded by the VIEWPORT, never by content, and each one
 * cost a measured defect (docs/MOBILE-AUDIT.md):
 *
 *   Panel height.  `max-height: calc(100dvh - 48px)`. The panel used to size
 *     from content while anchored `bottom: 24px`, so at 844x390 it grew upward
 *     and put its own close button 119px above the top edge (M-03, blocking).
 *     A future longer message list scrolls INSIDE the list; the panel never
 *     grows past this bound again.
 *   Sheet threshold.  `(max-height: 560px)` — height, never width. The blocking
 *     case is a phone held sideways, which is *wider* than 768px, so a
 *     width-keyed threshold misses it entirely.
 *   Launcher visibility.  Hidden on initial load; fades in past the hero; and
 *     yields to whichever primary CTA is on screen (M-06 + M-15). Opacity only.
 *
 * The non-modal contract holds above the sheet threshold: the page scrolls
 * behind an open panel, nothing is trapped, no `aria-modal`. Below it the sheet
 * is a real modal, because a full-screen surface that leaves the page tabbable
 * behind it is worse than either.
 */

/**
 * The yield rule's observer target set, deliberately narrow: each page's own
 * hero CTA and the shared `closing-cta` button — the two elements M-15 measured
 * against. Every CTA-styled element on the page would make the launcher flicker
 * in and out on any scroll-heavy route.
 */
const PRIMARY_CTA_SELECTOR = '[data-primary-cta]';

/** Sheet threshold. Derived in DESIGN.md §8: 485 + 24 + 24 = 533, rounded up. */
const SHEET_QUERY = '(max-height: 560px)';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Additive to the existing 24px, never a replacement, and always the
 * two-argument form so a browser without `env()` support resolves to 24px
 * rather than 0.
 */
const INSET = {
  right: 'calc(24px + env(safe-area-inset-right, 0px))',
  bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
} as const;

/** The sheet fills the viewport minus the unsafe edges — all four of them. */
const SHEET_INSET = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
} as const;

const DEFAULT_OPENER =
  "Tell me what's slowing your business down and I'll tell you what we'd build for it. I can also pass your details straight to the team.";

const CHIPS = [
  "We're missing after-hours calls",
  'Everything lives in spreadsheets',
  "I'm not sure what I need",
];

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export function Concierge() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [pastHero, setPastHero] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);
  /* The app-state half of the yield rule — an open nav drawer or an expanded
     FAQ row. See concierge-bus.ts for why this is not a widened observer. */
  const stateSuppressed = useLauncherSuppressed();
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Whatever had focus when the panel opened — the fallback for focus return
   *  when the launcher itself is yielded (opened from the closing-CTA link). */
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  const build = pathname.startsWith('/work/') ? getWork(pathname.split('/')[2] ?? '') : undefined;
  const opener = build
    ? `That's ${build.name} you're looking at. Tell me what you're dealing with and I'll tell you what we'd build for it — or whether something like this fits.`
    : DEFAULT_OPENER;

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CONCIERGE_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONCIERGE_OPEN_EVENT, onOpen);
  }, []);

  /* The yield rule. Keyed on `usePathname()` for the same reason
     RevealController is: the root layout does not remount on a client-side
     navigation, so a `[]` dep array would leave every linked-to route observing
     the previous page's CTAs — or nothing at all. */
  useEffect(() => {
    const onScreen = new Set<Element>();
    const sync = () => setCtaInView(onScreen.size > 0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onScreen.add(e.target);
          else onScreen.delete(e.target);
        }
        sync();
      },
      { threshold: 0 },
    );
    document.querySelectorAll<HTMLElement>(PRIMARY_CTA_SELECTOR).forEach((t) => io.observe(t));
    // A route with no tagged CTA observes nothing, so the callback never fires
    // and a `true` left over from the previous route would strand the launcher
    // invisible. Sync once here for that case.
    sync();
    return () => io.disconnect();
  }, [pathname]);

  /* Sheet mode is a media query, not a breakpoint constant, so it tracks an
     orientation change without a resize listener. The panel never renders on
     the server, so the initial `false` cannot cause a hydration mismatch. */
  useEffect(() => {
    const mq = window.matchMedia(SHEET_QUERY);
    const sync = () => setSheet(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Focus moves into the panel on open and back to the launcher on close, in
     every mode. If the launcher is yielded — the panel was opened from the
     closing-CTA link, which is on screen and therefore hiding it — focus goes
     back to that link instead; returning it to an `aria-hidden` control would
     be worse than not returning it. */
  useEffect(() => {
    if (open) {
      if (!wasOpen.current) openerRef.current = document.activeElement as HTMLElement | null;
      wasOpen.current = true;
      (inputRef.current ?? closeRef.current)?.focus();
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const launcher = launcherRef.current;
    if (launcher && launcher.getAttribute('aria-hidden') !== 'true') launcher.focus();
    else openerRef.current?.focus?.();
  }, [open]);

  /* Body scroll lock — sheet mode only. Above the threshold the page scrolling
     behind the panel is the contract, not a bug. */
  useEffect(() => {
    if (!open || !sheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, sheet]);

  /* Focus trap — sheet mode only, for the same reason. */
  useEffect(() => {
    if (!open || !sheet) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.getClientRects().length > 0,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onTab, true);
    return () => document.removeEventListener('keydown', onTab, true);
  }, [open, sheet]);

  /* Anchor the TOP of the newest message, not the bottom of the list (D-05).
     Scrolling to `scrollHeight` puts the end of a long reply on screen and its
     first line above the fold, so the visitor has to scroll up to read what
     they just asked for. Anchoring the top is self-clamping: a message shorter
     than the list can't scroll past the maximum, so it still lands at the
     bottom and short exchanges behave exactly as before.

     This is not a sizing fix — the panel's viewport bound and the list's
     `flex: 1 1 300px` floor are deliberate (M-03), and a longer reply is
     supposed to scroll inside the list rather than grow it. */
  useEffect(() => {
    const list = scrollRef.current;
    if (!list) return;
    const behavior = reduceMotion ? 'auto' : 'smooth';
    // Not `:last-of-type` — that matches per element name, and the two message
    // roles render as different elements (<p> for the visitor, <div> for a
    // reply), so a trailing reply would not shadow the <p> before it.
    const msgs = list.querySelectorAll<HTMLElement>('[data-msg]');
    const newest = msgs[msgs.length - 1];
    if (!newest) {
      list.scrollTo({ top: list.scrollHeight, behavior });
      return;
    }
    const top =
      newest.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    list.scrollTo({ top, behavior });
  }, [messages, busy, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy || capReached) return;

      const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(next);
      setInput('');
      setBusy(true);
      setError(null);

      try {
        const res = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next, pathname }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Something broke on our end — not yours.');
          return;
        }
        if (data.reply) setMessages([...next, { role: 'assistant', content: data.reply }]);
        if (data.leadCaptured) setCaptured(true);
        if (data.capReached) setCapReached(true);
      } catch {
        setError(
          `Something broke on our end — not yours. Try again in a moment, or email ${site.publicEmail}.`,
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, capReached, messages, pathname],
  );

  const showChips = messages.length === 0 && !busy;

  /* Yielded, not unmounted: focus return on close needs the launcher to still
     be there, and an element that disappears from the DOM cannot transition.
     Two yield inputs, composed: the geometric one (a primary CTA on screen) and
     the app-state one (drawer open, FAQ row expanded). Either suppresses. */
  const launcherVisible = pastHero && !open && !ctaInView && !stateSuppressed;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-hidden={launcherVisible ? undefined : true}
        tabIndex={launcherVisible ? 0 : -1}
        style={{ ...INSET, opacity: launcherVisible ? 1 : 0 }}
        className={`tg-yield fixed z-[80] flex cursor-pointer items-center gap-[10px] rounded-[8px] bg-cta-bg px-6 py-4 text-[14.5px] leading-none font-semibold text-cta-fg hover:bg-cta-hover active:scale-[0.98] ${
          launcherVisible ? '' : 'pointer-events-none'
        }`}
      >
        <ConnectedNodes size={18} stroke="currentColor" strokeOpacity={0.4} />
        Ask about your project
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Ask about your project"
            aria-modal={sheet ? true : undefined}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={sheet ? SHEET_INSET : INSET}
            className={
              sheet
                ? 'fixed z-[80] flex flex-col overflow-hidden bg-bg'
                : 'fixed z-[80] flex max-h-[calc(100dvh-48px)] w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-[16px] border border-border bg-bg'
            }
          >
            <div className="flex h-14 flex-none items-center gap-[10px] border-b border-border px-4">
              <ConnectedNodes size={18} />
              <span className="text-[14.5px] font-semibold">Ask about your project</span>
              {/* 44x44 by padding around the glyph, never by resizing it — the
                  ✕ stays at its exported 16px. The negative margin keeps the
                  painted glyph where the export puts it while the hit area
                  grows outward around it. */}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-[6px] ml-auto flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-[6px] text-[16px] leading-none text-secondary hover:text-fg"
              >
                ✕
              </button>
            </div>

            {/* `flex: 1 1 300px` + `min-height: 0`, NOT `min-h-[300px]`. The
                300px floor is a preference that yields: when the panel hits its
                viewport bound the list compresses and scrolls inside itself,
                rather than pushing the panel past the top edge. In sheet mode
                the same declaration grows it to fill the screen. */}
            <div
              ref={scrollRef}
              className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 py-5 [flex:1_1_300px]"
            >
              <p className="text-[0.875rem] leading-[1.55]" style={{ textWrap: 'pretty' }}>
                {opener}
              </p>

              {showChips && (
                <div className="flex flex-col items-start gap-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => send(chip)}
                      className="cursor-pointer rounded-[8px] border border-border px-3 py-2 text-left text-[0.875rem] text-secondary transition-colors duration-[240ms] hover:border-border-strong hover:text-fg"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-5" aria-live="polite">
                {/* `data-msg` is the scroll anchor's handle — the newest one is
                    what the list scrolls to the top of. It marks messages only:
                    the thinking stripe, the capture confirmation and the error
                    block are states, not turns, and anchoring to one of those
                    would scroll the reply they belong to off the top. */}
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <p
                      key={i}
                      data-msg
                      className="max-w-[85%] self-end rounded-[12px] bg-surface px-[14px] py-3 text-[0.875rem] leading-[1.55]"
                      style={{ textWrap: 'pretty' }}
                    >
                      {m.content}
                    </p>
                  ) : (
                    <div key={i} data-msg>
                      <Markdown text={m.content} />
                    </div>
                  ),
                )}

                {busy && <ThinkingStripe />}

                {captured && (
                  <div className="border-t border-border pt-5">
                    <div className="flex items-center gap-2 text-[0.875rem] leading-[1.55] tracking-[0.04em]">
                      <span
                        aria-hidden
                        className="h-[6px] w-[6px] flex-none rounded-full"
                        style={{ background: 'var(--tg-success)' }}
                      />
                      <span className="font-semibold">Details received</span>
                    </div>
                    <p className="mt-[14px] text-[0.875rem] leading-[1.55] text-secondary">
                      Done — your details are in. Expect a reply within one business day.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="border-t border-border pt-5">
                    <div className="flex items-center gap-2 text-[0.875rem] leading-[1.55] tracking-[0.04em]">
                      <span
                        aria-hidden
                        className="h-[6px] w-[6px] flex-none rounded-full"
                        style={{ background: 'var(--tg-error)' }}
                      />
                      <span className="font-semibold">Didn&rsquo;t send</span>
                    </div>
                    <p className="mt-[14px] text-[0.875rem] leading-[1.55] text-secondary">
                      {error}
                    </p>
                  </div>
                )}

                {capReached && (
                  <div className="mt-auto flex flex-col items-start gap-3 border-t border-border pt-5">
                    <Link
                      href="/contact"
                      className="rounded-[8px] bg-cta-bg px-6 py-[15px] text-[14.5px] leading-none font-semibold text-cta-fg transition-colors duration-[120ms] hover:bg-cta-hover"
                    >
                      Open the contact form
                    </Link>
                    <a
                      href={`mailto:${site.publicEmail}`}
                      className="link-underline text-[0.875rem] text-secondary"
                    >
                      {site.publicEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* The disclaimer never scrolls away. Cap-reached is the one state
                that removes the input: there, the handoff IS the action. */}
            <div className="flex-none border-t border-border p-4">
              <p
                className={capReached ? 'text-[0.75rem] leading-[1.5] text-secondary' : 'mb-[14px] text-[0.75rem] leading-[1.5] text-secondary'}
                style={{ textWrap: 'pretty' }}
              >
                A starting sketch, not a quote.
              </p>
              {!capReached && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex gap-2"
                >
                  <label htmlFor="concierge-input" className="sr-only">
                    Describe what you&rsquo;re dealing with
                  </label>
                  <input
                    id="concierge-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={2000}
                    placeholder={
                      captured ? "Keep going if you'd like…" : "Describe what you're dealing with…"
                    }
                    className="h-11 min-w-0 flex-1 rounded-[4px] border border-border bg-bg px-3 text-[0.875rem] outline-none focus-visible:border-border-strong"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    className="h-11 flex-none cursor-pointer rounded-[8px] bg-cta-bg px-[18px] text-[14.5px] font-semibold text-cta-fg transition-colors duration-[120ms] hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
