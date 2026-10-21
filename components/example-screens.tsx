'use client';

import { useState, type ReactNode } from 'react';
import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import type { Example } from '@/content/examples';
import { cn } from '@/lib/utils';

/**
 * The interactive screen on each /examples page.
 *
 * These are drawn in code ON PURPOSE, and that is why they never sit in a
 * `LiveFrame` or count as a poster: `LiveFrame` shows real captures of running
 * builds only (components.md). An example is labelled an example in its own
 * top bar, every time, so it cannot be read as a client's software.
 *
 * All sample data is made up: names, jobs and times only, no prices and no
 * figures. No action sends, saves or connects anything.
 */
export function ExampleScreen({ example }: { example: Example }) {
  const body = {
    'quote-follow-up': <QuoteFollowUp solution={example.solution} />,
    voicemail: <Voicemail solution={example.solution} />,
    inbox: <Inbox solution={example.solution} />,
    booking: <Booking solution={example.solution} />,
  }[example.screen];

  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-bg shadow-[var(--tg-elevate)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-5 py-3">
        <p className="text-[0.875rem] font-semibold">{example.business}</p>
        <p className="tg-eyebrow text-secondary">Example · made-up data</p>
      </div>
      {body}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Shared pieces                                                             */
/* ------------------------------------------------------------------------ */

function ListButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'block w-full border-b border-border px-5 py-4 text-left transition-[background-color] duration-[120ms]',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg',
        selected ? 'bg-surface' : 'hover:bg-surface',
      )}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warn' | 'urgent' | 'done' }) {
  const dot = {
    neutral: 'var(--tg-muted-soft)',
    warn: 'var(--tg-warning)',
    urgent: 'var(--tg-error)',
    done: 'var(--tg-success)',
  }[tone];
  return (
    <span className="inline-flex flex-none items-center gap-[6px] rounded-[6px] border border-border px-2 py-[3px] text-[0.75rem] font-semibold whitespace-nowrap">
      <span aria-hidden className="h-[6px] w-[6px] rounded-full" style={{ background: dot }} />
      {children}
    </span>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'tap-44 rounded-[8px] border px-3 py-2 text-[0.875rem] font-semibold transition-[border-color,background-color] duration-[120ms]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
            value === o.value
              ? 'border-fg bg-surface'
              : 'border-border text-secondary hover:border-border-strong',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** The two-pane body: a list on the left, the open item on the right. Stacks below 768px. */
function Split({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="border-border md:border-r">{list}</div>
      <div className="border-t border-border p-5 md:border-t-0 md:p-7">{detail}</div>
    </div>
  );
}

/** Approve-and-send, which in an example only changes its own state. */
function Approve({
  approved,
  onApprove,
  idleLabel,
  doneLabel,
}: {
  approved: boolean;
  onApprove: () => void;
  idleLabel: string;
  doneLabel: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onApprove}
        disabled={approved}
        className={cn(
          'inline-flex items-center justify-center rounded-[8px] px-6 py-[15px] text-[14.5px]/[1] font-semibold',
          'transition-[background-color] duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
          approved ? 'border border-border text-secondary' : 'bg-cta-bg text-cta-fg hover:bg-cta-hover',
        )}
      >
        {approved ? doneLabel : idleLabel}
      </button>
      <p role="status" className="text-[0.875rem] text-secondary">
        {approved ? 'In this example nothing is really sent.' : ''}
      </p>
    </div>
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-[8px] border border-border bg-surface p-4 text-[0.9375rem] leading-[1.6] whitespace-pre-line">
      {children}
    </div>
  );
}

function AccentLabel({ solution, children }: { solution: SolutionSlug; children: ReactNode }) {
  const a = accentForSolution(solution);
  return (
    <p className="tg-eyebrow" style={{ color: a.text }}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------------ */
/* Quote & invoice follow-up                                                 */
/* ------------------------------------------------------------------------ */

const QUOTES = [
  {
    id: 'q1',
    kind: 'quotes',
    who: 'Maria Delgado',
    job: 'Tile roof repair after the storm',
    when: 'Quote sent 6 days ago',
    state: 'No answer yet',
    tone: 'warn',
    draft:
      'Hi Maria, this is Bayline Roofing. We sent you a quote for the tile repair last week. Do you have any questions about it? If the timing is not right, just tell us and we will check back later.',
  },
  {
    id: 'q2',
    kind: 'quotes',
    who: 'Kevin Brooks',
    job: 'New shingle roof, two-story house',
    when: 'Quote sent 12 days ago',
    state: 'Second follow-up due',
    tone: 'urgent',
    draft:
      'Hi Kevin, Bayline Roofing again. We wanted to check in once more on the new roof quote. If it helps, we can walk through it on a short call. Reply here and we will set a time.',
  },
  {
    id: 'q3',
    kind: 'quotes',
    who: 'The Nguyen family',
    job: 'Gutter and fascia replacement',
    when: 'Quote sent 2 days ago',
    state: 'Too soon to follow up',
    tone: 'neutral',
    draft: '',
  },
  {
    id: 'i1',
    kind: 'invoices',
    who: 'Dr. Ellis, dental office',
    job: 'Flat roof leak repair',
    when: 'Invoice sent 15 days ago',
    state: 'Unpaid',
    tone: 'urgent',
    draft:
      'Hello, this is Bayline Roofing. A friendly reminder that the invoice for the flat roof repair is still open. You can pay with the link in the original email. If it was already paid, thank you, and please ignore this note.',
  },
  {
    id: 'i2',
    kind: 'invoices',
    who: 'Luis Ortega',
    job: 'Roof inspection',
    when: 'Invoice sent 4 days ago',
    state: 'Paid',
    tone: 'done',
    draft: '',
  },
] as const;

function QuoteFollowUp({ solution }: { solution: SolutionSlug }) {
  const [tab, setTab] = useState<'quotes' | 'invoices'>('quotes');
  const [openId, setOpenId] = useState<string>('q1');
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  const rows = QUOTES.filter((q) => q.kind === tab);
  const open = rows.find((q) => q.id === openId) ?? rows[0]!;

  return (
    <div>
      <div className="border-b border-border px-5 py-4">
        <Segmented
          label="Show"
          value={tab}
          onChange={(v) => {
            setTab(v);
            setOpenId(QUOTES.find((q) => q.kind === v)!.id);
          }}
          options={[
            { value: 'quotes', label: 'Open quotes' },
            { value: 'invoices', label: 'Invoices' },
          ]}
        />
      </div>
      <Split
        list={rows.map((q) => (
          <ListButton key={q.id} selected={q.id === open.id} onClick={() => setOpenId(q.id)}>
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block font-semibold">{q.who}</span>
                <span className="block text-[0.875rem] text-secondary">{q.job}</span>
              </span>
              <Pill tone={approved[q.id] ? 'done' : q.tone}>{approved[q.id] ? 'Follow-up sent' : q.state}</Pill>
            </span>
          </ListButton>
        ))}
        detail={
          <div>
            <AccentLabel solution={solution}>{open.when}</AccentLabel>
            <h3 className="mt-3 text-[1.25rem] leading-[1.3] font-semibold">{open.who}</h3>
            <p className="mt-1 text-[0.9375rem] text-secondary">{open.job}</p>
            {open.draft ? (
              <>
                <p className="mt-6 text-[0.875rem] font-semibold">Follow-up, written for you</p>
                <Message>{open.draft}</Message>
                <Approve
                  approved={Boolean(approved[open.id])}
                  onApprove={() => setApproved((s) => ({ ...s, [open.id]: true }))}
                  idleLabel="Approve and Send"
                  doneLabel="Sent"
                />
              </>
            ) : (
              <p className="mt-6 text-[0.9375rem] text-secondary">
                {open.tone === 'done'
                  ? 'Paid. Nothing to chase, so the follow-ups stopped by themselves.'
                  : 'Sent two days ago. A follow-up is written only once a quote has waited long enough.'}
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Voicemail to summaries                                                    */
/* ------------------------------------------------------------------------ */

const VOICEMAILS = [
  {
    id: 'v1',
    who: 'Angela Price',
    when: 'Today, 7:02 a.m.',
    urgency: 'Urgent',
    tone: 'urgent',
    summary: 'Water leaking under the kitchen sink. She shut the valve but needs someone today.',
    needs: ['Leak repair, today', 'Address: Bayview Drive', 'Home after 9 a.m.'],
    transcript:
      'Hi, this is Angela Price on Bayview Drive. There is water coming out from under my kitchen sink. I turned off the valve under it, but I need somebody to come today if you can. I am home after nine. Please call me back. Thank you.',
  },
  {
    id: 'v2',
    who: 'Tom Walsh',
    when: 'Yesterday, 6:40 p.m.',
    urgency: 'This week',
    tone: 'warn',
    summary: 'Water heater makes a loud popping noise. Wants it looked at this week.',
    needs: ['Water heater check', 'Any weekday morning'],
    transcript:
      'Hey, Tom Walsh here. My water heater has been making a loud popping sound for a few days. It still works, but I want somebody to look at it this week. Mornings are best. Thanks.',
  },
  {
    id: 'v3',
    who: 'Rita Gomez',
    when: 'Yesterday, 2:15 p.m.',
    urgency: 'Can wait',
    tone: 'neutral',
    summary: 'Asking for a quote to replace two bathroom faucets. No rush.',
    needs: ['Quote: two bathroom faucets', 'Prefers a text back'],
    transcript:
      'Hola, this is Rita Gomez. I want to change the two faucets in my bathrooms and I would like a quote. There is no rush. You can text me back at this number. Gracias.',
  },
] as const;

function Voicemail({ solution }: { solution: SolutionSlug }) {
  const [openId, setOpenId] = useState<string>('v1');
  const [showWords, setShowWords] = useState(false);
  const open = VOICEMAILS.find((v) => v.id === openId)!;

  return (
    <Split
      list={VOICEMAILS.map((v) => (
        <ListButton
          key={v.id}
          selected={v.id === open.id}
          onClick={() => {
            setOpenId(v.id);
            setShowWords(false);
          }}
        >
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-semibold">{v.who}</span>
              <span className="block text-[0.875rem] text-secondary">{v.when}</span>
            </span>
            <Pill tone={v.tone}>{v.urgency}</Pill>
          </span>
          <span className="mt-2 block text-[0.875rem] leading-[1.5]">{v.summary}</span>
        </ListButton>
      ))}
      detail={
        <div>
          <AccentLabel solution={solution}>Voicemail · {open.when}</AccentLabel>
          <h3 className="mt-3 text-[1.25rem] leading-[1.3] font-semibold">{open.who}</h3>
          <p className="mt-6 text-[0.875rem] font-semibold">Summary</p>
          <p className="mt-2 text-[0.9375rem] leading-[1.6]">{open.summary}</p>
          <p className="mt-6 text-[0.875rem] font-semibold">What they need</p>
          <ul className="m-0 mt-2 list-none p-0">
            {open.needs.map((n) => (
              <li key={n} className="border-t border-border py-2 text-[0.9375rem] last:border-b">
                {n}
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-expanded={showWords}
            onClick={() => setShowWords((s) => !s)}
            className="tap-44 link-underline mt-6 text-[0.875rem] font-semibold"
          >
            {showWords ? 'Hide what they said' : 'Read what they said'}
          </button>
          {showWords && <Message>{open.transcript}</Message>}
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Inbox sorter                                                              */
/* ------------------------------------------------------------------------ */

type InboxGroup = 'all' | 'repairs' | 'rent' | 'leasing' | 'junk';

const EMAILS = [
  {
    id: 'e1',
    group: 'repairs',
    from: 'Unit 4B, Harbor Court',
    subject: 'AC stopped working overnight',
    urgent: true,
    draft:
      'Hi, thank you for letting us know. We have asked our AC technician to come to Unit 4B today, and they will text you before they arrive. If anything changes, reply to this email.',
  },
  {
    id: 'e2',
    group: 'rent',
    from: 'Unit 12, Sunset Villas',
    subject: 'Can I pay rent a few days late?',
    urgent: false,
    draft:
      'Hi, thanks for asking ahead of time. We have noted your request, and the manager will reply today with what is possible this month.',
  },
  {
    id: 'e3',
    group: 'leasing',
    from: 'Website form',
    subject: 'Is the two-bedroom still available?',
    urgent: false,
    draft:
      'Hi, thank you for your interest. The two-bedroom is still available. Would you like to see it this week? Reply with a day and time that works for you.',
  },
  {
    id: 'e4',
    group: 'repairs',
    from: 'Unit 7, Harbor Court',
    subject: 'Kitchen light flickers',
    urgent: false,
    draft:
      'Hi, thanks for the note. We have added the kitchen light to this week’s repair list and will confirm a time with you by tomorrow.',
  },
  {
    id: 'e5',
    group: 'junk',
    from: 'Unknown sender',
    subject: 'You have won a free cruise!!!',
    urgent: false,
    draft: '',
  },
] as const;

const GROUP_LABEL: Record<Exclude<InboxGroup, 'all'>, string> = {
  repairs: 'Repairs',
  rent: 'Rent',
  leasing: 'Leasing',
  junk: 'Junk',
};

function Inbox({ solution }: { solution: SolutionSlug }) {
  const [group, setGroup] = useState<InboxGroup>('all');
  const [openId, setOpenId] = useState<string>('e1');
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  const rows = EMAILS.filter((e) => group === 'all' || e.group === group)
    .slice()
    .sort((a, b) => Number(b.urgent) - Number(a.urgent));
  const open = rows.find((e) => e.id === openId) ?? rows[0]!;

  return (
    <div>
      <div className="border-b border-border px-5 py-4">
        <Segmented<InboxGroup>
          label="Show group"
          value={group}
          onChange={(v) => {
            setGroup(v);
            const first = EMAILS.filter((e) => v === 'all' || e.group === v)
              .slice()
              .sort((a, b) => Number(b.urgent) - Number(a.urgent))[0];
            if (first) setOpenId(first.id);
          }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'repairs', label: 'Repairs' },
            { value: 'rent', label: 'Rent' },
            { value: 'leasing', label: 'Leasing' },
            { value: 'junk', label: 'Junk' },
          ]}
        />
      </div>
      <Split
        list={rows.map((e) => (
          <ListButton key={e.id} selected={e.id === open.id} onClick={() => setOpenId(e.id)}>
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block font-semibold">{e.subject}</span>
                <span className="block text-[0.875rem] text-secondary">{e.from}</span>
              </span>
              <Pill tone={e.urgent ? 'urgent' : approved[e.id] ? 'done' : 'neutral'}>
                {e.urgent ? 'Urgent' : approved[e.id] ? 'Replied' : GROUP_LABEL[e.group]}
              </Pill>
            </span>
          </ListButton>
        ))}
        detail={
          <div>
            <AccentLabel solution={solution}>Sorted into {GROUP_LABEL[open.group]}</AccentLabel>
            <h3 className="mt-3 text-[1.25rem] leading-[1.3] font-semibold">{open.subject}</h3>
            <p className="mt-1 text-[0.9375rem] text-secondary">From {open.from}</p>
            {open.draft ? (
              <>
                <p className="mt-6 text-[0.875rem] font-semibold">Reply, written for you</p>
                <Message>{open.draft}</Message>
                <Approve
                  approved={Boolean(approved[open.id])}
                  onApprove={() => setApproved((s) => ({ ...s, [open.id]: true }))}
                  idleLabel="Approve and Send"
                  doneLabel="Sent"
                />
              </>
            ) : (
              <p className="mt-6 text-[0.9375rem] text-secondary">
                Junk. No reply is written, and it stays out of the manager’s way.
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Online booking                                                            */
/* ------------------------------------------------------------------------ */

const SERVICES = ['Bath and brush', 'Full groom', 'Nail trim'] as const;
const TIMES = ['9:00 a.m.', '11:30 a.m.', '2:00 p.m.', '4:00 p.m.'] as const;

const DAY = [
  { time: '9:00 a.m.', who: 'Bella, golden retriever', service: 'Full groom' },
  { time: '11:30 a.m.', who: 'Max, poodle', service: 'Bath and brush' },
  { time: '4:00 p.m.', who: 'Coco, shih tzu', service: 'Nail trim' },
];

function Booking({ solution }: { solution: SolutionSlug }) {
  const [view, setView] = useState<'customer' | 'owner'>('customer');
  const [service, setService] = useState<(typeof SERVICES)[number] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const taken = new Set(DAY.map((d) => d.time));
  const day = booked && time && service
    ? [...DAY, { time, who: 'Your pet (new booking)', service }].sort(
        (a, b) => TIMES.indexOf(a.time as (typeof TIMES)[number]) - TIMES.indexOf(b.time as (typeof TIMES)[number]),
      )
    : DAY;

  return (
    <div>
      <div className="border-b border-border px-5 py-4">
        <Segmented
          label="View as"
          value={view}
          onChange={setView}
          options={[
            { value: 'customer', label: 'Customer' },
            { value: 'owner', label: 'Owner’s day' },
          ]}
        />
      </div>

      {view === 'customer' ? (
        <div className="p-5 md:p-7">
          <AccentLabel solution={solution}>Book a visit · Tomorrow</AccentLabel>
          {booked ? (
            <div className="mt-4">
              <h3 className="text-[1.25rem] leading-[1.3] font-semibold">You are booked.</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.6]">
                {service}, tomorrow at {time}. The van comes to you. In this example nothing is saved.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setView('owner')}
                  className="inline-flex items-center justify-center rounded-[8px] bg-cta-bg px-6 py-[15px] text-[14.5px]/[1] font-semibold text-cta-fg transition-[background-color] duration-[120ms] hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                >
                  See the Owner’s Day
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBooked(false);
                    setService(null);
                    setTime(null);
                  }}
                  className="tap-44 link-underline text-[0.875rem] font-semibold"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 text-[0.875rem] font-semibold">1. Pick a service</p>
              <div className="mt-3">
                <Segmented
                  label="Service"
                  value={service ?? ('' as (typeof SERVICES)[number])}
                  onChange={setService}
                  options={SERVICES.map((s) => ({ value: s, label: s }))}
                />
              </div>
              <p className="mt-6 text-[0.875rem] font-semibold">2. Pick an open time</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Time">
                {TIMES.map((t) => {
                  const isTaken = taken.has(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isTaken}
                      aria-pressed={time === t}
                      onClick={() => setTime(t)}
                      className={cn(
                        'tap-44 rounded-[8px] border px-3 py-2 text-[0.875rem] font-semibold transition-[border-color,background-color] duration-[120ms]',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
                        isTaken
                          ? 'border-border text-secondary line-through opacity-60'
                          : time === t
                            ? 'border-fg bg-surface'
                            : 'border-border hover:border-border-strong',
                      )}
                    >
                      {t}
                      <span className="sr-only">{isTaken ? ' (taken)' : ''}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!service || !time}
                onClick={() => setBooked(true)}
                className={cn(
                  'mt-7 inline-flex items-center justify-center rounded-[8px] px-6 py-[15px] text-[14.5px]/[1] font-semibold',
                  'transition-[background-color] duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
                  service && time ? 'bg-cta-bg text-cta-fg hover:bg-cta-hover' : 'border border-border text-secondary',
                )}
              >
                Book This Time
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="p-5 md:p-7">
          <AccentLabel solution={solution}>Tomorrow’s visits, in order</AccentLabel>
          <ul className="m-0 mt-4 list-none p-0">
            {day.map((d) => (
              <li key={d.time} className="flex items-start justify-between gap-4 border-t border-border py-4 last:border-b">
                <span className="min-w-0">
                  <span className="block font-semibold">{d.who}</span>
                  <span className="block text-[0.875rem] text-secondary">{d.service}</span>
                </span>
                <span className="flex-none text-[0.875rem] font-semibold">{d.time}</span>
              </li>
            ))}
          </ul>
          {!booked && (
            <p className="mt-5 text-[0.875rem] text-secondary">
              Book a visit as the customer, then come back here to see it in the day.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
