describe('hedera service (unit)', () => {
  it('computes correct sha256', async () => {
    // isolate module so env parsing does not affect other tests
    const mod = await import('../../src/services/hedera');
    const out = mod.sha256('hello');
    expect(out).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('returns mocked tx/mirror when client or topic missing (default testnet)', async () => {
    jest.resetModules();
    jest.doMock('../../src/config/env', () => ({ env: { HEDERA_NETWORK: 'testnet' } }));
    const { writeHcsMessage: write } = await import('../../src/services/hedera');
    const { txId, mirrorUrl } = await write(null, undefined, { foo: 'bar' });
    expect(txId.startsWith('mock-')).toBe(true);
    expect(mirrorUrl).toMatch(/mirrornode\.hedera\.com\/api\/v1\/transactions\//);
  });

  it('uses custom mirror base from env when provided', async () => {
    jest.resetModules();
    jest.doMock('../../src/config/env', () => ({ env: { HEDERA_NETWORK: 'testnet', HEDERA_MIRROR_BASE_URL: 'https://example.mirror.test' } }));
    const { writeHcsMessage: write } = await import('../../src/services/hedera');
    const { txId, mirrorUrl } = await write(null, undefined, { x: 1 });
    expect(txId.startsWith('mock-')).toBe(true);
    expect(mirrorUrl).toContain('https://example.mirror.test/api/v1/transactions/');
  });
});
