TEKGUYZ is the real person who helps small and medium businesses use real AI to fix real problems, and the interface says *measured*, not *performed*: hairlines instead of shadows, one motion gesture instead of five, four colours that each mean one line of work.

**Start here, in this order.** Read this file. Read the Voice and words section (`voice.md`) before you write a sentence. Take colour, type, spacing, radius and motion from `tokens.json`; never type a hex. Build with the components in `components/`, which are real React and run as written. To use the system on a platform that has no React, see the Take it anywhere section (`platforms.md`).

## Content fundamentals

Plain English, the way you talk to an owner across the counter. Second person, active voice, present tense. Say what a thing does before you say what it is called.

- **Write the owner's problem first, then the fix, then the proof.** One real detail beats three claims. "Your phones don't stop ringing because your doors are closed. We answer them." is the register.
- **"We" is the founder working with AI agents. It never claims staff.** No "our engineers", no "our team", no head count above one. A one-to-one message says "I" and signs with a first name.
- **Never invent a metric, a result, a timeline, a client name, a price, a phone number or a status.** If a slot needs a fact you would have to make up, ship the visible marker `[NEEDS COPY: <slot>]` and say so. There is no phone number; never write a placeholder.
- **No exclamation marks, no emoji, no hype.** "Live · checked 4 minutes ago" is the register. "Blazing fast", "synergy", "holistic", "digital ecosystem" are not.
- **Sentence case everywhere except `eyebrow`**, the one uppercase style.
- **A partly finished thing is never called finished.** Carry the qualifier in the same sentence.
- The tagline is **We build tech that actually works.** It is the footer line and the video end card. It is not a headline to repeat.

## Colour

Four semantic pairs carry the interface. Set them and a surface themes itself: `tg-bg` and `tg-fg` for the page, `tg-surface` and `tg-fg` for cards, `tg-secondary` for supporting copy, `tg-border` for every edge.

- **Body copy is `tg-fg`. Supporting copy is `tg-secondary`.** `tg-muted-soft` is not a text colour; it is for separators and non-text marks only.
- **The four accents mean a line of work, and nothing else.** Blue is Smart Operations, violet is AI Voice Agents, amber is Business Systems, teal is Custom Web Apps. Always in that order. There is no fifth accent and an accent is never a decorative bullet.
- **An accent never fills a button.** The primary button is `tg-cta-bg` on `tg-cta-fg` and inverts in dark mode.
- **An accent used as text is its `-on-bg` token.** Plain amber is 2.00:1 on white; `tg-accent-amber-on-bg` is 5.92:1. Dots, tags' borders and stripe segments use the plain accent.
- **Status colour is a 6px dot beside a word in `tg-fg`.** `tg-success` and `tg-error` never carry meaning alone and are never text colours.
- **Two surfaces stay dark in both themes:** the ink band and the footer. They carry `.ink-band` and `.footer-dark`, which redeclare the semantic tokens at their own root, so nothing inside needs a theme branch or a hex.
- Light is the default. Dark is a manual switch (`data-theme="dark"`, or `.dark` on `html`).

## Type

Geist for everything, from one variable file. Geist Mono appears in exactly two places: the whole status line, and an inline code span.

- **One `hero` per page, and it is the page's first headline.** Below it a section head is `display`, the items under it `subhead`, a card or row `title`. Hierarchy comes from the size step, never from dimming the thing you want clicked.
- Headings are weight 700 at `hero` and `display`, 600 below. Tracking tightens as size grows: -0.045em at `hero`, -0.01em at `body-lead`.
- Body is `body`, 17px on 1.6. Cards and descriptions are `sm`. A button label is `button`, 14.5px on a line height of 1, written as one declaration.
- The wordmark is Geist 800 in capitals, tracking -0.025em, `wordmark-nav` or `wordmark-footer`. For a file, use the outlined lockups under `assets/Logos`.
- Display sizes ship fluid, e.g. `clamp(2.5rem, 6vw, 4.5rem)` for `hero`; `tokens.json` holds the ceiling.

## Spacing and layout

Base unit 4px. The content grid is 12 tracks with a 24px gap, 8 tracks below 1024px, one track below 768px. Content is left-anchored; the closing call to action is the one centred section.

- **Section rhythm is 128px, 80px below 768px.** Count the gap above a closing band once.
- **Declare density, do not hand-pick it.** `pad-container`, `pad-card` and `gap-group` resolve per width.
- Max content width `container-max`, 1280px, with `container-pad` inside it.
- Radii are a short scale: `radius-input` 4, `radius-tag` 6, `radius-button` 8, `radius-card` 12, `radius-container` 16. Use the token for the thing, never a number between.
- Tap targets are 44px, grown with a hidden overlay, never by resizing the control.

## Borders, elevation and states

- **Elevation is flat.** Hairlines, not shadows. The one dated exception is the home fold's four build cards (`tg-elevate`). Do not widen it.
- Hover on a row darkens the hairline to `tg-border-strong`. Hover on a card does that and lifts it 3px.
- **Every state change uses one gesture: `tg-rule`,** a 2px hairline drawn from the left. Persistent ink means *you are here*; the lighter weight means *this is a thing*. Do not add a second state mechanism.
- A text link draws its underline left to right; it draws nothing at rest.
- **Focus is a 2px `tg-fg` outline at 3px offset, on everything, and is not animated.**

## Motion

One system, five durations, three easings, nothing that overshoots. Full rules in the Motion section (`motion.md`). Reduced motion removes every entrance and pulse and hides nothing.

## Iconography

There is one mark: **Connected Nodes**, four accent circles joined by hairline connectors, no container. Top blue, right violet, bottom amber, left teal. Never redraw it; use the component or the masters in `assets/Logos`. There is no icon library. Arrows are the character →. The accordion `+` is two bars, one rotating.

## Imagery

- **A picture of a build is a real capture of the running app**, never a drawn mockup. Demo data is labelled and never quoted as a result.
- Flat, minimal, high contrast, a lot of empty space, precise shapes. No gradients, glow, drop shadows, 3D, neon, terminal looks or stock-photo look.
- No faces, client names, prices, phone numbers or invented figures in a picture.
- Pictures and clips for social are written by the media build tool, not by hand. See the Media section (`media.md`).

## Assets

`assets/Logos` holds the marks and lockups for every ground. `assets/Social` holds profile pictures, covers and the share image. `assets/Motion` holds the logo loops and the brand video. Each folder's README says which file goes where.
