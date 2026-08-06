import type { ReactNode } from 'react';

/**
 * A deliberately small markdown renderer for concierge replies.
 *
 * The model answers in a blueprint shape — a line, a short list of components,
 * the closest existing build — and reliably reaches for `**bold**`, `-` bullets
 * and `1.` lists to express that. Rendering those as raw syntax makes the panel
 * look broken, which is exactly what it was doing.
 *
 * Scope is intentionally narrow: paragraphs, unordered and ordered lists, bold,
 * italic, inline code, links and thematic breaks. No headings, no images, no
 * HTML passthrough — replies are a few sentences in a small panel, and a full
 * markdown pipeline would be more attack surface and more bundle for no gain.
 * Anything unrecognised falls through as plain text rather than disappearing.
 *
 * Link and rule support is not speculative: the live model reliably emits
 * `[label](url)` when pointing at a demo and `***` between blueprint sections,
 * and both were rendering as raw syntax.
 *
 * Link hrefs are restricted to http(s) and mailto. The model is grounded on our
 * own URLs, but it is still model output being turned into a clickable target,
 * so `javascript:` and friends never make it into an href.
 */

function safeHref(raw: string): string | null {
  const href = raw.trim();
  return /^(https?:\/\/|mailto:|\/)/i.test(href) ? href : null;
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Links, bold, italic and inline code, in one pass so nesting can't desync.
  const pattern =
    /(\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const tok = match[0];
    const key = `${keyPrefix}-${i++}`;

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
    if (link) {
      const href = safeHref(link[2]!);
      if (href) {
        out.push(
          <a
            key={key}
            href={href}
            target={href.startsWith('/') ? undefined : '_blank'}
            rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="link-underline font-semibold"
          >
            {link[1]}
          </a>,
        );
      } else {
        out.push(link[1]);
      }
    } else if (tok.startsWith('**') || tok.startsWith('__')) {
      out.push(
        <strong key={key} className="font-semibold">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith('`')) {
      out.push(
        <code
          key={key}
          className="rounded-[4px] border border-border bg-surface px-[6px] py-[1px] font-mono text-[0.8125rem]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = match.index + tok.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let k = 0;

  const flushPara = () => {
    if (!para.length) return;
    blocks.push(
      <p key={`p${k++}`} className="text-[0.875rem] leading-[1.55]" style={{ textWrap: 'pretty' }}>
        {inline(para.join(' '), `p${k}`)}
      </p>,
    );
    para = [];
  };

  const flushList = () => {
    if (!list) return;
    const Tag = list.ordered ? 'ol' : 'ul';
    blocks.push(
      <Tag
        key={`l${k++}`}
        className="m-0 flex list-none flex-col gap-[6px] p-0 text-[0.875rem] leading-[1.55]"
      >
        {list.items.map((item, idx) => (
          <li key={idx} className="flex gap-[10px]">
            <span aria-hidden className="flex-none text-secondary">
              {list!.ordered ? `${idx + 1}.` : '·'}
            </span>
            <span>{inline(item, `l${k}-${idx}`)}</span>
          </li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushPara();
      flushList();
      continue;
    }

    // Thematic break — the model uses these between blueprint sections.
    if (/^([-*_])\1{2,}$/.test(line)) {
      flushPara();
      flushList();
      blocks.push(<hr key={`h${k++}`} className="my-1 border-0 border-t border-border" />);
      continue;
    }

    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      const content = (bullet?.[1] ?? numbered?.[1] ?? '').trim();
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(content);
      continue;
    }

    flushList();
    para.push(line);
  }

  flushPara();
  flushList();

  return <div className="flex flex-col gap-3">{blocks}</div>;
}
