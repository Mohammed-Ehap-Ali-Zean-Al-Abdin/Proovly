import request from 'supertest';

jest.setTimeout(20000);

describe('Transactions routes', () => {
  let app: any;
  beforeAll(async () => {
    app = (await import('../../src/app')).default;
  });

  it('create and fetch transaction', async () => {
    const bad = await request(app).post('/api/v1/transactions').send({});
    expect(bad.statusCode).toBe(400);

    const res = await request(app)
      .post('/api/v1/transactions')
      .send({ userId: 'u1', amount: 12.5, currency: 'USD' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('transactionId');

    const id = res.body.transactionId;
    const got = await request(app).get(`/api/v1/transactions/${id}`);
    expect(got.statusCode).toBe(200);
    expect(got.body).toHaveProperty('userId', 'u1');
    expect(got.body).toHaveProperty('amount', 12.5);
  });
});
