import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Ingest routes', () => {
  const makeToken = (role: string) => jwt.sign({ sub: 'u1', role }, process.env.JWT_SECRET || 'test-jwt-secret');

  it('csv upload requires auth and file', async () => {
    jest.resetModules();
    const app = (await import('../../src/app')).default;

    const res1 = await request(app).post('/api/v1/ingest/csv').send({});
    expect(res1.statusCode).toBe(401);

    const token = makeToken('ngo');
    const res2 = await request(app).post('/api/v1/ingest/csv').set('Authorization', `Bearer ${token}`).send();
    expect(res2.statusCode).toBe(400);
  });

  it('csv upload accepts file and returns accepted with rows count', async () => {
    jest.resetModules();
    const app = (await import('../../src/app')).default;
    const token = makeToken('admin');
    const csv = 'name,amount\nA,10\nB,20\n';

    const res = await request(app)
      .post('/api/v1/ingest/csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from(csv), { filename: 'test.csv', contentType: 'text/csv' });

    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty('jobId');
    expect(res.body).toHaveProperty('rows', 2);
  });
});
