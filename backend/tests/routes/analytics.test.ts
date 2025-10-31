import request from 'supertest';

jest.setTimeout(15000);

describe('Analytics routes', () => {
  it('summary returns expected shape and respects query', async () => {
    const app = (await import('../../src/app')).default;
    const res = await request(app).get('/api/v1/analytics/summary').query({ from: '2025-01-01', to: '2025-01-31', region: 'eu' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalDonations');
    expect(res.body).toHaveProperty('byRegion');
    expect(Array.isArray(res.body.byRegion)).toBe(true);
    expect(res.body).toHaveProperty('chainVerifiedPct');
    expect(res.body.from).toBe('2025-01-01');
    expect(res.body.to).toBe('2025-01-31');
  });

  it('generate-daily-hash requires admin', async () => {
    const jwt = await import('jsonwebtoken');
    const app = (await import('../../src/app')).default;
    const token = jwt.sign({ sub: 'u1', role: 'donor' }, process.env.JWT_SECRET || 'test-jwt-secret');
    const res1 = await request(app).post('/api/v1/analytics/generate-daily-hash').set('Authorization', `Bearer ${token}`);
    expect(res1.statusCode).toBe(403);

    const admin = jwt.sign({ sub: 'u1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');
    const res2 = await request(app).post('/api/v1/analytics/generate-daily-hash').set('Authorization', `Bearer ${admin}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toHaveProperty('hash');
    expect(typeof res2.body.hash).toBe('string');
    expect(res2.body.hash.length).toBeGreaterThanOrEqual(64);
  });
});
