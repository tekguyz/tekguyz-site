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
import { PANEL_DUR, PANEL_EASE } from '@/components/concierge/panel-motion';
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
 *   panel     420 x 640 (D-04) · radius 16px · one hairline · no shadow ·
 *             header 56px · body padding 20px 16px, gap 20px, list floor
 *             `flex: 1 1 440px` · footer padding 16px, a 44px input + Send
 *
 * Replies are plain text on the canvas; only the visitor's own words get a
 * surface fill, so the panel reads as a document rather than a chat toy. The
 * disclaimer never scrolls away.
 *
 * Three things here are bounded by the VIEWPORT, never by content, and each one
 * cost a measured defect (docs/archive/MOBILE-AUDIT.md):
 *
 *   Panel height.  `max-height: calc(100dvh - 48px)`. The panel used to size
 *     from content while anchored `bottom: 24px`, so at 844x390 it grew upward
 *     and put its own close button 119px above the top edge (M-03, blocking).
 *     A future longer message list scrolls INSIDE the list; the panel never
 *     grows past this bound again.
 *   Sheet threshold.  `(max-height: 560px)` OR `(max-width: 767px)`. The height
 *     arm is load-bearing and never comes out: the blocking case is a phone
 *     held sideways, which is *wider* than 768px, so a width-keyed threshold
 *     misses it entirely. The width arm is additive, for the tall portrait
 *     phone that clears 560px and still wants a sheet.
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

/**
 * Sheet threshold — an OR of two conditions, and the height arm is the
 * load-bearing one (D-04).
 *
 * `(max-height: 560px)` is derived in DESIGN.md §8: 485 + 24 + 24 = 533,
 * rounded up. It closes M-03, whose blocking case is 844x390 — a phone held
 * sideways, which is *wider* than 768px and therefore invisible to a
 * width-keyed threshold. It does not get removed.
 *
 * `(max-width: 767px)` is ADDITIVE, not a reversal: a tall portrait phone
 * clears 560px of height and still wants a sheet, a case the height arm
 * legitimately does not cover.
 */
const SHEET_QUERY = '(max-height: 560px), (max-width: 767px)';

/**
 * How long the captured confirmation sits on screen before the panel closes
 * itself (user decision, 2026-08-12, both modes).
 *
 * **Not a motion token, and deliberately not in `globals.css`.** Every `--dur-*`
 * is a transition length — the longest is 500ms — and this is a *dwell*: how
 * long a human needs to read fourteen words. Borrowing a motion token for it
 * would tie a reading time to an animation curve, and moving one would silently
 * move the other.
 *
 * 4s is the confirmation ("Details received" + "Done — your details are in.
 * Expect a reply within one business day.") at a deliberately slow reading pace,
 * with room to notice it appear first.
 *
 * **The dwell is cancellable, and that is what makes auto-close safe** — see
 * `stayOpen`. Without it this would be an un-adjustable time limit on content
 * (WCAG 2.2.1) and would contradict §4.13's standing point that a captured lead
 * may still have questions.
 */
const CAPTURE_CLOSE_DWELL = 4000;

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

/**
 * Who is speaking, on every reply — the opener included.
 *
 * The visitor's turn is deliberately NOT labelled: a right-aligned filled bubble
 * already says "you", and captioning both sides turns a three-line exchange into
 * a transcript. The reply had no fill, no alignment and no container, so a long
 * one arrived as an unbroken slab of text with no visible owner — which is the
 * defect this closes.
 *
 * Not a new style: this is the site's eyebrow treatment (caption / 700 / 0.1em /
 * uppercase / secondary) carrying `ConnectedNodes`, the same mark as the panel
 * header and the launcher.
 *
 * Real text, never `aria-hidden`. The list is `aria-live="polite"`, so a screen
 * reader announces the speaker before what they said — the same job the label
 * does visually, which is exactly when a label should not be hidden.
 */
function ReplyLabel() {
  return (
    <p className="mb-[10px] flex items-center gap-2 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
      <ConnectedNodes size={14} stroke="currentColor" strokeOpacity={0.55} />
      TEKGUYZ
    </p>
  );
}

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
  /** Set once the visitor types after a capture — it permanently cancels the
   *  auto-close. One-way on purpose: if they re-empty the field, the panel must
   *  NOT quietly re-arm and close on them mid-thought. */
  const [stayOpen, setStayOpen] = useState(false);
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
  /** `sheet`, readable from the focus effect WITHOUT making it a dependency.
   *  Depending on it directly is a live bug, not a lint nicety: on Android the
   *  soft keyboard can shrink the layout viewport past `(max-height: 560px)`,
   *  which flips `sheet` — and an effect that re-ran there would re-focus the
   *  panel, dismiss the keyboard, restore the height, and start again. */
  const sheetRef = useRef(sheet);

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
    /* Ref and state are set in the SAME callback, so they cannot disagree — and
       `sync()` runs on mount, so the ref is correct before the panel can open.
       A separate syncing effect would have an ordering question here; this has
       none. Only the focus effect reads the ref; everything else reads state. */
    const sync = () => {
      sheetRef.current = mq.matches;
      setSheet(mq.matches);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Focus moves into the panel on open and back to the launcher on close, in
     every mode. If the launcher is yielded — the panel was opened from the
     closing-CTA link, which is on screen and therefore hiding it — focus goes
     back to that link instead; returning it to an `aria-hidden` control would
     be worse than not returning it.

     WHAT receives focus is mode-dependent, and that is the fix for the soft
     keyboard (user, Pixel 9A, 2026-08-12: opening the concierge on a phone
     raised the keyboard immediately). Focusing a text input is what raises it,
     and in sheet mode the keyboard then eats a panel that is already bounded by
     the viewport. So sheet mode focuses the PANEL — §8's dialog baseline says
     focus must enter the panel on open, not that it must land on a text field,
     and a container focus is also what makes a screen reader announce the
     dialog. Above the threshold there is a physical keyboard and no such cost,
     so the input keeps focus and you can type straight away.

     Deliberately keyed to `sheet`, not to `(pointer: coarse)`: `sheet` is the
     mode split this component already has, and a second mechanism for one
     behaviour is the thing to avoid. The trade is a short desktop window
     (`max-height: 560px`) getting the container focus too — correct for that
     viewport anyway, since the panel is a sheet there. */
  useEffect(() => {
    if (open) {
      if (!wasOpen.current) openerRef.current = document.activeElement as HTMLElement | null;
      wasOpen.current = true;
      if (sheetRef.current) (panelRef.current ?? closeRef.current)?.focus();
      else (inputRef.current ?? closeRef.current)?.focus();
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const launcher = launcherRef.current;
    if (launcher && launcher.getAttribute('aria-hidden') !== 'true') launcher.focus();
    else openerRef.current?.focus?.();
  }, [open]);

  /* Close itself once the lead is captured, in BOTH modes (user decision,
     2026-08-12, after using it on a Pixel 9A). The lead is in; leaving a panel
     up — a full-screen sheet on a phone — makes the visitor dismiss something
     that has finished its job.

     This reverses part of §4.13, which argued the panel should stay because a
     captured lead may still have questions. That argument is preserved rather
     than discarded: it lives in the three guards below, not in staying open
     forever.

       stayOpen  they typed after capturing — they DO have another question, so
                 the dwell is cancelled for good.
       busy      a reply is in flight; closing mid-request would drop an answer
                 the visitor is waiting for.
       open      re-arming a timer for a panel already shut does nothing useful.

     Closing routes through the normal `open` path, so it is one behaviour, not
     a second one: the exit animation, the focus return to the launcher, and the
     scroll-lock cleanup all happen exactly as they do for the ✕ or Escape.
     Nothing is lost by closing — `messages` and `captured` are untouched, so
     reopening shows the same thread with the confirmation still in it. */
  useEffect(() => {
    if (!open || !captured || stayOpen || busy) return;
    const t = setTimeout(() => setOpen(false), CAPTURE_CLOSE_DWELL);
    return () => clearTimeout(t);
  }, [open, captured, stayOpen, busy]);

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
     `flex: 1 1 440px` floor are deliberate (M-03), and a longer reply is
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

  /* Presence, per mode — the recipe and its reasoning are in panel-motion.ts.
     Arriving and leaving are asymmetric: in on `--ease-entrance` because the
     panel is settling into place, out one duration shorter on `--ease-hover`
     because the visitor has already decided and should not have to watch the
     entrance run backwards.

     Under `reduce` the geometry AND the duration both go to zero, so the panel
     appears and disappears. That is not a fast version of the transition — it
     is none of it, which is the same floor every other entrance on this site
     holds to. Zero duration also lets AnimatePresence unmount immediately
     rather than holding an invisible panel for the length of an exit. */
  const presence = reduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1, transition: { duration: 0 } },
        transition: { duration: 0 },
      }
    : sheet
      ? {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%', transition: { duration: PANEL_DUR.base, ease: PANEL_EASE.hover } },
          transition: { duration: PANEL_DUR.state, ease: PANEL_EASE.entrance },
        }
      : {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
          exit: {
            opacity: 0,
            scale: 0.96,
            transition: { duration: PANEL_DUR.fast, ease: PANEL_EASE.hover },
          },
          transition: { duration: PANEL_DUR.base, ease: PANEL_EASE.entrance },
        };

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
        /* Padding is mobile-first and the two values are not the same decision.
           `py-[13px]` + the 18px mark = EXACTLY the 44px tap floor, which is the
           reason for the odd number: nothing above the floor is doing work.
           Desktop keeps 24x16, where the pill is 16% of a 1440 viewport.

           Measured 2026-08-13 on a 412px viewport (Pixel 9A): the one desktop
           size shipped to every width made this 234x50 — 57% of the screen,
           landing on the Process teaser's body copy. 48px of that was padding.
           The launcher does not use `button.tsx` and never has; its 24x16 is a
           fifth padding that exists nowhere in that scale.

           The padding is 1px short of those numbers on every side because the
           HAIRLINE adds it back: 12+18+12+2 = 44, 15+18+15+2 = 50. Identical
           outer box to before the border existed.

           That border is `rgb(255 255 255 / 0.25)`, and the alpha is the whole
           trick. Border colour composites over the element's own background
           (background-clip is border-box), so on the ink pill it resolves to
           ~#4C4C4C: DARKER than a light page, so the pill's edge looks exactly
           as it always did, and lighter than the ink band, so the pill stops
           disappearing into it in light mode. In dark mode the pill inverts to
           #F5F5F5 and the same declaration resolves to ~#F7F7F7 — invisible,
           which is correct, because a near-white pill needs no help.

           A shadow would not have worked here even if §3 allowed one: a dark
           halo around a dark pill on a dark band adds no edge. */
        className={`tg-yield fixed z-[80] flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-[rgb(255_255_255_/_0.25)] bg-cta-bg px-[15px] py-[12px] text-[14.5px] leading-none font-semibold text-cta-fg hover:bg-cta-hover active:scale-[0.98] md:px-[23px] md:py-[15px] ${
          launcherVisible ? '' : 'pointer-events-none'
        }`}
      >
        <ConnectedNodes size={18} stroke="currentColor" strokeOpacity={0.4} />
        {/* Two spans, swapped by CSS — never `matchMedia`, which renders the
            wrong string on the server and hydrates into a mismatch. `hidden` is
            `display:none`, so the inactive string leaves the accessibility tree
            with it and a screen reader reads exactly one.

            Deliberately NO `aria-label` pinning the long string at every width:
            the accessible name would then be "Ask about your project" while the
            visible label reads "Ask us", and WCAG 2.5.3 requires the name to
            contain the visible text. The visible text IS the name. */}
        <span className="md:hidden">Ask us</span>
        <span className="hidden md:inline">Ask about your project</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Ask about your project"
            aria-modal={sheet ? true : undefined}
            /* Programmatically focusable, never a tab stop. In sheet mode this
               is what receives focus on open instead of the input — see the
               focus effect. `-1` also keeps it out of `FOCUSABLE`, so the trap
               never counts the panel itself as one of its own stops. */
            tabIndex={-1}
            {...presence}
            /* The desktop panel scales from its own bottom-right corner, which
               is the launcher's corner — both are anchored right/bottom 24px,
               so the two coincide and the panel unfolds out of the control that
               opened it. The sheet needs no origin: it translates. */
            style={sheet ? SHEET_INSET : { ...INSET, transformOrigin: '100% 100%' }}
            className={
              sheet
                ? 'fixed z-[80] flex flex-col overflow-hidden bg-bg'
                : /* 420 x 640 is the D-04 PREFERENCE; `max-height` still wins.
                     `height` gives the panel its considered size when the
                     viewport has room, and yields to the bound when it does
                     not — which is the whole point of expressing it as a
                     preference rather than a floor. */
                  'fixed z-[80] flex h-[640px] max-h-[calc(100dvh-48px)] w-[420px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-[16px] border border-border bg-bg'
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

            {/* `flex: 1 1 440px` + `min-height: 0`, NOT `min-h-[440px]` (D-04).
                The floor is a preference that yields: when the panel hits its
                viewport bound the list compresses and scrolls inside itself,
                rather than pushing the panel past the top edge. A hard
                min-height cannot yield — it would hold the floor and the panel
                would clip it against its own `overflow: hidden`, the same
                defect one layer down. In sheet mode the same declaration grows
                it to fill the screen. */}
            <div
              ref={scrollRef}
              className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 py-5 [flex:1_1_440px]"
            >
              {/* The opener is a reply like any other to the reader, even though
                  it never goes through `messages` and carries no `data-msg` —
                  it is not a turn the scroll anchor should ever target. Without
                  the label it would be the one unattributed reply in the panel,
                  and it is the first thing anyone reads. */}
              <div>
                <ReplyLabel />
                <p className="text-[0.875rem] leading-[1.55]" style={{ textWrap: 'pretty' }}>
                  {opener}
                </p>
              </div>

              {showChips && (
                <div className="flex flex-col items-start gap-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => send(chip)}
                      /* `tap-44`: the painted chip is 40px tall (`py-2` on a
                         14px line), 4px under the tier-1 floor. The pseudo
                         expands the hit box to 44 without touching the box you
                         see — "expand, never resize", §8. The 8px `gap-2`
                         above survives it: two expanded boxes each grow 2px
                         toward each other, leaving 4px of clearance, so this
                         creates none of the source-order adjacency overlaps
                         the footer column hit at 12px. Invisible to
                         `phaseTaps`, which never opens the panel. */
                      className="tap-44 cursor-pointer rounded-[8px] border border-border px-3 py-2 text-left text-[0.875rem] text-secondary transition-colors duration-[240ms] hover:border-border-strong hover:text-fg"
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
                      <ReplyLabel />
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

            {/* Cap-reached is the one state that removes the input: there, the
                handoff IS the action, and the footer has nothing left to hold —
                so the whole bordered strip goes with it rather than shipping an
                empty 33px rule. (It used to hold the disclaimer, removed
                2026-08-12 on the user's instruction; see docs/COPY.md.) */}
            {!capReached && (
              <div className="flex-none border-t border-border p-4">
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
                    onChange={(e) => {
                      setInput(e.target.value);
                      /* Typing after a capture cancels the auto-close for good.
                         Keyed to typing, never to FOCUS: above the sheet
                         threshold focus lands in this input the moment the
                         panel opens, so a focus-keyed cancel would disarm the
                         dwell on every desktop capture and it would never fire.
                         Guarded by `captured` so the common case sets no state
                         it doesn't need to. */
                      if (captured && !stayOpen) setStayOpen(true);
                    }}
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
