import { afterEach, describe, expect, it, vi } from 'vitest';

import { work } from '@/content/work';
import { getStatus } from './status';

/**
 * The regression these pin (2026-09-08): every demo here is a scale-to-zero
 * deployment, so the first request after an idle window pays a cold start the
 * second one does not. A single-attempt check with a 3s budget reported a
 * healthy demo as "Temporarily unreachable", and each route then froze that
 * wrong answer for its whole revalidate window — which is how home and /work
 * came to disagree about the same demo at the same moment.
 */

const slug = work[0]!.slug;

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(...outcomes: Array<'ok' | 'fail' | 'error'>) {
  const fetchMock = vi.fn(async () => {
    const outcome = outcomes.shift() ?? 'fail';
    if (outcome === 'error') throw new DOMException('TimeoutError', 'TimeoutError');
    return { ok: outcome === 'ok' } as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('getStatus', () => {
  it('reports live when the first knock answers', async () => {
    const fetchMock = stubFetch('ok');
    expect((await getStatus(slug)).status).toBe('live');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a cold start that times out, and reports live on the warm knock', async () => {
    const fetchMock = stubFetch('error', 'ok');
    expect((await getStatus(slug)).status).toBe('live');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries a non-ok response too — a cold host can answer 502 before it answers 200', async () => {
    const fetchMock = stubFetch('fail', 'ok');
    expect((await getStatus(slug)).status).toBe('live');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports unreachable only after both attempts fail', async () => {
    const fetchMock = stubFetch('error', 'error');
    expect((await getStatus(slug)).status).toBe('unreachable');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives a cold start more than 3 seconds — the measured cold knock was 4.7s', async () => {
    const timeouts: number[] = [];
    const spy = vi.spyOn(AbortSignal, 'timeout');
    spy.mockImplementation((ms: number) => {
      timeouts.push(ms);
      return new AbortController().signal;
    });
    stubFetch('ok');
    await getStatus(slug);
    spy.mockRestore();
    expect(timeouts[0]).toBeGreaterThanOrEqual(8000);
  });

  it('an unknown slug is unreachable without touching the network', async () => {
    const fetchMock = stubFetch('ok');
    expect((await getStatus('no-such-demo')).status).toBe('unreachable');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
