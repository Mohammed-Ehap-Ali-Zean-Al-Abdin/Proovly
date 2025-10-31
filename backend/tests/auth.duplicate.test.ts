import request from 'supertest';
import app from '../src/app';

describe('Auth - duplicate signup', () => {
  it('rejects duplicate email on signup', async () => {
    const body = { name: 'Dup User', email: 'dup@example.com', password: 'pass123' };
    const res1 = await request(app).post('/api/v1/auth/signup').send(body);
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post('/api/v1/auth/signup').send(body);
    expect(res2.statusCode).toBe(409);
    expect(res2.body).toHaveProperty('error');
  });
});
