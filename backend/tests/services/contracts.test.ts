import { putAnalyticsHash, getAnalyticsHash } from '../../src/services/contracts';

describe('contracts service (HSCS helpers)', () => {
  it('simulates when no client/contractId', async () => {
    const put = await putAnalyticsHash(null as any, undefined as any, 'k', 'h');
    expect(put.simulated).toBe(true);
    const get = await getAnalyticsHash(null as any, undefined as any, 'k');
    expect(get.simulated).toBe(true);
    expect(get.hash).toBeNull();
  });
});
