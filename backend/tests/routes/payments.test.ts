import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Payments', () => {
  const makeToken = (role: string) => jwt.sign({ sub: 'u1', role }, process.env.JWT_SECRET || 'test-jwt-secret');
  let app: any;

  beforeAll(async () => {
    app = (await import('../../src/app')).default;
  });

  it('creates a simulated payment when no hedera details provided', async () => {
    const token = makeToken('donor');
    const res = await request(app)
      .post('/api/v1/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ amountOFD: 25 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('paymentId');
  });
});
