import { describe, it, expect } from 'vitest';
import { admittedSamples, verdictFor, rollUp, type Sample } from './overlap-verdict';

const s = (scrollY: number, launcherPresented: boolean, coveredFraction: number): Sample => ({
  scrollY,
  launcherPresented,
  coveredFraction,
});

describe('admittedSamples', () => {
  it('drops samples where the launcher is not presented', () => {
    expect(admittedSamples([s(0, false, 0.9), s(100, true, 0.5)])).toEqual([s(100, true, 0.5)]);
  });

  it('drops samples with no overlap even when the launcher is presented', () => {
    expect(admittedSamples([s(0, true, 0)])).toEqual([]);
  });

  it('admits nothing from an empty list', () => {
    expect(admittedSamples([])).toEqual([]);
  });
});

describe('verdictFor', () => {
  it('is none when nothing is admitted', () => {
    expect(verdictFor([s(0, false, 0.9)], 1000)).toBe('none');
  });

  it('is static when an admitted overlap survives to maximum scroll', () => {
    expect(verdictFor([s(1000, true, 0.6)], 1000)).toBe('static');
  });

  it('tolerates a 2px rounding slop at maximum scroll', () => {
    expect(verdictFor([s(999, true, 0.6)], 1000)).toBe('static');
  });

  it('is transient when a later sample clears the overlap', () => {
    expect(verdictFor([s(400, true, 0.6), s(800, true, 0)], 1000)).toBe('transient');
  });

  it('is transient when a later sample yields the launcher', () => {
    expect(verdictFor([s(400, true, 0.6), s(800, false, 0.6)], 1000)).toBe('transient');
  });

  it('is static when one admitted sample has no clearing position at all', () => {
    // Assuming transience without evidence is the error that produced
    // "all 143 are transient". Refuse it.
    expect(verdictFor([s(400, true, 0.6)], 1000)).toBe('static');
  });

  it('is static for a state-induced overlap even when a scroll sample clears it', () => {
    // D-02's shape: an expanded accordion under the launcher. It persists at
    // rest, so the scroll axis must not be allowed to call it transient.
    expect(verdictFor([s(400, true, 0.6), s(800, true, 0)], 1000, { stateInduced: true })).toBe(
      'static',
    );
  });

  it('still returns none for a state-induced case with nothing admitted', () => {
    // stateInduced must not manufacture an overlap that was never there.
    expect(verdictFor([s(400, false, 0.6)], 1000, { stateInduced: true })).toBe('none');
  });

  it('ignores a yielded launcher at maximum scroll', () => {
    // Presented=false at max scroll is not an admitted overlap, so this is
    // transient on the strength of the clearing sample, not static.
    expect(verdictFor([s(400, true, 0.6), s(1000, false, 0.9)], 1000)).toBe('transient');
  });
});

describe('rollUp', () => {
  it('is partial when viewports disagree', () => {
    expect(rollUp(['static', 'transient'])).toBe('partial');
  });

  it('collapses agreement', () => {
    expect(rollUp(['transient', 'transient'])).toBe('transient');
  });

  it('ignores none when something else is present', () => {
    expect(rollUp(['none', 'transient'])).toBe('transient');
  });

  it('is none when every viewport is none', () => {
    expect(rollUp(['none', 'none'])).toBe('none');
  });

  it('never resolves a disagreement to the more favourable verdict', () => {
    expect(rollUp(['none', 'static', 'transient'])).toBe('partial');
  });
});
