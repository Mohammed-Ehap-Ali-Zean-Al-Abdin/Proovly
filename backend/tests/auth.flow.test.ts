import request from 'supertest';
import app from '../src/app';

describe('Auth flow (signup -> login)', () => {
  it('signs up and logs in a user', async () => {
    const signupRes = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'secret123' });
  expect(signupRes.statusCode).toBe(201);
  // Accept either legacy { userId } or new { token, user: { id, ... } }
  const hasLegacyUserId = typeof signupRes.body?.userId === 'string';
  const hasNewUser = typeof signupRes.body?.user?.id === 'string' && typeof signupRes.body?.token === 'string';
  expect(hasLegacyUserId || hasNewUser).toBe(true);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'secret123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    // Basic token shape check (JWT has two dots)
    expect(typeof loginRes.body.token).toBe('string');
    expect(loginRes.body.token.split('.').length).toBe(3);
  });
});
