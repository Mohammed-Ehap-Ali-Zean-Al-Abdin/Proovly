import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Analytics contract routes', () => {
  const admin = () => jwt.sign({ sub: 'admin1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');
  const donor = () => jwt.sign({ sub: 'user1', role: 'donor' }, process.env.JWT_SECRET || 'test-jwt-secret');

  it('requires admin and validates input', async () => {
    const app = (await import('../../src/app')).default;
    // donor forbidden
    const r1 = await request(app).post('/api/v1/analytics/contract/put-hash').set('Authorization', `Bearer ${donor()}`).send({ key: 'd1', hash: 'h1' });
    expect(r1.statusCode).toBe(403);
    // missing fields
    const r2 = await request(app).post('/api/v1/analytics/contract/put-hash').set('Authorization', `Bearer ${admin()}`).send({});
    expect(r2.statusCode).toBe(400);
    // missing key on get
    const r3 = await request(app).get('/api/v1/analytics/contract/get-hash').set('Authorization', `Bearer ${admin()}`);
    expect(r3.statusCode).toBe(400);
  });

  it('simulates put/get when HSCS not configured', async () => {
    const app = (await import('../../src/app')).default;
    const put = await request(app).post('/api/v1/analytics/contract/put-hash').set('Authorization', `Bearer ${admin()}`).send({ key: 'k1', hash: 'h1' });
    expect(put.statusCode).toBe(200);
    expect(put.body).toHaveProperty('simulated', true);
    const get = await request(app).get('/api/v1/analytics/contract/get-hash').set('Authorization', `Bearer ${admin()}`).query({ key: 'k1' });
    expect(get.statusCode).toBe(200);
    expect(get.body).toHaveProperty('simulated', true);
  });
});
