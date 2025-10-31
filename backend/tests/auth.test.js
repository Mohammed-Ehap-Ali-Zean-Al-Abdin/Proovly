import request from 'supertest';
import app from '../src/app.js';
describe('Auth API', () => {
    it('rejects signup without fields', async () => {
        const res = await request(app).post('/api/v1/auth/signup').send({});
        expect(res.statusCode).toBe(400);
    });
});
//# sourceMappingURL=auth.test.js.map