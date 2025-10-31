import request from 'supertest';
import app from '../src/app';

describe('Auth - login failures', () => {
  it('rejects wrong password', async () => {
    const signup = { name: 'Wrong Pass', email: 'wrongpass@example.com', password: 'correct' };
    const s = await request(app).post('/api/v1/auth/signup').send(signup);
    expect(s.statusCode).toBe(201);

    const login = await request(app).post('/api/v1/auth/login').send({ email: signup.email, password: 'incorrect' });
    expect(login.statusCode).toBe(401);
  });
});
