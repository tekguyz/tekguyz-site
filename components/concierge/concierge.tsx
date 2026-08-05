'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ConnectedNodes } from '@/components/logo-lockup';
import { ThinkingStripe } from '@/components/concierge/thinking-stripe';
import { CONCIERGE_OPEN_EVENT } from '@/components/concierge/concierge-bus';
import { getWork } from '@/content/work';
import { site } from '@/lib/site';

/**
 * DESIGN.md §4 — the AI concierge.
 *
 * Launcher visibility is LOCKED, not optional: hidden on initial load, fades in
 * only once the visitor has scrolled past the hero. It must never overlap the
 * hero, where it competes with the hero's own CTAs and reads as a bug. This
 * shipped wrong in a reference render precisely because it had only ever been
 * agreed in conversation.
 *
 * Conversation UI:
 *  - No avatars, either side. Visitor messages get a surface fill; assistant
 *    replies are plain text on the panel background, so the exchange reads as a
 *    document rather than a chat-bubble stack.
 *  - Three suggestion chips on the empty state, gone permanently after the first
 *    message — an opener, not a persistent menu.
 *  - Route-aware opener: on a /work/[slug] page it references that build.
 *  - Captured state keeps the input ENABLED — a converted lead may still have
 *    questions, and disabling input at the moment someone converts is exactly
 *    the wrong signal. Cap-reached is the one exception: there the handoff IS
 *    the action, so the input goes away.
 *
 * It is a persistent panel, never a modal — the site has no modals or popups.
 */

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
  const reduced = useReducedMotion() ?? false;

  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Route-aware opener. */
  const build = pathname.startsWith('/work/') ? getWork(pathname.split('/')[2] ?? '') : undefined;
  const opener = build
    ? `That's ${build.name} you're looking at. Tell me what you're dealing with and I'll tell you what we'd build for it — or whether something like this fits.`
    : DEFAULT_OPENER;

  // Gate the launcher on having scrolled past the hero. One viewport height is
  // the practical proxy: the hero is the first screen on every route.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The closing CTA's quiet text link is the concierge's one other entry point.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CONCIERGE_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONCIERGE_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  // Esc closes the panel; focus returns to the launcher.
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
        if (data.reply) {
          setMessages([...next, { role: 'assistant', content: data.reply }]);
        }
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

  const showChips = messages.length === 0;

  return (
    <>
      {/* Launcher — never rendered over the hero. */}
      <AnimatePresence>
        {pastHero && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 bottom-6 z-40 inline-flex items-center gap-3 rounded-[12px] border border-border bg-bg py-3 pr-5 pl-4 text-[0.875rem] font-semibold shadow-none"
          >
            <ConnectedNodes size={22} />
            Ask about your project
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel — persistent, not a modal. No backdrop, no page takeover. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="TEKGUYZ project concierge"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 bottom-0 z-50 flex h-[min(620px,100dvh)] w-full flex-col border border-border bg-bg sm:right-6 sm:bottom-6 sm:h-[620px] sm:w-[420px] sm:rounded-[16px]"
          >
            <header className="flex flex-none items-center justify-between gap-3 border-b border-border px-5 py-4">
              <span className="inline-flex items-center gap-[10px]">
                <ConnectedNodes size={22} />
                <span className="text-[0.875rem] font-semibold">Project concierge</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close concierge"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-secondary hover:text-fg"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-[0.9375rem] leading-[1.6]">{opener}</p>

              {showChips && (
                <ul className="m-0 mt-5 flex list-none flex-col gap-2 p-0">
                  {CHIPS.map((chip) => (
                    <li key={chip}>
                      <button
                        type="button"
                        onClick={() => send(chip)}
                        className="w-full rounded-[8px] border border-border px-3 py-2 text-left text-[0.875rem] text-secondary transition-colors duration-[var(--dur-base)] hover:border-border-strong hover:text-fg"
                      >
                        {chip}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-5" aria-live="polite">
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <p
                      key={i}
                      className="self-end rounded-[10px] bg-surface px-3 py-2 text-[0.9375rem] leading-[1.55] whitespace-pre-wrap"
                    >
                      {m.content}
                    </p>
                  ) : (
                    // Assistant replies are plain text on the panel background —
                    // the exchange reads as a document, not a bubble stack.
                    <p key={i} className="text-[0.9375rem] leading-[1.6] whitespace-pre-wrap">
                      {m.content}
                    </p>
                  ),
                )}

                {busy && <ThinkingStripe />}

                {captured && (
                  <p className="flex items-center gap-[10px] text-[0.875rem] text-secondary">
                    <span
                      aria-hidden
                      className="h-[6px] w-[6px] flex-none rounded-full"
                      style={{ background: 'var(--tg-success)' }}
                    />
                    Done — your details are in. Expect a reply within one business day.
                  </p>
                )}

                {error && <p className="text-[0.875rem]" style={{ color: 'var(--tg-error)' }}>{error}</p>}

                {capReached && (
                  <p className="text-[0.875rem] text-secondary">
                    We&rsquo;ve covered a lot — the fastest next step is the{' '}
                    <a href="/contact" className="link-underline text-fg">
                      contact form
                    </a>
                    , or email{' '}
                    <a href={`mailto:${site.publicEmail}`} className="link-underline text-fg">
                      {site.publicEmail}
                    </a>
                    . Either way you&rsquo;ll hear back within one business day.
                  </p>
                )}
              </div>
            </div>

            {/* Cap-reached is the one state that removes the input: there, the
                handoff IS the action. Captured deliberately keeps it enabled. */}
            {!capReached && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex-none border-t border-border px-5 py-4"
              >
                <label htmlFor="concierge-input" className="sr-only">
                  Describe what you&rsquo;re dealing with
                </label>
                <div className="flex items-end gap-2">
                  <textarea
                    id="concierge-input"
                    ref={inputRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    maxLength={2000}
                    placeholder="Describe what you're dealing with…"
                    className="max-h-32 min-h-[44px] flex-1 resize-none rounded-[4px] border border-border bg-transparent px-3 py-2 text-[0.9375rem] outline-none focus-visible:border-border-strong"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-[8px] bg-cta-bg text-cta-fg disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-[0.75rem] text-secondary">
                  This is a starting sketch, not a quote — pricing always comes from a real
                  conversation.
                </p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
