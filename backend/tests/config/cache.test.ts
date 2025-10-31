import { cache } from '../../src/config/cache';

describe('cache fallback memory store', () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date() });
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('sets and gets without ttl', async () => {
    await cache.set('a', '1');
    const v = await cache.get('a');
    expect(v).toBe('1');
  });

  it('expires values with ttl', async () => {
    await cache.set('b', '2', 1);
    // jump time forward past ttl
    const now = Date.now();
    jest.setSystemTime(new Date(now + 1100));
    const v = await cache.get('b');
    expect(v).toBeNull();
  });
});
