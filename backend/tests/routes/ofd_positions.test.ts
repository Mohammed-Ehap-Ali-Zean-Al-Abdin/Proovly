import request from 'supertest';
import jwt from 'jsonwebtoken';
import { CollateralAssetModel } from '../../src/models/CollateralAsset';

jest.setTimeout(15000);

describe('OFD positions', () => {
  const makeToken = (role: string) => jwt.sign({ sub: 'u1', role }, process.env.JWT_SECRET || 'test-jwt-secret');
  let app: any;

  beforeAll(async () => {
    app = (await import('../../src/app')).default;
    await CollateralAssetModel.create({ symbol: 'HBAR', valueUSDPerUnit: 10, minCollateralRatio: 1.5 });
  });

  it('open, deposit, mint within CR, deny over-mint, repay, withdraw', async () => {
    const token = makeToken('donor');

    // open
    const open = await request(app)
      .post('/api/v1/ofd/positions')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'userA', collateralSymbol: 'HBAR' });
    expect(open.statusCode).toBe(201);
    const id = open.body.positionId;

    // deposit 100 HBAR -> value = 100*10 = 1000 USD
    const dep = await request(app)
      .post(`/api/v1/ofd/positions/${id}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 });
    expect(dep.statusCode).toBe(200);

    // mint 500 OFD -> CR = 1000/500 = 2.0 >= 1.5 OK
    const m1 = await request(app)
      .post(`/api/v1/ofd/positions/${id}/mint`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500 });
    expect(m1.statusCode).toBe(200);
    expect(m1.body).toHaveProperty('debtOFD', 500);

    // try to mint 300 more -> would be debt 800, CR=1.25 < 1.5 -> reject
    const m2 = await request(app)
      .post(`/api/v1/ofd/positions/${id}/mint`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 300 });
    expect(m2.statusCode).toBe(400);

    // repay 200 -> debt 300
    const r1 = await request(app)
      .post(`/api/v1/ofd/positions/${id}/repay`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 200 });
    expect(r1.statusCode).toBe(200);
    expect(r1.body).toHaveProperty('debtOFD', 300);

    // withdraw 50 HBAR -> new collateral 50 -> value 500, CR=500/300=1.66 OK
    const w1 = await request(app)
      .post(`/api/v1/ofd/positions/${id}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 50 });
    expect(w1.statusCode).toBe(200);

    // withdraw 100 -> would drop to value 0 -> reject if debt > 0
    const w2 = await request(app)
      .post(`/api/v1/ofd/positions/${id}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 });
    expect(w2.statusCode).toBe(400);

    // fetch and assert
    const got = await request(app)
      .get(`/api/v1/ofd/positions/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(got.statusCode).toBe(200);
    expect(got.body).toHaveProperty('collateralSymbol', 'HBAR');
  });
});
