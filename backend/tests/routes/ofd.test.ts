import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('OFD routes', () => {
  const makeToken = (role: string) => jwt.sign({ sub: 'u1', role }, process.env.JWT_SECRET || 'test-jwt-secret');

  it('mint - requires auth and admin role', async () => {
    jest.resetModules();
    // Mock hedera to return null (not configured)
    jest.doMock('../../src/services/hedera', () => ({ hederaClient: () => null, mintToken: jest.fn() }));
    const app = (await import('../../src/app')).default;

    // no auth
    const res1 = await request(app).post('/api/v1/ofd/mint').send({ tokenId: 't', amount: 10 });
    expect(res1.statusCode).toBe(401);

    // non-admin
    const token = makeToken('donor');
    const res2 = await request(app).post('/api/v1/ofd/mint').set('Authorization', `Bearer ${token}`).send({ tokenId: 't', amount: 10 });
    expect(res2.statusCode).toBe(403);

    // admin but missing fields
    const admin = makeToken('admin');
    const res3 = await request(app).post('/api/v1/ofd/mint').set('Authorization', `Bearer ${admin}`).send({});
    expect(res3.statusCode).toBe(400);

    // admin but hedera not configured -> 503
    const res4 = await request(app).post('/api/v1/ofd/mint').set('Authorization', `Bearer ${admin}`).send({ tokenId: 't', amount: 1 });
    expect(res4.statusCode).toBe(503);
  }, 15000);

  it('mint - success when hedera available', async () => {
    jest.resetModules();
    const mintToken = jest.fn(async () => ({ status: { toString: () => 'SUCCESS' } }));
    const hedera = { client: {} };
    jest.doMock('../../src/services/hedera', () => ({ hederaClient: () => hedera, mintToken }));
    const app = (await import('../../src/app')).default;
    const token = jwt.sign({ sub: 'u1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');

    const res = await request(app).post('/api/v1/ofd/mint').set('Authorization', `Bearer ${token}`).send({ tokenId: '0.0.123', amount: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'SUCCESS');
    expect(res.body).toHaveProperty('tokenId', '0.0.123');
    expect(mintToken).toHaveBeenCalled();
  }, 15000);

  it('transfer - requires fields and hedera configured', async () => {
    jest.resetModules();
    jest.doMock('../../src/services/hedera', () => ({ hederaClient: () => null, transferToken: jest.fn() }));
    const app = (await import('../../src/app')).default;
    const token = jwt.sign({ sub: 'u1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');

    const missing = await request(app).post('/api/v1/ofd/transfer').set('Authorization', `Bearer ${token}`).send({});
    expect(missing.statusCode).toBe(400);

    const res = await request(app).post('/api/v1/ofd/transfer').set('Authorization', `Bearer ${token}`).send({ tokenId: 't', fromAccount: 'a', toAccount: 'b', amount: 1 });
    expect(res.statusCode).toBe(503);
  }, 15000);

  it('transfer - success when hedera available', async () => {
    jest.resetModules();
    const transferToken = jest.fn(async () => ({ status: { toString: () => 'OK' } }));
    jest.doMock('../../src/services/hedera', () => ({ hederaClient: () => ({}), transferToken }));
    const app = (await import('../../src/app')).default;
    const token = jwt.sign({ sub: 'u1', role: 'admin' }, process.env.JWT_SECRET || 'test-jwt-secret');

    const res = await request(app).post('/api/v1/ofd/transfer').set('Authorization', `Bearer ${token}`).send({ tokenId: 't', fromAccount: 'a', toAccount: 'b', amount: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(transferToken).toHaveBeenCalled();
  }, 15000);
});
