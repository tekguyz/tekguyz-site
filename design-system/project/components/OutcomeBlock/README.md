# OutcomeBlock

The dot, label and body triplet that reports the result of a lead-capture attempt.

**Static rendition.** The shipped component is the contents only, not the wrapper.

## When to use

After a form submit or a concierge capture, to say what happened. Three call sites render it: the contact form's success state, and the concierge's captured and error states.

## Anatomy

A 6px dot in `tg-success` or `tg-error`, gap `space-2`, label at 14px / 1.55 with `0.04em` tracking and weight 600 in `tg-fg`. Body 14px after a 14px gap, in `tg-secondary`. The contact form runs its body at `body` instead; the concierge panel runs one step down.

## Rules

- **Colour never carries the meaning.** The dot is the only coloured thing; the label beside it says the same thing in words. Remove the colour and the block still reads.
- **It ships the contents, not the wrapper.** The three wrappers genuinely differ — the contact form's carries the focus target that announces the success, the concierge's carries the rule that separates the outcome from the message list — and folding those into props trades one duplication for a wider, vaguer surface.
- **Announcing a success is done by moving focus, not by a live region alone.** A submit unmounts the form, so the focused control goes with it and focus falls to `<body>`. The success block is focusable programmatically and receives `.focus()`; the scroll into view is a side effect, not the fix.
- An unreachable or failed state gets no emphasis beyond its dot — the site does not shout at a visitor about its own plumbing.

## What the consumer provides

The tone, the label, the message, and the wrapper with whatever focus and live-region behaviour that call site needs.
