import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Data tokens routes', () => {
  const admin = () => jwt.sign({ sub: 'admin1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');
  const donor = () => jwt.sign({ sub: 'user1', role: 'donor' }, process.env.JWT_SECRET || 'test-jwt-secret');

  it('enforces admin and validates inputs', async () => {
    const app = (await import('../../src/app')).default;
    const r1 = await request(app).post('/api/v1/data-tokens').set('Authorization', `Bearer ${donor()}`).send({ name: 'D', symbol: 'DT', metadataUri: 'ipfs://x' });
    expect(r1.statusCode).toBe(403);
    const r2 = await request(app).post('/api/v1/data-tokens').set('Authorization', `Bearer ${admin()}`).send({});
    expect(r2.statusCode).toBe(400);
  });

  it('creates a token in simulated mode when Hedera is not configured', async () => {
    const app = (await import('../../src/app')).default;
    const r = await request(app).post('/api/v1/data-tokens').set('Authorization', `Bearer ${admin()}`).send({ name: 'Dataset', symbol: 'DT', metadataUri: 'ipfs://metadata' });
    expect(r.statusCode).toBe(201);
    expect(r.body).toHaveProperty('tokenId');
    expect(r.body).toHaveProperty('simulated', true);
  });
});
