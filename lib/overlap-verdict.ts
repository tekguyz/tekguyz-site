/**
 * The launcher-overlap discriminator, as one pure function.
 *
 * This exists because the positive control and the class partition must run
 * the SAME rule. When the control computed its own two-line version, it proved
 * the intersection maths could fire and proved nothing about the discriminator
 * — which is the entire point of having a control.
 *
 * The rule it replaces was "does the overlap survive to maximum scroll",
 * measured without ever asking whether the launcher was presented. See
 * `docs/superpowers/specs/2026-08-11-launcher-overlap-partition-design.md`.
 */

export interface Sample {
  scrollY: number;
  launcherPresented: boolean;
  coveredFraction: number;
}

export type Verdict = 'static' | 'transient' | 'none';

/**
 * An overlap only counts where the launcher is opaque and hit-testable. A
 * yielded launcher still has a rect, and intersecting against it is how the
 * frozen 143/44/99.6% baseline came to include pairs the user could never
 * have been obstructed by.
 */
export function admittedSamples(samples: Sample[]): Sample[] {
  return samples.filter((x) => x.launcherPresented && x.coveredFraction > 0);
}

/**
 * `transient` REQUIRES positive evidence of a clearing scroll position — a
 * sample where the overlap is gone or the launcher has yielded. A single
 * admitted sample with nothing clearing it returns `static`, deliberately:
 * assuming transience without a clearing position is exactly the error that
 * produced "all 143 are transient".
 */
export function verdictFor(
  samples: Sample[],
  maxScrollY: number,
  opts: { stateInduced?: boolean } = {},
): Verdict {
  const admitted = admittedSamples(samples);
  if (admitted.length === 0) return 'none';

  /* Spec §3 defines TWO static axes, and scroll is only one of them. An
     overlap produced by a discrete state — an expanded accordion, an open
     drawer — persists at rest whatever the scroll position does, which is
     exactly what D-02 was. Without this the scroll axis alone would call D-02
     transient the moment a scroll sample cleared it. */
  if (opts.stateInduced) return 'static';

  const atMax = admitted.some((x) => Math.abs(x.scrollY - maxScrollY) <= 2);
  if (atMax) return 'static';

  const clears = samples.some((x) => x.coveredFraction === 0 || !x.launcherPresented);
  return clears ? 'transient' : 'static';
}

/**
 * Roll several viewports up into one class verdict. Disagreement is `partial`,
 * never the more favourable of the two — CLAUDE.md's hard rule that a
 * partially resolved finding is never summarised as resolved.
 */
export function rollUp(perViewport: Verdict[]): Verdict | 'partial' {
  const real = perViewport.filter((v) => v !== 'none');
  if (real.length === 0) return 'none';
  const unique = [...new Set(real)];
  return unique.length === 1 ? unique[0] : 'partial';
}
