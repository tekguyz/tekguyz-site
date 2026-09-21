# Cascade rules

No linter catches anything on this page. Each rule below cost a real defect, and each one looks correct in the markup while doing nothing.

## Two utilities of the same property have no winner, only a source order

`motion-reduce:lg:static` does not beat `lg:sticky` — same property, same specificity. **No accessibility floor may rest on that.** A pin that must be releasable is a real rule in a media query, overridden by a `!important` declaration below it. To force such a declaration back on and *measure* it, your inline style needs `!important` too, or you measure the unchanged element.

## A `transition` shorthand resets every transition property

Later rules win. The entrance transition and the hover transition sit in different rules, so anything carrying both classes needs its transitions declared together, once. This silently cancelled entrances while the classes looked correctly wired.

For the same reason, the entrance rise uses `translate` and the hover lift uses `transform`. They are independent properties, so the two durations compose instead of fighting over one value.

## A class merger drops the earlier of two same-group utilities

`text-*` sets line height as well as size, so a later font-size class is treated as conflicting and an earlier `leading-*` is dropped **before it reaches the DOM**. Put the line height on the font-size declaration itself. The same trap fires for any pair of same-group utilities merged from two different strings.

## An unlayered declaration beats a layered utility regardless of source order

The grid's `gap` shorthand is unlayered, so no `gap-y-*` utility can ever change it — two rows declared one and it never once applied. **Any value that has to beat an unlayered rule goes in the stylesheet too, unlayered.**

Read the other way round: the eyebrow class is deliberately *layered*, so call sites keep winning on colour and margin with ordinary utilities. Do not move it out of the layer to "make it stronger" — it would repaint two thirds of the eyebrows on the site.

## A grid placement never ships as an inline style

An inline placement can only be beaten by `!important`, and every placement needs a per-band value: 12 tracks, 8 below 1024px, 1 below 768px. **A 12-column span left to run on the 8-track grid does not error — it creates implicit tracks and collapses the explicit ones.** Measure the resolved template at 768px and confirm 8 explicit tracks and 0 implicit ones.

## Alternating rows alternate by column, never by DOM order

With sparse auto-flow the placement cursor never moves backwards, so an item whose column start sits behind it drops to the next row — which is why both halves are pinned to the same row. Below 768px the grid is one column and **source order is the entire layout**, so alternating by DOM order ships two posters back to back. DOM order is reading order and tab order at every width, which is why the fix is never an `order` utility.

The narrow reset releases the row and the column in the **same block**, so the two can never disagree at the fractional widths where neither breakpoint query matches.

## Two declarations that have to agree get the same query, never the complementary one

The rule that sheds the rhythm above a closing CTA and the CTA's own padding both use `min-width: 768px`. Complementary queries both fail at fractional widths.

## Every page component returns a single root element, never a bare fragment

The router scrolls the new segment into view on each client-side transition. A multi-child fragment routes that through every top-level child, so the page lands wherever the surviving call left it. Keep structured-data scripts inside the wrapper — a zero-box element cannot be scrolled to, which breaks the intended fallback.

## Branches of a multi-step form need distinct keys

Without them the framework reconciles the two steps in place and reuses the same uncontrolled inputs — step one's name and email become step two's phone and website, values included. It looks exactly like browser autofill, and it is not.

## A tap target is verified by hit-testing, never by a rect

A bounding rect cannot see a pseudo-element overlay, so a rect-based check calls every correctly-fixed target a failure. Probe the point instead. Two ways that probe falsely passes: it only hit-tests the visible viewport, so scroll each element in first; and an **ancestor** owning the probe point means the tap is falling through to the container — counting that as a pass reports zero failures site-wide.
