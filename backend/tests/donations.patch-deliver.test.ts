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

describe('Donations - assign and deliver', () => {
  it('assigns a donation to a recipient and then marks delivered with privateKey', async () => {
    const ngoToken = await loginAsNgo()
    
    // create (pending status initially)
    const create = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'donor-x', campaignId: 'camp-1', amountUSD: 25 })
    expect(create.status).toBe(201)
    const id = create.body.donationId as string

    // Manually update to funded so we can test funded→assigned (skipping state machine for this legacy test)
    await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'funded' })

    // assign funded→assigned
    const patch = await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'assigned', recipientId: 'ngo-recipient-1' })
    expect(patch.status).toBe(200)
    expect(patch.body).toMatchObject({ status: 'assigned', recipientId: 'ngo-recipient-1' })

    // deliver (MVP private key)
    const deliver = await request(app)
      .post(`/api/v1/donations/${id}/deliver`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ privateKey: 'TEST-SECRET-KEY', mediaUrl: 'https://example.com/proof.jpg' })
    expect(deliver.status).toBe(200)
    expect(deliver.body).toMatchObject({ ok: true, status: 'delivered' })

    // verify status actually updated
    const getAfter = await request(app).get(`/api/v1/donations/${id}`)
    expect(getAfter.status).toBe(200)
    expect(getAfter.body.status).toBe('delivered')
  })

  it('rejects deliver without privateKey', async () => {
    const ngoToken = await loginAsNgo()
    const create = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'donor-y', campaignId: 'camp-2', amountUSD: 10 })
    const id = create.body.donationId as string

    const deliver = await request(app)
      .post(`/api/v1/donations/${id}/deliver`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({})
    expect(deliver.status).toBe(400)
  })
})
