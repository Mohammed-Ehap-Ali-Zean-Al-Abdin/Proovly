import request from 'supertest';

jest.setTimeout(20000);

describe('OFD records routes', () => {
  let app: any;
  beforeAll(async () => {
    app = (await import('../../src/app')).default;
  });

  it('create and fetch ofd record', async () => {
    const bad = await request(app).post('/api/v1/ofd-records').send({});
    expect(bad.statusCode).toBe(400);

    const res = await request(app)
      .post('/api/v1/ofd-records')
      .send({ type: 'mint', tokenId: 't1', amount: 100, fromAccount: 'a', toAccount: 'b' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ofdRecordId');

    const id = res.body.ofdRecordId;
    const got = await request(app).get(`/api/v1/ofd-records/${id}`);
    expect(got.statusCode).toBe(200);
    expect(got.body).toHaveProperty('tokenId', 't1');
  });
});
