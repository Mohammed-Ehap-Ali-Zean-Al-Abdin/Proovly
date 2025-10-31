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

async function loginAsDonor() {
  const email = `donor_${Date.now()}@test.com`
  const signup = await request(app)
    .post('/api/v1/auth/signup')
    .send({ email, password: 'pass1234', name: 'Donor', role: 'donor' })
  expect(signup.status).toBe(201)
  return signup.body.token as string
}

describe('Donation state machine', () => {
  it('enforces pending→funded→assigned→delivered transitions with role checks', async () => {
    const ngoToken = await loginAsNgo()
    const donorToken = await loginAsDonor()

    // Create donation (starts as pending)
    const create = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'donor1', campaignId: 'camp1', amountUSD: 50 })
    expect(create.status).toBe(201)
    const id = create.body.donationId

    // Donor cannot assign (pending→assigned forbidden, also role mismatch)
    const badAssign = await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${donorToken}`)
      .send({ status: 'assigned' })
    expect(badAssign.status).toBe(403)

    // NGO moves pending→funded (allowed for legacy/testing compatibility)
    const fund = await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'funded' })
    expect(fund.status).toBe(200)
    expect(fund.body.status).toBe('funded')

    // NGO moves funded→assigned
    const assign = await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'assigned', recipientId: 'recipient1' })
    expect(assign.status).toBe(200)
    expect(assign.body.status).toBe('assigned')

    // NGO delivers via deliver endpoint
    const deliver = await request(app)
      .post(`/api/v1/donations/${id}/deliver`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ privateKey: 'testkey123', mediaUrl: 'https://example.com/photo.jpg' })
    expect(deliver.status).toBe(200)
    expect(deliver.body.status).toBe('delivered')

    // Verify persisted fields
    const final = await request(app).get(`/api/v1/donations/${id}`)
    expect(final.body.status).toBe('delivered')
    expect(final.body.mediaUrl).toBe('https://example.com/photo.jpg')
    expect(final.body.deliveryProofHash).toBeTruthy()
  })

  it('rejects invalid state transitions', async () => {
    const ngoToken = await loginAsNgo()

    const create = await request(app)
      .post('/api/v1/donations')
      .send({ donorId: 'donor2', campaignId: 'camp2', amountUSD: 30 })
    const id = create.body.donationId

    // Try to jump pending→delivered
    const badJump = await request(app)
      .patch(`/api/v1/donations/${id}`)
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ status: 'delivered' })
    expect(badJump.status).toBe(403)
  })
})
