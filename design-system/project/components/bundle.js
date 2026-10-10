/* @ds-bundle: {"format":4,"namespace":"TEKGUYZ","components":[{"name":"ConnectedNodes"},{"name":"Lockup"},{"name":"Button"},{"name":"Eyebrow"},{"name":"SolutionTag"},{"name":"AccentDot"},{"name":"StatusLine"},{"name":"SignatureStripe"},{"name":"PullQuote"},{"name":"Testimonial"},{"name":"SolutionRow"},{"name":"ProjectCard"},{"name":"Disclosure"},{"name":"OutcomeBlock"},{"name":"Field"},{"name":"ProcessStep"},{"name":"ClosingCta"},{"name":"Nav"},{"name":"Footer"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  /* The locked mapping: solution line -> accent. Never reorder, never add a fifth. */
  var ACCENT = {
    'smart-operations': 'blue',
    'ai-voice-agents': 'violet',
    'business-systems': 'amber',
    'custom-web-apps': 'teal'
  };
  var SOLUTIONS = {
    'smart-operations': {
      name: 'Smart Operations',
      hook: 'Your business makes data and tasks every hour. We build systems that handle them automatically.'
    },
    'ai-voice-agents': {
      name: 'AI Voice Agents',
      hook: 'Your phones don’t stop ringing because your doors are closed. We answer them.'
    },
    'business-systems': {
      name: 'Business Systems',
      hook: 'Everything your clients and team need, in one private place instead of five.'
    },
    'custom-web-apps': {
      name: 'Custom Web Apps',
      hook: 'If you can describe the workflow, we can build the tool that runs it.'
    }
  };
  function acc(solution) { return 'tgc-a-' + (ACCENT[solution] || 'blue'); }

  var WORDMARK_D = 'M120.17 15.40L92.39 15.40L92.39 22.08L102.21 22.08L102.21 48.60L110.35 48.60L110.35 22.08L120.17 22.08ZM123.49 15.40L123.49 48.60L147.71 48.60L147.71 41.92L131.67 41.92L131.67 35.27L146.78 35.27L146.78 28.63L131.67 28.63L131.67 22.08L147.34 22.08L147.34 15.40ZM151.69 15.40L151.69 48.60L159.87 48.60L159.87 39.25L162.96 35.51L171.85 48.60L180.97 48.60L168.34 30.13L180.22 15.40L170.91 15.40L159.87 29.19L159.87 15.40ZM212.12 48.60L212.12 31.11L197.15 31.11L197.15 36.86L203.79 36.86C203.18 40.37 200.98 42.66 197.24 42.66C191.96 42.66 189.43 38.22 189.43 32.05C189.43 25.83 191.96 21.34 197.24 21.34C200.56 21.34 202.76 23.35 203.56 26.90L212.02 26.53C210.43 19.09 205.10 14.65 197.43 14.65C187.47 14.65 181.06 22.13 181.06 32.05C181.06 41.96 187.52 49.35 196.87 49.35C201.50 49.35 205.24 47.34 206.92 44.02L207.30 48.60ZM243.59 36.49L243.59 15.35L235.41 15.35L235.41 36.49C235.41 40.56 233.26 42.66 229.51 42.66C225.82 42.66 223.62 40.56 223.62 36.49L223.62 15.35L215.44 15.35L215.44 36.49C215.44 44.35 220.86 49.35 229.51 49.35C238.17 49.35 243.59 44.35 243.59 36.49ZM246.12 15.40L257.58 35.93L257.58 48.60L265.76 48.60L265.76 35.93L277.22 15.40L268.33 15.40L261.69 28.31L254.96 15.40ZM304.30 21.34L304.30 15.40L279.65 15.40L279.65 22.08L294.10 22.08L278.62 42.06L278.62 48.60L304.67 48.60L304.67 41.92L288.21 41.92Z';

  /* ---- Marks ---- */

  /* The UI geometry of Connected Nodes: viewBox 0 0 64 64, r=8 circles, 3px connectors. */
  function ConnectedNodes(p) {
    var size = p.size || 26;
    var line = { stroke: p.stroke || 'var(--tg-border-strong)', strokeWidth: 3 };
    if (p.strokeOpacity) line.opacity = p.strokeOpacity;
    return h('svg', { width: size, height: size, viewBox: '0 0 64 64', className: p.className, style: { display: 'block', flex: 'none' }, 'aria-hidden': true, focusable: 'false' },
      h('line', { x1: 32, y1: 12, x2: 12, y2: 32, style: line }),
      h('line', { x1: 32, y1: 12, x2: 52, y2: 32, style: line }),
      h('line', { x1: 12, y1: 32, x2: 32, y2: 52, style: line }),
      h('line', { x1: 52, y1: 32, x2: 32, y2: 52, style: line }),
      h('circle', { cx: 32, cy: 12, r: 8, style: { fill: '#3B6FE0' } }),
      h('circle', { cx: 52, cy: 32, r: 8, style: { fill: '#7C6FE0' } }),
      h('circle', { cx: 32, cy: 52, r: 8, style: { fill: '#F2A93C' } }),
      h('circle', { cx: 12, cy: 32, r: 8, style: { fill: '#2FA679' } })
    );
  }

  /* The master lockup: mark + outlined Geist 800 wordmark. Wordmark takes tg-fg. */
  function Lockup(p) {
    var height = p.height || 32;
    var stroke = p.stroke || 'var(--tg-border-strong)';
    var line = { stroke: stroke, strokeWidth: 2.2 };
    return h('svg', { height: height, viewBox: '-1 -1 311.67 66', role: 'img', 'aria-label': 'TEKGUYZ', className: p.className, style: { display: 'block', width: 'auto' } },
      h('line', { x1: 32, y1: 12, x2: 12, y2: 32, style: line }),
      h('line', { x1: 32, y1: 12, x2: 52, y2: 32, style: line }),
      h('line', { x1: 12, y1: 32, x2: 32, y2: 52, style: line }),
      h('line', { x1: 52, y1: 32, x2: 32, y2: 52, style: line }),
      h('circle', { cx: 32, cy: 12, r: 7, style: { fill: '#3B6FE0' } }),
      h('circle', { cx: 52, cy: 32, r: 7, style: { fill: '#7C6FE0' } }),
      h('circle', { cx: 32, cy: 52, r: 7, style: { fill: '#F2A93C' } }),
      h('circle', { cx: 12, cy: 32, r: 7, style: { fill: '#2FA679' } }),
      h('path', { d: WORDMARK_D, style: { fill: 'var(--tg-fg)' } })
    );
  }

  /* ---- Actions ---- */

  function Button(p) {
    var cls = cx('tgc-btn', 'tgc-btn--' + (p.variant || 'primary'), 'tgc-btn--' + (p.size || 'default'), p.className);
    if (p.href) {
      return h('a', { className: cls, href: p.href, onClick: p.onClick, 'aria-disabled': p.disabled ? 'true' : undefined }, p.children);
    }
    return h('button', { className: cls, type: p.type || 'button', disabled: p.disabled, onClick: p.onClick }, p.children);
  }

  /* ---- Labels ---- */

  function Eyebrow(p) {
    return h('span', { className: cx('tgc-eyebrow', p.solution && 'tgc-accented', p.solution && acc(p.solution), p.className) }, p.children);
  }

  function SolutionTag(p) {
    var label = p.label || (SOLUTIONS[p.solution] ? SOLUTIONS[p.solution].name.toUpperCase() : '');
    return h('span', { className: cx('tgc-tag', p.variant === 'card' && 'tgc-tag--card', acc(p.solution), p.className) }, label);
  }

  function AccentDot(p) {
    var size = p.size || 10;
    return h('span', { className: cx('tgc-dot', acc(p.solution), p.className), style: { width: size, height: size }, 'aria-hidden': true });
  }

  /* ---- Status ---- */

  function StatusLine(p) {
    var live = (p.state || 'live') === 'live';
    var compact = p.variant === 'compact';
    var stamp = p.stamp || '4 minutes ago';
    return h('p', { className: cx('tgc-status', live && 'tgc-status--live', compact && 'tgc-status--compact', p.className) },
      h('span', { className: 'tgc-status__dot', 'aria-hidden': true }),
      live
        ? [
            h('span', { key: 'w', className: 'tgc-status__word' }, 'Live'),
            h('span', { key: 's', className: 'tgc-status__dim' }, compact ? '· ' + stamp : '· checked ' + stamp)
          ]
        : h('span', { className: 'tgc-status__dim' }, compact ? 'Unreachable' : 'Temporarily unreachable · checked ' + stamp)
    );
  }

  function OutcomeBlock(p) {
    var tone = p.tone === 'error' ? 'error' : 'success';
    return h('div', { className: p.className },
      h('div', { className: 'tgc-outcome__head' },
        h('span', { className: 'tgc-outcome__dot', 'aria-hidden': true, style: { background: tone === 'error' ? 'var(--tg-error)' : 'var(--tg-success)' } }),
        h('span', { className: 'tgc-outcome__label' }, p.label)
      ),
      h('p', { className: 'tgc-outcome__body' }, p.children)
    );
  }

  /* ---- Brand devices ---- */

  function SignatureStripe(p) {
    return h('div', { className: cx('tgc-stripe', p && p.className), 'aria-hidden': true, 'data-signature-stripe': true },
      h('span'), h('span'), h('span'), h('span'));
  }

  function PullQuote(p) {
    return h('blockquote', { className: cx('tgc-pull', p.size === 'band' && 'tgc-pull--band', acc(p.solution), p.className) }, p.children);
  }

  function Testimonial(p) {
    return h('figure', { className: cx('ink-band', 'tgc-testi', p.className) },
      h('span', { className: 'tgc-testi__glyph', 'aria-hidden': true }, '“'),
      h('blockquote', { className: 'tgc-testi__quote', style: { margin: 0 } }, p.children),
      h('figcaption', { className: 'tgc-testi__by' },
        h('span', { className: 'tgc-testi__author' }, p.author),
        h('span', { className: 'tgc-testi__source' }, p.source)
      )
    );
  }

  /* ---- Lists and cards ---- */

  function SolutionRow(p) {
    var s = SOLUTIONS[p.solution] || {};
    return h('a', { href: p.href || '#', className: cx('tgc-row', 'tgc-rule', p.last && 'tgc-row--last', p.className) },
      h('div', { className: 'tgc-row__head' },
        h(AccentDot, { solution: p.solution }),
        h('span', { className: 'tgc-row__title' }, p.name || s.name)
      ),
      h('div', { className: 'tgc-row__tail' },
        h('p', { className: 'tgc-row__hook' }, p.hook || s.hook),
        h('span', { className: 'tgc-row__arrow', 'aria-hidden': true }, '→')
      )
    );
  }

  function ProjectCard(p) {
    return h('a', { href: p.href || '#', 'data-card': true, className: cx('tgc-card', p.className) },
      h(SolutionTag, { solution: p.solution, label: p.tag, variant: 'card', className: 'tgc-self-start' }),
      h('h3', { className: 'tgc-card__title' }, p.headline),
      h('p', { className: 'tgc-card__body' }, p.summary),
      h(StatusLine, { state: p.state || 'live', stamp: p.stamp }),
      h('span', { 'aria-hidden': true, className: 'tgc-underline tgc-card__more' }, 'Read the full story →')
    );
  }

  function Disclosure(p) {
    var items = p.items || [];
    var uid = React.useId();
    var st = React.useState(p.defaultOpen == null ? null : p.defaultOpen);
    var open = st[0], setOpen = st[1];
    var refs = React.useRef([]);
    function onKey(e, i) {
      var last = items.length - 1, next = null;
      if (e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next === null) return;
      e.preventDefault();
      if (refs.current[next]) refs.current[next].focus();
    }
    return h('div', { className: p.className },
      items.map(function (item, i) {
        var isOpen = open === i;
        return h('div', { key: item.question, 'data-open': isOpen, 'data-drawn': isOpen, className: 'tgc-faq__item tgc-rule' },
          h('h3', { className: 'tgc-faq__q' },
            h('button', {
              type: 'button', id: uid + '-t' + i, 'aria-expanded': isOpen, 'aria-controls': uid + '-p' + i,
              className: 'tgc-faq__btn',
              ref: function (el) { refs.current[i] = el; },
              onClick: function () { setOpen(isOpen ? null : i); },
              onKeyDown: function (e) { onKey(e, i); }
            },
              h('span', { className: 'tgc-faq__text' }, item.question),
              h('span', { className: 'tgc-mark', 'aria-hidden': true })
            )
          ),
          h('div', { id: uid + '-p' + i, role: 'region', 'aria-labelledby': uid + '-t' + i, className: 'tgc-collapse' },
            h('div', null, h('p', { className: 'tgc-collapse__text' }, item.answer))
          )
        );
      })
    );
  }

  function Field(p) {
    var auto = React.useId();
    var id = p.id || auto;
    var kind = p.as || 'input';
    var common = {
      id: id, name: p.name || id, className: 'tgc-field__control', placeholder: p.placeholder,
      'aria-invalid': p.error ? 'true' : undefined,
      'aria-describedby': p.error ? id + '-err' : p.hint ? id + '-hint' : undefined,
      defaultValue: p.defaultValue, disabled: p.disabled
    };
    var control;
    if (kind === 'select') {
      control = h('select', common, (p.options || []).map(function (o) { return h('option', { key: o, value: o }, o); }));
    } else if (kind === 'textarea') {
      control = h('textarea', Object.assign({ rows: p.rows || 4 }, common));
    } else {
      control = h('input', Object.assign({ type: p.type || 'text' }, common));
    }
    return h('div', { className: cx('tgc-field', p.className) },
      h('label', { htmlFor: id, className: 'tgc-eyebrow tgc-field__label' },
        p.label,
        p.optional ? [' ', h('span', { key: 'o', className: 'tgc-field__opt' }, '(optional)')] : null
      ),
      control,
      p.error ? h('p', { id: id + '-err', role: 'alert', className: 'tgc-field__error' }, p.error)
        : p.hint ? h('p', { id: id + '-hint', className: 'tgc-field__hint' }, p.hint) : null
    );
  }

  function ProcessStep(p) {
    return h('div', { className: cx('tgc-step', p.last && 'tgc-step--last', acc(p.solution), p.className) },
      h('span', { className: 'tgc-step__num', 'aria-hidden': true }, p.numeral),
      h('div', { className: 'tgc-step__inner' },
        h('h2', { className: 'tgc-step__title' }, p.title),
        h('p', { className: 'tgc-step__body' }, p.children)
      )
    );
  }

  /* ---- Page furniture ---- */

  function ClosingCta(p) {
    var trust = p.trust || ['Free first conversation', 'A flat quote before anything starts', 'We reply within one business day'];
    var items = [];
    trust.forEach(function (t, i) {
      if (i) items.push(h('span', { key: 'd' + i, className: 'tgc-closing__sep', 'aria-hidden': true }));
      items.push(h('span', { key: 't' + i }, t));
    });
    return h('section', { className: cx('tgc-closing', p.className) },
      h(SignatureStripe),
      h('div', { className: 'tgc-closing__inner' },
        h('h2', { className: 'tgc-closing__h' }, p.headline || 'Let’s talk about your business.'),
        h('p', { className: 'tgc-closing__sub' }, p.sub || 'Tell us what you’re working with and what you’re trying to fix. We’ll take it from there.'),
        h('div', { className: 'tgc-closing__trust' }, items),
        h('div', { className: 'tgc-closing__cta' },
          h(Button, { size: 'large', href: p.href || '#' }, p.cta || 'Start a conversation'),
          p.link === false ? null : h('a', { href: '#', className: 'tgc-closing__link tgc-underline' }, p.link || 'Or ask our AI what we’d build for you')
        )
      )
    );
  }

  function Nav(p) {
    var links = p.links || [{ label: 'Solutions' }, { label: 'Work' }, { label: 'Process' }, { label: 'Contact' }];
    return h('header', { className: cx('tgc-nav', p.className) },
      h('div', { className: 'tgc-nav__bar' },
        h('a', { href: '#', className: 'tgc-brand', 'aria-label': 'TEKGUYZ home' },
          h(ConnectedNodes, { size: 26 }),
          h('span', { className: 'tgc-brand__word' }, 'TEKGUYZ')
        ),
        h('nav', { className: 'tgc-nav__links', 'aria-label': 'Main' },
          links.map(function (l) {
            var on = p.current === l.label;
            return h('a', { key: l.label, href: l.href || '#', 'data-on': on ? 'true' : 'false', 'aria-current': on ? 'page' : undefined, className: 'tgc-nav__link tgc-rule' }, l.label);
          }),
          h(Button, { size: 'nav', href: '#' }, p.cta || 'Let’s Talk')
        )
      )
    );
  }

  function Footer(p) {
    var cols = p.columns || [
      { heading: 'Solutions', links: ['Smart Operations', 'AI Voice Agents', 'Business Systems', 'Custom Web Apps'] },
      { heading: 'Company', links: ['Work', 'Process', 'Contact', 'Privacy'] }
    ];
    return h('footer', { className: cx('footer-dark', 'tgc-footer', p.className) },
      h('div', { className: 'tgc-footer__in' },
        h('div', { className: 'tgc-footer__mast' },
          h(ConnectedNodes, { size: 40, stroke: 'var(--tg-border)' }),
          h('div', null,
            h('p', { className: 'tgc-footer__word' }, 'TEKGUYZ'),
            h('p', { className: 'tgc-footer__tag' }, p.tagline || 'We build tech that actually works.')
          )
        ),
        h('div', { className: 'tgc-footer__cols' },
          cols.map(function (c) {
            return h('div', { key: c.heading, className: 'tgc-footer__col' },
              h('p', { className: 'tgc-eyebrow tgc-footer__h' }, c.heading),
              c.links.map(function (l) { return h('a', { key: l, href: '#' }, l); })
            );
          })
        ),
        h('p', { className: 'tgc-footer__copy' }, p.copyright || '© TEKGUYZ')
      ),
      h(SignatureStripe)
    );
  }

  window.TEKGUYZ = {
    ConnectedNodes: ConnectedNodes, Lockup: Lockup, Button: Button, Eyebrow: Eyebrow, SolutionTag: SolutionTag,
    AccentDot: AccentDot, StatusLine: StatusLine, SignatureStripe: SignatureStripe, PullQuote: PullQuote,
    Testimonial: Testimonial, SolutionRow: SolutionRow, ProjectCard: ProjectCard, Disclosure: Disclosure,
    OutcomeBlock: OutcomeBlock, Field: Field, ProcessStep: ProcessStep, ClosingCta: ClosingCta, Nav: Nav, Footer: Footer,
    SOLUTIONS: SOLUTIONS, ACCENT: ACCENT
  };
})();
