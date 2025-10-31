import request from 'supertest';
import app from '../src/app.js';
describe('Donations API', () => {
    it('creates donation and returns id', async () => {
        const res = await request(app)
            .post('/api/v1/donations')
            .send({ donorId: 'u1', campaignId: 'c1', amountUSD: 50 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('donationId');
    });
});
//# sourceMappingURL=donations.test.js.map