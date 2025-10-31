import request from 'supertest';
import app from '../src/app';

describe('Donations - get by id', () => {
  it('retrieves a donation by id and handles not found', async () => {
    const createRes = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'u2', campaignId: 'c2', amountUSD: 75 });
    expect(createRes.statusCode).toBe(201);
    const donationId = createRes.body.donationId;
    expect(donationId).toBeTruthy();

    const getRes = await request(app).get(`/api/v1/donations/${donationId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('_id');

    const notFound = await request(app).get('/api/v1/donations/000000000000000000000000');
    expect(notFound.statusCode).toBe(404);
  });
});
