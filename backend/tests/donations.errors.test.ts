import request from 'supertest'
import app from '../src/app'

async function loginAsNgo() {
  const email = `ngo_${Date.now()}@test.com`
  const signup = await request(app)
    .post('/api/v1/auth/signup')
    .send({ email, password: 'pass1234', name: 'NGO', role: 'ngo' })
  expect(signup.status).toBe(201)
  return signup.body.token as string
}

describe('Donations - error paths', () => {
  it('returns 400 when creating with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/donations')
      .send({ campaignId: 'c-missing', amountUSD: 10 })
    expect(res.status).toBe(400)
  })

  it('returns 404 when deleting non-existent id', async () => {
    const res = await request(app)
      .delete('/api/v1/donations/000000000000000000000000')
    expect(res.status).toBe(404)
  })

  it('returns 404 when patching non-existent id', async () => {
    const ngoToken = await loginAsNgo()
    const res = await request(app)
      .patch('/api/v1/donations/000000000000000000000000')
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'assigned' })
    expect(res.status).toBe(404)
  })
})
