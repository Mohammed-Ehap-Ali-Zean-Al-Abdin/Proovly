import request from 'supertest'
import app from '../../src/app'

async function loginAsNgo() {
  const email = `ngo_${Date.now()}@test.com`
  const signup = await request(app)
    .post('/api/v1/auth/signup')
    .send({ email, password: 'pass1234', name: 'NGO', role: 'ngo' })
  expect(signup.status).toBe(201)
  return signup.body.token as string
}

describe('POST /api/v1/cloudinary/signature', () => {
  it('returns signature params for authenticated NGO (or 503 if Cloudinary not configured)', async () => {
    const token = await loginAsNgo()
    const res = await request(app)
      .post('/api/v1/cloudinary/signature')
      .set('Authorization', `Bearer ${token}`)
    
    // Accept either 200 (Cloudinary configured) or 503 (not configured in test env)
    if (res.status === 200) {
      expect(res.body).toHaveProperty('signature')
      expect(res.body).toHaveProperty('timestamp')
      expect(res.body).toHaveProperty('cloudName')
      expect(res.body).toHaveProperty('apiKey')
      expect(res.body).toHaveProperty('folder')
      expect(typeof res.body.signature).toBe('string')
      expect(typeof res.body.timestamp).toBe('number')
    } else {
      expect(res.status).toBe(503)
      expect(res.body.error).toBe('Cloudinary not configured')
    }
  })

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/v1/cloudinary/signature')
    expect(res.status).toBe(401)
  })
})
