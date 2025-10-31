import request from 'supertest';
import app from '../src/app';

describe('Donations API', () => {
  it('creates donation and returns id', async () => {
    const res = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'u1', campaignId: 'c1', amountUSD: 50 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('donationId');
  });

  it('lists donations', async () => {
    // Create a donation first
    await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'u1', campaignId: 'c1', amountUSD: 50 });

    // List all donations
    const res = await request(app).get('/api/v1/donations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('filters donations by userId', async () => {
    await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'u2', campaignId: 'c1', amountUSD: 75 });

    const res = await request(app).get('/api/v1/donations?userId=u2');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((d: any) => d.donorId === 'u2')).toBe(true);
  });
});


