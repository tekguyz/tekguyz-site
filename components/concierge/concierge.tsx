'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ConnectedNodes } from '@/components/logo-lockup';
import { ThinkingStripe } from '@/components/concierge/thinking-stripe';
import { Markdown } from '@/components/concierge/markdown';
import { CONCIERGE_OPEN_EVENT } from '@/components/concierge/concierge-bus';
import { getWork } from '@/content/work';
import { site } from '@/lib/site';

/**
 * A persistent launcher, never a modal — nothing dims, nothing traps focus, the
 * page stays usable behind it.
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
 * Launcher visibility is locked: hidden on initial load, fading in only once
 * the visitor has scrolled past the hero. It must never overlap the hero, where
 * it competes with the hero's own CTAs.
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

  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

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

  return (
    <>
      <AnimatePresence>
        {pastHero && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 bottom-6 z-[80] flex cursor-pointer items-center gap-[10px] rounded-[8px] bg-cta-bg px-6 py-4 text-[14.5px] leading-none font-semibold text-cta-fg transition-colors duration-[120ms] hover:bg-cta-hover active:scale-[0.98]"
          >
            <ConnectedNodes size={18} stroke="currentColor" strokeOpacity={0.4} />
            Ask about your project
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask about your project"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 bottom-6 z-[80] flex w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-[16px] border border-border bg-bg"
          >
            <div className="flex h-14 flex-none items-center gap-[10px] border-b border-border px-4">
              <ConnectedNodes size={18} />
              <span className="text-[14.5px] font-semibold">Ask about your project</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-auto h-8 w-8 cursor-pointer rounded-[6px] text-[16px] leading-none text-secondary hover:text-fg"
              >
                ✕
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex max-h-[420px] min-h-[300px] flex-1 flex-col gap-5 overflow-y-auto px-4 py-5"
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
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <p
                      key={i}
                      className="max-w-[85%] self-end rounded-[12px] bg-surface px-[14px] py-3 text-[0.875rem] leading-[1.55]"
                      style={{ textWrap: 'pretty' }}
                    >
                      {m.content}
                    </p>
                  ) : (
                    <Markdown key={i} text={m.content} />
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
                This is a starting sketch, not a quote — pricing always comes from a real
                conversation.
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
