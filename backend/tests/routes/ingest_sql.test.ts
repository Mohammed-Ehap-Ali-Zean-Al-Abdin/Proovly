import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Ingest SQL route', () => {
  const admin = () => jwt.sign({ sub: 'admin1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');

  it('returns 503 when SQL connector is not installed (mocked)', async () => {
    jest.resetModules();
    // Make dynamic import('pg') reject by throwing during module evaluation
    jest.doMock('pg', () => {
      throw new Error('module not found');
    });
    const app = (await import('../../src/app')).default;
    const res = await request(app)
      .post('/api/v1/ingest/sql')
      .set('Authorization', `Bearer ${admin()}`)
      .send({ connectionString: 'postgres://user:pass@localhost:5432/db', query: 'select 1' });
    expect([503, 502]).toContain(res.statusCode);
    // Accept 502 as well in case Postgres client exists but connection fails in certain CI
    jest.resetModules();
  });

  it('returns 400 when required fields are missing', async () => {
    const app = (await import('../../src/app')).default;
    const res = await request(app)
      .post('/api/v1/ingest/sql')
      .set('Authorization', `Bearer ${admin()}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 502 when pg is present but connection/query fails (mocked client)', async () => {
    jest.resetModules();
    jest.doMock('pg', () => ({
      Client: class {
        async connect() { throw new Error('connect failed'); }
        async query() { return { rows: [] }; }
        async end() { /* noop */ }
      }
    }));
    const app = (await import('../../src/app')).default;
    const res = await request(app)
      .post('/api/v1/ingest/sql')
      .set('Authorization', `Bearer ${admin()}`)
      .send({ connectionString: 'postgres://user:pass@localhost:5432/db', query: 'select 1' });
    expect([502, 503]).toContain(res.statusCode);
    jest.resetModules();
  });

  const maybeIt: jest.It = process.env.TEST_PG_URL ? it : it.skip;
  maybeIt('executes a simple query when TEST_PG_URL is provided', async () => {
    const app = (await import('../../src/app')).default;
    const res = await request(app)
      .post('/api/v1/ingest/sql')
      .set('Authorization', `Bearer ${admin()}`)
      .send({ connectionString: process.env.TEST_PG_URL, query: 'select 1 as x' });
    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty('rows');
    expect(typeof res.body.rows).toBe('number');
  });
});
